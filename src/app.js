/* ------------------------------------------------------------------ stores & catalog */
// The first four have hand-entered prices. The rest are priced from their typical price level (idx, vs. an average
// supermarket = 1.00) using the assortment they most resemble; see "priced stores" below.
// regions: where the chain mostly operates ("all" = nationwide). also: sister banners that share prices.
const REGIONS = [["all","Anywhere in the US"],["northeast","Northeast & Mid-Atlantic"],["southeast","Southeast"],["midwest","Midwest"],["southcentral","Texas & South Central"],["mountain","Mountain West"],["west","West Coast"]];
const STORE_KIND = {mass:"Big-box", super:"Supermarket", discount:"Discount grocer", club:"Warehouse club", specialty:"Natural & specialty"};
const STORES = {
  tj:      {name:"Trader Joe's", short:"TJ", css:"--tj",      pdf:[184,67,47],  kind:"specialty", regions:"all"},
  costco:  {name:"Costco",       short:"CO", css:"--costco",  pdf:[44,74,138],  kind:"club",      regions:"all"},
  aldi:    {name:"Aldi",         short:"AL", css:"--aldi",    pdf:[217,116,26], kind:"discount",  regions:"all"},
  walmart: {name:"Walmart",      short:"WM", css:"--walmart", pdf:[30,138,156], kind:"mass",      regions:"all"},
  target:      {name:"Target",               short:"TG", color:"#C8102E", kind:"mass",      idx:1.04, regions:"all"},
  kroger:      {name:"Kroger",               short:"KR", color:"#1F4E9C", kind:"super",     idx:1.00, regions:"midwest southeast southcentral mountain west", also:"Ralphs, Fred Meyer, King Soopers, Fry's, Smith's, Dillons, QFC, Harris Teeter, Mariano's, Pick 'n Save, Food 4 Less"},
  safeway:     {name:"Safeway / Albertsons", short:"SA", color:"#D52B1E", kind:"super",     idx:1.12, regions:"west mountain southcentral midwest northeast", also:"Vons, Jewel-Osco, Acme, Shaw's, Star Market, Randalls, Tom Thumb, Pavilions"},
  amazonfresh: {name:"Amazon Fresh",         short:"AF", color:"#00A8E1", kind:"super",     idx:1.02, regions:"all", also:"delivery or pickup"},
  wholefoods:  {name:"Whole Foods",          short:"WF", color:"#00674B", kind:"specialty", idx:1.32, regions:"all"},
  sams:        {name:"Sam's Club",           short:"SC", color:"#0060A9", kind:"club",      idx:0.97, regions:"all"},
  bjs:         {name:"BJ's Wholesale",       short:"BJ", color:"#B5121B", kind:"club",      idx:1.00, regions:"northeast southeast midwest"},
  lidl:        {name:"Lidl",                 short:"LI", color:"#0050AA", kind:"discount",  idx:1.02, regions:"northeast southeast"},
  savealot:    {name:"Save A Lot",           short:"SL", color:"#E4002B", kind:"discount",  idx:1.06, regions:"northeast southeast midwest southcentral"},
  publix:      {name:"Publix",               short:"PX", color:"#3E8E2F", kind:"super",     idx:1.16, regions:"southeast"},
  heb:         {name:"H-E-B",                short:"HE", color:"#E31837", kind:"super",     idx:0.93, regions:"southcentral", also:"Central Market, Joe V's"},
  meijer:      {name:"Meijer",               short:"MJ", color:"#E21A2C", kind:"mass",      idx:0.98, regions:"midwest"},
  hyvee:       {name:"Hy-Vee",               short:"HV", color:"#C8102E", kind:"super",     idx:1.05, regions:"midwest"},
  wegmans:     {name:"Wegmans",              short:"WG", color:"#2E6B3F", kind:"super",     idx:1.04, regions:"northeast"},
  stopshop:    {name:"Stop & Shop",          short:"SS", color:"#E2231A", kind:"super",     idx:1.10, regions:"northeast"},
  giant:       {name:"Giant",                short:"GI", color:"#6C2C91", kind:"super",     idx:1.08, regions:"northeast", also:"Giant Food, The Giant Company, Martin's"},
  gianteagle:  {name:"Giant Eagle",          short:"GE", color:"#E31837", kind:"super",     idx:1.06, regions:"midwest northeast", also:"Market District"},
  shoprite:    {name:"ShopRite",             short:"SR", color:"#D6001C", kind:"super",     idx:1.02, regions:"northeast"},
  marketbasket:{name:"Market Basket",        short:"MB", color:"#C8102E", kind:"super",     idx:0.90, regions:"northeast"},
  hannaford:   {name:"Hannaford",            short:"HN", color:"#B0181F", kind:"super",     idx:1.06, regions:"northeast"},
  foodlion:    {name:"Food Lion",            short:"FL", color:"#1D5BA8", kind:"super",     idx:0.99, regions:"southeast"},
  winndixie:   {name:"Winn-Dixie",           short:"WD", color:"#D5232B", kind:"super",     idx:1.05, regions:"southeast"},
  ingles:      {name:"Ingles",               short:"IN", color:"#00529B", kind:"super",     idx:1.03, regions:"southeast"},
  sprouts:     {name:"Sprouts",              short:"SP", color:"#4C8C2B", kind:"specialty", idx:1.15, regions:"west mountain southcentral southeast"},
  winco:       {name:"WinCo Foods",          short:"WC", color:"#D71920", kind:"super",     idx:0.86, regions:"west mountain southcentral"},
  smartfinal:  {name:"Smart & Final",        short:"SF", color:"#E31837", kind:"super",     idx:0.96, regions:"west"},
  staterbros:  {name:"Stater Bros.",         short:"ST", color:"#D2232A", kind:"super",     idx:0.98, regions:"west"},
  raleys:      {name:"Raley's",              short:"RA", color:"#C41230", kind:"super",     idx:1.12, regions:"west"},
  schnucks:    {name:"Schnucks",             short:"SN", color:"#DA291C", kind:"super",     idx:1.05, regions:"midwest"},
  weis:        {name:"Weis Markets",         short:"WS", color:"#E31837", kind:"super",     idx:1.03, regions:"northeast"},
  foodcity:    {name:"Food City",            short:"FC", color:"#D71920", kind:"super",     idx:1.02, regions:"southeast"},
  brookshire:  {name:"Brookshire's",         short:"BR", color:"#0B4EA2", kind:"super",     idx:1.04, regions:"southcentral", also:"Super 1 Foods"},
};
for(const st of Object.values(STORES)){ if(st.color){ st.pdf=hexToRgb(st.color); } }
const STORE_IDS = Object.keys(STORES);
(function(){ const css=[]; for(const [k,st] of Object.entries(STORES)) if(st.color){ st.css="--st-"+k; css.push(`--st-${k}:${st.color}`); }
  const tag=document.createElement("style"); tag.textContent=":root{"+css.join(";")+"}"; document.head.append(tag); })();
const AISLES = ["Produce","Meat & Seafood","Dairy & Eggs","Bakery & Tortillas","Pantry","Sauces & Spices","International","Frozen"];

// item: [display name, aisle, {store: [product, est. price, units (how many "standard packs" it covers)]}]
const ITEMS = {
  chicken_thigh:["Boneless chicken thighs","Meat & Seafood",{tj:["Boneless Skinless Chicken Thighs (~1.5 lb)",7.49,1],costco:["Kirkland Boneless Skinless Thighs (~4.5 lb)",19.99,3],aldi:["Kirkwood Boneless Skinless Thighs (~1.5 lb)",5.99,1],walmart:["Boneless Skinless Chicken Thighs (~1.5 lb)",6.48,1]}],
  chicken_breast:["Chicken breasts","Meat & Seafood",{tj:["Organic Chicken Breasts (~1.5 lb)",11.49,1],costco:["Kirkland Boneless Chicken Breasts (~6 lb)",21.99,4],aldi:["Kirkwood Boneless Chicken Breasts (~1.5 lb)",5.49,1],walmart:["Boneless Skinless Chicken Breasts (~1.5 lb)",6.12,1]}],
  rotisserie:["Rotisserie chicken","Meat & Seafood",{tj:["Just Chicken, grilled & sliced (12 oz)",6.99,0.6],costco:["Kirkland Rotisserie Chicken (3 lb)",4.99,1],aldi:["Rotisserie Chicken (2 lb)",5.99,0.75],walmart:["Marketside Rotisserie Chicken (2.25 lb)",6.97,0.8]}],
  shrimp:["Raw shrimp, peeled","Meat & Seafood",{tj:["Raw Argentinian Red Shrimp (1 lb)",11.99,1],costco:["Kirkland Raw Shrimp, peeled & deveined (2 lb)",19.99,2],aldi:["Fremont Fish Market Raw Shrimp (1 lb)",7.99,1],walmart:["Great Value Raw Shrimp, peeled (1 lb)",8.47,1]}],
  salmon:["Salmon fillet","Meat & Seafood",{tj:["Atlantic Salmon Fillet (~1.25 lb)",13.99,1],costco:["Kirkland Atlantic Salmon Fillet (~3 lb)",29.99,2.4],aldi:["Fremont Fish Market Atlantic Salmon (1.25 lb)",10.49,1],walmart:["Atlantic Salmon Fillets (1.25 lb)",11.98,1]}],
  ground_beef:["Ground beef","Meat & Seafood",{tj:["Organic Ground Beef 85/15 (1 lb)",6.99,1],costco:["Kirkland Ground Beef 88/12 (~4.5 lb)",22.49,4.5],aldi:["Ground Beef 80/20 (1 lb)",4.99,1],walmart:["Ground Beef 80/20 (1 lb)",5.47,1]}],
  sirloin:["Top sirloin steak","Meat & Seafood",{tj:["Grass-Fed Sirloin Steak (~1 lb)",9.99,0.67],costco:["USDA Choice Top Sirloin (~3.5 lb)",34.99,2.33],aldi:["USDA Choice Top Sirloin (~1.5 lb)",13.49,1],walmart:["Top Sirloin Steak Value Pack (~1.5 lb)",14.47,1]}],
  pork_tenderloin:["Pork tenderloin","Meat & Seafood",{tj:["Pork Tenderloin, plain (~1.25 lb)",7.49,1],costco:["Pork Tenderloin, 2-pack (~3 lb)",14.99,2.4],aldi:["Pork Tenderloin (~1.25 lb)",5.49,1],walmart:["Pork Tenderloin (~1.25 lb)",6.24,1]}],
  italian_sausage:["Italian sausage","Meat & Seafood",{tj:["Sweet Italian Chicken Sausage (12 oz)",4.99,1],costco:["Italian Sausage Links (~3 lb)",13.99,3],aldi:["Italian Sausage (16 oz)",3.99,1],walmart:["Great Value Italian Sausage (16 oz)",3.97,1]}],
  pepperoni:["Pepperoni","Meat & Seafood",{tj:["Uncured Pepperoni (6 oz)",3.99,1],costco:["Kirkland Pepperoni (2 x 1 lb)",11.99,5.3],aldi:["Mama Cozzi's Pepperoni (6 oz)",2.29,1],walmart:["Great Value Pepperoni (6 oz)",2.48,1]}],
  eggs:["Large eggs","Dairy & Eggs",{tj:["Pasture Raised Eggs (12)",4.99,1],costco:["Kirkland Cage-Free Eggs (24)",7.99,2],aldi:["Goldhen Large Eggs (12)",2.89,1],walmart:["Great Value Large Eggs (12)",3.18,1]}],
  greek_yogurt:["Plain Greek yogurt","Dairy & Eggs",{tj:["Plain Greek Nonfat Yogurt (32 oz)",4.99,1],costco:["Kirkland Greek Yogurt (48 oz)",6.99,1.5],aldi:["Friendly Farms Plain Greek Yogurt (32 oz)",3.79,1],walmart:["Great Value Plain Greek Yogurt (32 oz)",4.24,1]}],
  milk:["Milk","Dairy & Eggs",{tj:["Organic Whole Milk (half gallon)",4.29,1],costco:["Kirkland 2% Milk (2 x 1 gal)",6.49,4],aldi:["Friendly Farms 2% Milk (half gallon)",1.99,1],walmart:["Great Value 2% Milk (half gallon)",2.12,1]}],
  butter:["Butter","Dairy & Eggs",{tj:["Unsalted Butter (1 lb)",4.49,1],costco:["Kirkland Salted Butter (4 lb)",13.99,4],aldi:["Countryside Creamery Butter (1 lb)",3.69,1],walmart:["Great Value Butter (1 lb)",3.97,1]}],
  sour_cream:["Sour cream","Dairy & Eggs",{tj:["Sour Cream (16 oz)",2.49,1],costco:["Daisy Sour Cream (3 lb)",6.49,3],aldi:["Friendly Farms Sour Cream (16 oz)",1.69,1],walmart:["Great Value Sour Cream (16 oz)",1.98,1]}],
  cheese_mex:["Shredded Mexican cheese","Dairy & Eggs",{tj:["Shredded Mexican Blend (12 oz)",4.49,1.5],costco:["Kirkland Shredded Mexican Blend (2.5 lb)",11.49,5],aldi:["Happy Farms Shredded Mexican Blend (8 oz)",2.15,1],walmart:["Great Value Shredded Mexican Blend (8 oz)",2.37,1]}],
  mozzarella:["Shredded mozzarella","Dairy & Eggs",{tj:["Shredded Mozzarella (12 oz)",4.29,1.5],costco:["Kirkland Shredded Mozzarella (5 lb)",17.99,10],aldi:["Happy Farms Shredded Mozzarella (8 oz)",2.15,1],walmart:["Great Value Shredded Mozzarella (8 oz)",2.37,1]}],
  parmesan:["Parmesan","Dairy & Eggs",{tj:["Shaved Parmesan (6 oz)",4.49,1.2],costco:["Kirkland Parmigiano Reggiano (~1.5 lb)",18.99,4.8],aldi:["Specially Selected Shredded Parmesan (5 oz)",2.79,1],walmart:["Great Value Grated Parmesan (5 oz)",2.97,1]}],
  feta:["Feta crumbles","Dairy & Eggs",{tj:["Crumbled Feta (6 oz)",3.49,1],costco:["Feta Crumbles (2 x 12 oz)",8.99,4],aldi:["Happy Farms Feta Crumbles (6 oz)",2.49,1],walmart:["Great Value Feta Crumbles (6 oz)",2.84,1]}],
  tzatziki:["Tzatziki","Dairy & Eggs",{tj:["Tzatziki Creamy Garlic Cucumber Dip (12 oz)",3.49,1],aldi:["Park Street Deli Tzatziki (10 oz)",2.79,0.85],walmart:["Marketside Tzatziki Dip (10 oz)",3.48,0.85]}],
  hummus:["Hummus","Dairy & Eggs",{tj:["Mediterranean Hummus (16 oz)",3.79,1.6],costco:["Sabra Classic Hummus (32 oz)",7.49,3.2],aldi:["Park Street Deli Classic Hummus (10 oz)",2.29,1],walmart:["Marketside Classic Hummus (10 oz)",2.68,1]}],
  kimchi:["Kimchi","Dairy & Eggs",{tj:["Kimchi (10 oz)",3.49,0.65],costco:["Jongga Mat Kimchi (2 x 16 oz)",11.99,2],walmart:["Mother-In-Law's Kimchi (16 oz)",6.98,1]}],

  broccoli:["Broccoli","Produce",{tj:["Broccoli Florets (12 oz)",2.99,0.75],costco:["Broccoli Florets (3 lb)",6.49,3],aldi:["Broccoli Crowns (1 lb)",1.59,1],walmart:["Fresh Broccoli Crowns (~1 lb)",1.88,1]}],
  green_onion:["Green onions","Produce",{tj:["Green Onions (bunch)",1.29,1],aldi:["Green Onions (bunch)",0.79,1],walmart:["Green Onions (bunch)",0.98,1]}],
  garlic:["Garlic","Produce",{tj:["Garlic (3 bulbs)",1.99,1],costco:["Peeled Garlic Cloves (3 lb)",9.99,6],aldi:["Garlic (3 bulbs)",1.49,1],walmart:["Garlic (3 bulbs)",1.48,1]}],
  onion:["Yellow onions","Produce",{tj:["Yellow Onions (2 lb bag)",2.29,0.67],costco:["Yellow Onions (10 lb)",8.99,3.33],aldi:["Yellow Onions (3 lb)",2.29,1],walmart:["Yellow Onions (3 lb)",2.97,1]}],
  cilantro:["Cilantro","Produce",{tj:["Cilantro (2 oz)",1.99,1],aldi:["Cilantro (bunch)",0.89,1],walmart:["Cilantro (bunch)",0.68,1]}],
  lemon:["Lemons","Produce",{tj:["Lemons (2 lb bag)",3.99,1],costco:["Lemons (5 lb)",6.99,2.5],aldi:["Lemons (2 lb bag)",2.99,1],walmart:["Lemons (2 lb bag)",3.47,1]}],
  lime:["Limes","Produce",{tj:["Limes (1 lb bag)",2.49,1],costco:["Limes (3 lb)",5.49,3],aldi:["Limes (2 lb bag)",2.19,2],walmart:["Limes (1 lb bag)",1.98,1]}],
  avocado:["Avocados","Produce",{tj:["Avocados (4 ct bag)",3.99,1],costco:["Hass Avocados (5 ct)",6.49,1.25],aldi:["Avocados (4 ct bag)",2.99,1],walmart:["Hass Avocados (4 ct bag)",3.48,1]}],
  spinach:["Baby spinach","Produce",{tj:["Organic Baby Spinach (6 oz)",2.49,0.6],costco:["Organic Baby Spinach (1 lb)",4.99,1.6],aldi:["Simply Nature Organic Baby Spinach (10 oz)",2.89,1],walmart:["Marketside Baby Spinach (10 oz)",2.98,1]}],
  kale:["Chopped kale","Produce",{tj:["Organic Tuscan Kale (10 oz)",2.49,1],aldi:["Little Salad Bar Chopped Kale (10 oz)",1.99,1],walmart:["Marketside Chopped Kale (10 oz)",2.48,1]}],
  mixed_greens:["Spring mix","Produce",{tj:["Spring Mix (5 oz)",2.29,0.5],costco:["Organic Spring Mix (1 lb)",4.99,1.6],aldi:["Little Salad Bar Spring Mix (5 oz)",1.99,0.5],walmart:["Marketside Spring Mix (10 oz)",3.98,1]}],
  cherry_tomatoes:["Cherry tomatoes","Produce",{tj:["Cherry Tomatoes (pint)",2.99,1],costco:["Cherub Tomatoes (2 lb)",6.49,2.6],aldi:["Cherry Tomatoes (pint)",1.99,1],walmart:["Grape Tomatoes (pint)",2.48,1]}],
  cucumber:["Cucumber","Produce",{tj:["Persian Cucumbers (1 lb)",2.99,2],costco:["Mini Cucumbers (2 lb)",5.99,4],aldi:["English Cucumber",1.19,1],walmart:["English Cucumber",1.42,1]}],
  bell_peppers:["Bell peppers","Produce",{tj:["Bell Peppers (3 ct)",3.49,1],costco:["Bell Peppers (6 ct)",7.99,2],aldi:["Tri-Color Bell Peppers (3 ct)",2.99,1],walmart:["Tri-Color Bell Peppers (3 ct)",3.97,1]}],
  carrots:["Carrots","Produce",{tj:["Carrots (1 lb)",1.29,0.5],costco:["Organic Carrots (10 lb)",8.99,5],aldi:["Carrots (2 lb)",1.49,1],walmart:["Carrots (2 lb)",1.62,1]}],
  celery:["Celery","Produce",{tj:["Celery Hearts (16 oz)",2.79,1],aldi:["Celery (bunch)",1.49,1],walmart:["Celery (bunch)",1.68,1]}],
  apples:["Apples","Produce",{tj:["Honeycrisp Apples (2 lb)",4.49,0.67],costco:["Honeycrisp Apples (5 lb)",9.99,1.67],aldi:["Gala Apples (3 lb)",3.49,1],walmart:["Gala Apples (3 lb)",3.98,1]}],
  sweet_potato:["Sweet potatoes","Produce",{tj:["Sweet Potatoes (1.5 lb)",2.49,0.5],costco:["Sweet Potatoes (10 lb)",9.99,3.3],aldi:["Sweet Potatoes (3 lb)",2.99,1],walmart:["Sweet Potatoes (3 lb bag)",3.47,1]}],
  baby_potatoes:["Baby potatoes","Produce",{tj:["Teeny Tiny Potatoes (28 oz)",3.29,1.17],costco:["Little Potatoes (5 lb)",6.99,3.3],aldi:["Baby Gold Potatoes (1.5 lb)",2.49,1],walmart:["Marketside Baby Gold Potatoes (1.5 lb)",3.47,1]}],
  asparagus:["Asparagus","Produce",{tj:["Asparagus (1 lb)",3.99,1],costco:["Asparagus (2.25 lb)",6.99,2.25],aldi:["Asparagus (1 lb)",2.49,1],walmart:["Asparagus (1 lb bunch)",2.97,1]}],
  green_beans:["Green beans","Produce",{tj:["Haricots Verts (12 oz)",2.99,1],costco:["Haricots Verts (2 lb)",6.49,2.67],aldi:["Little Salad Bar Green Beans (12 oz)",1.99,1],walmart:["Marketside Fresh Green Beans (12 oz)",2.48,1]}],
  coleslaw:["Coleslaw mix","Produce",{tj:["Cruciferous Crunch Collection (12 oz)",2.99,0.85],aldi:["Little Salad Bar Coleslaw Mix (14 oz)",1.49,1],walmart:["Marketside Classic Coleslaw (14 oz)",1.68,1]}],

  flour_tortillas:["Flour tortillas","Bakery & Tortillas",{tj:["Handmade Flour Tortillas (10 ct)",2.99,1],costco:["Mission Flour Tortillas (2 x 24 ct)",8.99,4.8],aldi:["Pueblo Lindo Flour Tortillas (10 ct)",1.79,1],walmart:["Great Value Flour Tortillas (10 ct)",1.98,1]}],
  corn_tortillas:["Corn tortillas","Bakery & Tortillas",{tj:["Corn Tortillas (18 ct)",2.49,1.5],aldi:["Pueblo Lindo Corn Tortillas (30 ct)",1.85,2.5],walmart:["Mission Yellow Corn Tortillas (30 ct)",2.94,2.5]}],
  pita:["Pita bread","Bakery & Tortillas",{tj:["Pita Bread (6 ct)",1.99,1],aldi:["Pita Bread (6 ct)",1.89,1],walmart:["Toufayan Pita (6 ct)",2.68,1]}],
  naan:["Naan","Bakery & Tortillas",{tj:["Garlic Naan (4 ct)",2.99,2],costco:["Stonefire Naan (12 ct)",7.99,6],aldi:["Specially Selected Garlic Naan (4 ct)",2.79,2],walmart:["Stonefire Original Naan (2 ct)",3.48,1]}],
  sourdough:["Sourdough bread","Bakery & Tortillas",{tj:["Sourdough Bread (24 oz)",4.49,1],costco:["Artisan Sourdough Rounds (2 ct)",6.99,2],aldi:["Specially Selected Sourdough (24 oz)",3.49,1],walmart:["Marketside Sourdough Loaf (16 oz)",3.24,0.7]}],
  baguette:["Baguette","Bakery & Tortillas",{tj:["Organic Baguette",2.99,1],aldi:["Specially Selected Baguette",1.99,1],walmart:["Marketside French Baguette",1.48,1]}],
  tortilla_chips:["Tortilla chips","Pantry",{tj:["Organic Tortilla Chips (12 oz)",2.99,1],costco:["Kirkland Organic Tortilla Chips (40 oz)",7.99,3.3],aldi:["Clancy's Tortilla Chips (13 oz)",1.95,1],walmart:["Great Value Tortilla Chips (13 oz)",1.98,1]}],

  jasmine_rice:["Jasmine rice","Pantry",{tj:["Jasmine Rice (2 lb)",3.49,1],costco:["Kirkland Thai Jasmine Rice (25 lb)",21.99,12.5],aldi:["Earthly Grains Jasmine Rice (2 lb)",2.75,1],walmart:["Great Value Jasmine Rice (2 lb)",2.92,1]}],
  orzo:["Orzo","Pantry",{tj:["Organic Orzo (16 oz)",1.99,1],aldi:["Reggano Orzo (16 oz)",1.19,1],walmart:["Barilla Orzo (16 oz)",1.98,1]}],
  gnocchi:["Potato gnocchi","Pantry",{tj:["Potato Gnocchi (17.6 oz)",2.49,1],costco:["De Cecco Potato Gnocchi (3 x 17.6 oz)",9.99,3],aldi:["Priano Potato Gnocchi (16 oz)",2.19,1],walmart:["Gia Russa Potato Gnocchi (16 oz)",2.98,1]}],
  oats:["Rolled oats","Pantry",{tj:["Rolled Oats (32 oz)",3.49,0.76],costco:["Quaker Old Fashioned Oats (2 x 5 lb)",12.99,3.8],aldi:["Millville Old Fashioned Oats (42 oz)",3.29,1],walmart:["Great Value Old Fashioned Oats (42 oz)",3.62,1]}],
  chia:["Chia seeds","Pantry",{tj:["Chia Seeds (12 oz)",3.99,1],costco:["Nutiva Organic Chia Seeds (3 lb)",11.99,4],aldi:["Simply Nature Chia Seeds (12 oz)",3.19,1],walmart:["Great Value Chia Seeds (12 oz)",3.47,1]}],
  chicken_broth:["Chicken broth","Pantry",{tj:["Organic Low Sodium Chicken Broth (32 oz)",2.49,1],costco:["Kirkland Organic Chicken Stock (6 x 32 oz)",12.99,6],aldi:["Chef's Cupboard Chicken Broth (32 oz)",1.49,1],walmart:["Great Value Chicken Broth (32 oz)",1.68,1]}],
  diced_tomatoes:["Diced tomatoes","Pantry",{tj:["Organic Diced Tomatoes (14.5 oz)",1.69,1],costco:["Kirkland Diced Tomatoes (8 x 14.5 oz)",9.99,8],aldi:["Happy Harvest Diced Tomatoes (14.5 oz)",0.85,1],walmart:["Great Value Diced Tomatoes (14.5 oz)",0.98,1]}],
  black_beans:["Black beans","Pantry",{tj:["Organic Black Beans (15 oz)",1.29,1],costco:["Kirkland Organic Black Beans (8 cans)",11.49,8],aldi:["Dakota's Pride Black Beans (15 oz)",0.79,1],walmart:["Great Value Black Beans (15 oz)",0.88,1]}],
  cannellini:["Cannellini beans","Pantry",{tj:["Cannellini Beans (15.5 oz)",1.49,1],aldi:["Dakota's Pride Cannellini Beans (15.5 oz)",0.95,1],walmart:["Great Value Cannellini Beans (15.5 oz)",1.14,1]}],
  coconut_milk:["Coconut milk","Pantry",{tj:["Light Coconut Milk (13.5 oz)",1.99,1],costco:["Kirkland Organic Coconut Milk (6 cans)",11.99,6],aldi:["Fusia Coconut Milk (13.5 oz)",1.45,1],walmart:["Great Value Coconut Milk (13.5 oz)",1.78,1]}],

  soy:["Soy sauce","Sauces & Spices",{tj:["Reduced Sodium Soy Sauce (10 oz)",2.49,1],aldi:["Fusia Soy Sauce (15 oz)",1.79,1.5],walmart:["Great Value Soy Sauce (15 oz)",1.42,1.5]}],
  honey:["Honey","Sauces & Spices",{tj:["Clover Honey (16 oz)",5.49,1.33],costco:["Kirkland Clover Honey (3 x 1.5 lb)",17.99,6],aldi:["Specially Selected Clover Honey (12 oz)",3.49,1],walmart:["Great Value Clover Honey (12 oz)",3.24,1]}],
  gochujang:["Gochujang","Sauces & Spices",{tj:["Gochujang Sauce (8.5 oz)",2.99,0.5],walmart:["Gochujang Hot Pepper Paste (17.6 oz)",6.98,1]}],
  red_curry:["Red curry paste","Sauces & Spices",{tj:["Thai Red Curry Sauce (11 oz)",3.29,1],aldi:["Fusia Red Curry Paste (4 oz)",1.99,1],walmart:["Thai Kitchen Red Curry Paste (4 oz)",3.84,1]}],
  pesto:["Basil pesto","Sauces & Spices",{tj:["Pesto alla Genovese (6.7 oz)",3.99,1],costco:["Kirkland Basil Pesto (22 oz)",9.49,3.3],aldi:["Priano Basil Pesto (6.7 oz)",2.75,1],walmart:["Classico Traditional Basil Pesto (8.1 oz)",3.48,1.2]}],
  marinara:["Marinara sauce","Sauces & Spices",{tj:["Marinara Sauce (25 oz)",2.79,1],costco:["Rao's Marinara (2 x 28 oz)",14.99,2.3],aldi:["Priano Marinara (24 oz)",1.85,1],walmart:["Great Value Marinara (24 oz)",1.38,1]}],
  salsa_verde:["Salsa verde","Sauces & Spices",{tj:["Salsa Verde (12 oz)",2.79,0.75],aldi:["Casa Mamita Salsa Verde (16 oz)",2.15,1],walmart:["Great Value Salsa Verde (16 oz)",2.24,1]}],
  salsa:["Chunky salsa","Sauces & Spices",{tj:["Chunky Salsa (16 oz)",2.99,1],costco:["Kirkland Organic Salsa (3 x 22 oz)",9.99,4],aldi:["Casa Mamita Chunky Salsa (16 oz)",1.69,1],walmart:["Great Value Chunky Salsa (16 oz)",1.92,1]}],
  everything:["Everything bagel seasoning","Sauces & Spices",{tj:["Everything but the Bagel Seasoning (2.3 oz)",2.49,1],aldi:["Stonemill Everything Bagel Seasoning (2.4 oz)",1.99,1],walmart:["Great Value Everything Bagel Seasoning (2.5 oz)",1.98,1]}],
  sesame:["Sesame seeds","Sauces & Spices",{tj:["Toasted Sesame Seeds (2 oz)",1.99,1],aldi:["Stonemill Sesame Seeds (2.5 oz)",1.49,1],walmart:["Great Value Sesame Seeds (2.4 oz)",1.38,1]}],
  taco_seasoning:["Taco seasoning","Sauces & Spices",{tj:["Taco Seasoning Mix (2 oz)",1.99,1],aldi:["Casa Mamita Taco Seasoning (1 oz)",0.55,0.5],walmart:["Great Value Taco Seasoning (1 oz)",0.62,0.5]}],
  smoked_paprika:["Smoked paprika","Sauces & Spices",{aldi:["Stonemill Smoked Paprika (2.5 oz)",1.29,1],walmart:["Great Value Smoked Paprika (1.9 oz)",2.48,1]}],
  chili_crisp:["Chili crisp","Sauces & Spices",{tj:["Chili Onion Crunch (6 oz)",4.99,1],aldi:["Specially Selected Chili Crisp (6.5 oz)",3.29,1],walmart:["Lao Gan Ma Spicy Chili Crisp (7.4 oz)",4.12,1]}],

  frozen_berries:["Frozen mixed berries","Frozen",{tj:["Organic Mixed Berries (16 oz)",3.99,1],costco:["Kirkland Organic Three-Berry Blend (4 lb)",13.99,4],aldi:["Season's Choice Mixed Berries (16 oz)",3.19,1],walmart:["Great Value Mixed Berries (16 oz)",3.24,1]}],
  frozen_corn:["Frozen sweet corn","Frozen",{tj:["Fire Roasted Corn (16 oz)",2.49,1],costco:["Kirkland Organic Sweet Corn (5 lb)",8.99,5],aldi:["Season's Choice Sweet Corn (12 oz)",0.99,0.75],walmart:["Great Value Sweet Corn (12 oz)",1.18,0.75]}],
};

/* ------------------------------------------------------------------ recipes
   ing: [itemId, share of one standard pack, how it reads in the recipe]
   art: table colour, vessel, vessel colour, layers drawn bottom to top */
const RECIPES = [
{id:"gochujang-chicken",title:"Sheet-Pan Gochujang Chicken & Broccoli",meal:"Dinner",time:35,serves:4,kcal:540,protein:38,
 blurb:"Sticky, spicy-sweet thighs and charred broccoli off one pan, spooned over jasmine rice with a shower of sesame and scallion.",
 ing:[["chicken_thigh",1,"1½ lb boneless skinless chicken thighs, cut in 2-inch pieces"],["gochujang",0.25,"3 tbsp gochujang"],["honey",0.1,"2 tbsp honey"],["soy",0.1,"2 tbsp soy sauce"],["garlic",0.15,"4 garlic cloves, grated"],["broccoli",1,"1 lb broccoli, cut in florets"],["jasmine_rice",0.25,"1½ cups jasmine rice"],["green_onion",0.5,"4 green onions, sliced"],["sesame",0.1,"1 tbsp sesame seeds"]],
 pantry:"2 tbsp neutral oil, salt",
 steps:["Heat the oven to 450°F with a rack in the upper third. Rinse the rice and cook it with 2¼ cups water and a pinch of salt.","Whisk the gochujang, honey, soy sauce, garlic and 1 tbsp oil in a big bowl. Add the chicken and toss to coat.","Toss the broccoli on a sheet pan with 1 tbsp oil and a pinch of salt and push it to one side. Spread the chicken on the other side in a single layer, scraping in every bit of sauce.","Roast 18 to 22 minutes, until the chicken is cooked through and caramelized at the edges and the broccoli tips are charred.","Spoon the pan juices back over the chicken. Serve over rice with the green onions and sesame seeds on top."],
 tip:"For extra char, switch to broil for the last 2 minutes and watch it closely. Honey burns fast.",
 art:{bg:"#2F3A40",vessel:"bowl",vc:"#E9E4DA",layers:[{t:"grain",c:["#FFFFFF","#F7F5EE"],x:-0.42,y:0.05,r:0.52,n:900,s:1},{t:"floret",c:["#3E7B2E","#2C5E22","#6FA04A"],x:0.4,y:-0.4,r:0.42,n:7,s:1.15},{t:"chunk",c:["#C2401F","#7E1F0E","#E8763F"],x:0.32,y:0.28,r:0.55,n:9,s:0.95},{t:"round",c:["#7FBF4A","#D9EFC2"],x:0.1,y:0,r:0.75,n:22,s:0.22,d:"ring"},{t:"dot",c:["#F3E7C4","#F8F1DA"],x:0.15,y:0.05,r:0.8,n:120,s:0.6}]}},


{id:"lemon-orzo-shrimp",title:"Creamy Lemon Orzo with Shrimp & Spinach",meal:"Dinner",time:25,serves:4,kcal:520,protein:33,
 blurb:"One skillet, risotto-style orzo with butter, Parmesan and plenty of lemon, finished with seared shrimp and a tangle of wilted spinach.",
 ing:[["shrimp",1,"1 lb raw shrimp, peeled and deveined"],["orzo",0.75,"1½ cups orzo"],["chicken_broth",1,"3½ cups chicken broth"],["butter",0.1,"3 tbsp butter"],["garlic",0.15,"4 garlic cloves, minced"],["lemon",0.34,"2 lemons, zested and juiced"],["parmesan",0.5,"¾ cup grated Parmesan"],["spinach",0.6,"5 oz baby spinach"]],
 pantry:"1 tbsp olive oil, salt, pepper, red pepper flakes",
 steps:["Pat the shrimp dry and season with salt, pepper and a pinch of pepper flakes. Sear in the oil in a large skillet over high heat, about 1 minute per side. Move to a plate.","Lower the heat to medium. Melt 2 tbsp butter, add the garlic and orzo and stir 2 minutes until the orzo smells toasty.","Add the broth a cup at a time, stirring often, until the orzo is tender and creamy, 10 to 12 minutes.","Stir in the spinach, Parmesan, the last tbsp of butter, the lemon zest and most of the juice. Season to taste.","Return the shrimp and their juices to the pan and warm for 1 minute. Finish with the rest of the lemon juice and black pepper."],
 tip:"Frozen shrimp thaw in 10 minutes in a bowl of cold water. Start them before anything else.",
 art:{bg:"#26343B",vessel:"skillet",vc:"#2A2A2A",layers:[{t:"base",c:["#F1E3B8","#DCC791"],x:0,y:0,r:1},{t:"grain",c:["#F6EBC6","#E8D59E","#FFF6D8"],x:0,y:0,r:0.95,n:700,s:1.25},{t:"leaf",c:["#2F6B2A","#3E8A35","#245520"],x:0.05,y:0.1,r:0.85,n:22,s:0.75},{t:"shrimp",c:["#F28A5B","#FFC8A4","#D9653A"],x:0,y:0,r:0.72,n:11,s:1},{t:"wedge",c:["#F7D63E","#FCEFA0"],x:0.55,y:-0.55,r:0.15,n:2,s:1},{t:"dot",c:["#FFF7E1","#F0E2BD"],x:0,y:0,r:0.85,n:140,s:0.9},{t:"dot",c:["#2B2B2B"],x:0,y:0,r:0.85,n:60,s:0.5}]}},

{id:"everything-salmon",title:"Everything-Bagel Salmon & Crispy Smashed Potatoes",meal:"Dinner",time:40,serves:4,kcal:590,protein:36,
 blurb:"A seed-crusted salmon fillet roasted alongside shattering smashed potatoes and asparagus, with lemony yogurt sauce on the side.",
 ing:[["salmon",1,"1¼ lb salmon fillet, cut in 4 portions"],["everything",0.3,"2 tbsp everything bagel seasoning"],["baby_potatoes",1,"1½ lb baby potatoes"],["asparagus",1,"1 lb asparagus, woody ends snapped off"],["greek_yogurt",0.2,"¾ cup plain Greek yogurt"],["lemon",0.17,"1 lemon"],["garlic",0.05,"1 garlic clove, grated"]],
 pantry:"4 tbsp olive oil, salt, pepper",
 steps:["Boil the potatoes in salted water until a knife slides in easily, 12 to 15 minutes. Drain and let them steam dry for a few minutes. Heat the oven to 450°F.","Oil a sheet pan, add the potatoes and smash each one flat with the bottom of a glass. Drizzle with 2 tbsp oil, season and roast 15 minutes.","Brush the salmon with oil and press the everything seasoning onto the tops. Toss the asparagus with oil and salt.","Flip the potatoes, add the salmon and asparagus to the pan and roast 10 to 12 minutes more, until the salmon flakes and the potatoes are deeply golden.","Stir the yogurt with the garlic, half the lemon's zest and juice, and salt. Serve everything with the sauce and lemon wedges."],
 tip:"Smash the potatoes thin. More craggy edges means more crunch.",
 art:{bg:"#3B4A3F",vessel:"plate",vc:"#F4F1EA",layers:[{t:"spear",c:["#5C8F35","#87B755","#3D6B22"],x:-0.15,y:-0.45,r:0.3,n:7,s:1,ang:-0.35},{t:"smash",c:["#E7B65A","#B97A2A","#F6D88E"],x:-0.45,y:0.35,r:0.42,n:5,s:1},{t:"fillet",c:["#F08A62","#F7B696","#2E2A26"],x:0.3,y:0.15,r:0.4,n:1,s:1},{t:"dollop",c:["#FBFAF6","#E9E6DE"],x:0.48,y:-0.55,r:0.2,n:1,s:0.8},{t:"wedge",c:["#F7D63E","#FCEFA0"],x:-0.62,y:-0.2,r:0.05,n:1,s:1.1},{t:"leaf",c:["#4E8A3A"],x:0.45,y:-0.55,r:0.15,n:4,s:0.25}]}},

{id:"sweet-potato-tacos",title:"Crispy Sweet Potato & Black Bean Tacos",meal:"Dinner",time:35,serves:4,kcal:470,protein:16,
 blurb:"Roasted, smoky sweet potato and black beans in charred corn tortillas, topped with lime slaw, feta and a quick chipotle-style crema.",
 ing:[["sweet_potato",0.5,"2 medium sweet potatoes (about 1½ lb), cut in ½-inch cubes"],["black_beans",1,"1 can black beans, drained and rinsed"],["taco_seasoning",0.5,"1 packet taco seasoning"],["corn_tortillas",0.7,"8 corn tortillas"],["coleslaw",0.5,"3 cups coleslaw mix"],["lime",0.25,"2 limes"],["sour_cream",0.25,"½ cup sour cream"],["feta",0.5,"½ cup feta crumbles"],["avocado",0.5,"2 avocados, sliced"],["cilantro",0.4,"a handful of cilantro"]],
 pantry:"3 tbsp olive oil, salt, hot sauce",
 steps:["Heat the oven to 425°F. Toss the sweet potatoes with 2 tbsp oil and half the taco seasoning and roast 20 minutes.","Add the black beans and the rest of the seasoning to the pan, toss and roast 8 minutes more, until the potatoes are crisp-edged.","Toss the slaw with the juice of 1 lime, 1 tbsp oil and a pinch of salt.","Stir the sour cream with a squeeze of lime and a few dashes of hot sauce.","Char the tortillas over a gas flame or in a dry skillet. Fill with the sweet potato and beans, then slaw, avocado, feta, crema and cilantro."],
 tip:"Double up the tortillas if they're thin so the tacos hold together.",
 art:{bg:"#2E3B4D",vessel:"board",vc:"#B88A58",layers:[{t:"taco",c:["#E9C77C","#C99A4A"],n:3},{t:"cube",c:["#E7782C","#C9561A","#F6A35B"],x:0,y:0,r:0.8,n:30,s:0.55,taco:1},{t:"bean",c:["#1E1A22","#4A4352"],x:0,y:0,r:0.8,n:26,s:0.55,taco:1},{t:"leaf",c:["#8A4A9C","#B583C4","#F2EFE6"],x:0,y:0,r:0.8,n:40,s:0.3,taco:1},{t:"avoslice",c:["#9BC15A","#D9E89A","#3E5A1C"],x:0,y:0,r:0.8,n:5,s:0.55,taco:1},{t:"drizzle",c:["#FAF6EE"],n:3,w:5,taco:1},{t:"wedge",c:["#5FA83B","#CBE58C"],x:0.7,y:0.7,r:0.12,n:2,s:1},{t:"crumble",c:["#FFFFFF","#EDEAE2"],x:0,y:0,r:0.8,n:9,s:0.32,taco:1}]}},

{id:"red-curry-shrimp",title:"Coconut Red Curry with Shrimp",meal:"Dinner",time:25,serves:4,kcal:510,protein:30,
 blurb:"A fast, glossy Thai-style red curry with sweet peppers, spinach and shrimp, ladled over jasmine rice and brightened with lime.",
 ing:[["shrimp",1,"1 lb raw shrimp, peeled"],["red_curry",0.75,"3 tbsp red curry paste (or most of a jar of red curry sauce)"],["coconut_milk",2,"2 cans coconut milk"],["bell_peppers",0.67,"2 bell peppers, sliced"],["onion",0.17,"1 onion, sliced"],["garlic",0.1,"3 garlic cloves, minced"],["spinach",0.4,"3 big handfuls baby spinach"],["soy",0.1,"1 tbsp soy sauce (or fish sauce)"],["lime",0.25,"2 limes"],["cilantro",0.5,"a handful of cilantro"],["jasmine_rice",0.25,"1½ cups jasmine rice"]],
 pantry:"1 tbsp oil, 1 tsp sugar",
 steps:["Start the rice. Heat the oil in a wide pan over medium-high and cook the onion and peppers until just softened, 4 minutes.","Add the garlic and curry paste and fry, stirring, until fragrant and brick-red, 1 minute.","Pour in the coconut milk, soy sauce and sugar. Simmer 5 minutes until slightly thickened.","Add the shrimp and simmer 3 to 4 minutes, just until pink. Stir in the spinach to wilt.","Finish with the juice of 1 lime and taste for salt. Serve over rice with cilantro and lime wedges."],
 tip:"Red curry paste varies a lot in heat. Start with 2 tbsp and add more after tasting the sauce.",
 art:{bg:"#3A2F44",vessel:"bowl",vc:"#1F3E3A",layers:[{t:"base",c:["#E2622B","#B9431A","#F28C4B"],x:0,y:0,r:1},{t:"grain",c:["#FBFAF4","#EFEBDF"],x:-0.42,y:-0.3,r:0.4,n:420,s:1},{t:"strip",c:["#D7262B","#F3C21F","#E84B26"],x:0.2,y:0.2,r:0.65,n:14,s:1,l:3.2},{t:"leaf",c:["#2F6B2A","#3E8A35"],x:0.2,y:0.2,r:0.7,n:12,s:0.6},{t:"shrimp",c:["#F49A6B","#FFD3B5","#DD6A3D"],x:0.2,y:0.2,r:0.6,n:8,s:0.95},{t:"leaf",c:["#4FA046","#6DBE5C"],x:0,y:0,r:0.8,n:18,s:0.28},{t:"wedge",c:["#5FA83B","#CBE58C"],x:0.6,y:-0.55,r:0.1,n:1,s:1}]}},

{id:"pesto-gnocchi",title:"Pesto Gnocchi with Sausage & Blistered Tomatoes",meal:"Dinner",time:20,serves:4,kcal:620,protein:24,
 blurb:"Shelf-stable gnocchi pan-fried until crisp, tossed with browned sausage, burst cherry tomatoes and basil pesto. Dinner in twenty minutes.",
 ing:[["gnocchi",1,"1 package (16 to 17.6 oz) shelf-stable potato gnocchi"],["italian_sausage",1,"12 to 16 oz Italian sausage, sliced or casings removed"],["cherry_tomatoes",1,"1 pint cherry tomatoes"],["pesto",0.7,"½ cup basil pesto"],["spinach",0.3,"2 handfuls baby spinach"],["parmesan",0.3,"Parmesan, for shaving"]],
 pantry:"2 tbsp olive oil, salt, pepper",
 steps:["Heat 1 tbsp oil in a large nonstick skillet over medium-high. Add the gnocchi straight from the package in one layer and leave them alone for 3 minutes, until golden underneath. Toss and cook 3 minutes more, then tip into a bowl.","Add the remaining oil and the sausage. Brown, breaking it up or turning the slices, 5 to 6 minutes.","Add the tomatoes and a pinch of salt. Cook until they blister and some burst, about 4 minutes. Press a few to release their juices.","Return the gnocchi, add the spinach and pesto with a splash of water and toss until glossy.","Finish with shaved Parmesan and black pepper."],
 tip:"Don't boil shelf-stable gnocchi first. Pan-frying from raw is what makes them crisp outside and fluffy inside.",
 art:{bg:"#3C3530",vessel:"skillet",vc:"#262626",layers:[{t:"pillow",c:["#E9CF8A","#C99C4E","#7FA43E"],x:0,y:0,r:0.9,n:34,s:1},{t:"round",c:["#8A4A2C","#B9774E"],x:0,y:0,r:0.85,n:10,s:0.55,d:"sausage"},{t:"round",c:["#D7261E","#F25A3C"],x:0,y:0,r:0.85,n:12,s:0.5,d:"tomato"},{t:"leaf",c:["#2F6B2A","#3E8A35"],x:0,y:0,r:0.85,n:10,s:0.55},{t:"shave",c:["#F7EBC8","#EBD9A6"],x:0,y:0,r:0.8,n:12,s:0.7},{t:"leaf",c:["#3E9A45","#5BB860"],x:0.1,y:-0.1,r:0.6,n:6,s:0.6,basil:1}]}},

{id:"bulgogi-bowls",title:"Korean Beef Bulgogi Rice Bowls",meal:"Dinner",time:25,serves:4,kcal:640,protein:32,
 blurb:"Caramelized, garlicky ground-beef bulgogi with cool cucumber, carrots, kimchi and a jammy fried egg on top. Mix it all together before eating.",
 ing:[["ground_beef",1,"1 lb ground beef"],["soy",0.15,"¼ cup soy sauce"],["honey",0.1,"2 tbsp honey"],["garlic",0.15,"4 garlic cloves, grated"],["green_onion",0.5,"4 green onions, sliced"],["jasmine_rice",0.25,"1½ cups jasmine rice"],["cucumber",1,"1 cucumber, thinly sliced"],["carrots",0.25,"2 carrots, cut in matchsticks"],["kimchi",0.5,"1 cup kimchi"],["eggs",0.34,"4 eggs"],["sesame",0.1,"1 tbsp sesame seeds"]],
 pantry:"1 tsp sesame oil, 1 tbsp neutral oil, rice vinegar, salt",
 steps:["Cook the rice. Toss the cucumber and carrots with a splash of rice vinegar and a pinch of salt.","Brown the beef in a hot skillet, breaking it up, until crisp in spots, 6 to 7 minutes. Pour off excess fat.","Add the garlic and the white parts of the green onions for 30 seconds, then the soy sauce and honey. Simmer until glazy, 2 minutes. Stir in the sesame oil.","Fry the eggs in the oil until the whites are set and the edges lacy.","Build bowls: rice, beef, cucumbers, carrots, kimchi and an egg. Top with green onion tops and sesame seeds."],
 tip:"Kimchi is the one item Aldi often doesn't carry. Your bundle picks it up from another stop.",
 art:{bg:"#2B3A33",vessel:"bowl",vc:"#D9D4C7",layers:[{t:"grain",c:["#FFFFFF","#F7F5EE"],x:0,y:0,r:1,n:1100,s:1},{t:"crumble",c:["#6B3A22","#3E1F10","#8C5333"],x:-0.4,y:-0.35,r:0.36,n:55,s:0.55},{t:"round",c:["#6FAE4F","#E3F2C9"],x:0.42,y:-0.38,r:0.3,n:9,s:0.5,d:"cuke"},{t:"strip",c:["#F07D1E","#F9A04A"],x:0.45,y:0.38,r:0.28,n:22,s:0.55,l:4.5},{t:"shave",c:["#C8321F","#E35A3A","#D9462C"],x:-0.4,y:0.4,r:0.3,n:12,s:0.9},{t:"egg",c:["#FFFFFF","#F6A21B"],x:0,y:0,r:0.01,n:1,s:1.1},{t:"round",c:["#7FBF4A","#D9EFC2"],x:0,y:0,r:0.8,n:18,s:0.2,d:"ring"},{t:"dot",c:["#F3E7C4","#2B2B2B"],x:0,y:0,r:0.85,n:110,s:0.6}]}},

{id:"greek-chicken-bowls",title:"Greek Chicken Pita Bowls with Tzatziki",meal:"Dinner",time:30,serves:4,kcal:560,protein:44,
 blurb:"Lemon-oregano chicken over crisp greens with tomatoes, cucumber, feta, hummus and warm pita for scooping.",
 ing:[["chicken_breast",1,"1½ lb chicken breasts"],["lemon",0.34,"2 lemons"],["garlic",0.1,"3 garlic cloves, grated"],["tzatziki",1,"12 oz tzatziki"],["hummus",0.5,"1 cup hummus"],["mixed_greens",0.5,"5 oz spring mix"],["cherry_tomatoes",0.6,"1½ cups cherry tomatoes, halved"],["cucumber",1,"1 cucumber, chopped"],["feta",0.5,"½ cup feta crumbles"],["pita",0.67,"4 pita breads"]],
 pantry:"3 tbsp olive oil, 2 tsp dried oregano, salt, pepper",
 steps:["Pound the chicken to an even ¾ inch. Toss with the juice of 1 lemon, the garlic, oregano, 2 tbsp oil, 1 tsp salt and pepper. Marinate 10 minutes or up to a day.","Cook in a hot grill pan or skillet, 5 to 6 minutes per side, until 165°F inside. Rest 5 minutes and slice.","Warm the pitas in the same pan and cut into wedges.","Build bowls with greens, tomatoes, cucumber, chicken, a big spoon each of hummus and tzatziki, and feta.","Finish with olive oil, a squeeze of the second lemon and more oregano."],
 tip:"Marinate the night before and dinner takes fifteen minutes.",
 art:{bg:"#283B4A",vessel:"plate",vc:"#F4F1EA",layers:[{t:"leaf",c:["#4F8F3A","#7DB653","#3B6E2C","#8C3A55"],x:0,y:0,r:0.85,n:60,s:0.75},{t:"slab",c:["#E7B76A","#B97A35","#7A4A1E"],x:-0.05,y:-0.1,r:0.38,n:5,s:1},{t:"round",c:["#D7261E","#F25A3C"],x:0.5,y:0.25,r:0.25,n:7,s:0.45,d:"tomato"},{t:"round",c:["#6FAE4F","#E3F2C9"],x:-0.5,y:0.35,r:0.25,n:6,s:0.45,d:"cuke"},{t:"dollop",c:["#F7F4EC","#DDE5D2"],x:0.42,y:-0.45,r:0.18,n:1,s:0.75},{t:"dollop",c:["#E8CF9E","#C9A86A"],x:-0.45,y:-0.45,r:0.18,n:1,s:0.7},{t:"cube",c:["#FFFFFF","#EDEAE2","#FFFFFF"],x:0.05,y:0.45,r:0.3,n:14,s:0.32},{t:"pita",c:["#E3B66E","#C48C3E"],x:0.7,y:0.6,r:0.1,n:3,s:1}]}},

{id:"tuscan-soup",title:"Tuscan White Bean, Sausage & Kale Soup",meal:"Dinner",time:40,serves:6,kcal:430,protein:24,
 blurb:"A brothy, garlicky pot of sausage, creamy cannellini beans and tender kale with a Parmesan finish. Even better the next day.",
 ing:[["italian_sausage",1,"1 lb Italian sausage, casings removed"],["onion",0.17,"1 onion, diced"],["carrots",0.25,"2 carrots, diced"],["garlic",0.2,"5 garlic cloves, sliced"],["diced_tomatoes",1,"1 can diced tomatoes"],["cannellini",2,"2 cans cannellini beans, drained"],["chicken_broth",1.5,"6 cups chicken broth"],["kale",1,"10 oz chopped kale"],["parmesan",0.4,"½ cup grated Parmesan, plus more"],["baguette",1,"1 baguette, for serving"]],
 pantry:"1 tbsp olive oil, red pepper flakes, salt, pepper",
 steps:["Brown the sausage in the oil in a Dutch oven over medium-high, breaking it into chunks, 6 minutes.","Add the onion and carrots and cook until soft, 5 minutes. Add the garlic and a pinch of pepper flakes for 1 minute.","Add the tomatoes, beans and broth. Mash a quarter of the beans against the pot to thicken the broth. Simmer 15 minutes.","Stir in the kale and simmer until tender, 5 minutes. Stir in the Parmesan and season.","Serve with more Parmesan, a drizzle of olive oil and toasted baguette."],
 tip:"Throw in a Parmesan rind while it simmers if you have one.",
 art:{bg:"#3A3631",vessel:"pot",vc:"#2E5E6E",layers:[{t:"base",c:["#D9A25A","#B87B35","#E8BC78"],x:0,y:0,r:1},{t:"bean",c:["#F5EEDC","#E4D7B6"],x:0,y:0,r:0.85,n:34,s:0.75},{t:"leaf",c:["#2E5A2A","#3D7134","#1F4A22"],x:0,y:0,r:0.85,n:26,s:0.7,kale:1},{t:"crumble",c:["#8C4A2A","#5A2C16","#B06A40"],x:0,y:0,r:0.8,n:28,s:0.75},{t:"round",c:["#F07D1E","#F9A04A"],x:0,y:0,r:0.8,n:10,s:0.32,d:"plain"},{t:"dot",c:["#FFF7E1","#F0E2BD"],x:0,y:0,r:0.85,n:120,s:0.9},{t:"dot",c:["#C0321D"],x:0,y:0,r:0.8,n:30,s:0.5}]}},

{id:"honey-garlic-pork",title:"Honey-Garlic Pork Tenderloin with Green Beans",meal:"Dinner",time:35,serves:4,kcal:470,protein:40,
 blurb:"Seared-then-roasted pork tenderloin lacquered in honey-garlic glaze, sliced over roasted potatoes and blistered green beans.",
 ing:[["pork_tenderloin",1,"1¼ lb pork tenderloin, silver skin trimmed"],["honey",0.15,"3 tbsp honey"],["soy",0.1,"2 tbsp soy sauce"],["garlic",0.2,"5 garlic cloves, minced"],["butter",0.05,"1 tbsp butter"],["baby_potatoes",1,"1½ lb baby potatoes, halved"],["green_beans",1,"12 oz green beans, trimmed"]],
 pantry:"3 tbsp olive oil, 1 tsp Dijon mustard, salt, pepper",
 steps:["Heat the oven to 425°F. Toss the potatoes with 1 tbsp oil and salt on a sheet pan and roast 15 minutes.","Season the pork generously. Sear in an oven-safe skillet with 1 tbsp oil until browned all over, 6 minutes.","Whisk the honey, soy sauce, garlic and Dijon. Pour over the pork. Toss the green beans with the rest of the oil and add them to the potato pan.","Roast the pork and the vegetables together for 12 to 15 minutes, until the pork reaches 140°F. Rest the pork 5 minutes.","Stir the butter into the skillet juices. Slice the pork and spoon the glaze over it and the vegetables."],
 tip:"Pull the pork at 140°F. Carryover heat takes it to a juicy 145°F while it rests.",
 art:{bg:"#2F3A2C",vessel:"plate",vc:"#F2EEE6",layers:[{t:"spear",c:["#3E7B2E","#5C9C45","#2C5E22"],x:-0.35,y:-0.3,r:0.35,n:14,s:0.7,ang:0.5},{t:"smash",c:["#E9BE65","#BF8433","#F6D88E"],x:-0.35,y:0.4,r:0.38,n:7,s:0.7,halved:1},{t:"round",c:["#7A3B1C","#F2C2A8"],x:0.32,y:0,r:0.32,n:7,s:0.62,d:"pork"},{t:"dot",c:["#F8EBD0"],x:0.3,y:0,r:0.4,n:30,s:0.7}]}},

{id:"shakshuka",title:"Shakshuka with Feta & Warm Pita",meal:"Breakfast",time:30,serves:4,kcal:360,protein:19,
 blurb:"Eggs gently poached in a smoky, peppery tomato sauce, crowned with feta and herbs. Bring the skillet to the table with pita for dunking.",
 ing:[["eggs",0.5,"6 eggs"],["diced_tomatoes",2,"2 cans diced tomatoes"],["bell_peppers",0.34,"1 red bell pepper, diced"],["onion",0.17,"1 onion, diced"],["garlic",0.1,"3 garlic cloves, sliced"],["smoked_paprika",0.1,"1½ tsp smoked paprika"],["feta",0.5,"½ cup feta crumbles"],["cilantro",0.3,"cilantro or parsley"],["pita",0.67,"4 pita breads, warmed"]],
 pantry:"3 tbsp olive oil, 1 tsp cumin, pinch of sugar, salt",
 steps:["Cook the onion and pepper in the oil in a 12-inch skillet over medium until soft, 7 minutes.","Add the garlic, paprika and cumin for 1 minute, then the tomatoes, sugar and ½ tsp salt. Simmer until thick, 10 minutes.","Make 6 wells with a spoon and crack an egg into each. Season the eggs.","Cover and cook on medium-low until the whites are set and the yolks still runny, 6 to 8 minutes.","Scatter with feta and herbs and serve straight from the pan with warm pita."],
 tip:"Crack each egg into a small cup first so a broken yolk doesn't end up in the pan.",
 art:{bg:"#2A3842",vessel:"skillet",vc:"#262626",layers:[{t:"base",c:["#C8321F","#9E2414","#E2553A"],x:0,y:0,r:1},{t:"strip",c:["#E2553A","#A82A18"],x:0,y:0,r:0.9,n:22,s:0.6,l:1.6},{t:"egg",c:["#FFFFFF","#F6A21B"],x:0,y:0,r:0.55,n:5,s:0.95,ring:1},{t:"cube",c:["#FFFFFF","#EDEAE2","#FFFFFF"],x:0,y:0,r:0.85,n:22,s:0.33},{t:"leaf",c:["#3D8A3A","#58A84E"],x:0,y:0,r:0.85,n:24,s:0.3}]}},

{id:"overnight-oats",title:"Berry Vanilla Overnight Oats",meal:"Breakfast",time:5,serves:4,kcal:340,protein:18,
 blurb:"Four grab-and-go jars of creamy, protein-packed oats with chia and jammy berries. Make them Sunday night for the week.",
 ing:[["oats",0.25,"2 cups rolled oats"],["greek_yogurt",0.25,"1 cup plain Greek yogurt"],["milk",0.25,"2 cups milk"],["chia",0.15,"3 tbsp chia seeds"],["honey",0.1,"3 tbsp honey"],["frozen_berries",0.75,"2 cups frozen mixed berries"]],
 pantry:"1 tsp vanilla extract, pinch of salt",
 steps:["Whisk the milk, yogurt, honey, vanilla and salt in a large bowl.","Stir in the oats and chia seeds.","Divide among 4 jars, top each with ½ cup frozen berries and seal.","Refrigerate overnight or up to 4 days. The berries thaw into a quick jam.","Stir before eating and add a drizzle of honey if you like."],
 tip:"Costco's 4-lb berry bag covers a month of jars. Leave it in the freezer.",
 art:{bg:"#3D4752",vessel:"jar",vc:"#CFE0E6",layers:[{t:"base",c:["#EDE3CF","#D8C8A8"],x:0,y:0,r:1},{t:"grain",c:["#E3D2AE","#CDB68A","#F2E8D2"],x:0,y:0,r:0.95,n:240,s:1.6},{t:"base",c:["#8E2443","#6A1730"],x:0.05,y:0.1,r:0.55,a:0.85},{t:"berry",c:["#3B3F8F","#262A6B","#B3253F"],x:0.05,y:0.1,r:0.6,n:24,s:1},{t:"dot",c:["#1D1D1D","#5A5A5A"],x:0,y:0,r:0.9,n:70,s:0.6},{t:"drizzle",c:["#E9A62A"],n:1,w:3}]}},

{id:"avocado-egg-toast",title:"Jammy Egg Avocado Toast with Chili Crisp",meal:"Breakfast",time:15,serves:2,kcal:450,protein:18,
 blurb:"Thick sourdough toast, lemony smashed avocado, 7-minute jammy eggs and a spoonful of crunchy chili crisp.",
 ing:[["sourdough",0.25,"4 thick slices sourdough"],["avocado",0.5,"2 ripe avocados"],["eggs",0.34,"4 eggs"],["lemon",0.1,"½ lemon"],["chili_crisp",0.1,"2 tbsp chili crisp"],["everything",0.1,"everything bagel seasoning"],["mixed_greens",0.1,"a handful of spring mix"]],
 pantry:"Flaky salt, olive oil",
 steps:["Bring a small pot of water to a boil. Lower in the eggs and cook exactly 7 minutes, then move them to ice water.","Toast the sourdough until deep golden and brush with olive oil.","Mash the avocados with the lemon juice and a big pinch of salt.","Peel and halve the eggs.","Spread the avocado on the toast, add greens and egg halves, then spoon on the chili crisp and sprinkle with everything seasoning."],
 tip:"Ice-water-shocked eggs peel far more easily. Give them at least 2 minutes.",
 art:{bg:"#3E4A3A",vessel:"board",vc:"#C49A66",layers:[{t:"toast",c:["#C98A3E","#8E5A22","#F0D3A0"],n:2},{t:"base",c:["#9BC15A","#7EA63E"],x:0,y:0,r:0.9,toast:1},{t:"leaf",c:["#4F8F3A","#8C3A55"],x:0,y:0,r:0.9,n:16,s:0.45,toast:1},{t:"eggHalf",c:["#FFFFFF","#F29A12"],x:0,y:0,r:0.9,n:4,s:1,toast:1},{t:"dot",c:["#B3261E","#7A1A12","#E04A2A"],x:0,y:0,r:0.9,n:110,s:0.9,toast:1},{t:"dot",c:["#F3E7C4","#2B2B2B"],x:0,y:0,r:0.9,n:60,s:0.55,toast:1}]}},

{id:"chicken-salad-wraps",title:"Greek Yogurt Chicken Salad Wraps",meal:"Lunch",time:15,serves:4,kcal:410,protein:34,
 blurb:"Crunchy, tangy chicken salad with apple and celery bound in Greek yogurt instead of mayo, rolled up with greens for packable lunches.",
 ing:[["rotisserie",0.4,"3 cups shredded rotisserie chicken"],["greek_yogurt",0.2,"¾ cup plain Greek yogurt"],["celery",0.3,"2 celery stalks, diced"],["apples",0.2,"1 crisp apple, diced"],["green_onion",0.3,"2 green onions, sliced"],["lemon",0.1,"½ lemon"],["flour_tortillas",0.4,"4 large flour tortillas"],["mixed_greens",0.3,"2 handfuls spring mix"]],
 pantry:"1 tbsp Dijon mustard, salt, pepper",
 steps:["Stir together the yogurt, Dijon, lemon juice, ½ tsp salt and plenty of pepper.","Fold in the chicken, celery, apple and green onions.","Lay the greens across each tortilla and spoon the chicken salad down the center.","Fold in the sides and roll up tightly. Halve on a diagonal.","Wrap in parchment for lunches. They keep 2 days in the fridge."],
 tip:"Make a double batch of the salad on Sunday. Wrap it fresh each morning so the tortilla doesn't go soggy.",
 art:{bg:"#2D3C4A",vessel:"board",vc:"#BC915E",layers:[{t:"spiral",c:["#F0DDB0","#D6B57A","#F5EAD0","#5C9C45","#C9A26A"],n:4},{t:"apple",c:["#C8302A","#F6EDD2"],x:0.62,y:0.62,r:0.18,n:4,s:1},{t:"leaf",c:["#4F8F3A","#7DB653"],x:-0.7,y:0.65,r:0.15,n:6,s:0.4}]}},

{id:"steak-fajitas",title:"Sheet-Pan Steak Fajitas",meal:"Dinner",time:30,serves:4,kcal:580,protein:40,
 blurb:"Sizzling strips of sirloin with rainbow peppers and onions, roasted hot on one pan and piled into warm tortillas with the works.",
 ing:[["sirloin",1,"1½ lb top sirloin, sliced thin across the grain"],["bell_peppers",1,"3 bell peppers, sliced"],["onion",0.17,"1 large onion, sliced"],["taco_seasoning",0.5,"1 packet taco seasoning"],["lime",0.25,"2 limes"],["flour_tortillas",1,"10 flour tortillas"],["sour_cream",0.25,"½ cup sour cream"],["avocado",0.5,"2 avocados, sliced"],["cilantro",0.3,"cilantro, chopped"]],
 pantry:"3 tbsp oil, salt",
 steps:["Heat the oven to 450°F with a sheet pan inside.","Toss the peppers and onion with 2 tbsp oil and half the seasoning. Spread on the hot pan and roast 12 minutes.","Toss the steak with the rest of the oil and seasoning and the juice of 1 lime.","Push the vegetables to the edges, add the steak in one layer and broil 4 to 5 minutes, until the steak is browned outside and still pink in the middle.","Squeeze over the second lime and serve with warm tortillas, sour cream, avocado and cilantro."],
 tip:"Slice the steak while it's half-frozen and you'll get thin, even strips.",
 art:{bg:"#3B2F2A",vessel:"sheet",vc:"#9EA3A6",layers:[{t:"strip",c:["#D7262B","#F3C21F","#2F8A3A","#E84B26"],x:0,y:0,r:0.95,n:46,s:1.15,l:3.4},{t:"strip",c:["#F1E3C8","#D9B78A"],x:0,y:0,r:0.9,n:16,s:0.9,l:3},{t:"strip",c:["#6A3520","#8C4A2C","#4A2312"],x:0,y:0,r:0.6,n:20,s:1.25,l:2.6,sear:1},{t:"wedge",c:["#5FA83B","#CBE58C"],x:0.6,y:-0.5,r:0.2,n:3,s:1.1},{t:"leaf",c:["#4FA046","#6DBE5C"],x:0,y:0,r:0.85,n:22,s:0.28}]}},

{id:"hot-honey-flatbread",title:"Hot Honey Pepperoni Flatbread Pizza",meal:"Dinner",time:15,serves:2,kcal:690,protein:30,
 blurb:"Friday night in fifteen minutes: naan crisped in a hot oven with marinara, melty mozzarella, cupped pepperoni and a chili-honey drizzle.",
 ing:[["naan",1,"2 naan flatbreads"],["marinara",0.25,"½ cup marinara"],["mozzarella",1,"1½ cups shredded mozzarella"],["pepperoni",0.6,"3 oz pepperoni"],["honey",0.1,"2 tbsp honey"],["mixed_greens",0.15,"a handful of spring mix or basil"]],
 pantry:"1 tsp red pepper flakes, olive oil, dried oregano",
 steps:["Heat the oven to 475°F. Put the naan straight on the rack for 2 minutes to crisp the bottoms.","Spread the marinara on the naan, then the mozzarella, then the pepperoni.","Bake on a sheet pan until the cheese is bubbling and the pepperoni cups and crisps, 7 to 8 minutes.","Warm the honey with the pepper flakes for 20 seconds in the microwave.","Drizzle the hot honey over the pizzas, add the greens and a pinch of oregano, and slice."],
 tip:"Thicker pepperoni cups better. Look for the slices sold in a stick or a deli tray.",
 art:{bg:"#2A3340",vessel:"board",vc:"#B88456",layers:[{t:"flatbread",c:["#E2B266","#B9772F","#F2D29A"],n:1},{t:"base",c:["#C8321F","#A1251A"],x:0,y:0,r:0.85,flat:1},{t:"blob",c:["#FFF6DA","#F5DC9C","#E2AE5A"],x:0,y:0,r:0.85,n:24,s:1,flat:1},{t:"round",c:["#B42A1E","#D9472F"],x:0,y:0,r:0.8,n:14,s:0.55,d:"pep",flat:1},{t:"drizzle",c:["#E89B1C"],n:1,w:3,flat:1},{t:"dot",c:["#B3261E"],x:0,y:0,r:0.8,n:50,s:0.5,flat:1},{t:"leaf",c:["#3E9A45","#5BB860"],x:0,y:0,r:0.6,n:7,s:0.55,flat:1,basil:1}]}},

{id:"chicken-tortilla-soup",title:"Chicken Tortilla Soup",meal:"Dinner",time:30,serves:6,kcal:420,protein:30,
 blurb:"A smoky, tomato-rich broth loaded with chicken, black beans and corn, piled high with crunchy tortilla strips, avocado and lime.",
 ing:[["rotisserie",0.4,"3 cups shredded rotisserie chicken"],["chicken_broth",1.5,"6 cups chicken broth"],["salsa",0.6,"1½ cups chunky salsa"],["diced_tomatoes",1,"1 can diced tomatoes"],["black_beans",1,"1 can black beans, drained"],["frozen_corn",0.75,"1½ cups frozen corn"],["onion",0.17,"1 onion, diced"],["taco_seasoning",0.25,"1 tbsp taco seasoning"],["tortilla_chips",0.3,"tortilla chips or strips"],["avocado",0.5,"2 avocados"],["cheese_mex",0.4,"shredded cheese"],["lime",0.25,"2 limes"],["cilantro",0.3,"cilantro"]],
 pantry:"1 tbsp oil, salt",
 steps:["Soften the onion in the oil in a large pot, 5 minutes. Stir in the seasoning for 30 seconds.","Add the broth, salsa and tomatoes. Bring to a simmer and cook 10 minutes.","Add the chicken, beans and corn and simmer 5 minutes more. Squeeze in 1 lime and season.","Ladle into bowls.","Top with crushed tortilla chips, avocado, cheese, cilantro and lime wedges."],
 tip:"This freezes well. Keep the toppings separate and add them fresh.",
 art:{bg:"#33302B",vessel:"bowl",vc:"#C9562E",layers:[{t:"base",c:["#C8471F","#9E3414","#E06A3A"],x:0,y:0,r:1},{t:"shred",c:["#E9CFA0","#D9B98A"],x:0,y:0,r:0.85,n:14,s:0.8},{t:"bean",c:["#1E1A22","#4A4352"],x:0,y:0,r:0.85,n:22,s:0.55},{t:"dot",c:["#F6C734","#E8A81E"],x:0,y:0,r:0.85,n:60,s:1.8},{t:"chip",c:["#E9B95E","#C9902F"],x:-0.1,y:-0.15,r:0.45,n:9,s:1},{t:"avoslice",c:["#9BC15A","#D9E89A","#3E5A1C"],x:0.35,y:0.3,r:0.2,n:5,s:0.75},{t:"blob",c:["#F7D27A","#E6B048","#C48A2A"],x:-0.3,y:0.35,r:0.3,n:8,s:0.35},{t:"leaf",c:["#4FA046","#6DBE5C"],x:0,y:0,r:0.8,n:16,s:0.28},{t:"wedge",c:["#5FA83B","#CBE58C"],x:0.6,y:-0.55,r:0.1,n:1,s:1}]}},
];

Object.assign(ITEMS, {
  chickpeas:["Chickpeas","Pantry",{tj:["Organic Garbanzo Beans (15.5 oz)",1.29,1],costco:["Kirkland Organic Garbanzo Beans (8 cans)",11.49,8],aldi:["Dakota's Pride Chickpeas (15.5 oz)",0.85,1],walmart:["Great Value Chickpeas (15.5 oz)",0.98,1]}],
  kidney_beans:["Kidney beans","Pantry",{tj:["Organic Kidney Beans (15 oz)",1.29,1],aldi:["Dakota's Pride Dark Red Kidney Beans (15.5 oz)",0.79,1],walmart:["Great Value Dark Red Kidney Beans (15.5 oz)",0.88,1]}],
  granola:["Granola","Pantry",{tj:["Vanilla Almond Granola (16 oz)",3.99,1],costco:["Kirkland Ancient Grain Granola (35 oz)",8.99,2.2],aldi:["Simply Nature Ancient Grains Granola (12 oz)",2.99,0.75],walmart:["Great Value Almond Granola (14 oz)",3.24,0.88]}],
  peanut_butter:["Peanut butter","Pantry",{tj:["Creamy Salted Peanut Butter (16 oz)",2.99,1],costco:["Kirkland Organic Peanut Butter (2 x 28 oz)",11.99,3.5],aldi:["Peanut Delight Creamy Peanut Butter (16 oz)",1.89,1],walmart:["Great Value Creamy Peanut Butter (16 oz)",1.97,1]}],
  penne:["Penne","Pantry",{tj:["Organic Penne (16 oz)",1.69,1],costco:["Garofalo Organic Pasta (6 x 1 lb)",9.99,6],aldi:["Reggano Penne (16 oz)",0.95,1],walmart:["Great Value Penne (16 oz)",1.12,1]}],
  spaghetti:["Spaghetti","Pantry",{tj:["Organic Spaghetti (16 oz)",1.69,1],costco:["Garofalo Organic Spaghetti (6 x 1 lb)",9.99,6],aldi:["Reggano Spaghetti (16 oz)",0.95,1],walmart:["Great Value Spaghetti (16 oz)",1.12,1]}],
  curry_powder:["Curry powder","Sauces & Spices",{aldi:["Stonemill Curry Powder (2 oz)",1.29,1],walmart:["Great Value Curry Powder (1.75 oz)",2.48,1]}],
  banana:["Bananas","Produce",{tj:["Bananas (6)",1.38,1],costco:["Bananas (3 lb)",1.99,1.2],aldi:["Bananas (bunch, ~6)",1.25,1],walmart:["Bananas (bunch, ~6)",1.32,1]}],
  deli_turkey:["Sliced turkey breast","Meat & Seafood",{tj:["Oven Roasted Turkey Breast, sliced (7 oz)",4.49,0.8],costco:["Kirkland Oven Roasted Turkey Breast (2 x 16 oz)",13.99,3.5],aldi:["Lunchmate Oven Roasted Turkey (9 oz)",2.79,1],walmart:["Great Value Oven Roasted Turkey Breast (9 oz)",3.12,1]}],
  ground_turkey:["Ground turkey","Meat & Seafood",{tj:["Ground Turkey 93/7 (1 lb)",5.49,1],costco:["Ground Turkey 93/7 (3 x 1.33 lb)",16.99,4],aldi:["Kirkwood Ground Turkey 93/7 (1 lb)",3.89,1],walmart:["Jennie-O Ground Turkey 93/7 (1 lb)",4.97,1]}],
  mozz_pearls:["Fresh mozzarella pearls","Dairy & Eggs",{tj:["Ciliegine Fresh Mozzarella (8 oz)",3.99,1],costco:["BelGioioso Fresh Mozzarella Pearls (2 x 16 oz)",11.99,4],aldi:["Happy Farms Fresh Mozzarella Pearls (8 oz)",2.99,1],walmart:["BelGioioso Mozzarella Pearls (8 oz)",4.24,1]}],
  ricotta:["Ricotta","Dairy & Eggs",{tj:["Whole Milk Ricotta (16 oz)",3.49,1],aldi:["Happy Farms Ricotta (15 oz)",2.29,1],walmart:["Great Value Whole Milk Ricotta (15 oz)",2.62,1]}],
  frozen_veg:["Frozen mixed vegetables","Frozen",{tj:["Organic Mixed Vegetables (16 oz)",2.29,1],costco:["Kirkland Organic Mixed Vegetables (5 lb)",8.49,5],aldi:["Season's Choice Mixed Vegetables (12 oz)",0.99,0.75],walmart:["Great Value Mixed Vegetables (12 oz)",1.12,0.75]}],
});

RECIPES.push(
{id:"egg-muffins",title:"Spinach, Feta & Pepper Egg Muffins",meal:"Breakfast",time:30,serves:6,kcal:210,protein:15,
 blurb:"Twelve fluffy, veggie-packed egg bites that reheat in 30 seconds. Bake once on Sunday and breakfast is handled until Friday.",
 ing:[["eggs",1,"12 eggs"],["milk",0.05,"¼ cup milk"],["spinach",0.4,"2 big handfuls baby spinach, chopped"],["bell_peppers",0.34,"1 red bell pepper, finely diced"],["green_onion",0.5,"4 green onions, sliced"],["feta",0.5,"½ cup feta crumbles"]],
 pantry:"Cooking spray, salt, pepper",
 steps:["Heat the oven to 350°F and spray a 12-cup muffin tin well.","Whisk the eggs, milk, ½ tsp salt and plenty of pepper.","Divide the spinach, pepper, green onions and feta among the cups.","Pour the eggs over the vegetables, filling each cup about ¾ full.","Bake 20 to 22 minutes, until puffed and just set in the center. Cool 5 minutes before lifting out."],
 tip:"Keep them in the fridge for 5 days, or freeze and microwave from frozen for 60 seconds.",
 art:{bg:"#34404A",vessel:"sheet",vc:"#8E9499",layers:[{t:"smash",c:["#F2D27A","#D9A84A","#F8E6A8"],x:0,y:0,r:0.85,n:8,s:1.25,halved:1},{t:"leaf",c:["#2F6B2A","#3E8A35"],x:0,y:0,r:0.85,n:20,s:0.35},{t:"dot",c:["#D7262B","#FFFFFF"],x:0,y:0,r:0.85,n:60,s:1.4}]}},

{id:"breakfast-burritos",title:"Freezer-Friendly Breakfast Burritos",meal:"Breakfast",time:40,serves:8,kcal:480,protein:24,
 blurb:"Crispy potatoes, sausage, soft scrambled eggs and melty cheese wrapped tight and frozen. Grab one, microwave, go.",
 ing:[["eggs",1,"10 eggs"],["italian_sausage",1,"1 lb breakfast or Italian sausage"],["baby_potatoes",1,"1½ lb baby potatoes, diced small"],["cheese_mex",1,"2 cups shredded Mexican cheese"],["flour_tortillas",0.8,"8 large flour tortillas"],["salsa",0.5,"1 cup salsa, for serving"]],
 pantry:"2 tbsp oil, salt, pepper",
 steps:["Roast the potatoes with the oil and salt at 425°F for 25 minutes, until crisp.","Brown the sausage in a large skillet, breaking it up. Move to a bowl.","Scramble the eggs gently in the same skillet until just set. Season.","Warm the tortillas. Fill each with potatoes, sausage, eggs and cheese, fold in the sides and roll tight.","Eat now with salsa, or wrap each in foil and freeze. Reheat from frozen: unwrap, cover with a damp paper towel and microwave 2 minutes, turning once."],
 tip:"Let the fillings cool before rolling for the freezer, so the tortillas don't go soggy.",
 art:{bg:"#3A3530",vessel:"board",vc:"#B88A58",layers:[{t:"roll",c:["#EDD7A8","#C9A26A"],n:3},{t:"dollop",c:["#C8321F","#9E2414"],x:0.62,y:-0.62,r:0.1,n:1,s:0.75},{t:"leaf",c:["#4FA046","#6DBE5C"],x:0,y:0,r:0.8,n:12,s:0.28}]}},

{id:"pb-banana-oats",title:"Peanut Butter Banana Oatmeal",meal:"Breakfast",time:10,serves:4,kcal:390,protein:14,
 blurb:"Creamy stovetop oats stirred with mashed banana and finished with a swirl of peanut butter, sliced banana and chia.",
 ing:[["oats",0.25,"2 cups rolled oats"],["milk",0.5,"2 cups milk (plus 1½ cups water)"],["banana",0.5,"3 bananas"],["peanut_butter",0.15,"¼ cup peanut butter"],["honey",0.05,"1 tbsp honey"],["chia",0.05,"1 tbsp chia seeds"]],
 pantry:"Pinch of salt, cinnamon",
 steps:["Bring the milk, 1½ cups water and a pinch of salt to a simmer.","Stir in the oats and cook, stirring now and then, 5 minutes, until creamy.","Mash 1 banana and stir it in with a pinch of cinnamon.","Divide among bowls. Top with the remaining banana, sliced.","Finish with a spoon of peanut butter, a drizzle of honey and the chia seeds."],
 tip:"Warm the peanut butter for 10 seconds in the microwave so it drizzles.",
 art:{bg:"#3D4752",vessel:"bowl",vc:"#D9D4C7",layers:[{t:"base",c:["#EDE3CF","#D8C8A8"],x:0,y:0,r:1},{t:"grain",c:["#E3D2AE","#CDB68A","#F2E8D2"],x:0,y:0,r:0.95,n:220,s:1.6},{t:"round",c:["#F3E2A0","#FFF6D6"],x:0.1,y:0,r:0.55,n:9,s:0.75,d:"plain"},{t:"drizzle",c:["#B87A3A"],n:1,w:5},{t:"dot",c:["#1D1D1D","#5A5A5A"],x:0,y:0,r:0.9,n:60,s:0.6}]}},

{id:"yogurt-parfait",title:"Honey Berry Yogurt Parfaits",meal:"Breakfast",time:5,serves:4,kcal:330,protein:20,
 blurb:"Thick Greek yogurt layered with crunchy granola and berries, finished with honey. Five minutes and no cooking.",
 ing:[["greek_yogurt",0.75,"3 cups plain Greek yogurt"],["granola",0.5,"1½ cups granola"],["frozen_berries",0.5,"2 cups berries, thawed (or fresh)"],["honey",0.05,"2 tbsp honey"]],
 pantry:"½ tsp vanilla (optional)",
 steps:["Stir the vanilla and 1 tbsp honey into the yogurt.","Spoon a layer of yogurt into 4 glasses or jars.","Add a layer of berries and their juice, then granola.","Repeat the layers, ending with granola and berries.","Drizzle with the rest of the honey and eat right away so the granola stays crunchy."],
 tip:"For make-ahead jars, pack the granola separately and add it in the morning.",
 art:{bg:"#3B3F4F",vessel:"jar",vc:"#CFE0E6",layers:[{t:"base",c:["#FBFAF6","#E9E6DE"],x:0,y:0,r:1},{t:"grain",c:["#C9934A","#A8742E","#E2B66E"],x:-0.3,y:0.2,r:0.5,n:160,s:2.2},{t:"berry",c:["#3B3F8F","#262A6B","#B3253F"],x:0.25,y:-0.15,r:0.5,n:18,s:1},{t:"drizzle",c:["#E9A62A"],n:1,w:3}]}},

{id:"chickpea-salad",title:"Mediterranean Chickpea Salad",meal:"Lunch",time:15,serves:4,kcal:360,protein:14,
 blurb:"A crunchy, lemony no-cook salad of chickpeas, cucumber, tomatoes and feta that gets better as it sits. Packs perfectly.",
 ing:[["chickpeas",2,"2 cans chickpeas, drained and rinsed"],["cucumber",1,"1 cucumber, diced"],["cherry_tomatoes",1,"1 pint cherry tomatoes, halved"],["onion",0.1,"¼ onion, finely diced"],["feta",0.5,"½ cup feta crumbles"],["lemon",0.17,"1 lemon, juiced"]],
 pantry:"3 tbsp olive oil, 1 tsp dried oregano, salt, pepper",
 steps:["Whisk the lemon juice, olive oil, oregano, ½ tsp salt and pepper in a large bowl.","Soak the onion in the dressing for 5 minutes to soften its bite.","Add the chickpeas, cucumber and tomatoes and toss well.","Fold in the feta.","Eat right away or refrigerate up to 3 days."],
 tip:"Spoon it over spring mix or into a pita to stretch it into a bigger lunch.",
 art:{bg:"#2E3B4D",vessel:"bowl",vc:"#F4F1EA",layers:[{t:"bean",c:["#E2B86A","#F6DCA0"],x:0,y:0,r:0.95,n:42,s:0.95},{t:"round",c:["#6FAE4F","#E3F2C9"],x:0,y:0,r:0.85,n:9,s:0.5,d:"cuke"},{t:"round",c:["#D7261E","#F25A3C"],x:0,y:0,r:0.85,n:9,s:0.45,d:"tomato"},{t:"cube",c:["#FFFFFF","#EDEAE2","#FFFFFF"],x:0,y:0,r:0.85,n:12,s:0.3},{t:"leaf",c:["#3D8A3A","#58A84E"],x:0,y:0,r:0.85,n:14,s:0.28}]}},

{id:"turkey-hummus-wraps",title:"Turkey Hummus Pinwheel Wraps",meal:"Lunch",time:10,serves:4,kcal:390,protein:28,
 blurb:"Tortillas spread with hummus and rolled around turkey, spinach and crunchy vegetables, then sliced into lunchbox pinwheels.",
 ing:[["flour_tortillas",0.4,"4 large flour tortillas"],["hummus",0.5,"1 cup hummus"],["deli_turkey",1,"9 oz sliced turkey breast"],["spinach",0.3,"2 handfuls baby spinach"],["bell_peppers",0.34,"1 bell pepper, cut in thin strips"],["cucumber",0.5,"½ cucumber, cut in thin strips"]],
 pantry:"Black pepper",
 steps:["Spread each tortilla edge to edge with hummus.","Layer on spinach and turkey, leaving a 1-inch strip bare at the far edge.","Lay the pepper and cucumber strips across the near edge.","Roll up tightly, pressing the bare edge to seal.","Slice into 1-inch pinwheels, or halve for a wrap."],
 tip:"Wrapped in plastic, the uncut rolls hold for 2 days without going soggy.",
 art:{bg:"#2D3C4A",vessel:"board",vc:"#BC915E",layers:[{t:"spiral",c:["#F0DDB0","#D6B57A","#E8B5A0","#4F8F3A","#C98A5A"],n:4},{t:"leaf",c:["#4F8F3A","#7DB653"],x:-0.7,y:0.65,r:0.15,n:6,s:0.4}]}},

{id:"caprese-pasta",title:"Pesto Caprese Pasta Salad",meal:"Lunch",time:20,serves:6,kcal:480,protein:18,
 blurb:"Penne tossed with basil pesto, fresh mozzarella pearls, sweet cherry tomatoes and spinach. Good cold, room temperature or warm.",
 ing:[["penne",1,"1 lb penne"],["pesto",0.6,"½ cup basil pesto"],["mozz_pearls",1,"8 oz fresh mozzarella pearls"],["cherry_tomatoes",1,"1 pint cherry tomatoes, halved"],["spinach",0.3,"2 handfuls baby spinach"],["parmesan",0.2,"¼ cup grated Parmesan"]],
 pantry:"2 tbsp olive oil, 1 tbsp red wine vinegar, salt, pepper",
 steps:["Cook the penne in well-salted water until al dente. Drain and rinse briefly under cold water.","Toss the warm pasta with the pesto, olive oil and vinegar.","Fold in the tomatoes, mozzarella and spinach.","Season with salt, pepper and the Parmesan.","Serve right away or chill up to 4 days."],
 tip:"Hold back a spoon of pesto and stir it in just before eating to refresh leftovers.",
 art:{bg:"#3A3631",vessel:"bowl",vc:"#2E5E6E",layers:[{t:"base",c:["#9DBB5A","#7FA03E"],x:0,y:0,r:1},{t:"strip",c:["#F0D68A","#E2BF62","#A9C46A"],x:0,y:0,r:0.95,n:40,s:1.6,l:2.2},{t:"round",c:["#FFFFFF","#F4F1EA"],x:0,y:0,r:0.85,n:10,s:0.5,d:"plain"},{t:"round",c:["#D7261E","#F25A3C"],x:0,y:0,r:0.85,n:10,s:0.45,d:"tomato"},{t:"leaf",c:["#2F6B2A","#3E8A35"],x:0,y:0,r:0.85,n:10,s:0.55,basil:1}]}},

{id:"bean-quesadillas",title:"Black Bean & Corn Quesadillas",meal:"Lunch",time:20,serves:4,kcal:520,protein:21,
 blurb:"Golden, crisp-edged quesadillas stuffed with seasoned black beans, sweet corn and plenty of melted cheese.",
 ing:[["black_beans",1,"1 can black beans, drained"],["frozen_corn",0.5,"1 cup frozen corn, thawed"],["taco_seasoning",0.25,"2 tsp taco seasoning"],["cheese_mex",1,"2 cups shredded Mexican cheese"],["flour_tortillas",0.8,"8 flour tortillas"],["salsa",0.5,"salsa, for serving"],["sour_cream",0.25,"sour cream, for serving"]],
 pantry:"1 tbsp butter or oil",
 steps:["Mash half the beans with a fork and stir in the rest, the corn and the seasoning.","Spread the bean mixture over 4 tortillas, top with cheese and the remaining tortillas.","Cook in a lightly buttered skillet over medium heat until golden underneath, 2 to 3 minutes.","Flip carefully and cook until the cheese melts, 2 minutes more.","Cut into wedges and serve with salsa and sour cream."],
 tip:"Press down with a spatula as they cook. More contact with the pan means crispier edges.",
 art:{bg:"#2A3340",vessel:"board",vc:"#B88456",layers:[{t:"pita",c:["#F1C878","#C98E3A"],x:0,y:0,r:0.55,n:6,s:1.5},{t:"dollop",c:["#FBFAF6","#E9E6DE"],x:0.62,y:-0.55,r:0.1,n:1,s:0.6},{t:"dollop",c:["#C8321F","#9E2414"],x:-0.62,y:0.55,r:0.1,n:1,s:0.6},{t:"leaf",c:["#4FA046","#6DBE5C"],x:0,y:0,r:0.8,n:10,s:0.28}]}},

{id:"peanut-noodles",title:"Sesame Peanut Noodle Bowls",meal:"Lunch",time:20,serves:4,kcal:540,protein:17,
 blurb:"Slurpable noodles in a sweet-salty peanut sauce with crunchy carrots, cucumber and lots of green onion. Great cold.",
 ing:[["spaghetti",1,"1 lb spaghetti"],["peanut_butter",0.15,"⅓ cup peanut butter"],["soy",0.15,"¼ cup soy sauce"],["honey",0.05,"1 tbsp honey"],["lime",0.125,"1 lime, juiced"],["carrots",0.25,"2 carrots, cut in matchsticks"],["cucumber",1,"1 cucumber, cut in matchsticks"],["green_onion",0.5,"4 green onions, sliced"],["sesame",0.1,"1 tbsp sesame seeds"]],
 pantry:"1 tsp sesame oil, 1 garlic clove, chili flakes (optional)",
 steps:["Cook the spaghetti until al dente, drain and rinse with cold water.","Whisk the peanut butter, soy sauce, honey, lime juice, sesame oil, grated garlic and 3 tbsp hot water until smooth.","Toss the noodles with the sauce.","Add the carrots, cucumber and most of the green onions and toss again.","Top with the remaining green onions, sesame seeds and chili flakes."],
 tip:"The sauce thickens in the fridge. Loosen leftovers with a splash of warm water.",
 art:{bg:"#2B3A33",vessel:"bowl",vc:"#1F1F1F",layers:[{t:"strip",c:["#E9C98A","#D7AE62","#F0D79E"],x:0,y:0,r:1,n:80,s:0.7,l:9},{t:"strip",c:["#F07D1E","#F9A04A"],x:0.4,y:-0.35,r:0.3,n:16,s:0.55,l:4.5},{t:"round",c:["#6FAE4F","#E3F2C9"],x:-0.4,y:0.35,r:0.3,n:7,s:0.45,d:"cuke"},{t:"round",c:["#7FBF4A","#D9EFC2"],x:0,y:0,r:0.85,n:20,s:0.2,d:"ring"},{t:"dot",c:["#F3E7C4","#2B2B2B"],x:0,y:0,r:0.85,n:110,s:0.6},{t:"wedge",c:["#5FA83B","#CBE58C"],x:0.55,y:0.5,r:0.1,n:1,s:1}]}},

{id:"chickpea-curry",title:"Coconut Chickpea & Spinach Curry",meal:"Dinner",time:30,serves:4,kcal:520,protein:16,
 blurb:"A creamy, gently spiced pantry curry of chickpeas, tomatoes and coconut milk, with spinach wilted in at the end. Serve over rice.",
 ing:[["chickpeas",2,"2 cans chickpeas, drained"],["coconut_milk",1,"1 can coconut milk"],["diced_tomatoes",1,"1 can diced tomatoes"],["curry_powder",0.2,"2 tbsp curry powder"],["onion",0.17,"1 onion, diced"],["garlic",0.15,"4 garlic cloves, grated"],["spinach",0.6,"5 oz baby spinach"],["jasmine_rice",0.25,"1½ cups jasmine rice"],["lime",0.125,"1 lime"],["cilantro",0.4,"cilantro, to serve"]],
 pantry:"1 tbsp oil, 1 tsp grated ginger (optional), salt",
 steps:["Start the rice. Cook the onion in the oil over medium heat until soft, 6 minutes.","Add the garlic, ginger and curry powder and stir for 1 minute.","Add the tomatoes, coconut milk, chickpeas and 1 tsp salt. Simmer 12 minutes, mashing a few chickpeas to thicken it.","Stir in the spinach until wilted and add lime juice to taste.","Serve over rice with cilantro."],
 tip:"Toasting the curry powder in the oil before the liquids go in gives a much deeper flavor.",
 art:{bg:"#3A2F44",vessel:"bowl",vc:"#E9E4DA",layers:[{t:"base",c:["#E3A23A","#C4801E","#F2C060"],x:0,y:0,r:1},{t:"grain",c:["#FFFFFF","#F7F5EE"],x:-0.42,y:-0.3,r:0.4,n:420,s:1},{t:"bean",c:["#D9A85A","#F0CC88"],x:0.2,y:0.2,r:0.6,n:26,s:0.9},{t:"leaf",c:["#2F6B2A","#3E8A35"],x:0.2,y:0.2,r:0.65,n:12,s:0.6},{t:"leaf",c:["#4FA046","#6DBE5C"],x:0,y:0,r:0.8,n:16,s:0.28},{t:"wedge",c:["#5FA83B","#CBE58C"],x:0.6,y:-0.55,r:0.1,n:1,s:1}]}},

{id:"veggie-fried-rice",title:"15-Minute Veggie Fried Rice",meal:"Dinner",time:20,serves:4,kcal:430,protein:14,
 blurb:"Better than takeout and made from what's in the freezer: day-old rice, mixed vegetables, scrambled egg and a hit of soy and sesame.",
 ing:[["jasmine_rice",0.25,"1½ cups rice, cooked and chilled (about 4 cups cooked)"],["frozen_veg",1,"2 cups frozen mixed vegetables"],["eggs",0.34,"4 eggs"],["soy",0.15,"3 tbsp soy sauce"],["garlic",0.1,"3 garlic cloves, minced"],["green_onion",0.5,"4 green onions, sliced"],["sesame",0.05,"sesame seeds"]],
 pantry:"2 tbsp neutral oil, 1 tsp sesame oil",
 steps:["Heat 1 tbsp oil in your largest skillet over high heat. Scramble the eggs until just set and move to a plate.","Add the remaining oil, the garlic and the whites of the green onions for 30 seconds.","Add the frozen vegetables and cook 3 minutes.","Add the cold rice, press it into the pan and leave it 1 minute to crisp, then toss. Repeat twice.","Add the soy sauce, sesame oil and eggs and toss. Finish with green onion tops and sesame seeds."],
 tip:"Freshly cooked rice turns mushy. Cook it a day ahead, or spread it on a tray and chill for 30 minutes.",
 art:{bg:"#26343B",vessel:"skillet",vc:"#262626",layers:[{t:"grain",c:["#E8C98A","#D9B46A","#F2DDA8"],x:0,y:0,r:1,n:950,s:1},{t:"dot",c:["#5FA83B","#F07D1E","#F6C734"],x:0,y:0,r:0.9,n:110,s:2.2},{t:"crumble",c:["#F6D86A","#FFF2B0"],x:0,y:0,r:0.85,n:20,s:0.9},{t:"round",c:["#7FBF4A","#D9EFC2"],x:0,y:0,r:0.85,n:20,s:0.2,d:"ring"},{t:"dot",c:["#F3E7C4"],x:0,y:0,r:0.85,n:60,s:0.6}]}},

{id:"baked-ziti",title:"Three-Cheese Baked Ziti",meal:"Dinner",time:45,serves:6,kcal:560,protein:27,
 blurb:"Penne baked in marinara with pockets of creamy ricotta, a melted mozzarella top and a little spinach. Feeds a crowd and reheats beautifully.",
 ing:[["penne",1,"1 lb penne"],["marinara",1.5,"1½ jars (about 36 oz) marinara"],["ricotta",1,"15 oz ricotta"],["mozzarella",1.5,"3 cups shredded mozzarella"],["parmesan",0.3,"½ cup grated Parmesan"],["spinach",0.3,"2 handfuls baby spinach, chopped"]],
 pantry:"1 egg (optional), dried basil, salt, pepper",
 steps:["Heat the oven to 400°F. Boil the penne 2 minutes less than the package says. Drain.","Stir the ricotta with half the Parmesan, the spinach, the egg if using, salt and pepper.","Toss the pasta with most of the marinara and 1 cup mozzarella.","Layer half the pasta in a 9x13 dish, dollop on the ricotta mixture, then the rest of the pasta and sauce.","Top with the remaining mozzarella and Parmesan. Bake 20 minutes until bubbling and browned in spots. Rest 10 minutes."],
 tip:"Assemble it the night before, refrigerate covered and add 10 minutes to the bake.",
 art:{bg:"#2F3A2C",vessel:"dish",vc:"#B8462F",layers:[{t:"base",c:["#C8321F","#A1251A"],x:0,y:0,r:1.05},{t:"strip",c:["#F0D68A","#E2BF62"],x:0,y:0,r:0.95,n:36,s:1.6,l:2.2},{t:"blob",c:["#FFF6DA","#F5DC9C","#D99A4A"],x:0,y:0,r:0.95,n:22,s:0.85},{t:"leaf",c:["#3E9A45","#5BB860"],x:0,y:0,r:0.8,n:8,s:0.5,basil:1}]}},

{id:"turkey-chili",title:"Weeknight Turkey & Bean Chili",meal:"Dinner",time:40,serves:6,kcal:410,protein:33,
 blurb:"A hearty, smoky pot of lean turkey, two kinds of beans and tomatoes, piled with cheese and sour cream. Freezes like a dream.",
 ing:[["ground_turkey",1,"1 lb ground turkey"],["onion",0.17,"1 onion, diced"],["bell_peppers",0.34,"1 bell pepper, diced"],["taco_seasoning",0.5,"1 packet taco or chili seasoning"],["diced_tomatoes",2,"2 cans diced tomatoes"],["kidney_beans",1,"1 can kidney beans, drained"],["black_beans",1,"1 can black beans, drained"],["chicken_broth",0.5,"2 cups chicken broth"],["cheese_mex",0.3,"shredded cheese, to serve"],["sour_cream",0.25,"sour cream, to serve"]],
 pantry:"1 tbsp oil, salt",
 steps:["Brown the turkey in the oil in a large pot over medium-high, breaking it up, 6 minutes.","Add the onion and pepper and cook until soft, 5 minutes.","Stir in the seasoning for 30 seconds, then add the tomatoes, beans and broth.","Simmer uncovered 20 minutes, stirring now and then, until thick. Season with salt.","Serve topped with cheese and sour cream."],
 tip:"A spoon of honey or a square of dark chocolate stirred in at the end rounds out the flavor.",
 art:{bg:"#33302B",vessel:"bowl",vc:"#3A3A3A",layers:[{t:"base",c:["#9E3A1E","#7A2A12","#B85030"],x:0,y:0,r:1},{t:"crumble",c:["#8C4A2A","#5A2C16","#B06A40"],x:0,y:0,r:0.85,n:30,s:0.7},{t:"bean",c:["#6A1A1A","#A33A3A"],x:0,y:0,r:0.85,n:22,s:0.8},{t:"bean",c:["#1E1A22","#4A4352"],x:0,y:0,r:0.85,n:16,s:0.6},{t:"blob",c:["#F7D27A","#E6B048","#C48A2A"],x:-0.2,y:-0.1,r:0.35,n:8,s:0.4},{t:"dollop",c:["#FBFAF6","#E9E6DE"],x:0.15,y:0.1,r:0.15,n:1,s:0.75},{t:"round",c:["#7FBF4A","#D9EFC2"],x:0,y:0,r:0.85,n:16,s:0.2,d:"ring"}]}}
);

/* recipe facts for the planner: has = allergens/avoids, cuisine, main protein, skill 1-3, lc = easy to keep low-carb */
const META = {
  "gochujang-chicken":{has:["gluten","sesame","spicy"],cuisine:"Asian",protein:"chicken",skill:1},
  "lemon-orzo-shrimp":{has:["shellfish","dairy","gluten"],cuisine:"Mediterranean",protein:"shrimp",skill:2},
  "everything-salmon":{has:["fish","dairy","sesame"],cuisine:"American",protein:"fish",skill:2},
  "sweet-potato-tacos":{has:["dairy"],cuisine:"Mexican",protein:"veg",skill:1},
  "red-curry-shrimp":{has:["shellfish","gluten","spicy"],cuisine:"Asian",protein:"shrimp",skill:2,lc:1},
  "pesto-gnocchi":{has:["pork","dairy","gluten","nuts"],cuisine:"Italian",protein:"pork",skill:1},
  "bulgogi-bowls":{has:["beef","egg","gluten","sesame","spicy"],cuisine:"Asian",protein:"beef",skill:2},
  "greek-chicken-bowls":{has:["dairy","gluten","sesame"],cuisine:"Mediterranean",protein:"chicken",skill:2,lc:1},
  "tuscan-soup":{has:["pork","dairy","gluten"],cuisine:"Italian",protein:"pork",skill:1},
  "honey-garlic-pork":{has:["pork","dairy","gluten"],cuisine:"American",protein:"pork",skill:2},
  "shakshuka":{has:["egg","dairy","gluten"],cuisine:"Mediterranean",protein:"egg",skill:2,lc:1},
  "overnight-oats":{has:["dairy","gluten"],cuisine:"American",protein:"veg",skill:1},
  "avocado-egg-toast":{has:["egg","gluten","sesame","spicy"],cuisine:"American",protein:"egg",skill:1},
  "chicken-salad-wraps":{has:["dairy","gluten"],cuisine:"American",protein:"chicken",skill:1,lc:1},
  "steak-fajitas":{has:["beef","dairy","gluten"],cuisine:"Mexican",protein:"beef",skill:1,lc:1},
  "hot-honey-flatbread":{has:["pork","dairy","gluten","spicy"],cuisine:"Italian",protein:"pork",skill:1},
  "chicken-tortilla-soup":{has:["dairy"],cuisine:"Mexican",protein:"chicken",skill:1,lc:1},
  "egg-muffins":{has:["egg","dairy"],cuisine:"American",protein:"egg",skill:1,lc:1},
  "breakfast-burritos":{has:["egg","dairy","gluten","pork"],cuisine:"Mexican",protein:"pork",skill:2},
  "pb-banana-oats":{has:["dairy","nuts","gluten"],cuisine:"American",protein:"veg",skill:1},
  "yogurt-parfait":{has:["dairy","gluten","nuts"],cuisine:"American",protein:"veg",skill:1},
  "chickpea-salad":{has:["dairy"],cuisine:"Mediterranean",protein:"veg",skill:1},
  "turkey-hummus-wraps":{has:["gluten","sesame"],cuisine:"Mediterranean",protein:"turkey",skill:1},
  "caprese-pasta":{has:["dairy","gluten","nuts"],cuisine:"Italian",protein:"veg",skill:1},
  "bean-quesadillas":{has:["dairy","gluten"],cuisine:"Mexican",protein:"veg",skill:1},
  "peanut-noodles":{has:["gluten","nuts","sesame"],cuisine:"Asian",protein:"veg",skill:1},
  "chickpea-curry":{has:[],cuisine:"Indian",protein:"veg",skill:1},
  "veggie-fried-rice":{has:["egg","gluten","sesame"],cuisine:"Asian",protein:"egg",skill:1},
  "baked-ziti":{has:["dairy","gluten"],cuisine:"Italian",protein:"veg",skill:2},
  "turkey-chili":{has:["dairy"],cuisine:"American",protein:"turkey",skill:1,lc:1},
};
for(const [id,m] of Object.entries(META)){ m.veg = ["veg","egg"].includes(m.protein); m.pesc = m.veg || ["fish","shrimp"].includes(m.protein); }

/* real photos, keyed by recipe id; filled in when photos are available, otherwise the drawn illustration is used */
const PHOTOS = Object.assign({}, window.BB_PHOTOS||{}), PHOTO_CREDITS = Object.assign({}, window.BB_CREDITS||{});




/* ------------------------------------------------------------------ expanded pantry: estimated from a typical price (Walmart ~0.9x, Aldi ~0.8x, Trader Joe's ~1.08x) */
function G(name, aisle, pkg, base, costco, no){
  const o={}; const skip=(no||"").split(",");
  if(!skip.includes("tj")) o.tj=[pkg, +(base*1.08).toFixed(2), 1];
  if(costco && !skip.includes("costco")) o.costco=[costco[0], costco[2], costco[1]];
  if(!skip.includes("aldi")) o.aldi=[pkg, +(base*0.8).toFixed(2), 1];
  if(!skip.includes("walmart")) o.walmart=[pkg, +(base*0.9).toFixed(2), 1];
  return [name, aisle, o];
}
Object.assign(ITEMS, {
  heavy_cream:G("Heavy cream","Dairy & Eggs","Heavy Cream (16 oz)",3.99,["Kirkland Heavy Whipping Cream (half gallon)",4,7.99]),
  cheddar:G("Shredded sharp cheddar","Dairy & Eggs","Shredded Sharp Cheddar (8 oz)",2.79,["Kirkland Shredded Sharp Cheddar (2.5 lb)",5,10.99]),
  cheddar_slices:G("Sliced cheddar","Dairy & Eggs","Sliced Sharp Cheddar (8 oz)",2.99,["Tillamook Sliced Cheddar (2 lb)",4,10.99]),
  provolone:G("Sliced provolone","Dairy & Eggs","Sliced Provolone (8 oz)",3.29,["Kirkland Sliced Provolone (2 lb)",4,9.99]),
  cream_cheese:G("Cream cheese","Dairy & Eggs","Cream Cheese (8 oz)",2.29,["Philadelphia Cream Cheese (6 x 8 oz)",6,9.99]),
  bacon:G("Thick-cut bacon","Meat & Seafood","Thick-Cut Bacon (12 oz)",5.99,["Kirkland Thick Sliced Bacon (4 x 1 lb)",5.3,17.99]),
  chuck_roast:G("Beef chuck roast","Meat & Seafood","Boneless Chuck Roast (~3 lb)",22.49,["USDA Choice Chuck Roast (~4 lb)",1.33,23.99]),
  pork_shoulder:G("Boneless pork shoulder","Meat & Seafood","Boneless Pork Shoulder (~3 lb)",11.99,["Boneless Pork Shoulder, 2-pack (~8 lb)",2.7,22.99],"tj"),
  ground_pork:G("Ground pork","Meat & Seafood","Ground Pork (1 lb)",4.49,null),
  smoked_sausage:G("Andouille smoked sausage","Meat & Seafood","Andouille Smoked Sausage (12 oz)",4.49,["Aidells Cajun Andouille (2 x 28 oz)",4.7,15.99]),
  breakfast_sausage:G("Breakfast sausage","Meat & Seafood","Ground Breakfast Sausage (16 oz)",4.29,["Jimmy Dean Pork Sausage (3 x 1 lb)",3,11.99]),
  whole_chicken:G("Whole chicken","Meat & Seafood","Whole Chicken (~4.5 lb)",8.49,["Kirkland Whole Chickens, 2-pack (~10 lb)",2.2,15.99]),
  white_fish:G("Cod fillets","Meat & Seafood","Cod or Tilapia Fillets (1 lb)",7.49,["Kirkland Wild Cod Fillets (2 lb)",2,15.99]),
  smoked_salmon:G("Smoked salmon","Meat & Seafood","Smoked Salmon (4 oz)",6.49,["Kirkland Smoked Salmon (2 x 12 oz)",6,17.99]),
  salami:G("Sliced Genoa salami","Meat & Seafood","Sliced Genoa Salami (7 oz)",3.99,["Columbus Salame Trio (3 x 8 oz)",3.4,12.99]),
  tofu:G("Extra-firm tofu","Produce","Extra-Firm Tofu (14 oz)",2.19,null),
  ginger:G("Fresh ginger","Produce","Fresh Ginger (4 oz piece)",1.19,null,"costco"),
  oranges:G("Navel oranges","Produce","Navel Oranges (3 lb bag)",4.49,["Navel Oranges (8 lb)",2.67,9.99]),
  russet:G("Russet potatoes","Produce","Russet Potatoes (5 lb)",4.49,["Russet Potatoes (15 lb)",3,8.99]),
  romaine:G("Romaine hearts","Produce","Romaine Hearts (3 ct)",3.49,["Organic Romaine Hearts (6 ct)",2,5.49]),
  roma_tomatoes:G("Roma tomatoes","Produce","Roma Tomatoes (1 lb)",1.49,null,"costco"),
  jalapeno:G("Jalapeños","Produce","Jalapeños (3)",0.89,null,"costco"),
  parsley:G("Flat-leaf parsley","Produce","Flat-Leaf Parsley (bunch)",0.99,null,"costco"),
  basil:G("Fresh basil","Produce","Fresh Basil (0.75 oz)",2.49,null,"costco"),
  crushed_tomatoes:G("Crushed tomatoes","Pantry","Crushed Tomatoes (28 oz)",2.19,["Kirkland Organic Crushed Tomatoes? (6 x 28 oz)",6,10.99]),
  sun_dried:G("Sun-dried tomatoes","Pantry","Julienne Sun-Dried Tomatoes in Oil (8.5 oz)",3.49,null),
  refried_beans:G("Refried beans","Pantry","Refried Beans (16 oz)",1.49,null),
  beef_broth:G("Beef broth","Pantry","Beef Broth (32 oz)",2.29,["Kirkland Organic Beef Stock (6 x 32 oz)",6,13.99]),
  panko:G("Panko breadcrumbs","Pantry","Panko Breadcrumbs (8 oz)",2.29,null),
  lasagna:G("Lasagna noodles","Pantry","Lasagna Noodles (16 oz)",1.69,null),
  elbows:G("Elbow macaroni","Pantry","Elbow Macaroni (16 oz)",1.29,null),
  jumbo_shells:G("Jumbo pasta shells","Pantry","Jumbo Pasta Shells (12 oz)",1.99,null,"costco"),
  rice_noodles:G("Rice noodles","Pantry","Pad Thai Rice Noodles (14 oz)",2.79,null,"costco"),
  ramen:G("Ramen noodles","Pantry","Ramen Noodles (10 oz)",2.99,null,"costco"),
  peanuts:G("Roasted peanuts","Pantry","Roasted Peanuts (16 oz)",3.29,["Planters Dry Roasted Peanuts (2.5 lb)",2.5,8.99]),
  grits:G("Quick grits","Pantry","Quick Grits (24 oz)",2.49,null,"tj,costco"),
  tuna:G("Albacore tuna","Pantry","Solid White Albacore Tuna (5 oz can)",1.89,["Kirkland Albacore Tuna (8 x 7 oz)",11,19.99]),
  pickles:G("Dill pickles","Pantry","Dill Pickle Chips (24 oz)",2.79,null),
  maple_syrup:G("Maple syrup","Pantry","Pure Maple Syrup (12 oz)",7.49,["Kirkland Organic Maple Syrup (33.8 oz)",2.8,14.99]),
  choc_chips:G("Chocolate chips","Pantry","Semi-Sweet Chocolate Chips (12 oz)",2.99,["Kirkland Chocolate Chips (4.5 lb)",6,13.99]),
  enchilada_sauce:G("Red enchilada sauce","Sauces & Spices","Red Enchilada Sauce (19 oz)",2.49,null),
  chipotle:G("Chipotles in adobo","Sauces & Spices","Chipotle Peppers in Adobo (7 oz)",1.99,null,"costco"),
  garam_masala:G("Garam masala","Sauces & Spices","Garam Masala (2 oz)",3.49,null,"costco"),
  miso:G("White miso","Sauces & Spices","White Miso Paste (14 oz)",4.99,null,"aldi,costco"),
  curry_roux:G("Japanese curry roux","Sauces & Spices","Japanese Curry Sauce Mix (7.8 oz)",3.49,null,"aldi,costco"),
  bbq_sauce:G("BBQ sauce","Sauces & Spices","BBQ Sauce (18 oz)",1.99,["Sweet Baby Ray's BBQ Sauce (2 x 40 oz)",4.4,7.99]),
  cajun:G("Cajun seasoning","Sauces & Spices","Cajun Seasoning (8 oz)",2.99,null,"tj"),
  caesar:G("Caesar dressing","Sauces & Spices","Caesar Dressing (12 oz)",3.49,null),
  hoagie_rolls:G("Hoagie rolls","Bakery & Tortillas","Hoagie Rolls (6 ct)",3.29,null),
  burger_buns:G("Brioche buns","Bakery & Tortillas","Brioche Burger Buns (8 ct)",3.49,["Brioche Buns (12 ct)",1.5,6.99]),
  brioche:G("Brioche loaf","Bakery & Tortillas","Brioche Loaf (17.6 oz)",4.49,null),
  english_muffins:G("English muffins","Bakery & Tortillas","English Muffins (6 ct)",2.69,["Thomas' English Muffins (12 ct)",2,6.49]),
  bagels:G("Bagels","Bakery & Tortillas","Bagels (6 ct)",3.29,["Kirkland Bagels (2 x 6 ct)",2,6.99]),
  frozen_stirfry:G("Frozen stir-fry vegetables","Frozen","Stir-Fry Vegetable Blend (16 oz)",2.49,["Kirkland Stir Fry Vegetables (5.5 lb)",5.5,8.99]),
  edamame:G("Shelled edamame","Frozen","Shelled Edamame (12 oz)",2.49,["Organic Shelled Edamame (5 lb)",6.7,9.99]),
  dumplings:G("Frozen potstickers","Frozen","Pork Potstickers (16 oz)",4.29,["Bibigo Pork Dumplings (3 lb)",3,13.99]),
  puff_pastry:G("Puff pastry","Frozen","Puff Pastry Sheets (17 oz)",4.99,null,"costco"),
  hash_browns:G("Frozen hash browns","Frozen","Shredded Hash Browns (30 oz)",3.19,["Ore-Ida Shredded Hash Browns (6 lb)",3.2,8.99]),
});

/* ------------------------------------------------------------------ art helpers */
const ART = {
  A:(vessel,bg,vc,...layers)=>({bg,vessel,vc,layers}),
  sauce:(a,b,c)=>({t:"base",c:[a,b,c||a],x:0,y:0,r:1}),
  rice:(x=-0.42,y=-0.3,r=0.42,n=430)=>({t:"grain",c:["#FFFFFF","#F7F5EE"],x,y,r,n,s:1}),
  herbs:(n=16,c=["#4FA046","#6DBE5C"])=>({t:"leaf",c,x:0,y:0,r:0.8,n,s:0.28}),
  basil:(n=7)=>({t:"leaf",c:["#3E9A45","#5BB860"],x:0,y:0,r:0.7,n,s:0.55,basil:1}),
  lime:(x=0.6,y=-0.55)=>({t:"wedge",c:["#5FA83B","#CBE58C"],x,y,r:0.1,n:1,s:1}),
  lemon:(x=0.6,y=-0.55)=>({t:"wedge",c:["#F7D63E","#FCEFA0"],x,y,r:0.1,n:1,s:1}),
  chunks:(c,x=0,y=0,r=0.6,n=10,s=1)=>({t:"chunk",c,x,y,r,n,s}),
  scallion:(n=18)=>({t:"round",c:["#7FBF4A","#D9EFC2"],x:0,y:0,r:0.85,n,s:0.2,d:"ring"}),
  sesame:(n=90)=>({t:"dot",c:["#F3E7C4","#2B2B2B"],x:0,y:0,r:0.85,n,s:0.6}),
  pepper:(n=70)=>({t:"dot",c:["#2B2B2B","#4A4A4A"],x:0,y:0,r:0.85,n,s:0.5}),
  cheese:(x=0,y=0,r=0.9,n=20,s=0.8)=>({t:"blob",c:["#FFF6DA","#F5DC9C","#D99A4A"],x,y,r,n,s}),
  parm:(n=110)=>({t:"dot",c:["#FFF7E1","#F0E2BD"],x:0,y:0,r:0.85,n,s:0.9}),
  dollop:(x,y,s=0.7,c=["#FBFAF6","#E9E6DE"])=>({t:"dollop",c,x,y,r:0.1,n:1,s}),
};
const GOLD=["#D99A4A","#9C5A1E","#F2C27A"], CRISP=["#E0A44E","#A8661E","#F6CF86"], BEEF=["#6B3A22","#3E1F10","#8C5333"], PORK=["#B9774E","#7A4220","#D9A27A"];


/* ------------------------------------------------------------------ the big library */
const MORE = [
/* ===== DINNERS ===== */
{id:"butter-chicken",title:"Butter Chicken",meal:"Dinner",time:45,serves:4,kcal:690,protein:40,m:{has:["dairy","gluten"],cuisine:"Indian",protein:"chicken",skill:2},
 blurb:"Yogurt-marinated chicken thighs charred under the broiler, then simmered in a silky, gently spiced tomato-butter-cream sauce. Better than most takeout.",
 ing:[["chicken_thigh",1,"1½ lb boneless chicken thighs, in bite-size pieces"],["greek_yogurt",0.15,"½ cup plain Greek yogurt"],["garam_masala",0.3,"1 tbsp garam masala, divided"],["ginger",0.5,"2-inch piece ginger, grated"],["garlic",0.2,"6 garlic cloves, grated"],["butter",0.1,"4 tbsp butter"],["onion",0.17,"1 onion, finely diced"],["crushed_tomatoes",0.5,"14 oz crushed tomatoes (half a 28-oz can)"],["heavy_cream",0.5,"1 cup heavy cream"],["jasmine_rice",0.25,"1½ cups basmati or jasmine rice"],["naan",1,"naan, to serve"],["cilantro",0.4,"cilantro"]],
 pantry:"2 tsp chili powder or paprika, 1 tsp cumin, 1 tsp sugar, salt",
 steps:["Toss the chicken with the yogurt, half the garlic and ginger, 1 tsp garam masala, the chili powder and 1 tsp salt. Marinate 15 minutes or overnight.","Broil the chicken on a foil-lined sheet pan 8 to 10 minutes, until charred at the edges. It will finish in the sauce. Start the rice.","Melt 3 tbsp butter in a deep skillet. Cook the onion until soft and golden, 8 minutes. Add the remaining garlic, ginger, garam masala and the cumin for 1 minute.","Add the tomatoes and sugar and simmer 8 minutes until thick and darker red. Blend smooth if you like it restaurant-silky.","Stir in the cream and the chicken with its juices. Simmer 5 minutes, then finish with the last tbsp butter and salt to taste. Serve with rice, warm naan and cilantro."],
 tip:"Charring the chicken under the broiler gives the smoky, tandoor-like flavor that makes this taste like a restaurant made it.",
 art:ART.A("bowl","#3A2F44","#E9E4DA",ART.sauce("#E07A2E","#B9541A","#F29A50"),ART.rice(),ART.chunks(["#C9632A","#7E2F0E","#E8904F"],0.2,0.2,0.55,9,0.9),ART.herbs(16))},

{id:"chana-masala",title:"Chana Masala",meal:"Dinner",time:35,serves:4,kcal:430,protein:15,m:{has:[],cuisine:"Indian",protein:"veg",skill:1},
 blurb:"Punjabi-style chickpeas in a deeply browned onion, ginger and tomato gravy with warm spices and a squeeze of lemon. Vegan, pantry-friendly and deeply savory.",
 ing:[["chickpeas",2,"2 cans chickpeas, drained"],["onion",0.34,"2 onions, finely diced"],["garlic",0.15,"5 garlic cloves, grated"],["ginger",0.5,"2-inch piece ginger, grated"],["jalapeno",0.34,"1 jalapeño, minced"],["crushed_tomatoes",0.5,"14 oz crushed tomatoes"],["garam_masala",0.3,"2 tsp garam masala"],["lemon",0.17,"1 lemon"],["cilantro",0.5,"cilantro"],["jasmine_rice",0.25,"1½ cups basmati or jasmine rice"]],
 pantry:"3 tbsp oil, 2 tsp cumin, 1 tsp coriander, ½ tsp turmeric, salt",
 steps:["Start the rice. Heat the oil over medium and cook the onions with a pinch of salt, stirring, until deep golden brown, 12 to 15 minutes. Don't rush this. It's where the flavor comes from.","Add the garlic, ginger and jalapeño for 1 minute, then the cumin, coriander, turmeric and garam masala for 30 seconds.","Add the tomatoes and cook until the oil starts to separate at the edges, 5 minutes.","Add the chickpeas and 1 cup water. Simmer 10 minutes, mashing a handful of chickpeas to thicken the gravy.","Season with salt and lemon juice. Serve over rice with lots of cilantro."],
 tip:"A splash of the chickpea can liquid makes the gravy extra creamy.",
 art:ART.A("bowl","#33302B","#2E5E6E",ART.sauce("#B9541A","#8E3A10","#D2702E"),ART.rice(-0.4,-0.32,0.38),{t:"bean",c:["#D9A85A","#F0CC88"],x:0.2,y:0.2,r:0.6,n:30,s:0.9},ART.herbs(18),ART.lemon())},

{id:"birria-tacos",title:"Birria-Style Beef Tacos with Consommé",meal:"Dinner",time:210,serves:6,kcal:720,protein:46,m:{has:["dairy"],cuisine:"Mexican",protein:"beef",skill:3},
 blurb:"A weekend project worth every minute: chuck roast braised in a smoky chile broth until it falls apart, tucked into tortillas dipped in the red fat, crisped with melty cheese and dunked in the consommé.",
 ing:[["chuck_roast",1,"3 lb boneless chuck roast, in 3-inch chunks"],["enchilada_sauce",1,"19 oz red enchilada sauce"],["chipotle",0.5,"3 chipotles in adobo plus 2 tbsp sauce"],["beef_broth",1,"4 cups beef broth"],["onion",0.34,"2 onions (1 quartered, 1 finely diced)"],["garlic",0.25,"8 garlic cloves"],["corn_tortillas",1,"18 corn tortillas"],["mozzarella",1.5,"3 cups shredded mozzarella or Oaxaca"],["cilantro",1,"1 bunch cilantro, chopped"],["lime",0.5,"4 limes"]],
 pantry:"1 tbsp oil, 1 tbsp cumin, 2 tsp dried oregano, 2 bay leaves, 1 cinnamon stick (optional), 1 tbsp vinegar, salt",
 steps:["Season the beef with 2 tsp salt and brown it hard in the oil in a Dutch oven, in batches. Set aside.","Blend the enchilada sauce, chipotles, garlic, cumin, oregano, vinegar and 1 cup broth. Pour into the pot with the remaining broth, the quartered onion, bay leaves and cinnamon. Add the beef.","Cover and braise at 325°F for 3 hours, until the beef shreds easily with a fork. Shred it and skim the red fat from the top into a bowl. Season the broth (the consommé) with salt and lime.","Heat a griddle or skillet over medium-high. Dip a tortilla in the reserved fat, lay it in the pan, top with cheese and beef, fold and cook until crisp on both sides, about 2 minutes per side.","Serve the tacos with cups of hot consommé topped with diced onion and cilantro, and lime wedges for squeezing."],
 tip:"Make the beef a day ahead. The fat sets on top in the fridge and lifts right off for dipping.",
 art:ART.A("board","#2A2420","#7A5434",{t:"taco",c:["#C9622A","#8E3A10"],n:3},{t:"shred",c:["#7A3A1E","#9C5230"],x:0,y:0,r:0.8,n:16,s:0.8,taco:1},{t:"leaf",c:["#3E8A35","#5BA84A","#F2EFE6"],x:0,y:0,r:0.8,n:26,s:0.25,taco:1},ART.lime(0.7,0.7))},

{id:"chicken-tinga",title:"Chicken Tinga Tostadas",meal:"Dinner",time:35,serves:4,kcal:560,protein:38,m:{has:["dairy","spicy"],cuisine:"Mexican",protein:"chicken",skill:1},
 blurb:"Shredded chicken simmered in a smoky chipotle-tomato sauce, piled onto crunchy oven-baked tostadas with refried beans, lettuce, crema and crumbled cheese.",
 ing:[["chicken_breast",1,"1½ lb chicken breasts"],["onion",0.34,"1 large onion, thinly sliced"],["garlic",0.1,"3 garlic cloves"],["chipotle",0.5,"2 to 3 chipotles in adobo, chopped, plus 1 tbsp sauce"],["crushed_tomatoes",0.5,"14 oz crushed tomatoes"],["corn_tortillas",0.7,"12 corn tortillas"],["refried_beans",1,"1 can refried beans, warmed"],["romaine",0.34,"1 romaine heart, shredded"],["sour_cream",0.25,"½ cup sour cream"],["feta",0.5,"½ cup crumbled cotija or feta"],["avocado",0.5,"2 avocados"]],
 pantry:"3 tbsp oil, 1 tsp dried oregano, salt",
 steps:["Simmer the chicken in salted water to cover until cooked through, 15 minutes. Shred with two forks and save 1 cup of the broth.","Brush the tortillas with oil, spread on sheet pans and bake at 400°F for 8 to 10 minutes, flipping once, until crisp and golden.","Cook the onion in 1 tbsp oil until soft and lightly browned. Add the garlic, chipotles and oregano for 1 minute.","Add the tomatoes and reserved broth, simmer 5 minutes, then stir in the chicken and simmer until saucy, 5 minutes. Season with salt.","Spread each tostada with beans, then chicken, lettuce, crema, cheese and avocado."],
 tip:"Start with 2 chipotles for medium heat. You can always stir in more adobo sauce.",
 art:ART.A("board","#2E3B4D","#B88A58",{t:"flatbread",c:["#E9B95E","#C9902F","#F2D29A"],n:1},{t:"base",c:["#5A3A2A","#3E281C"],x:0,y:0,r:0.75,flat:1},{t:"shred",c:["#C9572A","#A8401E"],x:0,y:0,r:0.7,n:20,s:0.9,flat:1},{t:"leaf",c:["#8CC05A","#B6DB82"],x:0,y:0,r:0.7,n:24,s:0.35,flat:1},{t:"drizzle",c:["#FBF8F1"],n:1,w:4,flat:1},{t:"crumble",c:["#FFFFFF","#EDEAE2"],x:0,y:0,r:0.7,n:16,s:0.4,flat:1})},

{id:"carnitas-bowls",title:"Crispy Carnitas Burrito Bowls",meal:"Dinner",time:200,serves:6,kcal:740,protein:42,m:{has:["dairy"],cuisine:"Mexican",protein:"pork",skill:2},
 blurb:"Pork shoulder slow-roasted with orange and lime until meltingly tender, then crisped under the broiler and piled over cilantro-lime rice with beans, corn, salsa and guac.",
 ing:[["pork_shoulder",1,"3 lb boneless pork shoulder, in 2-inch chunks"],["oranges",0.34,"2 oranges"],["lime",0.5,"4 limes"],["garlic",0.2,"6 garlic cloves, smashed"],["onion",0.17,"1 onion, quartered"],["jasmine_rice",0.34,"2 cups rice"],["cilantro",1,"1 bunch cilantro"],["black_beans",2,"2 cans black beans"],["frozen_corn",0.75,"1½ cups corn"],["salsa",1,"16 oz salsa"],["avocado",0.75,"3 avocados"],["sour_cream",0.5,"1 cup sour cream"]],
 pantry:"2 tsp cumin, 2 tsp dried oregano, 1 tbsp salt, 2 bay leaves",
 steps:["Heat the oven to 325°F. Toss the pork with the salt, cumin and oregano in a Dutch oven. Squeeze in the oranges and 2 limes, then add the squeezed halves, garlic, onion and bay leaves.","Cover and roast 2½ to 3 hours, until the pork falls apart. Shred it right in its juices and fat.","Spread the pork on a sheet pan with a ladle of the juices and broil 5 to 8 minutes, until the edges are browned and crispy.","Meanwhile cook the rice and stir in chopped cilantro and the juice of 1 lime. Warm the beans and corn. Mash the avocados with lime and salt.","Build bowls: rice, beans, corn, carnitas, salsa, guacamole and sour cream."],
 tip:"Leftover carnitas crisp up perfectly in a hot skillet. Use them for tacos or breakfast hash later in the week.",
 art:ART.A("bowl","#33302B","#C9562E",ART.rice(-0.35,-0.35,0.42,420),{t:"shred",c:["#B8763E","#8C4A1E","#D99A5A"],x:0.3,y:-0.2,r:0.38,n:24,s:0.9},{t:"bean",c:["#1E1A22","#4A4352"],x:-0.4,y:0.35,r:0.25,n:16,s:0.55},{t:"dot",c:["#F6C734","#E8A81E"],x:0.4,y:0.4,r:0.22,n:40,s:1.8},{t:"dollop",c:["#9BC15A","#7EA63E"],x:0,y:0.45,r:0.1,n:1,s:0.9},{t:"dollop",c:["#C8321F","#9E2414"],x:0.05,y:0.05,r:0.1,n:1,s:0.7},ART.herbs(14),ART.lime())},


{id:"chicken-parm",title:"Crispy Chicken Parmesan",meal:"Dinner",time:45,serves:4,kcal:780,protein:52,m:{has:["dairy","gluten","egg"],cuisine:"Italian",protein:"chicken",skill:2},
 blurb:"Thin, golden panko-Parmesan cutlets topped with marinara and bubbling mozzarella, served over spaghetti. The red-sauce classic, done right.",
 ing:[["chicken_breast",1,"1½ lb chicken breasts, halved horizontally into cutlets"],["eggs",0.17,"2 eggs"],["panko",1,"1½ cups panko"],["parmesan",0.5,"¾ cup grated Parmesan, divided"],["marinara",1,"24 oz marinara"],["mozzarella",1,"2 cups shredded mozzarella"],["spaghetti",1,"1 lb spaghetti"],["basil",1,"fresh basil"]],
 pantry:"½ cup flour, ½ cup oil for frying, 1 tsp garlic powder, salt, pepper",
 steps:["Pound the cutlets to an even ¼ inch and season with salt and pepper. Set up 3 shallow dishes: flour; beaten eggs; panko mixed with ½ cup Parmesan and the garlic powder.","Dredge each cutlet in flour, then egg, then press firmly into the panko.","Fry in ¼ inch of hot oil over medium-high until deep golden, 3 minutes per side. Drain on a rack. Heat the broiler. Boil the spaghetti.","Lay the cutlets on a sheet pan, top each with a few spoons of marinara and a handful of mozzarella and Parmesan. Broil 2 to 3 minutes until bubbling and spotty.","Toss the spaghetti with the remaining warm marinara. Serve the chicken on top with torn basil."],
 tip:"Put the sauce only on the center of each cutlet so the edges stay crunchy.",
 art:ART.A("plate","#2A3842","#F4F1EA",{t:"strip",c:["#F0D68A","#E2BF62"],x:-0.35,y:0.35,r:0.45,n:50,s:0.6,l:9},{t:"base",c:["#C8321F","#A1251A"],x:-0.35,y:0.35,r:0.25},{t:"fillet",c:["#D99A4A","#B9773A","#8E5A22"],x:0.15,y:-0.15,r:0.45,n:1,s:1},{t:"base",c:["#C8321F","#A1251A"],x:0.15,y:-0.15,r:0.28},ART.cheese(0.15,-0.15,0.3,12,0.6),ART.basil(5))},

{id:"carbonara",title:"Spaghetti Carbonara",meal:"Dinner",time:20,serves:4,kcal:680,protein:30,m:{has:["dairy","gluten","egg","pork"],cuisine:"Italian",protein:"pork",skill:2},
 blurb:"The Roman classic: crisp bacon, a glossy sauce of egg yolks and Parmesan emulsified with starchy pasta water, and loads of cracked black pepper. No cream needed.",
 ing:[["spaghetti",1,"1 lb spaghetti"],["bacon",1,"12 oz thick-cut bacon (or pancetta), in strips"],["eggs",0.42,"2 whole eggs plus 3 yolks"],["parmesan",0.8,"1¼ cups finely grated Parmesan"],["garlic",0.05,"1 garlic clove, smashed"]],
 pantry:"Lots of freshly ground black pepper, salt",
 steps:["Whisk the eggs, yolks, Parmesan and 1½ tsp coarsely ground pepper into a thick paste.","Cook the bacon and garlic in a large skillet over medium until the bacon is crisp, 8 minutes. Discard the garlic and turn off the heat.","Boil the spaghetti in lightly salted water until al dente. Save 1½ cups of the pasta water.","Add the hot pasta to the bacon pan off the heat, toss, then add the egg mixture and ½ cup pasta water. Toss vigorously for 1 minute until creamy and glossy. Add more water as needed. The pan must be off the heat or the eggs will scramble.","Serve immediately with more Parmesan and pepper."],
 tip:"Grate the Parmesan on the finest holes you have. Coarse shreds won't melt into a smooth sauce.",
 art:ART.A("bowl","#2B3A33","#F4F1EA",{t:"strip",c:["#F2DC9A","#E6C870","#F8E8B0"],x:0,y:0,r:1,n:85,s:0.75,l:9},{t:"strip",c:["#B5502E","#8E3A1E"],x:0,y:0,r:0.7,n:16,s:0.9,l:2.2,sear:1},ART.parm(140),ART.pepper(120))},

{id:"marry-me-chicken",title:"Marry Me Chicken",meal:"Dinner",time:35,serves:4,kcal:640,protein:45,m:{has:["dairy"],cuisine:"Italian",protein:"chicken",skill:1,lc:1},
 blurb:"Golden seared chicken in a rich, garlicky sun-dried tomato and Parmesan cream sauce with wilted spinach. Have bread ready for the sauce.",
 ing:[["chicken_breast",1,"1½ lb chicken breasts, halved into cutlets"],["sun_dried",0.6,"½ cup sun-dried tomatoes, chopped, plus 1 tbsp of their oil"],["garlic",0.15,"4 garlic cloves, minced"],["chicken_broth",0.25,"1 cup chicken broth"],["heavy_cream",0.5,"1 cup heavy cream"],["parmesan",0.5,"¾ cup grated Parmesan"],["spinach",0.4,"3 handfuls baby spinach"],["basil",1,"fresh basil"],["penne",0.75,"12 oz pasta or crusty bread, to serve"]],
 pantry:"1 tbsp olive oil, 1 tsp Italian seasoning, red pepper flakes, salt, pepper",
 steps:["Season the cutlets with salt, pepper and Italian seasoning. Sear in the oil over medium-high until golden and cooked through, 4 to 5 minutes per side. Move to a plate.","Lower the heat. Add the sun-dried tomato oil, garlic and a pinch of pepper flakes for 30 seconds, then the sun-dried tomatoes.","Pour in the broth and scrape up the browned bits. Add the cream and simmer 3 minutes.","Stir in the Parmesan and spinach until the spinach wilts and the sauce is silky.","Return the chicken and its juices and spoon the sauce over. Finish with basil and serve over pasta or with bread."],
 tip:"Don't wipe out the pan after searing. Those browned bits are the base of the sauce.",
 art:ART.A("skillet","#3C3530","#262626",ART.sauce("#E8A060","#C9783A","#F2BC80"),{t:"fillet",c:["#D99A4A","#B9773A","#E8B86A"],x:-0.2,y:-0.2,r:0.32,n:1,s:1},{t:"fillet",c:["#D99A4A","#B9773A","#E8B86A"],x:0.25,y:0.25,r:0.32,n:1,s:1},{t:"shave",c:["#8E1E12","#B32E1E"],x:0,y:0,r:0.85,n:18,s:0.5},{t:"leaf",c:["#2F6B2A","#3E8A35"],x:0,y:0,r:0.85,n:16,s:0.55},ART.basil(5))},

{id:"beef-lasagna",title:"Classic Beef & Sausage Lasagna",meal:"Dinner",time:110,serves:8,kcal:720,protein:42,m:{has:["beef","pork","dairy","gluten","egg"],cuisine:"Italian",protein:"beef",skill:2},
 blurb:"Tall, sliceable layers of meaty sauce, creamy ricotta and molten mozzarella under a browned, bubbling top. The Sunday dinner that feeds you through Wednesday.",
 ing:[["ground_beef",1,"1 lb ground beef"],["italian_sausage",1,"1 lb Italian sausage, casings removed"],["onion",0.17,"1 onion, diced"],["garlic",0.15,"4 garlic cloves, minced"],["marinara",2,"2 jars (48 oz) marinara"],["lasagna",1,"1 box lasagna noodles"],["ricotta",1,"15 oz ricotta"],["eggs",0.09,"1 egg"],["parmesan",0.6,"1 cup grated Parmesan, divided"],["mozzarella",2,"4 cups shredded mozzarella"],["basil",1,"fresh basil"]],
 pantry:"1 tbsp olive oil, 1 tsp dried oregano, salt, pepper",
 steps:["Brown the beef and sausage with the onion in the oil, 10 minutes. Add the garlic and oregano, then the marinara and ½ cup water. Simmer 15 minutes.","Boil the noodles 2 minutes short of the package time. Drain and lay flat on oiled foil.","Mix the ricotta, egg, ½ cup Parmesan, chopped basil, salt and pepper.","In a 9x13, layer: 1 cup sauce, noodles, ⅓ of the ricotta, 1 cup mozzarella, sauce. Repeat twice, then finish with noodles, sauce, the remaining mozzarella and Parmesan.","Cover with oiled foil and bake at 375°F for 40 minutes, uncover and bake 15 minutes more until browned. Rest 20 minutes before cutting, or it won't hold its shape."],
 tip:"Freeze half before baking. Bake from frozen, covered, at 375°F for about 90 minutes.",
 art:ART.A("dish","#3A3631","#B8462F",{t:"base",c:["#C8321F","#A1251A"],x:0,y:0,r:1.05},ART.cheese(0,0,0.95,40,0.85),{t:"crumble",c:["#8C4A2A","#5A2C16"],x:0,y:0,r:0.9,n:20,s:0.5},ART.basil(8))},

{id:"shrimp-scampi",title:"Garlic Butter Shrimp Scampi Linguine",meal:"Dinner",time:25,serves:4,kcal:610,protein:34,m:{has:["shellfish","dairy","gluten"],cuisine:"Italian",protein:"shrimp",skill:1},
 blurb:"Plump shrimp in a lemony, garlicky butter sauce with a pinch of chili, tossed with linguine and plenty of parsley.",
 ing:[["shrimp",1,"1 lb large shrimp, peeled"],["spaghetti",1,"1 lb linguine or spaghetti"],["butter",0.15,"5 tbsp butter"],["garlic",0.25,"8 garlic cloves, thinly sliced"],["lemon",0.34,"2 lemons"],["chicken_broth",0.15,"½ cup broth or dry white wine"],["parsley",1,"1 bunch parsley, chopped"],["parmesan",0.2,"Parmesan, to serve"]],
 pantry:"2 tbsp olive oil, red pepper flakes, salt, pepper",
 steps:["Boil the pasta in well-salted water. Save 1 cup pasta water.","Season the shrimp. Heat the oil and 1 tbsp butter in a large skillet over medium-high and cook the shrimp 1 minute per side. Move to a plate.","Lower the heat and add 2 tbsp butter, the garlic and pepper flakes. Cook gently until the garlic is pale gold, 2 minutes.","Add the broth or wine and the juice of 1 lemon and simmer 2 minutes. Add the pasta, remaining butter and a splash of pasta water and toss until glossy.","Return the shrimp, add the parsley and lemon zest, and toss. Serve with lemon wedges and Parmesan."],
 tip:"Pull the shrimp while they're still slightly translucent. They finish cooking in the sauce.",
 art:ART.A("plate","#26343B","#F4F1EA",{t:"strip",c:["#F2DC9A","#E6C870","#F8E8B0"],x:0,y:0,r:0.85,n:70,s:0.7,l:9},{t:"shrimp",c:["#F28A5B","#FFC8A4","#D9653A"],x:0,y:0,r:0.6,n:9,s:1},{t:"leaf",c:["#2F7A2A","#4A9A3A"],x:0,y:0,r:0.8,n:40,s:0.22},ART.lemon(0.62,-0.5))},

{id:"chicken-alfredo",title:"Chicken & Broccoli Fettuccine Alfredo",meal:"Dinner",time:30,serves:4,kcal:820,protein:45,m:{has:["dairy","gluten"],cuisine:"Italian",protein:"chicken",skill:1},
 blurb:"A real Alfredo made with butter, cream and Parmesan, not a jar. Seared chicken and tender broccoli make it a full meal.",
 ing:[["chicken_breast",0.67,"1 lb chicken breasts"],["spaghetti",1,"1 lb fettuccine or spaghetti"],["broccoli",1,"1 lb broccoli florets"],["butter",0.1,"4 tbsp butter"],["garlic",0.1,"3 garlic cloves, minced"],["heavy_cream",0.75,"1½ cups heavy cream"],["parmesan",0.8,"1¼ cups grated Parmesan"],["parsley",0.5,"parsley"]],
 pantry:"1 tbsp olive oil, nutmeg, salt, pepper",
 steps:["Season and sear the chicken in the oil until cooked through, 5 to 6 minutes per side. Rest, then slice.","Boil the pasta, adding the broccoli for the last 3 minutes. Save 1 cup pasta water and drain.","Melt the butter in the empty pot with the garlic for 1 minute. Add the cream and simmer 3 minutes.","Off the heat, whisk in the Parmesan a handful at a time with a pinch of nutmeg.","Toss in the pasta and broccoli, loosening with pasta water. Top with the chicken, pepper and parsley."],
 tip:"Alfredo thickens fast as it cools. Keep some pasta water nearby to loosen it at the table.",
 art:ART.A("bowl","#3C3530","#2E5E6E",{t:"strip",c:["#F6E8C0","#EBD8A0","#FBF2D8"],x:0,y:0,r:1,n:85,s:0.75,l:9},{t:"floret",c:["#3E7B2E","#2C5E22","#6FA04A"],x:0,y:0,r:0.75,n:6,s:0.8},{t:"slab",c:["#E7B76A","#B97A35","#7A4A1E"],x:0.15,y:-0.1,r:0.3,n:4,s:0.8},ART.parm(100),ART.pepper(60))},

{id:"stuffed-shells",title:"Spinach & Three-Cheese Stuffed Shells",meal:"Dinner",time:50,serves:6,kcal:560,protein:28,m:{has:["dairy","gluten","egg"],cuisine:"Italian",protein:"veg",skill:1},
 blurb:"Jumbo shells stuffed with lemony ricotta, spinach and Parmesan, nestled in marinara under melted mozzarella. Vegetarian comfort food that kids devour.",
 ing:[["jumbo_shells",1,"12 oz jumbo shells"],["ricotta",2,"30 oz ricotta"],["spinach",0.6,"5 oz baby spinach, chopped"],["parmesan",0.5,"¾ cup grated Parmesan"],["eggs",0.09,"1 egg"],["lemon",0.17,"1 lemon, zested"],["marinara",1.25,"30 oz marinara"],["mozzarella",1,"2 cups shredded mozzarella"],["basil",1,"basil"]],
 pantry:"1 tsp garlic powder, nutmeg, salt, pepper",
 steps:["Heat the oven to 375°F. Boil the shells until just al dente and drain on an oiled sheet so they don't stick.","Wilt the spinach in a dry pan and squeeze it dry.","Mix the ricotta, spinach, ½ cup Parmesan, egg, lemon zest, garlic powder, nutmeg, 1 tsp salt and pepper.","Spread 1½ cups marinara in a 9x13. Stuff each shell with a heaped spoonful of filling and nestle in, open side up. Spoon over the remaining sauce and top with mozzarella and Parmesan.","Cover and bake 25 minutes, uncover and bake 10 more until bubbling. Finish with basil."],
 tip:"A zip-top bag with the corner snipped off makes filling the shells fast and tidy.",
 art:ART.A("dish","#2F3A2C","#E9E1CF",{t:"base",c:["#C8321F","#A1251A"],x:0,y:0,r:1.05},{t:"pillow",c:["#F0D68A","#D9B060","#F6F2E6"],x:0,y:0,r:0.9,n:12,s:1.8},ART.cheese(0,0,0.9,22,0.55),ART.basil(8))},

{id:"orange-chicken",title:"Better-Than-Takeout Orange Chicken",meal:"Dinner",time:35,serves:4,kcal:620,protein:38,m:{has:["gluten","sesame"],cuisine:"Asian",protein:"chicken",skill:2},
 blurb:"Crispy cornstarch-coated chicken tossed in a sticky, tangy sauce made with fresh orange juice and zest, served with rice and steamed broccoli.",
 ing:[["chicken_thigh",1,"1½ lb boneless chicken thighs, in 1-inch pieces"],["eggs",0.09,"1 egg"],["oranges",0.34,"2 oranges (zest and ¾ cup juice)"],["soy",0.15,"3 tbsp soy sauce"],["honey",0.15,"¼ cup honey"],["garlic",0.1,"3 garlic cloves, grated"],["ginger",0.25,"1-inch ginger, grated"],["jasmine_rice",0.25,"1½ cups jasmine rice"],["broccoli",1,"1 lb broccoli"],["green_onion",0.5,"green onions"],["sesame",0.1,"sesame seeds"]],
 pantry:"¾ cup cornstarch, ½ cup oil, 2 tbsp rice vinegar, red pepper flakes, salt",
 steps:["Start the rice. Whisk the orange zest and juice, soy, honey, vinegar, garlic, ginger, pepper flakes and 1 tbsp cornstarch for the sauce.","Toss the chicken with the egg and a pinch of salt, then with the remaining cornstarch until every piece is coated.","Shallow-fry in batches in ¼ inch hot oil until deep golden and crisp, 5 to 6 minutes. Drain. Steam the broccoli.","Wipe out the pan and simmer the sauce, stirring, until thick and glossy, 2 minutes.","Toss the chicken in the sauce right before serving. Top with green onions and sesame seeds."],
 tip:"Toss at the last second. Crispy chicken goes soft if it sits in sauce.",
 art:ART.A("bowl","#2B3340","#1F1F1F",ART.rice(-0.38,-0.3,0.42),ART.chunks(["#E0782A","#A8461A","#F4A050"],0.25,0.2,0.5,11,0.9),{t:"floret",c:["#3E7B2E","#2C5E22","#6FA04A"],x:-0.4,y:0.4,r:0.25,n:4,s:0.9},ART.scallion(16),ART.sesame(80))},

{id:"beef-broccoli",title:"Beef & Broccoli Stir-Fry",meal:"Dinner",time:25,serves:4,kcal:540,protein:36,m:{has:["beef","gluten"],cuisine:"Asian",protein:"beef",skill:1},
 blurb:"Tender, velveted strips of beef and crisp-tender broccoli in a glossy garlic-ginger-soy sauce. Faster than delivery.",
 ing:[["sirloin",0.75,"1¼ lb sirloin or flank steak, very thinly sliced"],["broccoli",1.5,"1½ lb broccoli florets"],["soy",0.2,"⅓ cup soy sauce"],["honey",0.1,"2 tbsp honey or brown sugar"],["garlic",0.15,"4 garlic cloves, minced"],["ginger",0.25,"1-inch ginger, grated"],["beef_broth",0.15,"½ cup beef broth"],["jasmine_rice",0.25,"1½ cups jasmine rice"],["sesame",0.05,"sesame seeds"]],
 pantry:"2 tbsp cornstarch, ¼ tsp baking soda, 2 tbsp oil, 1 tsp sesame oil",
 steps:["Toss the beef with 1 tbsp soy, 1 tbsp cornstarch and the baking soda. Rest 15 minutes. This makes it tender. Start the rice.","Whisk the remaining soy, honey, broth, sesame oil and 1 tbsp cornstarch.","Sear the beef in a very hot pan with 1 tbsp oil in a single layer, 1 minute per side. Remove.","Add the remaining oil and the broccoli with 2 tbsp water. Cover and cook 2 minutes. Add the garlic and ginger for 30 seconds.","Add the sauce and beef and toss until thick and glossy, 1 minute. Serve over rice with sesame seeds."],
 tip:"Freeze the steak for 20 minutes before slicing to get paper-thin strips.",
 art:ART.A("skillet","#2B3A33","#262626",{t:"strip",c:["#5A2E18","#7A3E22","#4A2312"],x:0,y:0,r:0.85,n:26,s:1.2,l:2.6,sear:1},{t:"floret",c:["#3E7B2E","#2C5E22","#6FA04A"],x:0,y:0,r:0.85,n:10,s:0.95},ART.sesame(80))},

{id:"teriyaki-salmon-bowls",title:"Teriyaki Salmon Rice Bowls",meal:"Dinner",time:25,serves:4,kcal:620,protein:38,m:{has:["fish","gluten","sesame"],cuisine:"Asian",protein:"fish",skill:1},
 blurb:"Broiled salmon brushed with homemade teriyaki glaze over rice with edamame, cucumber and avocado, finished with sesame and green onion.",
 ing:[["salmon",1,"1¼ lb salmon, in 4 pieces"],["soy",0.15,"¼ cup soy sauce"],["honey",0.1,"2 tbsp honey"],["garlic",0.05,"1 garlic clove, grated"],["ginger",0.25,"1-inch ginger, grated"],["jasmine_rice",0.25,"1½ cups rice"],["edamame",1,"12 oz shelled edamame"],["cucumber",1,"1 cucumber, sliced"],["avocado",0.5,"2 avocados"],["green_onion",0.5,"green onions"],["sesame",0.1,"sesame seeds"]],
 pantry:"1 tbsp rice vinegar, 1 tsp cornstarch, sriracha mayo (optional)",
 steps:["Start the rice. Simmer the soy, honey, garlic, ginger, vinegar and ¼ cup water with the cornstarch until thick, 2 minutes. That's your teriyaki.","Heat the broiler. Brush the salmon with teriyaki and broil 7 to 9 minutes, brushing twice more, until glazed and just cooked.","Cook the edamame and toss the cucumber with a splash of vinegar and salt.","Build bowls: rice, salmon, edamame, cucumber and sliced avocado.","Drizzle with the remaining teriyaki and top with green onions and sesame seeds."],
 tip:"Line the pan with foil. The glaze burns onto the pan otherwise.",
 art:ART.A("bowl","#26343B","#E9E4DA",ART.rice(0,0,1,1000),{t:"fillet",c:["#C9582A","#E8905A","#5A2A12"],x:-0.1,y:-0.2,r:0.5,n:1,s:1},{t:"bean",c:["#7BB84A","#A8D878"],x:0.4,y:0.35,r:0.22,n:22,s:0.55},{t:"round",c:["#6FAE4F","#E3F2C9"],x:-0.4,y:0.4,r:0.22,n:6,s:0.4,d:"cuke"},{t:"avoslice",c:["#9BC15A","#D9E89A","#3E5A1C"],x:0.45,y:-0.25,r:0.15,n:5,s:0.6},ART.scallion(14),ART.sesame(90))},

{id:"pad-thai",title:"Chicken Pad Thai",meal:"Dinner",time:30,serves:4,kcal:640,protein:34,m:{has:["gluten","egg","nuts"],cuisine:"Asian",protein:"chicken",skill:2},
 blurb:"Chewy rice noodles stir-fried with chicken, egg and green onion in a sweet-sour-salty sauce, topped with crushed peanuts, lime and crunchy slaw.",
 ing:[["rice_noodles",0.6,"8 oz flat rice noodles"],["chicken_breast",0.5,"12 oz chicken breast, thinly sliced"],["eggs",0.17,"2 eggs"],["soy",0.15,"3 tbsp soy sauce (or fish sauce)"],["honey",0.1,"3 tbsp brown sugar or honey"],["lime",0.5,"3 limes"],["garlic",0.1,"3 garlic cloves"],["green_onion",1,"6 green onions, in 2-inch pieces"],["coleslaw",0.4,"2 cups coleslaw mix or bean sprouts"],["peanuts",0.2,"½ cup roasted peanuts, crushed"],["cilantro",0.4,"cilantro"]],
 pantry:"3 tbsp oil, 2 tbsp ketchup or tamarind paste, 1 tbsp rice vinegar, chili flakes",
 steps:["Soak the noodles in hot tap water for 25 minutes until pliable but still firm. Drain.","Whisk the soy, sugar, juice of 2 limes, ketchup or tamarind, vinegar and chili flakes.","Stir-fry the chicken in 1 tbsp oil over high heat until cooked. Push aside, scramble the eggs, then add the garlic.","Add the remaining oil, noodles and sauce and toss with tongs until the noodles soak up the sauce and turn tender, 3 minutes. Add a splash of water if they stick.","Toss in the green onions and half the slaw. Serve with peanuts, the rest of the slaw, cilantro and lime wedges."],
 tip:"Under-soak rather than over-soak the noodles. They finish softening in the pan.",
 art:ART.A("plate","#3A2F44","#F4F1EA",{t:"strip",c:["#E8B870","#D79E52","#F2CC8A"],x:0,y:0,r:0.85,n:70,s:0.8,l:9},{t:"slab",c:["#E7B76A","#B97A35","#7A4A1E"],x:0,y:0,r:0.3,n:4,s:0.6},{t:"crumble",c:["#F6D86A","#FFF2B0"],x:0,y:0,r:0.7,n:14,s:0.7},{t:"crumble",c:["#C99A5A","#E2B878"],x:0,y:0,r:0.7,n:30,s:0.45},{t:"leaf",c:["#8A4A9C","#F2EFE6"],x:0.5,y:0.4,r:0.2,n:16,s:0.3},ART.herbs(14),ART.lime())},

{id:"potsticker-stirfry",title:"Crispy Potsticker Stir-Fry with Chili Crisp",meal:"Dinner",time:15,serves:3,kcal:520,protein:21,m:{has:["pork","gluten","sesame","spicy"],cuisine:"Asian",protein:"pork",skill:1},
 blurb:"Frozen dumplings pan-fried until their bottoms shatter, then tossed with stir-fry vegetables in a garlicky soy glaze and spooned with chili crisp. A 15-minute dinner.",
 ing:[["dumplings",1.5,"24 oz frozen potstickers"],["frozen_stirfry",1,"16 oz frozen stir-fry vegetables"],["soy",0.1,"2 tbsp soy sauce"],["honey",0.05,"1 tbsp honey"],["garlic",0.1,"2 garlic cloves"],["chili_crisp",0.15,"chili crisp, to taste"],["green_onion",0.5,"green onions"]],
 pantry:"2 tbsp oil, 1 tbsp rice vinegar",
 steps:["Heat 1 tbsp oil in a large nonstick skillet over medium-high. Add the potstickers flat-side down and cook 2 minutes until golden.","Add ⅓ cup water, cover and steam 5 minutes, then uncover and let the water cook off so the bottoms re-crisp. Move to a plate.","Add the remaining oil and the vegetables to the pan and cook 4 minutes, until hot and lightly charred. Add the garlic.","Add the soy, honey and vinegar and toss until glossy, then return the potstickers.","Serve with chili crisp and green onions."],
 tip:"Leave the potstickers alone while they crisp. Moving them tears the bottoms.",
 art:ART.A("skillet","#33302B","#262626",{t:"pillow",c:["#F2E2C0","#D9B878","#C98A3A"],x:0,y:0,r:0.85,n:12,s:1.9},{t:"strip",c:["#3E8A35","#F07D1E","#D7262B","#F3C21F"],x:0,y:0,r:0.9,n:20,s:0.8,l:2.4},{t:"dot",c:["#B3261E","#7A1A12","#E04A2A"],x:0,y:0,r:0.8,n:80,s:1},ART.scallion(16))},

{id:"miso-ramen",title:"Spicy Miso Ramen with Jammy Eggs",meal:"Dinner",time:30,serves:4,kcal:610,protein:30,m:{has:["pork","gluten","egg","sesame","spicy"],cuisine:"Asian",protein:"pork",skill:2},
 blurb:"A rich, savory miso-and-sesame broth with spicy ground pork, springy noodles, sweet corn, spinach and 6½-minute jammy eggs.",
 ing:[["ramen",1,"10 oz ramen noodles"],["ground_pork",0.5,"8 oz ground pork"],["chicken_broth",2,"8 cups chicken broth"],["miso",0.3,"⅓ cup white miso"],["garlic",0.15,"4 garlic cloves, grated"],["ginger",0.25,"1-inch ginger, grated"],["eggs",0.34,"4 eggs"],["frozen_corn",0.5,"1 cup corn"],["spinach",0.4,"3 handfuls spinach"],["green_onion",0.5,"green onions"],["chili_crisp",0.1,"chili crisp"],["sesame",0.05,"sesame seeds"]],
 pantry:"1 tbsp sesame oil, 2 tbsp soy sauce, 1 tbsp tahini or peanut butter (optional)",
 steps:["Boil the eggs for 6½ minutes, then ice them. Peel and marinate in a splash of soy sauce while you cook.","Brown the pork in the sesame oil until crisp. Add the garlic, ginger and 1 tbsp chili crisp for 1 minute.","Add the broth and bring to a simmer. Whisk the miso (and tahini) with a ladle of broth until smooth and stir it back in. Don't boil it after adding the miso.","Cook the noodles separately and divide among bowls. Add the spinach and corn to the hot broth for 1 minute.","Ladle the broth over the noodles. Top with halved eggs, green onions, sesame and more chili crisp."],
 tip:"Cook the noodles in a separate pot so their starch doesn't cloud the broth.",
 art:ART.A("bowl","#1F2A30","#1F1F1F",ART.sauce("#D9A25A","#B87B35","#E8BC78"),{t:"strip",c:["#F2D88A","#E6C46A"],x:0,y:0,r:0.9,n:40,s:0.6,l:8},{t:"crumble",c:["#8C4A2A","#5A2C16","#B06A40"],x:-0.35,y:0.3,r:0.28,n:20,s:0.7},{t:"dot",c:["#F6C734","#E8A81E"],x:0.4,y:0.35,r:0.22,n:50,s:1.8},{t:"leaf",c:["#2F6B2A","#3E8A35"],x:-0.4,y:-0.35,r:0.25,n:8,s:0.6},{t:"eggHalf",c:["#FFFFFF","#F29A12"],x:0.3,y:-0.3,r:0.15,n:2,s:1},ART.scallion(18),{t:"dot",c:["#B3261E"],x:0,y:0,r:0.85,n:40,s:0.6})},

{id:"katsu-curry",title:"Chicken Katsu Curry",meal:"Dinner",time:45,serves:4,kcal:820,protein:42,m:{has:["gluten","egg","dairy"],cuisine:"Asian",protein:"chicken",skill:2},
 blurb:"Japanese comfort food: shatteringly crisp panko chicken cutlets over rice with a thick, mildly sweet curry gravy studded with potatoes and carrots.",
 ing:[["chicken_breast",1,"1½ lb chicken breasts, butterflied"],["eggs",0.17,"2 eggs"],["panko",1,"2 cups panko"],["curry_roux",0.5,"½ box (4 cubes) Japanese curry roux"],["onion",0.17,"1 onion, sliced"],["carrots",0.25,"2 carrots, chunked"],["baby_potatoes",0.5,"12 oz potatoes, chunked"],["jasmine_rice",0.34,"2 cups short-grain or jasmine rice"]],
 pantry:"½ cup flour, oil for frying, salt",
 steps:["Start the rice. Cook the onion in 1 tbsp oil until golden, 6 minutes. Add the carrots, potatoes and 3 cups water and simmer 15 minutes until tender.","Turn off the heat, add the roux cubes and stir until dissolved, then simmer 5 minutes until thick.","Season the chicken and dredge in flour, beaten egg and panko.","Fry in ½ inch of 350°F oil until deep golden, 3 to 4 minutes per side. Rest on a rack 3 minutes, then slice.","Serve rice and sliced katsu side by side with the curry spooned alongside."],
 tip:"Pickled ginger or a fried egg on top makes it feel like the real Tokyo curry-shop thing.",
 art:ART.A("plate","#2B3340","#F4F1EA",ART.rice(-0.4,-0.1,0.42,420),{t:"base",c:["#8E5A22","#6A3E14","#A8743A"],x:0.3,y:0.15,r:0.5},{t:"cube",c:["#F07D1E","#C9561A","#F6A35B"],x:0.35,y:0.25,r:0.32,n:6,s:0.6},{t:"cube",c:["#E9C98A","#C9A26A","#F2DDA8"],x:0.35,y:0.25,r:0.32,n:5,s:0.7},{t:"slab",c:["#E0A44E","#A8661E","#8E5A22"],x:0,y:-0.15,r:0.4,n:5,s:1.05})},

{id:"kung-pao-chicken",title:"Kung Pao Chicken",meal:"Dinner",time:25,serves:4,kcal:560,protein:38,m:{has:["gluten","nuts","spicy"],cuisine:"Asian",protein:"chicken",skill:2},
 blurb:"Juicy chicken, crunchy peanuts and peppers in a tingly, sweet-sour-spicy sauce. Faster than ordering and far less greasy.",
 ing:[["chicken_thigh",1,"1½ lb boneless thighs, cubed"],["bell_peppers",0.67,"2 bell peppers, chunked"],["peanuts",0.25,"⅔ cup roasted peanuts"],["soy",0.15,"¼ cup soy sauce"],["honey",0.1,"2 tbsp honey"],["garlic",0.15,"4 garlic cloves"],["ginger",0.25,"1-inch ginger"],["green_onion",1,"6 green onions, in 1-inch pieces"],["jasmine_rice",0.25,"1½ cups rice"]],
 pantry:"2 tbsp cornstarch, 2 tbsp rice vinegar, 8 dried chilies or 1 tsp chili flakes, 2 tbsp oil, 1 tsp Sichuan peppercorns (optional)",
 steps:["Toss the chicken with 1 tbsp soy and 1 tbsp cornstarch. Start the rice.","Whisk the remaining soy, honey, vinegar, 1 tbsp cornstarch and 3 tbsp water.","Stir-fry the chicken in the oil over high heat until browned, 5 minutes. Add the chilies, peppercorns, garlic and ginger for 30 seconds.","Add the peppers and green onions and cook 2 minutes.","Add the sauce and peanuts and toss until glossy. Serve over rice."],
 tip:"Sichuan peppercorns give the famous numbing tingle. Find them in the spice aisle.",
 art:ART.A("bowl","#3A2F2A","#1F3E3A",ART.rice(-0.4,-0.32,0.38),ART.chunks(["#B8562A","#7E2F0E","#D8784A"],0.15,0.15,0.6,12,0.75),{t:"strip",c:["#D7262B","#2F8A3A","#F3C21F"],x:0.15,y:0.15,r:0.6,n:12,s:0.9,l:1.6},{t:"bean",c:["#C99A5A","#E2B878"],x:0.15,y:0.15,r:0.6,n:20,s:0.55},ART.scallion(16))},

{id:"tofu-peanut-stirfry",title:"Crispy Tofu & Veggie Peanut Stir-Fry",meal:"Dinner",time:30,serves:4,kcal:520,protein:24,m:{has:["gluten","nuts","sesame"],cuisine:"Asian",protein:"veg",skill:1},
 blurb:"Cornstarch-crisped tofu and colorful vegetables in a creamy peanut-lime sauce over rice. Even tofu skeptics come back for seconds.",
 ing:[["tofu",2,"28 oz extra-firm tofu, pressed and cubed"],["frozen_stirfry",1,"16 oz stir-fry vegetables"],["peanut_butter",0.15,"⅓ cup peanut butter"],["soy",0.15,"¼ cup soy sauce"],["honey",0.05,"1 tbsp honey"],["lime",0.25,"2 limes"],["garlic",0.1,"3 garlic cloves"],["jasmine_rice",0.25,"1½ cups rice"],["peanuts",0.1,"crushed peanuts"],["green_onion",0.5,"green onions"]],
 pantry:"3 tbsp cornstarch, 3 tbsp oil, chili flakes, sesame oil",
 steps:["Start the rice. Toss the tofu with the cornstarch and a pinch of salt.","Fry in 2 tbsp oil over medium-high, turning, until crisp on all sides, 10 minutes. Move to a plate.","Whisk the peanut butter, soy, honey, juice of 1 lime, garlic, sesame oil and ⅓ cup hot water.","Stir-fry the vegetables in the remaining oil until hot, 4 minutes. Add the sauce and tofu and toss to coat.","Serve over rice with peanuts, green onions and lime wedges."],
 tip:"Press the tofu between towels under a heavy pan for 15 minutes. Drier tofu gets crispier.",
 art:ART.A("bowl","#2D3C4A","#E9E4DA",ART.rice(-0.4,-0.3,0.4),{t:"cube",c:["#F2D27A","#C9963A","#F8E6A8"],x:0.2,y:0.15,r:0.55,n:12,s:0.8},{t:"strip",c:["#3E8A35","#F07D1E","#D7262B"],x:0.2,y:0.2,r:0.6,n:14,s:0.8,l:2.2},{t:"drizzle",c:["#B87A3A"],n:1,w:4},ART.scallion(14),ART.lime())},

{id:"smash-burgers",title:"Double Smash Burgers",meal:"Dinner",time:20,serves:4,kcal:820,protein:44,m:{has:["beef","dairy","gluten","egg"],cuisine:"American",protein:"beef",skill:1},
 blurb:"Two thin, lacy-edged patties smashed hard on a screaming-hot pan, melted cheddar, special sauce and pickles on a toasted brioche bun.",
 ing:[["ground_beef",1.33,"1⅓ lb 80/20 ground beef, in 8 loose balls"],["cheddar_slices",1,"8 slices cheddar or American"],["burger_buns",0.5,"4 brioche buns"],["onion",0.1,"½ onion, paper-thin"],["pickles",0.25,"dill pickle chips"],["romaine",0.34,"shredded lettuce"]],
 pantry:"Special sauce: ⅓ cup mayo, 2 tbsp ketchup, 1 tbsp pickle brine, 1 tsp mustard. Plus butter, salt, pepper",
 steps:["Stir together the special sauce. Butter and toast the buns in a cast-iron skillet. Set aside.","Heat the skillet over high heat until smoking. Add 2 beef balls and smash each paper-thin with a sturdy spatula. Season with salt and pepper.","Cook undisturbed until deeply browned with crispy edges, 2 minutes. Scrape under the patties and flip.","Add a slice of cheese to each and stack the two patties. Cook 30 seconds more.","Build: bun, sauce, lettuce, onion, double patty, pickles, sauce, top bun. Repeat."],
 tip:"Keep the beef cold and don't press it into patties first. Loose balls give the craggy, crispy edges.",
 art:ART.A("board","#2A3340","#B88456",{t:"round",c:["#C98A3E","#E6B46A"],x:-0.35,y:0,r:0.05,n:1,s:1.9,d:"plain"},{t:"round",c:["#5A2E18","#7A3E22"],x:0.32,y:0,r:0.05,n:1,s:1.85,d:"plain"},{t:"blob",c:["#F6C734","#E8A81E","#C9862A"],x:0.32,y:0,r:0.2,n:5,s:1.3},{t:"round",c:["#6E9A3A","#B8D47A"],x:0.32,y:0,r:0.25,n:4,s:0.5,d:"cuke"},{t:"round",c:["#6E9A3A","#B8D47A"],x:0.75,y:0.6,r:0.12,n:3,s:0.45,d:"cuke"},{t:"dot",c:["#F3E7C4"],x:-0.35,y:0,r:0.3,n:40,s:0.7})},

{id:"pulled-pork",title:"BBQ Pulled Pork Sandwiches with Tangy Slaw",meal:"Dinner",time:240,serves:8,kcal:640,protein:38,m:{has:["pork","gluten","egg"],cuisine:"American",protein:"pork",skill:1},
 blurb:"Spice-rubbed pork shoulder cooked low and slow until it pulls apart, sauced with BBQ and piled on soft buns under crunchy vinegar slaw.",
 ing:[["pork_shoulder",1,"3 lb boneless pork shoulder"],["bbq_sauce",1.5,"1½ bottles BBQ sauce"],["onion",0.17,"1 onion, sliced"],["burger_buns",1,"8 brioche buns"],["coleslaw",1,"14 oz coleslaw mix"],["pickles",0.25,"pickles"]],
 pantry:"Rub: 2 tbsp brown sugar, 1 tbsp smoked paprika, 2 tsp each salt, garlic powder, cumin. Slaw: ¼ cup mayo, 2 tbsp cider vinegar, 1 tsp sugar",
 steps:["Rub the pork all over with the spice mix. Lay the onion in a slow cooker or Dutch oven, add the pork and ½ cup water.","Cook on low 8 hours, or covered at 300°F for 4 hours, until it shreds easily.","Shred the pork, discard excess fat and toss with 1 cup BBQ sauce and a ladle of the cooking juices.","Toss the slaw mix with the mayo, vinegar, sugar and a pinch of salt.","Pile pork on toasted buns with more sauce, slaw and pickles."],
 tip:"Spread sauced pork on a sheet pan and broil 3 minutes for crispy, bark-like edges.",
 art:ART.A("board","#2F2A26","#B88A58",{t:"round",c:["#D9A85A","#B07A30"],x:-0.3,y:0,r:0.05,n:1,s:1.9,d:"plain"},{t:"shred",c:["#8E3A1E","#B8562A","#6A2A12"],x:-0.3,y:0,r:0.3,n:28,s:0.8},{t:"leaf",c:["#E8EFD8","#B8D47A","#8A4A9C"],x:0.38,y:0,r:0.32,n:40,s:0.32},{t:"round",c:["#6E9A3A","#B8D47A"],x:0.7,y:0.65,r:0.12,n:3,s:0.45,d:"cuke"})},

{id:"meatloaf",title:"Glazed Meatloaf with Mashed Potatoes",meal:"Dinner",time:75,serves:6,kcal:690,protein:36,m:{has:["beef","dairy","gluten","egg"],cuisine:"American",protein:"beef",skill:1},
 blurb:"Tender, juicy meatloaf with a sticky brown-sugar ketchup glaze, buttery mashed potatoes and garlicky green beans. Diner comfort at home.",
 ing:[["ground_beef",2,"2 lb ground beef"],["panko",0.5,"¾ cup panko"],["milk",0.1,"½ cup milk"],["eggs",0.17,"2 eggs"],["onion",0.17,"1 onion, grated"],["russet",0.5,"2½ lb russet potatoes"],["butter",0.15,"5 tbsp butter"],["green_beans",1,"12 oz green beans"],["garlic",0.1,"garlic"]],
 pantry:"Glaze: ½ cup ketchup, 2 tbsp brown sugar, 1 tbsp vinegar. Plus 1 tbsp Worcestershire, salt, pepper",
 steps:["Heat the oven to 375°F. Soak the panko in the milk 5 minutes, then gently mix with the beef, eggs, onion, Worcestershire, 2 tsp salt and pepper. Don't overmix.","Shape into a loaf on a lined sheet pan. Brush with half the glaze and bake 45 minutes. Brush with the rest and bake 10 to 15 minutes more, to 160°F inside.","Boil the peeled, chunked potatoes until tender. Mash with 4 tbsp butter, warm milk and salt.","Sauté the green beans in the remaining butter with garlic until blistered.","Rest the meatloaf 10 minutes, then slice thick and serve with the potatoes and beans."],
 tip:"Baking it free-form on a sheet pan instead of in a loaf tin gives more glazed, caramelized crust.",
 art:ART.A("plate","#2F3A2C","#F2EEE6",{t:"slab",c:["#8E3A1E","#5A2412","#B8462A"],x:0.15,y:-0.15,r:0.35,n:2,s:1.6},{t:"dollop",c:["#FBF4DE","#E9DCB8"],x:-0.35,y:0.2,r:0.2,n:1,s:1.8},{t:"spear",c:["#3E7B2E","#5C9C45","#2C5E22"],x:0.3,y:0.45,r:0.2,n:10,s:0.6,ang:0.3})},

{id:"mac-and-cheese",title:"Crispy-Top Baked Mac & Cheese",meal:"Dinner",time:45,serves:6,kcal:690,protein:27,m:{has:["dairy","gluten"],cuisine:"American",protein:"veg",skill:1},
 blurb:"Elbows in a sharp, extra-creamy cheddar sauce baked under buttery panko until golden and crunchy. Serve with roasted broccoli for a full meal.",
 ing:[["elbows",1,"1 lb elbow macaroni"],["butter",0.15,"5 tbsp butter, divided"],["milk",0.5,"3 cups milk"],["cheddar",2,"4 cups shredded sharp cheddar"],["cream_cheese",0.5,"4 oz cream cheese"],["panko",0.5,"¾ cup panko"],["broccoli",1,"1 lb broccoli, for roasting"]],
 pantry:"¼ cup flour, 1 tsp dry mustard, ½ tsp paprika, salt, pepper",
 steps:["Heat the oven to 375°F. Boil the macaroni 2 minutes short of al dente and drain.","Melt 4 tbsp butter, whisk in the flour and mustard for 1 minute, then slowly whisk in the milk. Simmer, whisking, until it coats a spoon, 5 minutes.","Off the heat, stir in the cream cheese and 3½ cups cheddar until smooth. Season well with salt and pepper and fold in the pasta.","Spread in a baking dish, top with the remaining cheddar and the panko tossed with 1 tbsp melted butter and the paprika.","Bake 20 minutes until golden. Roast the broccoli alongside, tossed with oil and salt."],
 tip:"Shred your own cheddar from a block if you can. Bagged cheese has anti-caking powder that makes the sauce grainy.",
 art:ART.A("dish","#2D3C4A","#E9E1CF",{t:"base",c:["#F2B83A","#D9961E"],x:0,y:0,r:1.05},{t:"pillow",c:["#F6C84A","#E0A42A","#F8D86A"],x:0,y:0,r:0.95,n:40,s:0.8},{t:"dot",c:["#C98A3A","#A8661E","#E2B060"],x:0,y:0,r:0.95,n:200,s:2})},

{id:"chicken-pot-pie",title:"Puff Pastry Chicken Pot Pie",meal:"Dinner",time:55,serves:6,kcal:620,protein:30,m:{has:["dairy","gluten","egg"],cuisine:"American",protein:"chicken",skill:2},
 blurb:"Creamy, thyme-scented chicken and vegetable filling under a flaky, golden puff pastry lid. Uses rotisserie chicken to keep it weeknight-friendly.",
 ing:[["rotisserie",0.5,"3 cups shredded rotisserie chicken"],["butter",0.1,"4 tbsp butter"],["onion",0.17,"1 onion, diced"],["celery",0.3,"2 celery stalks, diced"],["carrots",0.25,"2 carrots, diced"],["chicken_broth",0.5,"2 cups chicken broth"],["heavy_cream",0.25,"½ cup heavy cream or milk"],["frozen_veg",0.5,"1 cup frozen peas or mixed vegetables"],["puff_pastry",0.5,"1 sheet puff pastry, thawed"],["eggs",0.09,"1 egg, beaten"]],
 pantry:"⅓ cup flour, 1 tsp dried thyme, salt, pepper",
 steps:["Heat the oven to 400°F. Melt the butter in an oven-safe skillet and cook the onion, celery and carrots until soft, 8 minutes.","Stir in the flour and thyme for 1 minute, then the broth and cream. Simmer until thick, 3 minutes.","Stir in the chicken and frozen vegetables and season well.","Drape the puff pastry over the skillet, trim the overhang, brush with egg and cut 3 slits in the top.","Bake 25 minutes until puffed and deep golden. Rest 10 minutes before scooping."],
 tip:"Make sure the filling is well seasoned before you cover it. You can't taste it once the lid is on.",
 art:ART.A("skillet","#2F3A2C","#262626",{t:"base",c:["#E8B86A","#C98E3A","#F6D8A0"],x:0,y:0,r:1},{t:"dot",c:["#C98A3A","#A8661E","#F6E0A8"],x:0,y:0,r:0.95,n:160,s:2.4},{t:"strip",c:["#A8661E"],x:0,y:0,r:0.15,n:3,s:1,l:3})},

{id:"crispy-chicken-sandwich",title:"Hot Honey Crispy Chicken Sandwiches",meal:"Dinner",time:40,serves:4,kcal:780,protein:40,m:{has:["dairy","gluten","egg","spicy"],cuisine:"American",protein:"chicken",skill:2},
 blurb:"Buttermilk-brined chicken thighs fried until craggy and crunchy, drizzled with chili-spiked hot honey and stacked with slaw and pickles on brioche.",
 ing:[["chicken_thigh",1,"1½ lb boneless thighs (4 large)"],["milk",0.1,"1 cup milk plus 1 tbsp lemon juice"],["burger_buns",0.5,"4 brioche buns"],["honey",0.15,"⅓ cup honey"],["coleslaw",0.5,"2 cups coleslaw mix"],["pickles",0.25,"pickle chips"]],
 pantry:"1½ cups flour, 2 tbsp cornstarch, 2 tsp paprika, 1 tsp each garlic powder, cayenne, salt; oil for frying; 2 tsp chili flakes; mayo",
 steps:["Soak the chicken in the milk, lemon juice and 1 tsp salt for at least 30 minutes.","Mix the flour, cornstarch, paprika, garlic powder, cayenne and 1 tsp salt. Drizzle in 3 tbsp of the soaking milk and rub it in to make shaggy clumps. That's the craggy crust.","Dredge each thigh firmly. Fry in 1 inch of 350°F oil until deep golden and 175°F inside, 5 to 6 minutes per side. Drain on a rack.","Warm the honey with the chili flakes. Toss the slaw with a spoon of mayo and salt.","Toast the buns, spread with mayo, add the chicken, drizzle generously with hot honey, then slaw and pickles."],
 tip:"Thighs stay juicy even if you overshoot the cooking time. Breasts don't.",
 art:ART.A("board","#2A3340","#B88456",{t:"round",c:["#D9A85A","#B07A30"],x:-0.35,y:0,r:0.05,n:1,s:1.9,d:"plain"},ART.chunks(CRISP,0.32,0,0.08,1,1.9),{t:"drizzle",c:["#E89B1C"],n:1,w:3},{t:"leaf",c:["#E8EFD8","#B8D47A"],x:-0.35,y:0,r:0.3,n:30,s:0.3},{t:"round",c:["#6E9A3A","#B8D47A"],x:0.72,y:0.65,r:0.12,n:3,s:0.45,d:"cuke"})},

{id:"jambalaya",title:"Cajun Shrimp & Andouille Jambalaya",meal:"Dinner",time:50,serves:6,kcal:560,protein:32,m:{has:["shellfish","pork","spicy"],cuisine:"American",protein:"shrimp",skill:2},
 blurb:"New Orleans in one pot: smoky andouille, the Cajun trinity, tomatoes and rice simmered in spiced broth with shrimp folded in at the end.",
 ing:[["smoked_sausage",1,"12 oz andouille sausage, sliced"],["shrimp",1,"1 lb shrimp, peeled"],["onion",0.17,"1 onion, diced"],["bell_peppers",0.34,"1 green bell pepper, diced"],["celery",0.3,"2 celery stalks, diced"],["garlic",0.15,"4 garlic cloves"],["diced_tomatoes",1,"1 can diced tomatoes"],["jasmine_rice",0.25,"1½ cups long-grain rice"],["chicken_broth",0.75,"3 cups chicken broth"],["cajun",0.2,"1½ tbsp Cajun seasoning"],["green_onion",0.5,"green onions"]],
 pantry:"1 tbsp oil, 2 bay leaves, hot sauce",
 steps:["Brown the sausage in the oil in a Dutch oven, 5 minutes. Add the onion, pepper and celery and cook until soft, 6 minutes.","Add the garlic, Cajun seasoning and rice and stir 1 minute.","Add the tomatoes, broth and bay leaves. Bring to a boil, cover and simmer on low 20 minutes without lifting the lid.","Toss the shrimp with a pinch of Cajun seasoning, scatter over the rice, cover and cook 5 to 7 minutes until pink.","Fluff gently and serve with green onions and hot sauce."],
 tip:"Keep the lid on while the rice simmers. Lifting it lets out the steam the rice needs.",
 art:ART.A("pot","#3A3631","#1F3E3A",ART.sauce("#C8571F","#9E3E14","#E07A3A"),{t:"grain",c:["#E8A060","#D9884A","#F2B878"],x:0,y:0,r:0.95,n:700,s:1.05},{t:"round",c:["#8A3A1E","#C0603A"],x:0,y:0,r:0.85,n:12,s:0.5,d:"sausage"},{t:"shrimp",c:["#F28A5B","#FFC8A4","#D9653A"],x:0,y:0,r:0.7,n:8,s:0.9},{t:"strip",c:["#2F8A3A"],x:0,y:0,r:0.85,n:10,s:0.6,l:1.4},ART.scallion(18))},

{id:"shrimp-grits",title:"Cheesy Shrimp & Grits",meal:"Dinner",time:35,serves:4,kcal:640,protein:36,m:{has:["shellfish","dairy","pork"],cuisine:"American",protein:"shrimp",skill:2},
 blurb:"Creamy cheddar grits under garlicky Cajun shrimp in a buttery bacon pan sauce with a squeeze of lemon. Lowcountry comfort.",
 ing:[["grits",0.5,"1 cup quick grits"],["milk",0.25,"2 cups milk (plus 2 cups water)"],["cheddar",1,"2 cups shredded sharp cheddar"],["butter",0.1,"4 tbsp butter"],["bacon",0.5,"6 slices bacon, chopped"],["shrimp",1,"1 lb shrimp, peeled"],["cajun",0.1,"2 tsp Cajun seasoning"],["garlic",0.1,"3 garlic cloves"],["lemon",0.17,"1 lemon"],["green_onion",0.5,"green onions"]],
 pantry:"Salt, pepper, hot sauce",
 steps:["Bring the milk, 2 cups water and 1 tsp salt to a simmer. Whisk in the grits and cook, stirring, until thick, 5 to 7 minutes. Stir in the cheddar and 2 tbsp butter. Keep warm.","Cook the bacon until crisp. Remove, leaving the fat in the pan.","Toss the shrimp with the Cajun seasoning and sear in the bacon fat 1 to 2 minutes per side.","Add the garlic, remaining butter, juice of half the lemon and 2 tbsp water. Toss until saucy.","Spoon the shrimp and sauce over the grits. Top with bacon and green onions."],
 tip:"If the grits stiffen while they wait, whisk in a splash of hot milk.",
 art:ART.A("bowl","#2B3A33","#F4F1EA",ART.sauce("#F2D27A","#E2B85A","#F8E6A8"),{t:"shrimp",c:["#E86A3A","#FFB890","#B8461E"],x:0,y:0,r:0.55,n:9,s:1},{t:"crumble",c:["#8E3A1E","#B8562A"],x:0,y:0,r:0.7,n:18,s:0.5},ART.scallion(16))},

{id:"potato-soup",title:"Loaded Baked Potato Soup",meal:"Dinner",time:45,serves:6,kcal:520,protein:19,m:{has:["dairy","pork"],cuisine:"American",protein:"pork",skill:1},
 blurb:"Thick, velvety potato soup loaded like the best baked potato: crispy bacon, sharp cheddar, sour cream and green onions.",
 ing:[["russet",0.6,"3 lb russet potatoes, peeled and diced"],["bacon",1,"12 oz bacon, chopped"],["onion",0.17,"1 onion, diced"],["garlic",0.1,"3 garlic cloves"],["chicken_broth",1,"4 cups chicken broth"],["milk",0.25,"2 cups milk"],["cheddar",1,"2 cups shredded sharp cheddar"],["sour_cream",0.5,"1 cup sour cream"],["green_onion",0.5,"green onions"]],
 pantry:"3 tbsp flour, salt, pepper",
 steps:["Cook the bacon in a large pot until crisp. Remove, leaving 3 tbsp fat.","Cook the onion in the fat until soft, then the garlic and flour for 1 minute.","Add the potatoes and broth and simmer until very tender, 15 minutes.","Mash about half the potatoes right in the pot for a thick, chunky texture. Stir in the milk, half the cheddar and half the sour cream and season.","Ladle into bowls and pile on bacon, cheese, sour cream and green onions."],
 tip:"Russets break down into a naturally creamy soup. Waxy potatoes stay too firm.",
 art:ART.A("bowl","#2D3C4A","#E9E4DA",ART.sauce("#F2E4C0","#E2CC98","#FBF2D8"),{t:"cube",c:["#F2E2B0","#D9C08A"],x:0,y:0,r:0.85,n:14,s:0.6},ART.cheese(0,0,0.5,10,0.4),{t:"crumble",c:["#8E3A1E","#B8562A"],x:0,y:0,r:0.6,n:18,s:0.5},ART.dollop(0.1,0.05,0.6),ART.scallion(20))},

{id:"chicken-shawarma",title:"Sheet-Pan Chicken Shawarma Plates",meal:"Dinner",time:40,serves:4,kcal:640,protein:44,m:{has:["dairy","gluten","sesame"],cuisine:"Mediterranean",protein:"chicken",skill:1},
 blurb:"Warmly spiced, lemony chicken thighs and onions roasted until charred, with garlicky yogurt sauce, hummus, a crunchy salad and warm pita.",
 ing:[["chicken_thigh",1,"1½ lb boneless chicken thighs"],["lemon",0.34,"2 lemons"],["garlic",0.15,"4 garlic cloves"],["onion",0.17,"1 red or yellow onion, in wedges"],["greek_yogurt",0.25,"1 cup plain Greek yogurt"],["hummus",0.5,"1 cup hummus"],["cucumber",1,"1 cucumber, diced"],["roma_tomatoes",1,"4 Roma tomatoes, diced"],["parsley",1,"1 bunch parsley"],["pita",0.67,"4 pita breads"]],
 pantry:"¼ cup olive oil; 2 tsp each cumin, paprika; 1 tsp each coriander, turmeric, cinnamon (pinch); salt",
 steps:["Toss the chicken with 3 tbsp oil, the juice of 1 lemon, half the garlic, the spices and 1½ tsp salt. Marinate 15 minutes or overnight.","Spread the chicken and onion on a sheet pan and roast at 450°F for 20 to 25 minutes, then broil 2 minutes to char. Rest and slice.","Stir the yogurt with the remaining garlic, a squeeze of lemon and salt.","Toss the cucumber, tomatoes and chopped parsley with olive oil, lemon and salt.","Plate with a swoosh of hummus, the chicken and onions, salad, yogurt sauce and warm pita."],
 tip:"Marinate the chicken in the morning and dinner is 25 minutes of hands-off roasting.",
 art:ART.A("plate","#2E3A4A","#F4F1EA",{t:"dollop",c:["#E8CF9E","#C9A86A"],x:-0.4,y:-0.35,r:0.18,n:1,s:1.1},{t:"strip",c:["#C9772A","#9E5214","#E2973A"],x:0.1,y:-0.05,r:0.4,n:20,s:1.1,l:2.4,sear:1},{t:"cube",c:["#D7261E","#B01E14"],x:-0.35,y:0.4,r:0.22,n:10,s:0.4},{t:"cube",c:["#8CC05A","#D9EFC2"],x:-0.15,y:0.45,r:0.2,n:10,s:0.4},ART.dollop(0.45,-0.4,0.75),{t:"pita",c:["#E3B66E","#C48C3E"],x:0.7,y:0.55,r:0.1,n:3,s:1},ART.herbs(24,["#2F7A2A","#4A9A3A"]))},

{id:"turkey-meatballs-orzo",title:"Greek Turkey Meatballs with Lemon Orzo",meal:"Dinner",time:40,serves:4,kcal:610,protein:40,m:{has:["dairy","gluten","egg"],cuisine:"Mediterranean",protein:"turkey",skill:1},
 blurb:"Juicy spinach-and-feta turkey meatballs roasted until golden, over buttery lemon-herb orzo with a cool cucumber-yogurt sauce.",
 ing:[["ground_turkey",1,"1 lb ground turkey"],["spinach",0.3,"2 handfuls spinach, finely chopped"],["feta",0.5,"½ cup feta crumbles"],["panko",0.25,"⅓ cup panko"],["eggs",0.09,"1 egg"],["garlic",0.1,"3 garlic cloves"],["orzo",0.75,"1½ cups orzo"],["chicken_broth",0.75,"3 cups chicken broth"],["lemon",0.34,"2 lemons"],["tzatziki",1,"12 oz tzatziki"],["parsley",0.5,"parsley or dill"]],
 pantry:"2 tsp dried oregano, 2 tbsp olive oil, 1 tbsp butter, salt, pepper",
 steps:["Heat the oven to 425°F. Mix the turkey, spinach, feta, panko, egg, garlic, oregano and 1 tsp salt. Roll into 16 balls.","Roast on an oiled sheet pan 15 to 18 minutes until golden and cooked through.","Toast the orzo in the butter, then add the broth and simmer, stirring often, until tender and creamy, 10 minutes.","Stir the lemon zest, juice of 1 lemon and herbs into the orzo.","Serve the meatballs over orzo with tzatziki and lemon wedges."],
 tip:"Wet your hands before rolling. Turkey mixture is sticky.",
 art:ART.A("skillet","#2B3A33","#262626",{t:"grain",c:["#F6EBC6","#E8D59E","#FFF6D8"],x:0,y:0,r:1,n:800,s:1.25},{t:"round",c:["#B9773A","#D9A060"],x:0,y:0,r:0.75,n:10,s:0.85,d:"sausage"},{t:"leaf",c:["#2F7A2A","#4A9A3A"],x:0,y:0,r:0.85,n:30,s:0.25},ART.dollop(0.5,-0.45,0.7,["#F7F4EC","#DDE5D2"]),ART.lemon(-0.55,-0.5))},

{id:"roast-chicken",title:"Lemon-Herb Roast Chicken & Crispy Potatoes",meal:"Dinner",time:90,serves:5,kcal:640,protein:48,m:{has:["dairy"],cuisine:"American",protein:"chicken",skill:2,lc:1},
 blurb:"A golden, crackly-skinned whole chicken roasted over potatoes that soak up all the drippings. Leftovers become sandwiches and soup.",
 ing:[["whole_chicken",1,"1 whole chicken (4 to 5 lb)"],["baby_potatoes",1.5,"2 lb baby potatoes, halved"],["lemon",0.34,"2 lemons"],["garlic",0.33,"1 head garlic, halved crosswise"],["butter",0.1,"4 tbsp softened butter"],["parsley",1,"parsley, thyme or rosemary"],["green_beans",1,"12 oz green beans"]],
 pantry:"2 tbsp olive oil, 2 tsp salt, pepper",
 steps:["The day before (or at least 1 hour ahead), pat the chicken very dry and salt it all over. Refrigerate uncovered. This is the secret to crisp skin.","Heat the oven to 425°F. Toss the potatoes with oil and salt in a roasting pan or skillet.","Mash the butter with chopped herbs and lemon zest and rub it under and over the skin. Stuff the cavity with the zested lemon and garlic. Set the chicken on the potatoes.","Roast 70 to 80 minutes, until the thigh reaches 170°F. Add the green beans around the edges for the last 15 minutes.","Rest 15 minutes before carving. Toss the potatoes in the pan juices and squeeze over the roasted lemon."],
 tip:"Save the carcass. Simmered with an onion and water for 2 hours, it makes stock for next week's soup.",
 art:ART.A("skillet","#3C3530","#262626",{t:"smash",c:["#E9BE65","#BF8433","#F6D88E"],x:0,y:0,r:0.9,n:14,s:0.7,halved:1},{t:"fillet",c:["#D99A4A","#A8661E","#F2C27A"],x:0,y:0,r:0.6,n:1,s:1},{t:"dot",c:["#8E5A22"],x:0,y:0,r:0.35,n:40,s:0.7},ART.herbs(18,["#2F7A2A","#4A9A3A"]),ART.lemon(0.55,0.5),ART.lemon(-0.55,-0.45))},

{id:"stuffed-peppers",title:"Cheesy Beef & Rice Stuffed Peppers",meal:"Dinner",time:55,serves:4,kcal:560,protein:33,m:{has:["beef","dairy"],cuisine:"American",protein:"beef",skill:1,lc:1},
 blurb:"Sweet bell peppers stuffed with seasoned beef, rice and tomatoes, baked until tender and topped with a molten layer of cheese.",
 ing:[["bell_peppers",1.34,"4 large bell peppers"],["ground_beef",1,"1 lb ground beef"],["onion",0.17,"1 onion, diced"],["garlic",0.1,"3 garlic cloves"],["jasmine_rice",0.12,"¾ cup rice (or 2 cups cooked)"],["diced_tomatoes",1,"1 can diced tomatoes"],["taco_seasoning",0.5,"1 packet taco or Italian seasoning"],["cheese_mex",1,"2 cups shredded cheese"],["parsley",0.5,"parsley or cilantro"]],
 pantry:"1 tbsp oil, salt",
 steps:["Cook the rice. Heat the oven to 375°F. Halve the peppers through the stem and scoop out the seeds.","Brown the beef with the onion. Add the garlic and seasoning, then the tomatoes, and simmer 5 minutes.","Stir in the rice and 1 cup cheese.","Pack the filling into the pepper halves in a baking dish. Add ¼ cup water to the dish and cover with foil.","Bake 30 minutes, uncover, top with the remaining cheese and bake 10 minutes until melted and the peppers are tender."],
 tip:"Swap the rice for cauliflower rice to make these low-carb.",
 art:ART.A("dish","#2D3C4A","#E9E1CF",{t:"pillow",c:["#D7262B","#A81E1E","#E84B26"],x:0,y:0,r:0.6,n:4,s:3.2},ART.cheese(0,0,0.65,20,0.6),ART.herbs(16,["#2F7A2A","#4A9A3A"]))},

{id:"garlic-butter-steak",title:"Garlic Butter Steak Bites & Potatoes",meal:"Dinner",time:30,serves:4,kcal:620,protein:42,m:{has:["beef","dairy"],cuisine:"American",protein:"beef",skill:1,lc:1},
 blurb:"Seared sirloin bites tossed in sizzling garlic-herb butter with crispy potatoes and charred asparagus. Steakhouse flavor in one pan.",
 ing:[["sirloin",1,"1½ lb sirloin, in 1-inch cubes"],["baby_potatoes",1,"1½ lb baby potatoes, quartered"],["asparagus",1,"1 lb asparagus"],["butter",0.1,"4 tbsp butter"],["garlic",0.2,"6 garlic cloves, minced"],["parsley",0.5,"parsley"]],
 pantry:"2 tbsp oil, red pepper flakes, flaky salt, pepper",
 steps:["Microwave the potatoes, covered, with a splash of water for 5 minutes. Then fry in 1 tbsp oil in a large skillet until golden and crisp, 8 minutes. Remove.","Char the asparagus in the same pan with a pinch of salt, 3 minutes. Remove.","Pat the steak very dry and season well. Sear in the remaining oil over high heat in one layer, 1 to 2 minutes per side.","Lower the heat, add the butter, garlic and pepper flakes and toss for 1 minute as the butter foams.","Return the potatoes and asparagus, toss and finish with parsley and flaky salt."],
 tip:"Don't crowd the pan. Sear the steak in two batches if needed, or it will steam instead of brown.",
 art:ART.A("skillet","#2F3A2C","#262626",{t:"smash",c:["#E9BE65","#BF8433","#F6D88E"],x:-0.2,y:0.25,r:0.6,n:9,s:0.55,halved:1},{t:"cube",c:["#5A2E18","#3E1F10","#8C5333"],x:0.15,y:-0.15,r:0.6,n:16,s:1},{t:"spear",c:["#5C8F35","#87B755","#3D6B22"],x:0,y:0.1,r:0.5,n:5,s:0.9,ang:-0.5},ART.herbs(22,["#2F7A2A","#4A9A3A"]))},

{id:"black-bean-burgers",title:"Smoky Black Bean Burgers",meal:"Dinner",time:35,serves:4,kcal:540,protein:21,m:{has:["dairy","gluten","egg"],cuisine:"American",protein:"veg",skill:1},
 blurb:"Hearty, crisp-edged veggie burgers made from dried-out black beans, cheddar and smoky spices, topped with avocado and chipotle mayo.",
 ing:[["black_beans",2,"2 cans black beans, drained and patted dry"],["panko",0.5,"¾ cup panko"],["eggs",0.09,"1 egg"],["cheddar",0.5,"1 cup shredded cheddar"],["frozen_corn",0.25,"½ cup corn"],["burger_buns",0.5,"4 buns"],["avocado",0.5,"2 avocados"],["chipotle",0.15,"1 tbsp adobo sauce"],["romaine",0.34,"lettuce"]],
 pantry:"2 tsp smoked paprika, 1 tsp cumin, 2 tbsp oil, ⅓ cup mayo, salt",
 steps:["Spread the beans on a sheet pan and bake at 350°F for 15 minutes to dry them out. This stops mushy burgers.","Mash the beans roughly, leaving some whole. Mix in the panko, egg, cheddar, corn, paprika, cumin and salt.","Form 4 patties and chill 10 minutes.","Fry in the oil over medium heat until crusty, 4 to 5 minutes per side.","Stir the adobo into the mayo. Serve the burgers on toasted buns with chipotle mayo, lettuce and avocado."],
 tip:"Patties freeze well between parchment. Cook from frozen, adding 2 minutes per side.",
 art:ART.A("board","#2E3B4D","#B88A58",{t:"round",c:["#D9A85A","#B07A30"],x:-0.35,y:0,r:0.05,n:1,s:1.9,d:"plain"},{t:"round",c:["#3A2A28","#5A4038"],x:0.32,y:0,r:0.05,n:1,s:1.8,d:"plain"},{t:"avoslice",c:["#9BC15A","#D9E89A","#3E5A1C"],x:0.32,y:0,r:0.15,n:4,s:0.6},{t:"leaf",c:["#8CC05A","#B6DB82"],x:-0.35,y:0,r:0.3,n:16,s:0.45})},

{id:"tomato-soup-grilled-cheese",title:"Creamy Tomato Basil Soup & Grilled Cheese",meal:"Dinner",time:35,serves:4,kcal:650,protein:22,m:{has:["dairy","gluten"],cuisine:"American",protein:"veg",skill:1},
 blurb:"Velvety roasted-garlic tomato soup with a splash of cream, and golden, gooey sharp-cheddar grilled cheese for dunking.",
 ing:[["crushed_tomatoes",2,"2 cans (28 oz) crushed tomatoes"],["onion",0.17,"1 onion, diced"],["garlic",0.15,"4 garlic cloves"],["chicken_broth",0.5,"2 cups broth"],["heavy_cream",0.25,"½ cup heavy cream"],["basil",1,"fresh basil"],["sourdough",0.4,"8 slices sourdough"],["cheddar",1,"2 cups shredded sharp cheddar"],["butter",0.1,"4 tbsp butter"]],
 pantry:"2 tbsp olive oil, 1 tsp sugar, salt, pepper",
 steps:["Cook the onion in the oil until soft, 6 minutes. Add the garlic for 1 minute.","Add the tomatoes, broth and sugar and simmer 15 minutes.","Add a handful of basil and blend until smooth. Stir in the cream and season.","Butter the outsides of the bread, fill with cheddar and cook in a skillet over medium-low until deep golden and melted, 3 to 4 minutes per side.","Cut the sandwiches into strips and serve with the soup, topped with basil and a swirl of cream."],
 tip:"Low and slow is the key to grilled cheese. High heat burns the bread before the cheese melts.",
 art:ART.A("bowl","#2D3C4A","#F4F1EA",ART.sauce("#D9441F","#B0321A","#E86A3A"),{t:"swirl",c:["#FCEBD7"],x:0,y:0,r:0.4,n:1},ART.basil(5),{t:"dot",c:["#2B2B2B"],x:0,y:0,r:0.8,n:40,s:0.5})},

{id:"fish-tacos",title:"Crispy Fish Tacos with Chipotle Slaw",meal:"Dinner",time:30,serves:4,kcal:540,protein:30,m:{has:["fish","dairy","gluten","egg"],cuisine:"Mexican",protein:"fish",skill:2},
 blurb:"Golden panko-crusted cod in warm tortillas with a crunchy lime-chipotle slaw, avocado and a squeeze of lime. Baja vibes on a weeknight.",
 ing:[["white_fish",1.25,"1¼ lb cod or tilapia, in strips"],["panko",0.75,"1 cup panko"],["eggs",0.09,"1 egg"],["corn_tortillas",0.7,"12 corn tortillas"],["coleslaw",0.75,"3 cups coleslaw mix"],["sour_cream",0.25,"½ cup sour cream"],["chipotle",0.15,"1 tbsp adobo sauce"],["lime",0.34,"3 limes"],["avocado",0.5,"2 avocados"],["cilantro",0.5,"cilantro"]],
 pantry:"¼ cup flour, 1 tsp chili powder, oil for frying, salt",
 steps:["Stir the sour cream with the adobo and juice of 1 lime. Toss half of it with the slaw and a pinch of salt.","Season the fish with salt and chili powder. Dredge in flour, then egg, then panko.","Fry in ¼ inch oil over medium-high until golden, 2 minutes per side. Drain.","Char the tortillas in a dry pan.","Fill with fish, slaw, avocado and cilantro. Drizzle with the remaining chipotle crema and serve with lime."],
 tip:"For an easier version, bake the breaded fish at 450°F on an oiled rack for 12 minutes.",
 art:ART.A("board","#26343B","#B88A58",{t:"taco",c:["#E9C77C","#C99A4A"],n:3},ART.chunks(CRISP,0,0,0.6,3,1.1),{t:"leaf",c:["#8A4A9C","#B583C4","#F2EFE6"],x:0,y:0,r:0.8,n:40,s:0.3,taco:1},{t:"avoslice",c:["#9BC15A","#D9E89A","#3E5A1C"],x:0,y:0,r:0.8,n:5,s:0.5,taco:1},{t:"drizzle",c:["#F2C8A0"],n:3,w:4,taco:1},ART.lime(0.7,0.7))},

/* ===== BREAKFASTS ===== */
{id:"buttermilk-pancakes",title:"Fluffy Buttermilk Pancakes",meal:"Breakfast",time:25,serves:4,kcal:430,protein:12,m:{has:["dairy","gluten","egg"],cuisine:"American",protein:"veg",skill:1},
 blurb:"Tall, tender diner-style pancakes with golden edges, stacked with butter, warm maple syrup and berries.",
 ing:[["milk",0.2,"1¾ cups milk plus 2 tbsp lemon juice (homemade buttermilk)"],["eggs",0.17,"2 eggs"],["butter",0.1,"4 tbsp melted butter, plus more"],["lemon",0.17,"1 lemon"],["maple_syrup",0.5,"maple syrup"],["frozen_berries",0.5,"berries"]],
 pantry:"2 cups flour, 2 tbsp sugar, 2 tsp baking powder, 1 tsp baking soda, ½ tsp salt, vanilla",
 steps:["Stir the lemon juice into the milk and let it sit 5 minutes to thicken.","Whisk the flour, sugar, baking powder, soda and salt. In another bowl whisk the milk, eggs, melted butter and vanilla.","Fold the wet into the dry until just combined. Lumps are good. Rest 5 minutes.","Cook ⅓-cup scoops on a buttered griddle over medium until bubbles pop on top, 2 minutes. Flip and cook 1 minute more.","Serve stacked with butter, warm maple syrup and berries."],
 tip:"Don't press the pancakes after flipping. It knocks out the air that makes them fluffy.",
 art:ART.A("plate","#2D3C4A","#F4F1EA",{t:"round",c:["#C98A3E","#E6B46A"],x:0,y:0,r:0.05,n:1,s:2.6,d:"plain"},{t:"round",c:["#D99A4A","#EEC07A"],x:0.03,y:-0.03,r:0.03,n:1,s:2.35,d:"plain"},{t:"cube",c:["#FFF2B0","#F6D86A"],x:0.03,y:-0.05,r:0.02,n:1,s:1},{t:"drizzle",c:["#B8641E"],n:1,w:4},{t:"berry",c:["#3B3F8F","#262A6B","#B3253F"],x:0.5,y:0.45,r:0.2,n:10,s:1})},

{id:"french-toast",title:"Brioche French Toast",meal:"Breakfast",time:20,serves:4,kcal:520,protein:16,m:{has:["dairy","gluten","egg"],cuisine:"American",protein:"veg",skill:1},
 blurb:"Thick brioche soaked in a vanilla-cinnamon custard and griddled until crisp outside and custardy inside. Weekend brunch royalty.",
 ing:[["brioche",1,"1 brioche loaf, in 8 thick slices"],["eggs",0.34,"4 eggs"],["milk",0.15,"1 cup milk or half-and-half"],["butter",0.1,"butter, for the pan"],["maple_syrup",0.5,"maple syrup"],["frozen_berries",0.5,"berries"]],
 pantry:"2 tbsp sugar, 1 tsp cinnamon, 1 tsp vanilla, pinch of salt, powdered sugar",
 steps:["Whisk the eggs, milk, sugar, cinnamon, vanilla and salt in a shallow dish.","Leave the bread out for an hour (or toast lightly) so it's a little dry. It soaks up more custard.","Dip each slice for about 10 seconds per side.","Cook in butter over medium heat until deep golden, 3 minutes per side.","Serve with maple syrup, berries and a dusting of powdered sugar."],
 tip:"Keep finished slices in a 200°F oven on a rack while you cook the rest.",
 art:ART.A("plate","#2D3C4A","#F4F1EA",{t:"slab",c:["#D99A4A","#A8661E","#8E5A22"],x:0,y:0,r:0.4,n:3,s:2.2},{t:"berry",c:["#3B3F8F","#262A6B","#B3253F"],x:0.4,y:-0.4,r:0.25,n:12,s:1},{t:"drizzle",c:["#B8641E"],n:1,w:4},{t:"dot",c:["#FFFFFF","#F4F4F4"],x:0,y:0,r:0.6,n:120,s:0.8})},

{id:"huevos-rancheros",title:"Huevos Rancheros",meal:"Breakfast",time:20,serves:4,kcal:470,protein:21,m:{has:["egg","dairy"],cuisine:"Mexican",protein:"egg",skill:1},
 blurb:"Crisp corn tortillas topped with warm refried beans, crispy fried eggs, ranchero salsa, avocado and crumbled cheese.",
 ing:[["corn_tortillas",0.45,"8 corn tortillas"],["refried_beans",1,"1 can refried beans"],["eggs",0.67,"8 eggs"],["salsa",1,"16 oz salsa"],["avocado",0.5,"2 avocados"],["feta",0.5,"cotija or feta"],["cilantro",0.4,"cilantro"],["lime",0.125,"1 lime"]],
 pantry:"3 tbsp oil, salt, hot sauce",
 steps:["Fry the tortillas in 2 tbsp oil until crisp at the edges. Drain.","Warm the beans with a splash of water. Warm the salsa in a small pan.","Fry the eggs in the remaining oil until the edges are crispy and the yolks runny.","Top 2 tortillas per plate with beans, 2 eggs and warm salsa.","Finish with avocado, cheese, cilantro and lime."],
 tip:"Spoon hot oil over the egg whites as they fry to set them without flipping.",
 art:ART.A("plate","#2E3B4D","#F4F1EA",{t:"base",c:["#C8471F","#9E3414"],x:0,y:0,r:0.85},{t:"egg",c:["#FFFFFF","#F6A21B"],x:0,y:0,r:0.35,n:2,s:1.1},{t:"avoslice",c:["#9BC15A","#D9E89A","#3E5A1C"],x:0.4,y:0.4,r:0.15,n:5,s:0.6},{t:"crumble",c:["#FFFFFF","#EDEAE2"],x:0,y:0,r:0.75,n:16,s:0.4},ART.herbs(18))},

{id:"breakfast-sandwiches",title:"Bacon, Egg & Cheese Breakfast Sandwiches",meal:"Breakfast",time:30,serves:6,kcal:420,protein:22,m:{has:["egg","dairy","gluten","pork"],cuisine:"American",protein:"pork",skill:1},
 blurb:"Sheet-pan eggs, crispy bacon and melty cheddar on toasted English muffins. Make 6 at once and freeze them for grab-and-go mornings.",
 ing:[["english_muffins",1,"6 English muffins"],["eggs",0.75,"9 eggs"],["milk",0.05,"¼ cup milk"],["bacon",1,"12 slices bacon"],["cheddar_slices",0.75,"6 slices cheddar"]],
 pantry:"Butter, salt, pepper, hot sauce",
 steps:["Heat the oven to 400°F. Bake the bacon on a sheet pan 15 to 18 minutes until crisp.","Whisk the eggs, milk, salt and pepper, pour into a buttered 9x13 pan and bake 15 minutes until just set. Cut into 6 squares.","Toast and butter the English muffins.","Layer egg, cheese and 2 strips of bacon on each muffin.","Eat now, or wrap in foil and freeze. Reheat unwrapped, in a paper towel, for 1½ minutes."],
 tip:"Bake the eggs and bacon at the same time on separate racks.",
 art:ART.A("board","#2A3340","#B88456",{t:"round",c:["#C98A3E","#EDD0A0"],x:-0.35,y:0,r:0.05,n:1,s:1.7,d:"plain"},{t:"round",c:["#C98A3E","#EDD0A0"],x:0.35,y:0,r:0.05,n:1,s:1.7,d:"plain"},{t:"cube",c:["#F6E070","#E8C030"],x:0.35,y:0,r:0.02,n:1,s:1.8},{t:"strip",c:["#8E3A1E","#B8562A"],x:0.35,y:0,r:0.2,n:3,s:1.1,l:3.5,sear:1})},

{id:"chilaquiles",title:"Chilaquiles Verdes with Fried Eggs",meal:"Breakfast",time:20,serves:4,kcal:540,protein:20,m:{has:["egg","dairy"],cuisine:"Mexican",protein:"egg",skill:1},
 blurb:"Tortilla chips simmered briefly in tangy salsa verde so they're half crisp, half saucy, then crowned with fried eggs, crema, onion and cotija.",
 ing:[["tortilla_chips",0.6,"8 oz sturdy tortilla chips"],["salsa_verde",1.5,"24 oz salsa verde"],["chicken_broth",0.15,"½ cup broth or water"],["eggs",0.34,"4 eggs"],["sour_cream",0.25,"sour cream"],["feta",0.5,"cotija or feta"],["onion",0.1,"¼ onion, thinly sliced"],["cilantro",0.5,"cilantro"],["avocado",0.25,"1 avocado"]],
 pantry:"2 tbsp oil, salt",
 steps:["Simmer the salsa verde and broth in a large skillet for 3 minutes.","Add the chips and toss gently until coated, about 1 minute. They should still have some crunch.","Fry the eggs in a separate pan in the oil.","Top the chips with the eggs, a drizzle of sour cream, cheese, onion, cilantro and avocado.","Serve straight away. Chilaquiles wait for no one."],
 tip:"Use thick restaurant-style chips. Thin ones dissolve in the sauce.",
 art:ART.A("skillet","#2E3B4D","#262626",{t:"chip",c:["#9CB050","#C9C060","#B8A848"],x:0,y:0,r:0.9,n:22,s:1.2},{t:"egg",c:["#FFFFFF","#F6A21B"],x:0,y:0,r:0.35,n:2,s:1},{t:"drizzle",c:["#FBF8F1"],n:1,w:4},{t:"crumble",c:["#FFFFFF","#EDEAE2"],x:0,y:0,r:0.8,n:16,s:0.4},{t:"strip",c:["#E8C8E8","#F2E6F2"],x:0,y:0,r:0.8,n:8,s:0.5,l:3},ART.herbs(20))},

{id:"smoothie-bowls",title:"Berry Banana Smoothie Bowls",meal:"Breakfast",time:10,serves:2,kcal:420,protein:22,m:{has:["dairy","gluten","nuts"],cuisine:"American",protein:"veg",skill:1},
 blurb:"Thick, spoonable frozen berry and banana smoothie bowls blended with Greek yogurt and a handful of spinach, topped with granola, banana and peanut butter.",
 ing:[["frozen_berries",0.75,"2 cups frozen mixed berries"],["banana",0.5,"3 bananas (2 frozen)"],["greek_yogurt",0.25,"1 cup Greek yogurt"],["spinach",0.1,"1 handful spinach"],["milk",0.05,"¼ cup milk"],["granola",0.3,"granola"],["peanut_butter",0.05,"peanut butter"],["chia",0.05,"chia seeds"]],
 pantry:"Honey (optional)",
 steps:["Blend the frozen berries, 2 frozen bananas, yogurt, spinach and just enough milk to get it moving. Keep it thick enough to hold a spoon upright.","Scoop into 2 bowls.","Slice the remaining banana.","Top with rows of granola, banana, a drizzle of peanut butter and chia seeds.","Eat right away."],
 tip:"Peel and freeze ripe bananas in chunks so you always have smoothie bowls ready.",
 art:ART.A("bowl","#3B3F4F","#F4F1EA",ART.sauce("#7A2A5A","#5A1A42","#9A3A72"),{t:"grain",c:["#C9934A","#A8742E","#E2B66E"],x:-0.35,y:0,r:0.35,n:150,s:2.2},{t:"round",c:["#F3E2A0","#FFF6D6"],x:0.2,y:-0.3,r:0.3,n:6,s:0.65,d:"plain"},{t:"berry",c:["#3B3F8F","#262A6B","#B3253F"],x:0.3,y:0.35,r:0.3,n:14,s:1},{t:"drizzle",c:["#B87A3A"],n:1,w:4},{t:"dot",c:["#1D1D1D"],x:0,y:0,r:0.8,n:40,s:0.6})},

{id:"baked-oats",title:"Banana Bread Baked Oatmeal",meal:"Breakfast",time:40,serves:6,kcal:360,protein:11,m:{has:["dairy","egg","gluten"],cuisine:"American",protein:"veg",skill:1},
 blurb:"Tastes like banana bread, eats like breakfast: a sliceable pan of cinnamon oats baked with ripe bananas and melty chocolate chips.",
 ing:[["oats",0.25,"2 cups rolled oats"],["banana",0.5,"3 ripe bananas"],["eggs",0.17,"2 eggs"],["milk",0.2,"1½ cups milk"],["honey",0.1,"3 tbsp honey or maple syrup"],["choc_chips",0.25,"⅓ cup chocolate chips"],["butter",0.05,"2 tbsp melted butter"]],
 pantry:"1 tsp baking powder, 1½ tsp cinnamon, 1 tsp vanilla, ½ tsp salt",
 steps:["Heat the oven to 375°F and butter an 8x8 pan.","Mash 2 bananas and whisk with the eggs, milk, honey, butter and vanilla.","Stir in the oats, baking powder, cinnamon, salt and most of the chocolate chips.","Pour into the pan, top with the last banana sliced and the remaining chips.","Bake 30 to 35 minutes until set and golden. Cut into squares. Keeps 5 days refrigerated."],
 tip:"Warm a square with a splash of milk and a spoon of Greek yogurt.",
 art:ART.A("dish","#3D4752","#E9E1CF",{t:"base",c:["#C99A5A","#A8763A","#E2B878"],x:0,y:0,r:1.05},{t:"grain",c:["#D9B07A","#B88A4A","#E8C890"],x:0,y:0,r:1,n:300,s:1.8},{t:"round",c:["#E2C27A","#F6E4A8"],x:0,y:0,r:0.7,n:9,s:0.7,d:"plain"},{t:"crumble",c:["#3A2014","#5A3020"],x:0,y:0,r:0.85,n:30,s:0.4})},

{id:"hashbrown-casserole",title:"Sausage & Cheddar Hash Brown Breakfast Bake",meal:"Breakfast",time:60,serves:8,kcal:470,protein:22,m:{has:["egg","dairy","pork"],cuisine:"American",protein:"pork",skill:1},
 blurb:"A crowd-pleasing make-ahead bake of crispy hash browns, browned sausage, eggs and sharp cheddar. Assemble the night before, bake in the morning.",
 ing:[["hash_browns",1,"30 oz frozen shredded hash browns, thawed"],["breakfast_sausage",1,"1 lb breakfast sausage"],["eggs",0.84,"10 eggs"],["milk",0.15,"1 cup milk"],["cheddar",1,"2 cups shredded cheddar"],["green_onion",0.5,"4 green onions"],["bell_peppers",0.34,"1 bell pepper, diced"]],
 pantry:"Butter, salt, pepper, hot sauce",
 steps:["Brown the sausage with the pepper, breaking it up. Drain.","Butter a 9x13 and press in the hash browns. Season with salt and pepper and bake at 425°F for 20 minutes to crisp the base.","Scatter over the sausage, most of the cheese and green onions.","Whisk the eggs, milk, ½ tsp salt and pepper and pour over. Top with the remaining cheese.","Lower the oven to 375°F and bake 30 to 35 minutes, until set in the center. Rest 10 minutes."],
 tip:"To make ahead, assemble without baking the hash browns first, refrigerate overnight and bake 50 minutes at 375°F.",
 art:ART.A("dish","#3A3530","#E9E1CF",{t:"base",c:["#F2D27A","#D9B04A","#F6E4A8"],x:0,y:0,r:1.05},ART.cheese(0,0,0.95,30,0.6),{t:"crumble",c:["#8C4A2A","#5A2C16","#B06A40"],x:0,y:0,r:0.9,n:30,s:0.5},{t:"cube",c:["#D7262B","#A81E1E"],x:0,y:0,r:0.9,n:12,s:0.25},ART.scallion(24))},

{id:"lox-bagels",title:"Everything Bagels with Lox & Cream Cheese",meal:"Breakfast",time:10,serves:4,kcal:450,protein:21,m:{has:["fish","dairy","gluten","sesame"],cuisine:"American",protein:"fish",skill:1},
 blurb:"The New York deli classic: toasted bagels with whipped cream cheese, silky smoked salmon, cucumber, red onion and a shake of everything seasoning.",
 ing:[["bagels",0.67,"4 bagels"],["cream_cheese",1,"8 oz cream cheese, softened"],["smoked_salmon",2,"8 oz smoked salmon"],["cucumber",0.5,"½ cucumber, thinly sliced"],["onion",0.05,"thin red onion slices"],["lemon",0.1,"½ lemon"],["everything",0.1,"everything bagel seasoning"]],
 pantry:"Capers and fresh dill (optional), black pepper",
 steps:["Whip the cream cheese with a squeeze of lemon and some pepper until fluffy.","Split and toast the bagels.","Spread generously with cream cheese.","Layer on cucumber, smoked salmon and a few onion slices.","Finish with everything seasoning, capers and dill."],
 tip:"Soak the onion slices in ice water for 5 minutes to make them milder and extra crisp.",
 art:ART.A("board","#2D3C4A","#BC915E",{t:"round",c:["#C98A3E","#F6F2E6"],x:-0.35,y:0,r:0.05,n:1,s:1.75,d:"plain"},{t:"round",c:["#C98A3E","#F6F2E6"],x:0.35,y:0,r:0.05,n:1,s:1.75,d:"plain"},{t:"shave",c:["#F08A62","#F7A47A"],x:0.35,y:0,r:0.25,n:8,s:1},{t:"round",c:["#6FAE4F","#E3F2C9"],x:-0.35,y:0,r:0.2,n:5,s:0.4,d:"cuke"},{t:"dot",c:["#F3E7C4","#2B2B2B"],x:0,y:0,r:0.7,n:120,s:0.6})},

/* ===== LUNCHES ===== */
{id:"chicken-caesar-wraps",title:"Crispy Chicken Caesar Wraps",meal:"Lunch",time:15,serves:4,kcal:540,protein:36,m:{has:["dairy","gluten","egg","fish"],cuisine:"American",protein:"chicken",skill:1},
 blurb:"Crunchy romaine, rotisserie chicken, shaved Parmesan and garlicky Caesar dressing rolled tight in a toasted tortilla.",
 ing:[["rotisserie",0.4,"3 cups chopped rotisserie chicken"],["romaine",0.67,"2 romaine hearts, chopped"],["parmesan",0.3,"½ cup shaved Parmesan"],["caesar",0.5,"½ cup Caesar dressing"],["flour_tortillas",0.4,"4 large flour tortillas"],["lemon",0.1,"½ lemon"]],
 pantry:"Croutons (optional), black pepper",
 steps:["Toss the romaine, chicken and Parmesan with the dressing, a squeeze of lemon and lots of pepper.","Warm the tortillas so they're pliable.","Pile the salad down the center of each and add crushed croutons for crunch.","Fold in the sides and roll tightly.","Toast seam-side down in a dry skillet for 1 minute per side and halve."],
 tip:"Pack the dressing separately if you're making these for the next day.",
 art:ART.A("board","#2D3C4A","#BC915E",{t:"spiral",c:["#F0DDB0","#D6B57A","#E8D3A0","#5C9C45","#C9A26A"],n:4},{t:"shave",c:["#F7EBC8","#EBD9A6"],x:0.7,y:0.65,r:0.12,n:5,s:0.7})},

{id:"banh-mi",title:"Caramelized Chicken Bánh Mì",meal:"Lunch",time:30,serves:4,kcal:560,protein:32,m:{has:["gluten","egg","spicy"],cuisine:"Asian",protein:"chicken",skill:1},
 blurb:"Sticky lemongrass-style chicken in a crackly baguette with quick-pickled carrots and cucumber, jalapeño, cilantro and sriracha mayo.",
 ing:[["chicken_thigh",0.67,"1 lb boneless thighs, thinly sliced"],["soy",0.1,"2 tbsp soy sauce"],["honey",0.1,"2 tbsp honey"],["garlic",0.1,"3 garlic cloves"],["baguette",2,"2 baguettes, each cut in 2"],["carrots",0.25,"2 carrots, in matchsticks"],["cucumber",0.5,"½ cucumber, in spears"],["jalapeno",0.34,"1 jalapeño, sliced"],["cilantro",1,"1 bunch cilantro"]],
 pantry:"½ cup rice vinegar, 2 tbsp sugar, ⅓ cup mayo, 1 tbsp sriracha, 1 tbsp oil, salt",
 steps:["Quick-pickle the carrots in the vinegar, sugar and ½ tsp salt for at least 15 minutes.","Toss the chicken with the soy, honey and garlic.","Sear in the oil over high heat until caramelized and cooked, 6 minutes.","Stir the mayo and sriracha together. Split and toast the baguettes.","Spread with sriracha mayo and fill with chicken, drained pickles, cucumber, jalapeño and lots of cilantro."],
 tip:"The pickled carrots keep 2 weeks in the fridge. Make a big jar.",
 art:ART.A("board","#2B3A33","#BC915E",{t:"slab",c:["#E0A44E","#C98E3A","#F2C27A"],x:0,y:0,r:0.5,n:2,s:2.1},{t:"strip",c:["#F07D1E","#F9A04A"],x:0,y:0,r:0.6,n:20,s:0.5,l:4},{t:"leaf",c:["#4FA046","#6DBE5C"],x:0,y:0,r:0.6,n:20,s:0.35},{t:"round",c:["#3E8A35","#D9EFC2"],x:0,y:0,r:0.5,n:8,s:0.3,d:"ring"})},

{id:"chicken-burrito-bowls",title:"Chipotle-Style Chicken Burrito Bowls",meal:"Lunch",time:30,serves:4,kcal:620,protein:40,m:{has:["dairy","spicy"],cuisine:"Mexican",protein:"chicken",skill:1},
 blurb:"Smoky chipotle-marinated chicken over cilantro-lime rice with black beans, corn salsa, cheese and guacamole. Meal-preps perfectly.",
 ing:[["chicken_thigh",1,"1½ lb boneless thighs"],["chipotle",0.3,"2 chipotles in adobo plus 1 tbsp sauce"],["lime",0.5,"3 limes"],["garlic",0.1,"3 garlic cloves"],["jasmine_rice",0.25,"1½ cups rice"],["cilantro",1,"1 bunch cilantro"],["black_beans",1,"1 can black beans"],["frozen_corn",0.5,"1 cup corn"],["cheese_mex",0.5,"1 cup shredded cheese"],["avocado",0.5,"2 avocados"],["romaine",0.34,"1 romaine heart"]],
 pantry:"2 tbsp oil, 1 tsp cumin, 1 tsp oregano, salt",
 steps:["Blend or mash the chipotles, garlic, juice of 1 lime, oil, cumin, oregano and 1 tsp salt. Coat the chicken and marinate 15 minutes.","Grill or sear the chicken in a hot skillet, 5 to 6 minutes per side, until charred. Rest and chop.","Cook the rice and stir in chopped cilantro and the juice of 1 lime.","Char the corn in a dry pan and mix with diced onion, cilantro and lime. Mash the avocados with lime and salt.","Build bowls: rice, lettuce, beans, chicken, corn salsa, cheese and guacamole."],
 tip:"Pack the guac with plastic pressed onto its surface and it stays green for 2 days.",
 art:ART.A("bowl","#33302B","#C9562E",ART.rice(-0.35,-0.35,0.4,400),{t:"cube",c:["#9E3A1E","#6A2412","#C25A2E"],x:0.3,y:-0.2,r:0.35,n:16,s:0.8},{t:"bean",c:["#1E1A22","#4A4352"],x:-0.4,y:0.35,r:0.25,n:16,s:0.55},{t:"dot",c:["#F6C734","#E8A81E"],x:0.4,y:0.4,r:0.22,n:40,s:1.8},{t:"dollop",c:["#9BC15A","#7EA63E"],x:0,y:0.45,r:0.1,n:1,s:0.9},ART.cheese(0.05,0.05,0.2,6,0.4),ART.lime())},

{id:"cobb-salad",title:"Classic Cobb Salad",meal:"Lunch",time:25,serves:4,kcal:560,protein:36,m:{has:["egg","dairy","pork"],cuisine:"American",protein:"chicken",skill:1,lc:1},
 blurb:"Rows of chicken, crispy bacon, jammy eggs, avocado, tomatoes and blue cheese or feta over crisp romaine, with a tangy red wine vinaigrette.",
 ing:[["rotisserie",0.4,"3 cups chopped chicken"],["bacon",0.67,"8 slices bacon, cooked and crumbled"],["eggs",0.34,"4 eggs, boiled 9 minutes"],["avocado",0.5,"2 avocados"],["cherry_tomatoes",1,"1 pint cherry tomatoes"],["romaine",1,"3 romaine hearts"],["feta",0.5,"½ cup blue cheese or feta"]],
 pantry:"Vinaigrette: ⅓ cup olive oil, 3 tbsp red wine vinegar, 1 tsp Dijon, 1 small garlic clove, salt, pepper",
 steps:["Cook the bacon until crisp and crumble it. Boil the eggs 9 minutes, ice, peel and chop.","Shake the vinaigrette ingredients in a jar.","Chop the romaine and spread on a platter.","Arrange the chicken, bacon, eggs, avocado, tomatoes and cheese in rows on top.","Drizzle with dressing and toss at the table."],
 tip:"For packed lunches, layer the toppings in jars with the dressing on the bottom and lettuce on top.",
 art:ART.A("plate","#2E3A4A","#F4F1EA",{t:"leaf",c:["#8CC05A","#B6DB82","#6EA040"],x:0,y:0,r:0.85,n:50,s:0.6},{t:"cube",c:["#E7B76A","#C98E3A"],x:-0.5,y:0,r:0.15,n:8,s:0.5},{t:"crumble",c:["#8E3A1E","#B8562A"],x:-0.25,y:0,r:0.15,n:16,s:0.5},{t:"eggHalf",c:["#FFFFFF","#F29A12"],x:0,y:0,r:0.15,n:2,s:0.7},{t:"avoslice",c:["#9BC15A","#D9E89A","#3E5A1C"],x:0.25,y:0,r:0.1,n:4,s:0.5},{t:"round",c:["#D7261E","#F25A3C"],x:0.5,y:0,r:0.15,n:5,s:0.4,d:"tomato"},{t:"crumble",c:["#F4F4F0","#DDE5EC"],x:0,y:0.45,r:0.25,n:10,s:0.4})},

{id:"tuna-melt",title:"Diner-Style Tuna Melts",meal:"Lunch",time:15,serves:4,kcal:540,protein:32,m:{has:["fish","dairy","gluten","egg"],cuisine:"American",protein:"fish",skill:1},
 blurb:"Bright, crunchy tuna salad with celery, pickles and lemon, griddled on sourdough with sharp cheddar until golden and gooey.",
 ing:[["tuna",3,"3 cans albacore tuna, drained"],["celery",0.3,"2 celery stalks, finely diced"],["pickles",0.15,"¼ cup chopped dill pickles"],["lemon",0.1,"½ lemon"],["sourdough",0.4,"8 slices sourdough"],["cheddar_slices",1,"8 slices sharp cheddar"],["butter",0.05,"butter"]],
 pantry:"⅓ cup mayo, 1 tsp Dijon, salt, pepper",
 steps:["Mix the tuna, celery, pickles, mayo, Dijon, lemon juice and pepper.","Butter one side of each bread slice.","Build sandwiches with the buttered sides out: cheese, tuna salad, cheese.","Cook in a skillet over medium-low until deep golden and melted, 3 to 4 minutes per side. Cover the pan for the first side to help the cheese melt.","Slice on the diagonal and serve with pickles."],
 tip:"Cheese on both sides of the tuna glues the sandwich together.",
 art:ART.A("board","#2A3340","#B88456",{t:"toast",c:["#C98A3E","#8E5A22","#E8B870"],n:2},{t:"blob",c:["#F6C734","#E8A81E","#C9862A"],x:0,y:0,r:0.8,n:5,s:0.8,toast:1},{t:"round",c:["#6E9A3A","#B8D47A"],x:0.75,y:0.65,r:0.12,n:3,s:0.45,d:"cuke"})},

{id:"blt-avocado",title:"BLTs with Avocado & Garlic Mayo",meal:"Lunch",time:15,serves:4,kcal:560,protein:20,m:{has:["pork","gluten","egg"],cuisine:"American",protein:"pork",skill:1},
 blurb:"Thick oven-crisp bacon, juicy salted tomatoes, crunchy romaine and creamy avocado on toasted sourdough with lemony garlic mayo.",
 ing:[["bacon",1,"12 slices thick-cut bacon"],["roma_tomatoes",1,"4 ripe tomatoes, sliced"],["romaine",0.34,"1 romaine heart"],["avocado",0.5,"2 avocados"],["sourdough",0.4,"8 slices sourdough"],["garlic",0.05,"1 small garlic clove, grated"],["lemon",0.1,"½ lemon"]],
 pantry:"⅓ cup mayo, flaky salt, pepper",
 steps:["Bake the bacon on a rack at 400°F for 15 to 18 minutes until crisp.","Salt the tomato slices and let them sit 5 minutes.","Stir the mayo with the garlic and a squeeze of lemon.","Toast the bread and spread with garlic mayo.","Layer lettuce, tomatoes, avocado and 3 bacon slices per sandwich. Close, press and slice."],
 tip:"Salting the tomatoes a few minutes ahead makes them taste much more like tomato.",
 art:ART.A("board","#2B3A33","#BC915E",{t:"toast",c:["#C98A3E","#8E5A22","#F0D3A0"],n:2},{t:"strip",c:["#8E3A1E","#B8562A"],x:0,y:0,r:0.6,n:6,s:1.1,l:4,sear:1,toast:1},{t:"round",c:["#D7261E","#F25A3C"],x:0,y:0,r:0.6,n:4,s:0.7,d:"tomato",toast:1},{t:"leaf",c:["#8CC05A","#B6DB82"],x:0,y:0,r:0.7,n:10,s:0.5,toast:1})},

{id:"thai-peanut-salad",title:"Crunchy Thai Peanut Chicken Salad",meal:"Lunch",time:20,serves:4,kcal:480,protein:32,m:{has:["gluten","nuts"],cuisine:"Asian",protein:"chicken",skill:1,lc:1},
 blurb:"A rainbow of crunchy cabbage, carrots, edamame and chicken tossed in a creamy peanut-lime dressing and finished with roasted peanuts and cilantro. Holds up for days.",
 ing:[["rotisserie",0.4,"3 cups shredded chicken"],["coleslaw",1,"14 oz coleslaw mix"],["carrots",0.25,"2 carrots, shredded"],["edamame",0.5,"1 cup shelled edamame"],["green_onion",0.5,"4 green onions"],["cilantro",0.5,"cilantro"],["peanuts",0.15,"½ cup roasted peanuts"],["peanut_butter",0.15,"⅓ cup peanut butter"],["soy",0.1,"2 tbsp soy sauce"],["lime",0.25,"2 limes"],["honey",0.05,"1 tbsp honey"]],
 pantry:"1 tbsp rice vinegar, 1 tsp sesame oil, 1 garlic clove, chili flakes",
 steps:["Whisk the peanut butter, soy, juice of 2 limes, honey, vinegar, sesame oil, grated garlic and 3 tbsp warm water until smooth.","Toss the slaw, carrots, edamame, green onions and chicken in a big bowl.","Add the dressing and toss well.","Fold in the cilantro.","Top with peanuts just before serving."],
 tip:"Unlike lettuce salads, this one tastes better on day two.",
 art:ART.A("bowl","#2D3C4A","#F4F1EA",{t:"leaf",c:["#8A4A9C","#B583C4","#E8EFD8","#B8D47A"],x:0,y:0,r:0.95,n:70,s:0.38},{t:"strip",c:["#F07D1E","#F9A04A"],x:0,y:0,r:0.85,n:24,s:0.5,l:4},{t:"bean",c:["#7BB84A","#A8D878"],x:0,y:0,r:0.85,n:18,s:0.5},{t:"shred",c:["#E9CFA0","#D9B98A"],x:0,y:0,r:0.7,n:10,s:0.8},{t:"bean",c:["#C99A5A","#E2B878"],x:0,y:0,r:0.8,n:16,s:0.45},ART.herbs(16),ART.lime())},

{id:"italian-grinder",title:"Italian Grinder Sandwiches",meal:"Lunch",time:15,serves:4,kcal:690,protein:32,m:{has:["pork","dairy","gluten","egg"],cuisine:"Italian",protein:"pork",skill:1},
 blurb:"Toasted hoagie rolls stacked with salami, turkey and melted provolone, piled high with the viral tangy, creamy shredded-lettuce grinder salad.",
 ing:[["hoagie_rolls",0.67,"4 hoagie rolls"],["salami",1,"7 oz sliced Genoa salami"],["deli_turkey",0.67,"6 oz sliced turkey"],["provolone",1,"8 slices provolone"],["romaine",0.67,"2 romaine hearts, finely shredded"],["onion",0.1,"¼ onion, thinly sliced"],["jalapeno",0.34,"pepperoncini or jalapeño"],["parmesan",0.15,"¼ cup grated Parmesan"]],
 pantry:"Grinder dressing: ⅓ cup mayo, 2 tbsp red wine vinegar, 1 tsp oregano, 1 garlic clove, chili flakes, salt, pepper",
 steps:["Stir together the mayo, vinegar, oregano, grated garlic, chili flakes and Parmesan.","Toss the lettuce, onion and sliced peppers with the dressing.","Split the rolls and layer salami, turkey and provolone on both halves.","Toast open-faced under the broiler until the cheese melts and the bread crisps, 2 to 3 minutes.","Pile on the grinder salad, close and slice in half."],
 tip:"Slice the lettuce as thin as you can. It should be almost like slaw.",
 art:ART.A("board","#2D3C4A","#BC915E",{t:"slab",c:["#E0A44E","#C98E3A","#F2C27A"],x:0,y:0,r:0.5,n:2,s:2.1},{t:"round",c:["#9E2A34","#C8505A"],x:0,y:0,r:0.6,n:10,s:0.6,d:"pep"},{t:"leaf",c:["#E8EFD8","#B8D47A","#8CC05A"],x:0,y:0,r:0.6,n:40,s:0.3})},
];
for(const r of MORE){ META[r.id]=r.m; delete r.m; r.art = r.art || null; RECIPES.push(r); }
for(const [id,m] of Object.entries(META)){ m.veg = ["veg","egg"].includes(m.protein); m.pesc = m.veg || ["fish","shrimp"].includes(m.protein); }



/* amounts actually used where the purchase share overstated it */
const USE_FIX = {"overnight-oats":{oats:0.14},"pb-banana-oats":{oats:0.14},"baked-oats":{oats:0.14},"smoothie-bowls":{granola:0.1},"yogurt-parfait":{granola:0.4},
  "chicken-parm":{panko:0.45},"katsu-curry":{panko:0.55},"fish-tacos":{panko:0.3},"meatloaf":{panko:0.2},"black-bean-burgers":{panko:0.2},"turkey-meatballs-orzo":{panko:0.1},"mac-and-cheese":{panko:0.2},
  "french-toast":{maple_syrup:0.25},"buttermilk-pancakes":{maple_syrup:0.25}};
for(const r of RECIPES){ const f=USE_FIX[r.id]; if(f) r.ing=r.ing.map(([i,u,t])=>[i, f[i]??u, t]); }
/* ------------------------------------------------------------------ nutrition
   Per standard pack (the item's "1 unit" size): [kcal, protein g, carbs g, fat g, fiber g, sugar g, sodium mg].
   Values are USDA-style estimates for the edible portion. */
const NUTR = {
  chicken_thigh:[823,134,0,28,0,0,650], chicken_breast:[816,153,0,18,0,0,310], rotisserie:[1210,171,0,54,0,0,2540],
  shrimp:[386,91,1,2,0,0,1100], salmon:[1180,113,0,76,0,0,335], ground_beef:[1150,78,0,91,0,0,300],
  sirloin:[1090,156,0,48,0,0,380], pork_tenderloin:[680,119,0,20,0,0,300], italian_sausage:[1300,64,2,113,0,1,3630],
  pepperoni:[850,34,2,76,0,0,2900], eggs:[860,75,5,60,0,2,840], greek_yogurt:[535,92,33,4,0,30,330],
  milk:[960,64,94,38,0,94,830], butter:[3250,4,0,368,0,0,2600], sour_cream:[900,11,21,88,0,6,360],
  cheese_mex:[900,52,4,75,0,1,1475], mozzarella:[680,55,7,45,0,2,1430], parmesan:[596,41,5,40,0,1,2130],
  feta:[450,24,7,36,0,7,1870], tzatziki:[306,10,14,24,1,8,1020], hummus:[470,22,40,28,17,1,1075], kimchi:[68,5,11,2,7,5,2700],
  broccoli:[154,13,30,2,12,8,150], green_onion:[32,2,7,0,3,2,16], garlic:[224,10,50,1,3,2,25], onion:[544,15,127,1,23,58,54],
  cilantro:[14,1,2,0,2,0,28], lemon:[87,3,28,1,8,7,6], lime:[90,2,30,1,8,5,6], avocado:[960,12,51,88,40,4,42],
  spinach:[65,8,10,1,6,1,225], kale:[139,12,25,2,10,1,120], mixed_greens:[57,5,10,1,6,2,100], cherry_tomatoes:[54,3,12,1,4,8,15],
  cucumber:[60,3,14,0,2,7,8], bell_peppers:[130,5,30,1,10,21,20], carrots:[372,8,87,2,25,43,630], celery:[63,3,13,1,7,6,360],
  apples:[707,4,188,2,33,140,14], sweet_potato:[1170,22,274,1,41,57,750], baby_potatoes:[524,14,119,1,15,5,40],
  asparagus:[68,7,13,0,7,4,7], green_beans:[105,6,24,0,9,11,20], coleslaw:[100,5,23,0,9,12,70],
  flour_tortillas:[1400,38,240,35,12,10,3500], corn_tortillas:[624,16,128,8,18,1,130], pita:[990,33,200,4,8,4,1920],
  naan:[520,18,90,10,4,6,900], sourdough:[1840,74,350,14,15,10,3900], baguette:[756,30,150,4,6,4,1700],
  tortilla_chips:[1845,26,240,87,20,2,1300], jasmine_rice:[3265,64,720,6,9,0,0], orzo:[1630,57,330,7,14,6,10],
  gnocchi:[770,18,160,4,6,2,1800], oats:[4520,155,800,80,120,12,0], chia:[1650,56,143,104,116,0,50],
  chicken_broth:[40,6,2,1,0,1,3000], diced_tomatoes:[82,4,18,0,4,11,700], black_beans:[330,22,60,1,22,1,900],
  cannellini:[300,20,54,1,16,1,800], coconut_milk:[790,8,11,85,0,6,50], soy:[200,20,20,0,0,2,18000],
  honey:[1034,1,280,0,1,280,15], gochujang:[1150,20,250,8,6,120,12000], red_curry:[110,3,15,4,4,6,5000],
  pesto:[760,9,15,75,2,2,1900], marinara:[340,10,54,10,14,34,3000], salsa_verde:[136,4,28,2,6,12,3000],
  salsa:[136,6,28,0,6,14,3200], everything:[200,7,14,14,6,0,9000], sesame:[400,12,16,35,8,0,8],
  taco_seasoning:[170,4,34,2,6,4,7000], smoked_paprika:[200,10,38,9,24,7,48], chili_crisp:[1100,10,30,105,4,6,1800],
  frozen_berries:[227,3,54,1,14,32,5], frozen_corn:[386,14,86,5,9,15,10],
  chickpeas:[336,18,54,6,15,6,700], kidney_beans:[310,21,55,1,18,2,800], granola:[2040,45,290,80,30,100,600],
  peanut_butter:[2680,113,100,227,27,40,1900], penne:[1600,56,330,7,14,6,10], spaghetti:[1600,56,330,7,14,6,10],
  curry_powder:[185,8,32,8,30,2,30], banana:[630,8,162,2,18,86,6], deli_turkey:[255,45,8,4,0,4,2600],
  ground_turkey:[680,85,0,37,0,0,340], mozz_pearls:[640,41,5,50,0,2,330], ricotta:[720,47,13,55,0,1,360],
  frozen_veg:[295,13,60,2,18,14,160],
  heavy_cream:[1630,13,13,173,0,13,180], cheddar:[914,57,3,75,0,1,1480], cheddar_slices:[914,57,3,75,0,1,1480],
  provolone:[795,58,5,60,0,1,1990], cream_cheese:[777,14,9,77,0,6,730], bacon:[650,45,2,50,0,0,2300],
  chuck_roast:[3000,260,0,210,0,0,900], pork_shoulder:[3260,230,0,250,0,0,1000], ground_pork:[1190,77,0,96,0,0,260],
  smoked_sausage:[1020,50,7,88,0,2,3400], breakfast_sausage:[1500,64,4,135,0,2,3200], whole_chicken:[2365,220,0,160,0,0,900],
  white_fish:[372,82,0,3,0,0,250], smoked_salmon:[132,21,0,5,0,0,2200], salami:[750,44,2,62,0,1,3700],
  tofu:[357,40,8,20,4,1,30], ginger:[90,2,20,1,2,2,15], oranges:[420,8,106,1,22,84,0], russet:[1790,48,410,2,50,14,100],
  romaine:[100,7,20,2,12,7,50], roma_tomatoes:[82,4,18,1,5,12,23], jalapeno:[13,0,3,0,1,2,1], parsley:[22,2,4,0,2,1,34],
  basil:[5,1,1,0,1,0,1], crushed_tomatoes:[254,13,56,2,15,32,1500], sun_dried:[510,12,55,34,14,30,640],
  refried_beans:[410,24,68,5,24,2,1800], beef_broth:[40,6,2,0,0,1,3300], panko:[910,27,180,9,9,9,680],
  lasagna:[1600,56,330,7,14,6,10], elbows:[1600,56,330,7,14,6,10], jumbo_shells:[1200,42,250,5,10,4,10],
  rice_noodles:[1445,24,330,2,6,0,700], ramen:[1075,35,205,10,8,2,1500], peanuts:[2650,107,97,225,38,19,3000],
  grits:[2500,60,540,8,30,0,10], tuna:[145,27,0,3,0,0,400], pickles:[80,3,16,1,6,6,7600], maple_syrup:[1150,0,295,0,0,265,40],
  choc_chips:[1700,14,220,100,20,190,40], enchilada_sauce:[160,5,25,5,6,8,4500], chipotle:[100,3,18,3,6,8,2400],
  garam_masala:[216,8,37,8,20,2,50], miso:[785,50,104,24,21,25,14600], curry_roux:[1130,13,110,75,4,10,9000],
  bbq_sauce:[870,4,205,3,2,170,5300], cajun:[300,10,50,8,12,2,20000], caesar:[1900,10,10,200,0,6,6500],
  hoagie_rolls:[1380,48,250,18,10,24,2400], burger_buns:[1600,48,280,32,8,48,2400], brioche:[1800,50,260,60,8,70,2000],
  english_muffins:[780,30,150,6,9,6,1400], bagels:[1680,66,330,9,15,30,2700], frozen_stirfry:[205,10,40,1,14,12,150],
  edamame:[410,37,30,17,17,7,20], dumplings:[1000,36,110,45,6,6,2700], puff_pastry:[2650,35,220,180,8,4,1200],
  hash_browns:[680,14,150,2,14,2,200],
};
/* pantry staples named in a recipe's pantry line, per tablespoon */
const PANTRY_N = [
  [/(olive oil|neutral oil|sesame oil|\boil\b)/, [120,0,0,14,0,0,0]], [/butter/, [100,0,0,11,0,0,90]], [/mayo/, [90,0,0,10,0,0,90]],
  [/flour/, [14,0.4,3,0,0.1,0,0]], [/brown sugar/, [52,0,13,0,0,13,4]], [/sugar/, [48,0,12,0,0,12,0]], [/cornstarch/, [30,0,7,0,0,0,1]],
  [/ketchup/, [20,0,5,0,0,4,160]], [/maple/, [52,0,13,0,0,12,2]], [/honey/, [64,0,17,0,0,17,1]], [/tahini|peanut butter/, [90,3,3,8,1,0,20]],
];
const QTY = {"¼":0.25,"⅓":0.333,"½":0.5,"⅔":0.667,"¾":0.75,"1½":1.5};
function pantryNutrition(text){
  const out=[0,0,0,0,0,0,0]; const t=text.toLowerCase();
  // "3 tbsp oil", "⅓ cup mayo", "½ cup flour"; frying oil counts as about 4 tbsp absorbed
  for(const part of t.split(/[,;.]| plus | and /)){
    const m=part.match(/(\d+½|\d+|¼|⅓|½|⅔|¾)\s*(tbsp|tsp|cups?)\b(.*)/);
    let tbsp=0, what=part;
    if(m){ const n = QTY[m[1]] ?? parseFloat(m[1]); tbsp = m[2].startsWith("cup")? n*16 : m[2]==="tsp"? n/3 : n; what=m[3]; }
    else if(/oil for frying|oil, for frying/.test(part)) tbsp=4;
    if(!tbsp) continue;
    if(/flour/.test(what) && /dredg|coat|for frying/.test(t)) tbsp*=0.4;
    if(/oil/.test(what) && !/sesame/.test(what) && tbsp>4) tbsp = 4 + (tbsp-4)*0.3; // most frying / softening oil stays in the pan
    const hit=PANTRY_N.find(([re])=>re.test(what)); if(!hit) continue;
    hit[1].forEach((v,i)=>out[i]+=v*tbsp);
  }
  if(/\bsalt\b/.test(t)) out[6]+=1200; // seasoning to taste, whole recipe
  return out;
}
const NUTR_CACHE = {};
function nutritionOf(r){
  if(NUTR_CACHE[r.id]) return NUTR_CACHE[r.id];
  const tot=pantryNutrition(r.pantry);
  for(const [item,use] of r.ing){ const n=NUTR[item]; if(n) n.forEach((v,i)=>tot[i]+=v*use); }
  const per=tot.map(v=>v/r.serves);
  const res={kcal:Math.round(per[0]/5)*5, protein:Math.round(per[1]), carbs:Math.round(per[2]), fat:Math.round(per[3]),
    fiber:Math.round(per[4]), sugar:Math.round(per[5]), sodium:Math.round(per[6]/10)*10};
  return NUTR_CACHE[r.id]=res;
}
/* daily reference values for % bars (FDA, 2,000 kcal) */
for(const r of RECIPES){ const n=nutritionOf(r); r.kcal=n.kcal; r.protein=n.protein; }
const DV = {kcal:2000, protein:50, carbs:275, fat:78, fiber:28, sugar:50, sodium:2300};

/* ------------------------------------------------------------------ storage: [fridge days, freezer months (0 = don't freeze), how to store & reheat] */
const RH = {
  micro:"Microwave covered, 1½ to 2 minutes, stirring halfway.",
  skillet:"Reheat in a skillet over medium with a splash of water until hot, 3 to 5 minutes.",
  oven:"Reheat covered at 350°F for 15 to 20 minutes (or microwave single portions 2 minutes).",
  soup:"Reheat on the stove over medium until simmering, or microwave 2 to 3 minutes, stirring once.",
  cold:"Eat cold or at room temperature. No reheating needed.",
  pasta:"Add a splash of water or milk and microwave covered 1½ to 2 minutes, stirring halfway.",
};
const STORAGE = {
  "gochujang-chicken":[4,3,"Store chicken and rice in separate containers. "+RH.micro],
  "lemon-orzo-shrimp":[2,0,"Shrimp turns rubbery when frozen. "+RH.pasta],
  "everything-salmon":[3,0,"Keep the yogurt sauce separate. Reheat salmon gently at 275°F for 10 minutes, or eat it cold on salads. Re-crisp potatoes in a hot oven or air fryer."],
  "sweet-potato-tacos":[4,0,"Store the filling, slaw and crema separately and build tacos fresh. Reheat the filling in a skillet."],
  "red-curry-shrimp":[2,0,"Store curry and rice separately. "+RH.soup],
  "pesto-gnocchi":[3,0,"Gnocchi softens in the fridge. "+RH.skillet],
  "bulgogi-bowls":[4,3,"Store beef, rice and cold toppings separately. Fry a fresh egg when serving. "+RH.micro],
  "greek-chicken-bowls":[4,3,"Store chicken, salad and sauces separately. Chicken is great cold or microwaved 1 minute."],
  "tuscan-soup":[5,3,"The kale softens further but tastes great. "+RH.soup],
  "honey-garlic-pork":[4,3,"Slice only what you'll eat. "+RH.micro],
  "shakshuka":[2,0,"Store leftover sauce without eggs. Reheat the sauce in a skillet and poach fresh eggs in it."],
  "overnight-oats":[4,0,"Keep jars sealed in the fridge. Eat cold, or microwave 1 minute."],
  "avocado-egg-toast":[0,0,"Best made fresh. Jammy eggs keep 3 days peeled in a sealed container."],
  "chicken-salad-wraps":[3,0,"Keep the chicken salad separate and wrap the morning you eat it."],
  "steak-fajitas":[3,3,"Store meat and vegetables together, toppings separately. "+RH.skillet],
  "hot-honey-flatbread":[3,2,"Reheat in a 400°F oven or air fryer for 4 to 5 minutes to re-crisp."],
  "chicken-tortilla-soup":[5,3,"Store toppings separately. "+RH.soup],
  "egg-muffins":[5,2,"Cool fully, then refrigerate or freeze in a bag. Microwave 30 seconds from the fridge, 60 to 75 seconds from frozen."],
  "breakfast-burritos":[4,3,"Wrap each in foil. From frozen, unwrap, cover with a damp paper towel and microwave 2 to 2½ minutes, turning once."],
  "pb-banana-oats":[4,2,"Portion into containers. Add a splash of milk and microwave 1½ minutes."],
  "yogurt-parfait":[3,0,"Pack granola separately so it stays crunchy."],
  "chickpea-salad":[4,0,"Gets better as it sits. "+RH.cold],
  "turkey-hummus-wraps":[2,0,"Keep rolls whole, wrapped tightly, and slice just before eating."],
  "caprese-pasta":[4,0,"Stir in a spoon of pesto or olive oil to refresh. "+RH.cold],
  "bean-quesadillas":[3,2,"Re-crisp in a dry skillet over medium, 2 minutes per side."],
  "peanut-noodles":[4,0,"The sauce thickens cold. Loosen with warm water. "+RH.cold],
  "chickpea-curry":[5,3,"Store curry and rice separately. "+RH.soup],
  "veggie-fried-rice":[4,2,RH.skillet],
  "baked-ziti":[5,3,RH.oven],
  "turkey-chili":[5,4,"Store toppings separately. "+RH.soup],
  "butter-chicken":[4,3,"Store curry and rice separately. "+RH.soup],
  "chana-masala":[5,3,"Store curry and rice separately. "+RH.soup],
  "birria-tacos":[4,3,"Store meat in its consommé. Reheat the consommé on the stove and griddle fresh tacos."],
  "chicken-tinga":[4,3,"Store chicken separately and crisp tostadas fresh. "+RH.micro],
  "carnitas-bowls":[4,3,"Store pork with some juices. Crisp it in a hot skillet. Keep guac and toppings separate."],
  "chicken-parm":[3,2,"Reheat cutlets at 400°F for 10 minutes so they stay crisp. Microwave the pasta separately."],
  "carbonara":[1,0,"Carbonara doesn't reheat well. Make only what you'll eat, or reheat gently with a splash of water over low heat."],
  "marry-me-chicken":[3,0,"Cream sauces split when frozen. Reheat gently on low with a splash of broth."],
  "beef-lasagna":[5,3,RH.oven],
  "shrimp-scampi":[2,0,RH.pasta],
  "chicken-alfredo":[3,0,"Alfredo thickens. Reheat on low with a splash of milk, stirring constantly."],
  "stuffed-shells":[5,3,RH.oven],
  "orange-chicken":[3,2,"Reheat in a 400°F oven or air fryer for 6 to 8 minutes to re-crisp."],
  "beef-broccoli":[4,2,RH.skillet],
  "teriyaki-salmon-bowls":[3,0,"Store salmon, rice and toppings separately. Salmon is good cold or warmed gently."],
  "pad-thai":[3,0,"Add a splash of water and reheat in a skillet, tossing, 3 minutes."],
  "potsticker-stirfry":[3,0,"Re-crisp in a skillet over medium, 3 to 4 minutes."],
  "miso-ramen":[3,3,"Store broth, noodles and toppings separately. Freeze only the broth. Reheat the broth to a simmer and pour over the noodles."],
  "katsu-curry":[3,3,"Freeze only the curry. Re-crisp katsu at 400°F for 8 minutes."],
  "kung-pao-chicken":[4,2,RH.skillet],
  "tofu-peanut-stirfry":[4,0,RH.skillet],
  "smash-burgers":[3,2,"Cook patties fresh if you can. Reheat leftovers in a hot skillet, 1 minute per side."],
  "pulled-pork":[5,4,"Store pork with its juices. Reheat covered in the microwave or a pot. Keep slaw separate."],
  "meatloaf":[4,3,"Reheat slices in a skillet or microwave. Leftovers make great sandwiches."],
  "mac-and-cheese":[4,2,"Add a splash of milk and reheat covered at 350°F for 15 minutes, or microwave."],
  "chicken-pot-pie":[3,3,"Reheat covered at 350°F for 20 minutes. Uncover for the last 5 to crisp the pastry."],
  "crispy-chicken-sandwich":[3,2,"Re-crisp chicken at 400°F or in an air fryer for 8 minutes. Build sandwiches fresh."],
  "jambalaya":[3,0,"Shrimp toughens when frozen. "+RH.micro],
  "shrimp-grits":[2,0,"Whisk the grits with hot milk to loosen. Warm the shrimp gently."],
  "potato-soup":[4,0,"Dairy soups go grainy when frozen. "+RH.soup],
  "chicken-shawarma":[4,3,"Store chicken, salad and sauces separately. "+RH.micro],
  "turkey-meatballs-orzo":[4,3,"Freeze meatballs separately from the orzo. "+RH.micro],
  "roast-chicken":[4,3,"Pull the meat off the bones before storing. Use it in salads, wraps or soup, or reheat with a splash of broth."],
  "stuffed-peppers":[4,3,RH.oven],
  "garlic-butter-steak":[3,0,"Reheat briefly in a hot skillet so the steak doesn't overcook."],
  "black-bean-burgers":[4,3,"Freeze uncooked or cooked patties between parchment. Reheat in a skillet."],
  "tomato-soup-grilled-cheese":[5,3,"Freeze the soup without the cream, then stir it in when reheating. Make grilled cheese fresh."],
  "fish-tacos":[1,0,"Best eaten fresh. Re-crisp fish at 400°F for 6 minutes if needed."],
  "buttermilk-pancakes":[4,2,"Freeze in a single layer, then bag. Toast or microwave 45 seconds."],
  "french-toast":[3,2,"Freeze between parchment. Reheat in a toaster or 375°F oven."],
  "huevos-rancheros":[0,0,"Best made fresh. Leftover beans and salsa keep 4 days."],
  "breakfast-sandwiches":[4,3,"Wrap each in foil or plastic. From frozen, wrap in a paper towel and microwave 1½ minutes, flipping halfway."],
  "chilaquiles":[0,0,"Best made fresh. The chips go soft quickly."],
  "smoothie-bowls":[0,3,"Freeze pre-portioned smoothie packs of fruit, spinach and yogurt cubes. Blend fresh."],
  "baked-oats":[5,3,"Store squares in a container. Microwave 45 seconds with a splash of milk."],
  "hashbrown-casserole":[4,3,RH.oven],
  "lox-bagels":[0,0,"Assemble fresh. Smoked salmon keeps 5 days once opened."],
  "chicken-caesar-wraps":[1,0,"Pack the dressing separately and wrap the day you eat it."],
  "banh-mi":[2,0,"Store chicken and pickles separately. Build sandwiches fresh on a toasted baguette."],
  "chicken-burrito-bowls":[4,3,"Pack rice, chicken and beans together and the cold toppings separately. "+RH.micro],
  "cobb-salad":[3,0,"Store dressing separately. Add avocado the day you eat it."],
  "tuna-melt":[3,0,"Tuna salad keeps 3 days. Grill sandwiches fresh."],
  "blt-avocado":[0,0,"Best assembled fresh. Cooked bacon keeps 5 days."],
  "thai-peanut-salad":[4,0,"Holds up for days. Add peanuts just before eating. "+RH.cold],
  "italian-grinder":[1,0,"Store the grinder salad separately and assemble fresh."],
};
function storageOf(r){ const s=STORAGE[r.id]||[3,0,RH.micro]; return {fridge:s[0], freezer:s[1], how:s[2]}; }
function storageLine(r){
  const s=storageOf(r);
  const f = s.fridge ? `Keeps ${s.fridge} day${s.fridge>1?"s":""} in the fridge` : "Best eaten fresh";
  const z = s.freezer ? `freezes up to ${s.freezer} month${s.freezer>1?"s":""}` : "don't freeze";
  return f+", "+z+".";
}

/* ------------------------------------------------------------------ v5 pantry: world-pantry items */
Object.assign(ITEMS, {
  paneer:G("Paneer","Dairy & Eggs","Paneer (14 oz)",5.49,null,"tj,aldi,costco"),
  swiss:G("Sliced Swiss","Dairy & Eggs","Sliced Swiss (8 oz)",3.29,["Kirkland Sliced Swiss (2 lb)",4,9.99]),
  gruyere:G("Gruyère","Dairy & Eggs","Gruyère (6 oz)",6.99,["Gruyère (1 lb)",2.7,10.99]),
  biscuits:G("Refrigerated biscuits","Dairy & Eggs","Refrigerated Biscuits (8 ct)",2.49,null,"costco"),
  ground_lamb:G("Ground lamb","Meat & Seafood","Ground Lamb (1 lb)",8.99,["Ground Lamb (2 lb)",2,13.99],"aldi"),
  chorizo:G("Mexican chorizo","Meat & Seafood","Pork Chorizo (9 oz)",2.49,null,"costco"),
  flank_steak:G("Flank steak","Meat & Seafood","Flank Steak (~1.5 lb)",15.99,["Flank Steak (~3 lb)",2,26.99]),
  shaved_beef:G("Shaved steak","Meat & Seafood","Shaved Beef Steak (12 oz)",7.99,null,"costco"),
  ahi_tuna:G("Sushi-grade ahi tuna","Meat & Seafood","Sushi-Grade Ahi Tuna (8 oz)",9.99,["Kirkland Wild Ahi Tuna (2 lb)",4,24.99]),
  deli_ham:G("Sliced ham","Meat & Seafood","Sliced Ham (9 oz)",3.49,["Kirkland Sliced Ham (2 x 1 lb)",3.5,12.99]),
  lemongrass:G("Lemongrass paste","Produce","Lemongrass Paste (4 oz tube)",3.49,null,"aldi,costco"),
  bean_sprouts:G("Bean sprouts","Produce","Bean Sprouts (12 oz)",1.99,null,"aldi,costco"),
  bok_choy:G("Baby bok choy","Produce","Baby Bok Choy (1 lb)",2.99,null,"costco"),
  plantains:G("Plantains","Produce","Plantains (2)",1.29,null,"costco"),
  pineapple:G("Pineapple","Produce","Whole Pineapple",2.99,["Whole Pineapple",1,2.99]),
  mint:G("Fresh mint","Produce","Fresh Mint (0.75 oz)",2.49,null,"costco"),
  basmati:G("Basmati rice","Pantry","Basmati Rice (2 lb)",3.99,["Royal Basmati Rice (15 lb)",7.5,17.99]),
  red_lentils:G("Red lentils","Pantry","Red Lentils (16 oz)",2.29,null,"costco"),
  brown_lentils:G("Brown lentils","Pantry","Brown Lentils (16 oz)",1.79,null,"costco"),
  vermicelli:G("Rice vermicelli","Pantry","Rice Vermicelli Noodles (8.8 oz)",2.49,null,"costco"),
  glass_noodles:G("Sweet potato glass noodles","Pantry","Korean Sweet Potato Glass Noodles (12 oz)",4.49,null,"tj,aldi,costco"),
  yakisoba:G("Yakisoba noodles","Pantry","Yakisoba / Chow Mein Noodles (3 x 5.6 oz)",3.49,null,"costco"),
  couscous:G("Couscous","Pantry","Couscous (10 oz)",2.49,null,"costco"),
  olives:G("Olives","Pantry","Kalamata or Green Olives (6 oz)",3.49,null),
  dried_apricots:G("Dried apricots","Pantry","Dried Apricots (6 oz)",3.29,["Kirkland Dried Apricots (3 lb)",8,12.99]),
  hominy:G("Hominy","Pantry","White Hominy (29 oz)",2.29,null,"tj,costco"),
  tahini:G("Tahini","Sauces & Spices","Tahini (16 oz)",5.99,null,"aldi"),
  fish_sauce:G("Fish sauce","Sauces & Spices","Fish Sauce (6.76 oz)",2.99,null,"aldi,costco"),
  oyster_sauce:G("Oyster sauce","Sauces & Spices","Oyster Sauce (9 oz)",2.79,null,"costco"),
  hoisin:G("Hoisin sauce","Sauces & Spices","Hoisin Sauce (8.5 oz)",2.79,null,"costco"),
  green_curry:G("Green curry paste","Sauces & Spices","Green Curry Paste (4 oz)",3.49,null,"costco"),
  jerk:G("Jerk seasoning","Sauces & Spices","Jamaican Jerk Seasoning (3 oz)",2.99,null,"costco"),
  pie_crust:G("Pie crust","Frozen","Refrigerated Pie Crusts (2 ct)",3.29,null,"costco"),
  okra:G("Frozen okra","Frozen","Frozen Cut Okra (12 oz)",1.79,null,"tj,costco"),
});
Object.assign(NUTR, {
  paneer:[1270,72,14,100,0,10,70], swiss:[860,61,3,63,0,1,430], gruyere:[700,51,1,55,0,0,570], biscuits:[1520,32,200,64,4,24,4600],
  ground_lamb:[1280,76,0,105,0,0,270], chorizo:[1160,62,5,98,0,0,3200], flank_steak:[1055,143,0,50,0,0,370], shaved_beef:[680,70,0,44,0,0,190],
  ahi_tuna:[250,55,0,1,0,0,100], deli_ham:[305,45,8,9,0,6,3000], lemongrass:[113,1,13,6,2,4,300], bean_sprouts:[100,10,20,1,6,14,20],
  bok_choy:[60,7,10,1,5,5,300], plantains:[440,5,115,1,8,54,15], pineapple:[450,5,118,1,13,89,9], mint:[5,0,1,0,1,0,3],
  basmati:[3265,64,720,6,9,0,0], red_lentils:[1625,108,272,9,50,6,30], brown_lentils:[1600,113,272,5,70,9,30], vermicelli:[900,15,200,1,4,0,50],
  glass_noodles:[1190,0,290,0,4,0,40], yakisoba:[1285,40,250,10,8,4,800], couscous:[1065,36,220,2,14,0,30], olives:[140,1,7,13,4,0,1500],
  dried_apricots:[410,6,106,1,12,90,15], hominy:[345,7,68,4,12,0,1700], tahini:[2700,77,96,243,42,2,520], fish_sauce:[70,10,7,0,0,7,14000],
  oyster_sauce:[130,3,28,0,0,20,9500], hoisin:[530,8,106,8,3,70,3800], green_curry:[110,3,15,4,4,6,5000], jerk:[150,4,30,2,6,10,9000],
  pie_crust:[2100,20,230,125,6,10,1800], okra:[100,6,22,0,8,4,20],
});

/* ------------------------------------------------------------------ v5 recipes: around the world
   m = planner facts, st = [fridge days, freezer months, storing & reheating] */
const MORE5 = [
/* ===== CHINESE ===== */
{id:"sesame-chicken",title:"Crispy Sesame Chicken",meal:"Dinner",time:35,serves:4,m:{has:["gluten","sesame","egg"],cuisine:"chinese",protein:"chicken",skill:2},
 blurb:"Takeout-style crispy chicken in a glossy, sweet-savory sesame glaze with steamed broccoli and rice.",
 ing:[["chicken_thigh",1,"1½ lb boneless thighs, in 1-inch pieces"],["eggs",0.09,"1 egg"],["soy",0.15,"¼ cup soy sauce"],["honey",0.15,"¼ cup honey"],["hoisin",0.25,"2 tbsp hoisin"],["garlic",0.1,"3 garlic cloves, grated"],["sesame",0.15,"2 tbsp sesame seeds"],["broccoli",1,"1 lb broccoli"],["jasmine_rice",0.25,"1½ cups rice"],["green_onion",0.5,"green onions"]],
 pantry:"¾ cup cornstarch, ⅓ cup oil, 2 tbsp rice vinegar, 1 tsp sesame oil, salt",
 steps:["Start the rice. Whisk the soy, honey, hoisin, vinegar, garlic, sesame oil, 1 tbsp cornstarch and ¼ cup water for the sauce.","Toss the chicken with the egg and a pinch of salt, then with the rest of the cornstarch until coated.","Shallow-fry in batches in the oil over medium-high until golden and crisp, 5 to 6 minutes. Drain on a rack. Steam the broccoli.","Pour off the oil, add the sauce to the pan and simmer, stirring, until thick and shiny, 1 to 2 minutes.","Toss the chicken in the sauce, sprinkle with sesame seeds and green onions, and serve over rice with broccoli."],
 tip:"Fry the chicken a second time for 1 minute just before saucing if you want it extra crunchy.",
 st:[3,2,"Re-crisp in a 400°F oven or air fryer for 6 to 8 minutes."]},
{id:"mongolian-beef",title:"Mongolian Beef",meal:"Dinner",time:25,serves:4,m:{has:["beef","gluten"],cuisine:"chinese",protein:"beef",skill:1},
 blurb:"Thin, lightly crisped flank steak tossed with scallions in a sticky brown-sugar, ginger and garlic soy glaze.",
 ing:[["flank_steak",1,"1½ lb flank steak, sliced thin across the grain"],["soy",0.2,"⅓ cup soy sauce"],["honey",0.15,"¼ cup brown sugar or honey"],["garlic",0.15,"5 garlic cloves, minced"],["ginger",0.25,"1-inch ginger, grated"],["green_onion",1,"1 bunch green onions, in 2-inch pieces"],["jasmine_rice",0.25,"1½ cups rice"],["broccoli",0.5,"½ lb broccoli (optional side)"]],
 pantry:"⅓ cup cornstarch, 3 tbsp oil, red pepper flakes",
 steps:["Start the rice. Toss the beef with the cornstarch until every slice is lightly coated.","Sear the beef in 2 tbsp oil over high heat in two batches, 1 to 2 minutes per side, until browned and crisp at the edges. Move to a plate.","Lower the heat. Add the remaining oil, garlic, ginger and pepper flakes for 30 seconds.","Add the soy, sugar and ⅓ cup water and simmer until syrupy, 2 minutes.","Return the beef with the green onions and toss for 1 minute. Serve over rice with broccoli."],
 tip:"Slice against the grain. Look for the lines running through the meat and cut across them, not along.",
 st:[4,2,"Reheat in a skillet with a splash of water, 3 minutes."]},
{id:"mapo-tofu",title:"Mapo Tofu",meal:"Dinner",time:25,serves:4,m:{has:["pork","gluten","spicy"],cuisine:"chinese",protein:"pork",skill:2},
 blurb:"Silky tofu in a fiery, savory Sichuan-style sauce with a little ground pork, ginger and garlic, spooned over rice.",
 ing:[["tofu",2,"28 oz soft or medium tofu, in ¾-inch cubes"],["ground_pork",0.5,"8 oz ground pork"],["chili_crisp",0.2,"3 tbsp chili crisp (or chili bean paste)"],["soy",0.1,"2 tbsp soy sauce"],["garlic",0.15,"4 garlic cloves"],["ginger",0.25,"1-inch ginger"],["chicken_broth",0.25,"1 cup broth"],["green_onion",0.5,"green onions"],["jasmine_rice",0.25,"1½ cups rice"]],
 pantry:"1 tbsp oil, 1 tbsp cornstarch, 1 tsp sugar, 1 tsp Sichuan peppercorns, ground (optional)",
 steps:["Start the rice. Slide the tofu into gently simmering salted water for 2 minutes to firm it up. Drain.","Brown the pork in the oil over medium-high until crisp, 4 minutes. Add the garlic, ginger and chili crisp for 1 minute.","Add the broth, soy and sugar and bring to a simmer.","Slide in the tofu and simmer 3 minutes without stirring hard. Push the tofu gently with the back of a spoon so it doesn't break.","Thicken with the cornstarch mixed with 2 tbsp water. Finish with Sichuan pepper and green onions. Serve over rice."],
 tip:"Swap the pork for chopped mushrooms to make it vegetarian.",
 st:[3,0,"Reheat gently in a covered pan or the microwave, stirring carefully."]},
{id:"dan-dan-noodles",title:"Dan Dan Noodles",meal:"Dinner",time:25,serves:4,m:{has:["pork","gluten","nuts","sesame","spicy"],cuisine:"chinese",protein:"pork",skill:2},
 blurb:"Springy noodles over a nutty, spicy sesame-chili sauce, topped with crispy savory pork and tender bok choy.",
 ing:[["spaghetti",0.75,"12 oz noodles (ramen, lo mein or spaghetti)"],["ground_pork",1,"1 lb ground pork"],["hoisin",0.25,"2 tbsp hoisin"],["soy",0.15,"¼ cup soy sauce"],["tahini",0.1,"3 tbsp tahini or peanut butter"],["chili_crisp",0.2,"3 tbsp chili crisp"],["garlic",0.1,"3 garlic cloves"],["bok_choy",1,"1 lb baby bok choy, halved"],["peanuts",0.1,"crushed peanuts"],["green_onion",0.5,"green onions"]],
 pantry:"1 tbsp oil, 1 tbsp rice vinegar, 1 tsp sugar",
 steps:["Brown the pork in the oil until well crisped, 8 minutes. Stir in the hoisin and 1 tbsp soy and cook 1 minute more.","Whisk the tahini, remaining soy, chili crisp, vinegar, sugar, grated garlic and 3 tbsp hot water into a sauce. Divide among bowls.","Boil the noodles, adding the bok choy for the last 2 minutes. Drain, saving a splash of water.","Add noodles and bok choy to the bowls, loosening the sauce with a little noodle water.","Top with the crispy pork, peanuts and green onions. Toss at the table."],
 tip:"Let the pork get properly crispy. The crunch is the point.",
 st:[3,2,"Store pork, sauce and noodles separately. Warm the pork, toss with fresh-boiled noodles."]},

/* ===== JAPANESE ===== */
{id:"chicken-teriyaki",title:"Chicken Teriyaki Rice Bowls",meal:"Dinner",time:25,serves:4,m:{has:["gluten","sesame"],cuisine:"japanese",protein:"chicken",skill:1},
 blurb:"Juicy pan-seared chicken thighs lacquered in a quick homemade teriyaki glaze, sliced over rice with cucumber and sesame.",
 ing:[["chicken_thigh",1,"1½ lb boneless thighs"],["soy",0.2,"⅓ cup soy sauce"],["honey",0.15,"3 tbsp honey"],["ginger",0.25,"1-inch ginger, grated"],["garlic",0.05,"1 garlic clove, grated"],["jasmine_rice",0.25,"1½ cups rice"],["cucumber",1,"1 cucumber, thinly sliced"],["broccoli",0.5,"½ lb broccoli"],["sesame",0.1,"sesame seeds"],["green_onion",0.5,"green onions"]],
 pantry:"1 tbsp oil, 2 tbsp mirin or rice vinegar, 1 tsp cornstarch",
 steps:["Start the rice. Whisk the soy, honey, mirin, ginger, garlic, cornstarch and 2 tbsp water.","Sear the chicken skin-side (or smooth-side) down in the oil over medium-high, 6 minutes, until deeply golden. Flip and cook 4 minutes more.","Pour in the sauce and simmer, turning the chicken, until glossy and thick, 2 minutes.","Steam the broccoli. Toss the cucumber with a pinch of salt and splash of vinegar.","Slice the chicken and fan it over rice with the vegetables. Spoon over the pan glaze and top with sesame and green onions."],
 tip:"Pound thick thighs to an even thickness so they cook through before the glaze burns.",
 st:[4,3,"Store chicken and rice separately. Microwave 1½ to 2 minutes."]},
{id:"gyudon",title:"Gyudon (Japanese Beef & Onion Rice Bowl)",meal:"Dinner",time:20,serves:4,m:{has:["beef","gluten","egg"],cuisine:"japanese",protein:"beef",skill:1},
 blurb:"Tender shaved beef and sweet onions simmered in a soy-dashi broth, ladled over rice with a soft egg on top.",
 ing:[["shaved_beef",1.33,"1 lb shaved steak"],["onion",0.34,"2 onions, thinly sliced"],["soy",0.2,"⅓ cup soy sauce"],["honey",0.1,"2 tbsp sugar or honey"],["chicken_broth",0.25,"1 cup broth (or dashi)"],["ginger",0.25,"1-inch ginger, julienned"],["eggs",0.34,"4 eggs"],["jasmine_rice",0.25,"1½ cups short-grain or jasmine rice"],["green_onion",0.5,"green onions"]],
 pantry:"3 tbsp mirin, pickled ginger (optional)",
 steps:["Start the rice. Simmer the broth, soy, sugar, mirin and ginger in a wide pan.","Add the onions and simmer until soft and sweet, 6 minutes.","Add the beef, separating the slices, and simmer just until no longer pink, 2 to 3 minutes. Skim any foam.","Soft-boil the eggs for 6½ minutes, or crack them into the simmering pan, cover and poach 3 minutes.","Spoon the beef, onions and plenty of broth over bowls of rice. Top with the egg and green onions."],
 tip:"Ask the butcher counter for shabu-shabu or Philly cheesesteak beef if you can't find shaved steak.",
 st:[3,2,"Store beef in its broth. Reheat on the stove and cook a fresh egg."]},
{id:"yakisoba",title:"Chicken Yakisoba",meal:"Dinner",time:20,serves:4,m:{has:["gluten"],cuisine:"japanese",protein:"chicken",skill:1},
 blurb:"Japanese street-fair stir-fried noodles with chicken, cabbage and carrots in a tangy-sweet yakisoba sauce.",
 ing:[["yakisoba",1,"3 packs yakisoba or chow mein noodles"],["chicken_breast",0.5,"12 oz chicken breast, thinly sliced"],["coleslaw",0.75,"3 cups shredded cabbage (coleslaw mix)"],["onion",0.17,"1 onion, sliced"],["carrots",0.15,"1 carrot, in matchsticks"],["soy",0.1,"2 tbsp soy sauce"],["oyster_sauce",0.25,"2 tbsp oyster sauce"],["green_onion",0.5,"green onions"]],
 pantry:"2 tbsp Worcestershire, 2 tbsp ketchup, 1 tsp sugar, 2 tbsp oil",
 steps:["Whisk the Worcestershire, oyster sauce, soy, ketchup and sugar for the sauce.","Loosen the noodles by rinsing under hot water. Drain well.","Stir-fry the chicken in 1 tbsp oil over high heat until cooked, 4 minutes. Add the onion and carrot for 2 minutes, then the cabbage for 1 minute.","Add the remaining oil and the noodles and toss until hot and lightly browned, 2 minutes.","Add the sauce and toss until every strand is coated. Top with green onions."],
 tip:"Finish with a squiggle of mayo and a pinch of red pickled ginger for the street-food version.",
 st:[3,0,"Reheat in a skillet with a splash of water, tossing, 3 minutes."]},

/* ===== KOREAN ===== */
{id:"bibimbap",title:"Beef Bibimbap",meal:"Dinner",time:35,serves:4,m:{has:["beef","egg","gluten","sesame","spicy"],cuisine:"korean",protein:"beef",skill:2},
 blurb:"Rice topped with savory beef, sesame spinach, carrots, bean sprouts and cucumber, a fried egg and sweet-spicy gochujang sauce. Mix it all up.",
 ing:[["ground_beef",1,"1 lb ground beef"],["soy",0.15,"3 tbsp soy sauce"],["honey",0.05,"1 tbsp honey"],["garlic",0.15,"4 garlic cloves"],["spinach",0.6,"5 oz spinach"],["carrots",0.25,"2 carrots, in matchsticks"],["bean_sprouts",1,"12 oz bean sprouts"],["cucumber",1,"1 cucumber"],["eggs",0.34,"4 eggs"],["gochujang",0.15,"3 tbsp gochujang"],["jasmine_rice",0.25,"1½ cups short-grain rice"],["sesame",0.1,"sesame seeds"]],
 pantry:"2 tbsp sesame oil, 1 tbsp rice vinegar, 1 tsp sugar, 1 tbsp oil, salt",
 steps:["Cook the rice. Stir the gochujang with 1 tbsp sesame oil, the vinegar, sugar and 1 tbsp water for the sauce.","Brown the beef with half the garlic, then add the soy and honey and cook until glazy.","Blanch the bean sprouts 1 minute and the spinach 20 seconds. Squeeze dry and season each with sesame oil, garlic and salt. Sauté the carrots 2 minutes.","Fry the eggs sunny-side up. Slice the cucumber.","Arrange everything in sections over the rice, top with the egg, sesame and a big spoon of sauce. Mix before eating."],
 tip:"Use a hot cast-iron or stone bowl with a little sesame oil for crispy rice on the bottom (dolsot style).",
 st:[3,0,"Store components separately. Microwave the rice and beef, add cold veg and a fresh egg."]},
{id:"kimchi-fried-rice",title:"Kimchi Fried Rice with Fried Eggs",meal:"Dinner",time:20,serves:4,m:{has:["egg","gluten","sesame","spicy","pork"],cuisine:"korean",protein:"pork",skill:1},
 blurb:"Day-old rice fried with tangy kimchi, crispy bacon and gochujang, topped with runny-yolk fried eggs.",
 ing:[["jasmine_rice",0.25,"4 cups cooked day-old rice"],["kimchi",1,"1½ cups kimchi, chopped, plus 3 tbsp juice"],["bacon",0.5,"6 slices bacon (or Spam), chopped"],["gochujang",0.1,"1 to 2 tbsp gochujang"],["eggs",0.34,"4 eggs"],["green_onion",0.5,"4 green onions"],["sesame",0.05,"sesame seeds"]],
 pantry:"1 tbsp butter, 1 tsp sesame oil, 1 tbsp soy sauce",
 steps:["Cook the bacon until crisp in a large skillet. Leave the fat in the pan.","Add the kimchi and cook 3 minutes until it starts to caramelize.","Add the rice, kimchi juice, gochujang and soy and toss over high heat, pressing the rice into the pan to crisp, 5 minutes.","Stir in the butter, sesame oil and most of the green onions.","Fry the eggs and serve on top with sesame and the rest of the green onions."],
 tip:"Older, sour kimchi makes the best fried rice.",
 st:[4,2,"Reheat in a hot skillet. Fry a fresh egg."]},
{id:"japchae",title:"Japchae (Korean Glass Noodles)",meal:"Dinner",time:35,serves:4,m:{has:["beef","gluten","sesame"],cuisine:"korean",protein:"beef",skill:2},
 blurb:"Chewy sweet-potato glass noodles stir-fried with beef, spinach, carrots, peppers and onions in a sweet sesame-soy sauce.",
 ing:[["glass_noodles",0.67,"8 oz sweet potato glass noodles"],["shaved_beef",0.67,"8 oz shaved steak"],["spinach",0.6,"5 oz spinach"],["carrots",0.15,"1 carrot, in matchsticks"],["bell_peppers",0.34,"1 bell pepper, sliced"],["onion",0.17,"1 onion, sliced"],["soy",0.2,"⅓ cup soy sauce"],["honey",0.1,"2 tbsp sugar or honey"],["garlic",0.15,"4 garlic cloves"],["sesame",0.1,"sesame seeds"]],
 pantry:"3 tbsp sesame oil, 1 tbsp oil",
 steps:["Boil the noodles 6 minutes, drain, rinse and snip into shorter lengths. Toss with 1 tbsp sesame oil.","Whisk the soy, sugar, garlic and 1 tbsp sesame oil. Marinate the beef in 2 tbsp of it.","Stir-fry the vegetables one at a time in a little oil, lightly salting each, and set aside. Wilt the spinach last.","Stir-fry the beef until browned, 2 minutes.","Toss everything with the noodles and remaining sauce over low heat until glossy. Finish with sesame oil and seeds."],
 tip:"Japchae is great at room temperature, so it's perfect for lunches.",
 st:[4,0,"Microwave 1 to 2 minutes or eat at room temperature."]},

/* ===== THAI ===== */
{id:"green-curry-chicken",title:"Thai Green Curry Chicken",meal:"Dinner",time:30,serves:4,m:{has:["spicy","fish"],cuisine:"thai",protein:"chicken",skill:1,lc:1},
 blurb:"Fragrant green curry with tender chicken, bell peppers and green beans in coconut milk, finished with basil and lime.",
 ing:[["chicken_thigh",1,"1½ lb boneless thighs, sliced"],["green_curry",0.75,"3 tbsp green curry paste"],["coconut_milk",2,"2 cans coconut milk"],["bell_peppers",0.34,"1 red bell pepper, sliced"],["green_beans",0.67,"8 oz green beans, halved"],["fish_sauce",0.1,"1½ tbsp fish sauce"],["basil",1,"a big handful of basil"],["lime",0.25,"2 limes"],["jasmine_rice",0.25,"1½ cups jasmine rice"]],
 pantry:"1 tbsp oil, 1 tbsp brown sugar",
 steps:["Start the rice. Fry the curry paste in the oil with a few spoons of the thick coconut cream for 2 minutes, until fragrant.","Add the chicken and stir to coat, 2 minutes.","Add the rest of the coconut milk, the fish sauce and sugar. Simmer 8 minutes.","Add the green beans and peppers and simmer 4 minutes more until crisp-tender.","Stir in the basil and lime juice. Taste for salt. Serve over rice."],
 tip:"Start with 2 tbsp paste and add more after tasting. Brands vary wildly in heat.",
 st:[4,3,"Store curry and rice separately. Reheat on the stove."]},
{id:"thai-basil-chicken",title:"Thai Basil Chicken (Pad Krapow)",meal:"Dinner",time:15,serves:4,m:{has:["gluten","spicy","egg","fish"],cuisine:"thai",protein:"chicken",skill:1},
 blurb:"Bangkok's favorite fast dinner: minced chicken stir-fried with chilies, garlic and lots of basil, served over rice with a crispy fried egg.",
 ing:[["chicken_thigh",1,"1½ lb boneless thighs, finely chopped (or ground chicken)"],["garlic",0.2,"8 garlic cloves"],["jalapeno",0.67,"2 jalapeños or Thai chilies, sliced"],["oyster_sauce",0.25,"2 tbsp oyster sauce"],["soy",0.1,"1 tbsp soy sauce"],["fish_sauce",0.05,"1 tbsp fish sauce"],["basil",2,"2 big handfuls basil"],["eggs",0.34,"4 eggs"],["jasmine_rice",0.25,"1½ cups jasmine rice"]],
 pantry:"3 tbsp oil, 2 tsp sugar",
 steps:["Start the rice. Pound or finely chop the garlic and chilies together.","Fry the eggs in 2 tbsp very hot oil until the edges are crispy. Set aside.","Stir-fry the garlic and chilies in the remaining oil for 20 seconds, then add the chicken and cook over high heat until no longer pink, 4 minutes.","Add the oyster sauce, soy, fish sauce, sugar and 2 tbsp water and toss until glossy.","Turn off the heat and stir in the basil until just wilted. Serve over rice with a fried egg."],
 tip:"Hand-chopping thighs gives a juicier, chunkier texture than ground chicken.",
 st:[3,2,"Reheat in a skillet. Fry a fresh egg."]},
{id:"drunken-noodles",title:"Drunken Noodles (Pad Kee Mao)",meal:"Dinner",time:30,serves:4,m:{has:["gluten","spicy","egg","fish"],cuisine:"thai",protein:"chicken",skill:2},
 blurb:"Wide, chewy rice noodles wok-tossed with chicken, peppers, chilies and basil in a bold, savory-sweet sauce.",
 ing:[["rice_noodles",0.6,"8 oz wide rice noodles"],["chicken_breast",0.67,"1 lb chicken, thinly sliced"],["bell_peppers",0.67,"2 bell peppers, sliced"],["onion",0.17,"1 onion, sliced"],["garlic",0.2,"6 garlic cloves"],["jalapeno",0.34,"1 to 2 chilies"],["oyster_sauce",0.33,"3 tbsp oyster sauce"],["soy",0.15,"3 tbsp soy sauce"],["fish_sauce",0.05,"1 tbsp fish sauce"],["eggs",0.17,"2 eggs"],["basil",1,"a big handful of basil"]],
 pantry:"3 tbsp oil, 1 tbsp brown sugar",
 steps:["Soak the noodles in hot water until pliable, about 20 minutes. Drain.","Mix the oyster sauce, soy, fish sauce, sugar and 2 tbsp water.","Stir-fry the garlic and chilies in the oil for 20 seconds, then the chicken until cooked, 4 minutes. Push aside and scramble the eggs.","Add the onion and peppers for 2 minutes, then the noodles and sauce. Toss with tongs until the noodles are tender and caramelized at the edges, 3 minutes.","Fold in the basil and serve right away."],
 tip:"Don't overcrowd the pan. Cook in two batches if your skillet is small.",
 st:[3,0,"Reheat in a skillet with a splash of water."]},

/* ===== VIETNAMESE ===== */
{id:"chicken-pho",title:"30-Minute Chicken Pho",meal:"Dinner",time:40,serves:4,m:{has:["fish"],cuisine:"vietnamese",protein:"chicken",skill:2},
 blurb:"A shortcut pho with real depth: broth simmered with charred onion, ginger and warm spices, poured over rice noodles and chicken with all the fresh herbs.",
 ing:[["chicken_breast",0.67,"1 lb chicken breast"],["chicken_broth",2,"8 cups chicken broth"],["onion",0.17,"1 onion, halved"],["ginger",0.5,"3-inch ginger, halved"],["fish_sauce",0.15,"3 tbsp fish sauce"],["rice_noodles",0.6,"8 oz flat rice noodles"],["bean_sprouts",1,"bean sprouts"],["basil",1,"basil (Thai basil if you can)"],["cilantro",0.5,"cilantro"],["lime",0.25,"limes"],["jalapeno",0.34,"jalapeño, sliced"]],
 pantry:"3 star anise, 1 cinnamon stick, 4 cloves, 1 tsp coriander seed, 1 tbsp sugar, hoisin and sriracha to serve",
 steps:["Char the onion and ginger cut-side down in a dry pot over high heat until blackened in spots, 5 minutes.","Toast the spices for 1 minute, then add the broth, fish sauce and sugar. Add the chicken and simmer gently 15 minutes until cooked. Remove and shred the chicken.","Simmer the broth 10 minutes more, then strain and season with fish sauce.","Cook the noodles per the package and divide among big bowls with the chicken.","Ladle over the boiling-hot broth. Serve with sprouts, herbs, lime, chilies, hoisin and sriracha."],
 tip:"The broth must be at a hard boil when you pour it so it warms the noodles and chicken.",
 st:[4,3,"Store broth, noodles and chicken separately. Freeze just the broth."]},
{id:"vermicelli-bowls",title:"Lemongrass Pork Vermicelli Bowls (Bún Thịt Nướng)",meal:"Lunch",time:35,serves:4,m:{has:["fish","nuts"],cuisine:"vietnamese",protein:"pork",skill:2,lc:0},
 blurb:"Caramelized lemongrass pork over cool rice noodles, crisp lettuce, cucumber, pickled carrots and herbs, all drenched in nuoc cham.",
 ing:[["pork_tenderloin",1,"1¼ lb pork tenderloin or shoulder, thinly sliced"],["lemongrass",0.5,"2 tbsp lemongrass paste"],["fish_sauce",0.25,"¼ cup fish sauce, divided"],["honey",0.1,"2 tbsp honey or brown sugar"],["garlic",0.15,"4 garlic cloves"],["vermicelli",1,"8.8 oz rice vermicelli"],["romaine",0.34,"1 romaine heart, shredded"],["cucumber",1,"1 cucumber, in matchsticks"],["carrots",0.25,"2 carrots, shredded"],["mint",1,"mint and cilantro"],["lime",0.25,"2 limes"],["peanuts",0.1,"crushed peanuts"]],
 pantry:"Nuoc cham: ½ cup warm water, 3 tbsp sugar, 1 chili. Plus 1 tbsp oil, ¼ cup vinegar",
 steps:["Marinate the pork with the lemongrass, 2 tbsp fish sauce, honey, half the garlic and the oil for 20 minutes.","Quick-pickle the carrots in the vinegar with a pinch of sugar and salt.","Make nuoc cham: stir the water, sugar, 2 tbsp fish sauce, juice of 2 limes, remaining garlic and sliced chili.","Cook the vermicelli 3 minutes, rinse in cold water and drain well. Grill or sear the pork over high heat until charred, 2 minutes per side.","Build bowls: lettuce, noodles, cucumber, pickled carrots, herbs and pork. Top with peanuts and pour over the nuoc cham."],
 tip:"Nuoc cham keeps a week in the fridge. Make a double batch.",
 st:[4,3,"Pack pork, noodles, veg and sauce separately. Eat cold or warm the pork."]},

/* ===== INDIAN ===== */
{id:"tikka-masala",title:"Chicken Tikka Masala",meal:"Dinner",time:45,serves:4,m:{has:["dairy","gluten"],cuisine:"indian",protein:"chicken",skill:2},
 blurb:"Yogurt-spiced chicken charred under the broiler, then simmered in a creamy, smoky, deeply spiced tomato masala.",
 ing:[["chicken_thigh",1,"1½ lb boneless thighs, in chunks"],["greek_yogurt",0.15,"½ cup Greek yogurt"],["garam_masala",0.4,"4 tsp garam masala, divided"],["onion",0.34,"2 onions, finely diced"],["garlic",0.2,"6 garlic cloves"],["ginger",0.5,"2-inch ginger"],["crushed_tomatoes",1,"28 oz crushed tomatoes"],["heavy_cream",0.5,"1 cup heavy cream"],["basmati",0.25,"1½ cups basmati rice"],["naan",1,"naan"],["cilantro",0.5,"cilantro"]],
 pantry:"3 tbsp butter or oil, 2 tsp smoked paprika, 2 tsp cumin, 1 tsp turmeric, 1 tsp chili powder, 1 tsp sugar, salt",
 steps:["Marinate the chicken in the yogurt, 2 tsp garam masala, half the garlic and ginger, the chili powder and 1 tsp salt for at least 20 minutes.","Spread on a foil-lined pan and broil 8 to 10 minutes until charred in spots. Start the rice.","Cook the onions in the butter until deep golden, 12 minutes. Add the rest of the garlic, ginger and spices for 1 minute.","Add the tomatoes and sugar and simmer 15 minutes until thick and brick-red. Stir in the cream.","Add the chicken and its juices and simmer 5 minutes. Season, scatter with cilantro and serve with rice and naan."],
 tip:"Browning the onions properly gives the sauce its body and sweetness.",
 st:[4,3,"Store curry and rice separately. Reheat on the stove."]},
{id:"chicken-biryani",title:"One-Pot Chicken Biryani",meal:"Dinner",time:60,serves:6,m:{has:["dairy"],cuisine:"indian",protein:"chicken",skill:3},
 blurb:"Fragrant basmati layered with spiced yogurt-marinated chicken and crispy fried onions, steamed together so every grain is perfumed.",
 ing:[["chicken_thigh",1,"1½ lb bone-in or boneless thighs"],["greek_yogurt",0.25,"1 cup Greek yogurt"],["onion",0.5,"3 onions, thinly sliced"],["garlic",0.2,"6 garlic cloves"],["ginger",0.5,"2-inch ginger"],["garam_masala",0.5,"2 tbsp garam masala"],["basmati",0.34,"2 cups basmati, soaked 20 minutes"],["mint",1,"mint"],["cilantro",1,"cilantro"],["lemon",0.17,"1 lemon"],["chicken_broth",0.25,"1 cup broth"]],
 pantry:"⅓ cup oil or ghee, 2 tsp chili powder, 1 tsp turmeric, 4 green cardamom, 2 bay leaves, 1 cinnamon stick, salt, pinch of saffron in 2 tbsp warm milk (optional)",
 steps:["Marinate the chicken with the yogurt, garlic, ginger, garam masala, chili, turmeric, lemon juice and 1½ tsp salt for 30 minutes.","Fry the onions in the oil in a Dutch oven until deep brown and crisp, 15 minutes. Remove half for topping.","Add the chicken and marinade to the pot and cook 10 minutes, until it's nearly done.","Meanwhile boil the soaked rice with the whole spices and salt for 5 minutes until 70% cooked. Drain.","Layer the rice over the chicken with mint, cilantro and the saffron milk. Pour over the broth, cover tightly and cook on the lowest heat 20 minutes. Rest 10 minutes, then fluff and top with the crispy onions."],
 tip:"A tight seal matters. Put a sheet of foil under the lid to trap the steam.",
 st:[4,3,"Sprinkle with water and reheat covered in the microwave or a low oven."]},
{id:"dal-tadka",title:"Dal Tadka (Spiced Red Lentils)",meal:"Dinner",time:35,serves:4,m:{has:["dairy"],cuisine:"indian",protein:"veg",skill:1},
 blurb:"Creamy, soothing red lentils finished with a sizzling tadka of butter, garlic, cumin and chili poured over at the table.",
 ing:[["red_lentils",0.6,"1½ cups red lentils, rinsed"],["onion",0.17,"1 onion, diced"],["roma_tomatoes",0.5,"2 tomatoes, chopped"],["garlic",0.2,"6 garlic cloves, sliced"],["ginger",0.25,"1-inch ginger"],["jalapeno",0.34,"1 green chili"],["butter",0.05,"2 tbsp butter or ghee"],["cilantro",0.5,"cilantro"],["lemon",0.17,"1 lemon"],["basmati",0.25,"1½ cups basmati rice"]],
 pantry:"1 tsp turmeric, 2 tsp cumin seeds, ½ tsp chili flakes, 1 tbsp oil, salt",
 steps:["Simmer the lentils with 4 cups water, the turmeric and 1 tsp salt until soft and creamy, 20 minutes, whisking now and then. Start the rice.","Cook the onion, ginger and chili in the oil until golden, then add the tomatoes and cook to a jammy paste. Stir into the lentils.","Simmer 5 minutes, thinning with water to a pourable consistency. Season with lemon.","For the tadka, heat the butter until foaming and add the cumin seeds, sliced garlic and chili flakes. Sizzle until the garlic is golden.","Pour the sizzling tadka over the dal, top with cilantro and serve with rice."],
 tip:"Cheap, high-fiber and freezer-friendly. One of the best budget dinners there is.",
 st:[5,3,"Thickens as it sits. Reheat with a splash of water."]},
{id:"palak-paneer",title:"Palak Paneer",meal:"Dinner",time:35,serves:4,m:{has:["dairy","gluten"],cuisine:"indian",protein:"veg",skill:2,lc:1},
 blurb:"Golden pan-seared paneer cubes in a vivid, creamy spiced spinach sauce. Serve with naan or basmati.",
 ing:[["paneer",1,"14 oz paneer, cubed"],["spinach",1.6,"1 lb spinach"],["onion",0.17,"1 onion"],["garlic",0.15,"4 garlic cloves"],["ginger",0.25,"1-inch ginger"],["jalapeno",0.34,"1 green chili"],["roma_tomatoes",0.25,"1 tomato"],["heavy_cream",0.15,"¼ cup cream"],["garam_masala",0.2,"2 tsp garam masala"],["naan",1,"naan or rice"]],
 pantry:"2 tbsp butter or ghee, 1 tsp cumin, ½ tsp turmeric, salt",
 steps:["Blanch the spinach 1 minute, plunge into ice water, then blend smooth with the chili and a splash of water.","Sear the paneer in 1 tbsp butter until golden on two sides. Set aside.","Cook the onion in the remaining butter until golden. Add the garlic, ginger, tomato and spices and cook 4 minutes.","Add the spinach purée and simmer gently 5 minutes. Season with salt.","Stir in the cream and paneer and warm through. Serve with naan."],
 tip:"Ice-bathing the spinach keeps the sauce bright green instead of army green.",
 st:[3,2,"Reheat gently on low. Add a splash of water or cream."]},

/* ===== MIDDLE EASTERN ===== */
{id:"falafel-pitas",title:"Crispy Baked Falafel Pitas",meal:"Dinner",time:40,serves:4,m:{has:["gluten","sesame"],cuisine:"middleeastern",protein:"veg",skill:2},
 blurb:"Herby, golden falafel (from canned chickpeas) stuffed into warm pitas with tahini sauce, tomatoes, cucumbers and pickled onions.",
 ing:[["chickpeas",2,"2 cans chickpeas, drained and patted very dry"],["parsley",1,"1 bunch parsley"],["cilantro",1,"1 bunch cilantro"],["onion",0.17,"½ onion"],["garlic",0.15,"4 garlic cloves"],["tahini",0.2,"½ cup tahini"],["lemon",0.34,"2 lemons"],["pita",0.67,"4 pitas"],["roma_tomatoes",0.5,"2 tomatoes"],["cucumber",1,"1 cucumber"]],
 pantry:"⅓ cup flour, 2 tsp cumin, 1 tsp coriander, 1 tsp baking powder, ¼ cup olive oil, salt",
 steps:["Heat the oven to 425°F with an oiled sheet pan inside.","Pulse the chickpeas, herbs, onion, garlic, cumin, coriander and 1 tsp salt in a food processor until finely chopped but not pasty. Stir in the flour and baking powder.","Shape into 16 small patties and lay on the hot pan. Brush with oil and bake 25 minutes, flipping halfway, until crisp.","Whisk the tahini with the juice of 1 lemon, a little garlic, salt and cold water until creamy and pourable.","Stuff warm pitas with falafel, tomatoes, cucumber and tahini sauce."],
 tip:"Dry chickpeas are key. Wet ones make mushy falafel.",
 st:[4,3,"Re-crisp falafel at 400°F for 8 minutes. Keep sauce separate."]},
{id:"beef-kofta",title:"Beef Kofta with Herbed Rice & Tzatziki",meal:"Dinner",time:35,serves:4,m:{has:["beef","dairy","gluten"],cuisine:"middleeastern",protein:"beef",skill:1},
 blurb:"Juicy grilled skewers of spiced ground beef and onion with cool tzatziki, warm pita and a bright tomato-cucumber salad.",
 ing:[["ground_beef",1.5,"1½ lb ground beef (or half lamb)"],["onion",0.17,"1 onion, grated"],["parsley",1,"1 bunch parsley"],["garlic",0.15,"4 garlic cloves"],["tzatziki",1,"12 oz tzatziki"],["basmati",0.25,"1½ cups rice"],["pita",0.67,"4 pitas"],["cherry_tomatoes",1,"1 pint tomatoes"],["cucumber",1,"1 cucumber"],["lemon",0.17,"1 lemon"]],
 pantry:"2 tsp cumin, 2 tsp paprika, 1 tsp coriander, ½ tsp cinnamon, 1½ tsp salt, olive oil",
 steps:["Squeeze the grated onion dry. Mix with the beef, half the parsley (chopped), garlic, spices and salt. Don't overmix.","Shape into 12 long ovals around skewers or into logs.","Grill or broil 4 minutes per side until charred and cooked through. Cook the rice and stir in chopped parsley and lemon zest.","Toss the tomatoes and cucumber with olive oil, lemon juice and salt.","Serve kofta over rice with tzatziki, salad and warm pita."],
 tip:"Chill the shaped kofta 15 minutes so they hold on the skewers.",
 st:[4,3,"Reheat kofta in a skillet or microwave. Keep tzatziki cold."]},
{id:"mujadara",title:"Mujadara (Lentils & Rice with Crispy Onions)",meal:"Dinner",time:50,serves:5,m:{has:["dairy"],cuisine:"middleeastern",protein:"veg",skill:1},
 blurb:"The Levant's beloved comfort food: cumin-scented lentils and rice under a heap of sweet, crispy fried onions, with yogurt and a chopped salad.",
 ing:[["brown_lentils",0.5,"1 cup brown lentils"],["basmati",0.2,"1 cup basmati rice"],["onion",0.67,"4 onions, thinly sliced"],["greek_yogurt",0.25,"1 cup Greek yogurt"],["cucumber",1,"1 cucumber"],["roma_tomatoes",0.5,"2 tomatoes"],["parsley",0.5,"parsley"],["lemon",0.17,"1 lemon"]],
 pantry:"½ cup olive oil, 2 tsp cumin, 1 tsp allspice, salt",
 steps:["Simmer the lentils in salted water for 15 minutes, until just tender. Drain.","Fry the onions in the oil over medium-high, stirring often, until deep brown and crisp, 20 to 25 minutes. Drain on paper towels, keeping the oil.","In the same pot, toast the rice and spices in 2 tbsp onion oil for 1 minute. Add the lentils, 2 cups water and 1 tsp salt. Cover and simmer 15 minutes, then rest 10.","Chop the cucumber, tomatoes and parsley with lemon and olive oil.","Fluff the mujadara and pile the crispy onions on top. Serve with yogurt and salad."],
 tip:"Toss the onions with a tablespoon of cornstarch before frying for extra-crunchy results.",
 st:[5,3,"Microwave with a splash of water. Store crispy onions separately so they stay crunchy."]},
{id:"turkish-eggs",title:"Turkish Eggs (Çılbır)",meal:"Breakfast",time:15,serves:2,m:{has:["egg","dairy","gluten"],cuisine:"middleeastern",protein:"egg",skill:2},
 blurb:"Silky poached eggs over garlicky whipped yogurt, drizzled with sizzling chili-paprika butter. Bring crusty bread for dipping.",
 ing:[["eggs",0.34,"4 eggs"],["greek_yogurt",0.25,"1 cup Greek yogurt, room temperature"],["garlic",0.05,"1 small garlic clove, grated"],["butter",0.05,"2 tbsp butter"],["smoked_paprika",0.05,"1 tsp paprika or Aleppo pepper"],["parsley",0.3,"dill or parsley"],["sourdough",0.25,"4 slices sourdough, toasted"]],
 pantry:"½ tsp chili flakes, 1 tbsp vinegar, salt",
 steps:["Stir the yogurt with the garlic and a pinch of salt and spread onto two plates.","Bring a pan of water to a bare simmer with the vinegar.","Swirl the water and slide in the eggs one at a time. Poach 3 minutes until the whites are set. Lift out with a slotted spoon.","Melt the butter until foaming and stir in the paprika and chili flakes.","Set the eggs on the yogurt, spoon over the chili butter and herbs, and serve with toast."],
 tip:"Room-temperature yogurt is the trick. Cold yogurt chills the eggs.",
 st:[0,0,"Best made fresh."]},

/* ===== MEDITERRANEAN & GREEK ===== */
{id:"pork-souvlaki",title:"Pork Souvlaki Pitas",meal:"Dinner",time:35,serves:4,m:{has:["dairy","gluten"],cuisine:"mediterranean",protein:"pork",skill:1},
 blurb:"Lemon-oregano marinated pork skewers grilled until charred, wrapped in warm pita with tzatziki, tomatoes, onion and fries or salad.",
 ing:[["pork_tenderloin",1,"1¼ lb pork tenderloin, in 1-inch cubes"],["lemon",0.34,"2 lemons"],["garlic",0.15,"4 garlic cloves"],["pita",0.67,"4 pitas"],["tzatziki",1,"12 oz tzatziki"],["roma_tomatoes",0.5,"2 tomatoes, sliced"],["onion",0.1,"½ red onion, sliced"],["romaine",0.34,"lettuce"]],
 pantry:"¼ cup olive oil, 1 tbsp dried oregano, 1 tsp paprika, salt, pepper",
 steps:["Toss the pork with the oil, juice of 1 lemon, garlic, oregano, paprika, 1 tsp salt and pepper. Marinate 20 minutes or up to a day.","Thread onto skewers.","Grill or broil 10 to 12 minutes, turning, until charred and just cooked through.","Warm the pitas on the grill.","Fill pitas with pork, tzatziki, tomatoes, onion and lettuce. Squeeze over lemon."],
 tip:"Soak wooden skewers 20 minutes so they don't burn.",
 st:[4,3,"Reheat pork in a skillet. Build pitas fresh."]},
{id:"greek-lemon-chicken",title:"Greek Lemon Chicken & Potatoes",meal:"Dinner",time:60,serves:4,m:{has:[],cuisine:"mediterranean",protein:"chicken",skill:1},
 blurb:"Crispy-skinned chicken thighs roasted over potato wedges that soak up a bright lemon, garlic and oregano broth.",
 ing:[["chicken_thigh",1.33,"2 lb bone-in chicken thighs (or boneless)"],["baby_potatoes",1.5,"2 lb potatoes, in wedges"],["lemon",0.5,"3 lemons"],["garlic",0.2,"6 garlic cloves"],["chicken_broth",0.2,"¾ cup broth"],["olives",0.5,"olives (optional)"],["feta",0.5,"feta, to serve"],["parsley",0.5,"parsley"]],
 pantry:"¼ cup olive oil, 1 tbsp dried oregano, 1½ tsp salt, pepper",
 steps:["Heat the oven to 425°F. Whisk the oil, juice of 2 lemons, garlic, oregano, salt and pepper.","Toss the potatoes with half the mixture in a roasting pan and pour in the broth.","Coat the chicken with the rest and nestle on top of the potatoes, skin-side up.","Roast 45 to 50 minutes, basting once, until the chicken is golden and the potatoes are tender and browned at the edges.","Scatter with olives, feta, parsley and lemon wedges."],
 tip:"If the pan dries out, add a splash more broth. You want a little lemony sauce at the end.",
 st:[4,3,"Reheat at 375°F for 15 minutes to re-crisp."]},
{id:"greek-salad-chicken",title:"Greek Salad with Grilled Chicken",meal:"Lunch",time:25,serves:4,m:{has:["dairy"],cuisine:"mediterranean",protein:"chicken",skill:1,lc:1},
 blurb:"A big, crunchy horiatiki-style salad of tomatoes, cucumber, peppers, olives and feta with lemon-oregano chicken.",
 ing:[["chicken_breast",1,"1½ lb chicken breasts"],["romaine",0.67,"2 romaine hearts"],["cherry_tomatoes",1,"1 pint tomatoes"],["cucumber",1,"1 cucumber"],["bell_peppers",0.34,"1 green pepper"],["onion",0.1,"½ red onion"],["olives",1,"kalamata olives"],["feta",1,"6 oz feta"],["lemon",0.34,"2 lemons"]],
 pantry:"⅓ cup olive oil, 2 tbsp red wine vinegar, 2 tsp oregano, salt, pepper",
 steps:["Marinate the chicken in 2 tbsp oil, juice of 1 lemon, oregano and salt for 10 minutes.","Grill or sear 5 to 6 minutes per side until cooked. Rest and slice.","Chop the lettuce, tomatoes, cucumber, pepper and onion.","Whisk the remaining oil with the vinegar, lemon juice, oregano, salt and pepper.","Toss the salad with dressing and olives, top with feta and chicken."],
 tip:"Pack dressing separately for lunches and the salad stays crunchy for days.",
 st:[3,0,"Keep dressing separate. Chicken is great cold."]},

/* ===== CARIBBEAN & LATIN ===== */
{id:"jerk-chicken",title:"Jerk Chicken with Rice & Peas",meal:"Dinner",time:55,serves:4,m:{has:["spicy"],cuisine:"caribbean",protein:"chicken",skill:2},
 blurb:"Smoky, fiery jerk-marinated chicken charred until sticky, with coconut rice and beans and sweet fried plantains.",
 ing:[["chicken_thigh",1.33,"2 lb chicken thighs"],["jerk",0.67,"2 tbsp jerk seasoning"],["lime",0.25,"2 limes"],["green_onion",1,"1 bunch green onions"],["garlic",0.15,"4 garlic cloves"],["jalapeno",0.34,"1 scotch bonnet or jalapeño"],["basmati",0.25,"1½ cups long-grain rice"],["kidney_beans",1,"1 can kidney beans"],["coconut_milk",1,"1 can coconut milk"],["plantains",1,"2 ripe plantains"]],
 pantry:"2 tbsp soy sauce, 2 tbsp brown sugar, 1 tsp allspice, 1 tsp thyme, 3 tbsp oil, salt",
 steps:["Blend the jerk seasoning, lime juice, half the green onions, garlic, chili, soy, sugar, allspice, thyme and 1 tbsp oil. Rub over the chicken and marinate at least 1 hour or overnight.","Roast at 425°F for 30 minutes, then broil 3 to 5 minutes until charred.","For rice and peas: simmer the coconut milk, beans with their liquid, rice, thyme, remaining green onions, 1 tsp salt and 1 cup water. Cover and cook on low 20 minutes.","Slice the plantains on a diagonal and fry in 2 tbsp oil until caramelized, 2 to 3 minutes per side.","Serve the chicken with rice and peas, plantains and lime wedges."],
 tip:"Use very ripe, nearly black plantains. They're the sweetest.",
 st:[4,3,"Reheat chicken at 375°F for 15 minutes. Microwave rice with a splash of water."]},
{id:"cuban-mojo-pork",title:"Cuban Mojo Pork with Black Beans & Plantains",meal:"Dinner",time:210,serves:6,m:{has:[],cuisine:"caribbean",protein:"pork",skill:1},
 blurb:"Pork shoulder marinated in garlicky sour-orange mojo, slow-roasted until tender and crisped, served with black beans, rice and plantains.",
 ing:[["pork_shoulder",1,"3 lb pork shoulder"],["oranges",0.34,"2 oranges"],["lime",0.5,"4 limes"],["garlic",0.33,"1 head garlic"],["cilantro",1,"cilantro"],["onion",0.17,"1 onion"],["black_beans",2,"2 cans black beans"],["basmati",0.34,"2 cups white rice"],["plantains",1,"2 ripe plantains"]],
 pantry:"¼ cup olive oil, 2 tsp cumin, 2 tsp oregano, 2 tsp salt, 2 tbsp oil for frying",
 steps:["Blend the orange and lime juices, garlic, cilantro stems, oil, cumin, oregano and salt into mojo. Marinate the pork in half of it for at least 2 hours or overnight.","Roast covered at 325°F for 3 hours until fork-tender. Shred, toss with juices and broil until crisp at the edges.","Simmer the black beans with the sautéed onion, cumin and a splash of the remaining mojo for 10 minutes.","Cook the rice. Fry the sliced plantains until caramelized.","Serve the pork with rice, beans and plantains, with the reserved mojo for spooning over."],
 tip:"Leftovers make perfect Cuban sandwiches with ham, Swiss, pickles and mustard.",
 st:[5,4,"Reheat pork with its juices, then crisp in a hot skillet."]},
{id:"arroz-con-pollo",title:"Arroz con Pollo",meal:"Dinner",time:55,serves:6,m:{has:[],cuisine:"caribbean",protein:"chicken",skill:1},
 blurb:"Latin one-pot comfort: seared chicken and saffron-yellow rice simmered with sofrito, peppers, peas and olives.",
 ing:[["chicken_thigh",1.33,"2 lb chicken thighs"],["onion",0.17,"1 onion"],["bell_peppers",0.67,"2 bell peppers"],["garlic",0.15,"4 garlic cloves"],["crushed_tomatoes",0.25,"1 cup tomato sauce or crushed tomatoes"],["basmati",0.34,"2 cups long-grain rice"],["chicken_broth",0.75,"3 cups broth"],["frozen_veg",0.5,"1 cup peas"],["olives",0.5,"green olives"],["cilantro",0.5,"cilantro"]],
 pantry:"2 tbsp olive oil, 1 tsp cumin, 1 tsp oregano, 1 tsp turmeric (or a sazón packet), salt, pepper",
 steps:["Season the chicken and brown in the oil in a Dutch oven, 5 minutes per side. Remove.","Cook the onion, peppers and garlic (your sofrito) until soft, 6 minutes. Add the spices and tomato sauce for 2 minutes.","Stir in the rice to coat, then add the broth and 1 tsp salt.","Nestle the chicken back in, cover and simmer on low 25 minutes until the rice is tender.","Scatter over the peas and olives, cover 5 minutes more, then finish with cilantro."],
 tip:"Don't stir the rice while it simmers. A little crispy bottom (pegao) is a prize.",
 st:[4,3,"Microwave with a splash of broth, covered."]},
{id:"picadillo",title:"Cuban Picadillo",meal:"Dinner",time:35,serves:4,m:{has:["beef"],cuisine:"caribbean",protein:"beef",skill:1},
 blurb:"Savory-sweet ground beef simmered with tomatoes, potatoes, olives and warm spices. Spoon over white rice with fried plantains.",
 ing:[["ground_beef",1.33,"1⅓ lb ground beef"],["onion",0.17,"1 onion"],["bell_peppers",0.34,"1 green pepper"],["garlic",0.15,"4 garlic cloves"],["crushed_tomatoes",0.5,"14 oz tomato sauce"],["baby_potatoes",0.5,"12 oz potatoes, small dice"],["olives",1,"⅓ cup green olives"],["basmati",0.25,"1½ cups rice"]],
 pantry:"2 tbsp oil, 1 tsp cumin, 1 tsp oregano, ¼ cup raisins (optional), 1 tbsp vinegar, salt",
 steps:["Fry the diced potatoes in the oil until golden, 8 minutes. Remove. Start the rice.","Brown the beef with the onion, pepper and garlic, breaking it up, 8 minutes.","Add the spices, tomato sauce, raisins, vinegar and ½ cup water. Simmer 10 minutes.","Stir in the potatoes and olives and simmer 5 more minutes.","Serve over rice."],
 tip:"Picadillo makes great empanada, taco or stuffed-pepper filling too.",
 st:[5,3,RH.micro]},
{id:"cuban-sandwich",title:"Cuban Sandwiches",meal:"Lunch",time:20,serves:4,m:{has:["pork","dairy","gluten"],cuisine:"caribbean",protein:"pork",skill:1},
 blurb:"Roast pork, ham, Swiss, pickles and mustard pressed in buttered bread until golden and melty.",
 ing:[["hoagie_rolls",0.67,"4 Cuban or hoagie rolls"],["pork_tenderloin",0.5,"10 oz roast pork, sliced (or leftover mojo pork)"],["deli_ham",1,"9 oz sliced ham"],["swiss",1,"8 slices Swiss"],["pickles",0.15,"dill pickle slices"],["butter",0.05,"2 tbsp butter"]],
 pantry:"Yellow mustard, salt, pepper",
 steps:["If roasting the pork fresh: season and roast at 425°F to 145°F, 20 minutes. Rest and slice thin.","Split the rolls and spread both sides with mustard.","Layer Swiss, ham, pork, pickles and more Swiss.","Butter the outsides and press in a hot skillet under a heavy pan, 3 to 4 minutes per side, until golden and the cheese melts.","Slice on the diagonal."],
 tip:"No panini press? Weigh it down with a cast-iron pan and a can.",
 st:[2,0,"Assemble fresh. Re-press leftovers in a skillet."]},

/* ===== HAWAIIAN ===== */
{id:"poke-bowls",title:"Salmon or Ahi Poke Bowls",meal:"Lunch",time:20,serves:4,m:{has:["fish","gluten","sesame"],cuisine:"hawaiian",protein:"fish",skill:1},
 blurb:"Cubes of sushi-grade fish tossed in soy, sesame and green onion over warm rice with avocado, edamame, cucumber and spicy mayo.",
 ing:[["ahi_tuna",2,"1 lb sushi-grade ahi or salmon, cubed"],["soy",0.15,"¼ cup soy sauce"],["green_onion",0.5,"4 green onions"],["jasmine_rice",0.25,"1½ cups sushi or jasmine rice"],["avocado",0.5,"2 avocados"],["edamame",0.5,"1 cup edamame"],["cucumber",1,"1 cucumber"],["sesame",0.1,"sesame seeds"]],
 pantry:"1 tbsp sesame oil, 2 tbsp rice vinegar, 1 tsp sugar, ⅓ cup mayo, 1 tbsp sriracha",
 steps:["Cook the rice and season with the vinegar, sugar and a pinch of salt.","Toss the fish with the soy, sesame oil, green onions and sesame. Chill 10 minutes.","Stir the mayo and sriracha together.","Cook the edamame. Slice the cucumber and avocado.","Build bowls: rice, poke, avocado, edamame and cucumber. Drizzle with spicy mayo."],
 tip:"Buy fish labeled sushi- or sashimi-grade and eat it the same day.",
 st:[1,0,"Eat poke within 24 hours. Keep it very cold."]},
{id:"huli-huli-chicken",title:"Huli Huli Chicken with Pineapple",meal:"Dinner",time:40,serves:4,m:{has:["gluten"],cuisine:"hawaiian",protein:"chicken",skill:1},
 blurb:"Hawaii's sweet-savory pineapple-soy-ginger glazed chicken, grilled or broiled until sticky, with charred pineapple and coconut rice.",
 ing:[["chicken_thigh",1.33,"2 lb boneless thighs"],["pineapple",1,"1 pineapple (juice ½ cup, slice the rest)"],["soy",0.2,"⅓ cup soy sauce"],["honey",0.15,"¼ cup brown sugar or honey"],["ginger",0.5,"2-inch ginger"],["garlic",0.15,"4 garlic cloves"],["coconut_milk",1,"1 can coconut milk"],["jasmine_rice",0.25,"1½ cups jasmine rice"],["green_onion",0.5,"green onions"]],
 pantry:"¼ cup ketchup, 1 tbsp rice vinegar, salt",
 steps:["Whisk the pineapple juice, soy, sugar, ketchup, vinegar, ginger and garlic. Reserve ½ cup for basting and marinate the chicken in the rest for at least 30 minutes.","Cook the rice in the coconut milk plus water to make 2¼ cups liquid, with a pinch of salt.","Simmer the reserved sauce until syrupy, 5 minutes.","Grill or broil the chicken 5 to 6 minutes per side, basting with the thickened sauce, until charred and sticky. Grill the pineapple slices alongside.","Serve with coconut rice, pineapple and green onions."],
 tip:"'Huli' means turn. Flip often and keep basting.",
 st:[4,3,"Reheat at 375°F or microwave 2 minutes."]},
{id:"loco-moco",title:"Loco Moco",meal:"Dinner",time:30,serves:4,m:{has:["beef","egg","gluten"],cuisine:"hawaiian",protein:"beef",skill:1},
 blurb:"The ultimate Hawaiian plate lunch: rice topped with a juicy burger patty, rich onion gravy and a runny fried egg.",
 ing:[["ground_beef",1.33,"1⅓ lb ground beef"],["onion",0.17,"1 onion, sliced"],["beef_broth",0.5,"2 cups beef broth"],["eggs",0.34,"4 eggs"],["jasmine_rice",0.25,"1½ cups rice"],["green_onion",0.5,"green onions"],["soy",0.05,"1 tbsp soy sauce"]],
 pantry:"2 tbsp butter, 2 tbsp flour, 1 tbsp Worcestershire, salt, pepper, 1 tbsp oil",
 steps:["Cook the rice. Shape the beef into 4 patties, season, and sear 4 minutes per side. Move to a plate.","In the same pan, cook the onion in the butter until golden, 6 minutes.","Stir in the flour for 1 minute, then whisk in the broth, soy and Worcestershire. Simmer until thick, 3 minutes. Season.","Fry the eggs in the oil.","Layer rice, a patty, plenty of gravy and an egg. Top with green onions."],
 tip:"Serve with a scoop of macaroni salad for the full plate-lunch experience.",
 st:[3,3,"Store patties in gravy. Reheat covered and fry a fresh egg."]},

/* ===== FRENCH & SPANISH ===== */
{id:"chicken-paella",title:"Chicken, Chorizo & Shrimp Paella",meal:"Dinner",time:55,serves:6,m:{has:["shellfish","pork"],cuisine:"european",protein:"chicken",skill:3},
 blurb:"A showstopper skillet of smoky paprika rice with chicken, chorizo and shrimp, and the crispy socarrat bottom everyone fights over.",
 ing:[["chicken_thigh",0.67,"1 lb boneless thighs, in chunks"],["chorizo",1,"9 oz chorizo, sliced or crumbled"],["shrimp",0.5,"8 oz shrimp"],["onion",0.17,"1 onion"],["bell_peppers",0.34,"1 red pepper"],["garlic",0.15,"4 garlic cloves"],["crushed_tomatoes",0.25,"1 cup crushed tomatoes"],["basmati",0.34,"2 cups short-grain or long-grain rice"],["chicken_broth",1,"4 cups broth"],["frozen_veg",0.5,"1 cup peas"],["lemon",0.34,"2 lemons"],["smoked_paprika",0.1,"2 tsp smoked paprika"]],
 pantry:"3 tbsp olive oil, pinch of saffron (optional), salt",
 steps:["Brown the chicken and chorizo in the oil in a 12-inch skillet. Push aside and cook the onion, pepper and garlic until soft.","Add the paprika, saffron and tomatoes and cook 2 minutes. Stir in the rice to coat.","Pour in the hot broth and 1 tsp salt, stir once and spread evenly. Don't stir again.","Simmer 18 minutes. Tuck in the shrimp and scatter the peas, then cook 5 minutes more until the shrimp are pink.","Turn the heat up for 1 to 2 minutes until you hear crackling (the socarrat). Rest 5 minutes and serve with lemon."],
 tip:"Resist stirring after the broth goes in. Stirring makes it risotto, not paella.",
 st:[2,0,"Shrimp toughens when frozen. Microwave covered with a splash of broth."]},
{id:"french-onion-chicken",title:"French Onion Chicken",meal:"Dinner",time:50,serves:4,m:{has:["dairy"],cuisine:"european",protein:"chicken",skill:2,lc:1},
 blurb:"Everything you love about French onion soup over seared chicken: deeply caramelized onions, a rich beef-thyme sauce and bubbling Gruyère.",
 ing:[["chicken_breast",1,"1½ lb chicken breasts, halved into cutlets"],["onion",0.5,"3 large onions, thinly sliced"],["butter",0.1,"4 tbsp butter"],["beef_broth",0.25,"1 cup beef broth"],["gruyere",1,"6 oz Gruyère, shredded"],["garlic",0.1,"3 garlic cloves"],["parsley",0.5,"thyme or parsley"],["baguette",1,"crusty baguette, to serve"]],
 pantry:"1 tbsp olive oil, 1 tsp thyme, 1 tbsp flour, splash of dry sherry or balsamic, salt, pepper",
 steps:["Cook the onions in 3 tbsp butter with a pinch of salt over medium-low, stirring often, until deep golden and jammy, 25 to 30 minutes.","Season the chicken and sear in the oil and remaining butter, 4 minutes per side. Set aside.","Add the garlic, thyme and flour to the onions for 1 minute, then deglaze with sherry and the broth. Simmer until thickened.","Return the chicken, spoon onions over each piece and cover with Gruyère.","Broil 2 to 3 minutes until bubbling and browned. Serve with baguette."],
 tip:"Low and slow onions are worth it. Add a splash of water if they start to stick.",
 st:[3,3,"Reheat covered at 350°F for 15 minutes."]},
{id:"quiche-lorraine",title:"Quiche Lorraine",meal:"Breakfast",time:75,serves:6,m:{has:["egg","dairy","gluten","pork"],cuisine:"european",protein:"pork",skill:2},
 blurb:"A tall, silky custard of eggs, cream, smoky bacon and nutty Gruyère in a flaky crust. Brunch that reheats all week.",
 ing:[["pie_crust",0.5,"1 refrigerated pie crust"],["bacon",1,"12 oz bacon, chopped"],["onion",0.17,"1 onion, diced"],["gruyere",1,"6 oz Gruyère, shredded"],["eggs",0.5,"6 eggs"],["heavy_cream",0.5,"1 cup heavy cream"],["milk",0.1,"¾ cup milk"]],
 pantry:"Nutmeg, salt, pepper",
 steps:["Heat the oven to 375°F. Fit the crust into a 9-inch pie dish, prick all over, line with foil and weights and blind-bake 15 minutes. Remove the foil and bake 5 minutes more.","Cook the bacon until crisp and the onion in the bacon fat until soft.","Whisk the eggs, cream, milk, a pinch of nutmeg, ½ tsp salt and pepper.","Scatter bacon, onion and Gruyère in the crust and pour over the custard.","Lower the oven to 350°F and bake 35 to 40 minutes, until just set with a slight wobble in the center. Cool 15 minutes before slicing."],
 tip:"Pull it while the middle still jiggles. It sets as it cools and stays silky.",
 st:[4,2,"Reheat slices at 325°F for 10 minutes or microwave 45 seconds."]},
{id:"croque-monsieur",title:"Croque Monsieur",meal:"Lunch",time:25,serves:4,m:{has:["pork","dairy","gluten"],cuisine:"european",protein:"pork",skill:1},
 blurb:"Paris café classic: ham and Gruyère on toasted bread, smothered in creamy béchamel and broiled until bubbly and golden.",
 ing:[["sourdough",0.4,"8 slices sourdough or pain de mie"],["deli_ham",1,"9 oz sliced ham"],["gruyere",1.5,"9 oz Gruyère, shredded"],["butter",0.1,"3 tbsp butter"],["milk",0.15,"1¼ cups milk"]],
 pantry:"2 tbsp flour, 2 tsp Dijon, nutmeg, salt, pepper",
 steps:["Make béchamel: melt 2 tbsp butter, whisk in the flour for 1 minute, then the milk. Simmer until thick, 3 minutes. Season with nutmeg, salt and pepper and stir in a handful of Gruyère.","Spread 4 slices of bread with Dijon, top with ham and Gruyère, and close the sandwiches.","Toast the sandwiches in the remaining butter until golden on both sides.","Move to a sheet pan, spread the tops with béchamel and scatter with the rest of the cheese.","Broil 2 to 3 minutes until bubbling and browned."],
 tip:"Add a fried egg on top and it becomes a croque madame.",
 st:[1,0,"Best fresh. Reheat at 375°F for 8 minutes."]},

/* ===== AFRICAN ===== */
{id:"chicken-tagine",title:"Moroccan Chicken Tagine with Apricots",meal:"Dinner",time:55,serves:4,m:{has:["gluten"],cuisine:"african",protein:"chicken",skill:1},
 blurb:"Chicken braised with warm spices, chickpeas, sweet apricots and lemon until tender, spooned over fluffy couscous.",
 ing:[["chicken_thigh",1.33,"2 lb boneless thighs"],["onion",0.34,"2 onions, sliced"],["garlic",0.15,"4 garlic cloves"],["ginger",0.25,"1-inch ginger"],["chickpeas",1,"1 can chickpeas"],["dried_apricots",0.67,"4 oz dried apricots"],["chicken_broth",0.4,"1½ cups broth"],["lemon",0.17,"1 lemon"],["olives",0.5,"green olives (optional)"],["couscous",1,"10 oz couscous"],["cilantro",0.5,"cilantro"]],
 pantry:"2 tbsp olive oil, 2 tsp cumin, 1 tsp cinnamon, 1 tsp turmeric, 1 tsp paprika, 1 tbsp honey, salt",
 steps:["Season the chicken with salt and half the spices and brown in the oil, 4 minutes per side. Remove.","Cook the onions until soft and golden, 8 minutes. Add the garlic, ginger and remaining spices for 1 minute.","Add the broth, chickpeas, apricots, honey and lemon zest. Return the chicken.","Cover and simmer 25 minutes until tender. Add olives and lemon juice.","Pour boiling water over the couscous, cover 5 minutes and fluff. Serve the tagine over couscous with cilantro."],
 tip:"Even better the next day as the spices deepen.",
 st:[5,3,RH.soup]},
{id:"jollof-rice",title:"West African Jollof Rice with Chicken",meal:"Dinner",time:60,serves:6,m:{has:["spicy"],cuisine:"african",protein:"chicken",skill:2},
 blurb:"Smoky, party-style jollof: rice cooked in a rich blended pepper-tomato sauce, served with seasoned roasted chicken.",
 ing:[["chicken_thigh",1.33,"2 lb chicken thighs"],["bell_peppers",0.67,"2 red bell peppers"],["roma_tomatoes",1,"4 Roma tomatoes"],["onion",0.34,"2 onions"],["jalapeno",0.34,"1 scotch bonnet or jalapeño"],["crushed_tomatoes",0.25,"¼ cup tomato paste or 1 cup crushed tomatoes"],["basmati",0.4,"2½ cups long-grain parboiled rice"],["chicken_broth",0.75,"3 cups broth"],["garlic",0.15,"4 garlic cloves"],["ginger",0.25,"1-inch ginger"]],
 pantry:"⅓ cup oil, 2 tsp curry powder, 2 tsp thyme, 2 bay leaves, 1 bouillon cube, salt",
 steps:["Rub the chicken with curry powder, thyme, garlic, ginger and salt. Roast at 425°F for 30 minutes.","Blend the peppers, tomatoes, 1 onion and the chili until smooth.","Fry the second onion (sliced) in the oil until soft, add the tomato paste and fry 3 minutes until darkened, then add the blended sauce. Simmer 15 minutes until reduced and the oil rises.","Stir in the rinsed rice, broth, bouillon, bay leaves, more curry and thyme. Cover tightly with foil and lid and cook on low 30 minutes.","Let the bottom catch slightly for that smoky 'party' flavor, then fluff and serve with the chicken."],
 tip:"Don't rush reducing the pepper sauce. Frying it down is where the flavor comes from.",
 st:[5,3,"Microwave covered with a splash of water."]},

/* ===== SOUTHERN & CAJUN ===== */
{id:"gumbo",title:"Chicken & Andouille Gumbo",meal:"Dinner",time:90,serves:6,m:{has:["gluten","pork","spicy"],cuisine:"southern",protein:"chicken",skill:3},
 blurb:"Louisiana in a bowl: a dark chocolate-colored roux, the holy trinity, smoky andouille and tender chicken, ladled over rice.",
 ing:[["chicken_thigh",1,"1½ lb boneless thighs"],["smoked_sausage",1,"12 oz andouille, sliced"],["onion",0.17,"1 onion, diced"],["bell_peppers",0.34,"1 green pepper"],["celery",0.3,"2 celery stalks"],["garlic",0.15,"4 garlic cloves"],["chicken_broth",1.5,"6 cups broth"],["okra",1,"12 oz frozen okra"],["cajun",0.2,"2 tbsp Cajun seasoning"],["jasmine_rice",0.34,"2 cups rice"],["green_onion",0.5,"green onions"]],
 pantry:"½ cup oil, ½ cup flour, 2 bay leaves, hot sauce, filé powder (optional)",
 steps:["Brown the sausage and chicken in a Dutch oven. Remove.","Make the roux: whisk the oil and flour over medium-low, stirring constantly, until the color of milk chocolate, 20 to 30 minutes. Don't walk away. If it burns, start over.","Add the onion, pepper and celery and cook 5 minutes, then the garlic and Cajun seasoning.","Whisk in the broth slowly, add the bay leaves, chicken, sausage and okra and simmer 45 minutes.","Season with hot sauce and serve over rice with green onions."],
 tip:"Have every vegetable chopped before you start the roux. It goes fast at the end.",
 st:[4,3,RH.soup]},
{id:"red-beans-rice",title:"Red Beans & Rice with Andouille",meal:"Dinner",time:60,serves:6,m:{has:["pork"],cuisine:"southern",protein:"pork",skill:1},
 blurb:"New Orleans' Monday tradition: creamy, smoky red beans simmered with sausage and the trinity, over fluffy white rice.",
 ing:[["kidney_beans",3,"3 cans red kidney beans, with liquid"],["smoked_sausage",1,"12 oz andouille, sliced"],["onion",0.17,"1 onion"],["bell_peppers",0.34,"1 green pepper"],["celery",0.3,"2 celery stalks"],["garlic",0.15,"4 garlic cloves"],["chicken_broth",0.5,"2 cups broth"],["cajun",0.15,"1 tbsp Cajun seasoning"],["jasmine_rice",0.34,"2 cups rice"],["green_onion",0.5,"green onions"]],
 pantry:"1 tbsp oil, 2 bay leaves, 1 tsp thyme, hot sauce",
 steps:["Brown the sausage in the oil. Remove.","Cook the onion, pepper and celery in the fat until soft, then the garlic and seasoning.","Add the beans with their liquid, broth, bay leaves, thyme and sausage. Simmer 35 to 40 minutes.","Mash about a third of the beans against the pot to make it creamy.","Serve over rice with green onions and hot sauce."],
 tip:"Even better on day two, which is why New Orleans makes it on laundry day.",
 st:[5,4,RH.soup]},
{id:"chicken-dumplings",title:"Chicken & Dumplings",meal:"Dinner",time:45,serves:6,m:{has:["dairy","gluten"],cuisine:"southern",protein:"chicken",skill:1},
 blurb:"Creamy chicken stew with carrots and celery, topped with tender, fluffy biscuit dumplings. Pure Southern comfort.",
 ing:[["rotisserie",0.5,"3 cups shredded chicken"],["onion",0.17,"1 onion"],["carrots",0.25,"2 carrots"],["celery",0.3,"2 celery stalks"],["chicken_broth",1.5,"6 cups broth"],["milk",0.1,"¾ cup milk"],["biscuits",1,"1 can refrigerated biscuits, quartered"],["frozen_veg",0.5,"1 cup peas"],["butter",0.1,"4 tbsp butter"]],
 pantry:"⅓ cup flour, 1 tsp thyme, salt, pepper",
 steps:["Melt the butter in a Dutch oven and cook the onion, carrots and celery until soft, 8 minutes.","Stir in the flour and thyme for 1 minute, then whisk in the broth and milk. Simmer until slightly thickened.","Add the chicken and peas and season well.","Drop the biscuit pieces on top, cover and simmer gently 15 minutes without lifting the lid.","Check that the dumplings are cooked through (no raw dough inside) and serve."],
 tip:"Keep the lid on so the dumplings steam and puff.",
 st:[3,0,"Dumplings get soggy when frozen. Reheat gently with a splash of broth."]},

/* ===== MEXICAN extras ===== */
{id:"pozole-rojo",title:"Pozole Rojo",meal:"Dinner",time:150,serves:6,m:{has:[],cuisine:"mexican",protein:"pork",skill:2},
 blurb:"A celebratory Mexican stew of tender pork and chewy hominy in a brick-red chile broth, piled high with crunchy cabbage, radish, lime and oregano.",
 ing:[["pork_shoulder",0.67,"2 lb pork shoulder, in chunks"],["hominy",2,"2 cans hominy, drained"],["enchilada_sauce",1,"19 oz red enchilada sauce (or blended guajillo chiles)"],["chicken_broth",1.5,"6 cups broth"],["onion",0.17,"1 onion"],["garlic",0.2,"6 garlic cloves"],["coleslaw",0.5,"shredded cabbage"],["lime",0.5,"limes"],["cilantro",0.5,"cilantro"],["tortilla_chips",0.3,"tostadas or chips"]],
 pantry:"1 tbsp oil, 2 tsp Mexican oregano, 1 tsp cumin, 2 bay leaves, salt",
 steps:["Season the pork with salt and brown in the oil in a big pot.","Add the onion, garlic, broth, bay leaves and oregano. Simmer covered 1½ hours until the pork is tender.","Shred the pork right in the pot. Stir in the chile sauce, cumin and hominy.","Simmer 20 minutes more. Season well with salt.","Serve with cabbage, lime, cilantro, oregano and crunchy tostadas."],
 tip:"The toppings make pozole. Don't skip them.",
 st:[5,4,"Store toppings separately. "+RH.soup]},
{id:"carne-asada",title:"Carne Asada Tacos",meal:"Dinner",time:30,serves:4,m:{has:["beef"],cuisine:"mexican",protein:"beef",skill:1,lc:1},
 blurb:"Citrus-garlic marinated flank steak, charred hot and sliced thin, in warm corn tortillas with onion, cilantro, salsa and guac.",
 ing:[["flank_steak",1,"1½ lb flank or skirt steak"],["oranges",0.17,"1 orange"],["lime",0.5,"4 limes"],["garlic",0.15,"4 garlic cloves"],["jalapeno",0.34,"1 jalapeño"],["cilantro",1,"1 bunch cilantro"],["corn_tortillas",1,"16 corn tortillas"],["onion",0.17,"1 white onion"],["salsa",0.5,"salsa"],["avocado",0.5,"2 avocados"]],
 pantry:"¼ cup oil, 2 tsp cumin, 1 tbsp soy sauce, salt",
 steps:["Blend the orange and juice of 2 limes, garlic, jalapeño, half the cilantro, oil, cumin, soy and 1 tsp salt. Marinate the steak 30 minutes to 8 hours.","Grill or sear in a screaming-hot cast-iron pan 4 to 5 minutes per side for medium.","Rest 10 minutes, then slice thin across the grain.","Char the tortillas and mash the avocados with lime and salt.","Fill tortillas with steak, chopped onion, cilantro, salsa and guac."],
 tip:"Don't marinate longer than 8 hours. The citrus turns the steak mushy.",
 st:[4,3,"Reheat sliced steak briefly in a hot skillet."]},
{id:"chorizo-breakfast-tacos",title:"Chorizo & Egg Breakfast Tacos",meal:"Breakfast",time:20,serves:4,m:{has:["pork","egg","dairy","gluten"],cuisine:"mexican",protein:"pork",skill:1},
 blurb:"Austin-style breakfast tacos: crispy potatoes, spicy chorizo and soft scrambled eggs in warm flour tortillas with cheese and salsa.",
 ing:[["chorizo",1,"9 oz Mexican chorizo"],["eggs",0.67,"8 eggs"],["baby_potatoes",0.5,"12 oz potatoes, small dice"],["flour_tortillas",0.8,"8 small flour tortillas"],["cheese_mex",0.5,"1 cup shredded cheese"],["salsa",0.5,"salsa"],["avocado",0.25,"1 avocado"],["cilantro",0.4,"cilantro"]],
 pantry:"1 tbsp oil, salt",
 steps:["Microwave the diced potatoes covered with a splash of water for 4 minutes, then fry in the oil until crisp, 6 minutes.","Add the chorizo and cook, breaking it up, until browned, 5 minutes.","Push to one side and scramble the eggs in the same pan until just set. Fold everything together.","Warm the tortillas.","Fill with the chorizo-egg mixture, cheese, salsa, avocado and cilantro."],
 tip:"Wrap leftovers individually in foil and freeze for grab-and-go mornings.",
 st:[4,3,"Microwave wrapped in a damp paper towel, 1 to 1½ minutes."]},

/* ===== more breakfasts ===== */
{id:"chia-pudding",title:"Coconut Chia Pudding with Berries",meal:"Breakfast",time:5,serves:4,m:{has:[],cuisine:"american",protein:"veg",skill:1},
 blurb:"Make-ahead jars of creamy coconut chia pudding layered with jammy berries. Five minutes tonight, breakfast for four days.",
 ing:[["chia",0.2,"½ cup chia seeds"],["coconut_milk",1,"1 can coconut milk"],["milk",0.15,"1 cup milk (or more coconut milk)"],["honey",0.1,"3 tbsp honey or maple"],["frozen_berries",0.75,"2 cups berries"]],
 pantry:"1 tsp vanilla, pinch of salt",
 steps:["Whisk the coconut milk, milk, honey, vanilla and salt.","Whisk in the chia seeds. Wait 5 minutes and whisk again to break up clumps.","Divide among 4 jars.","Top with berries and seal.","Refrigerate at least 4 hours or overnight until thick."],
 tip:"Whisking twice is the trick to pudding that sets evenly with no clumps.",
 st:[5,0,"Eat cold. Stir before eating."]},
];
for(const r of MORE5){ META[r.id]=r.m; STORAGE[r.id]=r.st; delete r.m; delete r.st; RECIPES.push(r); }

/* items the breakfast sandwich builder and several packs share */
Object.assign(ITEMS, {
  turkey_bacon:G("Turkey bacon","Meat & Seafood","Turkey Bacon (12 oz)",3.99,["Jennie-O Turkey Bacon (3 x 12 oz)",3,9.99]),
  flour:G("All-purpose flour","Pantry","All-Purpose Flour (5 lb)",3.49,["Gold Medal All-Purpose Flour (25 lb)",5,9.99]),
  buttermilk:G("Buttermilk","Dairy & Eggs","Buttermilk (1 qt)",2.29,null,"costco"),
  pepper_jack:G("Sliced pepper jack","Dairy & Eggs","Sliced Pepper Jack (8 oz)",3.29,["Tillamook Pepper Jack Slices (2 lb)",4,10.99]),
});
Object.assign(NUTR, { turkey_bacon:[480,32,2,38,0,0,2600], flour:[8255,233,1730,22,61,6,45], buttermilk:[380,32,46,8,0,46,1000], pepper_jack:[830,52,2,68,0,0,1360] });

/* more recipe packs from src/recipes/*.js: {items:{key:[G args]}, nutr:{key:[...]}, recipes:[same shape as MORE5]} */
for(const pack of (window.BB_MORE||[])){
  for(const [k,a] of Object.entries(pack.items||{})){ ITEMS[k]=G(...a); if(!AISLES.includes(ITEMS[k][1])) ITEMS[k][1] = /bakery|bread/i.test(ITEMS[k][1]) ? "Bakery & Tortillas" : "Pantry"; }
  Object.assign(NUTR, pack.nutr||{});
  for(const r of pack.recipes||[]){ META[r.id]=r.m; STORAGE[r.id]=r.st; delete r.m; delete r.st; RECIPES.push(r); }
}


/* ------------------------------------------------------------------ priced stores
   Chains without hand-entered prices get one estimated offer per item:
   - supermarkets, big-box and natural stores carry everything, priced from the Walmart/Aldi/Trader Joe's shelf price
     normalized to an average supermarket, times the chain's price level;
   - warehouse clubs mirror Costco's bulk packs; discount grocers mirror Aldi's smaller assortment.
   Each chain/item pair also gets a fixed ±15% nudge: no chain is cheapest on everything, so splitting a list can pay off. */
const SRC_LEVEL = {walmart:0.9, aldi:0.8, tj:1.08};
const sizeOf = name => { const m=String(name).match(/\(([^()]*)\)\s*$/); return m?" ("+m[1]+")":""; };
const cap = s => s.charAt(0).toUpperCase()+s.slice(1);
for(const [item,def] of Object.entries(ITEMS)){
  const o=def[2], name=cap(def[0]);
  const src=["walmart","aldi","tj"].find(k=>o[k]);
  for(const [k,st] of Object.entries(STORES)){
    if(!st.idx || o[k]) continue;
    const lvl = st.idx*(0.85+0.3*rng(k+":"+item)());
    if(st.kind==="club"){ if(o.costco) o[k]=[name+sizeOf(o.costco[0]), +(o.costco[1]*lvl).toFixed(2), o.costco[2]]; continue; }
    if(st.kind==="discount"){ if(o.aldi) o[k]=[name+sizeOf(o.aldi[0]), +(o.aldi[1]*lvl).toFixed(2), o.aldi[2]]; continue; }
    if(src) o[k]=[name+sizeOf(o[src][0]), +(Math.max(0.5, o[src][1]/SRC_LEVEL[src]*lvl)).toFixed(2), o[src][2]];
    else if(o.costco) o[k]=[name+sizeOf(o.costco[0]), +(o.costco[1]/o.costco[2]*1.25*lvl).toFixed(2), 1];
  }
}

/* regroup earlier recipes into the finer cuisine list; finish every recipe's facts */
const CUISINE_FIX = {"gochujang-chicken":"korean","red-curry-shrimp":"thai","bulgogi-bowls":"korean","peanut-noodles":"chinese","veggie-fried-rice":"chinese","orange-chicken":"chinese","beef-broccoli":"chinese","teriyaki-salmon-bowls":"japanese","pad-thai":"thai","potsticker-stirfry":"chinese","miso-ramen":"japanese","katsu-curry":"japanese","kung-pao-chicken":"chinese","tofu-peanut-stirfry":"thai","thai-peanut-salad":"thai","banh-mi":"vietnamese","shakshuka":"middleeastern","chicken-shawarma":"middleeastern","jambalaya":"southern","shrimp-grits":"southern","pulled-pork":"southern","crispy-chicken-sandwich":"southern","avocado-egg-toast":"american"};
// sauces that carry an allergen whatever the dish's main protein
const IMPLIED_HAS = {oyster_sauce:"shellfish", fish_sauce:"fish"};
for(const r of RECIPES){ const m=META[r.id]; if(!m) continue; m.has=m.has||[]; for(const [k] of r.ing) if(IMPLIED_HAS[k] && !m.has.includes(IMPLIED_HAS[k])) m.has.push(IMPLIED_HAS[k]); }
for(const [id,m] of Object.entries(META)){ m.cuisine = CUISINE_FIX[id] || String(m.cuisine).toLowerCase(); m.veg = ["veg","egg"].includes(m.protein); m.pesc = m.veg || ["fish","shrimp"].includes(m.protein); }
// every pantry and pack item is known by now, so recompute anything worked out earlier
for(const k in NUTR_CACHE) delete NUTR_CACHE[k];
for(const r of RECIPES){ if(!r.art) r.art=ART.A("bowl","#2E3A44","#E9E4DA",ART.sauce("#C9772A","#9E5214","#E2973A"),ART.herbs(14)); const n=nutritionOf(r); r.kcal=n.kcal; r.protein=n.protein; }

/* ------------------------------------------------------------------ people & portions */
const MEAL_SHARE = {breakfast:0.25, lunch:0.33, dinner:0.37}; // the rest of the day is snacks
const people = () => (S.profile && S.profile.people) || [{name:"You",kcal:2000}];
const personName = (p,i) => (p.name||"").trim() || ("Person "+(i+1));
function portionFor(p, meal, r){ const x=p.kcal*MEAL_SHARE[meal]/Math.max(150,nutritionOf(r).kcal); return Math.min(2.5, Math.max(0.5, Math.round(x*4)/4)); }
function fmtPortion(x){ const w=Math.floor(x), f=x-w, fr={0:"",0.25:"¼",0.5:"½",0.75:"¾"}[f]??""; return (w?String(w):"")+fr || "0"; }
function household(){ return people().length; }
function slotsOf(){
  const out=[], days=planDays(), ps=people(), lo=leftoversOn();
  days.forEach((day,i)=>{
    for(const [k,label] of MEALS){
      const key=k[0], arr=S.plan[key]; if(!arr.length) continue;
      let id=arr[i], leftover=false;
      if(k==="lunch" && lo && i>0){ id=S.plan.d[i-1]; leftover=true; }
      const r=id&&R_BY_ID[id];
      const each = r ? ps.map(p=>portionFor(p,k,r)) : ps.map(()=>0);
      let portions = each.reduce((a,b)=>a+b,0);
      if(r && k==="dinner" && lo && i<days.length-1) portions += ps.reduce((a,p)=>a+portionFor(p,"lunch",r),0);
      out.push({day,i,meal:k,label,id,leftover,each,portions: leftover?0:portions});
    }
  });
  return out;
}
function dayNutrition(i){
  const ps=people(), slots=slotsOf().filter(s=>s.i===i && s.id);
  return ps.map((p,j)=>{ const t={kcal:0,protein:0,carbs:0,fat:0,fiber:0,sugar:0,sodium:0}; let share=0;
    for(const s of slots){ const n=nutritionOf(R_BY_ID[s.id]); for(const k in t) t[k]+=n[k]*s.each[j]; share+=MEAL_SHARE[s.meal]; }
    return Object.assign(t,{name:personName(p,j), target:Math.round(p.kcal*share), daily:p.kcal}); });
}
function weekAvgNutrition(){
  const days=planDays().map((_,i)=>dayNutrition(i));
  return people().map((p,j)=>{ const t={kcal:0,protein:0,carbs:0,fat:0,fiber:0,sugar:0,sodium:0,target:0};
    for(const d of days) for(const k in t) t[k]+=d[j][k];
    for(const k in t) t[k]/=Math.max(1,days.length);
    const mt = p.macros ? {protein:p.macros.p*t.target/p.kcal, carbs:p.macros.c*t.target/p.kcal, fat:p.macros.f*t.target/p.kcal} : null;
    return Object.assign(t,{name:personName(p,j), daily:p.kcal, macros:p.macros||null, mt}); });
}
function portionsLine(r, meal){
  if(!S.profile) return "";
  return people().map((p,j)=>`${personName(p,j)} ${fmtPortion(portionFor(p,meal,r))}`).join(" · ");
}
function mealsText(r){
  if(!S.profile) return `Makes ${r.serves} servings`;
  const need=people().reduce((a,p)=>a+portionFor(p,(r.meal||"Dinner").toLowerCase(),r),0);
  const times=r.serves/need;
  return `Makes ${r.serves} servings · feeds your household about ${times>=1.9?Math.round(times):times.toFixed(1)} time${times>=1.5?"s":""}`;
}
/* Mifflin-St Jeor estimate */
function estimateKcal(e){
  const kg=e.lb*0.4536, cm=(e.ft*12+e.inch)*2.54;
  const bmr=10*kg+6.25*cm-5*e.age+(e.sex==="m"?5:-161);
  const act={1:1.2,2:1.375,3:1.55,4:1.725}[e.act]||1.375, goal={lose:-450,keep:0,gain:300}[e.goal]||0;
  return Math.max(1200, Math.round((bmr*act+goal)/50)*50);
}

/* ------------------------------------------------------------------ people question UI */
function peopleEditor(A){
  const wrapEl=el("div",{class:"people"});
  A.people.forEach((p,i)=>{
    const est = p._est || (p._est={sex:"f",age:35,ft:5,inch:6,lb:160,act:2,goal:"keep",open:false});
    const card=el("div",{class:"person"},
      el("div",{class:"prow"},
        el("label",{class:"fld"}, el("span",{class:"eyebrow"},"Name"), el("input",{type:"text",id:"pname-"+i,value:p.name,placeholder:"Person "+(i+1),maxlength:20,oninput:e=>{ p.name=e.target.value; }})),
        el("label",{class:"fld"}, el("span",{class:"eyebrow"},"Daily calories"),
          el("div",{class:"kcalctl"}, el("button",{class:"btn round","aria-label":"Less",onclick:()=>{ p.kcal=Math.max(1000,p.kcal-100); renderQuiz(); }},"−"),
            el("input",{type:"number",id:"pkcal-"+i,min:1000,max:5000,step:50,value:p.kcal,class:"mono",onchange:e=>{ p.kcal=Math.min(5000,Math.max(1000,+e.target.value||2000)); renderQuiz(); }}),
            el("button",{class:"btn round","aria-label":"More",onclick:()=>{ p.kcal=Math.min(5000,p.kcal+100); renderQuiz(); }},"+"))),
        A.people.length>1?el("button",{class:"btn small rm",onclick:()=>{ A.people.splice(i,1); renderQuiz(); }},"Remove"):null),
      el("div",{class:"presets"}, [1500,1800,2000,2200,2500,2800,3000].map(k=>el("button",{class:"chip","aria-pressed":p.kcal===k,onclick:()=>{ p.kcal=k; renderQuiz(); }},k.toLocaleString()))),
      el("button",{class:"linkbtn",onclick:()=>{ est.open=!est.open; renderQuiz(); }}, est.open?"Hide calculator":"Not sure? Estimate it for me"),
      est.open ? el("div",{class:"estim"},
        el("label",{class:"fld"},el("span",{class:"eyebrow"},"Sex"), el("select",{id:"esex-"+i,onchange:e=>est.sex=e.target.value}, el("option",{value:"f",selected:est.sex==="f"},"Female"), el("option",{value:"m",selected:est.sex==="m"},"Male"))),
        el("label",{class:"fld"},el("span",{class:"eyebrow"},"Age"), el("input",{type:"number",id:"eage-"+i,value:est.age,min:12,max:100,onchange:e=>est.age=+e.target.value})),
        el("label",{class:"fld"},el("span",{class:"eyebrow"},"Height"), el("div",{class:"hgt"}, el("input",{type:"number",id:"eft-"+i,value:est.ft,min:3,max:7,onchange:e=>est.ft=+e.target.value}), el("span",{},"ft"), el("input",{type:"number",id:"ein-"+i,value:est.inch,min:0,max:11,onchange:e=>est.inch=+e.target.value}), el("span",{},"in"))),
        el("label",{class:"fld"},el("span",{class:"eyebrow"},"Weight (lb)"), el("input",{type:"number",id:"elb-"+i,value:est.lb,min:70,max:500,onchange:e=>est.lb=+e.target.value})),
        el("label",{class:"fld"},el("span",{class:"eyebrow"},"Activity"), el("select",{id:"eact-"+i,onchange:e=>est.act=+e.target.value}, [[1,"Mostly sitting"],[2,"Light exercise 1-3x/wk"],[3,"Active 3-5x/wk"],[4,"Very active daily"]].map(([v,l])=>el("option",{value:v,selected:est.act===v},l)))),
        el("label",{class:"fld"},el("span",{class:"eyebrow"},"Goal"), el("select",{id:"egoal-"+i,onchange:e=>est.goal=e.target.value}, [["lose","Lose weight"],["keep","Maintain"],["gain","Build muscle"]].map(([v,l])=>el("option",{value:v,selected:est.goal===v},l)))),
        el("button",{class:"btn primary small",onclick:()=>{ p.kcal=estimateKcal(est); est.open=false; renderQuiz(); toast(personName(p,i)+": "+p.kcal.toLocaleString()+" kcal a day"); }},"Use this estimate")) : null);
    wrapEl.append(card);
  });
  if(A.people.length<6) wrapEl.append(el("button",{class:"btn",onclick:()=>{ A.people.push({name:"",kcal:2000}); renderQuiz(); }},"+ Add another person"));
  wrapEl.append(el("p",{class:"note",style:"margin:0"},"Portions are sized so each person's planned meals fit their own daily calories (breakfast about 25%, lunch 33%, dinner 37%, leaving room for snacks)."));
  return wrapEl;
}

/* ------------------------------------------------------------------ optional macro targets (grams a day, per person) */
const MACRO_PRESETS = [["balanced","Balanced",30,40,30],["protein","High protein",40,30,30],["lowcarb","Lower carb",40,20,40],["keto","Keto",25,5,70],["endurance","Endurance",20,55,25]];
const macroKcal = m => m.p*4 + m.c*4 + m.f*9;
function macrosFromSplit(kcal,pp,cp,fp){ return {p:Math.round(kcal*pp/100/4), c:Math.round(kcal*cp/100/4), f:Math.round(kcal*fp/100/9)}; }
function macroEditor(p,i){
  const open = p._mOpen ?? !!p.macros;
  const tog = el("label",{class:"tog"}, el("input",{type:"checkbox",id:"pmac-"+i,checked:open,onchange:e=>{ p._mOpen=e.target.checked; if(!e.target.checked) p.macros=null; else if(!p.macros) p.macros=macrosFromSplit(p.kcal,30,40,30); renderQuiz(); }}), "Set macro targets for "+personName(p,i));
  if(!open || !p.macros) return el("div",{class:"macros"}, tog);
  const m=p.macros, mk=macroKcal(m), off=Math.abs(mk-p.kcal)>Math.max(60,p.kcal*0.05);
  const fld=(k,label)=>el("label",{class:"fld"}, el("span",{class:"eyebrow"},label+" (g/day)"),
    el("input",{type:"number",id:`pm${k}-${i}`,min:0,max:600,step:5,value:m[k],class:"mono",onchange:e=>{ m[k]=Math.max(0,Math.min(600,Math.round(+e.target.value||0))); renderQuiz(); }}));
  const pct=k=>Math.round(m[k]*(k==="f"?9:4)/Math.max(1,mk)*100);
  return el("div",{class:"macros"}, tog,
    el("div",{class:"presets"}, MACRO_PRESETS.map(([k,l,pp,cp,fp])=>el("button",{class:"chip",title:`${pp}% protein · ${cp}% carbs · ${fp}% fat`,onclick:()=>{ p.macros=macrosFromSplit(p.kcal,pp,cp,fp); renderQuiz(); }},l))),
    el("div",{class:"mrow"}, fld("p","Protein"), fld("c","Carbs"), fld("f","Fat")),
    el("p",{class:"note"+(off?" warnline":""),style:"margin:0"},
      `${pct("p")}% protein · ${pct("c")}% carbs · ${pct("f")}% fat = ${fmtInt(mk)} kcal a day`+(off?` (your daily calories are ${fmtInt(p.kcal)}). `:". "),
      off?el("button",{class:"linkbtn",onclick:()=>{ p.kcal=Math.min(5000,Math.max(1000,Math.round(mk/50)*50)); renderQuiz(); }},"Use "+fmtInt(Math.round(mk/50)*50)+" kcal as my daily calories"):null),
    null);
}
// how well a dish's calorie split matches the household's macro targets: 0 = perfect, 2 = opposite
function macroMiss(r){
  const ps=(S.profile?people():[]).filter(p=>p.macros); if(!ps.length) return null;
  const n=nutritionOf(r), k=Math.max(1,n.protein*4+n.carbs*4+n.fat*9);
  let miss=0; for(const p of ps){ const mk=Math.max(1,macroKcal(p.macros));
    miss += Math.abs(n.protein*4/k - p.macros.p*4/mk) + Math.abs(n.carbs*4/k - p.macros.c*4/mk) + Math.abs(n.fat*9/k - p.macros.f*9/mk); }
  return miss/ps.length;
}

/* ------------------------------------------------------------------ favorites & cuisine tags */
const FAV_TEST = {
  chicken:r=>META[r.id].protein==="chicken"||META[r.id].protein==="turkey", beef:r=>META[r.id].protein==="beef", pork:r=>META[r.id].protein==="pork",
  seafood:r=>["shrimp","fish"].includes(META[r.id].protein), veggie:r=>META[r.id].veg,
  pasta:r=>r.ing.some(i=>["spaghetti","penne","orzo","lasagna","elbows","jumbo_shells","gnocchi"].includes(i[0])) && !/noodle|pad|ramen|dan dan|peanut/i.test(r.title),
  noodles:r=>r.ing.some(i=>["rice_noodles","ramen","vermicelli","glass_noodles","yakisoba"].includes(i[0])) || /noodle|ramen|pho|pad thai/i.test(r.title),
  rice:r=>/bowl|rice|biryani|paella|jambalaya|bibimbap|gyudon|loco moco|jollof|arroz/i.test(r.title),
  tacos:r=>/taco|burrito|enchilada|quesadilla|tostada|fajita|carnitas|birria/i.test(r.title),
  sandwiches:r=>/burger|sandwich|melt|wrap|bánh|banh|grinder|blt|bagel|pita|croque|cuban/i.test(r.title),
  soups:r=>/soup|chili|stew|gumbo|pozole|pho|ramen|tagine|dumplings|dal\b/i.test(r.title),
  curries:r=>/curry|masala|tikka|korma|dal|palak/i.test(r.title),
  salads:r=>/salad|bowls with/i.test(r.title),
  pizza:r=>/pizza|flatbread/i.test(r.title),
  cheesy:r=>r.ing.reduce((a,[i,u])=>a+(["cheddar","mozzarella","cheese_mex","parmesan","gruyere","ricotta","provolone","swiss","cheddar_slices"].includes(i)?u:0),0)>=0.9,
  spicy:r=>META[r.id].has.includes("spicy"),
  breakfast_eggs:r=>r.meal==="Breakfast" && META[r.id].has.includes("egg"),
  sweet_breakfast:r=>r.meal==="Breakfast" && !META[r.id].has.includes("egg"),
};
const CUISINE_OPTS = [["mexican","Mexican & Tex-Mex"],["italian","Italian"],["american","American comfort"],["southern","Southern & Cajun"],["chinese","Chinese"],["japanese","Japanese"],["korean","Korean"],["thai","Thai"],["vietnamese","Vietnamese"],["indian","Indian"],["mediterranean","Greek & Mediterranean"],["middleeastern","Middle Eastern"],["caribbean","Caribbean & Latin"],["hawaiian","Hawaiian"],["european","French & Spanish"],["african","African"]];
const CUISINE_LABEL = Object.fromEntries(CUISINE_OPTS);

/* ------------------------------------------------------------------ house rule: no enchiladas */
for(let i=RECIPES.length-1;i>=0;i--) if(/enchilada/i.test(RECIPES[i].id+" "+RECIPES[i].title)) RECIPES.splice(i,1);
// near-duplicates of other dishes (see recipes/INDEX.md before adding new ones)
const RETIRED = new Set(["tikka-masala","chickpea-curry","breakfast-sandwiches","chicken-teriyaki"]);
for(let i=RECIPES.length-1;i>=0;i--) if(RETIRED.has(RECIPES[i].id)) RECIPES.splice(i,1);

/* ------------------------------------------------------------------ build-your-own breakfast sandwiches */

const BSB = {
  id:"breakfast-sandwich-builder",
  protein:[
    {k:"ts",label:"Homemade turkey sausage",short:"Turkey Sausage",ing:[["ground_turkey",1,"1 lb ground turkey (for 6 homemade sausage patties)"]],tag:"turkey",
     pantry:"Sausage seasoning: 1 tsp dried sage, ½ tsp dried thyme, ½ tsp fennel seed (crushed), ½ tsp garlic powder, 1 tsp maple syrup or brown sugar, ¾ tsp salt, ½ tsp black pepper, pinch of red pepper flakes, 1 tbsp oil",
     steps:["Make the turkey sausage: mix the ground turkey with the sage, thyme, fennel, garlic powder, maple, salt, pepper and pepper flakes just until combined. Wet your hands and shape 6 thin patties, a little wider than your bread (they shrink).","Cook the patties in the oil in a skillet over medium heat, 4 to 5 minutes per side, until browned and 165°F inside."]},
    {k:"tb",label:"Turkey bacon",short:"Turkey Bacon",ing:[["turkey_bacon",0.75,"12 slices turkey bacon"]],tag:"turkey",pantry:"",
     steps:["Cook the turkey bacon in a skillet over medium, 3 to 4 minutes per side, until crisp at the edges (or bake on a rack at 400°F for 12 to 15 minutes)."]},
    {k:"ps",label:"Pork sausage",short:"Sausage",ing:[["breakfast_sausage",1,"1 lb breakfast sausage, in 6 patties"]],tag:"pork",pantry:"",
     steps:["Shape the sausage into 6 thin patties and cook over medium, 4 minutes per side, until browned and cooked through."]},
    {k:"bc",label:"Bacon",short:"Bacon",ing:[["bacon",1,"12 slices bacon"]],tag:"pork",pantry:"",
     steps:["Bake the bacon on a rack at 400°F for 15 to 18 minutes until crisp."]},
    {k:"no",label:"No meat",short:"",ing:[],tag:"",pantry:"",steps:[]},
  ],
  egg:[
    {k:"egg",label:"Egg",short:"Egg",ing:[["eggs",0.5,"6 eggs"]],pantry:"1 tbsp butter",
     steps:["Make the eggs: whisk the eggs with a pinch of salt and pepper. Pour into a buttered 8-inch nonstick skillet over low heat, cover and cook until just set, 3 to 4 minutes. Slide out and cut into 6 squares. (Or fry each egg in a greased canning ring for perfect rounds.)"]},
    {k:"no",label:"No egg",short:"",ing:[],pantry:"",steps:[]},
  ],
  cheese:[
    {k:"ch",label:"Cheddar",short:"Cheddar",ing:[["cheddar_slices",0.75,"6 slices cheddar or American"]]},
    {k:"pj",label:"Pepper jack",short:"Pepper Jack",ing:[["pepper_jack",0.75,"6 slices pepper jack"]]},
    {k:"no",label:"No cheese",short:"",ing:[]},
  ],
  bread:[
    {k:"hb",label:"Homemade biscuits",short:"Homemade Biscuits",time:25,ing:[["flour",0.11,"2 cups all-purpose flour, plus more for dusting"],["butter",0.19,"6 tbsp cold butter, cubed"],["buttermilk",0.2,"¾ cup cold buttermilk"]],
     pantry:"1 tbsp baking powder, ½ tsp baking soda, 1 tsp salt, 1 tsp sugar",
     steps:["Make the biscuits: heat the oven to 425°F. Whisk the flour, baking powder, baking soda, salt and sugar. Cut in the cold butter with a fork or your fingertips until it looks like coarse crumbs with some pea-size pieces.","Stir in the buttermilk just until a shaggy dough forms. Pat into a rectangle on a floured counter, fold it in thirds like a letter, pat out and fold again twice more (this makes flaky layers). Pat to 1 inch thick and cut 6 biscuits with a floured cutter. Don't twist the cutter.","Bake on a sheet pan, touching, 12 to 15 minutes until tall and golden. Brush the tops with melted butter."]},
    {k:"sb",label:"Store biscuits",short:"Biscuits",time:15,ing:[["biscuits",0.75,"6 refrigerated biscuits"]],pantry:"",
     steps:["Bake the biscuits according to the package until golden."]},
    {k:"em",label:"English muffins",short:"English Muffins",time:0,ing:[["english_muffins",1,"6 English muffins, split"]],pantry:"",
     steps:["Split and toast the English muffins and butter them lightly."]},
    {k:"bg",label:"Bagels",short:"Bagels",time:0,ing:[["bagels",1,"6 bagels, split"]],pantry:"",
     steps:["Split and toast the bagels."]},
  ],
};
const BSB_DEFAULT = {protein:"ts",egg:"egg",cheese:"ch",bread:"hb"};
const bsbId = sel => sel.protein===BSB_DEFAULT.protein&&sel.egg===BSB_DEFAULT.egg&&sel.cheese===BSB_DEFAULT.cheese&&sel.bread===BSB_DEFAULT.bread ? BSB.id : `${BSB.id}~${sel.protein}-${sel.egg}-${sel.cheese}-${sel.bread}`;
function bsbSel(id){ if(id===BSB.id) return {...BSB_DEFAULT}; const [p,e,c,b]=id.split("~")[1].split("-"); return {protein:p,egg:e,cheese:c,bread:b}; }
function bsbMake(sel){
  const P=BSB.protein.find(x=>x.k===sel.protein), E=BSB.egg.find(x=>x.k===sel.egg), C=BSB.cheese.find(x=>x.k===sel.cheese), B=BSB.bread.find(x=>x.k===sel.bread);
  const fill=[P.short,E.short,C.short].filter(Boolean);
  const title = fill.length ? (fill.length>1 ? fill.slice(0,-1).join(", ")+" & "+fill.slice(-1) : fill[0])+" "+B.short : "Buttered "+B.short;
  const steps=[...B.steps.slice(0, B.k==="hb"?3:0), ...P.steps, ...E.steps];
  if(C.ing.length) steps.push(`Lay a slice of ${C.label.toLowerCase()} on each ${E.ing.length?"egg square":P.ing.length?"patty":"bottom half"} for the last 30 seconds of cooking (or cover the pan briefly) so it melts.`);
  if(B.k!=="hb") steps.unshift(...B.steps);
  steps.push(`Build each sandwich: ${B.short.toLowerCase().replace("homemade ","")}${P.ing.length?", "+P.label.toLowerCase().replace("homemade ",""):""}${E.ing.length?", egg":""}${C.ing.length?", cheese":""}, top. Eat now, or cool completely, wrap each in foil or parchment and freeze for grab-and-go mornings.`);
  const has=new Set(["gluten"]); if(E.ing.length) has.add("egg"); if(C.ing.length||B.k==="hb"||B.k==="sb") has.add("dairy"); if(P.tag==="pork") has.add("pork");
  const r={id:bsbId(sel), base:bsbId(sel)===BSB.id?undefined:BSB.id, builder:"bsb", title, shortTitle:title, meal:"Breakfast",
    time:Math.max(15,15+(B.time||0)+(P.k==="ts"?5:0)), serves:6,
    blurb:"Your breakfast sandwich, your way. Pick the protein (including homemade turkey sausage), egg, cheese and bread, from scratch buttermilk biscuits to English muffins. Make 6 at once and freeze extras.",
    ing:[...B.ing,...P.ing,...E.ing,...C.ing],
    pantry:[B.pantry,P.pantry,E.pantry].filter(Boolean).join("; ")||"Butter, salt, pepper",
    steps, tip:"Freeze them individually wrapped, then microwave 60 to 90 seconds from the fridge or about 2 minutes from frozen, flipping halfway. Biscuits stay flakier if you finish them in a 350°F oven for 5 minutes.",
    variantLabel:title};
  META[r.id]={has:[...has],cuisine:"american",protein:P.tag||(E.ing.length?"egg":"veg"),skill:B.k==="hb"?2:1};
  const m=META[r.id]; m.veg=!P.tag; m.pesc=m.veg;
  STORAGE[r.id]=[4,3,"Wrap each sandwich in foil or parchment. Reheat from the fridge: unwrap, wrap in a paper towel, microwave 60 to 90 seconds. From frozen: about 2 minutes, flipping halfway."];
  return r;
}
const BSB_ALL = [];
for(const p of BSB.protein) for(const e of BSB.egg) for(const c of BSB.cheese) for(const b of BSB.bread) BSB_ALL.push(bsbMake({protein:p.k,egg:e.k,cheese:c.k,bread:b.k}));
RECIPES.push(BSB_ALL.find(r=>r.id===BSB.id));

const MORE6 = [];
for(const r of MORE6){ META[r.id]=r.m; STORAGE[r.id]=r.st; delete r.m; delete r.st; RECIPES.push(r); }

/* ------------------------------------------------------------------ "make it with": protein swaps */
const PROTEIN_LB = {chicken_thigh:1.5,chicken_breast:1.5,sirloin:1.5,flank_steak:1.5,shaved_beef:0.75,pork_tenderloin:1.25,shrimp:1,tofu:0.875,
  salmon:1.25,white_fish:1,ahi_tuna:0.5,ground_beef:1,ground_turkey:1,ground_pork:1,italian_sausage:1,chorizo:0.5625,rotisserie:2.1,brown_lentils:2.4,black_beans:0.6};
const N = {
  chickenPieces:"Chicken: cook bite-size pieces 5 to 7 minutes, until no longer pink (165°F).",
  steak:"Steak: slice thin across the grain and sear over high heat 1 to 2 minutes per side. Don't overcook.",
  shrimp:"Shrimp: they cook in 1 to 2 minutes per side. Add them near the end so they stay juicy.",
  pork:"Pork: slice tenderloin thin and cook 4 to 6 minutes, until just 145°F.",
  tofu:"Tofu: press 15 minutes, toss with 1 tbsp cornstarch and pan-fry until golden before adding sauce.",
  beef:"Ground beef: brown well, breaking it up, and drain excess fat.",
  turkey:"Ground turkey: it's lean, so add 1 tbsp oil and season a little more boldly.",
  groundPork:"Ground pork: brown until crisp at the edges and drain some of the fat.",
  sausage:"Italian sausage: remove casings, brown and crumble. It brings its own seasoning, so go easy on salt.",
  lentils:"Lentils: simmer 1 cup dry brown lentils per pound of meat for 20 minutes until tender, drain, and stir in where the recipe adds the meat.",
  shrimpChopped:"Shrimp: chop and sauté 2 minutes in a little oil with salt and chili powder, then use in place of the chicken.",
  beans:"Black beans: use drained beans in place of the chicken. Mash a few for a creamier filling.",
  beefShredded:"Ground beef: brown with salt, cumin and garlic, drain, and use in place of the chicken.",
  salmon:"Salmon: cook about 10 to 12 minutes at 425°F, until it flakes.",
  cod:"Cod: thinner and leaner. Cook 2 to 3 minutes less than salmon and handle gently.",
  chickenFillet:"Chicken breast: pound to ¾ inch and cook 5 to 6 minutes per side to 165°F.",
};
const SWAP_GROUPS = {
  pieces:{items:["chicken_thigh","chicken_breast","sirloin","flank_steak","shaved_beef","pork_tenderloin","shrimp","tofu"], opts:[
    {key:"chicken",label:"Chicken",item:"chicken_thigh",protein:"chicken",text:"boneless chicken thighs, in bite-size pieces",word:"Chicken",note:N.chickenPieces},
    {key:"steak",label:"Steak",item:"sirloin",protein:"beef",text:"sirloin steak, thinly sliced",word:"Steak",note:N.steak},
    {key:"shrimp",label:"Shrimp",item:"shrimp",protein:"shrimp",text:"raw shrimp, peeled and deveined",word:"Shrimp",note:N.shrimp},
    {key:"pork",label:"Pork",item:"pork_tenderloin",protein:"pork",text:"pork tenderloin, thinly sliced",word:"Pork",note:N.pork},
    {key:"tofu",label:"Tofu",item:"tofu",protein:"veg",text:"extra-firm tofu, pressed and cubed",word:"Tofu",note:N.tofu,oz:true}]},
  ground:{items:["ground_beef","ground_turkey","ground_pork","italian_sausage","chorizo"], opts:[
    {key:"beef",label:"Ground beef",item:"ground_beef",protein:"beef",text:"ground beef",word:"Beef",note:N.beef},
    {key:"turkey",label:"Ground turkey",item:"ground_turkey",protein:"turkey",text:"ground turkey",word:"Turkey",note:N.turkey},
    {key:"pork",label:"Ground pork",item:"ground_pork",protein:"pork",text:"ground pork",word:"Pork",note:N.groundPork},
    {key:"sausage",label:"Italian sausage",item:"italian_sausage",protein:"pork",text:"Italian sausage, casings removed",word:"Sausage",note:N.sausage},
    {key:"lentils",label:"Lentils (veg)",item:"brown_lentils",protein:"veg",text:"dry brown lentils",word:"Lentil",note:N.lentils,cups:true}]},
  shredded:{items:["rotisserie"], opts:[
    {key:"chicken",label:"Chicken",item:"rotisserie",protein:"chicken",text:"shredded rotisserie chicken",word:"Chicken",note:"",shred:true},
    {key:"shrimp",label:"Shrimp",item:"shrimp",protein:"shrimp",text:"raw shrimp, chopped",word:"Shrimp",note:N.shrimpChopped},
    {key:"beef",label:"Ground beef",item:"ground_beef",protein:"beef",text:"ground beef",word:"Beef",note:N.beefShredded},
    {key:"beans",label:"Black beans (veg)",item:"black_beans",protein:"veg",text:"black beans, drained",word:"Black Bean",note:N.beans,cans:true}]},
  fillet:{items:["salmon","white_fish"], opts:[
    {key:"salmon",label:"Salmon",item:"salmon",protein:"fish",text:"salmon fillet, in portions",word:"Salmon",note:N.salmon},
    {key:"cod",label:"Cod",item:"white_fish",protein:"fish",text:"cod fillets, in portions",word:"Cod",note:N.cod},
    {key:"shrimp",label:"Shrimp",item:"shrimp",protein:"shrimp",text:"large raw shrimp, peeled",word:"Shrimp",note:N.shrimp},
    {key:"chicken",label:"Chicken",item:"chicken_breast",protein:"chicken",text:"chicken breasts",word:"Chicken",note:N.chickenFillet}]},
};
const NO_SWAP = new Set(["birria-tacos","carnitas-bowls","pulled-pork","roast-chicken","cuban-mojo-pork","pozole-rojo","lox-bagels","tuna-melt","poke-bowls"]);
const TITLE_WORD = {chicken_thigh:/chicken/i,chicken_breast:/chicken/i,rotisserie:/chicken/i,sirloin:/steak|beef/i,flank_steak:/steak|beef/i,shaved_beef:/beef/i,
  ground_beef:/beef/i,ground_turkey:/turkey/i,ground_pork:/pork/i,pork_tenderloin:/pork/i,italian_sausage:/sausage/i,chorizo:/chorizo/i,shrimp:/shrimp/i,salmon:/salmon/i,white_fish:/fish|cod/i,tofu:/tofu/i};
const BODY_WORD = {chicken_thigh:"chicken",chicken_breast:"chicken",rotisserie:"chicken",sirloin:"steak|beef",flank_steak:"steak|beef",shaved_beef:"beef",ground_beef:"beef",ground_turkey:"turkey",
  ground_pork:"pork",pork_tenderloin:"pork",italian_sausage:"sausage",chorizo:"chorizo",shrimp:"shrimp",salmon:"salmon",white_fish:"fish|cod",tofu:"tofu"};
const MEAT_TAGS = {beef:["ground_beef","sirloin","flank_steak","shaved_beef","chuck_roast"],pork:["ground_pork","pork_tenderloin","pork_shoulder","italian_sausage","chorizo","bacon","pepperoni","smoked_sausage","breakfast_sausage","salami","deli_ham","dumplings"],
  shellfish:["shrimp"],fish:["salmon","white_fish","ahi_tuna","smoked_salmon","tuna","fish_sauce"]};
const ANIMAL = new Set(["chicken_thigh","chicken_breast","rotisserie","whole_chicken","ground_turkey","deli_turkey",...Object.values(MEAT_TAGS).flat()].filter(x=>x!=="fish_sauce"));
const VARIANTS = {};
const ITEM_KEY = {chicken_thigh:"chicken",chicken_breast:"chicken",rotisserie:"chicken",sirloin:"steak",flank_steak:"steak",shaved_beef:"steak",pork_tenderloin:"pork",shrimp:"shrimp",tofu:"tofu",ground_beef:"beef",ground_turkey:"turkey",ground_pork:"pork",italian_sausage:"sausage",chorizo:"chorizo",salmon:"salmon",white_fish:"cod"};
const ITEM_LABEL = {chicken:"Chicken",steak:"Steak",pork:"Pork",shrimp:"Shrimp",tofu:"Tofu",beef:"Ground beef",turkey:"Ground turkey",sausage:"Italian sausage",chorizo:"Chorizo",salmon:"Salmon",cod:"Cod"};
const qtyText = n => { const w=Math.floor(n+1e-9), f=Math.round((n-w)*4)/4; const fr={0:"",0.25:"¼",0.5:"½",0.75:"¾",1:""}[f]; return ((f===1?w+1:w)||"")+(fr||"") || "¼"; };
function makeVariants(r){
  if(NO_SWAP.has(r.id) || r.builder) return [];
  const k=r.ing.findIndex(([i])=>Object.values(SWAP_GROUPS).some(g=>g.items.includes(i)));
  if(k<0) return [];
  const [baseItem, baseUse]=r.ing[k];
  const group=Object.values(SWAP_GROUPS).find(g=>g.items.includes(baseItem));
  const lb=baseUse*PROTEIN_LB[baseItem], out=[];
  const baseKey=ITEM_KEY[baseItem];
  for(const o of group.opts){
    if(o.item===baseItem || o.key===baseKey) continue;
    const use=+(lb/PROTEIN_LB[o.item]).toFixed(3);
    const amount = o.oz ? `${Math.round(lb*16/14)*14||14} oz` : o.cups ? `${qtyText(lb)} cup${lb>1?"s":""}` : o.cans ? `${Math.max(1,Math.round(use))} can${Math.round(use)>1?"s":""}` : o.shred ? `${qtyText(lb*2)} cups` : `${qtyText(lb)} lb`;
    const ing=r.ing.map((x,j)=>j===k?[o.item,o.cans?Math.max(1,Math.round(use)):use,`${amount} ${o.text}`]:x);
    const tre=TITLE_WORD[baseItem];
    let title = tre && tre.test(r.title) ? r.title.replace(tre,o.word) : `${r.title} (${o.label.replace(/ \(veg\)/,"").toLowerCase()})`;
    const bw=BODY_WORD[baseItem], ow=o.word.toLowerCase();
    const swapWords = s => bw ? s.replace(new RegExp(`\\b(${bw})\\b(?! (broth|stock|bouillon))`,"gi"), m=>m[0]===m[0].toUpperCase()?o.word:ow) : s;
    const v=Object.assign({},r,{id:r.id+"~"+o.key, base:r.id, variant:o.key, variantLabel:o.label, title, ing,
      blurb:swapWords(r.blurb), steps:r.steps.map(swapWords), swapNote:o.note});
    const bm=META[r.id], has=new Set(bm.has.filter(t=>!["beef","pork","shellfish","fish"].includes(t)));
    for(const [tag,items] of Object.entries(MEAT_TAGS)) if(ing.some(([i])=>items.includes(i))) has.add(tag);
    const vegNow=!ing.some(([i])=>ANIMAL.has(i));
    META[v.id]=Object.assign({},bm,{has:[...has],protein:vegNow?"veg":o.protein,veg:vegNow&&!has.has("fish"),pesc:!ing.some(([i])=>ANIMAL.has(i)&&!["shrimp","salmon","white_fish","ahi_tuna","smoked_salmon","tuna"].includes(i))});
    const st=STORAGE[r.id]||[3,0,RH.micro], sea=["shrimp","fish"].includes(o.protein);
    STORAGE[v.id]=[sea?Math.min(st[0],2):st[0], sea?0:st[1], st[2]];
    out.push(v);
  }
  return out;
}
const R_ALL = {};
for(const r of RECIPES){ R_ALL[r.id]=r; VARIANTS[r.id]=makeVariants(r); for(const v of VARIANTS[r.id]) R_ALL[v.id]=v; }
for(const r of BSB_ALL) R_ALL[r.id]=r;
const baseOf = r => r.base ? R_ALL[r.base] : r;
const versionsOf = r => { const b=baseOf(r); return [b, ...(VARIANTS[b.id]||[])]; };
const proteinLabel = r => { if(r.base) return r.variantLabel; const k=r.ing.findIndex(([i])=>ITEM_KEY[i]); return k<0 ? "Original" : ITEM_LABEL[ITEM_KEY[r.ing[k][0]]]; };


/* finish the new recipes and every protein / builder version */
for(const r of MORE6){ const m=META[r.id]; m.veg=["veg","egg"].includes(m.protein); m.pesc=m.veg||["fish","shrimp"].includes(m.protein); }
for(const r of Object.values(R_ALL)){ if(!r.art) r.art=ART.A("bowl","#2E3A44","#E9E4DA",ART.sauce("#C9772A","#9E5214","#E2973A"),ART.herbs(14)); const n=nutritionOf(r); r.kcal=n.kcal; r.protein=n.protein; }
function versionPanel(r,slot){
  if(r.builder) return bsbPanel(r,slot);
  const vs=versionsOf(r); if(vs.length<2) return null;
  const ok=S.profile?vs.filter(eligible):vs; if(ok.length<2) return null;
  return el("div",{class:"vpanel"}, el("span",{class:"eyebrow"},"Make it with"), el("div",{class:"vchips"}, ok.map(v=>el("button",{class:"chip"+(v.id===r.id?" on":""),title:v.id===r.id?"":signed(kcalDelta(r.id,v.id,slot&&slot.meal).serving)+" kcal per serving",onclick:()=>{ if(slot&&!slot.leftover){ swapSlot(slot.meal,slot.i,v.id); openRecipe(v.id,Object.assign({},slot,{id:v.id})); } else openRecipe(v.id); }},proteinLabel(v), v.id===r.id?null:chipK(kcalDelta(r.id,v.id,slot&&slot.meal))))),
    el("p",{class:"note",style:"margin:0"},"Numbers show calories per serving compared with this version. Ingredients, steps, nutrition, cost and your grocery list switch to match."));
}
function bsbPanel(r,slot){
  const sel=bsbSel(r.id);
  const go=(k,v)=>{ const id=bsbId({...sel,[k]:v}); if(slot&&!slot.leftover){ swapSlot(slot.meal,slot.i,id); openRecipe(id,Object.assign({},slot,{id})); } else openRecipe(id); };
  const row=(k,label,opts)=>el("div",{class:"bsbrow"}, el("span",{class:"eyebrow"},label), el("div",{class:"vchips"}, opts.map(o=>{ const id=bsbId({...sel,[k]:o.k}); return el("button",{class:"chip"+(sel[k]===o.k?" on":""),onclick:()=>go(k,o.k)},o.label, sel[k]===o.k?null:chipK(kcalDelta(r.id,id,"breakfast"))); })));
  return el("div",{class:"vpanel bsb"}, el("b",{},"Build your sandwich"), row("protein","Protein",BSB.protein), row("egg","Egg",BSB.egg), row("cheese","Cheese",BSB.cheese), row("bread","Bread",BSB.bread),
    el("p",{class:"note",style:"margin:0"},"Each choice updates the recipe, nutrition, cost and shopping list"+(slot?", and saves to "+slot.day+".":".")));
}

/* ------------------------------------------------------------------ calorie change when you swap */
// per serving, plus what each person actually eats once their portion re-fits the new dish
function kcalDelta(fromId, toId, meal){
  const a=R_BY_ID[fromId], b=R_BY_ID[toId]; if(!a||!b||fromId===toId) return null;
  const ka=nutritionOf(a).kcal, kb=nutritionOf(b).kcal, m=meal||b.meal.toLowerCase();
  const ps=S.profile?people():[];
  return {serving:Math.round(kb-ka), people:ps.map((p,j)=>({name:personName(p,j), d:Math.round(portionFor(p,m,b)*kb-portionFor(p,m,a)*ka)}))};
}
const signed = v => Math.abs(v)<10 ? "±0" : (v>0?"+":"−")+fmtInt(Math.abs(v));
const chipK = d => { const v=d?d.serving:0; return el("small",{class:"chipk "+(Math.abs(v)<10?"":v>0?"up":"down")},signed(v)); };
function deltaBadge(d){
  if(!d) return null; const v=d.serving, cls=Math.abs(v)<10?"same":v>0?"up":"down";
  return el("span",{class:"kd "+cls,title:"Calories per serving compared with what's planned now"}, Math.abs(v)<10?"same kcal":signed(v)+" kcal");
}
function deltaPeople(d){
  if(!d||!d.people.length||d.people.every(x=>Math.abs(x.d)<10)) return null;
  return el("div",{class:"kdp"}, d.people.length>1||d.people[0].d!==d.serving ? "On each plate: "+d.people.map(x=>x.name+" "+signed(x.d)).join(" · ")+" kcal" : null);
}

/* ------------------------------------------------------------------ swap picker */
let SWP = null; // {meal, i, q, cuisine, protein, quick, sort, any}
function versionsFor(meal, anyMeal){
  // one entry per dish: its best-fitting version for this person/household, plus every eligible version
  const R=rng("swap"+S.plan.seed+meal), out=[];
  for(const b of RECIPES){
    if(!anyMeal && !(b.meal.toLowerCase()===meal || (meal==="lunch" && b.meal==="Dinner" && b.time<=30))) continue;
    const vs=versionsOf(b).filter(eligible); if(!vs.length) continue;
    const j=R(); const scored=vs.map(v=>({v,s:score(v,j)+(v.base?0:2.5)})).sort((a,b)=>b.s-a.s);
    out.push({best:scored[0].v, s:scored[0].s, all:vs});
  }
  return out;
}
function openSwap(meal, i){
  SWP = {meal, i, q:"", cuisine:"", protein:"", quick:false, sort:"best", any:false};
  renderSwap(); $("#sheet").hidden=false; document.body.style.overflow="hidden"; $("#sheet").scrollTop=0;
}
function renderSwap(){ keepSheetScroll(drawSwap); }
function drawSwap(){
  const p=$("#panel"); p.innerHTML=""; const {meal,i}=SWP, key=meal[0], cur=S.plan[key][i], day=planDays()[i];
  let list=versionsFor(meal, SWP.any);
  const q=SWP.q.trim().toLowerCase();
  if(q) list=list.filter(x=>x.all.some(v=>(v.title+" "+v.blurb+" "+v.ing.map(z=>z[2]).join(" ")).toLowerCase().includes(q)));
  if(SWP.cuisine) list=list.filter(x=>META[x.best.id].cuisine===SWP.cuisine);
  if(SWP.protein){ list=list.map(x=>{ const m=x.all.filter(v=>{ const pr=META[v.id].protein; return SWP.protein==="seafood"?["shrimp","fish"].includes(pr):SWP.protein==="veg"?META[v.id].veg:SWP.protein==="chicken"?["chicken","turkey"].includes(pr):pr===SWP.protein; }); return m.length?{...x,best:m[0],all:x.all}:null; }).filter(Boolean); }
  if(SWP.quick) list=list.filter(x=>x.best.time<=30);
  const curK=cur&&R_BY_ID[cur]?nutritionOf(R_BY_ID[cur]).kcal:0;
  const sorters={close:(a,b)=>Math.abs(nutritionOf(a.best).kcal-curK)-Math.abs(nutritionOf(b.best).kcal-curK), best:(a,b)=>b.s-a.s, fast:(a,b)=>a.best.time-b.best.time, cheap:(a,b)=>recipeCost(a.best).perServing-recipeCost(b.best).perServing, light:(a,b)=>nutritionOf(a.best).kcal-nutritionOf(b.best).kcal, protein:(a,b)=>nutritionOf(b.best).protein-nutritionOf(a.best).protein};
  list.sort(sorters[SWP.sort]);
  const pick=id=>{ swapSlot(meal,i,id); closeSheet(); };
  const cardOf=(x,rv)=>{ const r=rv||x.best, n=nutritionOf(r), isCur=x.all.some(v=>v.id===cur), d=isCur?null:kcalDelta(cur,r.id,meal);
    return el("div",{class:"swapcard"+(isCur?" current":"")},
      el("button",{class:"swpic",onclick:()=>pick(r.id),"aria-label":"Choose "+r.title}, el("img",{src:imgFor(r),"data-rid":r.id,alt:"",loading:"lazy"}), isCur?el("span",{class:"inweek"},"Current"):null),
      el("div",{class:"swbody"},
        el("div",{class:"eyebrow"},CUISINE_LABEL[META[r.id].cuisine]||""),
        el("div",{class:"swtitle"}, el("button",{class:"slottitle",onclick:()=>pick(r.id)},r.title), deltaBadge(d)),
        el("div",{class:"meta"}, el("span",{},r.time+" min"), el("span",{},fmtInt(n.kcal)+" kcal"), el("span",{},n.protein+" g protein"), el("span",{},money(recipeCost(r).perServing))),
        deltaPeople(d),
        x.all.length>1 ? el("div",{class:"vchips"}, el("span",{class:"note"},"Make it with:"), x.all.map(v=>el("button",{class:"chip"+(v.id===cur?" on":""),onclick:()=>pick(v.id),title:v.id===cur?"":signed(kcalDelta(cur,v.id,meal).serving)+" kcal per serving"},proteinLabel(v), v.id===cur?null:chipK(kcalDelta(cur,v.id,meal))))) : null,
        el("button",{class:"linkbtn",onclick:()=>openRecipe(r.id,{day,i,meal,label:meal[0].toUpperCase()+meal.slice(1),id:r.id,leftover:false})},"View recipe")));
  };
  const grid=el("div",{class:"swapgrid"}, list.map(x=>cardOf(x)));
  // dishes within about 8% of what's planned now, each in its closest-calorie version
  const near=Math.max(50,curK*0.08);
  const similar=curK ? list.filter(x=>!x.all.some(v=>v.id===cur)).map(x=>{ const v=x.all.slice().sort((a,b)=>Math.abs(nutritionOf(a).kcal-curK)-Math.abs(nutritionOf(b).kcal-curK))[0]; return {x,v,gap:Math.abs(nutritionOf(v).kcal-curK)}; })
    .filter(o=>o.gap<=near).sort((a,b)=>a.gap-b.gap).slice(0,6) : [];
  const optionsTotal=list.reduce((a,x)=>a+x.all.length,0);
  p.append(el("div",{class:"content swapper"},
    el("div",{class:"swaphead"}, el("div",{}, el("div",{class:"eyebrow"},"Swap "+day+" "+meal), el("h2",{id:"dTitle"},"Pick something else")), el("button",{class:"close static","aria-label":"Close",onclick:closeSheet},"×")),
    el("p",{class:"note",style:"margin:0"},`${list.length} dishes, ${optionsTotal} ways to make them, all fitting your answers. Tap a dish or a protein to swap it in.`),
    el("div",{class:"swapctl"},
      el("input",{class:"search",id:"swq",type:"search",placeholder:"Search: curry, salmon, tacos…",value:SWP.q,oninput:e=>{ SWP.q=e.target.value; const pos=e.target.selectionStart; renderSwap(); const f=$("#swq"); f.focus(); f.setSelectionRange(pos,pos); }}),
      el("select",{id:"swc","aria-label":"Cuisine",onchange:e=>{SWP.cuisine=e.target.value;renderSwap();}}, el("option",{value:""},"Any cuisine"), CUISINE_OPTS.map(([k,l])=>el("option",{value:k,selected:SWP.cuisine===k},l))),
      el("select",{id:"swp","aria-label":"Protein",onchange:e=>{SWP.protein=e.target.value;renderSwap();}}, [["","Any protein"],["chicken","Chicken & turkey"],["beef","Beef"],["pork","Pork"],["seafood","Seafood"],["veg","Vegetarian"]].map(([k,l])=>el("option",{value:k,selected:SWP.protein===k},l))),
      el("select",{id:"sws","aria-label":"Sort",onchange:e=>{SWP.sort=e.target.value;renderSwap();}}, [["best","Best match"],["close","Closest calories"],["fast","Fastest"],["cheap","Cheapest"],["light","Fewest calories"],["protein","Most protein"]].map(([k,l])=>el("option",{value:k,selected:SWP.sort===k},l))),
      el("label",{class:"tog"}, el("input",{type:"checkbox",id:"swquick",checked:SWP.quick,onchange:e=>{SWP.quick=e.target.checked;renderSwap();}}), "30 min or less"),
      el("label",{class:"tog"}, el("input",{type:"checkbox",id:"swany",checked:SWP.any,onchange:e=>{SWP.any=e.target.checked;renderSwap();}}), "Show all meal types"),
      el("button",{class:"btn small",onclick:()=>{ if(list.length){ const x=list[Math.floor(Math.random()*list.length)]; pick(x.best.id); } }},"Surprise me")),
    list.length ? el("div",{},
      similar.length ? el("section",{class:"simcal"},
        el("h3",{class:"sub"},`Similar calories (within ${fmtInt(near)} kcal of ${fmtInt(curK)} per serving)`),
        el("div",{class:"swapgrid"}, similar.map(o=>cardOf(o.x,o.v)))) : null,
      el("h3",{class:"sub"},"All options"), el("p",{class:"note",style:"margin:-4px 0 8px"},"Green numbers mean fewer calories per serving than what's planned now, red numbers mean more."), grid)
    : el("div",{class:"empty"},"Nothing matches those filters. Clear the search or try another cuisine.")));
}

/* ------------------------------------------------------------------ meal prep guide */
const AHEAD_RE=/soup|chili|curry|stew|bake|casserole|ziti|lasagna|enchilada|shells|tagine|gumbo|dal\b|masala|biryani|pozole|red beans|meatball|meatloaf|burrito|muffin|oats|oatmeal|pudding|quiche|picadillo|chana|tinga|pulled|carnitas|birria|mojo|jollof|arroz|dumplings|pot pie|paneer|mujadara|kofta|parfait|salad|stuffed peppers|pinwheel|chickpea/i;
const FRESH_RE=/fish tacos|carbonara|scampi|pad thai|drunken|grilled cheese|french toast|pancake|toast|bagel|poke|huevos|chilaquiles|smoothie|turkish|melt|blt|croque|sandwich|burger|smash|potsticker|katsu|fried rice|ramen|pho/i;
function prepMode(r){ const st=storageOf(r);
  if(st.fridge<=1 || FRESH_RE.test(r.title)) return "fresh";
  if(st.fridge>=3 && AHEAD_RE.test(r.title)) return "ahead";
  return "parts"; }
const PREP_LABEL={ahead:"Cook ahead & reheat",parts:"Prep parts ahead, finish fresh",fresh:"Best cooked fresh"};
const nightMinutes = r => ({ahead:8, parts:Math.max(10,Math.round(r.time*0.45/5)*5), fresh:r.time})[prepMode(r)];
const CHOP_ITEMS=new Set(["onion","bell_peppers","carrots","celery","garlic","ginger","green_onion","broccoli","sweet_potato","baby_potatoes","russet","kale","cabbage","coleslaw","jalapeno","cilantro","parsley","green_beans","asparagus","cherry_tomatoes","roma_tomatoes","bok_choy","spinach"]);
const CHOP_RE=/dic|slic|chop|minc|grat|cub|cut|matchstick|florets|halved|trimm|wedge|shred|julienn/i;
function prepSessions(){
  const days=planDays(), n=days.length;
  const split = n<=3 ? [[0,n]] : [[0,3],[3,n]];
  return split.map(([a,b],si)=>({name: si===0?"Sunday prep":(days[2]||"Midweek")+" evening top-up", covers: days.slice(a,b), from:a, to:b, sessionDay: si===0?-1:2}));
}
function sessionPlan(sess){
  const slots=slotsOf().filter(s=>s.id && !s.leftover && s.i>=sess.from && s.i<sess.to);
  const seen=new Set(), recipes=[]; for(const s of slots) if(!seen.has(s.id)){ seen.add(s.id); recipes.push({r:R_BY_ID[s.id], first:s}); }
  const ahead=recipes.filter(x=>prepMode(x.r)==="ahead"), parts=recipes.filter(x=>prepMode(x.r)!=="ahead");
  // rice
  let rice=0; const riceFor=[];
  for(const {r} of recipes) for(const [i,u,t] of r.ing) if(["jasmine_rice","basmati"].includes(i)){ const m=t.match(/(\d+½|\d+|½)\s*cups?/); const c=m?(m[1]==="½"?0.5:parseFloat(m[1])+(m[1].includes("½")?0.5:0)):1.5; rice+=c; riceFor.push(r.title); }
  // chopping, grouped by vegetable
  const chop={};
  for(const {r} of parts) for(const [i,u,t] of r.ing) if(CHOP_ITEMS.has(i) && (CHOP_RE.test(t) || i==="garlic"||i==="ginger")) (chop[ITEMS[i][0]]=chop[ITEMS[i][0]]||[]).push(`${t} (${r.title})`);
  // marinades, sauces, shredding
  const marinate=[], sauces=[], shred=[];
  for(const {r} of parts){
    const sentences=r.steps.flatMap(st=>st.split(/(?<=\.)\s+(?=[A-Z])/));
    const mre=/marinat/i, pre=/chicken|beef|pork|steak|shrimp|tofu|turkey|salmon|lamb|fish/i;
    const ms=sentences.find(x=>mre.test(x) && pre.test(x)); if(ms) marinate.push({title:r.title, text:ms.replace(/\.?$/,".")});
    const sre=/(whisk|stir|blend|mix|shake)[^.]*(sauce|dressing|glaze|teriyaki|crema|nuoc cham|mayo|tahini|vinaigrette)|quick-pickle|make (the )?(sauce|dressing|gravy|nuoc cham|chili gravy|béchamel)/i;
    const ss=sentences.find(x=>sre.test(x) && !mre.test(x)); if(ss) sauces.push({title:r.title, text:ss.replace(/\.?$/,".")});
    if(r.ing.some(([i])=>i==="rotisserie")){ const t=r.ing.find(([i])=>i==="rotisserie")[2]; shred.push(`${t} (${r.title})`); }
  }
  const before=recipes.reduce((a,x)=>a+x.r.time,0);
  const sessMin=Math.round((ahead.reduce((a,x)=>a+x.r.time,0)*0.6 + Object.values(chop).flat().length*3 + (rice?25:0) + sauces.length*4 + marinate.length*5 + shred.length*5)/5)*5;
  return {recipes, ahead, parts, rice, riceFor, chop, marinate, sauces, shred, before, sessMin};
}
function nightGuide(){
  const days=planDays();
  return days.map((day,i)=>{
    const items=slotsOf().filter(s=>s.i===i && s.id).map(s=>{ const r=R_BY_ID[s.id];
      if(s.leftover) return {meal:s.label, r, mode:"leftover", min:3, text:`Reheat last night's ${r.title}`};
      const mode=prepMode(r), min=nightMinutes(r);
      const text = mode==="ahead" ? `Reheat ${r.title} (cooked on prep day)` : mode==="parts" ? `Finish ${r.title}: veg, sauce${r.ing.some(([x])=>["jasmine_rice","basmati"].includes(x))?" and rice":""} are ready` : `Cook ${r.title} fresh`;
      return {meal:s.label, r, mode, min, text, full:r.time}; });
    return {day, items, min:items.reduce((a,x)=>a+x.min,0), before:items.reduce((a,x)=>a+(x.mode==="leftover"?3:x.full),0)};
  });
}
function renderPrep(){
  const m=$("#app"); m.innerHTML=""; const sessions=prepSessions(), nights=nightGuide();
  const before=nights.reduce((a,x)=>a+x.before,0), after=nights.reduce((a,x)=>a+x.min,0);
  const plans=sessions.map(sessionPlan); const prepTotal=plans.reduce((a,p)=>a+p.sessMin,0);
  m.append(el("div",{class:"planhead"},
    el("div",{}, el("div",{class:"eyebrow"},"Meal prep guide"), el("h2",{},"Cook "+(sessions.length>1?"twice":"once")+", eat all week"),
      el("p",{class:"lede"},"Batch the slow parts into "+(sessions.length>1?"two sessions":"one session")+" so most nights are reheat-or-finish. Everything here comes from your current plan.")),
    el("div",{class:"actions"}, el("button",{class:"btn primary",onclick:()=>showApp("pdf")},"Export with PDF"))));
  m.append(el("div",{class:"summary"},
    el("div",{class:"stat"},el("b",{class:"mono"},"~"+fmtHrs(prepTotal)),el("span",{},"Prep time, total")),
    el("div",{class:"stat"},el("b",{class:"mono"},fmtHrs(before)),el("span",{},"Weeknight cooking before")),
    el("div",{class:"stat"},el("b",{class:"mono"},fmtHrs(after)),el("span",{},"Weeknight cooking after")),
    el("div",{class:"stat"},el("b",{class:"mono"},Math.round(after/Math.max(1,nights.length))+" min"),el("span",{},"Average per day"))));
  sessions.forEach((sess,si)=>{
    const P=plans[si];
    const box=el("div",{class:"prepbox"}, el("header",{}, el("div",{}, el("div",{class:"eyebrow"},"Covers "+sess.covers.join(", ")), el("h3",{},sess.name)), el("span",{class:"mono"},"about "+fmtHrs(P.sessMin))));
    const step=(n,title,body)=>box.append(el("div",{class:"pstep"}, el("span",{class:"pn"},n), el("div",{}, el("b",{},title), body)));
    let k=1;
    if(P.ahead.length) step(k++,"Start the cook-ahead dishes first (they take longest)", el("ul",{}, P.ahead.map(({r,first})=>{ const st=storageOf(r), wait=first.i-sess.sessionDay;
      return el("li",{}, el("button",{class:"linkbtn",onclick:()=>openRecipe(r.id)},r.title), ` — follow the full recipe (${r.time} min, mostly hands-off). Cool, then portion into containers. `,
        el("span",{class:"note"}, wait>st.fridge ? `Eaten ${first.day}: freeze it today and thaw in the fridge the night before.` : `Keeps ${st.fridge} days; first eaten ${first.day}.`)); })));
    if(P.rice) step(k++,`Batch-cook ${qtyText(P.rice)} cups dry rice`, el("p",{}, `Makes about ${Math.round(P.rice*3)} cups cooked for ${[...new Set(P.riceFor)].join(", ")}. Spread on a sheet pan to cool, then refrigerate up to 4 days.`));
    if(P.shred.length) step(k++,"Shred the chicken", el("ul",{}, P.shred.map(t=>el("li",{},t))));
    if(P.marinate.length) step(k++,"Get the marinades going", el("ul",{}, P.marinate.map(x=>el("li",{}, el("b",{},x.title+": "), x.text+" Store in a sealed bag in the fridge up to 24 hours.")) ));
    const chopKeys=Object.keys(P.chop);
    if(chopKeys.length) step(k++,"Chop everything at once", el("div",{class:"chopgrid"}, chopKeys.map(v=>el("div",{}, el("b",{},v), el("ul",{}, P.chop[v].map(t=>el("li",{},t)))))), );
    if(chopKeys.length) box.append(el("p",{class:"note",style:"margin:4px 0 0 40px"},"Store each recipe's chopped veg in its own labeled container, with a damp paper towel over herbs. Onions, peppers and carrots keep 4 days; cut potatoes in water 2 days."));
    if(P.sauces.length) step(k++,"Mix the sauces and dressings", el("ul",{}, P.sauces.map(x=>el("li",{}, el("b",{},x.title+": "), x.text+" Store in a jar."))));
    if(!P.recipes.length) box.append(el("p",{class:"note"},"Nothing to prep for these days."));
    m.append(box);
  });
  m.append(el("h3",{class:"sub",style:"margin-top:24px"},"Night by night"));
  m.append(el("div",{class:"nights"}, nights.map(n=>el("div",{class:"night"},
    el("div",{class:"nh"}, el("b",{},n.day), el("span",{class:"mono"},n.min+" min"+(n.before>n.min?` (was ${n.before})`:""))),
    el("ul",{}, n.items.map(x=>el("li",{}, el("span",{class:"tag "+x.mode},x.meal), " ", x.text, el("span",{class:"note"}," · ~"+x.min+" min"))))))));
}
const fmtHrs = m => m>=60 ? (Math.floor(m/60)+" h"+(m%60?" "+(m%60)+" m":"")) : m+" min";

/* ------------------------------------------------------------------ state */
const R_BY_ID = R_ALL;
const ALL_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const MEALS = [["breakfast","Breakfast"],["lunch","Lunch"],["dinner","Dinner"]];
const DEFAULT_STATE = { profile:null, plan:null, stores:["aldi","walmart"], mode:"cheap", overrides:{}, checked:{}, photos:{} };
let S = structuredClone(DEFAULT_STATE);
let saveTimer = null;
// plans saved under the app's old name (Bundle & Bite) carry over
function lsGet(){ try{ return JSON.parse(localStorage.getItem("mealtote-v1")||localStorage.getItem("bundle-and-bite-v1")||"null"); }catch(e){ return null; } }
function lsSet(v){ try{ localStorage.setItem("mealtote-v1", JSON.stringify(v)); }catch(e){} }
function normalize(v){
  const s = Object.assign(structuredClone(DEFAULT_STATE), v||{});
  s.stores = (s.stores||[]).filter(x=>STORES[x]); if(!s.stores.length) s.stores=["aldi","walmart"];
  const moved = {"tikka-masala":"butter-chicken","chickpea-curry":"chana-masala","breakfast-sandwiches":"breakfast-sandwich-builder~bc-egg-ch-em","chicken-teriyaki":"teriyaki-salmon-bowls~chicken"};
  const fix = x => { const base=String(x||"").split("~")[0]; if(!R_BY_ID[x] && moved[base]) x = R_BY_ID[moved[base]] ? moved[base] : moved[base].split("~")[0]; return R_BY_ID[x]?x:null; };
  if(s.plan){ for(const k of ["b","l","d"]) s.plan[k]=(s.plan[k]||[]).map(fix); }
  return s;
}
function save(){
  S._ts = Date.now(); storePlan(); lsSet(S);
  clearTimeout(saveTimer); saveTimer = setTimeout(pushCloud, 800);
}

/* ------------------------------------------------------------------ pricing & bundling */
const money = n => "$"+n.toFixed(2);
function offers(item){ return ITEMS[item][2]; }
function cheapestIn(item, stores){
  let best=null;
  for(const s of stores){ const o=offers(item)[s]; if(!o) continue;
    const per=o[1]/o[2]; if(!best||per<best.per) best={store:s,per}; }
  return best && best.store;
}
// demand: {item: totalStandardPacks}
function demandFor(recipeIds){
  const d={};
  for(const id of recipeIds){ const r=R_BY_ID[id]; if(!r) continue;
    for(const [item,use] of r.ing) d[item]=(d[item]||0)+use; }
  return d;
}
function packsFor(item, store, need){ const o=offers(item)[store]; return Math.max(1, Math.ceil(need/o[2]-1e-9)); }
function storeCost(item, store, need){ return packsFor(item,store,need)*offers(item)[store][1]; }

function assign(demand){
  const sel = S.stores.slice();
  const items = Object.keys(demand);
  const result = {}; const missing = [];
  let usable = sel;
  if(S.mode==="stops" && sel.length>1){
    // greedy cover: fewest stores that carry everything carriable, cheapest basket breaks ties
    const carriable = items.filter(i=>sel.some(s=>offers(i)[s]));
    const chosen=[]; let left=new Set(carriable);
    while(left.size){
      let best=null;
      for(const s of sel){ if(chosen.includes(s)) continue;
        const cov=[...left].filter(i=>offers(i)[s]);
        const cost=cov.reduce((a,i)=>a+storeCost(i,s,demand[i]),0);
        if(cov.length && (!best || cov.length>best.n || (cov.length===best.n && cost<best.cost))) best={s,n:cov.length,cost};
      }
      if(!best) break;
      chosen.push(best.s); for(const i of [...left]) if(offers(i)[best.s]) left.delete(i);
    }
    usable = chosen;
  }
  for(const i of items){
    const ov = S.overrides[i];
    if(ov && sel.includes(ov) && offers(i)[ov]){ result[i]=ov; continue; }
    let best=null;
    for(const s of usable){ if(!offers(i)[s]) continue; const c=storeCost(i,s,demand[i]); if(!best||c<best.c) best={s,c}; }
    if(best) result[i]=best.s; else missing.push(i);
  }
  return {result, missing};
}
function recipeCost(r){
  let total=0, miss=[];
  const stores=new Set();
  for(const [item,use] of r.ing){
    const s=cheapestIn(item,S.stores);
    if(!s){ miss.push(item); continue; }
    const o=offers(item)[s]; total+=use/o[2]*o[1]; stores.add(s);
  }
  return {total, perServing: total/r.serves, miss, stores:[...stores]};
}
function storesCarrying(item){ return STORE_IDS.filter(s=>offers(item)[s]); }

/* ------------------------------------------------------------------ illustration engine */
function rng(seed){ let h=2166136261; for(const ch of seed) h=Math.imul(h^ch.charCodeAt(0),16777619);
  return ()=>{ h+=0x6D2B79F5; let t=h; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }
function hexToRgb(h){ const n=parseInt(h.slice(1),16); return [n>>16&255,n>>8&255,n&255]; }
function shade(h,a){ const [r,g,b]=hexToRgb(h); const f=a<0?0:255, p=Math.abs(a);
  return `rgb(${Math.round(r+(f-r)*p)},${Math.round(g+(f-g)*p)},${Math.round(b+(f-b)*p)})`; }
function pick(R,arr){ return arr[Math.floor(R()*arr.length)%arr.length]; }

const ART_W=960, ART_H=720;
const artCache = {};
function artFor(r){
  if(artCache[r.id]) return artCache[r.id];
  const c=document.createElement("canvas"); c.width=ART_W; c.height=ART_H;
  drawDish(c.getContext("2d"), r);
  artCache[r.id]=c.toDataURL("image/jpeg",0.9);
  return artCache[r.id];
}

function blobPath(ctx,R,x,y,rad,wob=0.18,pts=9){
  ctx.beginPath();
  const a0=R()*Math.PI*2, rs=[];
  for(let i=0;i<pts;i++) rs.push(rad*(1-wob/2+R()*wob));
  for(let i=0;i<=pts;i++){
    const a=a0+i/pts*Math.PI*2, ri=rs[i%pts], an=a0+(i+0.5)/pts*Math.PI*2, rn=(ri+rs[(i+1)%pts])/2;
    const px=x+Math.cos(a)*ri, py=y+Math.sin(a)*ri;
    if(i===0) ctx.moveTo(px,py);
    else ctx.quadraticCurveTo(x+Math.cos(a-0.5/pts*Math.PI*2)*ri*1.04, y+Math.sin(a-0.5/pts*Math.PI*2)*ri*1.04, px, py);
  }
  ctx.closePath();
}
function roundRectPath(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }

function drawDish(ctx, r){
  const A=r.art, R=rng(r.id), W=ART_W, H=ART_H;
  // table: base, soft vignette light from top-left, fine grain
  ctx.fillStyle=A.bg; ctx.fillRect(0,0,W,H);
  let g=ctx.createRadialGradient(W*0.28,H*0.2,40,W*0.5,H*0.5,W*0.8);
  g.addColorStop(0,"rgba(255,255,255,0.13)"); g.addColorStop(1,"rgba(0,0,0,0.28)");
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<5200;i++){ ctx.fillStyle=`rgba(${R()<0.5?"255,255,255":"0,0,0"},${0.025+R()*0.04})`; ctx.fillRect(R()*W,R()*H,1+R()*2,1+R()*2); }
  // linen napkin, top right
  ctx.save(); ctx.translate(W*0.86,H*0.08); ctx.rotate(0.38);
  ctx.shadowColor="rgba(0,0,0,0.3)"; ctx.shadowBlur=18; ctx.shadowOffsetY=6;
  ctx.fillStyle="#EDE7DA"; ctx.fillRect(-150,-120,300,240); ctx.shadowColor="transparent";
  ctx.strokeStyle="rgba(150,120,90,0.35)"; ctx.lineWidth=3;
  for(let k=-140;k<150;k+=26){ ctx.beginPath(); ctx.moveTo(k,-120); ctx.lineTo(k,120); ctx.stroke(); }
  ctx.strokeStyle="rgba(180,70,50,0.45)"; ctx.lineWidth=5; ctx.strokeRect(-128,-98,256,196);
  ctx.restore();
  // fork bottom left
  ctx.save(); ctx.translate(W*0.07,H*0.78); ctx.rotate(-0.5);
  ctx.shadowColor="rgba(0,0,0,0.35)"; ctx.shadowBlur=10; ctx.shadowOffsetY=5;
  const mg=ctx.createLinearGradient(-12,0,12,0); mg.addColorStop(0,"#9DA3A8"); mg.addColorStop(0.5,"#E8ECEF"); mg.addColorStop(1,"#8B9196"); ctx.fillStyle=mg;
  roundRectPath(ctx,-11,-40,22,240,10); ctx.fill();
  roundRectPath(ctx,-24,-130,48,100,14); ctx.fill();
  ctx.shadowColor="transparent"; ctx.fillStyle=A.bg;
  for(let k=-1;k<=1;k++){ roundRectPath(ctx,k*13-3,-135,6,70,3); ctx.fill(); }
  ctx.restore();

  const cx=W*0.5, cy=H*0.52;
  const geo = drawVessel(ctx, A, cx, cy, R);
  ctx.save(); geo.clip();
  for(const L of A.layers) drawLayer(ctx, L, geo, R, A);
  ctx.restore();
  if(geo.after) geo.after();
  // gentle sheen over food
  ctx.save(); geo.clip();
  g=ctx.createRadialGradient(cx-geo.hx*0.45,cy-geo.hy*0.5,10,cx,cy,geo.hx*1.3);
  g.addColorStop(0,"rgba(255,255,255,0.12)"); g.addColorStop(0.5,"rgba(255,255,255,0)"); g.addColorStop(1,"rgba(0,0,0,0.18)");
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H); ctx.restore();
  // stray garnish on the table
  const strayC = (A.layers.find(l=>l.t==="leaf")||{c:["#4FA046"]}).c;
  for(let i=0;i<7;i++){ const a=R()*Math.PI*2, d=geo.hx*1.18+R()*40;
    leafShape(ctx, cx+Math.cos(a)*d*1.05, cy+Math.sin(a)*d*0.95, 9+R()*6, R()*6, pick(R,strayC)); }
}

function drawVessel(ctx,A,cx,cy,R){
  const vc=A.vc;
  const shadow=(fn)=>{ ctx.save(); ctx.shadowColor="rgba(0,0,0,0.45)"; ctx.shadowBlur=40; ctx.shadowOffsetX=14; ctx.shadowOffsetY=22; fn(); ctx.restore(); };
  let geo;
  const circ=(rad)=>({cx,cy,hx:rad,hy:rad,shape:"circle",clip(){ ctx.beginPath(); ctx.arc(cx,cy,rad,0,Math.PI*2); ctx.clip(); }});
  if(A.vessel==="plate"){
    const R0=300;
    shadow(()=>{ ctx.fillStyle=vc; ctx.beginPath(); ctx.arc(cx,cy,R0,0,Math.PI*2); ctx.fill(); });
    let g=ctx.createRadialGradient(cx-80,cy-90,20,cx,cy,R0); g.addColorStop(0,shade(vc,0.5)); g.addColorStop(1,shade(vc,-0.08));
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,R0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=shade(vc,-0.12); ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy,R0*0.8,0,Math.PI*2); ctx.stroke();
    ctx.strokeStyle="rgba(255,255,255,0.7)"; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(cx,cy,R0*0.8+3,Math.PI*1.05,Math.PI*1.55); ctx.stroke();
    geo=circ(R0*0.86);
  } else if(A.vessel==="bowl"||A.vessel==="pot"){
    const R0=A.vessel==="pot"?285:292;
    if(A.vessel==="pot") shadow(()=>{ ctx.fillStyle=vc; for(const s of[-1,1]){ roundRectPath(ctx,cx+s*R0-40+s*20,cy-34,80,68,30); ctx.fill(); } });
    shadow(()=>{ ctx.fillStyle=vc; ctx.beginPath(); ctx.arc(cx,cy,R0,0,Math.PI*2); ctx.fill(); });
    let g=ctx.createRadialGradient(cx-90,cy-100,10,cx,cy,R0); g.addColorStop(0,shade(vc,0.35)); g.addColorStop(1,shade(vc,-0.2));
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,R0,0,Math.PI*2); ctx.fill();
    // inner wall
    const ri=R0*(A.vessel==="pot"?0.87:0.9);
    g=ctx.createRadialGradient(cx+30,cy+40,ri*0.6,cx,cy,ri); g.addColorStop(0,shade(vc,0.05)); g.addColorStop(1,shade(vc,-0.25));
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,ri,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,0.35)"; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(cx,cy,R0-4,Math.PI*1.0,Math.PI*1.6); ctx.stroke();
    geo=circ(ri*0.97);
    const inner=ri*0.97;
    geo.after=()=>{ ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,inner,0,Math.PI*2); ctx.clip();
      const sg=ctx.createRadialGradient(cx+inner*0.25,cy+inner*0.3,inner*0.7,cx,cy,inner*1.02); sg.addColorStop(0,"rgba(0,0,0,0)"); sg.addColorStop(1,"rgba(0,0,0,0.22)");
      ctx.fillStyle=sg; ctx.fillRect(cx-inner,cy-inner,inner*2,inner*2); ctx.restore(); };
  } else if(A.vessel==="skillet"){
    const R0=280;
    shadow(()=>{ ctx.fillStyle=vc; roundRectPath(ctx,cx+R0-20,cy-26,250,52,24); ctx.fill(); ctx.beginPath(); ctx.arc(cx,cy,R0,0,Math.PI*2); ctx.fill(); });
    let g=ctx.createLinearGradient(cx+R0,cy,cx+R0+250,cy); g.addColorStop(0,"#1C1C1C"); g.addColorStop(1,"#3A3A3A");
    ctx.fillStyle=g; roundRectPath(ctx,cx+R0-20,cy-24,250,48,22); ctx.fill();
    g=ctx.createRadialGradient(cx-80,cy-90,10,cx,cy,R0); g.addColorStop(0,"#4A4A4A"); g.addColorStop(1,"#141414");
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,R0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#1A1A1A"; ctx.beginPath(); ctx.arc(cx,cy,R0*0.9,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,0.18)"; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(cx,cy,R0-5,Math.PI*1.05,Math.PI*1.5); ctx.stroke();
    geo=circ(R0*0.89);
  } else if(A.vessel==="dish"||A.vessel==="sheet"){
    const w=A.vessel==="sheet"?720:640, h=A.vessel==="sheet"?500:470, rr=A.vessel==="sheet"?18:40;
    shadow(()=>{ ctx.fillStyle=vc; roundRectPath(ctx,cx-w/2,cy-h/2,w,h,rr); ctx.fill(); });
    let g=ctx.createLinearGradient(cx-w/2,cy-h/2,cx+w/2,cy+h/2); g.addColorStop(0,shade(vc,0.35)); g.addColorStop(1,shade(vc,-0.2));
    ctx.fillStyle=g; roundRectPath(ctx,cx-w/2,cy-h/2,w,h,rr); ctx.fill();
    const iw=w-(A.vessel==="sheet"?34:56), ih=h-(A.vessel==="sheet"?34:56);
    if(A.vessel==="sheet"){ ctx.fillStyle="#E9DFC9"; ctx.save(); ctx.translate(cx,cy); ctx.rotate(-0.02); roundRectPath(ctx,-iw/2+4,-ih/2+4,iw-8,ih-8,6); ctx.fill();
      const pg=ctx.createLinearGradient(-iw/2,-ih/2,iw/2,ih/2); pg.addColorStop(0,"rgba(255,255,255,0.25)"); pg.addColorStop(0.5,"rgba(0,0,0,0.04)"); pg.addColorStop(1,"rgba(255,255,255,0.15)"); ctx.fillStyle=pg; roundRectPath(ctx,-iw/2+4,-ih/2+4,iw-8,ih-8,6); ctx.fill(); ctx.restore(); }
    else { g=ctx.createRadialGradient(cx,cy,ih*0.3,cx,cy,iw*0.7); g.addColorStop(0,shade(vc,-0.05)); g.addColorStop(1,shade(vc,-0.3)); ctx.fillStyle=g; roundRectPath(ctx,cx-iw/2,cy-ih/2,iw,ih,rr*0.7); ctx.fill(); }
    geo={cx,cy,hx:iw/2-6,hy:ih/2-6,shape:"rect",clip(){ roundRectPath(ctx,cx-iw/2+4,cy-ih/2+4,iw-8,ih-8,rr*0.6); ctx.clip(); }};
  } else if(A.vessel==="board"){
    const w=760,h=520;
    shadow(()=>{ ctx.fillStyle=vc; roundRectPath(ctx,cx-w/2,cy-h/2,w,h,30); ctx.fill(); });
    ctx.save(); roundRectPath(ctx,cx-w/2,cy-h/2,w,h,30); ctx.clip();
    let g=ctx.createLinearGradient(cx-w/2,0,cx+w/2,0); g.addColorStop(0,shade(vc,0.12)); g.addColorStop(1,shade(vc,-0.12)); ctx.fillStyle=g; ctx.fillRect(cx-w/2,cy-h/2,w,h);
    ctx.strokeStyle=shade(vc,-0.22); ctx.globalAlpha=0.35; ctx.lineWidth=2;
    for(let k=0;k<26;k++){ const y=cy-h/2+R()*h; ctx.beginPath(); ctx.moveTo(cx-w/2,y); for(let x=cx-w/2;x<=cx+w/2;x+=40) ctx.lineTo(x,y+Math.sin(x*0.01+k)*6); ctx.stroke(); }
    ctx.globalAlpha=1; ctx.restore();
    geo={cx,cy,hx:w/2-30,hy:h/2-30,shape:"rect",clip(){ roundRectPath(ctx,cx-w/2,cy-h/2,w,h,30); ctx.clip(); }};
  } else if(A.vessel==="jar"){
    const R0=250;
    shadow(()=>{ ctx.fillStyle="rgba(220,235,240,0.5)"; ctx.beginPath(); ctx.arc(cx,cy,R0,0,Math.PI*2); ctx.fill(); });
    let g=ctx.createRadialGradient(cx-70,cy-70,10,cx,cy,R0); g.addColorStop(0,"rgba(255,255,255,0.55)"); g.addColorStop(1,"rgba(170,200,210,0.6)");
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,R0,0,Math.PI*2); ctx.fill();
    ctx.lineWidth=14; ctx.strokeStyle="rgba(235,245,248,0.85)"; ctx.beginPath(); ctx.arc(cx,cy,R0-10,0,Math.PI*2); ctx.stroke();
    // lid leaning beside
    ctx.save(); ctx.shadowColor="rgba(0,0,0,0.35)"; ctx.shadowBlur=20; ctx.shadowOffsetY=10;
    ctx.fillStyle="#C9A75A"; ctx.beginPath(); ctx.arc(cx+R0+70,cy+150,95,0,Math.PI*2); ctx.fill(); ctx.restore();
    ctx.strokeStyle="#A8873E"; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(cx+R0+70,cy+150,80,0,Math.PI*2); ctx.stroke();
    geo=circ(R0*0.9);
    geo.after=()=>{ ctx.strokeStyle="rgba(255,255,255,0.6)"; ctx.lineWidth=6; ctx.beginPath(); ctx.arc(cx,cy,R0*0.9,Math.PI*1.05,Math.PI*1.45); ctx.stroke(); };
  }
  return geo;
}

// map normalized coords to canvas, with optional sub-regions (taco shells, toast slices, flatbread)
function regionsFor(L,geo,A){
  if(L.taco) return A._tacos||[];
  if(L.toast) return A._toasts||[];
  if(L.flat) return A._flat||[];
  return [{cx:geo.cx+L.x*geo.hx, cy:geo.cy+L.y*geo.hy, rx:L.r*geo.hx, ry:L.r*geo.hy, rot:0}];
}
function samplePt(R,reg,inner=1){ const a=R()*Math.PI*2, d=Math.sqrt(R())*inner;
  const x=Math.cos(a)*d*reg.rx, y=Math.sin(a)*d*reg.ry, c=Math.cos(reg.rot||0), s=Math.sin(reg.rot||0);
  return [reg.cx+x*c-y*s, reg.cy+x*s+y*c]; }
function leafShape(ctx,x,y,len,rot,col,wide=0.42){
  ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
  ctx.fillStyle=col; ctx.beginPath(); ctx.moveTo(-len,0); ctx.quadraticCurveTo(0,-len*wide*1.6,len,0); ctx.quadraticCurveTo(0,len*wide*1.6,-len,0); ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,0.25)"; ctx.lineWidth=Math.max(1,len*0.06); ctx.beginPath(); ctx.moveTo(-len*0.8,0); ctx.lineTo(len*0.8,0); ctx.stroke();
  ctx.restore();
}
function softShadow(ctx,b=8,a=0.35){ ctx.shadowColor=`rgba(0,0,0,${a})`; ctx.shadowBlur=b; ctx.shadowOffsetX=b*0.3; ctx.shadowOffsetY=b*0.45; }
function noShadow(ctx){ ctx.shadowColor="transparent"; ctx.shadowBlur=0; ctx.shadowOffsetX=0; ctx.shadowOffsetY=0; }

function drawLayer(ctx,L,geo,R,A){
  const regs=regionsFor(L,geo,A), c=L.c, s=(L.s||1);
  const FIXED=["egg","fillet","dollop","wedge","taco","toast","roll","spiral","flatbread","slab","avoslice","eggHalf","swirl","drizzle","apple","pita"];
  const n=FIXED.includes(L.t)?(L.n||0):Math.round((L.n||0)*(L.t==="grain"?2.1:1.45));
  const S0=geo.hx/260*1.5; // food scale relative to a ~260px food radius
  ctx.save();
  if(L.a) ctx.globalAlpha=L.a;
  switch(L.t){
  case "base": for(const reg of regs){
      const g=ctx.createRadialGradient(reg.cx-reg.rx*0.3,reg.cy-reg.ry*0.3,5,reg.cx,reg.cy,Math.max(reg.rx,reg.ry));
      g.addColorStop(0,c[2]||shade(c[0],0.15)); g.addColorStop(0.55,c[0]); g.addColorStop(1,c[1]);
      ctx.fillStyle=g;
      if(reg.path){ reg.path(ctx,0.92); ctx.fill(); }
      else { ctx.beginPath(); ctx.ellipse(reg.cx,reg.cy,reg.rx,reg.ry,reg.rot||0,0,Math.PI*2); ctx.fill(); }
      // oily sheen spots
      for(let i=0;i<14;i++){ const [x,y]=samplePt(R,reg,0.85); ctx.fillStyle="rgba(255,240,200,0.12)"; ctx.beginPath(); ctx.ellipse(x,y,6+R()*16,3+R()*7,R()*3,0,Math.PI*2); ctx.fill(); }
    } break;
  case "grain": for(const reg of regs){
      // mound shading then kernels
      const g=ctx.createRadialGradient(reg.cx-reg.rx*0.2,reg.cy-reg.ry*0.25,4,reg.cx,reg.cy,reg.rx*1.05);
      g.addColorStop(0,shade(c[0],0.2)); g.addColorStop(1,shade(c[c.length-1],-0.06));
      ctx.fillStyle=g; blobPath(ctx,R,reg.cx,reg.cy,reg.rx*1.02,0.12,11); ctx.fill();
      for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,1); const d=Math.hypot((x-reg.cx)/reg.rx,(y-reg.cy)/reg.ry);
        const col=pick(R,c); ctx.fillStyle=d>0.85?shade(col,-0.06):col;
        ctx.beginPath(); ctx.ellipse(x,y,4.4*s*S0,2*s*S0,R()*Math.PI,0,Math.PI*2); ctx.fill();
        if(R()<0.25){ ctx.fillStyle="rgba(255,255,255,0.7)"; ctx.beginPath(); ctx.ellipse(x-1,y-1,2*s*S0,0.9*s*S0,R()*Math.PI,0,Math.PI*2); ctx.fill(); } }
    } break;
  case "chunk": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.92), rad=(26+R()*14)*s*S0;
      softShadow(ctx,10); const g=ctx.createRadialGradient(x-rad*0.3,y-rad*0.35,2,x,y,rad*1.1);
      g.addColorStop(0,c[2]); g.addColorStop(0.6,c[0]); g.addColorStop(1,c[1]); ctx.fillStyle=g;
      ctx.save(); ctx.translate(x,y); ctx.scale(1.25,0.85); ctx.rotate(R()*3); ctx.translate(-x,-y); blobPath(ctx,R,x,y,rad,0.5,7); ctx.fill(); ctx.restore(); noShadow(ctx);
      ctx.fillStyle="rgba(40,10,0,0.45)"; for(let k=0;k<4;k++){ ctx.beginPath(); ctx.ellipse(x+(R()-0.5)*rad,y+(R()-0.5)*rad,rad*0.18*R()+2,rad*0.1+1,R()*3,0,Math.PI*2); ctx.fill(); }
      ctx.fillStyle="rgba(255,235,200,0.35)"; ctx.beginPath(); ctx.ellipse(x-rad*0.3,y-rad*0.35,rad*0.28,rad*0.12,-0.6,0,Math.PI*2); ctx.fill();
    } break;
  case "floret": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.85), rad=(30+R()*12)*s*S0, rot=R()*Math.PI*2;
      ctx.save(); ctx.translate(x,y); ctx.rotate(rot); softShadow(ctx,10);
      ctx.fillStyle="#A9C979"; roundRectPath(ctx,-rad*0.2,0,rad*0.4,rad*1.1,rad*0.15); ctx.fill(); noShadow(ctx);
      for(let k=0;k<9;k++){ const a=k/9*Math.PI*2, d=rad*0.45*(k?1:0);
        const bx=Math.cos(a)*d, by=Math.sin(a)*d-rad*0.1, br=rad*(k?0.42:0.5);
        const g=ctx.createRadialGradient(bx-br*0.3,by-br*0.3,1,bx,by,br); g.addColorStop(0,c[2]); g.addColorStop(0.7,c[0]); g.addColorStop(1,c[1]);
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(bx,by,br,0,Math.PI*2); ctx.fill(); }
      ctx.fillStyle="rgba(20,30,10,0.55)"; for(let k=0;k<5;k++){ ctx.beginPath(); ctx.arc((R()-0.5)*rad,(R()-0.6)*rad,rad*0.12,0,Math.PI*2); ctx.fill(); }
      ctx.restore(); } break;
  case "leaf": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.95), len=(22+R()*16)*s*S0;
      softShadow(ctx,4,0.25);
      if(L.kale){ ctx.save(); ctx.translate(x,y); ctx.rotate(R()*6); ctx.fillStyle=pick(R,c); blobPath(ctx,R,0,0,len*0.8,0.5,12); ctx.fill(); ctx.restore(); }
      else leafShape(ctx,x,y,len,R()*Math.PI*2,pick(R,c),L.basil?0.55:0.42);
      noShadow(ctx); } break;
  case "strip": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.92), w=6.5*s*S0, l=w*(L.l||3)*1.3*(0.8+R()*0.5), col=pick(R,c);
      const rad=l*(1.4+R()*2), sweep=l/rad;
      ctx.save(); ctx.translate(x,y); ctx.rotate(R()*Math.PI*2); ctx.lineCap="round";
      softShadow(ctx,6,0.3); ctx.strokeStyle=shade(col,-0.12); ctx.lineWidth=w; ctx.beginPath(); ctx.arc(0,rad,rad,-Math.PI/2-sweep/2,-Math.PI/2+sweep/2); ctx.stroke(); noShadow(ctx);
      ctx.strokeStyle=col; ctx.lineWidth=w*0.62; ctx.beginPath(); ctx.arc(0,rad-w*0.12,rad,-Math.PI/2-sweep/2.1,-Math.PI/2+sweep/2.1); ctx.stroke();
      ctx.strokeStyle="rgba(255,255,255,0.35)"; ctx.lineWidth=w*0.16; ctx.beginPath(); ctx.arc(0,rad-w*0.25,rad,-Math.PI/2-sweep/2.6,-Math.PI/2+sweep/4); ctx.stroke();
      if(L.sear){ ctx.strokeStyle="rgba(20,5,0,0.55)"; ctx.lineWidth=2.5; for(let k=0;k<3;k++){ const a=-Math.PI/2+(R()-0.5)*sweep*0.8; ctx.beginPath(); ctx.moveTo(Math.cos(a)*(rad-w/2),rad+Math.sin(a)*(rad-w/2)); ctx.lineTo(Math.cos(a)*(rad+w/2),rad+Math.sin(a)*(rad+w/2)); ctx.stroke(); }
        ctx.strokeStyle="rgba(214,110,110,0.55)"; ctx.lineWidth=w*0.18; ctx.beginPath(); ctx.arc(0,rad,rad,-Math.PI/2-sweep/2.4,-Math.PI/2+sweep/2.4); ctx.stroke(); }
      ctx.restore(); } break;
  case "round": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.92), rad=(30+R()*6)*s*S0;
      softShadow(ctx,L.d==="ring"?2:7,0.3);
      if(L.d==="ring"){ ctx.strokeStyle=c[0]; ctx.lineWidth=rad*0.35; ctx.beginPath(); ctx.arc(x,y,rad*0.75,0,Math.PI*2); ctx.stroke(); noShadow(ctx); ctx.fillStyle=c[1]; ctx.beginPath(); ctx.arc(x,y,rad*0.55,0,Math.PI*2); ctx.fill(); break; }
      ctx.fillStyle=c[0]; ctx.beginPath(); ctx.arc(x,y,rad,0,Math.PI*2); ctx.fill(); noShadow(ctx);
      if(L.d==="tomato"){ ctx.fillStyle=c[1]; ctx.beginPath(); ctx.arc(x,y,rad*0.82,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#F7B7A0"; for(let k=0;k<3;k++){ const a=k/3*Math.PI*2+R(); ctx.beginPath(); ctx.ellipse(x+Math.cos(a)*rad*0.42,y+Math.sin(a)*rad*0.42,rad*0.24,rad*0.15,a,0,Math.PI*2); ctx.fill(); }
        ctx.fillStyle="#F7E3A8"; for(let k=0;k<6;k++){ const a=R()*6; ctx.beginPath(); ctx.arc(x+Math.cos(a)*rad*0.45,y+Math.sin(a)*rad*0.45,2*S0,0,Math.PI*2); ctx.fill(); } }
      else if(L.d==="cuke"){ ctx.fillStyle=c[1]; ctx.beginPath(); ctx.arc(x,y,rad*0.86,0,Math.PI*2); ctx.fill(); ctx.fillStyle="#C9E2A6"; ctx.beginPath(); ctx.arc(x,y,rad*0.45,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#F4F8E8"; for(let k=0;k<3;k++){ const a=k/3*Math.PI*2; ctx.beginPath(); ctx.ellipse(x+Math.cos(a)*rad*0.22,y+Math.sin(a)*rad*0.22,rad*0.1,rad*0.06,a,0,Math.PI*2); ctx.fill(); } }
      else if(L.d==="pep"){ const g=ctx.createRadialGradient(x,y,rad*0.3,x,y,rad); g.addColorStop(0,c[1]); g.addColorStop(0.8,c[0]); g.addColorStop(1,"#5A120C"); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,rad,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="rgba(255,220,160,0.35)"; for(let k=0;k<6;k++){ ctx.beginPath(); ctx.arc(x+(R()-0.5)*rad,y+(R()-0.5)*rad,rad*0.08,0,Math.PI*2); ctx.fill(); }
        ctx.fillStyle="rgba(255,255,255,0.3)"; ctx.beginPath(); ctx.ellipse(x-rad*0.35,y-rad*0.4,rad*0.3,rad*0.12,-0.6,0,Math.PI*2); ctx.fill(); }
      else if(L.d==="sausage"){ const g=ctx.createRadialGradient(x,y,1,x,y,rad); g.addColorStop(0,c[1]); g.addColorStop(1,c[0]); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,rad*0.9,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="rgba(255,240,220,0.45)"; for(let k=0;k<7;k++){ ctx.beginPath(); ctx.arc(x+(R()-0.5)*rad,y+(R()-0.5)*rad,rad*0.07,0,Math.PI*2); ctx.fill(); } }
      else if(L.d==="pork"){ ctx.fillStyle=c[0]; ctx.beginPath(); ctx.ellipse(x,y,rad*1.2,rad,R(),0,Math.PI*2); ctx.fill();
        const g=ctx.createRadialGradient(x,y,1,x,y,rad*0.9); g.addColorStop(0,"#F6D2BE"); g.addColorStop(0.7,c[1]); g.addColorStop(1,"#C98F6E"); ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(x,y,rad*1.02,rad*0.82,0,0,Math.PI*2); ctx.fill(); }
      else { ctx.fillStyle=c[1]; ctx.beginPath(); ctx.arc(x,y,rad*0.7,0,Math.PI*2); ctx.fill(); }
    } break;
  case "dot": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.97); ctx.fillStyle=pick(R,c);
      ctx.beginPath(); ctx.ellipse(x,y,3.2*s*S0,2*s*S0,R()*3,0,Math.PI*2); ctx.fill(); } break;
  case "drizzle": { const rs=(L.taco||L.flat||L.toast)?regs:[{cx:geo.cx,cy:geo.cy,rx:geo.hx*0.62,ry:geo.hy*0.62,rot:0}];
      for(const reg of rs) for(let i=0;i<Math.max(1,(L.taco||L.toast)?1:n);i++){
      const ang=(reg.rot||0)+0.5+R()*0.6+i*0.5, m=9+Math.floor(R()*4), ca=Math.cos(ang), sa=Math.sin(ang);
      const P=[]; for(let j=0;j<=m;j++){ const u=-0.9+1.8*j/m, v=(j%2?1:-1)*(0.55+R()*0.3);
        P.push([reg.cx+(u*reg.rx)*ca-(v*reg.ry*0.9)*sa, reg.cy+(u*reg.rx)*sa+(v*reg.ry*0.9)*ca]); }
      const path=()=>{ ctx.beginPath(); ctx.moveTo(P[0][0],P[0][1]); for(let j=1;j<P.length-1;j++){ const mx=(P[j][0]+P[j+1][0])/2, my=(P[j][1]+P[j+1][1])/2; ctx.quadraticCurveTo(P[j][0],P[j][1],mx,my); } ctx.lineTo(P[P.length-1][0],P[P.length-1][1]); };
      ctx.lineCap="round"; ctx.lineJoin="round"; ctx.strokeStyle=c[0]; ctx.lineWidth=(L.w||5)*S0*0.8;
      softShadow(ctx,4,0.3); path(); ctx.stroke(); noShadow(ctx);
      ctx.strokeStyle="rgba(255,255,255,0.35)"; ctx.lineWidth=Math.max(1,(L.w||5)*0.25*S0); path(); ctx.stroke(); } } break;
  case "wedge": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,1), rad=32*s*S0, rot=R()*Math.PI*2;
      ctx.save(); ctx.translate(x,y); ctx.rotate(rot); softShadow(ctx,8);
      ctx.fillStyle=c[0]; ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,rad,-0.15,Math.PI+0.15); ctx.closePath(); ctx.fill(); noShadow(ctx);
      ctx.fillStyle=c[1]; ctx.beginPath(); ctx.moveTo(0,rad*0.05); ctx.arc(0,0,rad*0.86,0,Math.PI); ctx.closePath(); ctx.fill();
      ctx.strokeStyle="rgba(255,255,255,0.6)"; ctx.lineWidth=2; for(let k=1;k<4;k++){ const a=k/4*Math.PI; ctx.beginPath(); ctx.moveTo(0,2); ctx.lineTo(Math.cos(a)*rad*0.8,Math.sin(a)*rad*0.8); ctx.stroke(); }
      ctx.restore(); } break;
  case "shrimp": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.9), rad=30*s*S0, rot=R()*Math.PI*2;
      ctx.save(); ctx.translate(x,y); ctx.rotate(rot); softShadow(ctx,8);
      ctx.lineCap="round"; ctx.strokeStyle=c[0]; ctx.lineWidth=rad*0.7; ctx.beginPath(); ctx.arc(0,0,rad,Math.PI*0.15,Math.PI*1.45); ctx.stroke(); noShadow(ctx);
      ctx.strokeStyle=c[1]; ctx.lineWidth=rad*0.28; ctx.beginPath(); ctx.arc(0,0,rad*1.05,Math.PI*0.25,Math.PI*1.35); ctx.stroke();
      ctx.strokeStyle=c[2]; ctx.lineWidth=2.5*S0; for(let k=0;k<5;k++){ const a=Math.PI*(0.35+k*0.22); ctx.beginPath(); ctx.moveTo(Math.cos(a)*rad*0.7,Math.sin(a)*rad*0.7); ctx.lineTo(Math.cos(a)*rad*1.3,Math.sin(a)*rad*1.3); ctx.stroke(); }
      ctx.fillStyle=c[2]; ctx.beginPath(); const ta=Math.PI*1.5; ctx.moveTo(Math.cos(ta)*rad,Math.sin(ta)*rad); ctx.lineTo(Math.cos(ta)*rad+rad*0.5,Math.sin(ta)*rad-rad*0.35); ctx.lineTo(Math.cos(ta)*rad+rad*0.55,Math.sin(ta)*rad+rad*0.25); ctx.fill();
      ctx.restore(); } break;
  case "fillet": for(const reg of regs){ const x=reg.cx,y=reg.cy,w=reg.rx*1.15,h=reg.ry*0.62;
      ctx.save(); ctx.translate(x,y); ctx.rotate(-0.25); softShadow(ctx,16,0.4);
      const g=ctx.createLinearGradient(0,-h,0,h); g.addColorStop(0,shade(c[0],0.15)); g.addColorStop(1,shade(c[0],-0.15)); ctx.fillStyle=g;
      ctx.beginPath(); ctx.moveTo(-w,-h*0.4); ctx.quadraticCurveTo(-w*0.2,-h*1.2,w*0.9,-h*0.7); ctx.quadraticCurveTo(w*1.15,0,w*0.9,h*0.7); ctx.quadraticCurveTo(-w*0.2,h*1.2,-w,h*0.4); ctx.quadraticCurveTo(-w*1.1,0,-w,-h*0.4); ctx.fill(); noShadow(ctx);
      ctx.save(); ctx.clip(); ctx.strokeStyle=c[1]; ctx.lineWidth=5*S0; for(let k=-6;k<8;k++){ ctx.beginPath(); ctx.moveTo(k*w*0.18,-h*1.2); ctx.quadraticCurveTo(k*w*0.18+w*0.15,0,k*w*0.18,h*1.2); ctx.stroke(); }
      for(let k=0;k<380;k++){ const px=(R()*2-1)*w, py=(R()*2-1)*h*0.85; ctx.fillStyle=R()<0.55?c[2]:(R()<0.5?"#F2E6C8":"#9A6A3A"); ctx.beginPath(); ctx.ellipse(px,py,3.4*S0,2.2*S0,R()*3,0,Math.PI*2); ctx.fill(); }
      ctx.restore(); ctx.restore(); } break;
  case "dollop": for(const reg of regs) for(let i=0;i<Math.max(1,n);i++){ const x=reg.cx,y=reg.cy,rad=60*s*S0;
      softShadow(ctx,10,0.3); const g=ctx.createRadialGradient(x-rad*0.3,y-rad*0.3,2,x,y,rad); g.addColorStop(0,"#FFFFFF"); g.addColorStop(0.7,c[0]); g.addColorStop(1,c[1]);
      ctx.fillStyle=g; blobPath(ctx,R,x,y,rad,0.2,8); ctx.fill(); noShadow(ctx);
      ctx.strokeStyle="rgba(0,0,0,0.08)"; ctx.lineWidth=2*S0; ctx.beginPath(); ctx.arc(x+4,y+4,rad*0.5,0.3,Math.PI*1.2); ctx.stroke(); } break;
  case "smash": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.85), rad=(44+R()*10)*s*S0;
      softShadow(ctx,10); const g=ctx.createRadialGradient(x-rad*0.2,y-rad*0.2,2,x,y,rad); g.addColorStop(0,c[2]); g.addColorStop(0.6,c[0]); g.addColorStop(1,c[1]);
      ctx.fillStyle=g; if(L.halved){ ctx.beginPath(); ctx.ellipse(x,y,rad,rad*0.75,R()*3,0,Math.PI*2); ctx.fill(); } else { blobPath(ctx,R,x,y,rad,0.4,10); ctx.fill(); }
      noShadow(ctx); ctx.fillStyle="rgba(120,60,10,0.45)"; for(let k=0;k<8;k++){ ctx.beginPath(); ctx.arc(x+(R()-0.5)*rad*1.4,y+(R()-0.5)*rad*1.2,rad*0.07+R()*3,0,Math.PI*2); ctx.fill(); }
      ctx.fillStyle="rgba(255,255,230,0.35)"; for(let k=0;k<5;k++){ ctx.beginPath(); ctx.arc(x+(R()-0.5)*rad,y+(R()-0.5)*rad,rad*0.05,0,Math.PI*2); ctx.fill(); }
      ctx.fillStyle="rgba(20,60,20,0.7)"; for(let k=0;k<6;k++){ ctx.fillRect(x+(R()-0.5)*rad,y+(R()-0.5)*rad,3,6); } } break;
  case "spear": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.6), len=150*s*S0, w=12*s*S0, rot=(L.ang||0)+(R()-0.5)*0.25;
      ctx.save(); ctx.translate(x,y); ctx.rotate(rot); softShadow(ctx,6,0.3);
      const g=ctx.createLinearGradient(0,-w,0,w); g.addColorStop(0,c[1]); g.addColorStop(1,c[2]); ctx.fillStyle=g;
      roundRectPath(ctx,-len/2,-w/2,len,w,w/2); ctx.fill(); noShadow(ctx);
      ctx.fillStyle=c[0]; for(let k=0;k<4;k++){ ctx.beginPath(); ctx.ellipse(len/2-k*9*S0,0,8*S0,w*0.6,0,0,Math.PI*2); ctx.fill(); }
      ctx.fillStyle="rgba(40,20,0,0.35)"; for(let k=0;k<3;k++){ ctx.fillRect(-len/2+R()*len*0.8,-w/2,6,w); }
      ctx.restore(); } break;
  case "pillow": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.92), w=34*s*S0, h=24*s*S0, rot=R()*Math.PI*2;
      ctx.save(); ctx.translate(x,y); ctx.rotate(rot); softShadow(ctx,7,0.35);
      const g=ctx.createRadialGradient(-w*0.2,-h*0.3,2,0,0,w); g.addColorStop(0,"#F6E2B0"); g.addColorStop(0.6,c[0]); g.addColorStop(1,c[1]); ctx.fillStyle=g;
      roundRectPath(ctx,-w/2,-h/2,w,h,h*0.45); ctx.fill(); noShadow(ctx);
      ctx.strokeStyle="rgba(140,90,30,0.4)"; ctx.lineWidth=2; for(let k=-2;k<=2;k++){ ctx.beginPath(); ctx.moveTo(k*w*0.15,-h*0.35); ctx.lineTo(k*w*0.15,h*0.35); ctx.stroke(); }
      ctx.fillStyle=c[2]; ctx.globalAlpha=0.75; ctx.beginPath(); ctx.ellipse(w*0.1,h*0.1,w*0.32,h*0.22,0.3,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
      ctx.restore(); } break;
  case "shave": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.9), w=26*s*S0;
      ctx.save(); ctx.translate(x,y); ctx.rotate(R()*6); softShadow(ctx,4,0.2); ctx.fillStyle=pick(R,c);
      ctx.beginPath(); ctx.moveTo(-w,-w*0.3); ctx.lineTo(w*0.9,-w*0.45); ctx.lineTo(w,w*0.3); ctx.lineTo(-w*0.8,w*0.4); ctx.closePath(); ctx.fill(); ctx.restore(); } break;
  case "crumble": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.92), rad=(10+R()*8)*s*S0;
      softShadow(ctx,4,0.3); ctx.fillStyle=pick(R,c); blobPath(ctx,R,x,y,rad,0.6,6); ctx.fill(); noShadow(ctx); } break;
  case "cube": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.9), a=(26+R()*8)*s*S0;
      ctx.save(); ctx.translate(x,y); ctx.rotate(R()*Math.PI); softShadow(ctx,6,0.3);
      const g=ctx.createLinearGradient(-a/2,-a/2,a/2,a/2); g.addColorStop(0,c[2]||c[0]); g.addColorStop(1,c[1]); ctx.fillStyle=g;
      roundRectPath(ctx,-a/2,-a/2,a,a,a*0.25); ctx.fill(); noShadow(ctx); ctx.restore(); } break;
  case "bean": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.92), a=18*s*S0;
      ctx.save(); ctx.translate(x,y); ctx.rotate(R()*Math.PI); softShadow(ctx,4,0.3);
      const g=ctx.createRadialGradient(-a*0.3,-a*0.2,1,0,0,a); g.addColorStop(0,c[1]); g.addColorStop(1,c[0]); ctx.fillStyle=g;
      ctx.beginPath(); ctx.ellipse(0,0,a,a*0.62,0,0,Math.PI*2); ctx.fill(); noShadow(ctx);
      ctx.fillStyle="rgba(255,255,255,0.4)"; ctx.beginPath(); ctx.ellipse(-a*0.3,-a*0.2,a*0.3,a*0.12,0,0,Math.PI*2); ctx.fill(); ctx.restore(); } break;
  case "berry": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.95), rasp=R()<0.3, rad=(rasp?20:15)*s*S0;
      softShadow(ctx,5,0.35);
      if(rasp){ ctx.fillStyle=c[2]; for(let k=0;k<7;k++){ const a=k/7*Math.PI*2; ctx.beginPath(); ctx.arc(x+Math.cos(a)*rad*0.45,y+Math.sin(a)*rad*0.45,rad*0.45,0,Math.PI*2); ctx.fill(); } noShadow(ctx); ctx.fillStyle="rgba(255,200,210,0.35)"; ctx.beginPath(); ctx.arc(x-rad*0.3,y-rad*0.3,rad*0.25,0,Math.PI*2); ctx.fill(); }
      else { const g=ctx.createRadialGradient(x-rad*0.35,y-rad*0.35,1,x,y,rad); g.addColorStop(0,"#8A8FD0"); g.addColorStop(0.5,c[0]); g.addColorStop(1,c[1]); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,rad,0,Math.PI*2); ctx.fill(); noShadow(ctx);
        ctx.strokeStyle="rgba(20,20,50,0.7)"; ctx.lineWidth=2; ctx.beginPath(); for(let k=0;k<5;k++){ const a=k/5*Math.PI*2; ctx.moveTo(x,y); ctx.lineTo(x+Math.cos(a)*rad*0.3,y+Math.sin(a)*rad*0.3); } ctx.stroke(); }
    } break;
  case "egg": { const pts = n===1 ? [[geo.cx+L.x*geo.hx, geo.cy+L.y*geo.hy]] :
      Array.from({length:n},(_,k)=>{ const a=k/n*Math.PI*2+0.4; return [geo.cx+Math.cos(a)*L.r*geo.hx, geo.cy+Math.sin(a)*L.r*geo.hy]; });
      for(const [x,y] of pts){ const rad=70*s*S0;
        softShadow(ctx,10,0.3); ctx.fillStyle=c[0]; blobPath(ctx,R,x,y,rad,0.3,10); ctx.fill(); noShadow(ctx);
        if(!L.ring){ ctx.strokeStyle="rgba(200,150,80,0.35)"; ctx.lineWidth=3; blobPath(ctx,R,x,y,rad*0.97,0.3,10); ctx.stroke(); }
        const yx=x+(R()-0.5)*rad*0.3, yy=y+(R()-0.5)*rad*0.3;
        const g=ctx.createRadialGradient(yx-rad*0.12,yy-rad*0.12,1,yx,yy,rad*0.42); g.addColorStop(0,"#FFD36A"); g.addColorStop(0.7,c[1]); g.addColorStop(1,shade(c[1],-0.2));
        softShadow(ctx,6,0.25); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(yx,yy,rad*0.4,0,Math.PI*2); ctx.fill(); noShadow(ctx);
        ctx.fillStyle="rgba(255,255,255,0.65)"; ctx.beginPath(); ctx.ellipse(yx-rad*0.14,yy-rad*0.16,rad*0.1,rad*0.05,-0.6,0,Math.PI*2); ctx.fill(); } } break;
  case "eggHalf": for(const reg of regs){ for(let i=0;i<Math.max(1,Math.round(n/regs.length));i++){ const [x,y]=samplePt(R,reg,0.45), rad=40*s*S0, rot=(reg.rot||0)+(R()-0.5)*0.6;
      ctx.save(); ctx.translate(x,y); ctx.rotate(rot); softShadow(ctx,8,0.35);
      ctx.fillStyle=c[0]; ctx.beginPath(); ctx.ellipse(0,0,rad*1.25,rad*0.95,0,0,Math.PI*2); ctx.fill(); noShadow(ctx);
      const g=ctx.createRadialGradient(-4,-4,1,0,0,rad*0.6); g.addColorStop(0,"#E86A0A"); g.addColorStop(0.6,c[1]); g.addColorStop(1,"#F7C04A"); ctx.fillStyle=g;
      ctx.beginPath(); ctx.ellipse(0,0,rad*0.62,rad*0.55,0,0,Math.PI*2); ctx.fill(); ctx.restore(); } } break;
  case "avoslice": for(const reg of regs){ const [x,y]=samplePt(R,reg,0.3), rot=R()*Math.PI*2, k=Math.max(1,(L.taco||L.toast)?Math.ceil(n/3):n);
      for(let i=0;i<k;i++){ ctx.save(); ctx.translate(x,y); ctx.rotate(rot+i*0.16); softShadow(ctx,5,0.3);
        const len=70*s*S0, w=22*s*S0; ctx.fillStyle=c[2]; ctx.beginPath(); ctx.ellipse(i*6*S0,0,len,w,0,0,Math.PI*2); ctx.fill(); noShadow(ctx);
        const g=ctx.createLinearGradient(0,-w,0,w); g.addColorStop(0,c[1]); g.addColorStop(1,c[0]); ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(i*6*S0,-1,len*0.96,w*0.82,0,0,Math.PI*2); ctx.fill(); ctx.restore(); } } break;
  case "blob": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.92), rad=(26+R()*20)*s*S0;
      const g=ctx.createRadialGradient(x-rad*0.2,y-rad*0.2,1,x,y,rad); g.addColorStop(0,c[0]); g.addColorStop(0.7,c[1]); g.addColorStop(1,c[2]);
      ctx.fillStyle=g; ctx.globalAlpha=0.92; blobPath(ctx,R,x,y,rad,0.55,9); ctx.fill(); ctx.globalAlpha=1;
      if(R()<0.5){ ctx.fillStyle="rgba(140,70,10,0.35)"; ctx.beginPath(); ctx.arc(x+(R()-0.5)*rad,y+(R()-0.5)*rad,rad*0.2,0,Math.PI*2); ctx.fill(); } } break;
  case "swirl": for(const reg of regs){ ctx.strokeStyle=c[0]; ctx.globalAlpha=0.85; ctx.lineWidth=9*S0; ctx.lineCap="round"; ctx.beginPath();
      for(let t=0;t<Math.PI*4;t+=0.15){ const rr=reg.rx*0.1+t*reg.rx*0.06; const px=reg.cx+Math.cos(t)*rr, py=reg.cy+Math.sin(t)*rr*0.9; t?ctx.lineTo(px,py):ctx.moveTo(px,py); } ctx.stroke(); } break;
  case "slab": for(const reg of regs) for(let i=0;i<n;i++){ const t=(i-(n-1)/2), x=reg.cx+t*reg.rx*0.42, y=reg.cy+t*reg.ry*0.1, w=26*s*S0, h=90*s*S0;
      ctx.save(); ctx.translate(x,y); ctx.rotate(0.35); softShadow(ctx,8,0.35);
      ctx.fillStyle=c[1]; roundRectPath(ctx,-w/2,-h/2,w,h,8); ctx.fill(); noShadow(ctx);
      ctx.fillStyle="#F3E4C8"; roundRectPath(ctx,-w/2+4,-h/2+5,w-8,h-10,6); ctx.fill();
      ctx.fillStyle=c[0]; ctx.globalAlpha=0.6; roundRectPath(ctx,-w/2+4,-h/2+5,w-8,h-10,6); ctx.fill(); ctx.globalAlpha=1;
      ctx.fillStyle=c[2]; for(let k=0;k<3;k++) ctx.fillRect(-w/2,-h/2+h*(0.2+k*0.28),w,4);
      ctx.restore(); } break;
  case "pita": { const spots = n ? Array.from({length:n},()=>samplePt(R,regs[0],1)) : [[geo.cx+geo.hx*1.02, geo.cy+geo.hy*0.95]];
      if(!n){ /* shakshuka: pita on the table beside the pan */ }
      for(const [x,y] of spots){ const rad=(n?70:110)*S0; ctx.save(); ctx.translate(x,y); ctx.rotate(R()*6); softShadow(ctx,8,0.35);
        const g=ctx.createRadialGradient(0,-rad*0.3,2,0,0,rad); g.addColorStop(0,"#F3D7A2"); g.addColorStop(1,c[1]); ctx.fillStyle=g;
        ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,rad,-0.5,0.55); ctx.closePath(); ctx.fill(); noShadow(ctx);
        ctx.fillStyle="rgba(120,60,10,0.35)"; for(let k=0;k<6;k++){ ctx.beginPath(); ctx.arc(Math.cos(R()-0.5)*rad*(0.3+R()*0.6),Math.sin(R()-0.5)*rad*0.5,3,0,Math.PI*2); ctx.fill(); }
        ctx.restore(); } } break;
  case "chip": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.9), rad=34*s*S0;
      ctx.save(); ctx.translate(x,y); ctx.rotate(R()*6); softShadow(ctx,6,0.35);
      ctx.fillStyle=pick(R,c); ctx.beginPath(); ctx.moveTo(0,-rad); ctx.lineTo(rad*0.9,rad*0.6); ctx.lineTo(-rad*0.9,rad*0.55); ctx.closePath(); ctx.fill(); noShadow(ctx);
      ctx.fillStyle="rgba(150,90,20,0.35)"; for(let k=0;k<4;k++){ ctx.beginPath(); ctx.arc((R()-0.5)*rad,(R()-0.2)*rad*0.8,2.5,0,Math.PI*2); ctx.fill(); } ctx.restore(); } break;
  case "shred": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,0.85), len=40*s*S0;
      ctx.save(); ctx.translate(x,y); ctx.rotate(R()*6); softShadow(ctx,5,0.3); ctx.strokeStyle=pick(R,c); ctx.lineCap="round";
      for(let k=0;k<3;k++){ ctx.lineWidth=(4+R()*3)*S0; ctx.beginPath(); ctx.moveTo(-len/2,(k-1)*6); ctx.quadraticCurveTo(0,(k-1)*6+(R()-0.5)*14,len/2,(k-1)*6+(R()-0.5)*8); ctx.stroke(); }
      ctx.restore(); } break;
  case "apple": for(const reg of regs) for(let i=0;i<n;i++){ const [x,y]=samplePt(R,reg,1), rad=40*S0;
      ctx.save(); ctx.translate(x,y); ctx.rotate(R()*6); softShadow(ctx,6,0.3);
      ctx.fillStyle=c[0]; ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,rad,-0.4,0.4); ctx.closePath(); ctx.fill(); noShadow(ctx);
      ctx.fillStyle=c[1]; ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,rad*0.9,-0.36,0.36); ctx.closePath(); ctx.fill(); ctx.restore(); } break;
  case "roll": { const k=n, iw=geo.hx*2*0.92, w=iw/k; A._rolls=[];
      for(let i=0;i<k;i++){ const x=geo.cx-iw/2+w*(i+0.5); softShadow(ctx,8,0.4);
        const g=ctx.createLinearGradient(x-w/2,0,x+w/2,0); g.addColorStop(0,c[1]); g.addColorStop(0.45,c[0]); g.addColorStop(1,c[1]);
        ctx.fillStyle=g; roundRectPath(ctx,x-w/2+3,geo.cy-geo.hy*0.95,w-6,geo.hy*1.9,w*0.45); ctx.fill(); noShadow(ctx);
        ctx.fillStyle="rgba(120,70,20,0.35)"; for(let j=0;j<8;j++){ ctx.beginPath(); ctx.arc(x+(R()-0.5)*w*0.7,geo.cy+(R()-0.5)*geo.hy*1.7,3+R()*4,0,Math.PI*2); ctx.fill(); } } } break;
  case "taco": { A._tacos=[]; const k=n;
      for(let i=0;i<k;i++){ const x=geo.cx+(i-(k-1)/2)*geo.hx*0.62, y=geo.cy+(i%2?0.12:-0.08)*geo.hy, rx=geo.hx*0.36, ry=geo.hy*0.6, rot=(i-(k-1)/2)*0.12;
        ctx.save(); ctx.translate(x,y); ctx.rotate(rot); softShadow(ctx,14,0.4);
        const g=ctx.createRadialGradient(0,-ry*0.2,4,0,0,rx*1.3); g.addColorStop(0,c[0]); g.addColorStop(1,c[1]);
        ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2); ctx.fill(); noShadow(ctx);
        ctx.fillStyle="rgba(90,50,10,0.35)"; for(let j=0;j<14;j++){ const a=R()*6, d=0.75+R()*0.2; ctx.beginPath(); ctx.arc(Math.cos(a)*rx*d,Math.sin(a)*ry*d,3+R()*5,0,Math.PI*2); ctx.fill(); }
        ctx.restore();
        A._tacos.push({cx:x,cy:y,rx:rx*0.55,ry:ry*0.72,rot}); } } break;
  case "toast": { A._toasts=[]; for(let i=0;i<n;i++){ const x=geo.cx+(i-(n-1)/2)*geo.hx*0.95, y=geo.cy+(i?0.06:-0.04)*geo.hy, w=geo.hx*0.86, h=geo.hy*1.55, rot=(i?0.08:-0.1);
        ctx.save(); ctx.translate(x,y); ctx.rotate(rot); softShadow(ctx,14,0.4);
        ctx.fillStyle=c[1]; ctx.beginPath(); ctx.moveTo(-w/2,-h/2+h*0.2); ctx.quadraticCurveTo(-w/2,-h/2,-w/4,-h/2); ctx.quadraticCurveTo(0,-h/2-h*0.08,w/4,-h/2); ctx.quadraticCurveTo(w/2,-h/2,w/2,-h/2+h*0.2); ctx.lineTo(w/2,h/2-10); ctx.quadraticCurveTo(w/2,h/2,w/2-14,h/2); ctx.lineTo(-w/2+14,h/2); ctx.quadraticCurveTo(-w/2,h/2,-w/2,h/2-10); ctx.closePath(); ctx.fill(); noShadow(ctx);
        ctx.save(); ctx.scale(0.9,0.92); const g=ctx.createRadialGradient(0,0,10,0,0,w*0.7); g.addColorStop(0,c[2]); g.addColorStop(1,c[0]); ctx.fillStyle=g; ctx.fill(); ctx.restore();
        ctx.fillStyle="rgba(120,70,20,0.4)"; for(let j=0;j<40;j++){ ctx.beginPath(); ctx.ellipse((R()-0.5)*w*0.8,(R()-0.5)*h*0.8,2+R()*4,1+R()*3,R()*3,0,Math.PI*2); ctx.fill(); }
        ctx.restore();
        const reg={cx:x,cy:y,rx:w*0.38,ry:h*0.4,rot};
        reg.path=(cx2)=>{ ctx.save(); ctx.translate(x,y); ctx.rotate(rot); ctx.beginPath(); blobPath(ctx,R,0,0,1,0.18,10); ctx.restore(); };
        A._toasts.push({cx:x,cy:y,rx:w*0.38,ry:h*0.4,rot}); } } break;
  case "flatbread": { const x=geo.cx, y=geo.cy, rx=geo.hx*0.9, ry=geo.hy*0.85;
      softShadow(ctx,16,0.4); const g=ctx.createRadialGradient(x-rx*0.2,y-ry*0.2,10,x,y,rx); g.addColorStop(0,c[2]); g.addColorStop(0.75,c[0]); g.addColorStop(1,c[1]);
      ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(x,y,rx,ry,-0.08,0,Math.PI*2); ctx.fill(); noShadow(ctx);
      ctx.fillStyle="rgba(110,50,10,0.45)"; for(let j=0;j<40;j++){ const a=R()*6, d=0.86+R()*0.1; ctx.beginPath(); ctx.ellipse(x+Math.cos(a)*rx*d,y+Math.sin(a)*ry*d,4+R()*8,3+R()*4,a,0,Math.PI*2); ctx.fill(); }
      A._flat=[{cx:x,cy:y,rx:rx*0.8,ry:ry*0.78,rot:-0.08}]; } break;
  case "spiral": { A._spirals=[]; for(let i=0;i<n;i++){ const col=i%2, row=Math.floor(i/2), x=geo.cx+(col?0.32:-0.32)*geo.hx+(row?0.08:-0.05)*geo.hx, y=geo.cy+(row?0.38:-0.36)*geo.hy, rad=geo.hy*0.42;
        ctx.save(); ctx.translate(x,y); ctx.rotate(R()*0.6-0.3); softShadow(ctx,12,0.4);
        ctx.fillStyle=c[1]; ctx.beginPath(); ctx.ellipse(0,0,rad*1.05,rad,0,0,Math.PI*2); ctx.fill(); noShadow(ctx);
        ctx.fillStyle=c[0]; ctx.beginPath(); ctx.ellipse(0,0,rad*0.97,rad*0.92,0,0,Math.PI*2); ctx.fill();
        // filling swirl: greens + chicken salad
        ctx.lineCap="round";
        for(let t=0;t<Math.PI*3.2;t+=0.12){ const rr=rad*0.88-t*rad*0.08; ctx.fillStyle=(Math.floor(t*2)%3===0)?c[3]:c[2]; ctx.beginPath(); ctx.arc(Math.cos(t)*rr*0.95,Math.sin(t)*rr*0.88,rad*0.12,0,Math.PI*2); ctx.fill(); }
        ctx.strokeStyle=c[4]; ctx.lineWidth=3; ctx.beginPath(); for(let t=0;t<Math.PI*3.2;t+=0.1){ const rr=rad*0.8-t*rad*0.07; t?ctx.lineTo(Math.cos(t)*rr,Math.sin(t)*rr*0.92):ctx.moveTo(Math.cos(t)*rr,Math.sin(t)*rr*0.92); } ctx.stroke();
        ctx.fillStyle="#7DB653"; for(let k=0;k<10;k++){ const a=R()*6, d=R()*rad*0.7; ctx.beginPath(); ctx.arc(Math.cos(a)*d,Math.sin(a)*d,4,0,Math.PI*2); ctx.fill(); }
        ctx.fillStyle="#C8302A"; for(let k=0;k<5;k++){ const a=R()*6, d=R()*rad*0.6; ctx.fillRect(Math.cos(a)*d,Math.sin(a)*d,7,7); }
        ctx.restore(); } } break;
  }
  ctx.restore();
}

/* ------------------------------------------------------------------ helpers */
const $ = s => document.querySelector(s);
const el = (tag, attrs={}, ...kids) => { const e=document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){ if(k==="class") e.className=v; else if(k==="style") e.style.cssText=v; else if(k.startsWith("on")) e.addEventListener(k.slice(2),v); else if(v!==false && v!=null) e.setAttribute(k,v); }
  for(const k of kids.flat()) if(k!=null && k!==false) e.append(k.nodeType?k:document.createTextNode(k)); return e; };
const storeDot = s => el("span",{class:"dot",style:`--sc:var(${STORES[s].css})`,title:STORES[s].name},STORES[s].short);
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.hidden=false; clearTimeout(toast._t); toast._t=setTimeout(()=>t.hidden=true,2200); }
// attribution for the bundled photo imgFor() would show (none for people's own photos or illustrations)
function creditFor(r){
  if(S.photos[r.id] || (r.base && S.photos[r.base])) return null;
  return PHOTO_CREDITS[r.id] || (r.base && PHOTO_CREDITS[r.base]) || (r.builder && !PHOTOS[r.base] ? PHOTO_CREDITS["breakfast-sandwiches"] : null) || null;
}
function imgFor(r){ return S.photos[r.id] || (r.base&&S.photos[r.base]) || PHOTOS[r.id] || (r.base&&PHOTOS[r.base]) || (r.builder&&PHOTOS["breakfast-sandwiches"]) || artFor(r); }
const listJoin = a => a.length<2 ? a.join("") : a.slice(0,-1).join(", ")+" and "+a[a.length-1];

/* ------------------------------------------------------------------ questions */
const QUESTIONS = [
 {id:"people",type:"people",q:"Who's eating, and how much?",sub:"Add everyone you're cooking for with their own daily calorie target. Portions are sized per person."},
 {id:"macros",type:"macros",q:"Want to set macro targets?",sub:"Optional. Set protein, carbs and fat for anyone tracking them. The planner leans toward dishes that fit, and your plan shows how close each day gets. Skip it and portions simply follow calories."},
 {id:"meals",type:"multi",min:1,q:"Which meals should we plan?",sub:"Pick all that apply.",opts:[["breakfast","Breakfast"],["lunch","Lunch"],["dinner","Dinner"]]},
 {id:"days",type:"single",q:"How many days do you want planned?",opts:[[3,"3 days","Mon, Wed, Fri"],[5,"5 days","Monday to Friday"],[7,"7 days","The whole week"]]},
 {id:"diet",type:"single",q:"Do you follow an eating style?",opts:[["none","No preference","I eat everything"],["vegetarian","Vegetarian","No meat or fish"],["pescatarian","Pescatarian","Fish and seafood, no meat"]]},
 {id:"avoid",type:"multi",none:"No allergies",q:"Any allergies or foods you can't eat?",sub:"We'll never plan a recipe that contains these.",opts:[["gluten","Gluten"],["dairy","Dairy"],["egg","Eggs"],["nuts","Peanuts & tree nuts"],["sesame","Sesame"],["shellfish","Shellfish"],["fish","Fish"],["pork","Pork"],["beef","Beef"]]},
 {id:"favorites",type:"multi",none:"I like a bit of everything",q:"What are your favorite foods?",sub:"Pick as many as you like. We'll plan more of what you love.",opts:[["chicken","Chicken"],["beef","Beef & steak"],["pork","Pork & sausage"],["seafood","Shrimp & fish"],["veggie","Vegetarian mains"],["pasta","Pasta"],["noodles","Noodles & ramen"],["rice","Rice bowls"],["tacos","Tacos & burritos"],["sandwiches","Burgers & sandwiches"],["soups","Soups & stews"],["curries","Curries"],["salads","Big salads"],["pizza","Pizza & flatbreads"],["cheesy","Cheesy comfort food"],["spicy","Spicy food"],["breakfast_eggs","Eggy breakfasts"],["sweet_breakfast","Sweet breakfasts"]]},
 {id:"dislikes",type:"multi",none:"I'll eat anything",q:"Anything you'd rather not eat?",sub:"We'll steer around these. Garnishes like cilantro can just be left off.",opts:[["spicy","Spicy food"],["cilantro","Cilantro"],["coconut","Coconut"],["avocado","Avocado"],["feta","Feta"],["beans","Beans & lentils"],["kale","Kale"],["sweet_potato","Sweet potato"],["olives","Olives"],["mushroom_tofu","Tofu"]]},
 {id:"cuisines",type:"multi",none:"Surprise me",q:"Which cuisines do you love?",sub:"Pick as many as you like. We'll plan more of these and still mix in others.",opts:CUISINE_OPTS},
 {id:"goals",type:"multi",none:"Nothing in particular",q:"What matters most this week?",sub:"Pick up to three.",max:3,opts:[["budget","Spending less"],["quick","Saving time"],["protein","More protein"],["lowcarb","Fewer carbs"],["variety","Trying new things"]]},
 {id:"time",type:"single",q:"How long can you spend cooking on a weeknight?",opts:[[20,"20 minutes or less"],[30,"About 30 minutes"],[45,"Up to 45 minutes"],[90,"Time isn't an issue"]]},
 {id:"skill",type:"single",q:"How comfortable are you in the kitchen?",opts:[[1,"Just starting out","Simple steps and few pans"],[2,"Comfortable","I can follow most recipes"],[3,"Confident","Bring on anything"]]},
 {id:"leftovers",type:"single",cond:A=>A.meals.includes("lunch")&&A.meals.includes("dinner"),q:"Want dinner leftovers for lunch?",sub:"Cooking a bigger batch at night covers the next day's lunch.",opts:[["yes","Yes, cook once and eat twice","Fewer recipes, less cooking"],["no","No, plan separate lunches","A fresh recipe for every meal"]]},
 {id:"budget",type:"single",q:"What's your weekly grocery budget?",opts:[[75,"Under $75"],[150,"$75 to $150"],[250,"$150 to $250"],[1000,"I'm flexible"]]},
 {id:"stores",type:"stores",min:1,q:"Where do you shop?",sub:"Pick every store you're happy to visit. We'll split your list between them."},
 {id:"mode",type:"single",cond:A=>A.stores.length>1,q:"When more than one of your stores sells something…",opts:[["cheap","Buy it wherever it's cheapest","Lowest total, maybe an extra stop"],["stops","Keep my stops to a minimum","Fewer stores, slightly higher total"]]},
];
const BLANK = {people:[{name:"",kcal:2000},{name:"",kcal:1800}],meals:[],days:null,diet:null,avoid:null,favorites:null,dislikes:null,cuisines:null,goals:null,time:null,skill:null,leftovers:null,budget:null,stores:[],mode:null};
let OB = null; // {i, A}
const visibleQs = A => QUESTIONS.filter(q=>!q.cond || q.cond(A));
function answered(q,A){
  if(q.type==="people") return A.people.length>0 && A.people.every(p=>p.kcal>=1000 && p.kcal<=5000);
  if(q.type==="macros") return true;
  if(q.type==="multi"||q.type==="stores") return Array.isArray(A[q.id]) && A[q.id].length>=(q.min||0) && (q.min || A[q.id].length || A[q.id]._none);
  return A[q.id]!=null;
}
function answerText(q,A){
  const v=A[q.id];
  if(q.type==="people") return A.people.map((p,i)=>personName(p,i)+" ("+p.kcal.toLocaleString()+" kcal)").join(", ");
  if(q.type==="macros"){ const w=A.people.map((p,i)=>p.macros?`${personName(p,i)}: ${p.macros.p} g protein, ${p.macros.c} g carbs, ${p.macros.f} g fat`:null).filter(Boolean); return w.length?w.join(" · "):"Not set. Portions follow calories."; }
  if(q.type==="stores") return listJoin(v.map(s=>STORES[s].name));
  if(q.type==="multi") return v.length ? listJoin(v.map(x=>q.opts.find(o=>o[0]===x)[1])) : q.none;
  const o=q.opts.find(o=>o[0]===v); return o?o[1]:"";
}

function renderWelcome(){
  const m=$("#app"); m.innerHTML="";
  m.append(el("div",{class:"welcome"},
    el("div",{class:"eyebrow"},"Your weekly meal planner"),
    el("h2",{},"Tell us how you eat. We'll plan the week and write your grocery list."),
    el("p",{class:"lede"},"Tell us who's eating and each person's daily calories, what you love and where you shop. You'll get a meal plan with portions sized for each of you, "+RECIPES.length+" recipes to choose from, and a list of exactly what to buy at the stores you shop at, from "+STORE_IDS.length+" grocery chains."),
    el("div",{class:"actions"}, el("button",{class:"btn primary big",id:"startBtn",onclick:()=>startQuiz()},"Get started"),
      Object.keys(PLANS).length?el("button",{class:"btn big",onclick:openPlansSheet},"My plans ("+Object.keys(PLANS).length+")"):el("span",{class:"note"},"Takes about a minute"))));
}
function startQuiz(edit){
  const A = edit && S.profile ? structuredClone(S.profile) : structuredClone(BLANK);
  for(const k of ["avoid","favorites","dislikes","goals","cuisines"]) if(A[k] && !A[k].length) A[k]._none=true;
  OB = {i:0, A, edit:!!edit}; renderQuiz();
}
function renderQuiz(){
  const A=OB.A, qs=visibleQs(A), m=$("#app"), sameQ=OB.shown===OB.i, y=window.scrollY; m.innerHTML="";
  if(OB.i>=qs.length) return renderReview();
  const q=qs[OB.i];
  const body=el("div",{class:"opts"+(q.type==="single"&&q.opts.some(o=>o[2])?" tall":"")});
  if(q.type==="people"){
    body.className="peoplewrap"; body.append(peopleEditor(A));
  } else if(q.type==="macros"){
    body.className="peoplewrap";
    A.people.forEach((p,i)=>body.append(el("div",{class:"person"}, el("div",{class:"pg-top"}, el("b",{},personName(p,i)), el("span",{class:"mono note"},fmtInt(p.kcal)+" kcal a day")), macroEditor(p,i))));
  } else if(q.type==="stores"){
    body.className="storepick-wrap";
    body.append(storePicker(A, ()=>renderQuiz()));
  } else {
    const multi=q.type==="multi", cur=A[q.id];
    for(const [val,label,desc] of q.opts){
      const on = multi ? (cur||[]).includes(val) : cur===val;
      body.append(el("button",{class:"opt","aria-pressed":on,onclick:()=>{
        if(multi){ let a=(cur||[]).filter(x=>x!==val); if(!on){ if(q.max && a.length>=q.max){ toast("Pick up to "+q.max); return; } a.push(val); } A[q.id]=a; renderQuiz(); }
        else { A[q.id]=val; renderQuiz(); setTimeout(()=>{ if(OB && visibleQs(OB.A)[OB.i]===q){ OB.i++; renderQuiz(); } },220); }
      }}, el("span",{class:"ol"},label), desc?el("span",{class:"od"},desc):null)); }
    if(multi && q.none){ const on=!!(cur && !cur.length && cur._none);
      body.append(el("button",{class:"opt none","aria-pressed":on,onclick:()=>{ const a=[]; a._none=true; A[q.id]=a; renderQuiz(); }}, el("span",{class:"ol"},q.none))); }
  }
  const ok=answered(q,A);
  m.append(el("div",{class:"quiz"},
    el("div",{class:"progress","aria-hidden":"true"}, el("div",{style:`width:${Math.round((OB.i)/qs.length*100)}%`})),
    el("div",{class:"step"},"Question "+(OB.i+1)+" of "+qs.length),
    el("h2",{},q.q), q.sub?el("p",{class:"lede"},q.sub):null, body,
    el("div",{class:"qnav"},
      el("button",{class:"btn",onclick:()=>{ if(OB.i===0){ OB=null; S.profile?showApp("plan"):renderWelcome(); } else { OB.i--; renderQuiz(); } }}, OB.i===0?(S.profile?"Cancel":"Back"):"Back"),
      el("button",{class:"btn primary",id:"nextBtn",disabled:!ok,onclick:()=>{ OB.i++; renderQuiz(); }}, "Continue"))));
  window.scrollTo(0, sameQ ? y : 0); OB.shown=OB.i;
}
function renderReview(){
  const A=OB.A, qs=visibleQs(A), m=$("#app"); m.innerHTML="";
  m.append(el("div",{class:"quiz"},
    el("div",{class:"progress"}, el("div",{style:"width:100%"})),
    el("div",{class:"step"},"Almost done"),
    el("h2",{},"Here's what you told us"),
    el("p",{class:"lede"},"Tap any answer to change it."),
    el("div",{class:"review"}, qs.map((q,i)=>el("button",{class:"rv",onclick:()=>{ OB.i=i; renderQuiz(); }}, el("span",{class:"rq"},q.q), el("span",{class:"ra"},answerText(q,A))))),
    el("div",{class:"qnav"}, el("button",{class:"btn",onclick:()=>{ OB.i=qs.length-1; renderQuiz(); }},"Back"),
      el("button",{class:"btn primary",id:"buildBtn",onclick:finishQuiz},"Build my meal plan"))));
}
function finishQuiz(){
  const A=OB.A; for(const k of ["avoid","favorites","dislikes","goals","cuisines"]) A[k]=[...(A[k]||[])];
  A.people=A.people.map((p,i)=>({name:personName(p,i),kcal:p.kcal,macros:p.macros?{p:p.macros.p,c:p.macros.c,f:p.macros.f}:null}));
  if(!A.meals.includes("lunch")||!A.meals.includes("dinner")) A.leftovers="no";
  if(A.stores.length<2) A.mode="cheap";
  delete A._q; const isNew=!OB.edit || !S.planId;
  S.profile=A; S.stores=A.stores.slice(); S.mode=A.mode; S.overrides={}; S.checked={};
  if(isNew){ S.planId=null; S.planName=null; S.planCreated=null; }
  OB=null;
  const m=$("#app"); m.innerHTML="";
  m.append(el("div",{class:"building"}, el("div",{class:"spinner"}), el("h2",{},"Building your week…"), el("p",{class:"lede"},"Matching "+RECIPES.length+" recipes to your answers and pricing your groceries.")));
  setTimeout(()=>{ generatePlan(); save(); showApp("plan"); }, 900);
}

/* ------------------------------------------------------------------ store picker (quiz and grocery tab) */
// st: {stores:[...], region, _q}; changed() re-renders the caller
function storePicker(st, changed){
  const region=st.region||"all", q=(st._q||"").trim().toLowerCase();
  const inRegion = s => region==="all" || STORES[s].regions==="all" || STORES[s].regions.split(" ").includes(region);
  const matches = s => !q || (STORES[s].name+" "+(STORES[s].also||"")).toLowerCase().includes(q);
  const card = s => { const on=st.stores.includes(s), x=STORES[s];
    return el("button",{class:"opt store","aria-pressed":on,style:`--sc:var(${x.css})`,onclick:()=>{ st.stores=on?st.stores.filter(y=>y!==s):[...st.stores,s]; changed(); }},
      el("span",{class:"sw"},x.short),
      el("span",{class:"stx"}, el("span",{class:"ol"},x.name), el("span",{class:"note"},(x.also?x.also:STORE_KIND[x.kind])+(x.idx?"":" · hand-priced")))); };
  const nat=STORE_IDS.filter(s=>STORES[s].regions==="all" && matches(s));
  const reg=STORE_IDS.filter(s=>STORES[s].regions!=="all" && (inRegion(s)||st.stores.includes(s)) && matches(s));
  const search=el("input",{class:"search",id:"storeq",type:"search",placeholder:"Search stores, e.g. Ralphs, Publix, H-E-B",value:st._q||"",
    oninput:e=>{ st._q=e.target.value; const pos=e.target.selectionStart; changed(); const f=$("#storeq"); if(f){ f.focus(); f.setSelectionRange(pos,pos); } }});
  return el("div",{class:"storepick"},
    el("div",{class:"spctl"},
      el("label",{class:"fld"}, el("span",{class:"eyebrow"},"Where you live"),
        el("select",{id:"storeRegion",onchange:e=>{ st.region=e.target.value; changed(); }}, REGIONS.map(([k,l])=>el("option",{value:k,selected:region===k},l)))),
      el("label",{class:"fld grow"}, el("span",{class:"eyebrow"},"Find a store"), search)),
    el("p",{class:"note",style:"margin:0"}, st.stores.length ? `${st.stores.length} picked: ${listJoin(st.stores.map(s=>STORES[s].name))}` : "Pick at least one store."),
    nat.length ? el("h3",{class:"sub"},"Nationwide") : null,
    nat.length ? el("div",{class:"opts stores"}, nat.map(card)) : null,
    reg.length ? el("h3",{class:"sub"}, region==="all" ? "Regional chains" : "Regional chains in "+REGIONS.find(r=>r[0]===region)[1]) : null,
    reg.length ? el("div",{class:"opts stores"}, reg.map(card)) : null,
    !nat.length && !reg.length ? el("div",{class:"empty"},"No store matches that search. Try another name, or pick a nearby chain with similar prices.") : null,
    el("p",{class:"note"},"Trader Joe's, Costco, Aldi and Walmart use hand-checked typical prices. Other chains are estimated from their usual price level, so check shelf prices in-store. Warehouse clubs only sell bulk sizes, so pair one with a regular store."));
}
function openStoreSheet(){
  const st={stores:S.stores.slice(), region:(S.profile&&S.profile.region)||"all", _q:""};
  const p=$("#panel");
  const draw=()=>keepSheetScroll(()=>{ p.innerHTML="";
    p.append(el("div",{class:"content"},
      el("div",{class:"swaphead"}, el("div",{}, el("div",{class:"eyebrow"},"Grocery list"), el("h2",{id:"dTitle"},"Where do you shop?")), el("button",{class:"close static","aria-label":"Close",onclick:closeSheet},"×")),
      storePicker(st, draw),
      el("div",{class:"actions",style:"position:sticky;bottom:0;background:var(--surface);padding:12px 0"},
        el("button",{class:"btn primary",disabled:!st.stores.length,onclick:()=>{ S.stores=st.stores.slice(); if(S.profile){ S.profile.stores=S.stores.slice(); S.profile.region=st.region; } S.overrides={}; save(); closeSheet(); refresh(); toast("Shopping at "+listJoin(S.stores.map(s=>STORES[s].name))); }},"Use these stores"),
        el("button",{class:"btn",onclick:closeSheet},"Cancel")))); });
  draw(); $("#sheet").hidden=false; document.body.style.overflow="hidden"; $("#sheet").scrollTop=0;
}

/* ------------------------------------------------------------------ theme picker (mode, style, accent; see src/theme.js) */
function openThemeSheet(){
  THEME.loadAllFonts();
  const p=$("#panel");
  const draw=()=>keepSheetScroll(()=>{ const t=THEME.get(); p.innerHTML="";
    const pick=patch=>{ THEME.set(patch); draw(); };
    p.append(el("div",{class:"content themes"},
      el("div",{class:"swaphead"}, el("div",{}, el("div",{class:"eyebrow"},"Make it yours"), el("h2",{id:"dTitle"},"Theme")), el("button",{class:"close static","aria-label":"Close",onclick:closeSheet},"×")),
      el("section",{}, el("h3",{class:"sub"},"Mode"),
        el("div",{class:"seg",role:"group","aria-label":"Mode"}, [["auto","Auto"],["light","Light"],["dark","Dark"]].map(([k,l])=>el("button",{"aria-pressed":t.mode===k,onclick:()=>pick({mode:k})},l))),
        el("p",{class:"note"},"Auto follows your device's light or dark setting.")),
      el("section",{}, el("h3",{class:"sub"},"Style"),
        el("div",{class:"tgrid"}, THEME.STYLES.map(([k,name,desc])=>el("button",{class:"tcard","aria-pressed":t.style===k,onclick:()=>pick({style:k}),"aria-label":name+" style"},
          el("div",{class:"tprev","data-pv":k}, el("b",{},name), el("div",{class:"tbar"}, el("i"), el("i"))),
          el("div",{class:"tname"}, el("b",{},name), el("span",{},desc)))))),
      el("section",{}, el("h3",{class:"sub"},"Accent colour"),
        el("div",{class:"aswatches"}, THEME.ACCENTS.map(([k,name,sw])=>el("button",{class:"asw"+(k==="style"?" style":""),style:sw?`--sw:${sw}`:"","aria-pressed":t.accent===k,title:name,"aria-label":name,onclick:()=>pick({accent:k})}))),
        el("p",{class:"note"}, t.accent==="style" ? "Using this style's own colours." : "Accent: "+THEME.ACCENTS.find(a=>a[0]===t.accent)[1]+". It recolours buttons, highlights and links in any style.")),
      el("p",{class:"note"}, cloudUser ? "Your theme is saved to your account, so it follows you to other devices." : "Your theme is saved on this device. Sign in to keep it on every device.")));
  });
  draw(); $("#sheet").hidden=false; document.body.style.overflow="hidden"; $("#sheet").scrollTop=0;
}
$("#themeBtn").addEventListener("click", openThemeSheet);
window.addEventListener("themechange", e=>{ S.theme=e.detail; save(); });

/* ------------------------------------------------------------------ planner */
const SOFT_DISLIKES = new Set(["cilantro","avocado","feta"]);
const DISLIKE_TEST = {
  spicy:r=>META[r.id].has.includes("spicy"),
  cilantro:r=>r.ing.some(i=>i[0]==="cilantro"), coconut:r=>r.ing.some(i=>i[0]==="coconut_milk"),
  avocado:r=>r.ing.some(i=>i[0]==="avocado"), feta:r=>r.ing.some(i=>i[0]==="feta"), kale:r=>r.ing.some(i=>i[0]==="kale"),
  sweet_potato:r=>r.ing.some(i=>i[0]==="sweet_potato"),
  beans:r=>r.ing.some(i=>["black_beans","cannellini","chickpeas","kidney_beans","red_lentils","brown_lentils","refried_beans"].includes(i[0])),
  olives:r=>r.ing.some(i=>i[0]==="olives"), mushroom_tofu:r=>r.ing.some(i=>i[0]==="tofu"),
};
function planDays(){ const n=S.profile.days; return n===3?["Monday","Wednesday","Friday"]:ALL_DAYS.slice(0,n); }
function eligible(r){
  const A=S.profile, m=META[r.id];
  if(A.diet==="vegetarian" && !m.veg) return false;
  if(A.diet==="pescatarian" && !m.pesc) return false;
  if(A.avoid.some(a=>m.has.includes(a))) return false;
  return true;
}
function score(r, jitter){
  const A=S.profile, m=META[r.id]; let s=jitter*(A.goals.includes("variety")?5:2.5);
  if(A.cuisines.includes(m.cuisine)) s+=4;
  let fav=0; for(const f of (A.favorites||[])) if(FAV_TEST[f] && FAV_TEST[f](r)) fav++;
  s+=Math.min(3,fav)*1.8;
  if(A.time<90 && r.time>A.time) s-= 2 + Math.min(r.time-A.time,60)/5;
  if(m.skill>A.skill) s-=3*(m.skill-A.skill);
  if(A.goals.includes("protein")) s+= r.protein>=28?2.5:(r.protein<15?-1:0);
  if(A.goals.includes("lowcarb")) s+= m.lc?2.5:-0.5;
  if(A.goals.includes("quick")) s+= r.time<=20?2.5:(r.time>=40?-2:0);
  const cps=recipeCost(r).perServing;
  if(A.goals.includes("budget")||A.budget<=75) s+= (2.6-cps)*1.4;
  for(const d of A.dislikes) if(DISLIKE_TEST[d] && DISLIKE_TEST[d](r)) s-= SOFT_DISLIKES.has(d)?1.5:8;
  if(recipeCost(r).miss.length) s-=6;
  const mm=macroMiss(r); if(mm!==null) s += (0.4-mm)*16; // people who set macros care about them more than most preferences
  return s;
}
function ranked(meal, seed){
  const R=rng("plan"+seed+meal), out=[];
  for(const b of RECIPES){
    if(!(b.meal.toLowerCase()===meal || (meal==="lunch" && b.meal==="Dinner" && b.time<=25))) continue;
    const vs=versionsOf(b).filter(eligible); if(!vs.length) continue;
    const j=R(); out.push(vs.map(v=>({v,s:score(v,j)+(v.base?0:2.5)})).sort((a,c)=>c.s-a.s)[0]);
  }
  return out.sort((a,c)=>c.s-a.s).map(x=>x.v.id);
}
function pickSeq(order, n){
  const out=[];
  for(let i=0;i<n;i++){
    if(!order.length){ out.push(null); continue; }
    const prevP = out[i-1] && META[out[i-1]].protein;
    let id = order.find(x=>!out.includes(x) && META[x].protein!==prevP) || order.find(x=>!out.includes(x)) || order[i%order.length];
    out.push(id);
  }
  return out;
}
function generatePlan(seed){
  seed = seed ?? Math.floor(Math.random()*1e6);
  const A=S.profile, n=planDays().length;
  const want = k=>A.meals.includes(k);
  S.plan={seed, b: want("breakfast")?pickSeq(ranked("breakfast",seed),n):[], l: want("lunch")?pickSeq(ranked("lunch",seed),n):[], d: want("dinner")?pickSeq(ranked("dinner",seed),n):[]};
  // breakfasts repeat well; with 5+ days, use the top 3 on rotation to keep shopping simple
  if(S.plan.b.length>4){ const top=[...new Set(S.plan.b)].slice(0,3); S.plan.b=S.plan.b.map((_,i)=>top[i%top.length]||null); }
}
const leftoversOn = () => S.profile && S.profile.leftovers==="yes" && S.plan.d.length && S.plan.l.length;
function planDemand(){
  const d={};
  for(const s of slotsOf()){ if(!s.id||s.leftover) continue; const r=R_BY_ID[s.id], f=s.portions/r.serves;
    for(const [item,use] of r.ing) d[item]=(d[item]||0)+use*f; }
  return d;
}
function planRecipeIds(){ return [...new Set(slotsOf().filter(s=>s.id&&!s.leftover).map(s=>s.id))]; }
function alternativesFor(meal, i){
  const key=meal[0], cur=S.plan[key][i];
  return ranked(meal, S.plan.seed).filter(id=>id!==cur);
}
function swapSlot(meal,i,id){
  const key=meal[0];
  if(!id){ const alts=alternativesFor(meal,i), used=new Set(S.plan[key]); id = alts.find(x=>!used.has(x)) || alts[0]; }
  if(!id){ toast("No other "+meal+" recipes fit your answers"); return; }
  S.plan[key][i]=id; save(); keepScroll(renderPlan); toast("Swapped in "+R_BY_ID[id].title);
}

/* ------------------------------------------------------------------ app shell */
let tab="plan";
function showApp(t){
  const prevTab=tab, y=window.scrollY; tab=t||tab;
  $("#tabs").hidden=false; $("#editBtn").hidden=false; $("#resetBtn").hidden=false;
  const m=$("#app"); m.innerHTML="";
  for(const b of document.querySelectorAll("#tabs button")) b.setAttribute("aria-selected", b.dataset.tab===tab);
  ({plan:renderPlan, prep:renderPrep, groceries:renderGroceries, recipes:renderRecipes, pdf:renderPdfTab, profile:openProfile})[tab]();
  renderCounts(); window.scrollTo(0, tab===prevTab ? y : 0);
}
document.querySelectorAll("#tabs button").forEach(b=>b.addEventListener("click",()=>showApp(b.dataset.tab)));
$("#editBtn").addEventListener("click",()=>{ $("#tabs").hidden=true; $("#editBtn").hidden=true; $("#resetBtn").hidden=true; startQuiz(true); });
let resetArmed=0;
$("#resetBtn").addEventListener("click", openPlansSheet);
function renderCounts(){ if(!S.plan) return; $("#listCount").textContent=Object.keys(planDemand()).length; }

function planTotals(){
  const d=planDemand(), {result,missing}=assign(d); let total=0; const used=new Set();
  for(const [i,s] of Object.entries(result)){ total+=storeCost(i,s,d[i]); used.add(s); }
  return {d,result,missing,total,used:[...used]};
}

function planTitle(){ const n=planDays().length; return n===7?"Seven days of meals, planned":n===5?"Your weeknights, planned":"Three days of meals, planned"; }
function profileSentence(){
  const A=S.profile, bits=[];
  bits.push("For "+answerText(QUESTIONS[0],A));
  if(A.diet!=="none") bits.push(A.diet);
  if(A.avoid.length) bits.push("no "+listJoin(A.avoid.map(a=>QUESTIONS[4].opts.find(o=>o[0]===a)[1].toLowerCase())));
  bits.push("up to "+(A.time>=90?"any time":A.time+" minutes")+" a night");
  bits.push("shopping at "+listJoin(A.stores.map(s=>STORES[s].name)));
  return bits.join(" · ")+".";
}

/* ------------------------------------------------------------------ recipe sheet */
function closeSheet(){ $("#sheet").hidden=true; document.body.style.overflow=""; }
$("#sheet").addEventListener("click",e=>{ if(e.target.id==="sheet") closeSheet(); });
document.addEventListener("keydown",e=>{ if(e.key==="Escape" && !$("#sheet").hidden) closeSheet(); });
function refresh(){ if(S.profile && !OB) showApp(tab); }
// redraw without losing the reader's place (tapping an option shouldn't jump the page back to the top)
function keepScroll(fn){ const y=window.scrollY; fn(); window.scrollTo(0,y); }
function keepSheetScroll(fn){ const sh=$("#sheet"), y=sh.scrollTop; fn(); sh.scrollTop=y; }

let photoTarget=null;
function pickPhoto(id){ photoTarget=id; $("#photoInput").value=""; $("#photoInput").click(); }
$("#photoInput").addEventListener("change", async e=>{
  const f=e.target.files[0]; if(!f||!photoTarget) return;
  const id=photoTarget; toast("Adding photo…");
  try{
    const blob = await shrinkImage(f, 1100);
    const url = await new Promise(res=>{ const fr=new FileReader(); fr.onload=()=>res(fr.result); fr.readAsDataURL(blob); });
    S.photos[id]=url; save();
    if(cloudUser && cloudOn()) cloud.savePhoto(id, url).catch(()=>toast("Photo saved here, but not to your account. Check your connection."));
    toast("Photo added"); openRecipe(id); refresh();
  }catch(err){ toast("That image couldn't be read. Try a JPEG or PNG."); }
});
function shrinkImage(file,max){ return new Promise((res,rej)=>{ const img=new Image(); img.onload=()=>{
  const k=Math.min(1,max/Math.max(img.width,img.height)), c=document.createElement("canvas"); c.width=Math.round(img.width*k); c.height=Math.round(img.height*k);
  c.getContext("2d").drawImage(img,0,0,c.width,c.height); c.toBlob(b=>b?res(b):rej(),"image/jpeg",0.8); URL.revokeObjectURL(img.src); }; img.onerror=rej; img.src=URL.createObjectURL(file); }); }

/* ------------------------------------------------------------------ groceries */
function renderGroceries(){
  const m=$("#app"); m.innerHTML=""; const A=S.profile, t=planTotals(), d=t.d;
  const singles = S.stores.map(s=>{ let tot=0; for(const i of Object.keys(d)){ if(!offers(i)[s]) return null; tot+=storeCost(i,s,d[i]); } return {s,t:tot}; }).filter(Boolean).sort((a,b)=>a.t-b.t);
  m.append(el("div",{class:"planhead"},
    el("div",{}, el("div",{class:"eyebrow"},"Grocery list"), el("h2",{},"What to buy, store by store"),
      el("p",{class:"lede"},"Everything for your "+planDays().length+"-day plan, sized for "+answerText(QUESTIONS[0],A)+". Prices are estimates; check them in-store.")),
    el("div",{class:"actions"},
      S.stores.length>1?el("div",{class:"seg",id:"modeSeg"}, [["cheap","Lowest total"],["stops","Fewest stops"]].map(([k,l])=>el("button",{"aria-pressed":S.mode===k,onclick:()=>{ S.mode=k; S.overrides={}; save(); keepScroll(renderGroceries); }},l))):null,
      el("button",{class:"btn small",id:"storesBtn",onclick:openStoreSheet},"Change stores"),
      el("button",{class:"btn small",onclick:()=>{ S.checked={}; save(); keepScroll(renderGroceries); }},"Uncheck all"))));
  m.append(el("div",{class:"summary"},
    el("div",{class:"stat"},el("b",{class:"mono"},money(t.total)),el("span",{},"Est. total")),
    el("div",{class:"stat"},el("b",{class:"mono"},t.used.length),el("span",{},"Stores to visit")),
    el("div",{class:"stat"},el("b",{class:"mono"},Object.keys(d).length),el("span",{},"Items")),
    singles.length && S.stores.length>1 ? el("div",{class:"stat"},el("b",{class:"mono"},money(singles[0].t)),el("span",{},"All at "+STORES[singles[0].s].name)) : null));
  const byStore={}; for(const [i,s] of Object.entries(t.result)) (byStore[s]=byStore[s]||[]).push(i);
  const wrap=el("div",{class:"listcols"});
  if(t.missing.length) wrap.append(el("div",{class:"missingbox"}, el("h3",{},"Not sold at your stores"),
    t.missing.map(i=>el("div",{class:"item"}, el("span",{}), el("div",{}, el("div",{class:"nm"},ITEMS[i][0]), el("div",{class:"pd"},"Available at "+listJoin(storesCarrying(i).map(s=>STORES[s].name)))), el("span",{})))));
  for(const s of S.stores){ const items=byStore[s]; if(!items) continue;
    let sub=0; for(const i of items) sub+=storeCost(i,s,d[i]);
    const box=el("div",{class:"storebox",style:`--sc:var(${STORES[s].css})`}, el("header",{}, el("h3",{},STORES[s].name), el("span",{class:"mono"},money(sub))));
    for(const a of AISLES){ const its=items.filter(i=>ITEMS[i][1]===a); if(!its.length) continue;
      box.append(el("div",{class:"aisle"}, el("div",{class:"eyebrow"},a), its.map(i=>{
        const o=offers(i)[s], k=packsFor(i,s,d[i]), done=!!S.checked[i], alts=S.stores.filter(x=>offers(i)[x]);
        const row=el("div",{class:"item"+(done?" done":"")},
          el("input",{type:"checkbox",id:"chk-"+i,checked:done,"aria-label":"Got "+ITEMS[i][0],onchange:e=>{ if(e.target.checked) S.checked[i]=1; else delete S.checked[i]; save(); row.classList.toggle("done",e.target.checked); }}),
          el("div",{style:"min-width:0"}, el("label",{class:"nm",for:"chk-"+i},ITEMS[i][0]), el("div",{class:"pd"},(k>1?k+" × ":"")+o[0]),
            alts.length>1 ? el("select",{"aria-label":"Buy "+ITEMS[i][0]+" at",onchange:e=>{ S.overrides[i]=e.target.value; save(); keepScroll(renderGroceries); }},
              alts.map(x=>el("option",{value:x,selected:x===s},"Buy at "+STORES[x].name+" · "+money(storeCost(i,x,d[i]))))) : null),
          el("div",{class:"amt"}, money(k*o[1])));
        return row; })));
    }
    wrap.append(box);
  }
  const pantry=[...new Set(planRecipeIds().flatMap(id=>R_BY_ID[id].pantry.split(/,\s*/)).map(x=>x.replace(/^\d+[^a-z]*\s*(tbsp|tsp|cup)?\s*/i,"").replace(/\(.*?\)/g,"").trim()).filter(Boolean))];
  wrap.append(el("div",{class:"storebox",style:"--sc:var(--line)"}, el("header",{}, el("h3",{},"Check your pantry")),
    el("p",{class:"note",style:"margin:0 0 6px"},"Staples the recipes assume you have. Not priced."), el("p",{style:"margin:0"},pantry.join(" · "))));
  m.append(wrap);
}

/* ------------------------------------------------------------------ browse */
let mealFilter="All", query="", cuisineFilter="";
function renderRecipes(){
  const m=$("#app"); m.innerHTML="";
  m.append(el("div",{class:"toolbar"},
    el("div",{class:"seg"}, ["All","Breakfast","Lunch","Dinner"].map(x=>el("button",{"aria-pressed":mealFilter===x,onclick:()=>{mealFilter=x;keepScroll(renderRecipes);}},x))),
    el("select",{id:"cuisineSel","aria-label":"Cuisine",onchange:e=>{ cuisineFilter=e.target.value; drawGrid(); }}, el("option",{value:""},"All cuisines ("+RECIPES.length+")"), CUISINE_OPTS.map(([k,l])=>el("option",{value:k,selected:cuisineFilter===k},l+" ("+RECIPES.filter(r=>META[r.id].cuisine===k).length+")"))),
    el("input",{class:"search",id:"search",type:"search",placeholder:"Search recipes or ingredients","aria-label":"Search recipes",value:query,oninput:e=>{ query=e.target.value; drawGrid(); }})));
  const g=el("div",{class:"grid",id:"grid"}); m.append(g); drawGrid();
}
function drawGrid(){
  const g=$("#grid"); g.innerHTML=""; const q=query.trim().toLowerCase(), inPlan=new Set(planRecipeIds());
  const list=RECIPES.filter(r=>(mealFilter==="All"||r.meal===mealFilter) && (!cuisineFilter||META[r.id].cuisine===cuisineFilter) && (!q || (r.title+" "+r.blurb+" "+r.ing.map(i=>i[2]).join(" ")).toLowerCase().includes(q)));
  if(!list.length){ g.append(el("div",{class:"empty"},"No recipes match that search.")); return; }
  for(const r of list){ const c=recipeCost(r), fits=eligible(r);
    g.append(el("button",{class:"card",onclick:()=>openRecipe(r.id)},
      el("div",{class:"pic"}, el("img",{src:imgFor(r),"data-rid":r.id,alt:r.title,loading:"lazy"}), el("span",{class:"meal"},r.meal), el("span",{class:"cuisine-tag"},CUISINE_LABEL[META[r.id].cuisine]||""), inPlan.has(r.id)?el("span",{class:"inweek"},"In your plan"):(!fits?el("span",{class:"inweek off"},"Doesn't fit your answers"):null)),
      el("div",{class:"body"}, el("h3",{},r.title),
        el("div",{class:"meta"}, el("span",{},r.time+" min"), el("span",{},fmtInt(r.kcal)+" kcal"), el("span",{},r.protein+" g protein"), el("span",{},"Makes "+r.serves)),
        r.builder?el("div",{class:"vline"},"Build your own: "+BSB_ALL.length+" combinations"):(versionsOf(r).length>1?el("div",{class:"vline"},"Also with: "+versionsOf(r).slice(1).map(proteinLabel).join(", ")):null),
        el("div",{class:"foot"}, el("div",{class:"dots"}, c.stores.map(storeDot)),
          c.miss.length ? el("span",{class:"flag"},c.miss.length+" item"+(c.miss.length>1?"s":"")+" not at your stores") : el("span",{class:"price"}, money(c.perServing)+" / serving")))));
  }
}

/* ------------------------------------------------------------------ PDF tab */
/* ------------------------------------------------------------------ nutrition helpers */
const fmtInt = n => Math.round(n).toLocaleString("en-US");
function sumNutrition(list){ const t={kcal:0,protein:0,carbs:0,fat:0,fiber:0,sugar:0,sodium:0}; for(const n of list) for(const k in t) t[k]+=n[k]; return t; }
function macroSplit(n){ const p=n.protein*4, c=n.carbs*4, f=n.fat*9, t=Math.max(1,p+c+f); return {p:Math.round(p/t*100), c:Math.round(c/t*100), f:100-Math.round(p/t*100)-Math.round(c/t*100)}; }
function nutritionPanel(r){
  const n=nutritionOf(r), sp=macroSplit(n);
  const row=(label,key,unit)=>{ const pct=Math.min(100,Math.round(n[key]/DV[key]*100));
    return el("div",{class:"nrow"}, el("span",{class:"nl"},label), el("span",{class:"nv mono"},fmtInt(n[key])+unit), el("span",{class:"nbar"},el("i",{style:`width:${pct}%`})), el("span",{class:"np mono"},pct+"%")); };
  return el("div",{class:"nutri"},
    el("div",{class:"nhead"}, el("div",{}, el("b",{class:"mono"},fmtInt(n.kcal)), el("span",{},"calories per serving")),
      el("div",{class:"msplit"}, el("div",{class:"mbar"}, el("i",{class:"mp",style:`width:${sp.p}%`}), el("i",{class:"mc",style:`width:${sp.c}%`}), el("i",{class:"mf",style:`width:${sp.f}%`})),
        el("div",{class:"mleg"}, el("span",{},el("i",{class:"mp"}),`Protein ${sp.p}%`), el("span",{},el("i",{class:"mc"}),`Carbs ${sp.c}%`), el("span",{},el("i",{class:"mf"}),`Fat ${sp.f}%`)))),
    row("Protein","protein"," g"), row("Carbohydrates","carbs"," g"), row("Fat","fat"," g"), row("Fiber","fiber"," g"), row("Sugars","sugar"," g"), row("Sodium","sodium"," mg"),
    el("p",{class:"note",style:"margin:6px 0 0"},"Per serving, calculated from the ingredients. % of daily value on a 2,000-calorie diet."));
}
function storagePanel(r){
  const s=storageOf(r);
  return el("div",{class:"store-box"},
    el("div",{class:"sb"}, el("span",{class:"eyebrow"},"Makes"), el("b",{},r.serves+" servings"), el("span",{class:"note"},mealsText(r).replace(/^Makes \d+ servings \(\d+ single meals\)( · )?/,"")||"One serving per meal")),
    el("div",{class:"sb"}, el("span",{class:"eyebrow"},"Fridge"), el("b",{},s.fridge?s.fridge+" day"+(s.fridge>1?"s":""):"Eat fresh"), el("span",{class:"note"},"In a sealed container")),
    el("div",{class:"sb"}, el("span",{class:"eyebrow"},"Freezer"), el("b",{},s.freezer?"Up to "+s.freezer+" month"+(s.freezer>1?"s":""):"Don't freeze"), el("span",{class:"note"},s.freezer?"Thaw overnight in the fridge":"Texture suffers")),
    el("div",{class:"sb wide"}, el("span",{class:"eyebrow"},"Storing & reheating"), el("span",{},s.how)));
}

/* ------------------------------------------------------------------ plan view */
function renderPlan(){
  const m=$("#app"); m.innerHTML=""; const A=S.profile, t=planTotals(), slots=slotsOf();
  const meals=slots.filter(s=>s.id).length, avg=weekAvgNutrition(), ps=people();
  const over = t.total > A.budget && A.budget<1000;
  m.append(el("div",{class:"planhead"},
    el("div",{}, el("div",{class:"eyebrow"},S.planName||"Your week"), el("h2",{},planTitle()),
      el("p",{class:"lede"}, profileSentence())),
    el("div",{class:"actions"}, el("button",{class:"btn",id:"shuffleBtn",onclick:()=>{ generatePlan(); save(); renderPlan(); renderCounts(); toast("New plan ready"); }},"Shuffle plan"),
      el("button",{class:"btn",onclick:()=>showApp("groceries")},"Grocery list"),
      el("button",{class:"btn primary",onclick:()=>showApp("pdf")},"Export PDF"))));
  m.append(el("div",{class:"summary"},
    el("div",{class:"stat"},el("b",{class:"mono"},meals),el("span",{},"Meals")),
    el("div",{class:"stat"},el("b",{class:"mono"},planRecipeIds().length),el("span",{},"Recipes to cook")),
    el("div",{class:"stat"},el("b",{class:"mono"+(over?" warn":"")},money(t.total)),el("span",{},A.budget<1000?"Groceries · budget "+(A.budget===75?"under $75":"$"+A.budget):"Est. groceries")),
    el("div",{class:"stat"},el("b",{class:"mono"},money(t.total/Math.max(1,meals*ps.length))),el("span",{},"Per person, per meal"))));
  m.append(el("div",{class:"pgoals"}, avg.map(a=>{ const pct=Math.round(a.kcal/Math.max(1,a.target)*100);
    return el("div",{class:"pgoal"}, el("div",{class:"pg-top"}, el("b",{},a.name), el("span",{class:"mono"},fmtInt(a.kcal)+" / "+fmtInt(a.target)+" kcal")),
      el("div",{class:"nbar"},el("i",{style:`width:${Math.min(100,pct)}%`})),
      a.mt ? el("div",{class:"mbars"}, [["protein","Protein"],["carbs","Carbs"],["fat","Fat"]].map(([k,l])=>{ const q=Math.round(a[k]/Math.max(1,a.mt[k])*100);
        return el("div",{class:"mtgt"}, el("div",{class:"pg-top"}, el("span",{},l), el("span",{class:"mono"+(q>115||q<85?" warn":"")},fmtInt(a[k])+" / "+fmtInt(a.mt[k])+" g")), el("div",{class:"nbar"},el("i",{style:`width:${Math.min(100,q)}%`}))); })) : null,
      a.mt && a.protein < a.mt.protein*0.85 ? el("div",{class:"note warnline"}, `About ${fmtInt(a.mt.protein-a.protein)} g short on protein a day. Most dishes come with rice, pasta or bread, so take a bigger share of the meat or beans and less of the starch, swap toward "Most protein" dishes, or add a protein snack like Greek yogurt or eggs.`) : null,
      el("div",{class:"note"}, a.mt ? `Daily target ${fmtInt(a.daily)} kcal · ${fmtInt(a.macros.p)} g protein, ${fmtInt(a.macros.c)} g carbs, ${fmtInt(a.macros.f)} g fat · bars show planned meals vs their share`
        : `Daily target ${fmtInt(a.daily)} kcal · planned meals cover ${fmtInt(a.target)} · avg protein ${fmtInt(a.protein)} g, carbs ${fmtInt(a.carbs)} g, fat ${fmtInt(a.fat)} g`)); })));
  if(over) m.append(el("p",{class:"note warnline"},"This plan runs over your budget. Try Shuffle plan, or turn on leftovers for lunch to cook fewer recipes."));
  const days=planDays(), grid=el("div",{class:"days"});
  days.forEach((day,i)=>{
    const dn=dayNutrition(i);
    const row=el("div",{class:"dayrow"}, el("div",{}, el("h3",{class:"dname"},day),
      el("div",{class:"daynut mono"}, dn.map(d=>el("div",{},`${d.name}: ${fmtInt(d.kcal)} kcal`)))));
    const cards=el("div",{class:"slots"});
    for(const s of slots.filter(x=>x.i===i)){
      const r=s.id&&R_BY_ID[s.id];
      if(!r){ cards.append(el("div",{class:"slot empty"}, el("div",{class:"eyebrow"},s.label), el("p",{class:"note"},"No "+s.meal+" recipe fits your answers. Edit your answers to widen the options."))); continue; }
      const n=nutritionOf(r);
      cards.append(el("div",{class:"slot"},
        el("button",{class:"slotpic",onclick:()=>openRecipe(r.id,s),"aria-label":"Open "+r.title}, el("img",{src:imgFor(r),"data-rid":r.id,alt:"",loading:"lazy"}),
          s.leftover?el("span",{class:"badge"},"Leftovers"):null),
        el("div",{class:"slotbody"},
          el("div",{class:"eyebrow"},s.label+" · "+(CUISINE_LABEL[META[r.id].cuisine]||"")), el("button",{class:"slottitle",onclick:()=>openRecipe(r.id,s)},r.title),
          el("div",{class:"meta"}, el("span",{},fmtInt(n.kcal)+" kcal/serving"), s.leftover?el("span",{},"From last night"):el("span",{},r.time+" min")),
          el("div",{class:"portions"}, "Servings: "+ps.map((p,j)=>personName(p,j)+" "+fmtPortion(s.each[j])).join(" · ")),
          s.leftover?null:el("button",{class:"btn small",onclick:()=>openSwap(s.meal,i)},"Swap"))));
    }
    row.append(cards); grid.append(row);
  });
  m.append(grid);
  m.append(el("p",{class:"note",style:"margin-top:18px"},"Calories are for each person's portions of the planned meals. Snacks and drinks aren't included."));
}

/* ------------------------------------------------------------------ recipe sheet */
function openRecipe(id, slot){
  const r=R_BY_ID[id], c=recipeCost(r), p=$("#panel"); p.innerHTML="";
  const H=S.profile?household():r.serves, n=nutritionOf(r);
  const ingList=el("ul",{class:"ing"}, r.ing.map(([item,use,txt])=>{
    const s=cheapestIn(item,S.stores);
    if(!s){ const alt=storesCarrying(item).map(x=>STORES[x].name).join(" or ");
      return el("li",{class:"missing"}, el("span",{class:"dot",style:"--sc:var(--warn)"},"!"), el("div",{}, el("div",{class:"txt"},txt), el("div",{class:"prod"},"Not sold at your stores. "+alt+" carries it.")), el("span",{})); }
    const o=offers(item)[s];
    return el("li",{}, storeDot(s), el("div",{}, el("div",{class:"txt"},txt), el("div",{class:"prod"},o[0])), el("span",{class:"price muted"},money(o[1])));
  }));
  const mealKey = slot ? slot.meal : r.meal.toLowerCase();
  const scaleNote = S.profile ? el("div",{class:"pportions"}, el("div",{class:"eyebrow"},"Your portions"+(slot?" for "+slot.day+" "+slot.label.toLowerCase():"")),
    people().map((p,j)=>{ const x=portionFor(p,mealKey,r); return el("div",{class:"pp"}, el("b",{},personName(p,j)), el("span",{class:"mono"},fmtPortion(x)+" serving"+(x>1?"s":"")), el("span",{class:"note"},fmtInt(n.kcal*x)+" kcal · "+fmtInt(n.protein*x)+" g protein")); }),
    el("p",{class:"note",style:"margin:4px 0 0"},"Your grocery list buys enough for these portions"+(slot&&slot.meal==="dinner"&&leftoversOn()&&slot.i<planDays().length-1?", plus tomorrow's leftover lunch":"")+".")) : null;
  let alts=null;
  if(slot && !slot.leftover){
    const ids=alternativesFor(slot.meal,slot.i).slice(0,4);
    if(ids.length) alts=el("div",{}, el("div",{class:"althead"}, el("h3",{class:"sub"},"Not feeling it? Swap for one of these"), el("button",{class:"btn small",onclick:()=>openSwap(slot.meal,slot.i)},"See all "+versionsFor(slot.meal,false).length+" options")),
      el("div",{class:"alts"}, ids.map(a=>{ const ar=R_BY_ID[a]; return el("button",{class:"alt",onclick:()=>{ swapSlot(slot.meal,slot.i,a); openRecipe(a,Object.assign({},slot,{id:a})); }},
        el("img",{src:imgFor(ar),"data-rid":ar.id,alt:""}), el("span",{},ar.title), el("span",{class:"note"},fmtInt(nutritionOf(ar).kcal)+" kcal · "+ar.time+" min"), deltaBadge(kcalDelta(id,a,slot.meal))); })));
  }
  const cr = creditFor(r);
  const credit = cr ? el("a",{class:"credit",href:cr.page,target:"_blank",rel:"noopener"},"Photo: "+cr.author+" · "+cr.license) : null;
  p.append(
    el("div",{class:"hero"}, el("img",{src:imgFor(r),"data-rid":r.id,alt:r.title}), el("button",{class:"close","aria-label":"Close",onclick:closeSheet},"×"), credit),
    el("div",{class:"content"},
      el("div",{}, el("div",{class:"eyebrow"},(slot?slot.day+" "+slot.label:r.meal)+" · "+r.time+" minutes total"), el("h2",{id:"dTitle"},r.title)),
      el("p",{class:"lede",style:"margin:0"},r.blurb),
      el("div",{class:"statrow"},
        el("div",{class:"stat"},el("b",{},r.time+" min"),el("span",{},"Total time")),
        el("div",{class:"stat"},el("b",{},r.serves),el("span",{},"Servings")),
        el("div",{class:"stat"},el("b",{},fmtInt(n.kcal)),el("span",{},"kcal / serving")),
        el("div",{class:"stat"},el("b",{},n.protein+" g"),el("span",{},"Protein")),
        el("div",{class:"stat"},el("b",{},money(c.perServing)),el("span",{},"Per serving"))),
      storagePanel(r), versionPanel(r,slot),
      el("div",{class:"prepbadge"}, el("span",{class:"tag "+prepMode(r)},PREP_LABEL[prepMode(r)]), el("span",{class:"note"}," · on a prep week, about "+nightMinutes(r)+" min on the night")),
      el("div",{class:"actions"},
        el("button",{class:"btn",onclick:()=>pickPhoto(id)}, S.photos[id]?"Replace photo":"Use my own photo"),
        S.photos[id]?el("button",{class:"btn",onclick:()=>{ delete S.photos[id]; save(); openRecipe(id,slot); refresh(); }},"Remove my photo"):null),
      el("div",{class:"cols"},
        el("div",{style:"display:grid;gap:18px;align-content:start"},
          el("div",{}, el("h3",{class:"sub"},"Ingredients"), ingList, scaleNote, el("p",{class:"note"},"From your pantry: "+r.pantry+".")),
          el("div",{}, el("h3",{class:"sub"},"Nutrition"), nutritionPanel(r))),
        el("div",{}, el("h3",{class:"sub"},"Step-by-step"), r.swapNote?el("div",{class:"tip",style:"margin-bottom:12px"},el("b",{},"Swap note. "),r.swapNote):null, el("ol",{class:"steps"}, r.steps.map(s=>el("li",{},el("span",{},s)))),
          el("div",{class:"tip",style:"margin-top:16px"}, el("b",{},"Tip. "), r.tip))),
      alts));
  $("#sheet").hidden=false; document.body.style.overflow="hidden"; $("#sheet").scrollTop=0; p.scrollTop=0;
}

/* broken photo: fall back to the drawn illustration */
document.addEventListener("error", e=>{ const t=e.target; if(t && t.tagName==="IMG" && t.dataset.rid && !t.dataset.fb){ t.dataset.fb=1; t.src=artFor(R_BY_ID[t.dataset.rid]); } }, true);

/* ------------------------------------------------------------------ PDF (jsPDF, US Letter) */
async function cropTo(url, w, h){
  const img = await new Promise((res,rej)=>{ const i=new Image(); i.crossOrigin="anonymous"; i.onload=()=>res(i); i.onerror=rej; i.src=url; });
  const c=document.createElement("canvas"); c.width=w; c.height=h; const ctx=c.getContext("2d");
  const k=Math.max(w/img.width,h/img.height), dw=img.width*k, dh=img.height*k;
  ctx.drawImage(img,(w-dw)/2,(h-dh)/2,dw,dh);
  return c.toDataURL("image/jpeg",0.82);
}
async function pdfImage(r,w,h){ try{ return await cropTo(imgFor(r),w,h); }catch(e){ return await cropTo(artFor(r),w,h); } }
function pdfText(s){ return String(s).replace(/⅓/g,"1/3").replace(/⅔/g,"2/3").replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/…/g,"...").replace(/[^\x00-\xFF–—•€]/g,""); }

async function buildPdf(ids, opts={}){
  const planMode = !!opts.plan && S.plan, withList = !!opts.list && S.plan;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({unit:"pt",format:"letter",compress:true});
  const PW=612, PH=792, M=44, CW=PW-2*M;
  const ink=[27,42,33], muted=[96,110,100], green=[46,106,78], line=[221,228,216], soft=[243,246,240], yolk=[251,240,207];
  const date = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  let page=0;
  const newPage=()=>{ if(page) doc.addPage(); page++; doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...muted);
    doc.text("MealTote"+(S.profile?" · "+pdfText(answerText(QUESTIONS[0],S.profile)):"")+" · "+date, M, PH-24); doc.text(String(page), PW-M, PH-24, {align:"right"}); };
  const T=(s,x,y,o)=>doc.text(pdfText(s),x,y,o);
  const wrap=(s,w)=>doc.splitTextToSize(pdfText(s),w);
  const H = S.profile ? household() : 1;
  const t = S.plan ? planTotals() : null;
  const nf = n=>fmtInt(n);

  /* ---- cover */
  newPage();
  const coverIds = (planMode? planRecipeIds(): ids).slice(0,4);
  const cw=(CW-8)/2, ch=cw*0.66;
  for(let i=0;i<coverIds.length;i++) doc.addImage(await pdfImage(R_BY_ID[coverIds[i]],800,528),"JPEG",M+(i%2)*(cw+8),M+Math.floor(i/2)*(ch+8),cw,ch);
  let y=M+2*(ch+8)+44;
  doc.setTextColor(...green); doc.setFont("times","bold"); doc.setFontSize(40); T(planMode?"Your Meal Plan":"The MealTote Cookbook", M, y);
  y+=26; doc.setFont("times","italic"); doc.setFontSize(15); doc.setTextColor(...ink);
  T(planMode ? `${planDays().length} days for ${answerText(QUESTIONS[0],S.profile)}, shopped at ${listJoin(S.stores.map(s=>STORES[s].name))}` : `${ids.length} recipes with photos, nutrition and storage notes`, M, y);
  y+=16; doc.setFont("helvetica","normal"); doc.setFontSize(10); doc.setTextColor(...muted); T("Prepared "+date, M, y);
  if(planMode){
    y+=26; const avg=weekAvgNutrition(), meals=slotsOf().filter(s=>s.id).length;
    const boxes=[[String(meals),"meals planned"],[String(planRecipeIds().length),"recipes to cook"],[money(t.total),"groceries for the week"],[String(people().length),"people eating"]];
    const bw=(CW-18)/4;
    boxes.forEach(([v,l],i)=>{ const x=M+i*(bw+6); doc.setFillColor(...soft); doc.roundedRect(x,y,bw,56,6,6,"F");
      doc.setFont("helvetica","bold"); doc.setFontSize(18); doc.setTextColor(...green); T(v,x+10,y+26); doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(...muted); T(l,x+10,y+42); });
    y+=76; doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(...ink); T("Daily calorie targets",M,y);
    avg.forEach((a,k)=>{ y+=15; doc.setFont("helvetica","normal"); doc.setFontSize(10); doc.setTextColor(...ink); T(`${a.name}: ${nf(a.daily)} kcal a day · planned meals average ${nf(a.kcal)} kcal (target ${nf(a.target)})`,M,y); });
  }

  /* ---- week at a glance */
  if(planMode){
    newPage();
    doc.setTextColor(...green); doc.setFont("times","bold"); doc.setFontSize(26); T("Week at a glance", M, M+18);
    doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(...muted); T("Servings per person for each meal, and each person's calories for the day from planned meals.", M, M+36);
    const cols=MEALS.filter(([k])=>S.plan[k[0]].length), dayW=72, totW=104, mw=(CW-dayW-totW)/cols.length;
    y=M+60; doc.setFillColor(...green); doc.rect(M,y-12,CW,20,"F"); doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(8.5);
    T("DAY",M+6,y+1); cols.forEach(([k,l],j)=>T(l.toUpperCase(),M+dayW+j*mw+6,y+1)); T("DAY TOTAL",M+dayW+cols.length*mw+6,y+1); y+=16;
    const slots=slotsOf();
    planDays().forEach((day,i)=>{
      const cells=cols.map(([k])=>{ const s=slots.find(x=>x.i===i&&x.meal===k); return s; });
      doc.setFont("helvetica","bold"); doc.setFontSize(9);
      const heights=cells.map(s=>{ if(!s||!s.id) return 14; return wrap(R_BY_ID[s.id].title,mw-12).length*11+34; });
      const rh=Math.max(20+people().length*13,...heights)+6;
      if(i%2===0){ doc.setFillColor(...soft); doc.rect(M,y,CW,rh,"F"); }
      doc.setFont("times","bold"); doc.setFontSize(12); doc.setTextColor(...ink); T(day,M+6,y+16);
      cells.forEach((s,j)=>{ const x=M+dayW+j*mw+6; let yy=y+14;
        if(!s||!s.id){ doc.setFont("helvetica","italic"); doc.setFontSize(8.5); doc.setTextColor(...muted); T("-",x,yy); return; }
        const r=R_BY_ID[s.id], n=nutritionOf(r);
        doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(...ink); const ls=wrap(r.title,mw-12); doc.text(ls,x,yy); yy+=ls.length*11;
        doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...muted); T(`${nf(n.kcal)} kcal/serving${s.leftover?" · leftovers":""}`,x,yy+1);
        T(wrap(people().map((p,j)=>personName(p,j)+" "+fmtPortion(s.each[j])).join(" · "),mw-10)[0],x,yy+12); });
      const dn=dayNutrition(i); const x=M+dayW+cols.length*mw+6;
      dn.forEach((d,k)=>{ doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(...green); T(wrap(d.name,50)[0],x,y+14+k*13); doc.setFont("helvetica","normal"); doc.setTextColor(...ink); T(nf(d.kcal)+" kcal",x+52,y+14+k*13); });
      y+=rh;
    });
  }

  /* ---- meal prep guide */
  if(planMode){
    newPage();
    const sessions=prepSessions(), nights=nightGuide(), plans=sessions.map(sessionPlan);
    const before=nights.reduce((a,x)=>a+x.before,0), after=nights.reduce((a,x)=>a+x.min,0), prepTotal=plans.reduce((a,p)=>a+p.sessMin,0);
    doc.setTextColor(...green); doc.setFont("times","bold"); doc.setFontSize(26); T("Meal prep guide", M, M+18);
    doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(...muted);
    T(`About ${fmtHrs(prepTotal)} of batch prep cuts weeknight cooking from ${fmtHrs(before)} to ${fmtHrs(after)} (about ${Math.round(after/Math.max(1,nights.length))} min a day).`, M, M+36);
    y=M+58;
    const need=h=>{ if(y+h>PH-50){ newPage(); y=M+14; } };
    const para=(text,indent=0,size=9.4,style="normal",color=ink)=>{ doc.setFont("helvetica",style); doc.setFontSize(size); doc.setTextColor(...color); const ls=wrap(text,CW-indent); for(const l of ls){ need(12); doc.text(l,M+indent,y); y+=size*1.28; } };
    sessions.forEach((sess,si)=>{ const P=plans[si];
      need(50); doc.setFillColor(...green); doc.roundedRect(M,y-13,CW,22,4,4,"F"); doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(11.5);
      T(sess.name+"  ·  covers "+sess.covers.join(", "),M+10,y+2); T("about "+fmtHrs(P.sessMin),PW-M-10,y+2,{align:"right"}); y+=26;
      let k=1; const head=t=>{ need(30); doc.setFillColor(...green); doc.circle(M+8,y-3.5,8,"F"); doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(8.5); T(String(k++),M+8,y-0.5,{align:"center"}); para(t,22,10.5,"bold"); y+=2; };
      if(P.ahead.length){ head("Start the cook-ahead dishes first (they take longest)");
        P.ahead.forEach(({r,first})=>{ const st=storageOf(r), wait=first.i-sess.sessionDay; para(`• ${r.title}: follow the full recipe (${r.time} min, mostly hands-off). Cool and portion into containers. ${wait>st.fridge?`Eaten ${first.day}: freeze today, thaw in the fridge the night before.`:`Keeps ${st.fridge} days; first eaten ${first.day}.`}`,22); }); y+=4; }
      if(P.rice){ head(`Batch-cook ${qtyText(P.rice)} cups dry rice`); para(`Makes about ${Math.round(P.rice*3)} cups cooked for ${[...new Set(P.riceFor)].join(", ")}. Cool on a sheet pan, refrigerate up to 4 days.`,22); y+=4; }
      if(P.shred.length){ head("Shred the chicken"); P.shred.forEach(t=>para("• "+t,22)); y+=4; }
      if(P.marinate.length){ head("Get the marinades going"); P.marinate.forEach(x=>para(`• ${x.title}: ${x.text} Store in a sealed bag up to 24 hours.`,22)); y+=4; }
      const ck=Object.keys(P.chop); if(ck.length){ head("Chop everything at once"); ck.forEach(v=>{ para(v,22,9.6,"bold"); P.chop[v].forEach(t=>para("• "+t,32,8.8)); }); para("Store each recipe's veg in its own labeled container. Onions, peppers and carrots keep 4 days; cut potatoes in water 2 days.",22,8.6,"italic",muted); y+=4; }
      if(P.sauces.length){ head("Mix the sauces and dressings"); P.sauces.forEach(x=>para(`• ${x.title}: ${x.text} Store in a jar.`,22)); y+=4; }
      y+=8;
    });
    need(60); doc.setFont("helvetica","bold"); doc.setFontSize(12); doc.setTextColor(...ink); T("Night by night",M,y); y+=16;
    nights.forEach(n=>{ need(20+n.items.length*12); doc.setDrawColor(...line); doc.line(M,y-10,PW-M,y-10);
      doc.setFont("times","bold"); doc.setFontSize(11.5); doc.setTextColor(...ink); T(n.day,M,y); doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(...muted); T(`${n.min} min${n.before>n.min?" (was "+n.before+")":""}`,PW-M,y,{align:"right"}); y+=13;
      n.items.forEach(x=>para(`${x.meal}: ${x.text} (~${x.min} min)`,12,9)); y+=6; });
  }

  /* ---- cost & nutrition summary */
  if(planMode){
    newPage();
    doc.setTextColor(...green); doc.setFont("times","bold"); doc.setFontSize(26); T("Cost & nutrition for the week", M, M+18);
    y=M+50; doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(...ink); T("Grocery cost",M,y); y+=8;
    const byStore={}; for(const [i,s] of Object.entries(t.result)) byStore[s]=(byStore[s]||0)+storeCost(i,s,t.d[i]);
    const counts={}; for(const s of Object.values(t.result)) counts[s]=(counts[s]||0)+1;
    for(const s of S.stores){ if(!byStore[s]) continue; y+=18; doc.setFillColor(...STORES[s].pdf); doc.circle(M+5,y-3.5,4,"F");
      doc.setFont("helvetica","normal"); doc.setFontSize(10); doc.setTextColor(...ink); T(STORES[s].name,M+16,y); doc.setTextColor(...muted); T(counts[s]+" items",M+200,y); doc.setTextColor(...ink); T(money(byStore[s]),M+CW,y,{align:"right"});
      doc.setDrawColor(...line); doc.line(M,y+6,M+CW,y+6); }
    const meals=slotsOf().filter(s=>s.id).length, portions=meals*H;
    y+=24; doc.setFont("helvetica","bold"); doc.setFontSize(12); T("Estimated total",M,y); doc.setTextColor(...green); T(money(t.total),M+CW,y,{align:"right"});
    y+=16; doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(...muted);
    T(`${money(t.total/planDays().length)} per day · ${money(t.total/Math.max(1,portions))} per portion · budget ${S.profile.budget>=1000?"flexible":S.profile.budget===75?"under $75":"$"+S.profile.budget}${t.missing.length?" · "+t.missing.length+" item(s) not sold at your stores":""}`,M,y);
    y+=14; T("Prices are estimates for typical US stores. Check shelf prices in-store.",M,y);

    y+=34; doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(...ink); T("Average daily nutrition from planned meals, per person",M,y); y+=8;
    const avg=weekAvgNutrition(), pc=Math.min(150,(CW-130)/avg.length);
    y+=16; doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(...muted); avg.forEach((a,k)=>T(wrap(a.name,pc-8)[0].toUpperCase(),M+130+k*pc,y));
    [["Daily target","daily"," kcal"],["Planned meals target","target"," kcal"],["Calories","kcal"," kcal"],["Protein","protein"," g"],["Carbohydrates","carbs"," g"],["Fat","fat"," g"],["Fiber","fiber"," g"],["Sugars","sugar"," g"],["Sodium","sodium"," mg"]].forEach(([l,k,u],ri)=>{
      y+=16; doc.setFont("helvetica",ri<2?"italic":"normal"); doc.setFontSize(9.8); doc.setTextColor(...ink); T(l,M,y);
      avg.forEach((a,c)=>T(nf(a[k])+u+(a.mt&&a.mt[k]!==undefined?" / "+nf(a.mt[k])+u:""),M+130+c*pc,y)); doc.setDrawColor(...line); doc.line(M,y+5,M+CW,y+5); });
    if(avg.some(a=>a.mt)){ y+=14; doc.setFont("helvetica","italic"); doc.setFontSize(8.5); doc.setTextColor(...muted); T("Protein, carbs and fat show planned meals / your macro target for those meals.",M,y); }

    y+=34; doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(...ink); T("Cook & store plan",M,y); y+=6;
    const cookDay={}; slotsOf().forEach(s=>{ if(s.id&&!s.leftover&&!cookDay[s.id]) cookDay[s.id]=s.day; });
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...muted); y+=14;
    T("RECIPE",M,y); T("FIRST COOK",M+250,y); T("MAKES",M+330,y); T("FRIDGE",M+400,y); T("FREEZER",M+460,y);
    for(const id of planRecipeIds()){ const r=R_BY_ID[id], s=storageOf(r); y+=16; if(y>PH-60){ newPage(); y=M+20; }
      doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(...ink);
      T(wrap(r.title,240)[0],M,y); T(cookDay[id]||"",M+250,y); T(r.serves+" servings",M+330,y); T(s.fridge?s.fridge+" days":"fresh",M+400,y); T(s.freezer?s.freezer+" mo":"no",M+460,y);
      doc.setDrawColor(...line); doc.line(M,y+5,M+CW,y+5); }
  }

  /* ---- recipe pages */
  for(const id of ids){
    const r=R_BY_ID[id], c=recipeCost(r), n=nutritionOf(r), st=storageOf(r);
    newPage();
    const ih=CW*0.38;
    doc.addImage(await pdfImage(r,1100,Math.round(1100*0.38)),"JPEG",M,M,CW,ih);
    const pc=creditFor(r);
    if(pc){ doc.setFont("helvetica","normal"); doc.setFontSize(6.5); doc.setTextColor(...muted); doc.text(pdfText("Photo: "+pc.author+" · "+pc.license+" · Wikimedia Commons"), PW-M, M+ih+9, {align:"right"}); }
    y=M+ih+24;
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...green);
    T(`${r.meal}  ·  ${r.time} min total  ·  ${r.serves} servings  ·  about ${money(c.perServing)} a serving`.toUpperCase(), M, y);
    y+=24; doc.setFont("times","bold"); doc.setFontSize(22); doc.setTextColor(...ink);
    const tl=wrap(r.title,CW); doc.text(tl,M,y); y+=tl.length*24-6;
    doc.setFont("times","italic"); doc.setFontSize(11); doc.setTextColor(...muted);
    const bl=wrap(r.blurb,CW); doc.text(bl,M,y+8); y+=bl.length*13+18;
    // nutrition strip
    const cells=[["Calories",nf(n.kcal)],["Protein",n.protein+" g"],["Carbs",n.carbs+" g"],["Fat",n.fat+" g"],["Fiber",n.fiber+" g"],["Sugar",n.sugar+" g"],["Sodium",nf(n.sodium)+" mg"]];
    const cwid=CW/cells.length; doc.setFillColor(...soft); doc.roundedRect(M,y,CW,38,5,5,"F");
    cells.forEach(([l,v],i)=>{ const x=M+i*cwid+8; doc.setFont("helvetica","bold"); doc.setFontSize(12); doc.setTextColor(...(i?ink:green)); T(v,x,y+17); doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(...muted); T(l.toUpperCase(),x,y+29); });
    y+=50;
    doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(...ink);
    const ml=wrap(`${mealsText(r)}.  ${storageLine(r)}${S.profile?"  Servings each: "+portionsLine(r,r.meal.toLowerCase())+".":""}`,CW); doc.text(ml,M,y); y+=ml.length*11+10;
    // columns: method on the right, ingredients on the left; each column flows onto following pages independently
    const colL=M, wL=186, colR=M+wL+24, wR=PW-M-colR, startPage=page;
    const goPage=n=>{ if(n<=doc.getNumberOfPages()) doc.setPage(n); else { doc.setPage(doc.getNumberOfPages()); newPage(); } return n; };
    let pr=startPage, yr=y;
    doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(...green); T("STEP-BY-STEP",colR,yr); yr+=15;
    r.steps.forEach((stp,i)=>{
      doc.setFont("helvetica","normal"); doc.setFontSize(9.8);
      const lines=wrap(stp,wR-24);
      if(yr+lines.length*13>PH-56){ pr=goPage(pr+1); yr=M+10; }
      doc.setFillColor(...green); doc.circle(colR+8,yr-3.5,8,"F"); doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(8.5); T(String(i+1),colR+8,yr-0.5,{align:"center"});
      doc.setFont("helvetica","normal"); doc.setFontSize(9.8); doc.setTextColor(...ink); doc.text(lines,colR+24,yr); yr+=lines.length*13+8;
    });
    for(const [h,body,fill] of [...(r.swapNote?[["Swap note",r.swapNote,soft]]:[]),["Storing & reheating",st.how,soft],["Tip",r.tip,yolk]]){
      doc.setFontSize(9.2); const bl2=wrap(body,wR-20), bh=bl2.length*11.5+26;
      if(yr+bh>PH-56){ pr=goPage(pr+1); yr=M+10; }
      doc.setFillColor(...fill); doc.roundedRect(colR,yr,wR,bh,5,5,"F");
      doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(...green); T(h.toUpperCase(),colR+10,yr+14);
      doc.setFont("helvetica","normal"); doc.setFontSize(9.2); doc.setTextColor(...ink); doc.text(bl2,colR+10,yr+27); yr+=bh+8;
    }
    let pl2=goPage(startPage), yl=y;
    doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(...green); T("INGREDIENTS",colL,yl); yl+=15;
    for(const [item,use,txt] of r.ing){
      const s=cheapestIn(item,S.stores);
      doc.setFont("helvetica","normal"); doc.setFontSize(9.2);
      const lines=wrap(txt,wL-14), pl=s?wrap(STORES[s].name+": "+offers(item)[s][0],wL-14):[];
      if(yl+lines.length*11+pl.length*9>PH-56){ pl2=goPage(pl2+1); yl=M+10; }
      doc.setTextColor(...ink);
      if(s){ doc.setFillColor(...STORES[s].pdf); doc.circle(colL+4,yl-3,3.5,"F"); } else { doc.setDrawColor(180,83,42); doc.circle(colL+4,yl-3,3.2,"S"); }
      doc.text(lines,colL+13,yl); yl+=lines.length*11;
      if(pl.length){ doc.setFontSize(7.3); doc.setTextColor(...muted); doc.text(pl,colL+13,yl); yl+=pl.length*9; }
      yl+=5;
    }
    doc.setFont("helvetica","italic"); doc.setFontSize(8.3); doc.setTextColor(...muted);
    const pan=wrap("From your pantry: "+r.pantry,wL); if(yl+pan.length*10>PH-34){ pl2=goPage(pl2+1); yl=M+10; } doc.text(pan,colL,yl+3);
    doc.setPage(doc.getNumberOfPages()); page=doc.getNumberOfPages();
  }

  /* ---- shopping list */
  if(withList){
    newPage();
    doc.setTextColor(...green); doc.setFont("times","bold"); doc.setFontSize(26); T("Shopping list", M, M+18);
    doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(...muted);
    T(`${S.mode==="cheap"?"Lowest total":"Fewest stops"} · ${Object.keys(t.d).length} items · estimated ${money(t.total)} for the week`, M, M+36);
    y=M+62;
    const ensure=need=>{ if(y+need>PH-50){ newPage(); y=M+14; } };
    for(const s of S.stores){
      const its=Object.keys(t.result).filter(i=>t.result[i]===s); if(!its.length) continue;
      let sub=0; its.forEach(i=>sub+=storeCost(i,s,t.d[i]));
      ensure(56); doc.setFillColor(...STORES[s].pdf); doc.roundedRect(M,y-13,CW,22,4,4,"F");
      doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(11.5); T(STORES[s].name,M+10,y+2); T(money(sub),PW-M-10,y+2,{align:"right"}); y+=26;
      for(const a of AISLES){ const ai=its.filter(i=>ITEMS[i][1]===a); if(!ai.length) continue;
        ensure(30); doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(...muted); T(a.toUpperCase(),M,y); y+=12;
        for(const i of ai){ ensure(16); const o=offers(i)[s], k=packsFor(i,s,t.d[i]);
          doc.setDrawColor(...ink); doc.setLineWidth(0.7); doc.rect(M,y-8,9,9);
          doc.setFont("helvetica","bold"); doc.setFontSize(9.8); doc.setTextColor(...ink); T(ITEMS[i][0],M+16,y);
          doc.setFont("helvetica","normal"); doc.setFontSize(8.3); doc.setTextColor(...muted); T(wrap((k>1?k+" x ":"")+o[0],270)[0],M+180,y);
          doc.setTextColor(...ink); doc.setFontSize(9.5); T(money(k*o[1]),PW-M,y,{align:"right"});
          doc.setDrawColor(...line); doc.setLineWidth(0.5); doc.line(M+16,y+5,PW-M,y+5); y+=17; }
        y+=4; }
      y+=8;
    }
    if(t.missing.length){ ensure(40); doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(180,83,42); T("Not sold at your stores", M, y); y+=16;
      for(const i of t.missing){ ensure(14); doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(...ink); T(ITEMS[i][0]+" (try "+storesCarrying(i).map(s=>STORES[s].name).join(", ")+")", M+16, y); y+=14; } }
    ensure(60); y+=6; doc.setDrawColor(...green); doc.setLineWidth(1.2); doc.line(M,y,PW-M,y); y+=20;
    doc.setFont("helvetica","bold"); doc.setFontSize(13); doc.setTextColor(...ink); T("Estimated total for the week",M,y); doc.setTextColor(...green); T(money(t.total),PW-M,y,{align:"right"});
    y+=16; doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(...muted);
    const pantry=[...new Set(planRecipeIds().flatMap(id=>R_BY_ID[id].pantry.split(/,\s*/)).map(x=>x.replace(/^\d+[^a-z]*\s*(tbsp|tsp|cup)?\s*/i,"").replace(/\(.*?\)/g,"").trim()).filter(Boolean))];
    const pl=wrap("Check your pantry for: "+pantry.join(", ")+".",CW); ensure(pl.length*11+10); doc.text(pl,M,y);
  }
  return doc;
}
window.buildPdf = buildPdf;

// MealTote is free; a gentle, dismissible-by-ignoring nudge on the pages people finish on
function supportCard(){
  return el("div",{class:"supportcard"}, el("p",{}, el("b",{},"MealTote is free, with no ads and no paywall. "), "If it saved you time or money this week, a few dollars keeps it running."),
    el("a",{class:"btn primary",href:"support.html"},"♥ Support MealTote"));
}
function renderPdfTab(){ renderPdfPanel(); $("#app").append(supportCard()); }
function renderPdfPanel(){
  const m=$("#app"); m.innerHTML=""; const ids=planRecipeIds(), t=planTotals(), avg=weekAvgNutrition();
  m.append(el("div",{class:"pdfpanel"},
    el("div",{class:"opts2"},
      el("h2",{style:"font-size:28px"},"Export & share your week"),
      el("p",{class:"muted",style:"margin:0"},"One PDF you can text, email or print: your week at a glance with calories, the cost for the week by store, every recipe with its photo, nutrition, step-by-step method and storage notes, and your shopping list."),
      el("label",{}, el("input",{type:"radio",name:"pdfScope",id:"scopePlan",value:"plan",checked:true}), el("span",{}, el("b",{},"My meal plan"), el("br"), el("span",{class:"note"},`${ids.length} recipes · ${money(t.total)} groceries · ${avg.map(a=>a.name+" "+fmtInt(a.kcal)+" kcal/day").join(", ")}`))),
      el("label",{}, el("input",{type:"radio",name:"pdfScope",id:"scopeAll",value:"all"}), el("span",{}, el("b",{},"Every recipe in the app"), el("br"), el("span",{class:"note"},RECIPES.length+" recipes, one per page"))),
      el("label",{}, el("input",{type:"checkbox",id:"incList",checked:true}), el("span",{}, el("b",{},"Include the shopping list & weekly cost"), el("br"), el("span",{class:"note"},"Split by store, with checkboxes and prices."))),
      el("div",{class:"actions"}, el("button",{class:"btn primary",id:"makePdf",onclick:makePdf},"Download PDF")),
      el("div",{class:"status",id:"pdfStatus",role:"status"}),
      el("p",{class:"note",style:"margin:0"},"After it downloads, share it from your phone's Files app or attach it to a text or email.")),
    el("div",{}, el("div",{class:"eyebrow",style:"margin-bottom:10px"},"What's inside"),
      el("ol",{class:"inside"}, ["Cover with your week's numbers","Week at a glance: every meal with calories and protein, plus day totals","Meal prep guide: batch sessions, what to chop, cook and marinate ahead, and a night-by-night plan","Cost & nutrition: spend by store, daily averages, cook-and-store plan","A page per recipe: photo, macros, step-by-step method, fridge and freezer life","Shopping list by store and aisle, with prices and the weekly total"].map(x=>el("li",{},x))),
      el("div",{class:"preview"}, ids.slice(0,3).map(id=>{ const r=R_BY_ID[id]; return el("div",{class:"pg"}, el("img",{src:imgFor(r),"data-rid":r.id,alt:""}), el("div",{class:"t"},r.title), el("div",{class:"l"}), el("div",{class:"l",style:"width:80%"}), el("div",{class:"l",style:"width:90%"})); })))));
}
async function makePdf(){
  const st=$("#pdfStatus"), btn=$("#makePdf");
  if(!window.jspdf){ st.textContent="The PDF library didn't load. Check your connection and reload the page."; return; }
  const scope=document.querySelector('input[name="pdfScope"]:checked').value;
  const ids = scope==="plan" ? planRecipeIds() : RECIPES.map(r=>r.id);
  btn.disabled=true; st.textContent="Building your PDF ("+ids.length+" recipes)…";
  try{
    const doc = await buildPdf(ids, {plan: scope==="plan", list: $("#incList").checked});
    const blob = doc.output("blob"), name = scope==="plan" ? "mealtote-meal-plan.pdf" : "mealtote-all-recipes.pdf";
    const u=URL.createObjectURL(blob), a=el("a",{href:u,download:name}); document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),60000); st.textContent="PDF ready: "+name+".";
  }catch(err){ st.textContent="Couldn't build the PDF: "+(err&&err.message||err); }
  btn.disabled=false;
}

/* ------------------------------------------------------------------ accounts: Google sign-in, profile, saved plans */
const cloudOn = () => !!(window.cloud && window.cloud.enabled);
let cloudUser = null, cloudLoaded = false;
const G_ICON = '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg>';

function renderAccount(){
  const box=$("#account"); if(!box) return; box.innerHTML="";
  if(!cloudOn()) return;
  if(!cloudUser){
    const b=el("button",{class:"btn small gbtn",id:"signInBtn",onclick:signIn}); b.innerHTML=G_ICON+"<span>Sign in with Google</span>"; box.append(b); return;
  }
  const name=(cloudUser.displayName||cloudUser.email||"You").split(" ")[0];
  box.append(el("button",{class:"btn small acct",onclick:()=>openProfile(),"aria-label":"Your profile"},
    cloudUser.photoURL?el("img",{src:cloudUser.photoURL,alt:"",referrerpolicy:"no-referrer"}):el("span",{class:"initial"},name[0]||"?"), name));
}
async function signIn(){
  try{ await cloud.signIn(); }catch(e){ toast("Sign-in didn't finish: "+(e.code||e.message||e)); }
}
async function onCloudUser(u){
  cloudUser=u; cloudLoaded=false; renderAccount();
  if(!u){ if(tab==="profile") boot(); return; }
  try{
    await cloud.ensureProfile();
    const d=await cloud.load();
    if(d && d.state){
      const remote=normalize(JSON.parse(d.state));
      // newest wins: your account copy, unless this browser has newer unsaved work
      if(!S.profile || (d.updatedMs||0) >= (S._ts||0)){ S=remote; if(S.theme) THEME.set(S.theme, true); } else pushCloud();
    } else if(S.profile) pushCloud();
    try{ Object.assign(S.photos, await cloud.loadPhotos()); }catch(e){}
    await syncPlans();
    cloudLoaded=true; lsSet(S); if(!OB) boot();
    toast("Signed in as "+(u.displayName||u.email));
  }catch(e){ cloudLoaded=true; toast("Couldn't load your saved data. Changes will save in this browser."); }
}
// photos travel separately (cloud.savePhoto), so the account copy leaves out their data URLs
const cloudJSON = v => JSON.stringify(v,(k,x)=>typeof x==="string"&&x.startsWith("data:")?undefined:x);
async function pushCloud(){
  if(!cloudUser || !cloudOn()) return;
  try{
    await cloud.save(cloudJSON(S), S._ts||Date.now());
    for(const id of [...DIRTY_PLANS]){ const p=PLANS[id]; DIRTY_PLANS.delete(id); if(p) await cloud.putPlan(id,{name:p.name, createdMs:p.createdMs, updatedMs:p.updatedMs, state:p.state}); }
    for(const id of [...DELETED_PLANS]){ await cloud.deletePlan(id); DELETED_PLANS.delete(id); lsPlansSet(); }
  }catch(e){
    console.error("MealTote cloud save failed", e);
    toast(e && e.code==="permission-denied" ? "Couldn't save to your account: the database rules aren't deployed yet (permission denied)." : "Couldn't save to your account ("+(e&&(e.code||e.message)||"error")+"). Your plan is still saved on this device.");
  }
}
// on sign-in: newest copy of each plan wins, and plans made on this device before signing in get uploaded
async function syncPlans(){
  try{
    const remote=await cloud.listPlans();
    for(const r of remote){ if(DELETED_PLANS.has(r.id)) continue; const l=PLANS[r.id], ru=r.updatedMs||r.createdMs||0;
      if(!l || ru>l.updatedMs) PLANS[r.id]={id:r.id, name:r.name||"My plan", createdMs:r.createdMs||ru, updatedMs:ru, state:r.state};
      else if(l.updatedMs>ru) DIRTY_PLANS.add(r.id); }
    const ids=new Set(remote.map(r=>r.id)); for(const id of Object.keys(PLANS)) if(!ids.has(id)) DIRTY_PLANS.add(id);
    lsPlansSet(); if(DIRTY_PLANS.size||DELETED_PLANS.size) pushCloud();
  }catch(e){ console.error("MealTote plan sync failed", e); }
}
function connectStore(){
  const go=()=>{ renderAccount(); if(cloudOn()) cloud.onUser(onCloudUser); };
  if(window.cloud) go(); else window.addEventListener("cloud-ready",go,{once:true});
}

async function openProfile(){
  tab="profile";
  for(const b of document.querySelectorAll("#tabs button")) b.setAttribute("aria-selected","false");
  const m=$("#app"); m.innerHTML="";
  if(!cloudUser){ boot(); return; }
  const u=cloudUser, ps=S.profile?people():[];
  const nameIn=el("input",{type:"text",id:"profName",value:u.displayName||"",maxlength:40});
  const plansBox=el("div",{class:"plist"});
  m.append(el("div",{class:"profile"},
    el("div",{class:"phead"},
      u.photoURL?el("img",{src:u.photoURL,alt:"",referrerpolicy:"no-referrer",class:"avatar"}):el("div",{class:"avatar initial"},(u.displayName||"?")[0]),
      el("div",{}, el("div",{class:"eyebrow"},"Your profile"), el("h2",{},u.displayName||"Your account"), el("p",{class:"note",style:"margin:0"},u.email||""))),
    el("section",{class:"pcard"}, el("h3",{class:"sub"},"Display name"),
      el("div",{class:"prow"}, nameIn, el("button",{class:"btn small",onclick:async()=>{ await cloud.saveProfile({displayName:nameIn.value.trim()}); toast("Saved"); }},"Save"))),
    el("section",{class:"pcard"}, el("h3",{class:"sub"},"Who you're cooking for"),
      ps.length ? el("ul",{class:"plain"}, ps.map((p,j)=>el("li",{}, el("b",{},personName(p,j)), " · "+fmtInt(p.kcal)+" kcal a day"+(p.macros?` · ${p.macros.p} g protein, ${p.macros.c} g carbs, ${p.macros.f} g fat`:"")))) : el("p",{class:"note"},"No plan yet. Answer the questions to set up your household."),
      el("div",{class:"actions"}, el("button",{class:"btn small",onclick:()=>{ $("#tabs").hidden=true; startQuiz(!!S.profile); }}, S.profile?"Edit my answers":"Start the questions"),
        S.plan?el("button",{class:"btn small",onclick:()=>showApp("plan")},"Back to my plan"):null)),
    el("section",{class:"pcard"}, el("h3",{class:"sub"},"My plans"),
      el("p",{class:"note",style:"margin-top:0"},"Every plan you make is saved automatically with its own answers, groceries, swaps and checkmarks."),
      plansBox,
      el("div",{class:"actions"}, el("button",{class:"btn small primary",onclick:openPlansSheet},"Open, rename or delete plans"), el("button",{class:"btn small",onclick:startNewPlan},"+ New plan"))),
    el("section",{class:"pcard"}, el("h3",{class:"sub"},"Account"),
      el("div",{class:"actions"},
        el("button",{class:"btn small",onclick:async()=>{ await cloud.signOut(); toast("Signed out. Your plan stays in this browser."); boot(); }},"Sign out"),
        el("button",{class:"btn small danger",id:"delData",onclick:delData},"Delete my account data"),
        u.email==="starsidecollective@gmail.com" ? el("a",{class:"btn small",href:"admin.html"},"Open the Backend") : null),
      el("p",{class:"note"},"Deleting removes your profile, saved plans and uploaded photos from MealTote. Your Google account isn't affected.")),
    supportCard()));
  function loadPlans(){ plansBox.innerHTML="";
    const list=Object.values(PLANS).sort((a,b)=>b.updatedMs-a.updatedMs);
    if(!list.length){ plansBox.append(el("p",{class:"note"},"No plans yet.")); return; }
    for(const p of list.slice(0,6)) plansBox.append(el("div",{class:"pitem"+(p.id===S.planId?" current":"")},
      el("div",{class:"pmain"}, el("b",{},p.name), el("div",{class:"note"},planSummary(p))),
      p.id===S.planId?el("span",{class:"pill"},"Open now"):el("button",{class:"btn small",onclick:()=>openPlan(p.id)},"Open")));
  }
  let delArmed=0;
  async function delData(e){
    if(Date.now()-delArmed>5000){ delArmed=Date.now(); e.target.textContent="Tap again to permanently delete"; return; }
    e.target.disabled=true; e.target.textContent="Deleting…";
    try{ await cloud.deleteAll(); await cloud.signOut(); S=structuredClone(DEFAULT_STATE); lsSet(S); toast("Your data was deleted"); boot(); }
    catch(err){ e.target.disabled=false; e.target.textContent="Delete my account data"; toast("Couldn't delete everything. Try again."); }
  }
  loadPlans(); window.scrollTo({top:0});
}

/* ------------------------------------------------------------------ boot */
/* ------------------------------------------------------------------ my plans: every plan is kept, each with its own answers, groceries and checkmarks */
// PLANS[id] = {id, name, createdMs, updatedMs, state}; state is the plan's own part of S as JSON (photos and theme stay shared)
const PLAN_KEYS = ["profile","plan","stores","mode","overrides","checked"];
let PLANS = {}, DIRTY_PLANS = new Set(), DELETED_PLANS = new Set();
function lsPlansGet(){ try{ DELETED_PLANS=new Set(JSON.parse(localStorage.getItem("mealtote-plans-deleted")||"[]")); return JSON.parse(localStorage.getItem("mealtote-plans")||"{}")||{}; }catch(e){ return {}; } }
function lsPlansSet(){ try{ localStorage.setItem("mealtote-plans", JSON.stringify(PLANS)); localStorage.setItem("mealtote-plans-deleted", JSON.stringify([...DELETED_PLANS])); }catch(e){} }
const newPlanId = () => "p"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function defaultPlanName(){
  const base="Week of "+new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});
  let name=base, n=2; while(Object.values(PLANS).some(p=>p.name===name)) name=`${base} (${n++})`;
  return name;
}
function planState(){ const o={}; for(const k of PLAN_KEYS) o[k]=S[k]; return JSON.stringify(o); }
function storePlan(){
  if(!S.plan || !S.profile) return;
  if(!S.planId){ S.planId=newPlanId(); S.planName=defaultPlanName(); S.planCreated=Date.now(); }
  const prev=PLANS[S.planId];
  PLANS[S.planId]={id:S.planId, name:S.planName||"My plan", createdMs:S.planCreated||(prev&&prev.createdMs)||Date.now(), updatedMs:Date.now(), state:planState()};
  DIRTY_PLANS.add(S.planId); lsPlansSet();
}
function openPlan(id){
  const p=PLANS[id]; if(!p) return;
  let st={}; try{ st=JSON.parse(p.state)||{}; }catch(e){}
  const keep={photos:S.photos, theme:S.theme};
  S=normalize(Object.assign({}, st, keep, {planId:p.id, planName:p.name, planCreated:p.createdMs}));
  lsSet(S); clearTimeout(saveTimer); saveTimer=setTimeout(pushCloud, 800);
  closeSheet(); tab="plan"; boot(); toast("Opened “"+p.name+"”");
}
function renamePlan(id, name){
  name=String(name||"").trim().slice(0,80); const p=PLANS[id]; if(!p||!name) return;
  p.name=name; p.updatedMs=Date.now(); if(S.planId===id){ S.planName=name; lsSet(S); }
  DIRTY_PLANS.add(id); lsPlansSet(); clearTimeout(saveTimer); saveTimer=setTimeout(pushCloud, 800);
}
function removePlan(id){
  delete PLANS[id]; DIRTY_PLANS.delete(id); DELETED_PLANS.add(id); lsPlansSet();
  if(S.planId===id){
    const next=Object.values(PLANS).sort((a,b)=>b.updatedMs-a.updatedMs)[0];
    if(next) return openPlan(next.id);
    const keep={photos:S.photos, theme:S.theme}; S=Object.assign(structuredClone(DEFAULT_STATE), keep); lsSet(S); tab="plan"; boot();
  }
  clearTimeout(saveTimer); saveTimer=setTimeout(pushCloud, 800);
}
// a brand-new plan: the questions start from the current answers so nothing needs retyping, but groceries, swaps and checkmarks start empty
function startNewPlan(){
  closeSheet(); $("#tabs").hidden=true; $("#editBtn").hidden=true; $("#resetBtn").hidden=true;
  startQuiz(!!S.profile); OB.edit=false; OB.newPlan=true;
}
function planSummary(p){
  let st={}; try{ st=JSON.parse(p.state)||{}; }catch(e){}
  const A=st.profile||{}, days=(st.plan&&st.plan.b?st.plan.b.length:0)||A.days||0, ppl=(A.people||[]).length;
  return [days?days+" days":null, ppl?ppl+(ppl>1?" people":" person"):null, (st.stores||[]).map(x=>STORES[x]&&STORES[x].name).filter(Boolean).join(" + ")||null].filter(Boolean).join(" · ");
}
function openPlansSheet(){
  const p=$("#panel");
  const draw=()=>keepSheetScroll(()=>{ p.innerHTML="";
    const list=Object.values(PLANS).sort((a,b)=>b.updatedMs-a.updatedMs);
    p.append(el("div",{class:"content plans"},
      el("div",{class:"swaphead"}, el("div",{}, el("div",{class:"eyebrow"},list.length+" saved"), el("h2",{id:"dTitle"},"My plans")), el("button",{class:"close static","aria-label":"Close",onclick:closeSheet},"×")),
      el("p",{class:"note",style:"margin:0"},"Every plan you make is saved here with its own answers, groceries, swaps and checkmarks"+(cloudUser?", on every device you sign in to.":". Sign in to keep them on every device.")),
      el("div",{}, el("button",{class:"btn primary",onclick:startNewPlan},"+ New plan")),
      list.length ? el("div",{class:"plist"}, list.map(x=>{ const cur=x.id===S.planId; let armed=0;
        const nameIn=el("input",{type:"text",value:x.name,maxlength:80,"aria-label":"Plan name",class:"pname"});
        return el("div",{class:"pitem"+(cur?" current":"")},
          el("div",{class:"pmain"},
            el("div",{class:"prow"}, nameIn, cur?el("span",{class:"pill"},"Open now"):null),
            el("div",{class:"note"}, [planSummary(x), "updated "+new Date(x.updatedMs).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})].filter(Boolean).join(" · "))),
          el("div",{class:"actions"},
            cur?null:el("button",{class:"btn small primary",onclick:()=>openPlan(x.id)},"Open"),
            el("button",{class:"btn small",onclick:()=>{ renamePlan(x.id,nameIn.value); toast("Renamed"); draw(); if(cur) refresh(); }},"Rename"),
            cur?el("button",{class:"btn small",onclick:()=>{ closeSheet(); $("#tabs").hidden=true; $("#editBtn").hidden=true; $("#resetBtn").hidden=true; startQuiz(true); }},"Edit answers"):null,
            el("button",{class:"btn small danger",onclick:e=>{ if(Date.now()-armed>4000){ armed=Date.now(); e.target.textContent="Tap again to delete"; return; } removePlan(x.id); toast("Deleted “"+x.name+"”"); if(!$("#sheet").hidden) draw(); }},"Delete")));
      })) : el("p",{class:"note"},"No plans yet. Answer the questions to make your first one.")));
  });
  draw(); $("#sheet").hidden=false; document.body.style.overflow="hidden"; $("#sheet").scrollTop=0;
}

function boot(){
  if(OB) return;
  if(S.profile && S.plan){ showApp(tab); }
  else { $("#tabs").hidden=true; $("#editBtn").hidden=true; $("#resetBtn").hidden=true; renderWelcome(); }
}
S = normalize(lsGet());
PLANS = lsPlansGet();
if(S.plan && S.profile && !PLANS[S.planId]) storePlan();
boot();
connectStore();
