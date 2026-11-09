# Checkout worker (Instacart)

Turns a MealTote grocery list into an Instacart shopping-list page. People pick a store and pay on Instacart.
The Instacart key lives only in this Cloudflare Worker, never in the website.

## One-time setup
1. Instacart: sign up at the Instacart Developer Platform and create a **development** API key.
2. Cloudflare (free): create an account, then a **Workers** API token ("Edit Cloudflare Workers" template). Note your Account ID.
3. GitHub → Snooji/MealTote → Settings → Secrets and variables → Actions:
   - Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `INSTACART_API_KEY`
   - Run the "Deploy checkout worker" action. Its log prints the worker address (`https://mealtote-checkout.<you>.workers.dev`).
   - Variable: `CHECKOUT_URL` = that address, then re-run "Deploy to Firebase Hosting". The "Shop on Instacart" buttons appear.
4. When Instacart approves the production key: replace the `INSTACART_API_KEY` secret, add the variable `INSTACART_ENV` = `prod`, and re-run the worker action.

Until `CHECKOUT_URL` is set, the buttons stay hidden.
