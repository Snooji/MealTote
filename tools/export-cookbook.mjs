// Writes cookbook/*.md (one file per recipe) and cookbook/INDEX.md from the app's recipe data,
// and fails if two recipes look like the same dish. Run: node tools/export-cookbook.mjs
// Check INDEX.md before adding a recipe so the library doesn't grow duplicates.
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

// a do-anything stand-in for the DOM: the app's UI code runs but draws nothing
const fake = () => new Proxy(function () {}, {
  get: (t, k) => k === Symbol.iterator ? function* () {} : k === Symbol.toPrimitive ? () => "" : k === "length" ? 0 : fake(),
  set: () => true, apply: () => fake(), construct: () => fake(),
});
const document = fake();
document.querySelectorAll = () => [];
const store = {};
const sandbox = {
  console, document, navigator: { userAgent: "node", webdriver: true }, location: { search: "", hash: "", hostname: "localhost" }, matchMedia: () => ({ matches: false, addEventListener() {} }),
  localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
  addEventListener() {}, dispatchEvent() {}, setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {}, scrollTo() {}, fetch: () => new Promise(() => {}),
  structuredClone, URL, URLSearchParams, Image: function () { return fake(); }, Event: function () {},
};
sandbox.window = sandbox; sandbox.self = sandbox;
vm.createContext(sandbox);
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script src="(src\/[^"]+)"><\/script>/g)].map(m => m[1]);
for (const s of scripts) vm.runInContext(fs.readFileSync(path.join(root, s), "utf8") + "\n;globalThis.__R = typeof RECIPES!=='undefined' ? {RECIPES, META, STORAGE, ITEMS, nutritionOf, recipeCost, versionsOf, CUISINE_LABEL, CUISINE_OPTS} : globalThis.__R;", sandbox, { filename: s });
const { RECIPES, META, STORAGE, nutritionOf, recipeCost, versionsOf, CUISINE_LABEL, CUISINE_OPTS: CUISINE_OPTS_EXPORT } = sandbox.__R;
const photos = sandbox.BB_PHOTOS || {}, credits = sandbox.BB_CREDITS || {};

const out = path.join(root, "cookbook");
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out);
const cuisine = id => CUISINE_LABEL?.[META[id].cuisine] || META[id].cuisine;
const rows = [];
for (const r of RECIPES) {
  const m = META[r.id], n = nutritionOf(r), c = recipeCost(r), st = STORAGE[r.id] || [3, 0, ""];
  const vs = versionsOf(r).filter(v => v.id !== r.id).map(v => v.variantLabel || v.title);
  const md = [
    `# ${r.title}`, "",
    photos[r.id] ? `![${r.title}](../${photos[r.id]})` + (credits[r.id] ? `\n\n<sub>Photo: ${credits[r.id].author} · ${credits[r.id].license} · [source](${credits[r.id].page})</sub>` : "") : "_No free-licensed photo yet; the app shows the MealTote logo._", "",
    `**${r.meal}** · ${cuisine(r.id)} · ${r.time} min · serves ${r.serves} · skill ${m.skill}/3`, "",
    `> ${r.blurb}`, "",
    `| Per serving | kcal | Protein | Carbs | Fat | Fiber | Sodium | Cost |`, `| --- | --- | --- | --- | --- | --- | --- | --- |`,
    `| | ${Math.round(n.kcal)} | ${Math.round(n.protein)} g | ${Math.round(n.carbs)} g | ${Math.round(n.fat)} g | ${Math.round(n.fiber)} g | ${Math.round(n.sodium)} mg | $${c.perServing.toFixed(2)} |`, "",
    `Contains: ${(m.has || []).join(", ") || "none of the tracked allergens"}`, "",
    `## Ingredients`, "", ...r.ing.map(i => `- ${i[2]}`), "", `From the pantry: ${r.pantry}`, "",
    `## Steps`, "", ...r.steps.map((s, i) => `${i + 1}. ${s}`), "",
    `**Tip:** ${r.tip}`, "",
    r.src ? `Adapted from [${r.src[0]}](${r.src[1]}).\n` : "",
    `## Storing`, "", `Fridge ${st[0]} days · freezer ${st[1] ? "up to " + st[1] + " months" : "not recommended"}. ${st[2]}`, "",
    vs.length ? `## Other ways to make it\n\n${vs.map(v => "- " + v).join("\n")}\n` : "",
  ].join("\n");
  fs.writeFileSync(path.join(out, `${r.id}.md`), md);
  rows.push({ r, n, c, key: new Set(r.ing.map(i => i[0])) });
}

// duplicate check: same meal, same main protein, and most of the same ingredients
const STAPLE = new Set(["garlic", "onion", "green_onion", "cilantro", "lime", "lemon", "jasmine_rice", "basmati", "eggs", "butter", "parmesan", "soy", "olive_oil", "ginger", "honey"]);
// pairs a person has checked and decided are different dishes
const NOT_DUPES = new Set(["buttermilk-pancakes|french-toast", "crepes|dutch-baby", "menemen|lecso-eggs", "moqueca-camarao|sri-lankan-devilled-shrimp", "malawach-zhug|khagina-paratha", "honey-garlic-pork|dijon-rosemary-pork-tenderloin", "breakfast-quesadillas|turkey-chorizo-egg-white-burritos", "quinoa-bowls|chicken-hummus-quinoa-bowls", "turkey-chorizo-egg-white-burritos|turkey-sausage-breakfast-crunchwraps", "kodiak-protein-waffles|sheet-pan-protein-pancakes", "strawberry-cheesecake-yogurt-bowls|cottage-cheese-banana-splits"]);
const dupes = [];
for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
  const a = rows[i], b = rows[j]; if (NOT_DUPES.has(`${a.r.id}|${b.r.id}`) || NOT_DUPES.has(`${b.r.id}|${a.r.id}`)) continue;
  if (a.r.meal !== b.r.meal || META[a.r.id].protein !== META[b.r.id].protein) continue;
  const A = [...a.key].filter(k => !STAPLE.has(k)), B = new Set([...b.key].filter(k => !STAPLE.has(k)));
  const inter = A.filter(k => B.has(k)).length, uni = new Set([...A, ...B]).size;
  if (uni && inter / uni >= 0.7) dupes.push(`${a.r.id} ↔ ${b.r.id} (${Math.round(inter / uni * 100)}% same ingredients)`);
}

const byMeal = m => rows.filter(x => x.r.meal === m).sort((a, b) => a.r.title.localeCompare(b.r.title));
let idx = `# MealTote cookbook\n\n${rows.length} recipes. Generated by \`node tools/export-cookbook.mjs\` from the app's data. Don't edit by hand.\n\n` +
  `Before adding a recipe, search this list (and the "Other ways to make it" section of similar dishes) so it isn't a duplicate under a new name.\n\n`;
for (const meal of ["Breakfast", "Lunch", "Dinner"]) {
  const list = byMeal(meal);
  idx += `## ${meal} (${list.length})\n\n| Recipe | Cuisine | Protein | Min | kcal | Protein g | $/serving |\n| --- | --- | --- | --- | --- | --- | --- |\n`;
  for (const { r, n, c } of list) idx += `| [${r.title}](${r.id}.md) | ${cuisine(r.id)} | ${META[r.id].protein} | ${r.time} | ${Math.round(n.kcal)} | ${Math.round(n.protein)} | ${c.perServing.toFixed(2)} |\n`;
  idx += "\n";
}
fs.writeFileSync(path.join(out, "INDEX.md"), idx);
console.log(`wrote ${rows.length} recipes to cookbook/`);
if (dupes.length) { console.error("Possible duplicates:\n" + dupes.join("\n")); process.exitCode = 1; }

/* ------------------------------------------------------------------ public pages for search engines
   recipes/<id>.html          one page per recipe, schema.org Recipe + breadcrumbs + related recipes
   recipes/index.html         every recipe, by cuisine
   recipes/cuisine/<id>.html  one page per cuisine
   meal-plans/<goal>.html     landing pages for what people search (high-protein, budget, ...)
   recipes/list.json          for the Backend; sitemap.xml; the landing page's popular recipes (index.html) */
const SITE = "https://mealtote.com";
// real ratings from the app (ratings/{recipe} = {sum, count}); pages only show and mark up a rating once people have rated
const RATINGS = {};
try {
  const cfg = fs.readFileSync(path.join(root, "src", "firebase-config.js"), "utf8");
  const key = cfg.match(/apiKey:\s*"([^"]+)"/)[1], project = cfg.match(/projectId:\s*"([^"]+)"/)[1];
  let token = "";
  do {
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/ratings?pageSize=300&key=${key}${token ? "&pageToken=" + token : ""}`);
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    for (const doc of d.documents || []) { const f = doc.fields || {}, count = +(f.count?.integerValue || 0), sum = +(f.sum?.integerValue || 0); if (count > 0) RATINGS[doc.name.split("/").pop()] = { count, avg: sum / count }; }
    token = d.nextPageToken || "";
  } while (token);
  console.log(`ratings: ${Object.keys(RATINGS).length} recipes rated`);
} catch (e) { console.log("ratings: not loaded (" + e.message + ")"); }
const starsHtml = rt => `<p class="rated" aria-label="Rated ${rt.avg.toFixed(1)} out of 5 by ${rt.count} ${rt.count > 1 ? "people" : "person"}"><span class="st">${"★".repeat(Math.round(rt.avg))}${"☆".repeat(5 - Math.round(rt.avg))}</span> <b>${rt.avg.toFixed(1)}</b> out of 5 · ${rt.count} rating${rt.count > 1 ? "s" : ""}</p>`;
const esc = s => String(s ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const jsonld = o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;
const thumb = id => photos[id] ? "/" + photos[id].replace(/^photos\//, "photos/t/") : "/photos/placeholder.jpg";
const full = id => `${SITE}/${photos[id] || "photos/placeholder.jpg"}`;
const CUISINE_ID = id => META[id].cuisine;
const slugCuisine = c => c;
for (const d of ["recipes", "meal-plans"]) fs.rmSync(path.join(root, d), { recursive: true, force: true });
fs.mkdirSync(path.join(root, "recipes", "cuisine"), { recursive: true }); fs.mkdirSync(path.join(root, "meal-plans"));

const GOALS = [
  { slug: "high-protein", name: "High-protein meal plans", title: "High-Protein Meal Plan: Free Weekly Plan & Recipes",
    desc: "Free high-protein meal plan with recipes that hit 150 to 200 g of protein a day, portions sized to your macros and a grocery list for your stores.",
    intro: ["Eating enough protein to build muscle is easier with a plan. MealTote builds a week of breakfasts, lunches and dinners around your protein, carb and fat targets, and sizes every portion to match.",
      "These recipes get at least 30% of their calories from protein: egg-white breakfast burritos, protein pancakes, chicken and rice bowls, lean beef and turkey dinners, salmon and shrimp. Set a target like 190 g a day and the planner leans on them, then suggests extra protein or a side when a meal falls short."],
    test: (r, n) => n.protein * 4 / Math.max(1, n.kcal) >= 0.3 && n.protein >= 30,
    faq: [["How much protein is in a MealTote high-protein plan?", "With a 190 g target on about 2,400 calories, a week of planned meals averages 190 to 200 g of protein a day."], ["Can I set my own macros?", "Yes. Add protein, carb and fat targets for each person and portions are sized to match."]] },
  { slug: "weight-loss", name: "Weight loss meal plans", title: "Weight Loss Meal Plan: Free Calorie-Counted Recipes",
    desc: "Free weight loss meal plan with calorie-counted recipes, filling high-protein meals and a grocery list. Set a calorie target and MealTote sizes every portion.",
    intro: ["A calorie deficit is easier to stick to when meals are filling and already counted. Tell MealTote your daily calorie target and it plans meals and sizes each portion to fit.",
      "These recipes are lighter but satisfying: plenty of protein and vegetables, with breakfasts under about 450 calories and lunches and dinners under about 600. Every recipe shows calories, protein, carbs, fat, fiber and sodium per serving."],
    test: (r, n) => n.kcal <= (r.meal === "Breakfast" ? 450 : 600) && n.protein * 4 / Math.max(1, n.kcal) >= 0.22,
    faq: [["Does MealTote count calories for me?", "Yes. Every recipe has calories and macros per serving, and portions are sized to each person's daily target."], ["Can different people in my house eat different amounts?", "Yes. Each person gets their own calorie target and portion size from the same recipe."]] },
  { slug: "budget", name: "Budget meal plans", title: "Budget Meal Plan: Cheap Weekly Meals & Grocery List",
    desc: "Free budget meal plan with recipes around $2.50 a serving or less, priced at Walmart, Aldi, Costco, Kroger and more, with a grocery list split for the lowest total.",
    intro: ["Feeding a household on a budget starts with knowing what the week will cost. MealTote prices every recipe at the stores you choose and splits your grocery list for the lowest total.",
      "These recipes come in around $2.50 a serving or less: hearty soups, rice and bean dishes, pasta, sheet-pan dinners and egg breakfasts. Set a weekly budget and the planner keeps the plan under it."],
    test: (r, n, c) => c.perServing > 0 && c.perServing <= 2.5,
    faq: [["Where do the prices come from?", "Typical shelf prices at 36 US chains, including Walmart, Aldi, Costco and Kroger. They're estimates, so check in-store."], ["Can it split my list between two stores?", "Yes. Choose lowest total or fewest stops and MealTote assigns each item to a store."]] },
  { slug: "quick", name: "Quick 30-minute meals", title: "30-Minute Meals: Quick Weeknight Meal Plan & Recipes",
    desc: "Free meal plan of quick recipes ready in 30 minutes or less, with nutrition, portions for your household and one grocery list.",
    intro: ["Busy weeknights need dinners that are on the table fast. Set your cooking time to 30 minutes and MealTote only plans recipes that fit.",
      "Here are recipes ready in half an hour or less, from stir-fries and tacos to pastas, bowls and breakfast sandwiches. A meal prep guide batches the chopping and sauces so the week goes even faster."],
    test: r => r.time <= 30, faq: [["Can I limit cooking time?", "Yes. Pick how long you can spend on a weeknight and the planner only uses recipes that fit."]] },
  { slug: "family", name: "Family meal plans", title: "Family Meal Plan: Kid-Friendly Weekly Dinners & Grocery List",
    desc: "Free family meal plan with familiar, kid-friendly recipes, portions sized for each person and one grocery list for your stores.",
    intro: ["Planning for a family means feeding different appetites from the same pot. Add everyone you cook for and MealTote sizes each person's portion from one recipe.",
      "These are familiar, easy dishes most kids will eat: pastas, tacos, casseroles, chicken dinners, pancakes and sandwiches, all with simple steps and normal supermarket ingredients."],
    test: (r, n) => ["american", "italian", "texmex", "mexican", "southern"].includes(CUISINE_ID(r.id)) && !(META[r.id].has || []).includes("spicy") && META[r.id].skill <= 2,
    faq: [["Can I plan for kids and adults together?", "Yes. Give each person their own calorie target; the recipe is cooked once and portioned per person."]] },
  { slug: "meal-prep", name: "Meal prep plans", title: "Meal Prep Plan: Make-Ahead Recipes That Keep All Week",
    desc: "Free meal prep plan with make-ahead recipes that keep for days and freeze well, plus a prep guide that batches the week's cooking.",
    intro: ["Meal prep works best with food that tastes as good on Thursday as on Sunday. MealTote's prep guide batches the week's chopping, sauces, marinades and grains into one or two sessions.",
      "These recipes keep at least four days in the fridge, and many freeze well: chilis, curries, grain bowls, casseroles, soups and breakfast burritos."],
    test: r => (STORAGE[r.id] || [0])[0] >= 4,
    faq: [["Does MealTote make a prep schedule?", "Yes. Every plan comes with a meal prep guide that batches the work so weeknights are mostly reheating."]] },
  { slug: "vegetarian", name: "Vegetarian meal plans", title: "Vegetarian Meal Plan: Free Weekly Meatless Recipes",
    desc: "Free vegetarian meal plan with meatless recipes, protein from beans, eggs, tofu and dairy, and a grocery list for your stores.",
    intro: ["A vegetarian week still needs enough protein. Choose vegetarian in MealTote and every planned meal is meatless, with portions sized to your calories.",
      "These recipes get their protein from beans, lentils, eggs, tofu, paneer and Greek yogurt, from shakshuka and chana masala to bean burgers and veggie fried rice."],
    test: r => META[r.id].veg, faq: [["Can I set a vegetarian or pescatarian diet?", "Yes. Pick your diet in the questions and the planner only uses recipes that fit."]] },
];

const NAV = `<nav class="snav"><a href="/recipes/">Recipes</a><a href="/meal-plans/">Meal plans</a><a href="/support">Support</a></nav>`;
const head = (title, desc, url, img, extra = "") => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:site_name" content="MealTote"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${img}"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/icons/favicon-32.png" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"><meta name="theme-color" content="#2E6B4F">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Instrument+Sans:wght@400;500;600;700&display=swap">
<style>body{margin:0;background:#F4F5F0;color:#1E2A22;font:16px/1.6 "Instrument Sans",system-ui,sans-serif}a{color:#2E6B4F}.w{max-width:960px;margin:0 auto;padding:0 16px}
header{background:#fff;border-bottom:1px solid #DCE2D8}header .w{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-block:10px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:8px;text-decoration:none;color:inherit;font:26px "Young Serif",serif}.brand b{font-weight:400;color:#2E6B4F}.brand img{width:32px;height:32px}
.snav{display:flex;gap:16px;font-weight:600}.snav a{text-decoration:none;color:#1E2A22}
.cta{background:#2E6B4F;color:#fff!important;text-decoration:none;border-radius:99px;padding:10px 18px;font-weight:600;white-space:nowrap;display:inline-block}
.crumbs{font-size:13.5px;color:#5B6B60;margin:16px 0 0}.crumbs a{color:#5B6B60}
h1{font:clamp(28px,6vw,42px)/1.15 "Young Serif",serif;margin:12px 0 8px}h2{font:24px/1.25 "Young Serif",serif;margin:30px 0 10px}h3{font:19px "Young Serif",serif;margin:0}
.hero{width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;border-radius:14px;display:block;max-width:820px}.meta{display:flex;flex-wrap:wrap;gap:8px 18px;color:#5B6B60;font-size:14.5px;margin:10px 0}
.lede{font-size:18px;color:#3C4A40;max-width:70ch}ol li,ul li{margin:6px 0}.card{background:#fff;border:1px solid #DCE2D8;border-radius:14px;padding:16px 18px;margin:18px 0}
table{border-collapse:collapse;width:100%;max-width:520px}td,th{text-align:left;padding:6px 4px;border-bottom:1px solid #E6EAE3}.note{color:#5B6B60;font-size:13.5px}
.cols{columns:2 260px;gap:24px}.cols a{display:block;padding:3px 0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:0 28px}.grid a{display:flex;gap:12px;align-items:center;padding:8px 0;border-top:1px solid #E6EAE3;text-decoration:none;color:#1E2A22}
.grid img{width:64px;height:48px;object-fit:cover;border-radius:6px;background:#E6EAE3;flex:none}.grid b{display:block;font-weight:600;font-size:15px;line-height:1.3}.grid small{color:#5B6B60;font-size:13px}
.chips{display:flex;flex-wrap:wrap;gap:8px}.chips a{border:1px solid #DCE2D8;background:#fff;border-radius:99px;padding:5px 12px;text-decoration:none;color:#1E2A22;font-size:14px}
details{background:#fff;border:1px solid #DCE2D8;border-radius:10px;padding:10px 14px;margin:8px 0;max-width:820px}summary{font-weight:600;cursor:pointer}
.rated{margin:0;color:#5B6B60}.rated .st{color:#C98A0B;letter-spacing:1px}
footer{margin:48px 0 30px;color:#5B6B60;font-size:14px;border-top:1px solid #DCE2D8;padding-top:18px;display:grid;gap:10px}footer .cols a{color:#5B6B60}</style>${extra}
</head><body><header><div class="w"><a class="brand" href="/"><img src="/icons/mark.png" alt="" width="32" height="32"><span>Meal<b>Tote</b></span></a>${NAV}<a class="cta" href="/">Plan your week free</a></div></header><main class="w">`;
const foot = `<footer><div><b>MealTote</b> is a free meal planner and grocery list: a week of meals sized for everyone you cook for, macros and high-protein options, and one shopping list split across the stores you use.</div>
<div class="cols">${GOALS.map(g => `<a href="/meal-plans/${g.slug}">${esc(g.name)}</a>`).join("")}<a href="/recipes/">All recipes</a><a href="/support">Support MealTote</a></div></footer></main></body></html>\n`;
const crumbs = list => `<nav class="crumbs" aria-label="Breadcrumb">${list.map(([n, u], i) => i < list.length - 1 ? `<a href="${u}">${esc(n)}</a> › ` : esc(n)).join("")}</nav>` +
  jsonld({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: list.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: SITE + u })) });
// one row per recipe: a small photo beside the name and what matters about it
const tile = ({ r, n }) => `<a href="/recipes/${r.id}"><img src="${thumb(r.id)}" alt="" loading="lazy" width="64" height="48"><span><b>${esc(r.title)}</b><small>${r.time} min · ${Math.round(n.kcal)} kcal · ${Math.round(n.protein)} g protein</small></span></a>`;
const itemList = (name, list) => jsonld({ "@context": "https://schema.org", "@type": "ItemList", name, itemListElement: list.map(({ r }, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/recipes/${r.id}`, name: r.title })) });
// a step's short name for search results: its first clause, kept under ~70 characters
const stepName = s => { const f = String(s).split(/(?<=[.;:])\s|,\s(?=then\b)/)[0].replace(/[.;:]$/, ""); return f.length <= 70 ? f : f.slice(0, 67).replace(/\s+\S*$/, "") + "…"; };
const iso = min => `PT${Math.floor(min / 60) ? Math.floor(min / 60) + "H" : ""}${min % 60 ? (min % 60) + "M" : ""}` || "PT0M";
const urls = [`${SITE}/`, `${SITE}/recipes/`, `${SITE}/support`];

// group by cuisine for cuisine pages and related recipes
const byCuisine = {};
for (const x of rows) (byCuisine[CUISINE_ID(x.r.id)] = byCuisine[CUISINE_ID(x.r.id)] || []).push(x);
const cuisineName = c => CUISINE_LABEL?.[c] || c;

for (const x of rows) {
  const { r, n } = x, cu = cuisine(r.id), cid = CUISINE_ID(r.id);
  const url = `${SITE}/recipes/${r.id}`, img = full(r.id);
  const desc = `${r.blurb} ${r.time} minutes, ${Math.round(n.kcal)} calories and ${Math.round(n.protein)} g protein per serving.`.slice(0, 300);
  const ings = r.ing.map(i => i[2]), pantry = r.pantry ? r.pantry.split(/,\s*/).map(x => x.trim()).filter(Boolean) : [];
  const ld = { "@context": "https://schema.org", "@type": "Recipe", name: r.title, description: r.blurb, image: [img], author: { "@type": "Organization", name: "MealTote", url: SITE },
    recipeCategory: r.meal, recipeCuisine: cu, totalTime: iso(r.time), recipeYield: `${r.serves} servings`, recipeIngredient: [...ings, ...pantry],
    recipeInstructions: r.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: stepName(s), text: s, url: `${url}#step-${i + 1}` })), keywords: [cu, r.meal, META[r.id].protein, n.protein >= 35 ? "high protein" : "", r.time <= 30 ? "30 minute" : "", "meal prep"].filter(Boolean).join(", "),
    ...(RATINGS[r.id] ? { aggregateRating: { "@type": "AggregateRating", ratingValue: +RATINGS[r.id].avg.toFixed(1), ratingCount: RATINGS[r.id].count, bestRating: 5, worstRating: 1 } } : {}),
    nutrition: { "@type": "NutritionInformation", servingSize: "1 serving", calories: `${Math.round(n.kcal)} calories`, proteinContent: `${Math.round(n.protein)} g`, carbohydrateContent: `${Math.round(n.carbs)} g`, fatContent: `${Math.round(n.fat)} g`, fiberContent: `${Math.round(n.fiber)} g`, sugarContent: `${Math.round(n.sugar)} g`, sodiumContent: `${Math.round(n.sodium)} mg` } };
  // related: same cuisine first, then same meal and main protein
  const rel = [...(byCuisine[cid] || []).filter(y => y.r.id !== r.id), ...rows.filter(y => y.r.id !== r.id && y.r.meal === r.meal && META[y.r.id].protein === META[r.id].protein && CUISINE_ID(y.r.id) !== cid)].slice(0, 8);
  const goals = GOALS.filter(g => g.test(r, n, x.c));
  const cr = credits[r.id];
  fs.writeFileSync(path.join(root, "recipes", r.id + ".html"), head(`${r.title} Recipe (${Math.round(n.kcal)} kcal, ${Math.round(n.protein)} g protein) | MealTote`, desc, url, img) +
    crumbs([["Home", "/"], ["Recipes", "/recipes/"], [cu + " recipes", `/recipes/cuisine/${cid}`], [r.title, `/recipes/${r.id}`]]) + jsonld(ld) +
    `<h1>${esc(r.title)}</h1>${RATINGS[r.id] ? starsHtml(RATINGS[r.id]) : ""}<div class="meta"><span>${esc(r.meal)}</span><span>${esc(cu)}</span><span>${r.time} min</span><span>Serves ${r.serves}</span><span>${Math.round(n.kcal)} kcal</span><span>${Math.round(n.protein)} g protein</span></div>
<img class="hero" src="/${esc(photos[r.id] || "photos/placeholder.jpg")}" alt="${esc(r.title)}" width="800" height="600">${cr ? `<p class="note">Photo: ${esc(cr.author)} · ${esc(cr.license)}${cr.page ? ` · <a href="${esc(cr.page)}" rel="nofollow noopener">source</a>` : ""}</p>` : ""}
<p class="lede">${esc(r.blurb)}</p>
<div class="card"><b>Make it part of your week.</b> MealTote sizes this recipe for everyone you cook for, adds it to a weekly meal plan and puts the ingredients on one grocery list split across your stores. <a href="/?recipe=${encodeURIComponent(r.id)}">Open it in MealTote</a></div>
<h2>Ingredients</h2><ul>${ings.map(t => `<li>${esc(t)}</li>`).join("")}</ul>${r.pantry ? `<p class="note">From your pantry: ${esc(r.pantry)}.</p>` : ""}
<h2>Instructions</h2><ol>${r.steps.map((t, i) => `<li id="step-${i + 1}">${esc(t)}</li>`).join("")}</ol>${r.tip ? `<p><b>Tip:</b> ${esc(r.tip)}</p>` : ""}
<h2>Nutrition per serving</h2><table><tr><th>Calories</th><td>${Math.round(n.kcal)}</td></tr><tr><th>Protein</th><td>${Math.round(n.protein)} g</td></tr><tr><th>Carbohydrates</th><td>${Math.round(n.carbs)} g</td></tr><tr><th>Fat</th><td>${Math.round(n.fat)} g</td></tr><tr><th>Fiber</th><td>${Math.round(n.fiber)} g</td></tr><tr><th>Sugar</th><td>${Math.round(n.sugar)} g</td></tr><tr><th>Sodium</th><td>${Math.round(n.sodium)} mg</td></tr></table>
${goals.length ? `<h2>Good for</h2><div class="chips">${goals.map(g => `<a href="/meal-plans/${g.slug}">${esc(g.name)}</a>`).join("")}<a href="/recipes/cuisine/${cid}">More ${esc(cu)} recipes</a></div>` : ""}
${r.src ? `<p class="note">Adapted from <a href="${esc(r.src[1])}" rel="nofollow noopener">${esc(r.src[0])}</a>.</p>` : ""}
<h2>You might also like</h2><div class="grid">${rel.map(tile).join("")}</div>` + foot);
  urls.push(url);
}

// cuisine pages
const regionOf = c => (CUISINE_OPTS_EXPORT.find(o => o[0] === c) || [])[2] || "";
for (const [cid, list] of Object.entries(byCuisine)) {
  const name = cuisineName(cid), sorted = list.slice().sort((a, b) => a.r.meal.localeCompare(b.r.meal) || a.r.title.localeCompare(b.r.title));
  const url = `${SITE}/recipes/cuisine/${cid}`;
  fs.writeFileSync(path.join(root, "recipes", "cuisine", cid + ".html"), head(`${name} Recipes: ${list.length} Easy Recipes with Nutrition | MealTote`,
    `${list.length} ${name} recipes with calories, protein and step-by-step instructions. Add any of them to a free weekly meal plan with one grocery list.`, url, full(sorted[0].r.id)) +
    crumbs([["Home", "/"], ["Recipes", "/recipes/"], [name + " recipes", `/recipes/cuisine/${cid}`]]) + itemList(`${name} recipes`, sorted) +
    `<h1>${esc(name)} recipes</h1><p class="lede">${list.length} ${esc(name)} recipes${regionOf(cid) ? ` from MealTote's ${esc(regionOf(cid))} collection` : ""}, each with calories, protein, ingredients and step-by-step instructions. Pick ${esc(name)} as a favorite cuisine in MealTote and the planner works more of these into your week.</p>
<p><a class="cta" href="/">Plan a week with ${esc(name)} recipes</a></p>` +
    ["Breakfast", "Lunch", "Dinner"].map(m => { const l = sorted.filter(x => x.r.meal === m); return l.length ? `<h2>${esc(name)} ${m.toLowerCase()} recipes</h2><div class="grid">${l.map(tile).join("")}</div>` : ""; }).join("") +
    `<h2>More cuisines</h2><div class="chips">${Object.keys(byCuisine).filter(c => c !== cid).sort((a, b) => cuisineName(a).localeCompare(cuisineName(b))).map(c => `<a href="/recipes/cuisine/${c}">${esc(cuisineName(c))}</a>`).join("")}</div>` + foot);
  urls.push(url);
}

// goal pages
for (const g of GOALS) {
  const list = rows.filter(x => g.test(x.r, x.n, x.c)), url = `${SITE}/meal-plans/${g.slug}`;
  const pick = m => list.filter(x => x.r.meal === m).sort((a, b) => (photos[b.r.id] ? 1 : 0) - (photos[a.r.id] ? 1 : 0) || a.r.title.localeCompare(b.r.title)).slice(0, 24);
  const shown = [...pick("Breakfast"), ...pick("Lunch"), ...pick("Dinner")];
  const faq = [...g.faq, ["Is MealTote free?", "Yes. MealTote is free with no ads and no premium tier, and you can use it without an account."]];
  fs.writeFileSync(path.join(root, "meal-plans", g.slug + ".html"), head(`${g.title} | MealTote`, g.desc, url, shown[0] ? full(shown[0].r.id) : `${SITE}/icons/icon-512.png`) +
    crumbs([["Home", "/"], ["Meal plans", "/meal-plans/"], [g.name, `/meal-plans/${g.slug}`]]) + itemList(g.name, shown) +
    jsonld({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }) +
    `<h1>${esc(g.name)}</h1>${g.intro.map((t, i) => `<p class="${i ? "" : "lede"}">${esc(t)}</p>`).join("")}
<p><a class="cta" href="/">Build my free ${esc(g.name.toLowerCase().replace(/ plans?$/, " plan").replace(/meals$/, "meal plan"))}</a></p>
<h2>How MealTote builds your plan</h2><ul><li>Answer a few questions: who's eating, calories, optional macros, foods you love, allergies, time and budget.</li><li>Get a 3, 5 or 7-day plan with portions sized for each person, and swap any meal in one tap.</li><li>Shop from one grocery list split across Walmart, Aldi, Costco, Kroger and 30+ other chains, with a meal prep guide for the week.</li></ul>` +
    ["Breakfast", "Lunch", "Dinner"].map(m => { const l = shown.filter(x => x.r.meal === m); return l.length ? `<h2>${m} ideas</h2><div class="grid">${l.map(tile).join("")}</div>` : ""; }).join("") +
    `<p class="note">${list.length} MealTote recipes fit this plan. <a href="/recipes/">Browse all recipes</a>.</p><h2>Questions</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}
<h2>Other meal plans</h2><div class="chips">${GOALS.filter(x => x !== g).map(x => `<a href="/meal-plans/${x.slug}">${esc(x.name)}</a>`).join("")}</div>` + foot);
  urls.push(url);
}

// meal plans overview
{ const url = `${SITE}/meal-plans/`;
  fs.writeFileSync(path.join(root, "meal-plans", "index.html"), head("Free Meal Plans for Every Goal: High-Protein, Budget, Weight Loss | MealTote",
    "Free weekly meal plans for high protein, weight loss, budget, family, vegetarian, quick 30-minute meals and meal prep, each with a grocery list split across your stores.", url, `${SITE}/icons/icon-512.png`) +
    crumbs([["Home", "/"], ["Meal plans", "/meal-plans/"]]) +
    `<h1>Free meal plans for every goal</h1><p class="lede">Pick a goal to see the recipes MealTote uses for it, then build your own week in about a minute: portions sized for everyone you cook for and one grocery list for your stores.</p><div class="grid">` +
    GOALS.map(g => { const l = rows.filter(x => g.test(x.r, x.n, x.c)), x = l.find(y => photos[y.r.id]) || l[0];
      return `<a href="/meal-plans/${g.slug}"><img src="${x ? thumb(x.r.id) : "/photos/placeholder.jpg"}" alt="" loading="lazy" width="64" height="48"><span><b>${esc(g.name)}</b><small>${esc(g.desc)}</small></span></a>`; }).join("") + `</div>` + foot);
  urls.push(url); }

// recipes index with search (?q=) and links to cuisines and goals
const cuisineKeys = Object.keys(byCuisine).sort((a, b) => cuisineName(a).localeCompare(cuisineName(b)));
fs.writeFileSync(path.join(root, "recipes", "index.html"), head(`${rows.length} Free Recipes with Calories & Protein | MealTote`, `Browse ${rows.length} free recipes from ${cuisineKeys.length} cuisines, each with calories, protein and step-by-step instructions, plus high-protein, budget and 30-minute meal plans.`, `${SITE}/recipes/`, `${SITE}/icons/icon-512.png`) +
  crumbs([["Home", "/"], ["Recipes", "/recipes/"]]) +
  `<h1>${rows.length} free recipes</h1><p class="lede">Weeknight classics, high-protein meal prep and dishes from ${cuisineKeys.length} cuisines, each with nutrition per serving. Open any of them in MealTote to add it to a weekly plan and one grocery list.</p>
<p><input id="q" type="search" placeholder="Search recipes, e.g. chicken, tacos, oatmeal" style="width:100%;max-width:520px;padding:10px 14px;border:1.5px solid #DCE2D8;border-radius:99px;font:inherit" aria-label="Search recipes"></p>
<h2>Meal plans</h2><div class="chips">${GOALS.map(g => `<a href="/meal-plans/${g.slug}">${esc(g.name)}</a>`).join("")}</div>
<h2>Cuisines</h2><div class="chips">${cuisineKeys.map(c => `<a href="/recipes/cuisine/${c}">${esc(cuisineName(c))} (${byCuisine[c].length})</a>`).join("")}</div>` +
  cuisineKeys.map(c => `<section data-c><h2><a href="/recipes/cuisine/${c}" style="color:inherit;text-decoration:none">${esc(cuisineName(c))}</a></h2><div class="cols">${byCuisine[c].slice().sort((a, b) => a.r.title.localeCompare(b.r.title)).map(({ r }) => `<a href="/recipes/${r.id}">${esc(r.title)}</a>`).join("")}</div></section>`).join("") +
  `<script>(function(){var i=document.getElementById("q"),q=new URLSearchParams(location.search).get("q")||"";i.value=q;function f(){var v=i.value.trim().toLowerCase();document.querySelectorAll("[data-c]").forEach(function(s){var n=0;s.querySelectorAll(".cols a").forEach(function(a){var m=!v||a.textContent.toLowerCase().indexOf(v)>=0;a.style.display=m?"":"none";if(m)n++;});s.style.display=n?"":"none";});}i.addEventListener("input",f);f();})();</script>` + foot);

// for the Backend's All photos tab
fs.writeFileSync(path.join(root, "recipes", "list.json"), JSON.stringify(rows.map(({ r }) => [r.id, r.title, r.meal, cuisine(r.id)])));

// the landing page's popular recipes: familiar dishes with photos
const POPULAR = ["spaghetti-bolognese-ragu", "chicken-pot-pie", "smash-burgers", "birria-tacos", "butter-chicken", "chicken-alfredo", "pad-thai", "philly-cheesesteak", "turkey-chorizo-egg-white-burritos", "cottage-cheese-blender-pancakes", "chicken-tikka-rice-bowls", "beef-broccoli"];
const pop = POPULAR.map(id => rows.find(x => x.r.id === id)).filter(Boolean).concat(rows.filter(x => photos[x.r.id] && ["american", "italian", "texmex"].includes(CUISINE_ID(x.r.id)))).filter((x, i, a) => a.indexOf(x) === i).slice(0, 12);
const ix = path.join(root, "index.html"); let indexHtml = fs.readFileSync(ix, "utf8");
indexHtml = indexHtml.replace(/<!--popular-->[\s\S]*?<!--\/popular-->/, "<!--popular-->" + pop.map(({ r, n }) => `<a href="/recipes/${r.id}"><img src="${thumb(r.id).slice(1)}" alt="" loading="lazy" width="64" height="48"><span><b>${esc(r.title)}</b><small>${r.time} min · ${Math.round(n.kcal)} kcal · ${Math.round(n.protein)} g protein</small></span></a>`).join("") + "<!--/popular-->");
fs.writeFileSync(ix, indexHtml);

fs.writeFileSync(path.join(root, "404.html"), head("Page not found | MealTote", "That page doesn't exist. Plan your week for free or browse recipes on MealTote.", `${SITE}/`, `${SITE}/icons/icon-512.png`, '<meta name="robots" content="noindex">') +
  `<h1>We couldn't find that page</h1><p class="lede">It may have moved. Try one of these instead:</p><p><a class="cta" href="/">Plan your week free</a></p><div class="chips"><a href="/recipes/">All recipes</a>${GOALS.map(g => `<a href="/meal-plans/${g.slug}">${esc(g.name)}</a>`).join("")}</div>` + foot);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
console.log(`wrote ${rows.length} recipe pages, ${Object.keys(byCuisine).length} cuisine pages, ${GOALS.length} meal plan pages; ${urls.length} URLs in sitemap.xml`);
