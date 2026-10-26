// MealTote Backend (admin.html): donation methods shown on the support page, and a hand-kept log of gifts received.
// Only ADMIN_EMAIL gets in. That check here only decides what to draw; firestore.rules is what actually enforces it.
import { firebaseConfig } from "./firebase-config.js";

const ADMIN_EMAIL = "starsidecollective@gmail.com";
const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
const { initializeApp } = await import(`${SDK}/firebase-app.js`);
const { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged } = await import(`${SDK}/firebase-auth.js`);
const { getFirestore, doc, getDoc, setDoc, collection, addDoc, getDocs, deleteDoc, query, orderBy, limit, serverTimestamp } = await import(`${SDK}/firebase-firestore.js`);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app), db = getFirestore(app);
const configRef = doc(db, "site", "donations"), logCol = collection(db, "donations");

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = n => "$" + (Math.round((n || 0) * 100) / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const toast = msg => { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2400); };
const T = DONATE.TYPES;

let user = null, cfg = null, log = [], tab = "overview", dirty = false;

onAuthStateChanged(auth, async u => {
  user = u; $("#who").innerHTML = "";
  if (!u) return gate("Sign in with your MealTote admin Google account.", true);
  $("#who").append(btn("Sign out", () => signOut(auth)));
  if (u.email !== ADMIN_EMAIL || !u.emailVerified) return gate(`You're signed in as ${esc(u.email)}. The Backend is only for the MealTote admin.`, false);
  try {
    const snap = await getDoc(configRef);
    cfg = DONATE.normalize(snap.exists() ? snap.data() : DONATE.DEFAULT_DONATIONS);
    if (!snap.exists()) dirty = true; // first visit: nothing saved yet, so the support page is using the defaults
    await loadLog();
    draw();
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
    <div><div class="eyebrow">MealTote Backend</div><h2>Donations</h2></div>
    <div class="tabs2" role="tablist">${[["overview", "Overview"], ["methods", "Where donations go"], ["log", `Donation log (${log.length})`]].map(([k, l]) => `<button class="btn small${tab === k ? " primary" : ""}" data-tab="${k}" role="tab" aria-selected="${tab === k}">${l}</button>`).join("")}</div>
    <div id="pane"></div></div>`;
  m.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => { tab = b.dataset.tab; draw(); });
  ({ overview: drawOverview, methods: drawMethods, log: drawLog })[tab]($("#pane"), t);
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
    ${cfg.goal.enabled ? `<div class="card"><h3>${esc(cfg.goal.label)}</h3><div class="bar"><i style="width:${pct}%"></i></div><p class="note" style="margin:0">${money(t.month)} of ${money(cfg.goal.amount)} this month (${pct}%). Shown on the support page.</p></div>` : ""}
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
