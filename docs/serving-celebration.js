// Receipts only: Serving already grants these rewards when blue shards arrive.
function queueServingCelebration(data,before,after){
 if(after<=before)return;
 let reward=servingLevelRewards(before,after);
 (data.servingCelebrations??=[]).push({before,after,starsBefore:Math.min(5,Math.floor(before/5)),starsAfter:Math.min(5,Math.floor(after/5)),red:reward.red,green:reward.green});
}
const celebrateServingContribution=contributeServing;
contributeServing=function(amount){
 let before=servingState().level,result=celebrateServingContribution(amount);
 queueServingCelebration(saved,before,servingState().level);
 scheduleServingCelebration();return result;
};
let servingCelebration=document.createElement('section');
servingCelebration.id='servingCelebration';servingCelebration.hidden=true;
servingCelebration.setAttribute('role','dialog');servingCelebration.setAttribute('aria-modal','true');
servingCelebration.setAttribute('aria-label','Serving level rewards');document.body.appendChild(servingCelebration);
let servingCelebrationScheduled=false,servingCelebrationAccount=saved.accountId,servingCelebrationReceipt=null;
function scheduleServingCelebration(){
 if(servingCelebrationScheduled)return;
 servingCelebrationScheduled=true;
 setTimeout(()=>{servingCelebrationScheduled=false;showServingCelebration()},0);
}
function showServingCelebration(){
 if(servingCelebrationAccount!==saved.accountId){servingCelebrationAccount=saved.accountId;servingCelebrationReceipt=null;servingCelebration.hidden=true}
 if(!coreScreen.hidden||saved.coreInventory.pending.length||!servingCelebration.hidden)return;
 let receipt=saved.servingCelebrations?.[0];if(!receipt)return;
 servingCelebrationReceipt=receipt;
 let star=receipt.starsAfter>receipt.starsBefore;
 servingCelebration.dataset.star=String(star);
 servingCelebration.innerHTML=`<div class="serving-celebration-card"><div class="eyebrow">YOUR RESTAURANT IS GROWING</div><div class="serving-celebration-emblem">${star?'★':'🍽'}</div><h1>${star?'RESTAURANT STAR!':'SERVING LEVEL UP!'}</h1><div class="serving-celebration-level">LEVEL ${receipt.before} <span>→</span> <b>${receipt.after}</b></div><div class="serving-celebration-stars" aria-label="${receipt.starsAfter} out of 5 restaurant stars">${'★'.repeat(receipt.starsAfter)}<span>${'☆'.repeat(5-receipt.starsAfter)}</span></div>${star?`<p class="serving-star-unlocked">${receipt.starsAfter-receipt.starsBefore} NEW RESTAURANT STAR${receipt.starsAfter-receipt.starsBefore>1?'S':''}!</p>`:''}<p class="serving-rewards-label">REWARDS ADDED TO YOUR WALLET</p><div class="serving-celebration-rewards"><div><span>◆</span><b>+${receipt.red}</b><small>RED SHARDS</small></div><div><span>◆</span><b>+${receipt.green}</b><small>GREEN SHARDS</small></div></div><button class="cta" onclick="continueServingCelebration()">AWESOME!</button></div>`;
 servingCelebration.hidden=false;sfx('win');
 servingCelebration.querySelector('button')?.focus();
}
function continueServingCelebration(){
 if(servingCelebrationAccount!==saved.accountId||!servingCelebrationReceipt)return;
 if(saved.servingCelebrations?.[0]===servingCelebrationReceipt)saved.servingCelebrations.shift();
 servingCelebrationReceipt=null;servingCelebration.hidden=true;save();scheduleServingCelebration();
}
const servingCelebrationRefresh=refreshLobby;
refreshLobby=function(...args){servingCelebrationRefresh(...args);scheduleServingCelebration()};
const servingCelebrationDrain=drainCoreFlow;
drainCoreFlow=function(...args){let result=servingCelebrationDrain(...args);scheduleServingCelebration();return result};
scheduleServingCelebration();
