# Bundle & Bite

Meal plans that shop across more than one store. Answer a few questions and Bundle & Bite builds a week of breakfasts, lunches and dinners. The questions cover who's eating, each person's calories and (optionally) their own macros, favorite foods, cuisines, time, budget, and which stores you use. It then splits one grocery list across Trader Joe's, Aldi, Walmart and Costco, by cheapest price or fewest stops.

- 233 recipes from 16 cuisines, with protein swaps on many of them and a build-your-own breakfast sandwich. The library is browsable as markdown in [`cookbook/`](cookbook/INDEX.md).
- Swapping shows the calorie difference per serving, and what changes on each person's plate.
- Calories, macros and a full nutrition panel per serving. Portions are sized to each person's daily calories, and custom macro targets are optional.
- How long each dish keeps in the fridge and freezer, and how many meals it makes.
- A meal prep guide that batches the week's chopping, sauces, marinades and grains.
- A cookbook PDF with your plan, prep guide, cost and nutrition, every recipe and the shopping list.
- Anyone can use it. Sign in with Google to keep your plan on every device, save weeks you liked and add your own photos. Each person's data is private to them.

It's a static site: plain HTML, CSS and JavaScript with no build step and no server of your own. Google's Firebase handles sign-in and saving.

## Put it online for free

You don't need to run anything on your PC. Everything below happens in a browser. On Firebase's free **Spark** plan, which doesn't need a credit card, it costs **$0**.

| Piece | Free allowance (Spark plan, check [firebase.google.com/pricing](https://firebase.google.com/pricing)) | What Bundle & Bite uses |
| --- | --- | --- |
| Hosting | 10 GB stored, about 360 MB downloaded per day | About 17 MB of site and photos; each visit loads only the photos on screen |
| Google sign-in | Free | Signing in |
| Firestore database | 1 GB stored, 50,000 reads and 20,000 writes per day | Each person's answers, plan, saved weeks and their own photos (about 100 KB each) |

Firebase Cloud Storage now needs a billing account, so Bundle & Bite deliberately doesn't use it. People's own photos are shrunk and stored in Firestore instead.

**A domain is optional.** Your site gets a free address such as `https://bundle-and-bite.web.app` with HTTPS included. If you'd like your own name (like `bundleandbite.com`), buy one from any registrar for about $10–15 a year and connect it in step 6.

### 1. Create the Firebase project (5 minutes, all in the browser)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Create a project**. The project ID becomes your free web address, so pick a nice one. Analytics is optional; you can turn it off.
2. **Build → Authentication → Get started → Sign-in method →** enable **Google**, choose a support email and save.
3. **Build → Firestore Database → Create database.** Pick a location near you and start in **production mode**. The rules in this repo then lock each person to their own data.
4. **Project settings (gear icon) → General → Your apps →** click the **web** icon `</>`, give it a nickname and register it. Skip "Firebase Hosting setup" there. Copy the `firebaseConfig` values it shows.

### 2. Put your config in the repo

Open [`src/firebase-config.js`](src/firebase-config.js) on GitHub, click the pencil, paste your values over the `YOUR_...` placeholders and commit. Put your project ID in [`.firebaserc`](.firebaserc) the same way. These values are meant to be public, because access is controlled by [`firestore.rules`](firestore.rules).

### 3. Deploy from Google Cloud Shell (a free terminal in your browser)

Open [shell.cloud.google.com](https://shell.cloud.google.com), signed in with the same Google account, and run:

```sh
git clone https://github.com/Snooji/bundle-and-bite.git
cd bundle-and-bite
npm install -g firebase-tools      # skip if `firebase --version` already works
firebase login --no-localhost      # follow the link, paste the code back
firebase deploy                    # uploads the site and the security rules
```

It prints your live address, such as `https://YOUR_PROJECT.web.app`. Open it, sign in with Google, and you're done.

### 4. Optional: deploy automatically on every push

1. In the same Cloud Shell folder, run `firebase init hosting:github`.
2. Sign in to GitHub when asked and enter `Snooji/bundle-and-bite`. Firebase adds a secret to the repo named `FIREBASE_SERVICE_ACCOUNT_<YOUR_PROJECT_ID>`, in capitals with dashes turned into underscores, and prints its exact name.
3. Say **No** to the build-script and automatic-deployment questions, because this repo already has its own workflow. Any workflow files it writes inside Cloud Shell can be ignored.
4. On GitHub, edit [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) and replace both `secrets.FIREBASE_SERVICE_ACCOUNT` with `secrets.` plus that name.

From then on, every push to `main` publishes the site. When `firestore.rules` changes, run `firebase deploy --only firestore:rules` in Cloud Shell once more.

### 5. Let people in

Anyone with a Google account can sign in and gets their own private space. Nobody can see anyone else's plans or photos.

### 6. Optional: use your own domain

1. Buy the domain from any registrar (Cloudflare, Porkbun, Namecheap and so on).
2. In Firebase, go to **Hosting → Add custom domain**, enter it, and add the DNS records it shows at your registrar. HTTPS is set up for you; it can take up to a day.
3. In **Authentication → Settings → Authorized domains**, add the domain so Google sign-in works there.
4. Set `authDomain` in `src/firebase-config.js` to your domain, so the Google sign-in window shows your name and works in Safari, then commit.

### If more people show up than the free tier covers

Hosting downloads are the first limit you'd hit, at around a few hundred visits a day. Firebase then pauses hosting until the next day, and nothing gets billed on Spark. To go further for free, host the files on [Cloudflare Pages](https://pages.cloudflare.com), which has no download cap, and keep Firebase for sign-in and data. Add the Pages domain to Firebase's authorized domains.

## Run it on your own computer (optional, for development)

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Until a Firebase config is filled in, the app runs signed out and saves in the browser.

## Adding recipes without duplicates

- Recipes live in `src/app.js` (the original library) and the packs in [`src/recipes/`](src/recipes/). A pack is a plain data file: grocery items, their nutrition, and recipes.
- Before adding a dish, search [`cookbook/INDEX.md`](cookbook/INDEX.md). Then run:

  ```sh
  node tools/export-cookbook.mjs
  ```

  It regenerates `cookbook/`, one markdown file per recipe plus the index, and **fails if two recipes look like the same dish** (same meal and protein, mostly the same ingredients). If a flagged pair really is different, add it to `NOT_DUPES` in the script.
- Ingredient amounts are fractions of each item's standard pack, which is how cost and nutrition get calculated.
- No enchiladas. House rule.

## Project layout

```
index.html              page shell
src/app.js              recipes, pricing, nutrition, planner, prep guide, UI and PDF
src/recipes/*.js        recipe packs (breakfast, lunch, world dinners, ...)
src/app.css             styles (light and dark)
src/cloud.js            Firebase: Google sign-in and Firestore sync
src/firebase-config.js  your Firebase web config
src/photos.js           recipe photo map and credits
photos/                 recipe photos (free licenses; see CREDITS.md)
cookbook/               generated markdown: every recipe + INDEX.md
tools/export-cookbook.mjs  regenerates cookbook/ and checks for duplicates
firestore.rules         who can read and write what
```

## What gets stored

| Where (Firestore) | What | Who can read it |
| --- | --- | --- |
| `users/{uid}` | Display name, answers, current plan, swaps, checkmarks | Only that person |
| `users/{uid}/plans/{id}` | Weeks they saved | Only that person |
| `users/{uid}/photos/{recipe}` | Their own recipe photos (small JPEGs, under 900 KB) | Only that person |

People can delete all of it from their profile.

## Prices, nutrition and photos

Prices are typical shelf prices and vary by region and week, so totals are estimates. Nutrition is calculated from the ingredients and is approximate. Every bundled photo is from Wikimedia Commons under a free license. Each photo shows its author and license, and [CREDITS.md](CREDITS.md) lists them all. Dishes without a good free photo get a drawn illustration.
