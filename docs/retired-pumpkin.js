// Keep numeric save IDs stable for the remaining snacks; Pumpkin's slot is retired.
function retirePumpkinFromProfile(p){if(!p)return;for(let key of ['selected','lastSnack','mainSnack'])if(p[key]===PUMPKIN)p[key]=3;for(let key of ['purchasedCharacters','toppings','seasonings','masterOne'])if(Array.isArray(p[key]))p[key]=p[key].filter(i=>i!==PUMPKIN);if(p.chefTitle===PUMPKIN){p.chefTitle=null;p.chefTitleRank=0}if(p.masterTitles)delete p.masterTitles[PUMPKIN];if(p.masterTitleOrder)for(let k of Object.keys(p.masterTitleOrder))if(k.startsWith(PUMPKIN+':'))delete p.masterTitleOrder[k];if(p.equippedSkins)delete p.equippedSkins[PUMPKIN];for(let q of p.questBatch?.items||[])if(q.snack===PUMPKIN){q.snack=3;q.description=q.description?.replaceAll('Pumpkin','Toast')}if(p.chefCardStyle?.emblem==='snack-master-'+PUMPKIN)p.chefCardStyle.emblem='none'}
const retiredUnlocked=isSnackUnlocked;isSnackUnlocked=function(i){return i!==PUMPKIN&&retiredUnlocked(i)};
const retiredSave=save;save=function(...args){retirePumpkinFromProfile(saved);return retiredSave(...args)};
for(let profile of accountBook.profiles)retirePumpkinFromProfile(profile.data);
retirePumpkinFromProfile(saved);
const retiredRefresh=refreshLobby;refreshLobby=function(...args){retirePumpkinFromProfile(saved);let r=retiredRefresh(...args);$('rosterCount').textContent=foods.filter((f,i)=>!f.retired&&isSnackUnlocked(i)).length+'/'+foods.filter(f=>!f.retired).length;return r};
const retiredTry=trySnack;trySnack=function(i,...args){if(i===PUMPKIN)return toast('PUMPKIN HAS LEFT THE KITCHEN');return retiredTry(i,...args)};
const retiredOffer=characterOffer;characterOffer=function(i,...args){if(i===PUMPKIN)return roster();return retiredOffer(i,...args)};
const retiredSelect=select;select=function(i,...args){if(i===PUMPKIN)return;return retiredSelect(i,...args)};
const retiredGrant=grantCoreReward;grantCoreReward=function(r){if(r.kind==='character'&&r.character===PUMPKIN){r.kind='blue';r.amount=300;delete r.character;delete r.pumpkinBundle}return retiredGrant(r)};
const retiredPumpkinReward=rollPumpkinReward;rollPumpkinReward=function(core,random=Math.random){return coreResourceReward(Math.min(4,core.rarity),random)};
for(let i=CHEF_CARD_EMBLEMS.length-1;i>=0;i--)if(CHEF_CARD_EMBLEMS[i].requirement?.food===PUMPKIN)CHEF_CARD_EMBLEMS.splice(i,1);
const retiredStart=start;start=function(...args){retirePumpkinFromProfile(saved);return retiredStart(...args)};
save();refreshLobby();
