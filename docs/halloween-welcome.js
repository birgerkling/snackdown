// Event introduction is shown once per account for this event.
const HALLOWEEN_WELCOME_ID="haunted-harvest-1";
function showHalloweenWelcome(){
if(HALLOWEEN_EVENT_ACTIVE) $('newLobby').classList.add('halloween-lobby');
if(HALLOWEEN_EVENT_ACTIVE&&saved.halloweenWelcomeSeen!==HALLOWEEN_WELCOME_ID){
 saved.halloweenWelcomeSeen=HALLOWEEN_WELCOME_ID;save();
 $('newLobby').classList.add('halloween-lobby');
 const welcome=document.createElement('section');welcome.id='halloweenWelcome';welcome.setAttribute('role','dialog');welcome.setAttribute('aria-modal','true');welcome.setAttribute('aria-labelledby','halloweenWelcomeTitle');
 welcome.innerHTML=`<div class="halloween-welcome-card"><div class="halloween-welcome-art"><img src="assets/pumpkin.png" alt="Pumpkin, the limited Halloween mobile tank"><span>LIMITED HALLOWEEN EVENT</span></div><div class="halloween-welcome-copy"><div class="eyebrow">THE HAUNTED HARVEST IS HERE</div><h1 id="halloweenWelcomeTitle">WELCOME BACK,<br>CHEF!</h1><p class="welcome-lead">The kitchen just got spooky. Team up, build a streak and meet Pumpkin!</p><ol><li><b>2V2 HALLOWEEN KNOCKOUT</b><span>First team to win 2 rounds wins the match. Three pumpkins track your rounds.</span></li><li><b>BUILD YOUR WIN STREAK</b><span>Odd streaks give Candy equal to your streak: 1, 3, 5… Even streaks give one normal Core. A loss resets your streak.</span></li><li><b>5 CANDY = 1 PUMPKIN CORE</b><span>Start with 3–5 presses and a 42% upgrade chance. Each upgrade adds a press.</span></li><li><b>DARE TO GO SCARY?</b><span>Legendary keeps its presses! Each press has a 10% chance to turn Scary and guarantee Pumpkin if you do not own him. Pumpkin duplicates give shards with 20% extra.</span></li></ol><p class="welcome-footnote">Pumpkin is a limited mobile tank. Event matches do not change your Elo or calories.</p><button class="cta" id="halloweenWelcomeContinue">LET’S GET SPOOKY!</button></div></div>`;
 document.body.appendChild(welcome);
 let welcomePaused=false,previousFocus=document.activeElement;
 if(playing&&!paused){paused=true;welcomePaused=true}
 function dismissHalloweenWelcome(){welcome.remove();if(welcomePaused&&playing)paused=false;previousFocus?.focus?.()}
 welcome.querySelector('button').onclick=dismissHalloweenWelcome;
 welcome.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();dismissHalloweenWelcome()}else if(e.key==='Tab'){e.preventDefault();welcome.querySelector('button').focus()}});
 welcome.querySelector('button').focus();
}

}
showHalloweenWelcome();

