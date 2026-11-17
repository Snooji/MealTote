// MealTote Backend (admin.html): site analytics, donation methods shown on the support page, and a hand-kept log of gifts received.
// Only ADMIN_EMAIL gets in. That check here only decides what to draw; firestore.rules is what actually enforces it.
import { firebaseConfig } from "./firebase-config.js";

const ADMIN_EMAIL = "starsidecollective@gmail.com";
const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
// the three Firebase modules download in parallel
const [{ initializeApp }, { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged }, { getFirestore, doc, getDoc, setDoc, collection, addDoc, getDocs, deleteDoc, query, orderBy, limit, serverTimestamp, documentId, where, deleteField, getCountFromServer, Timestamp }] = await Promise.all([import(`${SDK}/firebase-app.js`), import(`${SDK}/firebase-auth.js`), import(`${SDK}/firebase-firestore.js`)]);

// opened inside the app (Settings → Open the Backend): the app draws the header and close button
if (new URLSearchParams(location.search).has("embed")) document.documentElement.classList.add("embed");
const host = location.hostname, ownDomain = host === "mealtote.com" || host.endsWith(".web.app") || host.endsWith(".firebaseapp.com");
const app = initializeApp(ownDomain ? { ...firebaseConfig, authDomain: host } : firebaseConfig);
const auth = getAuth(app), db = getFirestore(app);
const configRef = doc(db, "site", "donations"), logCol = collection(db, "donations");

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = n => "$" + (Math.round((n || 0) * 100) / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const toast = msg => { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2400); };
const T = DONATE.TYPES;

let user = null, cfg = null, log = [], tab = "analytics", dirty = false, stats = null, statsErr = "", range = 30, subs = [], community = {}, photoErr = "", rsubs = [], liveRecipes = [], recipeList = null, pq = "", pf = "all", pshow = 60;

onAuthStateChanged(auth, async u => {
  user = u; $("#who").innerHTML = "";
  if (!u) return gate("Sign in with your MealTote admin Google account.", true);
  $("#who").append(btn("Sign out", () => signOut(auth)));
  if (u.email === ADMIN_EMAIL) { try { localStorage.setItem("mt-admin", "1"); } catch (e) {} } // leave this device out of the analytics
  if (u.email !== ADMIN_EMAIL || !u.emailVerified) return gate(`You're signed in as ${esc(u.email)}. The Backend is only for the MealTote admin.`, false);
  try {
    // the first screen (Analytics) needs only these, fetched together; everything else loads behind it
    const [snap] = await Promise.all([getDoc(configRef), loadLog(), loadStats(), loadIndex()]);
    cfg = DONATE.normalize(snap.exists() ? snap.data() : DONATE.DEFAULT_DONATIONS);
    if (!snap.exists()) dirty = true; // first visit: nothing saved yet, so the support page is using the defaults
    draw();
    loadOnline(); clearInterval(onlineT); onlineT = setInterval(loadOnline, 30000);
    loadCounts().then(() => { if (!["methods"].includes(tab)) draw(); });
  } catch (e) {
    gate("Couldn't load the Backend: " + esc(e.code || e.message) + ". If you just changed firestore.rules, deploy them with <code>firebase deploy --only firestore:rules</code>.", false);
  }
});

function gate(html, showSignIn) {
  const m = $("#app"); m.innerHTML = `<div class="gate"><div class="eyebrow">MealTote Backend</div><h2>Admins only</h2><p class="note">${html}</p></div>`;
  if (showSignIn) m.firstChild.append(btn("Sign in with Google", async () => {
    const p = new GoogleAuthProvider(); p.setCustomParameters({ prompt: "select_account" });
    try { await signInWithPopup(auth, p); } catch (e) { if (e.code === "auth/popup-blocked") signInWithRedirect(auth, p); else if (e.code !== "auth/popup-closed-by-user") toast("Sign-in didn't finish: " + e.code); }
  }, "btn primary"));
}
function btn(label, onclick, cls = "btn small") { const b = document.createElement("button"); b.type = "button"; b.className = cls; b.textContent = label; b.onclick = onclick; return b; }

async function loadLog() {
  const q = await getDocs(query(logCol, orderBy("at", "desc"), limit(1000)));
  log = q.docs.map(d => ({ id: d.id, ...d.data() }));
}
function totals() {
  const mk = DONATE.monthKey(), t = { all: 0, month: 0, n: log.length, who: new Set(), by: {} };
  for (const g of log) {
    t.all += g.amount; if (DONATE.monthKey(new Date(g.at)) === mk) t.month += g.amount;
    if (g.who) t.who.add(g.who.trim().toLowerCase());
    t.by[g.method] = (t.by[g.method] || 0) + g.amount;
  }
  return t;
}

// the support page shows this month's total under the goal, so keep it in step with the log
async function syncRaised() {
  const raised = Math.round(totals().month * 100) / 100, month = DONATE.monthKey();
  if (cfg.goal.raised === raised && cfg.goal.month === month) return;
  cfg.goal.raised = raised; cfg.goal.month = month;
  if (!dirty) await save(true);
}

async function save(quiet) {
  const data = {
    headline: cfg.headline.slice(0, 120), message: cfg.message.slice(0, 600), amounts: cfg.amounts,
    methods: cfg.methods.map(({ id, type, label, handle, enabled }) => ({ id, type, label, handle, enabled })),
    goal: { enabled: !!cfg.goal.enabled, amount: Number(cfg.goal.amount) || 1, label: String(cfg.goal.label || "").slice(0, 80), raised: cfg.goal.raised || 0, month: cfg.goal.month || "" },
    updatedAt: serverTimestamp(), updatedBy: user.email,
  };
  try { await setDoc(configRef, data); dirty = false; if (!quiet) toast("Saved. The support page is updated."); draw(); }
  catch (e) { toast("Couldn't save: " + (e.code || e.message)); }
}

function draw() {
  const m = $("#app"), t = totals();
  m.innerHTML = `<div class="admin">
    <div><div class="eyebrow">MealTote Backend</div><h2>Backend</h2></div>
    <div class="tabs2" role="tablist">${[["analytics", "Analytics"], ["allphotos", "All photos"], ["photos", `Submitted photos${subsCount ? ` (${subsCount} new)` : ""}`], ["recipes", `Recipes${rsubsCount ? ` (${rsubsCount})` : ""}`], ["feedback", `Feedback${fbNew ? ` (${fbNew} new)` : ""}`], ["stores", "Store products"], ["overview", "Donations"], ["methods", "Where donations go"], ["log", `Donation log (${log.length})`]].map(([k, l]) => `<button class="btn small${tab === k ? " primary" : ""}" data-tab="${k}" role="tab" aria-selected="${tab === k}">${l}</button>`).join("")}</div>
    <div id="pane"></div></div>`;
  m.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => { tab = b.dataset.tab; draw(); });
  ({ analytics: drawAnalytics, allphotos: drawAllPhotos, photos: drawPhotos, recipes: drawRecipes, feedback: drawFeedback, stores: drawStores, overview: drawOverview, methods: drawMethods, log: drawLog })[tab]($("#pane"), t);
}

/* ------------------------------------------------------------------ analytics: daily anonymous counts in stats/YYYY-MM-DD (see track() in app.js) */
// online now = apps that checked in within the last 3 minutes (they check in every 2); old check-ins are tidied away
let online = null, onlineT = 0;
async function loadOnline() {
  try {
    const since = Timestamp.fromMillis(Date.now() - 180000);
    online = (await getCountFromServer(query(collection(db, "presence"), where("last", ">", since)))).data().count;
    if (!loadOnline.cleaned) { loadOnline.cleaned = true; getDocs(query(collection(db, "presence"), where("last", "<", Timestamp.fromMillis(Date.now() - 864e5)), limit(100))).then(st => st.docs.forEach(d => deleteDoc(d.ref).catch(() => {}))).catch(() => {}); }
  } catch (e) { online = null; console.warn("online count failed", e.code || e.message); }
  const el = document.querySelector("[data-online]"); if (el) el.textContent = online == null ? "–" : num(online);
}
async function loadStats() {
  try {
    const from = new Date(Date.now() - 120 * 864e5).toISOString().slice(0, 10);
    const q = await getDocs(query(collection(db, "stats"), where(documentId(), ">=", from)));
    stats = Object.fromEntries(q.docs.map(d => [d.id, d.data()])); statsErr = "";
  } catch (e) { stats = {}; statsErr = e.code || e.message; }
}
const TAB_NAMES = { tab_plan: "My plan", tab_prep: "Meal prep", tab_groceries: "Groceries", tab_pantry: "Pantry", tab_recipes: "All recipes", tab_pdf: "Cookbook PDF", tab_settings: "Settings", tab_profile: "Profile" };
const num = n => (n || 0).toLocaleString("en-US");
function lastDays(n) {
  const out = [], d = new Date();
  for (let i = n - 1; i >= 0; i--) { const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - i)); const k = x.toISOString().slice(0, 10); out.push({ day: k, ...(stats[k] || {}) }); }
  return out;
}
function drawAnalytics(p) {
  const days = lastDays(range), sum = k => days.reduce((a, d) => a + (d[k] || 0), 0);
  const today = days[days.length - 1], max = Math.max(1, ...days.map(d => d.views || 0));
  const W = 700, H = 160, bw = W / days.length;
  const bars = days.map((d, i) => { const hv = (d.views || 0) / max * (H - 20), hu = (d.visitors || 0) / max * (H - 20), x = i * bw;
    return `<g><title>${d.day}: ${num(d.visitors)} visitors, ${num(d.views)} views</title><rect x="${x + bw * 0.12}" y="${H - hv}" width="${bw * 0.76}" height="${hv}" rx="2" fill="var(--sunk)"/><rect x="${x + bw * 0.25}" y="${H - hu}" width="${bw * 0.5}" height="${hu}" rx="2" fill="var(--accent)"/></g>`; }).join("");
  const tabs = Object.keys(TAB_NAMES).map(k => [TAB_NAMES[k], sum(k)]).filter(x => x[1]).sort((a, b) => b[1] - a[1]), tabMax = Math.max(1, ...tabs.map(x => x[1]));
  const mob = sum("mobile"), desk = sum("desktop"), dev = Math.max(1, mob + desk);
  const tile = (label, v, sub) => `<div class="tile"><span>${label}</span><b>${num(v)}</b>${sub ? `<span>${sub}</span>` : ""}</div>`;
  p.innerHTML = `${statsErr ? `<div class="card"><p class="note warnline" style="margin:0">Couldn't load analytics (${esc(statsErr)}). The database rules that allow it go live with the next deploy.</p></div>` : ""}
    <div class="tabs2">${[7, 30, 90].map(n => `<button class="btn small${range === n ? " primary" : ""}" data-range="${n}">Last ${n} days</button>`).join("")}</div>
    <div class="tiles">
      <div class="tile"><span>Online now</span><b data-online>${online == null ? "–" : num(online)}</b><span>updates every 30 s</span></div>
      <div class="tile"><span>Daily active users</span><b>${num(today.visitors)}</b><span>today · ${num(Math.round(sum("visitors") / days.length))} a day on average</span></div>
      ${tile("Visitors", sum("visitors"), `${num(today.visitors)} today`)}
      ${tile("Page views", sum("views"), `${num(today.views)} today`)}
      ${tile("New visitors", sum("newVisitors"), `${num(sum("returning"))} returning`)}
      ${tile("Sign-ins", sum("signins"), `${num(sum("signups"))} new accounts`)}
      ${tile("Plans made", sum("plans"), `${num(sum("swaps"))} swaps`)}
      ${tile("Recipes opened", sum("recipeOpens"), `${num(sum("pdf"))} PDF exports`)}
      ${tile("Home-screen app opens", sum("installed"), "")}
      ${tile("Support page clicks", sum("supportClicks"), "")}
      ${tile("Sent to store carts", sum("shop_walmart") + sum("shop_amazon"), `${num(sum("shop_walmart"))} Walmart · ${num(sum("shop_amazon"))} Amazon`)}
      ${tile("Photos submitted", sum("photoSubmits"), `${num(sum("recipeSubmits"))} recipes submitted`)}
    </div>
    <div class="card"><h3>Visitors and page views per day</h3>
      <svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" preserveAspectRatio="none" role="img" aria-label="Daily visitors and page views">${bars}</svg>
      <p class="note" style="margin:0"><span style="display:inline-block;width:10px;height:10px;background:var(--accent);border-radius:2px"></span> visitors &nbsp; <span style="display:inline-block;width:10px;height:10px;background:var(--sunk);border:1px solid var(--line);border-radius:2px"></span> page views &nbsp;·&nbsp; ${days[0].day} to ${today.day} (UTC)</p></div>
    <div class="grid2">
      <div class="card"><h3>What people use</h3>${tabs.length ? `<table class="log">${tabs.map(([n, v]) => `<tr><td>${esc(n)}</td><td style="width:45%"><div class="meter"><i style="width:${Math.round(v / tabMax * 100)}%"></i></div></td><td class="n">${num(v)}</td></tr>`).join("")}</table>` : `<p class="note" style="margin:0">No tab visits yet.</p>`}</div>
      <div class="card"><h3>Devices</h3><table class="log"><tr><td>Phone</td><td style="width:45%"><div class="meter"><i style="width:${Math.round(mob / dev * 100)}%"></i></div></td><td class="n">${Math.round(mob / dev * 100)}%</td></tr><tr><td>Computer</td><td><div class="meter"><i style="width:${Math.round(desk / dev * 100)}%"></i></div></td><td class="n">${Math.round(desk / dev * 100)}%</td></tr></table>
        <p class="note" style="margin:8px 0 0">Counted once per visitor per day.</p></div>
    </div>
    <details class="card"><summary><b>Day by day</b></summary><table class="log"><tr><th>Day</th><th class="n">Visitors</th><th class="n">Views</th><th class="n hide-s">Sign-ins</th><th class="n hide-s">Plans</th></tr>
      ${days.slice().reverse().map(d => `<tr><td>${d.day}</td><td class="n">${num(d.visitors)}</td><td class="n">${num(d.views)}</td><td class="n hide-s">${num(d.signins)}</td><td class="n hide-s">${num(d.plans)}</td></tr>`).join("")}</table></details>
    <p class="note">Your own devices are left out once you've signed in as admin on them. Counts only: no names, emails, IP addresses or cookies are stored, just one running total per day. Counting started when analytics was switched on, so earlier days show zero. Days are in UTC. <button class="btn small" id="statsReload">Refresh</button></p>`;
  p.querySelectorAll("[data-range]").forEach(b => b.onclick = () => { range = +b.dataset.range; draw(); });
  p.querySelector("#statsReload").onclick = async () => { await loadStats(); draw(); toast("Updated"); };
}

/* ------------------------------------------------------------------ community photos: approve or reject what people submit */
// pending counts for the tab labels come from cheap count queries; the submissions themselves (with photos) load when their tab opens
let subsLoaded = false, recipesLoaded = false, subsCount = 0, rsubsCount = 0;
async function loadCounts() {
  try {
    const [a, b, c] = await Promise.all([getCountFromServer(query(collection(db, "submissions"), where("status", "==", "pending"))), getCountFromServer(collection(db, "recipeSubs")), getCountFromServer(query(collection(db, "feedback"), where("status", "==", "new")))]);
    subsCount = a.data().count; rsubsCount = b.data().count; fbNew = c.data().count;
  } catch (e) {}
}
async function loadIndex() {
  try { const idx = await getDoc(doc(db, "site", "communityPhotos")); community = idx.exists() ? (idx.data().ids || {}) : {}; }
  catch (e) { community = {}; photoErr = e.code || e.message; }
}
async function loadPhotos() {
  try {
    const [q] = await Promise.all([getDocs(query(collection(db, "submissions"), orderBy("at", "desc"), limit(300))), loadIndex(), loadRecipeList().catch(() => {})]);
    subs = q.docs.map(d => ({ id: d.id, ...d.data() })); subsCount = subs.filter(x => x.status === "pending").length; subsLoaded = true; photoErr = "";
  } catch (e) { subs = []; photoErr = e.code || e.message; }
}
async function loadRecipeSubs() {
  try {
    const [a, b] = await Promise.all([getDocs(query(collection(db, "recipeSubs"), orderBy("at", "desc"), limit(60))), getDocs(collection(db, "communityRecipes"))]);
    rsubs = a.docs.map(d => ({ id: d.id, ...d.data() })); liveRecipes = b.docs.map(d => ({ id: d.id, ...d.data() })); rsubsCount = rsubs.length; recipesLoaded = true;
  } catch (e) { rsubs = []; liveRecipes = []; photoErr = photoErr || e.code || e.message; }
}
// approve a recipe: it goes into communityRecipes (everyone reads it); a photo, if any, becomes its community photo (id u-<doc id>)
async function approveRecipe(x) {
  try {
    const { photo, status, ...rec } = x; delete rec.id;
    await setDoc(doc(db, "communityRecipes", x.id), { ...rec, approvedAt: Date.now() });
    if (photo) {
      await setDoc(doc(db, "communityPhotos", "u-" + x.id), { data: photo, by: x.name, title: x.title, at: Date.now(), uid: x.uid });
      await setDoc(doc(db, "site", "communityPhotos"), { ids: { ["u-" + x.id]: { by: x.name, at: Date.now() } } }, { merge: true });
    }
    await deleteDoc(doc(db, "recipeSubs", x.id));
    toast("Approved. " + x.title + " is now in everyone's recipe library."); await loadRecipeSubs(); await loadPhotos(); draw();
  } catch (e) { toast("Couldn't approve: " + (e.code || e.message)); }
}
async function rejectRecipe(x) { try { await deleteDoc(doc(db, "recipeSubs", x.id)); toast("Rejected"); await loadRecipeSubs(); draw(); } catch (e) { toast("Couldn't reject: " + (e.code || e.message)); } }
async function unpublishRecipe(id) {
  try {
    await deleteDoc(doc(db, "communityRecipes", id));
    if (community["u-" + id]) await unpublish("u-" + id); else { await loadRecipeSubs(); draw(); }
    toast("Removed from the library.");
  } catch (e) { toast("Couldn't remove: " + (e.code || e.message)); }
}
function drawRecipes(p) {
  if (!recipesLoaded) { p.innerHTML = `<p class="note">Loading recipes…</p>`; loadRecipeSubs().then(() => { if (tab === "recipes") draw(); }); return; }
  const card = (x, i) => `<div class="sub">${x.photo ? `<img src="${x.photo}" alt="">` : ""}<div><b>${esc(x.title)}</b><div class="note">${esc(x.meal)} · ${esc(x.cuisine)} · ${esc(x.time)} min · serves ${esc(x.serves)} · from ${esc(x.name)}</div>
      ${x.blurb ? `<p style="margin:6px 0">${esc(x.blurb)}</p>` : ""}${x.kcal ? `<div class="note">${esc(x.kcal)} kcal · ${esc(x.protein)} g protein · ${esc(x.carbs)} g carbs · ${esc(x.fat)} g fat per serving</div>` : `<div class="note">No nutrition given</div>`}
      <details><summary>Ingredients and steps</summary><ul>${(x.ing || []).map(t => `<li>${esc(t)}</li>`).join("")}</ul><ol>${(x.steps || []).map(t => `<li>${esc(t)}</li>`).join("")}</ol></details></div>
      <div class="actions"><button class="btn small primary" data-rok="${i}">Approve</button><button class="btn small" data-rno="${i}">Reject</button></div></div>`;
  p.innerHTML = `<div class="card"><h3>Recipes waiting for review (${rsubs.length})</h3>
      <p class="note" style="margin:0">People share recipes from All recipes or Settings. Approved ones show for everyone in All recipes, credited by first name. They aren't added to meal plans automatically since their ingredients aren't priced.</p>
      <div class="subgrid">${rsubs.map(card).join("") || `<p class="note">Nothing waiting.</p>`}</div></div>
    <div class="card"><h3>Live community recipes (${liveRecipes.length})</h3>${liveRecipes.length ? `<table class="log">${liveRecipes.map(x => `<tr><td>${esc(x.title)}</td><td class="note">by ${esc(x.name || "")}</td><td class="n"><button class="btn small" data-run="${esc(x.id)}">Remove</button></td></tr>`).join("")}</table>` : `<p class="note" style="margin:0">None yet.</p>`}</div>`;
  p.querySelectorAll("[data-rok]").forEach(b => b.onclick = () => approveRecipe(rsubs[+b.dataset.rok]));
  p.querySelectorAll("[data-rno]").forEach(b => b.onclick = () => rejectRecipe(rsubs[+b.dataset.rno]));
  p.querySelectorAll("[data-run]").forEach(b => b.onclick = () => unpublishRecipe(b.dataset.run));
}
/* ------------------------------------------------------------------ feedback: what people send from Settings → Send feedback (and the Donate page's help box) */
let fb = null, fbNew = 0, fbErr = "", fbShowDone = false;
const FB_KIND = { bug: "Something's broken", idea: "Idea", question: "Question", other: "Other" };
async function loadFeedback() {
  try { const q = await getDocs(query(collection(db, "feedback"), orderBy("at", "desc"), limit(300))); fb = q.docs.map(d => ({ id: d.id, ...d.data() })); fbNew = fb.filter(x => x.status === "new").length; fbErr = ""; }
  catch (e) { fb = []; fbErr = e.code || e.message; }
}
function drawFeedback(p) {
  if (!fb) { p.innerHTML = `<p class="note">Loading feedback…</p>`; loadFeedback().then(() => { if (tab === "feedback") draw(); }); return; }
  const when = x => x.at && x.at.toDate ? x.at.toDate().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "";
  const list = fb.filter(x => fbShowDone || x.status === "new");
  const row = x => `<div class="fbrow${x.status === "new" ? "" : " done"}">
      <div class="note">${esc(FB_KIND[x.kind] || x.kind)} · ${esc(when(x))} · ${x.name ? esc(x.name) : "not signed in"}${x.page ? ` · from ${esc(x.page)}` : ""}</div>
      <p>${esc(x.text).replace(/\n/g, "<br>")}</p>
      <div class="actions">${x.email ? `<a class="btn small" href="mailto:${esc(x.email)}?subject=${encodeURIComponent("Your MealTote feedback")}&body=${encodeURIComponent("\n\n> " + String(x.text).slice(0, 500))}">Reply to ${esc(x.email)}</a>` : `<span class="note">No email left</span>`}
        <button class="btn small${x.status === "new" ? " primary" : ""}" data-fbdone="${esc(x.id)}">${x.status === "new" ? "Mark done" : "Mark as new"}</button>
        <button class="btn small" data-fbdel="${esc(x.id)}">Delete</button></div>
      <details><summary class="note">Device</summary><p class="note">${esc(x.device)}</p></details></div>`;
  p.innerHTML = `<div class="card"><h3>Feedback (${fbNew} new, ${fb.length} total)</h3>
      <p class="note" style="margin:0">Sent from Settings → Send feedback, the Feedback button and the help box on the Donate page. Only you can read these.</p>
      ${fbErr ? `<p class="note">Couldn't load feedback: ${esc(fbErr)}</p>` : ""}
      <label class="note" style="display:flex;gap:8px;align-items:center;min-height:40px"><input type="checkbox" id="fbDone" ${fbShowDone ? "checked" : ""}> Show done</label>
      <div class="fblist">${list.map(row).join("") || `<p class="note">${fbShowDone ? "No feedback yet." : "You're all caught up."}</p>`}</div></div>`;
  $("#fbDone").onchange = e => { fbShowDone = e.target.checked; draw(); };
  p.querySelectorAll("[data-fbdone]").forEach(b => b.onclick = async () => { const x = fb.find(y => y.id === b.dataset.fbdone); const st = x.status === "new" ? "done" : "new";
    try { await setDoc(doc(db, "feedback", x.id), { status: st }, { merge: true }); x.status = st; fbNew = fb.filter(y => y.status === "new").length; draw(); } catch (e) { toast("Couldn't update it: " + (e.code || e.message)); } });
  p.querySelectorAll("[data-fbdel]").forEach(b => b.onclick = async () => { if (b.dataset.armed !== "1") { b.dataset.armed = "1"; b.textContent = "Tap again to delete"; return; }
    try { await deleteDoc(doc(db, "feedback", b.dataset.fbdel)); fb = fb.filter(y => y.id !== b.dataset.fbdel); fbNew = fb.filter(y => y.status === "new").length; draw(); } catch (e) { toast("Couldn't delete it: " + (e.code || e.message)); } });
}
/* ------------------------------------------------------------------ store products: link each ingredient to a Walmart item and an Amazon product */
// The grocery list's "Add to Walmart cart" / "Add to Amazon cart" buttons use these IDs. Unlinked items fall back to search links.
let sp = null, spItems = null, spSug = { walmart: {}, amazon: {} }, spErr = "", spq = "", spf = "all", spShow = 40;
const SP_REF = () => doc(db, "site", "storeProducts");
async function loadStores() {
  try {
    const [snap, items, sug] = await Promise.all([getDoc(SP_REF()), fetch("recipes/items.json", { cache: "no-cache" }).then(r => r.json()),
      fetch("src/store-suggestions.json", { cache: "no-cache" }).then(r => r.ok ? r.json() : null).catch(() => null)]);
    if (sug) spSug = sug;
    sp = Object.assign({ walmart: {}, amazon: {}, amazonTag: "", walmartLink: "" }, snap.exists() ? snap.data() : {}); spItems = items; spErr = "";
  } catch (e) { sp = { walmart: {}, amazon: {}, amazonTag: "", walmartLink: "" }; spItems = spItems || []; spErr = e.code || e.message; }
}
// pull the product ID out of whatever link gets pasted (or accept a bare ID)
function walmartId(v) { v = String(v).trim(); const m = v.match(/walmart\.com\/ip\/(?:[^/?#]+\/)?(\d{5,})/i) || v.match(/^(\d{5,})$/); return m ? m[1] : ""; }
function amazonAsin(v) { v = String(v).trim(); const m = v.match(/\/(?:dp|gp\/product|gp\/aw\/d|exec\/obidos\/ASIN)\/([A-Z0-9]{10})/i) || v.match(/^([A-Z0-9]{10})$/i); return m ? m[1].toUpperCase() : ""; }
const wSearch = x => "https://www.walmart.com/search?q=" + encodeURIComponent((x.walmart || x.name).replace(/\s*\([^)]*\)\s*$/, ""));
const aSearch = x => "https://www.amazon.com/s?k=" + encodeURIComponent(x.name) + "&i=amazonfresh";
async function spSave(patch, msg) {
  try { await setDoc(SP_REF(), { ...patch, updatedAt: serverTimestamp() }, { merge: true }); await loadStores(); toast(msg); draw(); }
  catch (e) { toast("Couldn't save: " + (e.code || e.message)); }
}
async function drawStores(p) {
  if (!sp) { p.innerHTML = `<p class="note">Loading ingredients…</p>`; await loadStores(); if (tab === "stores") draw(); return; }
  const nW = Object.keys(sp.walmart).length, nA = Object.keys(sp.amazon).length, q = spq.trim().toLowerCase();
  const list = spItems.filter(x => (!q || x.name.toLowerCase().includes(q) || x.id.includes(q))
    && (spf === "all" || (spf === "needw" && !sp.walmart[x.id]) || (spf === "needa" && !sp.amazon[x.id]) || (spf === "done" && sp.walmart[x.id] && sp.amazon[x.id])));
  const cell = (x, store) => { const id = store === "w" ? sp.walmart[x.id] : sp.amazon[x.id], label = store === "w" ? "Walmart" : "Amazon";
    return id ? `<div class="spcell on"><span class="note">${label}:</span> <a href="${store === "w" ? "https://www.walmart.com/ip/" + esc(id) : "https://www.amazon.com/dp/" + esc(id)}" target="_blank" rel="noopener">${esc(id)}</a> <button class="btn small" data-sprm="${store}:${esc(x.id)}">Unlink</button></div>`
      : `${sugRow(x, store)}<div class="spcell"><a class="btn small" href="${esc(store === "w" ? wSearch(x) : aSearch(x))}" target="_blank" rel="noopener">Find on ${label}</a><input type="text" placeholder="Paste the ${label} product link" data-spin="${store}:${esc(x.id)}" aria-label="${label} product link for ${esc(x.name)}"><button class="btn small primary" data-spsave="${store}:${esc(x.id)}">Save</button></div>`; };
  const SUG_LABEL = { ok: "Same product and size", close: "Similar: check the size", unavail: "Store listed it as unavailable" };
  function sugRow(x, store) { const g = (store === "w" ? spSug.walmart : spSug.amazon)[x.id]; if (!g) return "";
    const href = store === "w" ? "https://www.walmart.com/ip/" + g.id : "https://www.amazon.com/dp/" + g.id;
    return `<div class="spsug ${esc(g.status)}"><span class="note">Suggested:</span> <a href="${esc(href)}" target="_blank" rel="noopener">${esc(g.title)}</a> <span class="ptag">${esc(SUG_LABEL[g.status] || g.status)}</span> <button class="btn small${g.status === "ok" ? " primary" : ""}" data-spuse="${store}:${esc(x.id)}">Use this</button></div>`; }
  const pendW = Object.entries(spSug.walmart || {}).filter(([k, v]) => v.status === "ok" && !sp.walmart[k]), pendA = Object.entries(spSug.amazon || {}).filter(([k, v]) => v.status === "ok" && !sp.amazon[k]);
  p.innerHTML = `${spErr ? `<div class="card"><p class="note warnline" style="margin:0">Couldn't load (${esc(spErr)}).</p></div>` : ""}
    ${pendW.length || pendA.length ? `<div class="card"><h3>Suggested products</h3><p class="note" style="margin:0">I found these by web search. ${pendW.length} Walmart and ${pendA.length} Amazon suggestions are the same product and size we price. You can take them all at once, then spot-check a few with the product links below. "Similar" suggestions are a different size or variant, so check those one by one.</p>
      <div><button class="btn primary" id="spAll">Use all ${pendW.length + pendA.length} exact matches</button></div></div>` : ""}
    <div class="card"><h3>Order online: Walmart and Amazon</h3>
      <p class="note" style="margin:0">On the grocery list, people can send their whole list to a Walmart or Amazon cart. That only works for ingredients linked to a product here. Tap <b>Find</b>, open the product you'd buy, copy its link from the address bar and paste it in. Most-used ingredients are at the top, so the first 40 or so cover most plans. Unlinked items still show as search links.</p>
      <div class="tiles"><div class="tile"><span>Linked to Walmart</span><b>${nW} of ${spItems.length}</b></div><div class="tile"><span>Linked to Amazon</span><b>${nA} of ${spItems.length}</b></div></div></div>
    <div class="card"><h3>Your affiliate IDs (optional)</h3>
      <p class="note" style="margin:0">So purchases earn you a commission. Leave blank to send people to the stores without one. When either is set, the grocery list shows the required disclosure.</p>
      <label class="fld"><span class="eyebrow">Amazon Associates tag</span><input type="text" id="spTag" maxlength="40" placeholder="yourtag-20" value="${esc(sp.amazonTag || "")}"></label>
      <label class="fld"><span class="eyebrow">Walmart affiliate tracking link (from Impact)</span><input type="url" id="spWl" maxlength="200" placeholder="https://goto.walmart.com/c/1234567/565706/9383" value="${esc(sp.walmartLink || "")}"></label>
      <div><button class="btn primary" id="spIds">Save affiliate IDs</button></div></div>
    <div class="card"><h3>Ingredients (${list.length})</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><input type="search" placeholder="Search ingredients" value="${esc(spq)}" data-spq style="flex:1;min-width:180px">
      <select data-spf>${[["all", "All"], ["needw", "Not on Walmart yet"], ["needa", "Not on Amazon yet"], ["done", "Linked to both"]].map(([k, l]) => `<option value="${k}"${spf === k ? " selected" : ""}>${l}</option>`).join("")}</select></div>
      <div class="splist">${list.slice(0, spShow).map(x => `<div class="sprow"><div><b>${esc(x.name)}</b><div class="note">${esc(x.aisle)} · in ${x.uses} recipe${x.uses === 1 ? "" : "s"}${x.walmart ? ` · we price it as "${esc(x.walmart)}"` : ""}</div></div>${cell(x, "w")}${cell(x, "a")}</div>`).join("") || `<p class="note">Nothing matches.</p>`}</div>
      ${list.length > spShow ? `<button class="btn" data-spmore>Show more (${list.length - spShow} left)</button>` : ""}</div>`;
  $("#spIds").onclick = () => { const tag = $("#spTag").value.trim(), wl = $("#spWl").value.trim();
    if (tag && !/^[a-z0-9][a-z0-9-]{1,38}$/i.test(tag)) return toast("That Amazon tag doesn't look right (like yourtag-20).");
    if (wl && !/^https:\/\/goto\.walmart\.com\/c\/[\d/]+$/.test(wl.replace(/\/$/, ""))) return toast("Paste the tracking link that starts with https://goto.walmart.com/c/");
    spSave({ amazonTag: tag, walmartLink: wl.replace(/\/$/, "") }, "Affiliate IDs saved."); };
  const qi = p.querySelector("[data-spq]"); qi.oninput = () => { spq = qi.value; spShow = 40; clearTimeout(drawStores.t); drawStores.t = setTimeout(() => { draw(); const f = $("[data-spq]"); f.focus(); f.setSelectionRange(f.value.length, f.value.length); }, 250); };
  p.querySelector("[data-spf]").onchange = e => { spf = e.target.value; spShow = 40; draw(); };
  const mb = p.querySelector("[data-spmore]"); if (mb) mb.onclick = () => { spShow += 40; draw(); };
  p.querySelectorAll("[data-spsave]").forEach(b => b.onclick = () => { const [st, it] = b.dataset.spsave.split(":"), v = p.querySelector(`[data-spin="${st}:${it}"]`).value;
    const id = st === "w" ? walmartId(v) : amazonAsin(v);
    if (!id) return toast(st === "w" ? "Couldn't find a Walmart item number in that link. Use the full walmart.com/ip/… link." : "Couldn't find a product ID in that link. Use the full amazon.com/…/dp/… link, not a short a.co link.");
    spSave({ [st === "w" ? "walmart" : "amazon"]: { [it]: id } }, "Linked."); });
  p.querySelectorAll("[data-spuse]").forEach(b => b.onclick = () => { const [st, it] = b.dataset.spuse.split(":"), g = (st === "w" ? spSug.walmart : spSug.amazon)[it];
    spSave({ [st === "w" ? "walmart" : "amazon"]: { [it]: g.id } }, "Linked."); });
  const all = $("#spAll"); if (all) all.onclick = () => { all.disabled = true;
    spSave({ walmart: Object.fromEntries(pendW.map(([k, v]) => [k, v.id])), amazon: Object.fromEntries(pendA.map(([k, v]) => [k, v.id])) }, `Linked ${pendW.length + pendA.length} products.`); };
  p.querySelectorAll("[data-sprm]").forEach(b => b.onclick = () => { const [st, it] = b.dataset.sprm.split(":"); spSave({ [st === "w" ? "walmart" : "amazon"]: { [it]: deleteField() } }, "Unlinked."); });
}
/* ------------------------------------------------------------------ all photos: see every recipe's photo; swap it for a better free-licensed one or the logo */
let BUNDLED = {};
async function loadRecipeList() {
  if (recipeList) return;
  if (!window.BB_PHOTOS) await new Promise((ok, bad) => { const sc = document.createElement("script"); sc.src = "src/photos.js"; sc.onload = ok; sc.onerror = bad; document.head.append(sc); });
  BUNDLED = window.BB_PHOTOS || {};
  recipeList = await (await fetch("recipes/list.json", { cache: "no-cache" })).json();
}
function photoState(id) {
  const c = community[id];
  if (c && c.kind === "logo") return { src: "photos/placeholder.jpg", tag: "logo", label: "Logo (set by you)" };
  if (c && c.kind === "swap") return { src: null, tag: "swap", label: "Swapped · " + (c.by || "") };
  if (c) return { src: null, tag: "user", label: "User photo · " + (c.by || "") };
  if (BUNDLED[id]) return { src: BUNDLED[id], tag: "orig", label: "Original" };
  return { src: "photos/placeholder.jpg", tag: "logo", label: "Logo (no photo)" };
}
async function setIndex(id, entry) { await setDoc(doc(db, "site", "communityPhotos"), { ids: { [id]: entry === null ? deleteField() : entry } }, { merge: true }); }
async function useLogo(id) {
  try { await setIndex(id, { kind: "logo", by: "", at: Date.now() }); toast("Set to the logo for everyone."); await loadIndex(); draw(); }
  catch (e) { toast("Couldn't change it: " + (e.code || e.message)); }
}
async function resetPhoto(id) {
  try { await deleteDoc(doc(db, "communityPhotos", id)).catch(() => {}); await setIndex(id, null); toast("Back to the original."); await loadIndex(); draw(); }
  catch (e) { toast("Couldn't reset: " + (e.code || e.message)); }
}
// cut any image to the 800×600 JPEG every recipe photo uses
function toThumb(blob) { return new Promise((res, rej) => { const img = new Image(); img.onload = () => {
  const W = 800, H = 600, c = document.createElement("canvas"); c.width = W; c.height = H; const k = Math.max(W / img.width, H / img.height);
  c.getContext("2d").drawImage(img, (W - img.width * k) / 2, (H - img.height * k) / 2, img.width * k, img.height * k); URL.revokeObjectURL(img.src); res(c.toDataURL("image/jpeg", 0.8)); };
  img.onerror = rej; img.src = URL.createObjectURL(blob); }); }
const LIC = r => (r.license === "cc0" ? "CC0" : r.license === "pdm" ? "Public domain" : "CC " + r.license.toUpperCase() + " " + (r.license_version || "")).trim();
function openSwap(id, title) {
  const q0 = title.replace(/\(.*?\)/g, "").replace(/\b(with|over|and|&)\b.*$/i, "").trim();
  const wrap = document.createElement("div"); wrap.className = "pick";
  wrap.innerHTML = `<div class="box" role="dialog" aria-label="Swap photo"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><b>Swap photo: ${esc(title)}</b><button class="btn small" data-x>Close</button></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><input type="text" value="${esc(q0)}" style="flex:1;min-width:180px" aria-label="Search"><button class="btn small primary" data-go>Search</button><button class="btn small" data-logo>Use the logo instead</button></div>
    <p class="note" style="margin:0">Free-licensed photos from Openverse (Flickr, Wikimedia and more). Tap one to use it for everyone; it's credited automatically.</p>
    <div class="pgrid" data-res><p class="note">Searching…</p></div><button class="btn small" data-more hidden>More results</button></div>`;
  document.body.append(wrap);
  const inp = wrap.querySelector("input"), res = wrap.querySelector("[data-res]"), more = wrap.querySelector("[data-more]"); let page = 1, results = [];
  const close = () => wrap.remove();
  wrap.querySelector("[data-x]").onclick = close; wrap.onclick = e => { if (e.target === wrap) close(); };
  wrap.querySelector("[data-logo]").onclick = async () => { close(); await useLogo(id); };
  const search = async (add) => {
    if (!add) { page = 1; results = []; res.innerHTML = `<p class="note">Searching…</p>`; }
    try {
      const r = await fetch(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(inp.value)}&license=by,by-sa,cc0,pdm&page_size=20&page=${page}&mature=false`);
      if (r.status === 429) throw new Error("Openverse is busy, try again in a minute");
      const d = await r.json(); results = results.concat((d.results || []).filter(x => !x.width || x.width >= 600));
      res.innerHTML = results.length ? "" : `<p class="note">Nothing found. Try a simpler search, like just the dish name.</p>`;
      results.forEach((x, i) => { const c = document.createElement("button"); c.className = "cand"; c.type = "button";
        c.innerHTML = `<img src="${esc(x.thumbnail || x.url)}" alt="" loading="lazy"><span>${esc(LIC(x))} · ${esc(x.creator || "Unknown")}</span>`; c.onclick = () => choose(x); res.append(c); });
      more.hidden = !(d.page_count > page);
    } catch (e) { res.innerHTML = `<p class="note warnline">${esc(e.message)}</p>`; }
  };
  more.onclick = () => { page++; search(true); };
  wrap.querySelector("[data-go]").onclick = () => search(false); inp.onkeydown = e => { if (e.key === "Enter") search(false); };
  const choose = async x => {
    res.innerHTML = `<p class="note">Saving…</p>`;
    try {
      let blob = null;
      for (const u of [`https://api.openverse.org/v1/images/${x.id}/thumb/?full_size=true`, x.url]) {
        try { const r = await fetch(u); if (r.ok) { blob = await r.blob(); if (blob.size > 5000) break; } } catch (e) {}
      }
      if (!blob) throw new Error("couldn't download that image, pick another");
      const data = await toThumb(blob), by = String(x.creator || "Unknown").slice(0, 80), license = LIC(x), page = x.foreign_landing_url || "";
      await setDoc(doc(db, "communityPhotos", id), { data, by, title: x.title || "", at: Date.now(), license, page });
      await setIndex(id, { kind: "swap", by, license, page, at: Date.now() });
      close(); toast("Swapped. Everyone sees the new photo now."); await loadIndex(); draw();
    } catch (e) { res.innerHTML = `<p class="note warnline">${esc(e.message || e)}</p>`; }
  };
  search(false);
}
async function drawAllPhotos(p) {
  p.innerHTML = `<p class="note">Loading recipes…</p>`;
  try { await loadRecipeList(); } catch (e) { p.innerHTML = `<p class="note warnline">Couldn't load the recipe list.</p>`; return; }
  const q = pq.trim().toLowerCase();
  const list = recipeList.filter(([id, t]) => (!q || t.toLowerCase().includes(q) || id.includes(q)) && (pf === "all" || photoState(id).tag === pf));
  const counts = { orig: 0, swap: 0, user: 0, logo: 0 }; for (const [id] of recipeList) counts[photoState(id).tag]++;
  p.innerHTML = `<div class="card"><h3>Every recipe's photo</h3><p class="note" style="margin:0">Tap <b>Swap</b> to pick a better free-licensed photo, <b>Logo</b> to show the MealTote logo instead, or <b>Reset</b> to go back to the original. Changes show for everyone right away.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><input type="search" placeholder="Search recipes" value="${esc(pq)}" data-q style="flex:1;min-width:180px">
    <select data-f>${[["all", `All (${recipeList.length})`], ["orig", `Original (${counts.orig})`], ["swap", `Swapped (${counts.swap})`], ["user", `User photos (${counts.user})`], ["logo", `Logo (${counts.logo})`]].map(([k, l]) => `<option value="${k}"${pf === k ? " selected" : ""}>${l}</option>`).join("")}</select></div></div>
    <div class="pgrid" data-grid></div>${list.length > pshow ? `<button class="btn" data-more style="margin-top:10px">Show more (${list.length - pshow} left)</button>` : ""}`;
  const grid = p.querySelector("[data-grid]");
  for (const [id, title] of list.slice(0, pshow)) {
    const st = photoState(id), t = document.createElement("div"); t.className = "ptile";
    t.innerHTML = `<img alt="" loading="lazy"><div class="pt"><span class="ptag ${st.tag}">${esc(st.label)}</span><b>${esc(title)}</b></div><div class="acts"><button class="btn small primary" data-swap>Swap</button><button class="btn small" data-logo>Logo</button>${community[id] ? `<button class="btn small" data-reset>Reset</button>` : ""}</div>`;
    const img = t.querySelector("img");
    if (st.src) img.src = st.src; else getDoc(doc(db, "communityPhotos", id)).then(s => { if (s.exists()) img.src = s.data().data; }).catch(() => {});
    t.querySelector("[data-swap]").onclick = () => openSwap(id, title);
    t.querySelector("[data-logo]").onclick = () => useLogo(id);
    const rs = t.querySelector("[data-reset]"); if (rs) rs.onclick = () => resetPhoto(id);
    grid.append(t);
  }
  const qi = p.querySelector("[data-q]"); qi.oninput = () => { pq = qi.value; pshow = 60; clearTimeout(drawAllPhotos.t); drawAllPhotos.t = setTimeout(() => { drawAllPhotos(p).then(() => { const f = p.querySelector("[data-q]"); f.focus(); f.setSelectionRange(f.value.length, f.value.length); }); }, 250); };
  p.querySelector("[data-f]").onchange = e => { pf = e.target.value; pshow = 60; drawAllPhotos(p); };
  const mb = p.querySelector("[data-more]"); if (mb) mb.onclick = () => { pshow += 60; drawAllPhotos(p); };
}

// "Make main photo": the submitted photo becomes the recipe's photo for everyone. Submissions are kept (status "used"),
// so you can switch back to any of them later; the one that's live is whichever matches site/communityPhotos.
const liveSub = rid => { const c = community[rid]; return c && !c.kind ? c.sub || null : null; };
async function makeMain(sub) {
  try {
    await setDoc(doc(db, "communityPhotos", sub.rid), { data: sub.data, by: sub.name, title: sub.title, at: Date.now(), uid: sub.uid });
    await setIndex(sub.rid, { by: sub.name, at: Date.now(), sub: sub.id });
    if (sub.status !== "used") await setDoc(doc(db, "submissions", sub.id), { status: "used" }, { merge: true });
    toast("Done. Everyone now sees this photo for " + sub.title + "."); await loadPhotos(); draw();
  } catch (e) { toast("Couldn't change it: " + (e.code || e.message)); }
}
async function reject(sub) {
  try { await deleteDoc(doc(db, "submissions", sub.id)); toast("Deleted"); await loadPhotos(); draw(); }
  catch (e) { toast("Couldn't delete it: " + (e.code || e.message)); }
}
async function unpublish(rid) {
  try {
    await deleteDoc(doc(db, "communityPhotos", rid));
    await setIndex(rid, null);
    toast("Back to the original photo."); await loadPhotos(); draw();
  } catch (e) { toast("Couldn't change it: " + (e.code || e.message)); }
}
let subsShowUsed = true;
function drawPhotos(p) {
  if (!subsLoaded) { p.innerHTML = `<p class="note">Loading submitted photos…</p>`; loadPhotos().then(() => { if (tab === "photos") draw(); }); return; }
  const titleOf = rid => { const r = recipeList && recipeList.find(x => x[0] === rid); return r ? r[1] : rid; };
  const day = t => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const pending = subs.filter(x => x.status === "pending"), used = subs.filter(x => x.status !== "pending");
  const card = x => {
    const st = photoState(x.rid), isLive = liveSub(x.rid) === x.id;
    return `<div class="psub${isLive ? " live" : ""}" data-sid="${esc(x.id)}">
      <div class="pcmp"><figure><img src="${x.data}" alt="Submitted photo of ${esc(x.title)}"><figcaption>Submitted by ${esc(x.name)} · ${day(x.at)}</figcaption></figure>
        <figure class="now"><img data-now="${esc(x.rid)}" alt=""><figcaption>${isLive ? "This is the main photo now" : "Main photo now: " + esc(st.label)}</figcaption></figure></div>
      <b>${esc(titleOf(x.rid))}</b>
      <div class="actions">${isLive ? `<span class="ptag user">Main photo</span><button class="btn small" data-un="${esc(x.rid)}">Put back the original</button>`
        : `<button class="btn small primary" data-main="${esc(x.id)}">Make main photo</button>`}
        <button class="btn small" data-del="${esc(x.id)}">${x.status === "pending" ? "Reject" : "Delete"}</button></div></div>`; };
  p.innerHTML = `${photoErr ? `<div class="card"><p class="note warnline" style="margin:0">Couldn't load photos (${esc(photoErr)}).</p></div>` : ""}
    <div class="card"><h3>New photos to review (${pending.length})</h3>
      <p class="note" style="margin:0">People send these from a recipe's page ("Share it with everyone" or "Submit a photo for everyone"). <b>Make main photo</b> shows it on that recipe for everyone, credited "User photo · shared by" their first name. Photos people add only for themselves stay private and don't come here.</p>
      <div class="psubs">${pending.map(card).join("") || `<p class="note">Nothing new right now.</p>`}</div></div>
    <div class="card"><h3>Photos you've already reviewed (${used.length})</h3>
      <p class="note" style="margin:0">Every photo you've made main stays here, so you can switch a recipe back to it, or put back the original.</p>
      <div class="psubs">${used.map(card).join("") || `<p class="note">None yet.</p>`}</div></div>`;
  p.querySelectorAll("img[data-now]").forEach(img => { const rid = img.dataset.now, st = photoState(rid);
    if (st.src) img.src = st.src; else getDoc(doc(db, "communityPhotos", rid)).then(sn => { if (sn.exists()) img.src = sn.data().data || sn.data().url || ""; }).catch(() => {}); });
  const byId = id => subs.find(x => x.id === id);
  p.querySelectorAll("[data-main]").forEach(b => b.onclick = () => { b.disabled = true; makeMain(byId(b.dataset.main)); });
  p.querySelectorAll("[data-un]").forEach(b => b.onclick = () => unpublish(b.dataset.un));
  p.querySelectorAll("[data-del]").forEach(b => b.onclick = () => { if (b.dataset.armed !== "1") { b.dataset.armed = "1"; b.textContent = "Tap again to delete"; return; } reject(byId(b.dataset.del)); });
}

function drawOverview(p, t) {
  const pct = Math.min(100, Math.round(t.month / Math.max(1, cfg.goal.amount) * 100));
  const on = cfg.methods.filter(x => x.enabled);
  p.innerHTML = `<div class="tiles">
      <div class="tile"><span>This month</span><b>${money(t.month)}</b></div>
      <div class="tile"><span>All time</span><b>${money(t.all)}</b></div>
      <div class="tile"><span>Gifts logged</span><b>${t.n}</b></div>
      <div class="tile"><span>Supporters (by name)</span><b>${t.who.size}</b></div>
    </div>
    ${cfg.goal.enabled ? `<div class="card"><h3>${esc(cfg.goal.label)}</h3><div class="meter"><i style="width:${pct}%"></i></div><p class="note" style="margin:0">${money(t.month)} of ${money(cfg.goal.amount)} this month (${pct}%). Shown on the support page.</p></div>` : ""}
    <div class="card"><h3>By method</h3>${Object.keys(t.by).length ? `<table class="log">${Object.entries(t.by).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<tr><td>${esc(k)}</td><td class="n">${money(v)}</td></tr>`).join("")}</table>` : `<p class="note" style="margin:0">No gifts logged yet. When a donation comes in, add it under Donation log.</p>`}</div>
    <div class="card"><h3>Live on the support page</h3>${on.length ? `<ul style="margin:0;padding-left:20px">${on.map(x => `<li><b>${esc(x.label)}</b>: ${esc(x.handle)}</li>`).join("")}</ul>` : `<p class="note" style="margin:0">Every method is switched off, so the support page says donations are paused.</p>`}
      ${dirty ? `<p class="note warnline" style="margin:0">Nothing saved yet: the support page is showing the built-in defaults. Open "Where donations go" and click Save.</p>` : ""}</div>`;
}

function drawMethods(p) {
  const mark = () => { dirty = true; $("#saveState").textContent = "Unsaved changes"; };
  p.innerHTML = `<div class="card"><h3>Page text</h3>
      <label class="fld"><span class="eyebrow">Headline</span><input type="text" id="fHead" maxlength="120" value="${esc(cfg.headline)}"></label>
      <label class="fld"><span class="eyebrow">Message</span><textarea id="fMsg" maxlength="600">${esc(cfg.message)}</textarea></label>
      <label class="fld"><span class="eyebrow">Suggested amounts in dollars (comma separated, up to 6)</span><input type="text" id="fAmt" value="${esc(cfg.amounts.join(", "))}"></label></div>
    <div class="card"><h3>Where donations go</h3><p class="note" style="margin:0">Switch methods on or off, change the account each one pays, and set the order people see them in.</p><div id="mlist" style="display:grid;gap:10px"></div>
      <div class="prow"><select id="newType">${Object.entries(T).map(([k, x]) => `<option value="${k}">${esc(x.name)}</option>`).join("")}</select><button class="btn small" id="addM" type="button">+ Add method</button></div></div>
    <div class="card"><h3>Monthly goal (optional)</h3>
      <label class="tog"><input type="checkbox" id="gOn" ${cfg.goal.enabled ? "checked" : ""}> Show a progress bar on the support page</label>
      <div class="grid2"><label class="fld"><span class="eyebrow">Goal label</span><input type="text" id="gLabel" maxlength="80" value="${esc(cfg.goal.label)}"></label>
      <label class="fld"><span class="eyebrow">Goal amount ($ a month)</span><input type="number" id="gAmt" min="1" step="1" value="${esc(cfg.goal.amount)}"></label></div>
      <p class="note" style="margin:0">Progress counts this month's gifts from the Donation log.</p></div>
    <div class="savebar"><button class="btn primary" id="saveBtn" type="button">Save</button><span class="note" id="saveState">${dirty ? "Unsaved changes" : "All changes saved"}</span></div>`;
  const list = $("#mlist");
  const drawList = () => {
    list.innerHTML = cfg.methods.map((x, i) => {
      const t = T[x.type], url = t.link ? t.link(x.handle, t.amounts ? 5 : undefined) : "";
      return `<div class="mrow${x.enabled ? "" : " off"}" data-i="${i}"><div class="top"><span class="pill">${esc(t.name)}</span><b>${esc(x.label)}</b>
        <label class="tog"><input type="checkbox" data-k="enabled" ${x.enabled ? "checked" : ""}> On</label>
        <button class="btn small" data-act="up" ${i ? "" : "disabled"} aria-label="Move up">↑</button><button class="btn small" data-act="down" ${i < cfg.methods.length - 1 ? "" : "disabled"} aria-label="Move down">↓</button><button class="btn small danger" data-act="del">Remove</button></div>
        <div class="grid2"><label class="fld"><span class="eyebrow">Button label</span><input type="text" data-k="label" maxlength="40" value="${esc(x.label)}"></label>
        <label class="fld"><span class="eyebrow">${esc(t.hint)}</span><input type="text" data-k="handle" maxlength="200" value="${esc(x.handle)}"></label></div>
        <p class="note" style="margin:0">${url ? `Test it: <a href="${esc(url)}" target="_blank" rel="noopener">${esc(url)}</a>` : t.link ? `<span class="warnline">Enter a valid ${esc(t.hint.toLowerCase())}.</span>` : "Shown as text with a Copy button (Zelle has no payment links)."}</p></div>`;
    }).join("") || `<p class="note">No methods yet. Add one below.</p>`;
  };
  drawList();
  list.addEventListener("input", e => { const r = e.target.closest(".mrow"), k = e.target.dataset.k; if (!r || !k) return; const x = cfg.methods[+r.dataset.i]; x[k] = e.target.type === "checkbox" ? e.target.checked : e.target.value; mark(); if (k === "enabled") drawList(); });
  list.addEventListener("change", e => { if (e.target.dataset.k === "handle") drawList(); });
  list.addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return; const i = +b.closest(".mrow").dataset.i, ms = cfg.methods;
    if (b.dataset.act === "up") [ms[i - 1], ms[i]] = [ms[i], ms[i - 1]];
    if (b.dataset.act === "down") [ms[i + 1], ms[i]] = [ms[i], ms[i + 1]];
    if (b.dataset.act === "del") { if (b.dataset.armed) ms.splice(i, 1); else { b.dataset.armed = 1; b.textContent = "Tap again to remove"; return; } }
    mark(); drawList();
  });
  $("#addM").onclick = () => { if (cfg.methods.length >= 10) return toast("Up to 10 methods"); const type = $("#newType").value; cfg.methods.push({ id: type + "-" + Date.now().toString(36), type, label: T[type].name, handle: "", enabled: false }); mark(); drawList(); };
  $("#fHead").oninput = e => { cfg.headline = e.target.value; mark(); };
  $("#fMsg").oninput = e => { cfg.message = e.target.value; mark(); };
  $("#fAmt").oninput = e => { cfg.amounts = e.target.value.split(/[ ,]+/).map(Number).filter(n => n > 0 && n <= 1000).slice(0, 6); mark(); };
  $("#gOn").onchange = e => { cfg.goal.enabled = e.target.checked; mark(); };
  $("#gLabel").oninput = e => { cfg.goal.label = e.target.value; mark(); };
  $("#gAmt").oninput = e => { cfg.goal.amount = Math.max(1, Number(e.target.value) || 1); mark(); };
  $("#saveBtn").onclick = async () => {
    const bad = cfg.methods.filter(x => x.enabled && (!x.handle.trim() || (T[x.type].link && !T[x.type].link(x.handle))));
    if (bad.length) return toast(`${bad[0].label}: fill in a valid account before switching it on.`);
    cfg.methods = cfg.methods.filter(x => x.handle.trim());
    const t = totals(); cfg.goal.raised = Math.round(t.month * 100) / 100; cfg.goal.month = DONATE.monthKey();
    await save();
  };
}

function drawLog(p) {
  const today = new Date(), iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const methodNames = [...new Set([...cfg.methods.map(x => x.label), "Other"])];
  p.innerHTML = `<div class="card"><h3>Log a donation</h3><p class="note" style="margin:0">PayPal, Cash App and Zelle don't report gifts to MealTote automatically, so add them here when they arrive.</p>
      <div class="grid2">
        <label class="fld"><span class="eyebrow">Date</span><input type="date" id="dAt" value="${iso}" max="${iso}"></label>
        <label class="fld"><span class="eyebrow">Method</span><select id="dMethod">${methodNames.map(n => `<option>${esc(n)}</option>`).join("")}</select></label>
        <label class="fld"><span class="eyebrow">Amount ($)</span><input type="number" id="dAmt" min="0.01" step="0.01" placeholder="5.00"></label>
        <label class="fld"><span class="eyebrow">From (optional)</span><input type="text" id="dWho" maxlength="80" placeholder="Name or handle"></label>
      </div>
      <label class="fld"><span class="eyebrow">Note (optional)</span><input type="text" id="dNote" maxlength="300"></label>
      <div class="prow"><button class="btn primary" id="dAdd" type="button">Add to log</button><button class="btn small" id="dCsv" type="button" ${log.length ? "" : "disabled"}>Download CSV</button></div></div>
    <div class="card"><h3>Gifts received</h3>${log.length ? `<table class="log"><thead><tr><th>Date</th><th>Method</th><th class="hide-s">From</th><th class="hide-s">Note</th><th class="n">Amount</th><th></th></tr></thead><tbody>${log.map(g => `<tr><td>${new Date(g.at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td><td>${esc(g.method)}</td><td class="hide-s">${esc(g.who || "")}</td><td class="hide-s">${esc(g.note || "")}</td><td class="n">${money(g.amount)}</td><td><button class="btn small danger" data-del="${g.id}" type="button">Delete</button></td></tr>`).join("")}</tbody></table>` : `<p class="note" style="margin:0">Nothing logged yet.</p>`}</div>`;
  $("#dAdd").onclick = async () => {
    const amount = Math.round(Number($("#dAmt").value) * 100) / 100;
    if (!(amount > 0)) return toast("Enter an amount");
    const [y, mo, da] = $("#dAt").value.split("-").map(Number), at = new Date(y, mo - 1, da, 12).getTime();
    const g = { at: isNaN(at) ? Date.now() : at, method: $("#dMethod").value, amount };
    const who = $("#dWho").value.trim(), note = $("#dNote").value.trim(); if (who) g.who = who; if (note) g.note = note;
    try { const r = await addDoc(logCol, g); log = [{ id: r.id, ...g }, ...log].sort((a, b) => b.at - a.at); toast(`Logged ${money(amount)}`); await syncRaised(); draw(); }
    catch (e) { toast("Couldn't log it: " + (e.code || e.message)); }
  };
  $("#dCsv").onclick = () => {
    const rows = [["date", "method", "amount", "from", "note"], ...log.map(g => [new Date(g.at).toISOString().slice(0, 10), g.method, g.amount.toFixed(2), g.who || "", g.note || ""])];
    const csv = rows.map(r => r.map(v => /[",\n]/.test(v) ? `"${String(v).replace(/"/g, '""')}"` : v).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = `mealtote-donations-${DONATE.monthKey()}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 30000);
  };
  p.querySelectorAll("[data-del]").forEach(b => b.onclick = async () => {
    if (!b.dataset.armed) { b.dataset.armed = 1; b.textContent = "Tap again"; return; }
    try { await deleteDoc(doc(db, "donations", b.dataset.del)); log = log.filter(g => g.id !== b.dataset.del); toast("Deleted"); await syncRaised(); draw(); }
    catch (e) { toast("Couldn't delete: " + (e.code || e.message)); }
  });
}

window.addEventListener("beforeunload", e => { if (dirty && tab === "methods") { e.preventDefault(); e.returnValue = ""; } });
