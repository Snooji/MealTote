// MealTote checkout: turns a grocery list into an Instacart shopping-list page.
// The Instacart API key lives only here (a Worker secret), never in the website.
//   POST /list  {title, items:[{name, text?, qty?, unit?}]}  ->  {url}
const ORIGINS = new Set(["https://mealtote.com", "https://www.mealtote.com", "https://mealtote-da8a7.web.app", "https://mealtote-da8a7.firebaseapp.com"]);
const UNITS = new Set(["each", "package", "pound", "ounce", "gallon", "quart", "pint", "fl oz", "can", "bunch", "head", "dozen"]);
const MAX_ITEMS = 150;

const cors = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
});
const json = (body, status, origin) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors(origin) } });
const clean = (v, n) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const allowed = ORIGINS.has(origin) || (env.ALLOW_LOCALHOST === "1" && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin));
    const url = new URL(req.url);
    if (url.pathname !== "/list") return new Response("Not found", { status: 404 });
    if (!allowed) return new Response("Forbidden", { status: 403 });
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (req.method !== "POST") return json({ error: "POST only" }, 405, origin);
    if (!env.INSTACART_API_KEY) return json({ error: "Checkout isn't set up yet." }, 503, origin);

    let body;
    try { body = await req.json(); } catch { return json({ error: "Bad JSON" }, 400, origin); }
    const items = Array.isArray(body.items) ? body.items.slice(0, MAX_ITEMS) : [];
    const line_items = items.map((it) => {
      const name = clean(it.name, 100); if (!name) return null;
      const li = { name };
      const text = clean(it.text, 140); if (text) li.display_text = text;
      const qty = Number(it.qty), unit = clean(it.unit, 12).toLowerCase();
      if (qty > 0 && qty <= 1000 && UNITS.has(unit)) li.line_item_measurements = [{ quantity: Math.round(qty * 100) / 100, unit }];
      return li;
    }).filter(Boolean);
    if (!line_items.length) return json({ error: "The list is empty." }, 400, origin);

    const payload = {
      title: clean(body.title, 80) || "My MealTote groceries",
      link_type: "shopping_list",
      line_items,
      landing_page_configuration: { partner_linkback_url: "https://mealtote.com/", enable_pantry_items: true },
    };

    // the same list gives the same page, so repeat taps don't spend API calls
    const raw = JSON.stringify(payload);
    const hash = [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw)))].map((b) => b.toString(16).padStart(2, "0")).join("");
    const cacheKey = new Request("https://cache.mealtote/list/" + hash);
    const hit = await caches.default.match(cacheKey);
    if (hit) return json({ url: (await hit.json()).url, cached: true }, 200, origin);

    const base = env.INSTACART_ENV === "prod" ? "https://connect.instacart.com" : "https://connect.dev.instacart.tools";
    const r = await fetch(base + "/idp/v1/products/products_link", {
      method: "POST",
      headers: { Authorization: "Bearer " + env.INSTACART_API_KEY, "Content-Type": "application/json", Accept: "application/json" },
      body: raw,
    });
    const out = await r.json().catch(() => ({}));
    if (!r.ok || !out.products_link_url) {
      console.log("instacart error", r.status, JSON.stringify(out).slice(0, 500));
      return json({ error: "Instacart didn't accept the list (" + r.status + ")." }, 502, origin);
    }
    await caches.default.put(cacheKey, new Response(JSON.stringify({ url: out.products_link_url }), { headers: { "Cache-Control": "max-age=86400" } }));
    return json({ url: out.products_link_url }, 200, origin);
  },
};
