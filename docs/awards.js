// Permanent, account-specific badges. No currencies or gameplay bonuses.
const OG_AWARD_CUTOFF=Date.parse('2026-11-08T00:00:00+01:00');
const KITCHEN_AWARDS=[
 {id:'calorie-1000',name:'Calorie Champion',short:'1K CAL',kind:'fire',color:'#ffbd62',description:'Reach 1,000 total calories on Calorie Road.'},
 {id:'ranked-diamond',name:'Diamond Chef',short:'DIAMOND',kind:'diamond',color:'#8ceaff',description:'Reach Diamond or higher in Ranked Kitchen.'},
 {id:'og-player',name:'OG Player',short:'OG',kind:'og',color:'#d3a0ff',description:'An account created during the final five days of Halloween or earlier — before November 8, 2026 at 00:00 CET.'}
];
function awardCreationTime(profile,data=profile?.data){
 let dates=[profile?.createdAt,data?.accountCreatedAt].map(v=>typeof v==='string'?Date.parse(v):Number(v)).filter(v=>Number.isFinite(v)&&v>=1577836800000&&v<4102444800000);
 let match=/^chef-([0-9a-z]+)-/i.exec(profile?.id||data?.accountId||'');
 if(match){let date=parseInt(match[1],36);if(date>=1577836800000&&date<4102444800000)dates.push(date)}
 return dates.length?Math.min(...dates):null;
}
function syncKitchenAwards(data=saved,profile=accountBook.profiles.find(p=>p.id===data.accountId)){
 data.awards??={};let created=awardCreationTime(profile,data);if(created!==null){data.accountCreatedAt=created;if(profile)profile.createdAt=created}
 let diamond=RANKED_TIERS.find(t=>t.name==='DIAMOND').min;
 let earned=[Math.max(Number(data.calories)||0,Number(data.calorieRoadBest)||0)>=1000,Math.max(Number(data.ranked?.elo)||0,Number(data.ranked?.best)||0,Number(data.chefCardAchievements?.rankedElo)||0)>=diamond,created!==null&&created<OG_AWARD_CUTOFF];
 KITCHEN_AWARDS.forEach((award,i)=>{if(earned[i]&&!data.awards[award.id])data.awards[award.id]=Date.now()});return data.awards;
}
function kitchenAwardIcon(award){
 let symbol=award.kind==='fire'?'<path d="M32 12c4 10 15 13 13 26-1 10-7 16-15 15-13-1-18-14-12-23 1 7 5 8 7 3 2-5 1-12 7-21Z" fill="currentColor"/><path d="M31 34c-6 8-5 15 1 15s9-7-1-15Z" fill="#fff5b8"/>':award.kind==='diamond'?'<path d="m15 26 9-11h16l9 11-17 24Z" fill="currentColor"/><path d="m15 26 34 0M24 15l-3 11 11 24 11-24-3-11M21 26h22" fill="none" stroke="#f4ffff" stroke-width="2"/>':'<path d="m15 24 8 5 9-14 9 14 8-5-4 18H19Z" fill="currentColor"/><path d="M21 46h22" stroke="currentColor" stroke-width="4"/><circle cx="32" cy="32" r="4" fill="#fff1b0"/>';
 return '<svg viewBox="0 0 64 68" aria-hidden="true"><path d="M32 3 57 14v25L47 54 32 64 17 54 7 39V14Z" fill="#151b31" stroke="currentColor" stroke-width="3"/><path d="m32 7 20 10v21L43 51 32 58 21 51 12 38V17Z" fill="currentColor" opacity=".13"/>'+symbol+'</svg>';
}
const kitchenAwardDock=document.querySelector('.lobby-top .top-spacer');
if(kitchenAwardDock){kitchenAwardDock.id='awardsDock';kitchenAwardDock.classList.add('awards-dock');kitchenAwardDock.setAttribute('aria-label','Your awards')}
function renderKitchenAwards(){
 let earned=syncKitchenAwards();if(!kitchenAwardDock)return;
 kitchenAwardDock.innerHTML='<small class="awards-caption">AWARDS · '+KITCHEN_AWARDS.filter(a=>earned[a.id]).length+'/3</small>'+KITCHEN_AWARDS.map(a=>'<button class="award-medal '+(earned[a.id]?'earned':'locked')+'" style="--award-color:'+a.color+'" onclick="awardsMenu()" title="'+a.name+' · '+(earned[a.id]?'UNLOCKED':'LOCKED')+'" aria-label="'+a.name+' award, '+(earned[a.id]?'unlocked':'locked')+'">'+kitchenAwardIcon(a)+'<span>'+a.short+'</span></button>').join('');
}
function awardsMenu(){
 let earned=syncKitchenAwards(),profile=accountBook.profiles.find(p=>p.id===saved.accountId),created=awardCreationTime(profile,saved),diamond=RANKED_TIERS.find(t=>t.name==='DIAMOND').min;
 let values=[Math.min(1000,Math.max(saved.calories||0,saved.calorieRoadBest||0))+' / 1,000 TOTAL CALORIES',Math.min(diamond,Math.max(saved.ranked?.elo||0,saved.ranked?.best||0,saved.chefCardAchievements?.rankedElo||0))+' / '+diamond+' BEST ELO',created?'ACCOUNT CREATED · '+new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Stockholm',day:'numeric',month:'short',year:'numeric'}).format(created):'NO CREATION DATE AVAILABLE'];
 modal('<section class="awards-heading"><div class="eyebrow">YOUR KITCHEN LEGACY</div><h1>AWARDS</h1><p>Earned automatically. Kept forever on this account.</p></section><div class="award-collection">'+KITCHEN_AWARDS.map((a,i)=>'<div class="award-card '+(earned[a.id]?'earned':'locked')+'" style="--award-color:'+a.color+'"><div class="award-showcase">'+kitchenAwardIcon(a)+'</div><div><small>'+(earned[a.id]?'UNLOCKED ✓':'LOCKED')+'</small><h2>'+a.name+'</h2><p>'+a.description+'</p><strong>'+values[i]+'</strong></div></article>').join('')+'</div><p class="award-footnote">Awards are cosmetic badges. Calorie and Ranked awards stay unlocked after losses. Progress and Awards are saved separately for each account on this browser.</p>');
}
const kitchenAwardsSave=save;save=function(...args){syncKitchenAwards();return kitchenAwardsSave(...args)};
const kitchenAwardsRefresh=refreshLobby;refreshLobby=function(...args){let result=kitchenAwardsRefresh(...args);renderKitchenAwards();return result};
for(let profile of accountBook.profiles)if(!isDevAccount(profile))syncKitchenAwards(profile.data,profile);
SNACKDOWN_UPDATES.unshift({date:'November 5, 2026',label:'LATEST UPDATE',items:[{icon:'🏅',title:'Awards above the kitchen',text:'Your lobby now displays permanent Awards: 1,000 total calories, Diamond Ranked and OG Player for accounts created before the Halloween deadline. Tap a badge to see your collection and requirements. Each account keeps its own Awards.'}]});
save();refreshLobby();
