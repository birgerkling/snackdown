// Serving stars, permanent shop collection and a growing total-mastery badge.
const SERVING_AWARDS=Array.from({length:5},(_,i)=>({id:'serving-star-'+(i+1),family:'serving',amount:i+1,name:(i+1)+'-Star Restaurant',short:(i+1)+' STAR'+(i?'S':''),kind:'serving',color:['#aee4b4','#c7e6f1','#ffe18b','#d8b4ff','#fff0b2'][i],description:'Earn '+(i+1)+' Serving star'+(i?'s':'')+' by reaching Serving level '+(i+1)*5+'.'}));
const FULL_MENU_AWARD={id:'full-permanent-menu',family:'collection',name:'Full Permanent Menu',short:'FULL MENU',kind:'menu',color:'#99e7c8',description:'Own every permanent snack available to buy with blue shards. The free starter and event-only snacks are not required.'};
const TOTAL_MASTERY_AWARD={id:'mastery-total',family:'mastery',name:'Total Masteries',short:'MASTERIES',kind:'mastery',color:'#f4c5ff',description:'Every earned Master I, II, III or IV title counts once. Your badge grows with your total, including legacy Pumpkin titles.'};
KITCHEN_AWARDS.push(...SERVING_AWARDS,FULL_MENU_AWARD,TOTAL_MASTERY_AWARD);
function permanentBuyableSnacks(){return foods.map((f,i)=>i).filter(i=>!foods[i].retired&&rarity[i]!=='LIMITED'&&Number.isFinite(blueCharacterPrices[i])&&blueCharacterPrices[i]>0)}
function permanentSnackCollection(data=saved){let required=permanentBuyableSnacks(),owned=required.filter(i=>data.purchasedCharacters?.includes(i));return {required,owned,complete:required.length>0&&owned.length===required.length}}
function highestServingAward(earned=saved.awards||{}){return [...SERVING_AWARDS].reverse().find(a=>earned[a.id])||null}
function earnedServingStars(data=saved){return Math.min(5,Math.max(0,Math.floor((Number(data.serving?.total)||0)/2500),Number(data.chefCardAchievements?.stars)||0,highestServingAward(data.awards)?.amount||0))}
function totalEarnedMasteries(data=saved){
 let count=foods.reduce((sum,f,i)=>{let tier=Math.max(Number(data.masterTitles?.[i])||0,data.masterOne?.includes(i)?1:0,Math.floor((Number(data.snackCalories?.[i])||0)/1000),i===10?Number(data.pumpkinTitleArchive?.tier)||0:0);for(let n=1;n<=4;n++)if(data.masterRewardClaims?.[i+':'+n]||data.masterTitleOrder?.[i+':'+n])tier=Math.max(tier,n);return sum+Math.min(4,Math.max(0,Math.floor(tier)))},0);
 return Math.max(count,Math.floor(Number(data.chefCardAchievements?.masters)||0),Math.floor(Number(data.awardMasteryBest)||0));
}
function totalMasteryAward(data=saved){let total=totalEarnedMasteries(data);return {...TOTAL_MASTERY_AWARD,amount:total,name:total?total+' Total Master'+(total===1?'y':'ies'):'Total Masteries',short:total?total+' MSTR':'MASTERIES'}}
const extraAwardsSync=syncKitchenAwards;syncKitchenAwards=function(data=saved,profile=accountBook.profiles.find(p=>p.id===data.accountId)){
 let earned=extraAwardsSync(data,profile),now=Date.now(),stars=earnedServingStars(data);
 for(let award of SERVING_AWARDS)if(stars>=award.amount&&!earned[award.id])earned[award.id]=now;
 if(permanentSnackCollection(data).complete&&!earned[FULL_MENU_AWARD.id])earned[FULL_MENU_AWARD.id]=now;
 data.awardMasteryBest=totalEarnedMasteries(data);if(data.awardMasteryBest>=1&&!earned[TOTAL_MASTERY_AWARD.id])earned[TOTAL_MASTERY_AWARD.id]=now;
 return earned;
};
const extraAwardIcon=kitchenAwardIcon;kitchenAwardIcon=function(award){
 if(!['serving','menu','mastery'].includes(award.kind))return extraAwardIcon(award);
 let symbol=award.kind==='serving'?'<path d="m32 14 5 11 13 2-10 9 3 13-11-7-11 7 3-13-10-9 13-2Z" fill="currentColor"/><text x="32" y="58" text-anchor="middle" fill="currentColor" font-size="11" font-family="sans-serif" font-weight="900">'+award.amount+'</text>':award.kind==='menu'?'<path d="M15 41a17 17 0 0 1 34 0Z" fill="currentColor"/><path d="M12 46h40M32 20v5" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="18" r="3" fill="currentColor"/><path d="m23 34 6 6 12-13" fill="none" stroke="#153444" stroke-width="3"/>':'<path d="M14 26q9-6 18 0 9-6 18 0v23q-9-6-18 0-9-6-18 0Z" fill="currentColor"/><path d="M32 27v20" stroke="#2d254a" stroke-width="2"/><path d="m32 12 3 5 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1Z" fill="#fff1a3"/><text x="32" y="59" text-anchor="middle" fill="currentColor" font-size="10" font-family="sans-serif" font-weight="900">'+(award.amount||0)+'</text>';
 return '<svg viewBox="0 0 64 68" aria-hidden="true"><path d="M32 3 57 14v25L47 54 32 64 17 54 7 39V14Z" fill="#151b31" stroke="currentColor" stroke-width="3"/><path d="m32 7 20 10v21L43 51 32 58 21 51 12 38V17Z" fill="currentColor" opacity=".13"/>'+symbol+'</svg>';
};
renderKitchenAwards=function(){
 let earned=syncKitchenAwards();if(!kitchenAwardDock)return;
 let featured=[highestCalorieAward(earned)||CALORIE_AWARDS[0],highestRankAward(earned),highestServingAward(earned)||SERVING_AWARDS[0],FULL_MENU_AWARD,totalMasteryAward(),OG_PLAYER_AWARD];
 kitchenAwardDock.innerHTML='<small class="awards-caption">AWARDS</small><div class="award-featured-strip">'+featured.map(a=>'<button class="award-medal '+(earned[a.id]?'earned':'locked')+'" style="--award-color:'+a.color+'" onclick="awardsMenu()" title="'+a.name+' · '+(earned[a.id]?'UNLOCKED':'LOCKED')+'" aria-label="'+a.name+' award, '+(earned[a.id]?'unlocked':'locked')+'">'+kitchenAwardIcon(a)+'<span>'+a.short+'</span></button>').join('')+'</div>';
};
function expandedAwardSections(earned=saved.awards||{}){
 let stars=earnedServingStars(),level=Math.floor((Number(saved.serving?.total)||0)/500),collection=permanentSnackCollection(),missing=collection.required.filter(i=>!collection.owned.includes(i)).map(i=>foods[i].name),mastery=totalMasteryAward();
 return '<section class="award-family"><div class="eyebrow">'+SERVING_AWARDS.filter(a=>earned[a.id]).length+' / 5 COLLECTED</div><h2>SERVING STAR AWARDS</h2><p>One award for each restaurant star, at Serving levels 5, 10, 15, 20 and 25. Keep every earned star badge; your highest appears in the lobby.</p><div class="award-rank-grid">'+SERVING_AWARDS.map(a=>kitchenAwardCard(a,Math.min(a.amount,stars)+' / '+a.amount+' STARS · SERVING LV '+level,earned)).join('')+'</div></section><section class="award-family"><h2>PERMANENT SNACK COLLECTION</h2>'+kitchenAwardCard(FULL_MENU_AWARD,collection.owned.length+' / '+collection.required.length+' BUYABLE SNACKS',earned)+'<p class="award-footnote">'+(missing.length?'Still to unlock: '+missing.join(', ')+'.':'Permanent menu complete!')+' Toast, Jelly and event-only snacks are not required. Once earned, this award stays yours when new snacks are added.</p></section><section class="award-family"><h2>TOTAL MASTERIES</h2>'+kitchenAwardCard(mastery,mastery.amount+' EARNED MASTER TITLES',earned)+'<div class="award-next"><b>'+(mastery.amount?'NEXT BADGE UPGRADE · '+(mastery.amount+1)+' MASTERIES':'EARN YOUR FIRST MASTER TITLE')+'</b><small>Master I + Master II on one snack = 2 masteries. Counted once each, kept after calorie losses.</small></div></section>';
}
const extraAwardsMenu=awardsMenu;awardsMenu=function(){extraAwardsMenu();let legacy=$('content').querySelector('.award-family:last-of-type');if(legacy?.insertAdjacentHTML)legacy.insertAdjacentHTML('beforebegin',expandedAwardSections());else $('content').insertAdjacentHTML('beforeend',expandedAwardSections())};
for(let profile of accountBook.profiles)if(!isDevAccount(profile))syncKitchenAwards(profile.data,profile);
SNACKDOWN_UPDATES.unshift({date:'November 5, 2026',label:'LATEST UPDATE',items:[{icon:'🏅',title:'More kitchen achievements',text:'Collect a badge for each Serving star, a Full Permanent Menu badge for owning all buyable permanent snacks, and a growing Total Masteries badge. Each Master I–IV title counts once, including earned legacy titles. Swipe the lobby Awards row on small screens to see every category.'}]});
SNACKDOWN_UPDATES[0].items.push({icon:'✦',title:'Regular Cores: 25% upgrades',text:'Regular Core taps now have a 25% upgrade chance. The opted-in beginner bonus remains 50% for the first two Cores.'});
save();refreshLobby();
