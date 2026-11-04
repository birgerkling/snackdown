// One permanent costume in each rarity for every active snack. Existing IDs stay stable.
const FESTIVAL_SKINS=[
 {
  "id": "nugget-goalie",
  "food": 0,
  "rarity": "UNCOMMON",
  "name": "Goalie Nugget",
  "asset": "nugget-goalie.webp",
  "price": 130,
  "color": "#65b8f5",
  "note": "Big saves, crunchy gloves and a goalie stick. The kitchen goal is covered.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "nugget-clockwork",
  "food": 0,
  "rarity": "RARE",
  "name": "Clockwork Nugget",
  "asset": "nugget-clockwork.webp",
  "price": 160,
  "color": "#d9ad64",
  "note": "A brass wind-up key, spring-loaded feet and heavy clockwork gauntlets.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "maki-street",
  "food": 1,
  "rarity": "UNCOMMON",
  "name": "Street Roll",
  "asset": "maki-street.webp",
  "price": 130,
  "color": "#ff9b58",
  "note": "Headphones, sneakers and streetwear for the freshest roll on the block.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "maki-octopus",
  "food": 1,
  "rarity": "EPIC",
  "name": "Octo Maki",
  "asset": "maki-octopus.webp",
  "price": 200,
  "color": "#b191e8",
  "note": "Coral armor and four curling tentacle arms. An eight-armed attitude.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "bun-gardener",
  "food": 2,
  "rarity": "RARE",
  "name": "Garden Bun",
  "asset": "bun-gardener.webp",
  "price": 160,
  "color": "#90c96c",
  "note": "Flower-filled overalls, watering-can gloves and a garden cart backpack.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "bun-jukebox",
  "food": 2,
  "rarity": "EPIC",
  "name": "Jukebox Bun",
  "asset": "bun-jukebox.webp",
  "price": 200,
  "color": "#f895bc",
  "note": "Chrome jukebox armor, record-disk gloves and retro roller skates.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "toast-mail",
  "food": 3,
  "rarity": "RARE",
  "name": "Special Delivery",
  "asset": "toast-mail.webp",
  "price": 160,
  "color": "#ee8268",
  "note": "A cycling helmet, messenger bag and bicycle-wheel shield. Freshly delivered!",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "toast-reef",
  "food": 3,
  "rarity": "EPIC",
  "name": "Coral Crust",
  "asset": "toast-reef.webp",
  "price": 200,
  "color": "#77dbc6",
  "note": "Coral branches, shell bracers and sea-glass boots. A toast to the reef.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "chili-coach",
  "food": 4,
  "rarity": "COMMON",
  "name": "Coach Chili",
  "asset": "chili-coach.webp",
  "price": 100,
  "color": "#f5ba78",
  "note": "Running shorts, a whistle and a sweatband. Time to turn up the heat.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "chili-barista",
  "food": 4,
  "rarity": "UNCOMMON",
  "name": "Barista Chili",
  "asset": "chili-barista.webp",
  "price": 130,
  "color": "#bf926b",
  "note": "A leather coffee apron, espresso tools and a freshly steamed cup.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "glaze-arcade",
  "food": 5,
  "rarity": "UNCOMMON",
  "name": "Disco Glaze",
  "asset": "glaze-disco-v2.webp",
  "price": 130,
  "color": "#b5e5ef",
  "note": "Silver frosting, dark shades, giant disco-ball gauntlets and black platform boots. Own the dance floor.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "glaze-bee",
  "food": 5,
  "rarity": "EPIC",
  "name": "Queen Bee Glaze",
  "asset": "glaze-bee.webp",
  "price": 200,
  "color": "#ffce6d",
  "note": "Honeycomb armor, bee wings and honey-dipper gloves. Sweet protection.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "frosty-lifeguard",
  "food": 6,
  "rarity": "COMMON",
  "name": "Lifeguard Frosty",
  "asset": "frosty-lifeguard.webp",
  "price": 100,
  "color": "#ff9e85",
  "note": "A rescue buoy, float ring and beach sandals. Keeping things cool.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "frosty-cactus",
  "food": 6,
  "rarity": "RARE",
  "name": "Cactus Scoop",
  "asset": "frosty-cactus.webp",
  "price": 160,
  "color": "#9ec875",
  "note": "Cactus armor, prickly-pear gloves and a desert bloom. Look sharp!",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "muffin-baker",
  "food": 7,
  "rarity": "COMMON",
  "name": "Morning Muffin",
  "asset": "muffin-baker.webp",
  "price": 100,
  "color": "#e2bd8b",
  "note": "A flour-dusted apron, rolling pin and a fresh-from-the-oven smile.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "muffin-diver",
  "food": 7,
  "rarity": "UNCOMMON",
  "name": "Bubble Muffin",
  "asset": "muffin-diver.webp",
  "price": 130,
  "color": "#70cbd9",
  "note": "A scuba mask, flippers and a bubble sprayer. Ready for a deep dive.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "banana-skater",
  "food": 8,
  "rarity": "COMMON",
  "name": "Peel Skater",
  "asset": "banana-skater.webp",
  "price": 100,
  "color": "#ebbc70",
  "note": "Skates, elbow pads and a skateboard. A radioactive ride.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "banana-mantis",
  "food": 8,
  "rarity": "EPIC",
  "name": "Neon Mantis",
  "asset": "banana-mantis.webp",
  "price": 200,
  "color": "#9de15f",
  "note": "Segmented mantis armor, spring legs and two sweeping scythe arms.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "spud-rugby",
  "food": 9,
  "rarity": "COMMON",
  "name": "Scrum Spud",
  "asset": "spud-rugby.webp",
  "price": 100,
  "color": "#cfa76f",
  "note": "A rugby jersey, muddy cleats and taped wrists. Built for the scrum.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "spud-submarine",
  "food": 9,
  "rarity": "EPIC",
  "name": "Submarine Spud",
  "asset": "spud-submarine.webp",
  "price": 200,
  "color": "#efc858",
  "note": "A porthole suit, twin propellers and an anchor glove. Dive into battle.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "ravioli-picnic",
  "food": 11,
  "rarity": "COMMON",
  "name": "Picnic Ravioli",
  "asset": "ravioli-picnic.webp",
  "price": 100,
  "color": "#e2b687",
  "note": "A wicker basket, gingham wraps and a wooden fork. Picnic, with a punch.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "ravioli-matador",
  "food": 11,
  "rarity": "UNCOMMON",
  "name": "Tango Ravioli",
  "asset": "ravioli-matador.webp",
  "price": 130,
  "color": "#df7f7b",
  "note": "An embroidered bolero, red sash and fork fan. Every fight is a dance.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "kiwi-archer",
  "food": 12,
  "rarity": "RARE",
  "name": "Canopy Kiwi",
  "asset": "kiwi-archer.webp",
  "price": 160,
  "color": "#99c877",
  "note": "Leaf armor, climbing boots and a bow-shaped grapple. Rule the canopy.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "kiwi-pinball",
  "food": 12,
  "rarity": "EPIC",
  "name": "Pinball Kiwi",
  "asset": "kiwi-pinball.webp",
  "price": 200,
  "color": "#bb9af2",
  "note": "Pinball bumper armor, spring legs and flipper-blade arms. Jackpot!",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "jelly-lava",
  "food": 13,
  "rarity": "UNCOMMON",
  "name": "Lava Lamp Jelly",
  "asset": "jelly-lava.webp",
  "price": 130,
  "color": "#f69863",
  "note": "Glowing orange gel and floating wax bubbles in a retro lava-lamp base.",
  "festival": true,
  "atlas": 104
 },
 {
  "id": "jelly-terrarium",
  "food": 13,
  "rarity": "EPIC",
  "name": "Terrarium Jelly",
  "asset": "jelly-terrarium.webp",
  "price": 200,
  "color": "#96db93",
  "note": "A living moss garden inside clear jelly, with mushrooms, vines and fern fronds.",
  "festival": true,
  "atlas": 104
 }
];
SKINS.find(s=>s.id==='muffin-royal').rarity='RARE';
SKINS.find(s=>s.id==='muffin-royal').price=SKIN_RARITY_PRICES.RARE;
SKINS.push(...FESTIVAL_SKINS);
for(const skin of FESTIVAL_SKINS){
 const image=new Image();skinImages[skin.id]=image;
 image.onload=()=>{refreshLobby();if(playing)draw()};
 image.src='assets/'+skin.asset;
}
const festivalPreview=skinPreview;
skinPreview=function(food,skin){return skin.festival?'<img class="snack-art costume-single" src="assets/'+skin.asset+'" alt="'+skin.name+' · '+foods[food].name+'" draggable="false">':festivalPreview(food,skin)};
// Reuse the Jelly collection menu so its own page contains all five costumes.
JELLY_SKINS.push(...FESTIVAL_SKINS.filter(s=>s.food===JELLY));
const festivalJellyMenu=jellySkinsMenu;
jellySkinsMenu=function(){festivalJellyMenu();const eyebrow=$('content').querySelector('.eyebrow');if(eyebrow)eyebrow.textContent='FIVE WAYS TO WOBBLE'};
skinShopFilters.food='all';skinShopFilters.rarity='all';
// The unified grid includes owned past-event costumes and current Mine skins.
const festivalFilteredSkins=limitedFiltered;
filteredShopSkins=function(){return festivalFilteredSkins().filter(s=>(skinShopFilters.food==='all'||s.food===Number(skinShopFilters.food))&&(skinShopFilters.rarity==='all'||skinRarity(s)===skinShopFilters.rarity)&&!foods[s.food].retired&&(!s.limited||s.mineEvent||halloweenIsOpen()||saved.ownedSkins.includes(s.id)))};
const festivalSetFilter=setSkinShopFilter;
setSkinShopFilter=function(kind,value){
 if(kind==='food'&&(value==='all'||foods[Number(value)]&&!foods[Number(value)].retired)){skinShopFilters.food=value;return skinShop()}
 if(kind==='rarity'&&(value==='all'||Object.keys(SKIN_RARITY_PRICES).includes(value))){skinShopFilters.rarity=value;return skinShop()}
 return festivalSetFilter(kind,value);
};
resetSkinShopFilters=function(){skinShopFilters={sort:'cheapest',exclusive:false,affordable:false,owned:false,food:'all',rarity:'all'};skinShop()};
const festivalFilterMarkup=skinShopFilterMarkup;
skinShopFilterMarkup=function(){return '<div class="skin-shop-filters festival-selects"><label>SNACK<select aria-label="Filter by snack" onchange="setSkinShopFilter(\'food\',this.value)"><option value="all">All snacks</option>'+foods.map((f,i)=>f.retired?'':'<option value="'+i+'" '+(String(skinShopFilters.food)===String(i)?'selected':'')+'>'+f.name+'</option>').join('')+'</select></label><label>RARITY<select aria-label="Filter by skin rarity" onchange="setSkinShopFilter(\'rarity\',this.value)"><option value="all">All rarities</option>'+Object.keys(SKIN_RARITY_PRICES).map(r=>'<option value="'+r+'" '+(skinShopFilters.rarity===r?'selected':'')+'>'+r+'</option>').join('')+'</select></label></div>'+festivalFilterMarkup()};
function festivalSkinCard(s){let owned=saved.ownedSkins.includes(s.id),active=saved.equippedSkins[s.food]===s.id;return '<div class="card skin-card '+(active?'selected':'')+'" style="--skin-color:'+s.color+'"><small class="skin-owner">'+foods[s.food].name.toUpperCase()+' ONLY'+(s.festival?' · NEW':'')+'</small><div class="skin-preview">'+skinPreview(s.food,s)+'</div><h2>'+s.name+'</h2>'+skinRarityBadge(s)+(s.exclusive?'<small class="exclusive-label">✦ CUSTOM ATTACK + SUPER FX</small>':s.limited?'<small class="exclusive-label">LIMITED EVENT COSTUME</small>':'')+'<p>'+s.note+'</p><button class="cta" onclick="buyOrEquipSkin(\''+s.id+'\')">'+(active?'UNEQUIP':owned?'EQUIP':'◆ '+s.price+' GREEN')+'</button><button class="try-snack" onclick="trySkin(\''+s.id+'\')">◎ TRY IN TRAINING</button><small>'+(active?'EQUIPPED ✓':owned?'OWNED':'COSMETIC COSTUME')+(isSnackUnlocked(s.food)?'':' · SNACK LOCKED')+'</small></div>'}
skinShop=function(){modal('<section class="skin-festival-banner"><div class="eyebrow">THE SKIN FESTIVAL</div><h1>FIVE FLAVORS.<br>EVERY SNACK.</h1><p>13 snacks · 65 permanent costumes · 26 brand-new looks</p><div class="festival-tier-strip">'+Object.keys(SKIN_RARITY_PRICES).filter(r=>r!=='LIMITED').map(r=>'<span class="skin-rarity-badge skin-rarity-'+r.toLowerCase()+'">'+r+' · '+SKIN_RARITY_PRICES[r]+'</span>').join('')+'</div><small>Prices in green shards. Limited event costumes are separate. Your collection stays yours.</small></section><div class="shard-wallet-inline">'+shardWalletMarkup()+'</div>'+skinShopFilterMarkup()+'<div class="cards skin-grid">'+(filteredShopSkins().map(festivalSkinCard).join('')||'<div class="skin-filter-empty"><h2>No skins match these filters</h2><button class="secondary" onclick="resetSkinShopFilters()">SHOW ALL SKINS</button></div>')+'</div><button class="text-button" onclick="roster()">BROWSE SNACKS →</button>')};
shop=function(){skinShop()};
SNACKDOWN_UPDATES.unshift({date:'November 4, 2026',label:'LATEST UPDATE',items:[{icon:'🎨',title:'The Skin Festival',text:'26 new costumes! Every playable snack now has one Common, Uncommon, Rare, Epic and Legendary skin: 65 permanent looks. Royal Rise is now Rare to complete Muffin’s collection. Prices are 100 / 130 / 160 / 200 / 500 green shards. Filter the shop by snack or rarity and try every look in training. Limited costumes and previous purchases stay yours.'}]});
SNACKDOWN_UPDATES[0].items.unshift({icon:'🪩',title:'Disco Glaze takes the floor',text:'A swaggering Uncommon costume with silver frosting, dark shades, oversized disco-ball gauntlets and black flared trousers replaces Arcade Glaze. Existing owners keep their costume and equipped look automatically. The arcade design is reserved for a future event.'});
refreshLobby();
