const VARIED_QUEST_POOLS=[
[['Fresh order','any','matches',1,'Complete {n} matches in Solo or Ranked'],['Back for seconds','any','matches',2,'Complete {n} matches in Solo or Ranked']],
[['Snack specialist','any','matches',2,'Complete {n} matches as {snack}',true],['Signature dish','any','kills',3,'Get {n} KOs as {snack}',true]],
[['Fork fighter','ranked','roundWins',3,'Win {n} rounds in completed Ranked matches'],['Team player','ranked','matches',2,'Complete {n} Ranked matches']],
[['Signature damage','any','damage',15000,'Deal {n} damage as {snack}',true],['Favorite flavor','any','kills',8,'Get {n} KOs as {snack}',true]],
[['Solo podium','solo','top3',3,'Finish in the Solo top 3 in {n} matches'],['Sweet survival','solo','top5',5,'Finish in the Solo top 5 in {n} matches']],
[['Team demolition','ranked','damage',30000,'Deal {n} damage in completed Ranked matches'],['Knockout course','ranked','kills',12,'Get {n} KOs in completed Ranked matches']],
[['Super signature','any','supers',10,'Use {snack}’s Super {n} times in completed matches',true],['A taste for victory','any','wins',4,'Win {n} matches as {snack}',true]],
[['Ranked chef','ranked','wins',3,'Win {n} Ranked matches'],['Fork collection','ranked','roundWins',15,'Win {n} rounds in completed Ranked matches']],
[['Solo specialist','solo','wins',5,'Win {n} Solo matches as {snack}',true],['Perfect serving','solo','top2',8,'Finish in the Solo top 2 in {n} matches as {snack}',true]],
[['Kitchen world tour','any','damage',120000,'Deal {n} damage across Solo and Ranked'],['Master of both','any','wins',12,'Win {n} matches across Solo and Ranked']]
];
const standardQuestBatch=createQuestBatch;
createQuestBatch=function(round=1,random=Math.random){let batch=standardQuestBatch(round,random),owned=foods.map((_,i)=>i).filter(isSnackUnlocked),pick=list=>list[Math.min(list.length-1,Math.floor(Math.max(0,random())*list.length))],factor=1+Math.min(1,(round-1)*.1);batch.schema=2;batch.items=batch.items.map((base,i)=>{let q=pick(VARIED_QUEST_POOLS[i]),snack=q[5]?pick(owned):null,goal=Math.ceil(q[3]*factor);return {...base,title:q[0],scope:q[1],metric:q[2],goal,snack,description:q[4].replace('{n}',goal.toLocaleString('en-US')).replace('{snack}',snack===null?'':foods[snack].name)}});return batch};
function recordQuestEvent(event){
  if(!event||!['solo','ranked'].includes(event.mode))return;
  for(let q of questState().items){if(q.claimed)continue;let scope=q.scope||'solo';if(scope!=='any'&&scope!==event.mode)continue;if(q.snack!=null&&q.snack!==event.food)continue;q.progress=Math.min(q.goal,q.progress+Math.max(0,Number(event[q.metric])||0))}
  save();updateQuestFreeBadge();
}
// The Solo completion hook keeps its original match/account validation.
recordQuestMatch=function(rank,kills,damage,supers){recordQuestEvent({mode:'solo',food:player.food,matches:1,kills,damage:Math.floor(damage),supers,top5:rank<=5?1:0,top3:rank<=3?1:0,top2:rank<=2?1:0,wins:rank===1?1:0,bigWins:rank===1&&kills>=5?1:0})};
const variedQuestSuper=superAttack;superAttack=function(){let before=charge,previous=questMatch.supers,session=rankedSession;variedQuestSuper();if(playing&&!practice&&before>=100&&charge<before){if(questMatch.supers===previous)questMatch.supers++;if(session&&session===rankedSession)session.questPlayerSupers=(session.questPlayerSupers||0)+1}};
const recordedRankedQuests=new WeakSet();
const variedQuestComplete=completeRankedMatch;completeRankedMatch=function(){let session=rankedSession,account=saved.accountId,before=rankedState().matches,stats=session?.scoreRows?.[0]?.stats,event=session?{mode:'ranked',food:player.food,matches:1,kills:stats?.kills||0,damage:Math.floor(stats?.damage||0),supers:session.questPlayerSupers||0,roundWins:session.results.filter(Boolean).length,wins:session.results.filter(Boolean).length>=3?1:0}:null,valid=session&&!session.questAbandoned&&session.results.length===5&&!recordedRankedQuests.has(session);variedQuestComplete();if(valid&&saved.accountId===account&&rankedState().matches===before+1){recordedRankedQuests.add(session);recordQuestEvent(event);refreshLobby()}};
const variedQuestHome=home;home=function(){if(rankedSession)rankedSession.questAbandoned=true;variedQuestHome()};
// Keep every claimed or started quest; replace only untouched old quests.
const standardQuestState=questState;questState=function(now=Date.now()){let batch=standardQuestState(now);if(!batch.schema){let fresh=createQuestBatch(batch.round);batch.items=batch.items.map((q,i)=>q.claimed||q.progress>0?q:fresh.items[i]);batch.schema=2;save()}return batch};questState();updateQuestFreeBadge();
