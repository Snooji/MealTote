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
  addEventListener() {}, dispatchEvent() {}, setTimeout: () => 0, clearTimeout() {}, scrollTo() {},
  structuredClone, URL, URLSearchParams, Image: function () { return fake(); }, Event: function () {},
};
sandbox.window = sandbox; sandbox.self = sandbox;
vm.createContext(sandbox);
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script src="(src\/[^"]+)"><\/script>/g)].map(m => m[1]);
for (const s of scripts) vm.runInContext(fs.readFileSync(path.join(root, s), "utf8") + "\n;globalThis.__R = typeof RECIPES!=='undefined' ? {RECIPES, META, STORAGE, ITEMS, nutritionOf, recipeCost, versionsOf, CUISINE_LABEL} : globalThis.__R;", sandbox, { filename: s });
const { RECIPES, META, STORAGE, nutritionOf, recipeCost, versionsOf, CUISINE_LABEL } = sandbox.__R;
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

/* ------------------------------------------------------------------ public recipe pages for search engines
   recipes/<id>.html (served as mealtote.com/recipes/<id>), recipes/index.html, sitemap.xml.
   Each page carries schema.org Recipe data so Google can show it as a recipe result. */
const SITE = "https://mealtote.com";
const esc = s => String(s ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const pages = path.join(root, "recipes");
fs.rmSync(pages, { recursive: true, force: true }); fs.mkdirSync(pages);
const head = (title, desc, url, img) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:site_name" content="MealTote"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${img}"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/icons/favicon-32.png" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Instrument+Sans:wght@400;500;600;700&display=swap">
<style>body{margin:0;background:#F4F5F0;color:#1E2A22;font:16px/1.55 "Instrument Sans",system-ui,sans-serif}a{color:#2E6B4F}.w{max-width:820px;margin:0 auto;padding:0 16px}
header{background:#fff;border-bottom:1px solid #DCE2D8}header .w{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-block:10px}
.brand{display:flex;align-items:center;gap:8px;text-decoration:none;color:inherit;font:26px "Young Serif",serif}.brand b{font-weight:400;color:#2E6B4F}.brand img{width:32px;height:32px}
.cta{background:#2E6B4F;color:#fff!important;text-decoration:none;border-radius:99px;padding:9px 16px;font-weight:600;white-space:nowrap}
h1{font:clamp(28px,6vw,40px)/1.15 "Young Serif",serif;margin:22px 0 8px}h2{font:22px "Young Serif",serif;margin:26px 0 8px}
.hero{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:14px;display:block}.meta{display:flex;flex-wrap:wrap;gap:8px 18px;color:#5B6B60;font-size:14.5px;margin:10px 0}
.lede{font-size:18px;color:#3C4A40}ol li,ul li{margin:6px 0}.card{background:#fff;border:1px solid #DCE2D8;border-radius:14px;padding:16px 18px;margin:18px 0}
table{border-collapse:collapse;width:100%}td,th{text-align:left;padding:6px 4px;border-bottom:1px solid #E6EAE3}.note{color:#5B6B60;font-size:13.5px}
.grid{columns:2 260px;gap:24px}.grid a{display:block;padding:3px 0}footer{margin:40px 0 30px;color:#5B6B60;font-size:14px}</style>
</head><body><header><div class="w"><a class="brand" href="/"><img src="/icons/mark.png" alt="">Meal<b>Tote</b></a><a class="cta" href="/">Plan your week free</a></div></header><main class="w">`;
const foot = `<footer>MealTote is a free meal planner and grocery list that splits your shopping across the stores you use. <a href="/">Plan your week</a> · <a href="/recipes/">All recipes</a> · <a href="/support">Support</a></footer></main></body></html>\n`;
const iso = min => `PT${Math.floor(min / 60) ? Math.floor(min / 60) + "H" : ""}${min % 60 ? (min % 60) + "M" : ""}` || "PT0M";
const urls = [`${SITE}/`, `${SITE}/recipes/`, `${SITE}/support`];
for (const { r, n } of rows) {
  const url = `${SITE}/recipes/${r.id}`, img = `${SITE}/${photos[r.id] || "photos/placeholder.jpg"}`, cu = cuisine(r.id);
  const desc = `${r.blurb} ${r.time} minutes, ${Math.round(n.kcal)} calories and ${Math.round(n.protein)} g protein per serving.`.slice(0, 300);
  const ings = r.ing.map(i => i[2]), pantry = r.pantry ? r.pantry.split(/,\s*/).map(x => x.trim()).filter(Boolean) : [];
  const ld = { "@context": "https://schema.org", "@type": "Recipe", name: r.title, description: r.blurb, image: [img], author: { "@type": "Organization", name: "MealTote", url: SITE },
    recipeCategory: r.meal, recipeCuisine: cu, totalTime: iso(r.time), recipeYield: `${r.serves} servings`, recipeIngredient: [...ings, ...pantry],
    recipeInstructions: r.steps.map(s => ({ "@type": "HowToStep", text: s })), keywords: [cu, r.meal, META[r.id].protein, "meal prep"].join(", "),
    nutrition: { "@type": "NutritionInformation", calories: `${Math.round(n.kcal)} calories`, proteinContent: `${Math.round(n.protein)} g`, carbohydrateContent: `${Math.round(n.carbs)} g`, fatContent: `${Math.round(n.fat)} g`, fiberContent: `${Math.round(n.fiber)} g`, sodiumContent: `${Math.round(n.sodium)} mg` } };
  const cr = credits[r.id];
  fs.writeFileSync(path.join(pages, r.id + ".html"), head(`${r.title} Recipe | MealTote`, desc, url, img) +
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
<h1>${esc(r.title)}</h1><div class="meta"><span>${esc(r.meal)}</span><span>${esc(cu)}</span><span>${r.time} min</span><span>Serves ${r.serves}</span><span>${Math.round(n.kcal)} kcal</span><span>${Math.round(n.protein)} g protein</span></div>
<img class="hero" src="/${esc(photos[r.id] || "photos/placeholder.jpg")}" alt="${esc(r.title)}" width="800" height="600">${cr ? `<p class="note">Photo: ${esc(cr.author)} · ${esc(cr.license)}${cr.page ? ` · <a href="${esc(cr.page)}" rel="nofollow noopener">source</a>` : ""}</p>` : ""}
<p class="lede">${esc(r.blurb)}</p>
<div class="card"><b>Make it part of your week.</b> MealTote sizes this recipe for everyone you cook for, adds it to a weekly plan and puts the ingredients on one grocery list split across your stores. <a href="/?recipe=${encodeURIComponent(r.id)}">Open it in MealTote</a></div>
<h2>Ingredients</h2><ul>${ings.map(t => `<li>${esc(t)}</li>`).join("")}</ul>${r.pantry ? `<p class="note">From your pantry: ${esc(r.pantry)}.</p>` : ""}
<h2>Steps</h2><ol>${r.steps.map(t => `<li>${esc(t)}</li>`).join("")}</ol>${r.tip ? `<p><b>Tip:</b> ${esc(r.tip)}</p>` : ""}
<h2>Nutrition per serving</h2><table><tr><th>Calories</th><td>${Math.round(n.kcal)}</td></tr><tr><th>Protein</th><td>${Math.round(n.protein)} g</td></tr><tr><th>Carbs</th><td>${Math.round(n.carbs)} g</td></tr><tr><th>Fat</th><td>${Math.round(n.fat)} g</td></tr><tr><th>Fiber</th><td>${Math.round(n.fiber)} g</td></tr><tr><th>Sodium</th><td>${Math.round(n.sodium)} mg</td></tr></table>
${r.src ? `<p class="note">Adapted from <a href="${esc(r.src[1])}" rel="nofollow noopener">${esc(r.src[0])}</a>.</p>` : ""}` + foot);
  urls.push(url);
}
// recipes index, grouped by cuisine
const groups = {};
for (const { r } of rows) (groups[cuisine(r.id)] = groups[cuisine(r.id)] || []).push(r);
fs.writeFileSync(path.join(pages, "index.html"), head(`${rows.length} Free Recipes with Nutrition | MealTote`, `Browse ${rows.length} free recipes from ${Object.keys(groups).length} cuisines, each with calories, protein and a grocery list, plus high-protein meal prep ideas.`, `${SITE}/recipes/`, `${SITE}/icons/icon-512.png`) +
  `<h1>${rows.length} recipes</h1><p class="lede">Weeknight classics, high-protein meal prep and dishes from ${Object.keys(groups).length} cuisines, each with nutrition per serving. Open any of them in MealTote to plan your week and build one grocery list.</p>` +
  Object.keys(groups).sort().map(g => `<h2>${esc(g)}</h2><div class="grid">${groups[g].sort((a, b) => a.title.localeCompare(b.title)).map(r => `<a href="/recipes/${r.id}">${esc(r.title)}</a>`).join("")}</div>`).join("") + foot);
// for the Backend's All photos tab
fs.writeFileSync(path.join(pages, "list.json"), JSON.stringify(rows.map(({ r }) => [r.id, r.title, r.meal, cuisine(r.id)])));
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
console.log(`wrote ${rows.length} recipe pages to recipes/ and ${urls.length} URLs to sitemap.xml`);
