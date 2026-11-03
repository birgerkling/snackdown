const HIGHER_MASTER_TITLES=[
['Crunch Commander','Golden Gladiator','The Final Crunch'],
['Wasabi Warrior','Shogun of Sushi','One Roll to Rule'],
['Stacked Champion','Lord of the Buns','The Big Cheese'],
['Crust Commander','Lord of the Loaf','The Last Slice'],
['Firestarter','Inferno Chef','Scorch Supreme'],
['Sugar Sovereign','Donut Disturb','Glaze of Glory'],
['Blizzard Boss','Absolute Zero','The Ice Age'],
['Berry Royalty','Oven Overlord','The Final Batch']
];
function syncMasterTitles(){
 saved.masterTitles??={};saved.masterTitleOrder??={};
 let sequence=Math.max(0,...Object.values(saved.masterTitleOrder));
 let order=[...new Set([...saved.masterOne,...foods.map((_,i)=>i)])];
 for(let i of order){
  if(i===10)continue;
  let tier=Math.min(4,Math.floor((saved.snackCalories[i]||0)/1000));
  if(saved.masterOne.includes(i))tier=Math.max(1,tier);
  saved.masterTitles[i]=Math.max(saved.masterTitles[i]||0,tier);
  for(let rank=1;rank<=saved.masterTitles[i];rank++){
   let key=i+':'+rank;
   if(!saved.masterTitleOrder[key])saved.masterTitleOrder[key]=++sequence;
  }
 }
}
function masterTitleTier(food){return Math.max(saved.masterTitles?.[food]||0,saved.masterOne.includes(food)?1:0)}
function hasMasterTitle(food,tier){return Number.isInteger(tier)&&tier>=1&&tier<=4&&masterTitleTier(food)>=tier}
function masterTitleName(food,tier){return tier===1?MASTER_TITLES[food]:HIGHER_MASTER_TITLES[food]?.[tier-2]}
function masterTitleList(title){
 syncMasterTitles();
 let entries=foods.flatMap((f,food)=>f.retired?[]:[1,2,3,4].map(tier=>({food,tier,unlocked:hasMasterTitle(food,tier),order:saved.masterTitleOrder[food+':'+tier]||0,remaining:Math.max(0,tier*1000-(saved.snackCalories[food]||0))})));
 entries.sort((a,b)=>Number(b.unlocked)-Number(a.unlocked)||(a.unlocked?b.order-a.order:a.remaining-b.remaining)||a.food-b.food||a.tier-b.tier);
 return '<h2>MASTER TITLES · I–IV</h2><p>Newest unlocked titles first. Locked titles are sorted by fewest calories remaining. Reach 1,000 / 2,000 / 3,000 / 4,000 calories on each snack. Titles stay unlocked after calorie losses. Every Master tier also grants a one-time shard reward.</p><button class="text-button" onclick="equipChefTitle(null)">NO TITLE '+(title?'':'✓')+'</button><div class="master-list">'+entries.map(({food:i,tier,unlocked})=>{
  let selected=saved.chefTitle===i&&(saved.chefTitleRank||1)===tier;
  return '<div class="row"><div><b>'+foods[i].name+' · MASTER '+roman(tier)+'</b><small class="master-title-text master-tier-'+tier+'" style="display:block">'+masterTitleName(i,tier)+'</small><small style="display:block">'+(unlocked?'UNLOCKED':(saved.snackCalories[i]||0)+' / '+(tier*1000)+' CALORIES')+'</small></div><button class="cta" '+(!unlocked?'disabled':'')+' onclick="equipChefTitle('+i+','+tier+')">'+(selected?'EQUIPPED ✓':unlocked?'EQUIP':'LOCKED')+'</button></div>';
 }).join('')+'</div>';
}
const MASTER_TITLES=['Golden Menace','Roll With It','Bunbelievable','Breadwinner','Too Hot to Handle','Glazed and Dangerous','Ice Cold Legend'];
saved.masterOne??=[];saved.chefTitle??=null;saved.mainSnack??=saved.selected;
function grantMasterOne(food){if(saved.snackCalories[food]<1000||saved.masterOne.includes(food))return false;saved.masterOne.push(food);saved.shards.red+=50;addBlueShards(15);saved.shards.green+=10;return true}
const masteryAward=awardCalories;awardCalories=function(food,rank,kills=0){let result=masteryAward(food,rank,kills);result.masterOne=grantMasterOne(food);let before=masterTitleTier(food);syncMasterTitles();result.masterTitleUnlocked=masterTitleTier(food)>Math.max(1,before)?masterTitleTier(food):0;return result};
function equipChefTitle(food,tier=1){syncMasterTitles();if(food!==null&&!hasMasterTitle(food,tier))return;saved.chefTitle=food;saved.chefTitleRank=tier;save();club()}
club=function(){syncMasterTitles();let title=saved.chefTitle!==null&&hasMasterTitle(saved.chefTitle,saved.chefTitleRank||1)?masterTitleName(saved.chefTitle,saved.chefTitleRank||1):null;modal(`<div class="eyebrow">CHEF YOU</div><h1>Your chef card</h1>${title?`<div class="master-title master-tier-${saved.chefTitleRank||1}"><span class="master-title-text">✦ ${title} ✦</span></div>`:''}<div class="chef-record">${portrait(saved.mainSnack)}<div><div class="row">Total calories <b>🔥 ${saved.calories}</b></div><div class="row">Matches / Wins <b>${saved.matches} / ${saved.wins}</b></div><div class="row">KOs / Best match <b>${saved.kos} / ${saved.best}</b></div></div></div><div class="row"><span>MAIN SNACK <b>${foods[saved.mainSnack].name}</b></span><button class="cta" onclick="chooseMainSnack()">CHANGE MAIN</button></div>${masterTitleList(title)}`)};
const masteryResults=showCalorieResults;showCalorieResults=function(r){masteryResults(r);if(r.calories.masterTitleUnlocked)resultsScreen.insertAdjacentHTML('beforeend',`<div class="master-unlocked">✦ MASTER ${roman(r.calories.masterTitleUnlocked)} · ${foods[r.food].name}<b class="master-title-text master-tier-${r.calories.masterTitleUnlocked}">${masterTitleName(r.food,r.calories.masterTitleUnlocked)}</b><small>${(r.calories.masterRewards||[]).map(reward=>'MASTER '+roman(reward.tier)+': +'+reward.red+' RED · +'+reward.blue+' BLUE · +'+reward.green+' GREEN'+(reward.serving?' (BLUE TO SERVING)':'')).join('<br>')}<br>Equip your title on your Chef Card</small></div>`);if(r.calories.masterOne)resultsScreen.insertAdjacentHTML('beforeend',`<div class="master-unlocked">✦ MASTER 1 · ${foods[r.food].name}<b class="master-title-text master-tier-1">${MASTER_TITLES[r.food]}</b><small>+50 RED · +15 BLUE · +10 GREEN<br>Equip your title on your Chef Card</small></div>`)};
const masteryFresh=initialProgress;initialProgress=function(){return {...masteryFresh(),masterOne:[],masterTitles:{},chefTitle:null,chefTitleRank:1,mainSnack:3}};
const masteryRefresh=refreshLobby;refreshLobby=function(){syncMasterTitles();masteryRefresh();$('heroPower').textContent='POWER '+saved.levels[saved.selected]+(masterTitleTier(saved.selected)?' · MASTER '+roman(masterTitleTier(saved.selected)):'')};
for(let i=0;i<foods.length;i++)grantMasterOne(i);save();
function chooseMainSnack(){modal(`<div class="eyebrow">YOUR CHEF CARD</div><h1>Choose your main snack</h1><p>Pick the snack shown on your Chef Card.</p><div class="cards snack-cards">${foods.map((f,i)=>{if(f.retired)return '';let unlocked=isSnackUnlocked(i);return `<button class="card fighter-card ${saved.mainSnack===i?'selected':''}" ${!unlocked?'disabled':''} onclick="setMainSnack(${i})">${portrait(i)}<h2>${f.name}</h2><small>${!unlocked?'LOCKED':saved.mainSnack===i?'MAIN SNACK ✓':'SET AS MAIN'}</small></button>`}).join('')}</div><button class="text-button" onclick="club()">← CHEF CARD</button>`)}
function setMainSnack(food){if(!Number.isInteger(food)||!isSnackUnlocked(food))return;saved.mainSnack=food;save();club();toast(foods[food].name.toUpperCase()+' IS YOUR MAIN SNACK!')}


