function devGiftPlayers(){return accountBook.profiles.filter(p=>!isDevAccount(p)&&!(accountBook.deletedIds||[]).includes(p.id))}
function devGiftsMenu(){
  if(!saved.isDevBuild)return;
  let players=devGiftPlayers(),receipt=saved.lastDevGift;
  modal(`<div class="eyebrow">DEV BUILD · PLAYER GIFTS</div><h1>Give to player</h1><p>Give resources and items to an account saved in this browser. Gifts are added to its existing progress. Accounts on other devices are not connected.</p>${receipt?`<div class="road-claim-receipt"><b>✓ SENT TO ${accountEscape(receipt.name)}</b><p>${accountEscape(receipt.summary)}</p></div>`:''}${players.length?`<form onsubmit="event.preventDefault();sendDevGift()"><label class="dev-field">PLAYER<select id="gift-player" required>${players.map(p=>`<option value="${accountEscape(p.id)}">${accountEscape(p.name)}</option>`).join('')}</select></label><h2>Resources</h2><div class="dev-grid">${['red','blue','green'].map(k=>devField('gift-'+k,k.toUpperCase()+' SHARDS',0,1000000)).join('')}${devField('gift-cores','CORES',0,100)}</div><h2>Items</h2><div class="dev-grid"><label class="dev-field">SNACK<select id="gift-snack"><option value="">None</option>${foods.map((f,i)=>f.retired?'':`<option value="${i}">${accountEscape(f.name)} · ${rarity[i]}</option>`).join('')}</select></label><label class="dev-field">SKIN<select id="gift-skin"><option value="">None</option>${SKINS.map(s=>`<option value="${accountEscape(s.id)}">${accountEscape(foods[s.food].name+' · '+s.name)}</option>`).join('')}</select></label></div><p>Items already owned are kept without duplicates. A skin gift does not unlock its snack. Blue shards go to Serving only when the recipient owns every snack.</p><button class="cta" type="submit">SEND GIFT</button></form>`:'<p>No player accounts are saved yet. Create a normal account in Accounts first.</p>'}<button class="text-button" onclick="devBuildMenu()">← KITCHEN DEVELOPER</button>`);
}
function sendDevGift(values){
  if(!saved.isDevBuild)return false;
  let v=values||{player:$('gift-player').value,red:$('gift-red').value,blue:$('gift-blue').value,green:$('gift-green').value,cores:$('gift-cores').value,snack:$('gift-snack').value,skin:$('gift-skin').value};
  let target=devGiftPlayers().find(p=>p.id===v.player);
  if(!target){toast('Choose a saved player account.');return false}
  let quantities={};for(let k of ['red','blue','green','cores']){let n=Number(v[k]??0),max=k==='cores'?100:1000000;if(!Number.isSafeInteger(n)||n<0||n>max){toast('Enter whole amounts within the shown limits.');return false}quantities[k]=n}
  let snack=v.snack===''||v.snack==null?null:Number(v.snack),skin=v.skin?SKINS.find(s=>s.id===v.skin):null;
  if(snack!==null&&(!Number.isInteger(snack)||!foods[snack])||v.skin&&!skin){toast('Choose a valid snack or skin.');return false}
  let data=accountClone(target.data),notes=[];data.shards??={red:0,blue:0,green:0};data.purchasedCharacters??=[];data.ownedSkins??=[];
  if(snack!==null&&snack!==3&&!data.purchasedCharacters.includes(snack)){data.purchasedCharacters.push(snack);notes.push(foods[snack].name+' unlocked')}
  if(skin&&!data.ownedSkins.includes(skin.id)){data.ownedSkins.push(skin.id);notes.push(skin.name+' skin')}
  for(let k of ['red','green'])if(quantities[k]){data.shards[k]+=quantities[k];notes.push('+'+quantities[k]+' '+k+' shards')}
  if(quantities.blue){let all=foods.every((_,i)=>i===3||rarity[i]==='LIMITED'||data.purchasedCharacters.includes(i));if(all){data.serving??={total:0};let before=Math.floor(data.serving.total/500);data.serving.total+=quantities.blue;let bonus=servingLevelRewards(before,Math.floor(data.serving.total/500)),levels=bonus.levels;data.shards.red+=bonus.red;data.shards.green+=bonus.green;queueServingCelebration(data,before,Math.floor(data.serving.total/500));notes.push('+'+quantities.blue+' blue to Serving'+(levels?' · +'+levels+' levels, +'+bonus.red+' red, +'+bonus.green+' green':''))}else{data.shards.blue+=quantities.blue;notes.push('+'+quantities.blue+' blue shards')}}
  if(quantities.cores){let inv=data.coreInventory??=emptyCores();for(let i=0;i<quantities.cores;i++){let sequence=++inv.serial;inv.pending.push({id:Date.now().toString(36)+'-'+sequence,sequence,remaining:randomCorePresses(),rarity:0,taps:0,earnedAt:Date.now(),status:'sealed'})}notes.push('+'+quantities.cores+' Cores')}
  if(!notes.length){toast('Add a resource amount or choose an unowned item.');return false}
  let receipt={name:target.name,summary:notes.join(' · '),at:Date.now()};data.devGiftHistory=[receipt,...(data.devGiftHistory||[])].slice(0,30);let previousData=target.data,previousTime=target.updatedAt,previousReceipt=saved.lastDevGift;target.data=data;target.updatedAt=Date.now();saved.lastDevGift=receipt;
  if(!persistAccounts()){target.data=previousData;target.updatedAt=previousTime;saved.lastDevGift=previousReceipt;toast('Could not save the gift.');return false}
  save();devGiftsMenu();toast('GIFT SENT TO '+target.name.toUpperCase());return true;
}
const giftsDevMenu=devBuildMenu;devBuildMenu=function(){giftsDevMenu();if(saved.isDevBuild)$('content').insertAdjacentHTML('afterbegin','<button class="cta" onclick="devGiftsMenu()">🎁 GIVE TO PLAYER</button>')};
