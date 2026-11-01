const QUEST_WAIT=5*60*1000;
const QUEST_TEMPLATES=[
['First serving','matches',1,'Play {n} match(es)','red',20],
['Crumb collector','kills',3,'Defeat {n} snacks','blue',20],
['Still cooking','top5',3,'Finish in the top 5 in {n} matches','green',15],
['Heavy hitter','damage',15000,'Deal {n} damage to opponents','red',50],
['Super special','supers',8,'Use your Super {n} times','blue',50],
['Kitchen knockout','kills',20,'Defeat {n} snacks','green',40],
['Final serving','top2',6,'Finish in the top 2 in {n} matches','core',1],
['Head chef','wins',5,'Win {n} matches','red',100],
['Five-star feast','bigWins',3,'Win {n} matches with at least 5 KOs each','core',2],
['Kitchen legend','wins',10,'Win {n} matches','skin',1]
];
const QUEST_VARIANTS=[['Back to the kitchen','matches',2,'Play {n} match(es)'],['Snack attack','kills',5,'Defeat {n} snacks'],['Podium plate','top3',2,'Finish in the top 3 in {n} matches'],['Full heat','damage',20000,'Deal {n} damage to opponents'],['Super chef','supers',10,'Use your Super {n} times'],['Crumb storm','kills',25,'Defeat {n} snacks'],['Table for two','top2',7,'Finish in the top 2 in {n} matches'],['Victory feast','wins',6,'Win {n} matches'],['Golden grill','bigWins',4,'Win {n} matches with at least 5 KOs each'],['Legendary service','wins',12,'Win {n} matches']];
function createQuestBatch(round=1,random=Math.random){let multiplier=1+Math.min(1,(round-1)*.1);return {round,refreshAt:null,items:QUEST_TEMPLATES.map((template,i)=>{let q=round>1&&random()<.5?[...QUEST_VARIANTS[i],...template.slice(4)]:template;let goal=Math.ceil(q[2]*multiplier*(round===1?1:1+random()*.25));return {id:round+'-'+i,title:q[0],metric:q[1],goal,description:q[3].replace('{n}',goal.toLocaleString('en-US')).replace('match(es)',goal===1?'match':'matches'),kind:q[4],amount:q[5],progress:0,claimed:false}})}}
function questState(now=Date.now()){if(!saved.questBatch)saved.questBatch=createQuestBatch();let batch=saved.questBatch;if(batch.refreshAt&&now>=batch.refreshAt){saved.questBatch=createQuestBatch(batch.round+1);save()}return saved.questBatch}
function questRewardLabel(q){return q.kind==='skin'?'MYSTERY SKIN':q.kind==='core'?q.amount+' CORE'+(q.amount>1?'S':''):q.amount+' '+q.kind.toUpperCase()+' SHARDS'}
function questTimeLeft(now=Date.now()){let seconds=Math.max(0,Math.ceil(((saved.questBatch?.refreshAt||now)-now)/1000));return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')}
quests=function(){let batch=questState(),claimed=batch.items.filter(q=>q.claimed).length;modal(`<div class="eyebrow">10 CHALLENGES · BIGGER BITES, BETTER REWARDS</div><h1>Kitchen quests</h1><p class="quest-controller-hint">🎮 D-pad ↑ / ↓: browse quests · ✕: claim · ○: back</p><p>Set ${batch.round} · ${claimed}/10 rewards claimed. Completed Solo and Ranked matches count according to each quest. Training and unfinished matches do not count.</p>${batch.refreshAt?`<div class="quest-refresh"><small>NEXT 10 QUESTS IN</small><b id="questCountdown">${questTimeLeft()}</b><p>Your new set arrives automatically when the timer ends.</p></div>`:''}<div class="quest-list">${batch.items.map((q,i)=>`<div tabindex="-1" class="quest-card ${q.claimed?'quest-claimed':''}"><div class="quest-number">${i+1}</div><div class="quest-copy"><small>${(q.scope||'solo').toUpperCase()}${q.snack!=null?' · '+foods[q.snack].name.toUpperCase():''} · ${i<3?'WARM-UP':i<6?'CHALLENGE':i<9?'EXPERT':'LEGEND'}</small><h2>${q.title}</h2><p>${q.description}</p><div class="progress"><i style="width:${Math.min(100,q.progress/q.goal*100)}%"></i></div><b>${Math.min(q.progress,q.goal).toLocaleString('en-US')} / ${q.goal.toLocaleString('en-US')}</b></div><button class="cta quest-reward ${q.kind}" ${q.claimed||q.progress<q.goal?'disabled':''} onclick="claimKitchenQuest('${q.id}')">${q.claimed?'✓ CLAIMED':questRewardLabel(q)}</button></div>`).join('')}</div><p>The hardest quest awards an unowned regular skin. If you own them all, receive 150 green shards instead. After claiming all 10 rewards, the next set arrives in 5 minutes.</p>`)};
function claimKitchenQuest(id){let batch=questState(),q=batch.items.find(q=>q.id===id);if(!q||q.claimed||q.progress<q.goal)return false;q.claimed=true;let message=questRewardLabel(q);if(q.kind==='core'){for(let i=0;i<q.amount;i++)createRewardCore()}else if(q.kind==='skin'){let available=SKINS.filter(s=>!s.exclusive&&!s.limited&&!saved.ownedSkins.includes(s.id)),ownedSnackSkins=available.filter(s=>isSnackUnlocked(s.food)),pool=ownedSnackSkins.length?ownedSnackSkins:available;if(pool.length){let skin=pool[Math.floor(Math.random()*pool.length)];saved.ownedSkins.push(skin.id);message=skin.name+' SKIN UNLOCKED!'}else{saved.shards.green+=150;message='150 GREEN SHARDS'}}else if(q.kind==='blue'){if(addBlueShards(q.amount))message=q.amount+' BLUE → SERVING'}else saved.shards[q.kind]+=q.amount;if(batch.items.every(q=>q.claimed))batch.refreshAt=Date.now()+QUEST_WAIT;save();refreshLobby();if(q.kind==='core'&&!playing)closeModal();else quests();toast('QUEST COMPLETE! '+message);sfx('pickup');return true}
// Retire the old three lifetime quests and their claim endpoint.
claim=function(){quests()};
let questMatch={damage:0,supers:0},questMatchAccount=null;
const questStart=start;start=function(){questState();questMatch={damage:0,supers:0};questMatchAccount=saved.accountId;questStart()};
const questHurt=hurt;hurt=function(a,n,owner){let hp=a.hp,eligible=playing&&!practice&&owner===player&&a!==player;questHurt(a,n,owner);if(eligible&&hp>0)questMatch.damage+=Math.max(0,Math.min(hp,hp-a.hp))};
const questSuper=superAttack;superAttack=function(){let before=charge;questSuper();if(playing&&!practice&&before>=100&&charge<before)questMatch.supers++};
function recordQuestMatch(rank,kills,damage,supers){let metrics={matches:1,kills,damage:Math.floor(damage),supers,top5:rank<=5?1:0,top3:rank<=3?1:0,top2:rank<=2?1:0,wins:rank===1?1:0,bigWins:rank===1&&kills>=5?1:0};for(let q of questState().items)if(!q.claimed)q.progress=Math.min(q.goal,q.progress+(metrics[q.metric]||0));save()}
const questFinish=finish;finish=function(win){let valid=playing&&!practice&&questMatchAccount===saved.accountId,before=saved.matches,rank=win?1:actors.filter(a=>a.alive).length+1,kills=ko;questFinish(win);if(valid&&saved.matches===before+1)recordQuestMatch(rank,kills,questMatch.damage,questMatch.supers)};
setInterval(()=>{if($('modal').hidden||!document.getElementById('questCountdown'))return;let before=saved.questBatch;questState();if(before!==saved.questBatch)quests();else $('questCountdown').textContent=questTimeLeft()},1000);
questState();save();

const questNavButton=document.querySelector('.right-rail button[onclick="quests()"]');
const questFreeBadge=document.createElement('i');questFreeBadge.id='questFreeBadge';questFreeBadge.className='quest-free-tag';questFreeBadge.textContent='FREE';questFreeBadge.hidden=true;if(questNavButton)questNavButton.appendChild(questFreeBadge);
function updateQuestFreeBadge(){let available=questState().items.some(q=>!q.claimed&&q.progress>=q.goal);questFreeBadge.hidden=!available;return available}
const questBadgeRefresh=refreshLobby;refreshLobby=function(){questBadgeRefresh();updateQuestFreeBadge()};
const questBadgeRecord=recordQuestMatch;recordQuestMatch=function(...args){questBadgeRecord(...args);updateQuestFreeBadge()};
updateQuestFreeBadge();
