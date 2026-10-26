// MealTote theme: a mode (auto / light / dark), a style and an accent colour, chosen independently.
// Runs in <head> before the stylesheets apply, so the first paint is already themed.
// Sets <html data-mode data-style data-accent> for src/themes.css and loads each style's fonts on demand.
(function () {
  const KEY = "mealtote-theme";
  const DEFAULT = { mode: "auto", style: "market", accent: "style" };
  // [id, name, one-line description, Google Fonts families]
  const STYLES = [
    ["market", "Market", "Fresh greens, the original", "Young+Serif&family=Instrument+Sans:wght@400;500;600;700"],
    ["farmhouse", "Farmhouse", "Linen, gingham and a soft serif", "Fraunces:wght@600&family=Nunito+Sans:wght@400;600;700"],
    ["diner", "Diner", "Chrome, checkerboard and neon", "Righteous&family=Rubik:wght@400;500;600;700"],
    ["bistro", "Bistro", "Chalkboard menu, printed carte", "Playfair+Display:ital,wght@1,600&family=Lato:wght@400;700"],
    ["bento", "Bento", "Washi paper, sumi ink, red stamp", "Shippori+Mincho:wght@600&family=Zen+Kaku+Gothic+New:wght@400;500;700"],
    ["trattoria", "Trattoria", "Terracotta and red-check cloth", "Cormorant+Garamond:wght@700&family=Source+Sans+3:wght@400;600;700"],
    ["taqueria", "Taquería", "Papel picado brights", "Bowlby+One&family=Rubik:wght@400;500;600;700"],
    ["spice", "Spice Market", "Saffron, cardamom and tilework", "Marcellus&family=Mulish:wght@400;600;700"],
    ["citrus", "Citrus", "Lemon, lime, grapefruit", "Baloo+2:wght@700&family=Nunito:wght@400;600;700"],
    ["garden", "Kitchen Garden", "Herbs and leaf veins", "Lora:wght@600&family=Karla:wght@400;600;700"],
    ["bakery", "Bakery", "Flour dust and pastel icing", "Grandstander:wght@700&family=Quicksand:wght@500;600;700"],
    ["nightmarket", "Night Market", "Neon signs over steam", "Bungee&family=Space+Grotesk:wght@400;500;600;700"],
    ["butcher", "Butcher Block", "End-grain wood, kraft paper", "Alfa+Slab+One&family=Archivo:wght@400;500;600;700"],
    ["coastal", "Seafood Shack", "Harbor navy and sea glass", "Josefin+Sans:wght@700&family=Work+Sans:wght@400;500;600;700"],
    ["smokehouse", "Smokehouse", "Charcoal, embers, woodcut type", "Rye&family=Barlow:wght@400;500;600;700"],
    ["pantry", "Midnight Pantry", "Plum jars and brass labels", "DM+Serif+Display&family=DM+Sans:wght@400;500;600;700"],
    ["matcha", "Matcha Café", "Whisked tea and ceramic", "Zen+Maru+Gothic:wght@400;500;700"],
    ["minimal", "Minimal", "Black, white and one colour", "Inter:wght@400;500;600;700;800"],
  ];
  // [id, name, swatch (light-mode colour)]
  const ACCENTS = [
    ["style", "Style's own", ""], ["basil", "Basil", "#2E6A4E"], ["tomato", "Tomato", "#B3261E"], ["carrot", "Carrot", "#A8430B"],
    ["saffron", "Saffron", "#8A5A00"], ["avocado", "Avocado", "#4D6B12"], ["mint", "Mint", "#0F7466"], ["ocean", "Ocean", "#0B6690"],
    ["blueberry", "Blueberry", "#3949AB"], ["lavender", "Lavender", "#6243B0"], ["plum", "Plum", "#7B1FA2"], ["beet", "Beet", "#9C1C54"],
    ["espresso", "Espresso", "#5D4037"],
  ];
  const ids = a => a.map(x => x[0]);
  const darkQuery = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;

  function clean(t) {
    t = Object.assign({}, DEFAULT, t || {});
    if (!["auto", "light", "dark"].includes(t.mode)) t.mode = DEFAULT.mode;
    if (!ids(STYLES).includes(t.style)) t.style = DEFAULT.style;
    if (!ids(ACCENTS).includes(t.accent)) t.accent = DEFAULT.accent;
    return { mode: t.mode, style: t.style, accent: t.accent };
  }
  function get() { try { return clean(JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return clean(); } }
  function loadFonts(style) {
    const s = STYLES.find(x => x[0] === style); if (!s || document.getElementById("tf-" + style)) return;
    const l = document.createElement("link"); l.rel = "stylesheet"; l.id = "tf-" + style;
    l.href = "https://fonts.googleapis.com/css2?family=" + s[3] + "&display=swap"; document.head.append(l);
  }
  function apply(t) {
    t = clean(t || get()); const r = document.documentElement;
    const dark = t.mode === "dark" || (t.mode === "auto" && !!(darkQuery && darkQuery.matches));
    r.dataset.mode = dark ? "dark" : "light"; r.dataset.style = t.style; r.dataset.accent = t.accent; r.style.colorScheme = dark ? "dark" : "light";
    loadFonts(t.style);
    (window.requestAnimationFrame || setTimeout)(() => { const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = getComputedStyle(r).getPropertyValue("--surface").trim() || m.content; });
    return t;
  }
  function set(patch, quiet) {
    const t = clean(Object.assign(get(), patch));
    try { localStorage.setItem(KEY, JSON.stringify(t)); } catch (e) {}
    apply(t); if (!quiet) window.dispatchEvent(new CustomEvent("themechange", { detail: t }));
    return t;
  }
  if (darkQuery && darkQuery.addEventListener) darkQuery.addEventListener("change", () => { if (get().mode === "auto") apply(); });
  window.THEME = { get, set, apply, loadFonts, STYLES, ACCENTS, loadAllFonts: () => STYLES.forEach(s => loadFonts(s[0])) };
  apply();
})();
