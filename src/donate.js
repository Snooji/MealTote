// Donation settings shared by the support page (support.html) and the Backend (admin.html).
// The live settings live in Firestore at site/donations: anyone can read them, only the admin can change them
// (see firestore.rules). DEFAULT_DONATIONS is what the support page shows until that document exists or loads.
(function () {
  // how each kind of payment link is built from the handle the admin types in the Backend
  const TYPES = {
    paypal:  { name: "PayPal",          hint: "PayPal.Me name, e.g. snooji",          link: (h, amt) => `https://paypal.me/${enc(clean(h))}${amt ? "/" + amt : ""}`, amounts: true },
    cashapp: { name: "Cash App",        hint: "$Cashtag, e.g. $starsideinc",          link: (h, amt) => `https://cash.app/${enc("$" + clean(h).replace(/^\$/, ""))}${amt ? "/" + amt : ""}`, amounts: true },
    zelle:   { name: "Zelle",           hint: "Email or US phone enrolled with Zelle", link: null, amounts: false },
    venmo:   { name: "Venmo",           hint: "Venmo username, e.g. mealtote",        link: (h, amt) => `https://venmo.com/u/${enc(clean(h).replace(/^@/, ""))}${amt ? "?txn=pay&amount=" + amt : ""}`, amounts: true },
    kofi:    { name: "Ko-fi",           hint: "Ko-fi page name",                      link: h => `https://ko-fi.com/${enc(clean(h))}`, amounts: false },
    bmc:     { name: "Buy Me a Coffee", hint: "Buy Me a Coffee page name",            link: h => `https://buymeacoffee.com/${enc(clean(h))}`, amounts: false },
    link:    { name: "Other link",      hint: "Full https:// address",                link: h => /^https:\/\//i.test(clean(h)) ? clean(h) : "", amounts: false },
  };
  const clean = h => String(h || "").trim().replace(/^https?:\/\/(www\.)?(paypal\.me|cash\.app|venmo\.com\/u|ko-fi\.com|buymeacoffee\.com)\//i, "");
  const enc = s => encodeURIComponent(s).replace(/%24/g, "$");

  const DEFAULT_DONATIONS = {
    headline: "Keep it free for everyone",
    message: "If MealTote saves you a trip, a takeout order or an hour of planning, a few dollars helps cover the domain and hosting so it can stay free. Pay what you like. It's a one-time tip, not a subscription.",
    amounts: [3, 5, 10],
    methods: [
      { id: "paypal", type: "paypal", label: "PayPal", handle: "snooji", enabled: true },
      { id: "cashapp", type: "cashapp", label: "Cash App", handle: "$starsideinc", enabled: true },
      { id: "zelle", type: "zelle", label: "Zelle", handle: "starsidecollective@gmail.com", enabled: true },
    ],
    goal: { enabled: false, amount: 25, label: "Domain and hosting this month", raised: 0, month: "" },
  };

  // Firestore REST values → plain JS (the support page reads site/donations without loading the Firebase SDK)
  function fromFirestore(v) {
    if (!v || typeof v !== "object") return null;
    if ("stringValue" in v) return v.stringValue;
    if ("booleanValue" in v) return v.booleanValue;
    if ("integerValue" in v) return Number(v.integerValue);
    if ("doubleValue" in v) return v.doubleValue;
    if ("nullValue" in v) return null;
    if ("timestampValue" in v) return v.timestampValue;
    if ("arrayValue" in v) return (v.arrayValue.values || []).map(fromFirestore);
    if ("mapValue" in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, fromFirestore(x)]));
    return null;
  }

  // fills gaps and drops anything malformed, so a half-edited document can't break the support page
  function normalize(d) {
    d = Object.assign({}, DEFAULT_DONATIONS, d || {});
    d.amounts = (Array.isArray(d.amounts) ? d.amounts : DEFAULT_DONATIONS.amounts).map(Number).filter(n => n > 0 && n <= 1000).slice(0, 6);
    d.methods = (Array.isArray(d.methods) ? d.methods : []).filter(m => m && TYPES[m.type] && String(m.handle || "").trim()).map(m => ({
      id: String(m.id || m.type), type: m.type, label: String(m.label || TYPES[m.type].name).slice(0, 40),
      handle: String(m.handle).trim().slice(0, 200), enabled: m.enabled !== false,
    }));
    d.goal = Object.assign({}, DEFAULT_DONATIONS.goal, d.goal || {});
    d.goal.amount = Math.max(1, Number(d.goal.amount) || DEFAULT_DONATIONS.goal.amount);
    d.goal.raised = Math.max(0, Number(d.goal.raised) || 0);
    return d;
  }

  async function load(firebaseConfig) {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/site/donations?key=${firebaseConfig.apiKey}`;
      const r = await fetch(url, { cache: "no-store" });
      if (r.status === 404) return normalize(DEFAULT_DONATIONS);
      if (!r.ok) throw new Error("HTTP " + r.status);
      const doc = await r.json();
      return normalize(fromFirestore({ mapValue: { fields: doc.fields || {} } }));
    } catch (e) {
      return normalize(DEFAULT_DONATIONS);
    }
  }

  const monthKey = (t = new Date()) => `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`;

  window.DONATE = { TYPES, DEFAULT_DONATIONS, normalize, load, monthKey };
})();
