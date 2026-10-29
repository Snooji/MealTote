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
  console, document, navigator: { userAgent: "node", webdriver: true }, location: { search: "", hash: "", hostname: "localhost" }, matchMedia: () => ({ matches: false }),
  localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
  addEventListener() {}, dispatchEvent() {}, setTimeout: () => 0, clearTimeout() {}, scrollTo() {},
  structuredClone, URL, Image: function () { return fake(); }, Event: function () {},
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
