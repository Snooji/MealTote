# MealTote

**Free meal plans and one grocery list across the stores you actually shop at.**

Most apps that help you plan meals and shopping are freemium: the useful parts sit behind a subscription. So I made a free one. MealTote has no ads, no paywall and no premium tier, and you only need an account if you want your plan on more than one device.

Live at **[mealtote.com](https://mealtote.com)**.

## What it does

Answer a few questions and MealTote builds your week:

- **Who's eating.** Add everyone you cook for, each with their own daily calories. Portions are sized per person, so one recipe feeds a 1,700-calorie day and a 2,700-calorie day.
- **Your macros, optionally.** Set protein, carbs and fat targets for anyone tracking them. The planner leans toward dishes that fit, and your plan shows how close each day gets.
- **What you like.** Favorite foods, 50 cuisines grouped by region, dislikes, allergies, diet, how much time you have and how confident you are in the kitchen.
- **Where you shop.** Pick from 36 US grocery chains, nationwide and regional. MealTote splits one grocery list between them, either cheapest overall or fewest stops.

Then you get:

- **A week of breakfasts, lunches and dinners** from 233 recipes, with leftovers planned in if you want them.
- **Easy swaps.** Every swap opens with a "Similar calories" section. Each option shows its calorie change next to its name (green for fewer, red for more) and what changes on each person's plate. Many dishes come in other proteins, and breakfast sandwiches are build-your-own (homemade turkey sausage on homemade biscuits, anyone?).
- **Nutrition for every serving:** calories, protein, carbs, fat, fiber, sugar and sodium.
- **A grocery list by store and aisle,** with estimated prices and a weekly total.
- **A meal prep guide** that batches the week's chopping, sauces, marinades and grains into one or two sessions, so weeknights are mostly reheating.
- **Storage notes:** how long each dish keeps in the fridge and freezer, and how many meals it makes.
- **A cookbook PDF** to text, email or print: your week at a glance, the prep guide, cost and nutrition, every recipe with its photo, and the shopping list.
- **18 themes,** each in light and dark, with 12 accent colors: Market, Farmhouse, Diner, Bistro, Bento, Trattoria, Taquería, Spice Market, Citrus, Kitchen Garden, Bakery, Night Market, Butcher Block, Seafood Shack, Smokehouse, Midnight Pantry, Matcha Café and Minimal.

Every plan you make is saved in **My plans** with its own answers, groceries, swaps and checkmarks, so you can switch between weeks, rename them or delete them. Sign in with Google to keep your plans on every device and add your own photos. Your data is private to you, and you can delete all of it from your profile at any time.

## Support MealTote

MealTote is free and will stay free. If it saves you time or money, you can [chip in on the support page](https://mealtote.com/support) to help cover the domain and hosting. Sharing it with a friend helps too.

Found a bug, a price that's way off, or want a recipe or store added? [Open an issue](https://github.com/Snooji/mealtote/issues).

## A few honest notes

- Prices are estimates of typical shelf prices. Trader Joe's, Costco, Aldi and Walmart are priced item by item. Other chains are estimated from their usual price level, so check prices in-store.
- Nutrition is calculated from the ingredients and is approximate.
- Recipe photos are free-licensed from Wikimedia Commons, each credited in the app and in [CREDITS.md](CREDITS.md). Dishes without a good free photo get a drawn illustration.
- Every recipe is also readable as markdown in [`cookbook/`](cookbook/INDEX.md).

## Running your own copy

MealTote is a static site: plain HTML, CSS and JavaScript with no build step. Firebase's free plan handles sign-in and saving. [SETUP.md](SETUP.md) covers hosting it for free, connecting a domain, local development and adding recipes.
