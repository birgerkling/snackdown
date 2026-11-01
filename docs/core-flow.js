// Pending Cores are the persistent queue; history is read-only.
let coreFlowScheduled=false,coreFlowAccount=saved.accountId,coreFlowPaused=false;
function scheduleCoreFlow(){
 if(coreFlowScheduled)return;
 coreFlowScheduled=true;
 setTimeout(()=>{coreFlowScheduled=false;drainCoreFlow()},0);
}
function drainCoreFlow(){
 if(coreFlowAccount!==saved.accountId){
  coreFlowAccount=saved.accountId;coreAnimation++;activeCore=null;coreBusy=false;
  coreScreen.hidden=true;coreFlowPaused=false;
 }
 if(!coreScreen.hidden&&activeCore)return;
 if(playing||!$('arena').hidden||!resultsScreen.hidden||!scoreboard.hidden||!$('modal').hidden)return;
 let next=saved.coreInventory.pending[0];
 if(next){
  openCore(next.id,'automatic');
 }else if(coreFlowPaused){coreFlowPaused=false;if(playing)paused=false}
}
const immediateCoreCreate=createRewardCore;
createRewardCore=function(...args){let core=immediateCoreCreate(...args);scheduleCoreFlow();return core};
const immediateCoreRefresh=refreshLobby;
refreshLobby=function(...args){
 immediateCoreRefresh(...args);
 coreButton.innerHTML='<span class="mini-orb"></span>CORE HISTORY';
 coreButton.setAttribute('aria-label','Core History');
 scheduleCoreFlow();
};
closeCore=function(){
 if(coreBusy)return;
 let core=activeCore&&findCore(activeCore);
 if(core&&core.status!=='opened'){toast('Open your Core to continue!');return}
 coreAnimation++;activeCore=null;coreBusy=false;coreScreen.hidden=true;
 coreScreen.classList.remove('core-impact');
 drainCoreFlow();
};
coreInventory=function(){
 let inv=saved.coreInventory;
 modal(`<div class="eyebrow">YOUR OPENED CORES</div><h1>Core History</h1><p>${inv.opened} Cores opened · Most recent first</p><div class="core-history">${inv.history.map(c=>{
  let tier=CORE_RARITIES[c.rarity],r=c.reward;
  let reward=r.kind==='character'?'NEW SNACK · '+foods[r.character].name:'+'+r.amount+' '+r.kind.toUpperCase()+' SHARDS'+(r.serving?' → SERVING':'');
  return `<div class="core-history-entry" style="border-left:4px solid ${tier.color};padding:16px;margin:8px 0;background:#ffffff0c;border-radius:10px"><span style="color:${tier.color}">✦ ${tier.name}</span><br><b>${reward}</b></div>`;
 }).join('')||'<p class="core-empty">No Cores opened yet. Every new Core opens automatically, and its rarity and reward will appear here.</p>'}</div>`);
 scheduleCoreFlow();
};
coreButton.onclick=()=>coreInventory();wallet.onclick=()=>coreInventory();
const immediateCoreSwitch=switchAccount;
switchAccount=function(...args){let answer=immediateCoreSwitch(...args);scheduleCoreFlow();return answer};
refreshLobby();

// Resume the persistent queue only after returning to the lobby.
const lobbyCoreHome=home;home=function(...args){let result=lobbyCoreHome(...args);scheduleCoreFlow();return result};
const lobbyCoreCloseModal=closeModal;closeModal=function(...args){let result=lobbyCoreCloseModal(...args);scheduleCoreFlow();return result};
