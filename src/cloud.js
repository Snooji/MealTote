// Firebase layer: Google sign-in plus Firestore for profiles, plans and people's own recipe photos.
// Everything here fits Firebase's free Spark plan (no Cloud Storage, which now needs a billing account).
// The app works without this (signed out, saved in the browser). It switches on once
// src/firebase-config.js holds a real Firebase web config.
import { firebaseConfig } from "./firebase-config.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
const configured = !!(firebaseConfig && firebaseConfig.apiKey && !String(firebaseConfig.apiKey).startsWith("YOUR_"));

let api = { enabled: false, user: null };

if (configured) {
  try {
    const { initializeApp } = await import(`${SDK}/firebase-app.js`);
    const { initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, browserPopupRedirectResolver, getRedirectResult, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged } = await import(`${SDK}/firebase-auth.js`);
    const { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } = await import(`${SDK}/firebase-firestore.js`);

    const app = initializeApp(firebaseConfig);
    // stay signed in on this device until you sign out (IndexedDB, falling back to localStorage)
    const auth = initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence], popupRedirectResolver: browserPopupRedirectResolver });
    const db = getFirestore(app);
    // finishing a redirect sign-in: surface a failure instead of silently landing signed out
    getRedirectResult(auth).catch(e => window.dispatchEvent(new CustomEvent("cloud-error", { detail: e })));
    const userDoc = () => doc(db, "users", api.user.uid);
    const plansCol = () => collection(db, "users", api.user.uid, "plans");

    api = {
      enabled: true,
      user: null,
      async signIn() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try { await signInWithPopup(auth, provider); }
        catch (e) {
          if (["auth/popup-blocked", "auth/operation-not-supported-in-this-environment"].includes(e.code)) await signInWithRedirect(auth, provider);
          else if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") throw e;
        }
      },
      signOut: () => signOut(auth),
      onUser(cb) { return onAuthStateChanged(auth, u => { api.user = u; cb(u); }); },

      // profile + current state live on users/{uid}
      async load() { const s = await getDoc(userDoc()); return s.exists() ? s.data() : null; },
      async save(stateJson, updatedMs) {
        const u = api.user;
        await setDoc(userDoc(), { state: stateJson, updatedMs, email: u.email || "", googleName: u.displayName || "", googlePhoto: u.photoURL || "", updatedAt: serverTimestamp() }, { merge: true });
      },
      async saveProfile(fields) { await setDoc(userDoc(), { ...fields, updatedAt: serverTimestamp() }, { merge: true }); },
      async ensureProfile() {
        const s = await getDoc(userDoc());
        if (!s.exists() || !s.data().createdAt) await setDoc(userDoc(), { createdAt: serverTimestamp(), displayName: api.user.displayName || "" }, { merge: true });
      },

      // saved plans: users/{uid}/plans/{id}
      async savePlan(name, stateJson) { const r = await addDoc(plansCol(), { name, state: stateJson, createdMs: Date.now(), createdAt: serverTimestamp() }); return r.id; },
      async listPlans() { const q = await getDocs(query(plansCol(), orderBy("createdMs", "desc"), limit(50))); return q.docs.map(d => ({ id: d.id, ...d.data() })); },
      // My plans: each plan keeps its own doc, written in place so edits update it
      async putPlan(id, data) { await setDoc(doc(db, "users", api.user.uid, "plans", id), { ...data, updatedAt: serverTimestamp() }, { merge: true }); },
      async deletePlan(id) { await deleteDoc(doc(db, "users", api.user.uid, "plans", id)); },

      // your own recipe photos: users/{uid}/photos/{recipeId} holds a small JPEG data URL (under Firestore's 1 MB limit)
      async savePhoto(recipeId, dataUrl) {
        await setDoc(doc(db, "users", api.user.uid, "photos", recipeId.replace(/[^a-z0-9~-]/gi, "_")), { data: dataUrl, updatedMs: Date.now() });
      },
      async loadPhotos() {
        const q = await getDocs(collection(db, "users", api.user.uid, "photos"));
        return Object.fromEntries(q.docs.map(d => [d.id, d.data().data]));
      },

      // "Delete my data": plans, photos, then the profile itself
      async deleteAll() {
        for (const p of await api.listPlans()) await api.deletePlan(p.id);
        for (const d of (await getDocs(collection(db, "users", api.user.uid, "photos"))).docs) await deleteDoc(d.ref);
        await deleteDoc(userDoc());
      },
    };
  } catch (e) {
    console.warn("Firebase didn't start; running signed-out only.", e);
    api = { enabled: false, user: null, error: String(e) };
  }
}

window.cloud = api;
window.dispatchEvent(new Event("cloud-ready"));
