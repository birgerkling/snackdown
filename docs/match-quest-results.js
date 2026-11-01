let matchQuestReceipt=null;
const resultQuestEvent=recordQuestEvent;
recordQuestEvent=function(event){
 let batch=questState(),before=new Map(batch.items.map(q=>[q.id,q.progress]));
 let result=resultQuestEvent(event);
 if(!event||!['solo','ranked'].includes(event.mode))return result;
 let changes=questState().items.filter(q=>before.has(q.id)&&q.progress>before.get(q.id)).map(q=>({id:q.id,title:q.title,description:q.description,goal:q.goal,before:before.get(q.id),after:q.progress,completed:q.progress>=q.goal}));
 changes.sort((a,b)=>Number(b.completed)-Number(a.completed));
 matchQuestReceipt={account:saved.accountId,token:matchToken,mode:event.mode,changes};
 if(event.mode==='solo'&&!resultsScreen.hidden)renderMatchQuestResults();
 return result;
};
function matchQuestMarkup(receipt){
 let number=n=>Math.round(n).toLocaleString('en-US');
 return `<div class="match-quest-heading">☑ QUEST PROGRESS</div><div class="match-quest-items">${receipt.changes.map(q=>`<div class="match-quest-item ${q.completed?'quest-done':''}"><strong>${accountEscape(q.title)}</strong><small>${q.completed?'✓ COMPLETED · READY TO CLAIM':'+'+number(q.after-q.before)+' THIS MATCH'}</small><div class="match-quest-track"><i style="width:${Math.min(100,q.after/q.goal*100)}%"></i></div><span>${number(q.before)} → <b>${number(q.after)}</b> / ${number(q.goal)}</span></div>`).join('')||'<p>No quest progress this match.</p>'}</div>`;
}
function renderMatchQuestResults(){
 document.getElementById('matchQuestResults')?.remove?.();
 let receipt=matchQuestReceipt;
 if(!receipt||receipt.account!==saved.accountId||receipt.token!==matchToken||receipt.mode!=='solo')return;
 resultsScreen.insertAdjacentHTML('beforeend',`<section id="matchQuestResults" class="match-quest-results" aria-label="Quest progress this match">${matchQuestMarkup(receipt)}</section>`);
}
const questsCalorieResults=showCalorieResults;
showCalorieResults=function(...args){questsCalorieResults(...args);renderMatchQuestResults()};
const questsRankedComplete=completeRankedMatch;
completeRankedMatch=function(...args){
 let result=questsRankedComplete(...args),receipt=matchQuestReceipt;
 if(receipt?.mode==='ranked'&&receipt.account===saved.accountId&&receipt.token===matchToken&&!playing&&!$('modal').hidden){
  document.getElementById('rankedQuestResults')?.remove?.();
  $('content').insertAdjacentHTML('beforeend',`<section id="rankedQuestResults" class="ranked-quest-results">${matchQuestMarkup(receipt)}</section>`);
 }
 return result;
};
const questsResultStart=start;
start=function(...args){matchQuestReceipt=null;return questsResultStart(...args)};
