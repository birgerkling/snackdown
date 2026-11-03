function halloweenIsOpen(now=Date.now()){return false}
const timedPumpkinBuy=buyPumpkinCore;buyPumpkinCore=function(...args){if(!halloweenIsOpen()){toast('THE HALLOWEEN EVENT HAS ENDED');return null}return timedPumpkinBuy(...args)};
const timedHalloweenSelect=selectHalloween;selectHalloween=function(...args){if(!halloweenIsOpen())return toast('THE HALLOWEEN EVENT HAS ENDED');return timedHalloweenSelect(...args)};
const timedEventStart=start;start=function(...args){if(halloweenMode&&!halloweenIsOpen()){halloweenMode=false;practice=false;rankedMode=false;updateMode();toast('THE HALLOWEEN EVENT HAS ENDED');return}return timedEventStart(...args)};
const timedPumpkinMenu=pumpkinCoresMenu;pumpkinCoresMenu=function(...args){if(!halloweenIsOpen()){modal('<div class="eyebrow">HAUNTED HARVEST</div><h1>THE EVENT HAS ENDED</h1><p>Halloween ended on November 8 at 00:00 CET. Your unlocked Pumpkin and already received Cores stay yours.</p><button class="cta" onclick="closeModal()">BACK TO KITCHEN</button>');return}timedPumpkinMenu(...args);$('content').insertAdjacentHTML('afterbegin','<p class="event-deadline">ENDS NOVEMBER 8 · 00:00 CET</p>')};
function syncHalloweenDeadline(){
 let open=halloweenIsOpen(),changed=HALLOWEEN_EVENT_ACTIVE!==open;HALLOWEEN_EVENT_ACTIVE=open; pumpkinCoreButton.hidden=!open&&pumpkinCoreButton.dataset.mineEvent!=="true";
 if(!open){$('newLobby').classList.remove('halloween-lobby');document.getElementById('halloweenWelcome')?.remove();if(!inHalloweenMatch()&&halloweenMode){halloweenMode=false;practice=false;rankedMode=false;updateMode()}if(changed){document.querySelector('.halloween-mode-card')?.remove();refreshLobby();toast('THE HALLOWEEN EVENT HAS ENDED')}}
}
const deadlineHome=home;home=function(...args){let result=deadlineHome(...args);syncHalloweenDeadline();return result};
syncHalloweenDeadline();setInterval(syncHalloweenDeadline,1000);
