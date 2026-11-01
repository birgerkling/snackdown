// Ten regular snacks: two costumes and one Legendary each. Limited event skins are separate.
const BEACH_BUN_SKIN={id:'bun-beach',food:2,atlas:7,name:'Beach Bun',rarity:'COMMON',price:100,color:'#50d9da',asset:'beach-bun.png',note:'Big Bun hits the beach with sunglasses, a tropical shirt, orange swim shorts and a surfboard.'};
SKINS.push(BEACH_BUN_SKIN);
const beachBunImage=new Image();skinImages[BEACH_BUN_SKIN.id]=beachBunImage;beachBunImage.onload=()=>refreshLobby();beachBunImage.src='assets/'+BEACH_BUN_SKIN.asset;
const REGULAR_SKIN_TIERS={
 COMMON:['golden','berry','mint','detective','bun-beach'],
 UNCOMMON:['frost','builder','chef','banana-bandit','spud-pirate'],
 RARE:['samurai','rockstar','admiral','banana-diver','spud-space'],
 EPIC:['charcoal','superhero','muffin-royal','cosmic','muffin-space']
};
for(let skin of SKINS){skin.rarity=skin.limited?'LIMITED':skin.exclusive?'LEGENDARY':Object.keys(REGULAR_SKIN_TIERS).find(tier=>REGULAR_SKIN_TIERS[tier].includes(skin.id))||skinRarity(skin);skin.price=SKIN_RARITY_PRICES[skin.rarity]}
