const HALLOWEEN_EVENT_END=Date.parse("2026-11-08T00:00:00+01:00");
let HALLOWEEN_EVENT_ACTIVE=false; // Archived: replaced by the Crystal Depths event.
let halloweenMode=false;
function inHalloweenMatch(){return !!rankedSession?.halloween}
function selectHalloween(){if(!HALLOWEEN_EVENT_ACTIVE)return;if(playing)home();halloweenMode=true;rankedMode=false;practice=false;closeModal();updateMode();toast('HALLOWEEN KNOCKOUT SELECTED · PRESS PLAY')}
const eventSetMode=setMode;setMode=function(...args){halloweenMode=false;return eventSetMode(...args)};
const eventRankedMenu=rankedMenu;rankedMenu=function(...args){halloweenMode=false;return eventRankedMenu(...args)};
const eventSelectRanked=selectRanked;selectRanked=function(...args){halloweenMode=false;return eventSelectRanked(...args)};
const eventChooseMode=chooseMode;chooseMode=function(){eventChooseMode();if(HALLOWEEN_EVENT_ACTIVE)$('content').insertAdjacentHTML('beforeend',`<button class="card halloween-mode-card ${halloweenMode?'selected':''}" onclick="selectHalloween()"><span class="food">🎃</span><h2>HALLOWEEN KNOCKOUT</h2><p>LIMITED EVENT · 2V2 · FIRST TO 2</p><strong>WIN STREAK → CANDY & CORES</strong></button>`)};
const eventUpdateMode=updateMode;updateMode=function(){eventUpdateMode();if(halloweenMode){$('modeName').textContent='HALLOWEEN KNOCKOUT · 2V2';$('modeEyebrow').textContent='LIMITED EVENT · WIN STREAK '+halloweenState().streak;$('mapLabel').textContent='Haunted Harvest · First to 2'}};
const eventStart=start;start=function(...args){
 if(!halloweenMode||practice){if(practice)halloweenMode=false;return eventStart(...args)}
 if(saved.newPlayerChoice===null||saved.newPlayerChoice===true&&!saved.tutorialCompleted){halloweenMode=false;return eventStart(...args)}
 if(!HALLOWEEN_EVENT_ACTIVE||inHalloweenMatch())return;
 let level=saved.levels[saved.selected]||0;
 rankedSession={halloween:true,account:saved.accountId,streakBefore:halloweenState().streak,results:[],round:1,waiting:0,botRank:{name:'HALLOWEEN',min:0,level},eventLevel:level,eventChallenge:halloweenState().streak>=10,eventAllyHandicap:halloweenState().streak>=15,eventForgetfulAlly:halloweenState().streak>=25,eventSmartEnemies:halloweenState().streak>=30,carrySuperCharge:0};
 halloweenState().activeMatch=true;save();startRankedRound();
};
const eventStartRound=startRankedRound;startRankedRound=function(...args){
 if(!inHalloweenMatch())return eventStartRound(...args);
 let session=rankedSession,rows=session.eventRows;
 eventStartRound(...args);if(rankedSession!==session)return;
 actors=[actors[0],actors[1],actors[3],actors[4]];
 actors.forEach((a,i)=>{
  if(session.eventRoster&&a!==player){let identity=session.eventRoster[i];a.name=identity.name;a.food=identity.food;a.skinId=identity.skinId}
  a.team=i<2?0:1;a.x=W/2+(i%2?260:-260);a.y=i<2?H-230:230;a.angle=i<2?-Math.PI/2:Math.PI/2;a.rankedLane=i%2?1:-1;a.rankedLaneX=a.x;a.rankedCharge=0;a.rankedSmart=!!session.eventSmartEnemies&&a.team!==player.team;
  if(a!==player){let allyHandicap=session.eventAllyHandicap&&a.team===0,level=allyHandicap?3:session.eventChallenge&&a.team===1?5:session.eventLevel;rollOpponentLevel(a,()=>level/6+.001);a.beginnerBot=false;a.botTopping=!allyHandicap&&level>=3;a.rankedAbilities=!allyHandicap&&level>=4}
 });
 if(!session.eventRoster)session.eventRoster=actors.map(a=>({name:a.name,food:a.food,skinId:a.skinId}));
 session.scoreRows=rows||actors.map(a=>({name:a.name,food:a.food,skinId:a.skinId,stats:{kills:0,damage:0,deaths:0,taken:0}}));session.eventRows=session.scoreRows;
 blocks=blocks.filter(b=>!actors.some(a=>a.x>b.x-65&&a.x<b.x+b.w+65&&a.y>b.y-65&&a.y<b.y+b.h+65));crates=[];pumpkinRolls=[];buildMap();updateRankedHUD();draw();
};
const eventHUD=document.createElement('div');eventHUD.id='halloweenHUD';eventHUD.hidden=true;$('arena').appendChild(eventHUD);
const eventRankedHUD=updateRankedHUD;updateRankedHUD=function(){
 if(!inHalloweenMatch()){eventHUD.hidden=true;return eventRankedHUD()}
 let session=rankedSession;rankedHUD.hidden=true;eventHUD.hidden=false;
 eventHUD.innerHTML=`<div class="halloween-rounds">${Array.from({length:3},(_,i)=>`<span class="${session.results[i]===true?'won':session.results[i]===false?'lost':i===session.results.length?'current':'pending'}" title="Round ${i+1}">🎃</span>`).join('')}</div><b>ROUND ${session.round} / 3 · ${session.results.filter(Boolean).length}–${session.results.filter(x=>!x).length}</b>`;
 $('left').textContent='BLUE '+actors.filter(a=>a.alive&&a.team===0).length+' · '+actors.filter(a=>a.alive&&a.team===1).length+' RED';$('status').textContent=player.alive?'HALLOWEEN · FIRST TO 2':'KNOCKED OUT · SPECTATING';spectateButton.hidden=player.alive;if(!player.alive)spectateButton.textContent='SPECTATING '+(arenaCameraFocus?.name||'TEAM')+' · NEXT ›';
};
const eventEndRound=endRankedRound;endRankedRound=function(won){
 if(!inHalloweenMatch())return eventEndRound(won);
 let s=rankedSession;if(s.waiting)return;s.results.push(!!won);s.carrySuperCharge=charge;
 s.eventFinished=s.results.filter(Boolean).length>=2||s.results.filter(x=>!x).length>=2||s.results.length>=3;s.waiting=s.eventFinished?1.4:3;
 pointer=false;keys={};joy={x:0,y:0};$('matchBanner').textContent=won?'PUMPKIN ROUND WON!':'PUMPKIN ROUND LOST';$('matchBanner').classList.add('visible');updateRankedHUD();sfx(won?'win':'hit');
 // Commit a completed match immediately, before any navigation or reload can abandon it.
 if(s.eventFinished)completeHalloweenMatch();
};
function completeHalloweenMatch(){
 let session=rankedSession;if(!session?.halloween||session.eventSettled)return;
 session.eventSettled=true;let state=halloweenState(),won=session.results.filter(Boolean).length>=2;
 state.activeMatch=false;state.matches++;if(won){state.wins++;state.streak=(session.streakBefore??state.streak)+1}else state.streak=0;
 let reward=won?(state.streak%2?{kind:'candy',amount:state.streak}:{kind:'core',amount:1}):null;
 if(reward?.kind==='candy')state.candy+=reward.amount;
 if(reward?.kind==='core')createRewardCore();
 state.lastResult={won,results:session.results.slice(0,3),reward,streak:state.streak,at:Date.now()};
 rankedSession=null;playing=false;paused=false;pointer=false;keys={};joy={x:0,y:0};cancelAnimationFrame(raf);arenaCameraFocus=null;spectateButton.hidden=true;rankedHUD.hidden=true;eventHUD.hidden=true;scoreboard.hidden=true;$('arena').hidden=true;$('lobby').hidden=false;
 save();refreshLobby();updateMode();
 modal(`<div class="eyebrow">LIMITED HALLOWEEN EVENT · 2V2 KNOCKOUT</div><h1>${won?'SPOOKTACULAR VICTORY!':'THE HAUNT IS OVER'}</h1><div class="halloween-result-pumpkins">${session.results.slice(0,3).map(w=>`<span class="${w?'won':'lost'}">🎃</span>`).join('')}</div><h2>BLUE ${session.results.filter(Boolean).length} – ${session.results.filter(x=>!x).length} RED</h2><div class="halloween-streak"><small>WIN STREAK</small><b>${state.streak} 🔥</b><p>${reward?reward.kind==='candy'?'🍬 +'+reward.amount+' CANDY':'✦ +1 NORMAL CORE · OPENS AUTOMATICALLY':'Streak broken. Your next win starts a new streak!'}</p></div><p>🍬 ${state.candy} CANDY · No Elo or calorie changes.<br>Next win: ${(state.streak+1)%2?(state.streak+1)+' Candy':'1 normal Core'}</p><button class="cta" onclick="start()">PLAY AGAIN</button> <button class="secondary" onclick="home()">LOBBY</button> <button class="secondary" onclick="pumpkinCoresMenu()">PUMPKIN CORES</button>`);
}
const eventCompleteRanked=completeRankedMatch;completeRankedMatch=function(...args){return inHalloweenMatch()?completeHalloweenMatch():eventCompleteRanked(...args)};
const eventUpdate=update;update=function(dt){
 if(inHalloweenMatch()&&rankedSession.waiting){if(paused)return;rankedSession.waiting-=dt;if(rankedSession.waiting<=0){if(rankedSession.eventFinished)completeHalloweenMatch();else{rankedSession.round++;startRankedRound()}}return}
 eventUpdate(dt);
};
const eventHome=home;home=function(...args){if(inHalloweenMatch()){rankedSession.eventAbandoned=true;completeHalloweenMatch()}eventHUD.hidden=true;return eventHome(...args)};
const eventSwitchAccount=switchAccount;switchAccount=function(...args){if(inHalloweenMatch())home();halloweenMode=false;return eventSwitchAccount(...args)};
const eventRefresh=refreshLobby;refreshLobby=function(...args){
 let state=halloweenState();if(state.activeMatch&&(!inHalloweenMatch()||rankedSession.account!==saved.accountId)){state.activeMatch=false;state.streak=0;save()}
 return eventRefresh(...args);
};
refreshLobby();

// At streak 25+, the allied bot occasionally misses one attack opportunity.
const forgetfulEventShoot=shoot;
shoot=function(a,angle,superShot=false){
 if(inHalloweenMatch()&&rankedSession.eventForgetfulAlly&&a!==player&&a.team===player.team&&!superShot&&playing&&!paused&&countdown<=0&&a.alive&&a.cd<=0&&Math.random()<.18){a.cd=.8;return}
 return forgetfulEventShoot(a,angle,superShot);
};
