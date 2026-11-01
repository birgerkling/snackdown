function halloweenState(){saved.halloween??={};let s=saved.halloween;for(let key of ['candy','streak','matches','wins','coreSerial'])s[key]=Math.max(0,Math.floor(Number(s[key])||0));return s}
const PUMPKIN_CHANCES=[.01,.05,.1,.2,.3];
const SCARY_PACKAGES=[{weight:10,level:0},{weight:15,level:1},{weight:20,level:2},{weight:23,level:3},{weight:15,level:3,topping:true},{weight:10,level:4,topping:true,seasoning:true},{weight:7,level:5,topping:true,seasoning:true}];
CORE_RARITIES.push({name:'SCARY',color:'#ff9a3b'});
function halloweenUnit(random=Math.random){return Math.max(0,Math.min(.999999999,random()))}
function pumpkinDuplicateReward(tier,random){let reward=coreResourceReward(Math.min(4,tier),random);return {...reward,amount:Math.round(reward.amount*1.2),pumpkinDuplicate:true}}
function rollPumpkinReward(core,random=Math.random){
 let scary=core.rarity===5;
 if(scary||halloweenUnit(random)<PUMPKIN_CHANCES[core.rarity]){
  if(isSnackUnlocked(PUMPKIN))return pumpkinDuplicateReward(core.rarity,random);
  let bundle={level:0};if(scary){let roll=halloweenUnit(random)*100,total=0;for(let p of SCARY_PACKAGES){total+=p.weight;if(roll<total){bundle=p;break}}}
  return {kind:'character',character:PUMPKIN,pumpkinBundle:true,level:bundle.level,topping:!!bundle.topping,seasoning:!!bundle.seasoning};
 }
 return coreReward(core.rarity,random);
}
const halloweenGrant=grantCoreReward;grantCoreReward=function(reward){halloweenGrant(reward);if(reward.pumpkinBundle){normalizePumpkin();saved.levels[PUMPKIN]=Math.max(saved.levels[PUMPKIN],reward.level);if(reward.topping&&!saved.toppings.includes(PUMPKIN))saved.toppings.push(PUMPKIN);if(reward.seasoning&&!saved.seasonings.includes(PUMPKIN))saved.seasonings.push(PUMPKIN)}};
function buyPumpkinCore(random=Math.random){
 let state=halloweenState();if(state.candy<5){toast('You need 5 Candy. Win Halloween matches to earn Candy!');return null}
 state.candy-=5;let core={id:'pumpkin-'+Date.now().toString(36)+'-'+(++state.coreSerial),kind:'pumpkin',rarity:0,remaining:3+Math.floor(halloweenUnit(random)*3),taps:0,status:'sealed',earnedAt:Date.now()};saved.coreInventory.pending.push(core);save();refreshLobby();if(!playing)closeModal();scheduleCoreFlow();return core;
}
const halloweenUpgradeChance=coreUpgradeChance;coreUpgradeChance=function(core){return core.kind==='pumpkin'?(core.rarity===4?.1:core.rarity===5?0:.42):halloweenUpgradeChance(core)};
const halloweenPress=pressCore;pressCore=function(id,random=Math.random){
 let core=saved.coreInventory.pending.find(c=>c.id===id);if(core?.kind!=='pumpkin')return halloweenPress(id,random);
 if(core.remaining<1)return null;
 let scary=core.rarity===5;core.remaining--;core.taps++;
 let upgraded=!scary&&halloweenUnit(random)<coreUpgradeChance(core);
 if(upgraded){core.rarity++;core.remaining++}
 let opened=scary||core.remaining===0;
 if(opened){core.status='opened';core.reward=rollPumpkinReward(core,random);grantCoreReward(core.reward);let inv=saved.coreInventory;inv.pending=inv.pending.filter(c=>c.id!==id);inv.history.unshift(core);inv.history=inv.history.slice(0,100);inv.opened++}else core.status='charging';
 save();return {core,upgraded,opened};
};
const halloweenRenderCore=renderCore;renderCore=function(core,opened=false){
 coreScreen.classList.toggle('pumpkin-core-screen',core.kind==='pumpkin');
 if(core.kind!=='pumpkin')return halloweenRenderCore(core,opened);
 let tier=CORE_RARITIES[core.rarity],scary=core.rarity===5;
 coreScreen.style.setProperty('--core-color',tier.color);coreScreen.dataset.rarity=core.rarity;
 coreScreen.innerHTML=`<div class="core-stars"></div><div class="core-heading"><small>HALLOWEEN · ${opened?'CORE OPENED':'LIMITED EVENT'}</small><h1>${scary?'SCARY PUMPKIN CORE':'PUMPKIN CORE'}</h1><span class="core-rarity">${tier.name}</span></div><div class="core-stage">${opened?coreRewardMarkup(core):`<button class="core-orb pumpkin-orb ${scary?'scary':''}" id="coreOrb" onclick="tapCore()" aria-label="Tap Pumpkin Core"><span class="pumpkin-core-stem"></span><span class="pumpkin-core-face">◢ ◣<b>╲▰▰╱</b></span><i class="pumpkin-rib one"></i><i class="pumpkin-rib two"></i></button>`}</div>${opened?`<div class="core-reward-copy"><p>${core.reward.pumpkinBundle?'PUMPKIN · POWER '+core.reward.level+(core.reward.topping?' · TOPPING':'')+(core.reward.seasoning?' · SEASONING':''):core.reward.pumpkinDuplicate?'Pumpkin already owned · 20% extra shards!':core.reward.kind==='character'?'A new snack joins your kitchen!':core.reward.serving?'BLUE SHARDS ADDED TO SERVING':'REWARD ADDED TO YOUR WALLET'}</p><button class="cta" onclick="closeCore()">CONTINUE</button></div>`:`${scary?'':`<div class="core-presses"><b id="corePressCount">${core.remaining}</b><span>PRESSES LEFT</span></div>`}<div class="core-feedback" id="coreFeedback">${scary?'TAP TO OPEN':core.rarity===4?'KEEP TAPPING · SCARY IS POSSIBLE!':'TAP THE PUMPKIN'}</div><p class="core-rules">${scary?'Pumpkin guaranteed if not owned · Duplicates give Legendary shards +20%':core.rarity===4?'10% chance per remaining press to become SCARY!':'42% upgrade chance · Each upgrade grants +1 press'}<br>${scary?'Black & orange. A terrifyingly good reward.':'Common → Uncommon → Rare → Epic → Legendary → Scary'}</p>`}`;
};
const halloweenTap=tapCore;tapCore=function(){
 let core=activeCore&&findCore(activeCore);if(core?.kind!=='pumpkin')return halloweenTap();
 if(coreBusy||core.status==='opened')return;coreBusy=true;let id=core.id,answer=pressCore(id);if(!answer){coreBusy=false;return}
 let animation=++coreAnimation;coreScreen.classList.add('core-impact');$('coreOrb').disabled=true;sfx('hit');
 setTimeout(()=>{if(activeCore!==id||animation!==coreAnimation)return;coreBusy=false;coreScreen.classList.remove('core-impact');renderCore(answer.core,answer.opened);if(answer.opened||answer.upgraded)sfx('win')},420);
};
function pumpkinCoresMenu(){
 let s=halloweenState();modal(`<div class="eyebrow">LIMITED HALLOWEEN EVENT</div><h1>Pumpkin Cores</h1><div class="halloween-shop-hero"><div>${portrait(PUMPKIN)}</div><div><h2 id="pumpkinShopCandy" aria-live="polite">🍬 ${s.candy} CANDY</h2><p>Win streak: <b>${s.streak}</b><br>Next win: <b>${(s.streak+1)%2?(s.streak+1)+' CANDY':'1 NORMAL CORE'}</b></p><button id="pumpkinShopBuy" class="cta" ${s.candy<5?'disabled':''} onclick="buyPumpkinCore()">🎃 BUY & OPEN · 5 CANDY</button><button class="secondary" onclick="selectHalloween()">PLAY HALLOWEEN · 2V2</button><button class="text-button" onclick="trySnack(10)">TRY PUMPKIN IN TRAINING →</button></div></div><p>Pumpkin Cores start with 3, 4 or 5 presses. Each upgrade adds one press. Upgrade chance: <b>42%</b>. At Legendary, keep your remaining presses: every tap has a <b>10% chance of Scary</b>.</p><h2>Chance to find Pumpkin</h2><div class="cards">${PUMPKIN_CHANCES.map((chance,i)=>`<div class="card"><b style="color:${CORE_RARITIES[i].color}">${CORE_RARITIES[i].name}</b><h2>${Math.round(chance*100)}%</h2></div>`).join('')}</div><p>If Pumpkin does not drop, use the normal Core reward table for that rarity. A duplicate Pumpkin becomes a shard reward with <b>20% extra</b>.</p><h2>SCARY · 100% PUMPKIN IF NOT OWNED</h2>${SCARY_PACKAGES.map(p=>`<div class="row"><span>${p.weight}%</span><b>POWER ${p.level}${p.topping?' + TOPPING':''}${p.seasoning?' + SEASONING':''}</b></div>`).join('')}<p>Already own Pumpkin? Scary gives a Legendary resource reward with 20% extra. Limited Pumpkin is not required to activate Serving.</p>`);
}
coreInventory=function(){let inv=saved.coreInventory;modal(`<div class="eyebrow">YOUR OPENED CORES</div><h1>Core History</h1><p>${inv.opened} Cores opened · Most recent first</p><div class="core-history">${inv.history.map(c=>{let r=c.reward,t=CORE_RARITIES[c.rarity],text=r.kind==='character'?'NEW SNACK · '+foods[r.character].name+(r.pumpkinBundle?' · POWER '+r.level+(r.topping?' · TOPPING':'')+(r.seasoning?' · SEASONING':''):''):'+'+r.amount+' '+r.kind.toUpperCase()+' SHARDS'+(r.serving?' → SERVING':'');return `<div class="core-history-entry" style="border-left:4px solid ${t.color};padding:16px;margin:8px 0;background:#ffffff0c;border-radius:10px"><span style="color:${t.color}">${c.kind==='pumpkin'?'🎃':'✦'} ${t.name}${c.kind==='pumpkin'?' PUMPKIN CORE':''}</span><br><b>${text}</b></div>`}).join('')||'<p class="core-empty">Your opened Cores will appear here.</p>'}</div>`);scheduleCoreFlow()};
const pumpkinCoreButton=document.createElement('button');pumpkinCoreButton.className='pumpkin-core-button';pumpkinCoreButton.onclick=pumpkinCoresMenu;
document.querySelector('.left-rail button[onclick="roster()"]').insertAdjacentElement('afterend',pumpkinCoreButton);
function refreshPumpkinShopBalance(){let balance=document.getElementById('pumpkinShopCandy'),buy=document.getElementById('pumpkinShopBuy');if(balance)balance.textContent='🍬 '+halloweenState().candy+' CANDY';if(buy)buy.disabled=halloweenState().candy<5||(typeof halloweenIsOpen==='function'&&!halloweenIsOpen())}
const halloweenCoreRefresh=refreshLobby;refreshLobby=function(...args){halloweenCoreRefresh(...args);refreshPumpkinShopBalance();let s=halloweenState();pumpkinCoreButton.innerHTML='<span>🎃</span>PUMPKIN CORES<small>🍬 '+s.candy+' CANDY</small>';};refreshLobby();
// Return to the Pumpkin shop after finishing its opening queue.
let pumpkinShopReturnAccount=null;
const pumpkinShopCloseCore=closeCore;
closeCore=function(...args){
 if(pumpkinShopReturnAccount!==null&&pumpkinShopReturnAccount!==saved.accountId)pumpkinShopReturnAccount=null;
 let core=activeCore&&findCore(activeCore);
 if(!coreBusy&&core?.kind==='pumpkin'&&core.status==='opened')pumpkinShopReturnAccount=saved.accountId;
 let result=pumpkinShopCloseCore(...args);
 if(coreScreen.hidden&&!coreBusy&&pumpkinShopReturnAccount!==null&&pumpkinShopReturnAccount===saved.accountId){pumpkinShopReturnAccount=null;if(!playing&&HALLOWEEN_EVENT_ACTIVE)pumpkinCoresMenu()}
 return result;
};
