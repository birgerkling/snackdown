// Highest calorie badge replaces its predecessor. Ranked badges form a permanent collection.
const OG_AWARD_CUTOFF=Date.parse('2026-11-08T00:00:00+01:00');
const CALORIE_AWARDS=Array.from({length:100},(_,i)=>({id:'calorie-'+(i+1)*1000,family:'calories',amount:(i+1)*1000,name:(i+1)+'K Calorie Champion',short:(i+1)+'K CAL',kind:'fire',color:'hsl('+(39+Math.floor(i/10)*25)+' 85% 73%)',description:'Reach '+((i+1)*1000).toLocaleString('en-US')+' total calories on Calorie Road.'}));
const RANK_AWARDS=RANKED_TIERS.map((tier,index)=>({id:'ranked-'+tier.name.toLowerCase(),family:'ranked',name:tier.name[0]+tier.name.slice(1).toLowerCase()+' Chef',short:tier.name,kind:'rank',color:tier.color,amount:tier.min,rankIndex:index,description:'Reach '+tier.name+' or higher in Ranked Kitchen.'}));
const OG_PLAYER_AWARD={id:'og-player',family:'legacy',name:'OG Player',short:'OG',kind:'og',color:'#d3a0ff',description:'An account created during the final five days of Halloween or earlier — before November 8, 2026 at 00:00 CET.'};
const KITCHEN_AWARDS=[...CALORIE_AWARDS,...RANK_AWARDS,OG_PLAYER_AWARD];
function awardCreationTime(profile,data=profile?.data){
 let dates=[profile?.createdAt,data?.accountCreatedAt].map(v=>typeof v==='string'?Date.parse(v):Number(v)).filter(v=>Number.isFinite(v)&&v>=1577836800000&&v<4102444800000);
 let match=/^chef-([0-9a-z]+)-/i.exec(profile?.id||data?.accountId||'');
 if(match){let date=parseInt(match[1],36);if(date>=1577836800000&&date<4102444800000)dates.push(date)}
 return dates.length?Math.min(...dates):null;
}
function highestCalorieAward(earned=saved.awards||{}){return [...CALORIE_AWARDS].reverse().find(a=>earned[a.id])||null}
function highestRankAward(earned=saved.awards||{}){return [...RANK_AWARDS].reverse().find(a=>earned[a.id])||RANK_AWARDS[0]}
function awardCalorieBest(data=saved){return Math.max(0,Number(data.calories)||0,Number(data.calorieRoadBest)||0,highestCalorieAward(data.awards)?.amount||0)}
function awardRankBest(data=saved){return Math.max(0,Number(data.ranked?.elo)||0,Number(data.ranked?.best)||0,Number(data.chefCardAchievements?.rankedElo)||0,...RANK_AWARDS.filter(a=>data.awards?.[a.id]).map(a=>a.amount))}
function syncKitchenAwards(data=saved,profile=accountBook.profiles.find(p=>p.id===data.accountId)){
 if(!data.awards||typeof data.awards!=='object'||Array.isArray(data.awards))data.awards={};
 let created=awardCreationTime(profile,data);if(created!==null){data.accountCreatedAt=created;if(profile)profile.createdAt=created}
 let now=Date.now(),calorieLevel=Math.min(100,Math.floor(awardCalorieBest(data)/1000)),current=calorieLevel?CALORIE_AWARDS[calorieLevel-1]:null;
 for(let award of CALORIE_AWARDS)if(award.id!==current?.id)delete data.awards[award.id];
 if(current&&!data.awards[current.id])data.awards[current.id]=now;
 let rankedBest=awardRankBest(data);for(let award of RANK_AWARDS)if(rankedBest>=award.amount&&!data.awards[award.id])data.awards[award.id]=now;
 if(created!==null&&created<OG_AWARD_CUTOFF&&!data.awards[OG_PLAYER_AWARD.id])data.awards[OG_PLAYER_AWARD.id]=now;
 return data.awards;
}
function kitchenAwardIcon(award){
 let flame='<path d="M32 12c4 10 15 13 13 26-1 10-7 16-15 15-13-1-18-14-12-23 1 7 5 8 7 3 2-5 1-12 7-21Z" fill="currentColor"/><path d="M31 34c-6 8-5 15 1 15s9-7-1-15Z" fill="#fff5b8"/>';
 let diamond='<path d="m15 26 9-11h16l9 11-17 24Z" fill="currentColor"/><path d="m15 26 34 0M24 15l-3 11 11 24 11-24-3-11M21 26h22" fill="none" stroke="#f4ffff" stroke-width="2"/>';
 let fork='<path d="M23 16v12m9-12v12m9-12v12M23 24v6c0 10 18 10 18 0v-6M32 39v13" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>';
 let crown='<path d="m15 24 8 5 9-14 9 14 8-5-4 18H19Z" fill="currentColor"/><path d="M21 46h22" stroke="currentColor" stroke-width="4"/><circle cx="32" cy="32" r="4" fill="#fff1b0"/>';
 let symbol=award.kind==='fire'?flame:award.kind==='rank'?(award.rankIndex>=4?diamond:fork):crown;
 let inscription=award.kind==='fire'?'<rect x="15" y="49" width="34" height="13" rx="4" fill="#13192e"/><text x="32" y="59" text-anchor="middle" fill="currentColor" font-size="10" font-family="sans-serif" font-weight="900">'+award.amount/1000+'K</text>':award.kind==='rank'&&award.rankIndex>=5?'<path d="m9 17 5-8 4 5m28 0 4-5 5 8" fill="none" stroke="currentColor" stroke-width="2"/>':'';
 return '<svg viewBox="0 0 64 68" aria-hidden="true"><path d="M32 3 57 14v25L47 54 32 64 17 54 7 39V14Z" fill="#151b31" stroke="currentColor" stroke-width="3"/><path d="m32 7 20 10v21L43 51 32 58 21 51 12 38V17Z" fill="currentColor" opacity=".13"/>'+symbol+inscription+'</svg>';
}
const kitchenAwardDock=document.querySelector('.lobby-top .top-spacer');
if(kitchenAwardDock){kitchenAwardDock.id='awardsDock';kitchenAwardDock.classList.add('awards-dock');kitchenAwardDock.setAttribute('aria-label','Your awards')}
function renderKitchenAwards(){
 let earned=syncKitchenAwards();if(!kitchenAwardDock)return;let featured=[highestCalorieAward(earned)||CALORIE_AWARDS[0],highestRankAward(earned),OG_PLAYER_AWARD];
 kitchenAwardDock.innerHTML='<small class="awards-caption">AWARDS</small>'+featured.map(a=>'<button class="award-medal '+(earned[a.id]?'earned':'locked')+'" style="--award-color:'+a.color+'" onclick="awardsMenu()" title="'+a.name+' · '+(earned[a.id]?'UNLOCKED':'LOCKED')+'" aria-label="'+a.name+' award, '+(earned[a.id]?'unlocked':'locked')+'">'+kitchenAwardIcon(a)+'<span>'+a.short+'</span></button>').join('');
}
function kitchenAwardCard(a,value,earned=saved.awards||{}){return '<div class="award-card '+(earned[a.id]?'earned':'locked')+'" style="--award-color:'+a.color+'"><div class="award-showcase">'+kitchenAwardIcon(a)+'</div><div><small>'+(earned[a.id]?'UNLOCKED ✓':'LOCKED')+'</small><h2>'+a.name+'</h2><p>'+a.description+'</p><strong>'+value+'</strong></div></div>'}
function awardsMenu(){
 let earned=syncKitchenAwards(),current=highestCalorieAward(earned),next=CALORIE_AWARDS[current?current.amount/1000:0],best=awardCalorieBest(),rankBest=awardRankBest(),profile=accountBook.profiles.find(p=>p.id===saved.accountId),created=awardCreationTime(profile,saved);
 let currentCard=current||CALORIE_AWARDS[0],calorieProgress=next?'<div class="award-next"><small>NEXT CALORIE AWARD</small><b>'+next.short+' · '+Math.max(0,next.amount-best).toLocaleString('en-US')+' CALORIES TO GO</b><div class="progress" role="progressbar" aria-label="Next calorie award" aria-valuemin="0" aria-valuemax="1000" aria-valuenow="'+Math.min(1000,Math.max(0,best-(current?.amount||0)))+'"><i style="width:'+Math.min(100,Math.max(0,(best-(current?.amount||0))/10))+'%"></i></div></div>':'<div class="award-next award-max"><b>100K · MAX CALORIE AWARD</b><small>You reached the final milestone. Keep cooking!</small></div>';
 let milestones='<details class="award-milestones"><summary>ALL 100 CALORIE MILESTONES · 1K–100K</summary><div class="award-milestone-grid">'+CALORIE_AWARDS.map(a=>'<span class="'+(current?.id===a.id?'current':current&&a.amount<current.amount?'upgraded':'locked')+'" title="'+(current?.id===a.id?'YOUR CURRENT AWARD':current&&a.amount<current.amount?'REPLACED BY '+current.short:a.description)+'">'+a.amount/1000+'K'+(current?.id===a.id?' ★':'')+'</span>').join('')+'</div></details>';
 let joined=created?'ACCOUNT CREATED · '+new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Stockholm',day:'numeric',month:'short',year:'numeric'}).format(created):'NO CREATION DATE AVAILABLE';
 modal('<section class="awards-heading"><div class="eyebrow">YOUR KITCHEN LEGACY</div><h1>AWARDS</h1><p>Your highest badges from each category appear in the lobby.</p></section><section class="award-family"><div class="eyebrow">ONE BADGE · ALWAYS YOUR HIGHEST</div><h2>CALORIE AWARDS</h2><p>A new badge every 1,000 total calories, up to 100,000. Each new calorie award replaces the old one. Losses never downgrade your badge.</p>'+kitchenAwardCard(currentCard,Math.min(currentCard.amount,best).toLocaleString('en-US')+' / '+currentCard.amount.toLocaleString('en-US')+' TOTAL CALORIES',earned)+calorieProgress+milestones+'</section><section class="award-family"><div class="eyebrow">'+RANK_AWARDS.filter(a=>earned[a.id]).length+' / '+RANK_AWARDS.length+' COLLECTED</div><h2>RANKED AWARDS</h2><p>One for every rank. Keep every earned Ranked badge; your highest is displayed above your snack.</p><div class="award-rank-grid">'+RANK_AWARDS.map(a=>kitchenAwardCard(a,a.amount===0?'STARTER RANK · 0 ELO':Math.min(a.amount,rankBest)+' / '+a.amount+' BEST ELO',earned)).join('')+'</div></section><section class="award-family"><h2>LEGACY AWARD</h2>'+kitchenAwardCard(OG_PLAYER_AWARD,joined,earned)+'</section><p class="award-footnote">Awards are cosmetic and saved separately for each account on this browser. They never give resources or gameplay bonuses.</p>');
}
const kitchenAwardsSave=save;save=function(...args){syncKitchenAwards();return kitchenAwardsSave(...args)};
const kitchenAwardsRefresh=refreshLobby;refreshLobby=function(...args){let result=kitchenAwardsRefresh(...args);renderKitchenAwards();return result};
for(let profile of accountBook.profiles)if(!isDevAccount(profile))syncKitchenAwards(profile.data,profile);
SNACKDOWN_UPDATES.unshift({date:'November 5, 2026',label:'LATEST UPDATE',items:[{icon:'🏅',title:'Awards: all the way to 100K',text:'Every 1,000 total calories upgrades your calorie badge, up to 100K. Only your highest calorie award is kept. All eight Ranked ranks now have their own permanent badge, from Wood to Rubin. The lobby displays your highest calorie and Ranked badges alongside OG Player.'}]});
save();refreshLobby();
