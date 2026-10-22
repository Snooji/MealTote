# Bundle & Bite

Meal plans that shop across more than one store. Answer a few questions (who's eating, calories for each person, favorite foods, cuisines, time, budget, which stores you use) and Bundle & Bite builds a week of breakfasts, lunches and dinners, then splits one grocery list across Trader Joe's, Aldi, Walmart and Costco by cheapest price or fewest stops.

- 133 recipes from 16 cuisines, with protein swaps on most of them and a build-your-own breakfast sandwich (homemade turkey sausage or turkey bacon, egg and/or cheese, on homemade biscuits or English muffins)
- Calories, macros and a full nutrition panel per serving, with portions sized to each person's daily calories
- How long each dish keeps in the fridge and freezer, and how many meals it makes
- A meal prep guide that batches the week's chopping, sauces, marinades and grains into one or two sessions
- A cookbook PDF with your plan, prep guide, cost and nutrition, every recipe and the shopping list
- Sign in with Google to keep your plan on every device, save weeks you liked, and add your own recipe photos

It's a static site: plain HTML, CSS and JavaScript with no build step. Firebase handles sign-in and storage.

## Run it locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Until you add a Firebase config, the app runs signed out and saves everything in the browser.

## Turn on Google sign-in (Firebase)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com) (the free Spark plan is enough).
2. **Authentication → Sign-in method →** enable **Google**.
3. **Authentication → Settings → Authorized domains:** add the domains you'll serve from (`localhost` is already there; add your Hosting domain or custom domain).
4. **Firestore Database →** create a database in production mode.
5. **Storage →** get started (for people's own recipe photos).
6. **Project settings → Your apps →** add a **Web app** and paste its config into [`src/firebase-config.js`](src/firebase-config.js). These values are safe to commit; the security rules control access.
7. Put your project id in `.firebaserc`, then deploy the rules and the site:

   ```sh
   npm install -g firebase-tools
   firebase login
   firebase deploy
   ```

8. So people's own photos can go into their PDF, allow cross-origin reads on the Storage bucket once:

   ```sh
   gsutil cors set storage-cors.json gs://YOUR_PROJECT.appspot.com
   ```

### What gets stored

| Where | What | Who can read it |
| --- | --- | --- |
| `users/{uid}` (Firestore) | Display name, answers, current plan, swaps, checkmarks | Only that person |
| `users/{uid}/plans/{id}` (Firestore) | Weeks they saved | Only that person |
| `users/{uid}/photos/` (Storage) | Recipe photos they uploaded (images only, 5 MB max) | Only that person |

See [`firestore.rules`](firestore.rules) and [`storage.rules`](storage.rules). People can delete all of it from their profile.

### Deploy on every push (optional)

Run `firebase init hosting:github`, or add a `FIREBASE_SERVICE_ACCOUNT` repository secret with a service account key. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) skips the deploy until the secret exists.

## Project layout

```
index.html              page shell
src/app.js              recipes, pricing, nutrition, planner, prep guide, UI and PDF
src/app.css             styles (light and dark)
src/cloud.js            Firebase: Google sign-in, Firestore sync, Storage uploads
src/firebase-config.js  your Firebase web config
src/photos.js           recipe photo map and credits
photos/                 recipe photos (free licenses; see CREDITS.md)
```

## Prices and nutrition

Prices are typical shelf prices for each store and change by region and week, so treat the totals as estimates. Nutrition is calculated from the ingredients and is approximate.

## Photos

Every bundled photo is from Wikimedia Commons under a free license. Each one shows its author and license, and [CREDITS.md](CREDITS.md) lists them all. Dishes without a good free photo get a drawn illustration. Signed-in people can add their own photos.
