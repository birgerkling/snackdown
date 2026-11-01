function halloweenStreakLabel(){let streak=halloweenState().streak,next=streak+1;return {streak,next,reward:next%2?'🍬 '+next+' CANDY':'✦ 1 NORMAL CORE'}}
const streakBadge=document.createElement('div');streakBadge.id='halloweenStreakBadge';streakBadge.hidden=true;streakBadge.setAttribute('aria-live','polite');document.querySelector('.big-play').insertAdjacentElement('beforebegin',streakBadge);
function refreshHalloweenStreak(){
 const show=HALLOWEEN_EVENT_ACTIVE&&halloweenMode&&!practice;streakBadge.hidden=!show;
 if(!show)return;let s=halloweenStreakLabel();
 streakBadge.innerHTML=`<span class="event-streak-flame">🔥</span><div><small>HALLOWEEN WIN STREAK</small><b>${s.streak} <span>${s.streak===1?'WIN':'WINS'}</span></b></div><div class="event-streak-next"><small>NEXT WIN · STREAK ${s.next}</small><strong>${s.reward}</strong></div>${s.streak>=10?'<em class="haunted-challenge-label">HAUNTED CHALLENGE · MAXED ENEMIES</em>':''}`;
}
const streakUpdateMode=updateMode;updateMode=function(...args){let result=streakUpdateMode(...args);refreshHalloweenStreak();return result};
const streakRefreshLobby=refreshLobby;refreshLobby=function(...args){let result=streakRefreshLobby(...args);refreshHalloweenStreak();return result};
const streakUpdateHUD=updateRankedHUD;updateRankedHUD=function(...args){let result=streakUpdateHUD(...args);if(inHalloweenMatch()){let s=halloweenStreakLabel();eventHUD.insertAdjacentHTML('beforeend',`<div class="event-hud-streak">🔥 ${s.streak} WIN STREAK <span>NEXT WIN: ${s.reward}</span>${s.streak>=10?'<small class="haunted-challenge-label">HAUNTED CHALLENGE · LV 5 + TOPPING + SEASONING</small>':''}</div>`)}return result};
const streakChooseMode=chooseMode;chooseMode=function(...args){let result=streakChooseMode(...args),card=document.querySelector('.halloween-mode-card');if(card){let s=halloweenStreakLabel();card.insertAdjacentHTML('beforeend',`<div class="event-mode-streak">🔥 ${s.streak} WIN STREAK <span>NEXT WIN: ${s.reward}</span>${s.streak>=10?'<small class="haunted-challenge-label">HAUNTED CHALLENGE · LV 5 + TOPPING + SEASONING</small>':''}</div>`)}return result};
refreshHalloweenStreak();
