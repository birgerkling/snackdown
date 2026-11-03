const PUMPKIN=10;
foods.push({name:'Pumpkin',retired:true,emoji:'🎃',role:'The Haunted Vanguard',hp:6000,speed:225,damage:900,color:'#ff9a38',charge:20,range:330,attack:'VINE HOOK',super:'HARVEST ROLL'});
rarity.push('LIMITED');unlockXP.push(Infinity);blueCharacterPrices.push(Infinity);attacks.push('VINE HOOK');supers.push('HARVEST ROLL');
descriptions.push('A mobile Halloween tank. Vine Hook deals 900 damage (1,800 at level 5) and pulls enemies slightly closer. Three ammo, 1 second reload. Five hits charge Harvest Roll: roll up to 360 units, stopping at walls, dealing 1,400 damage (2,800 at level 5) once per enemy and gaining 25% damage reduction for 2 seconds.');foods[PUMPKIN].description=descriptions[PUMPKIN];
TOPPINGS.push({name:'BOO!',note:'Scare nearby enemies into running away for 1 second. Frightened enemies cannot attack or use their Super. Walls block the scare. 10 second cooldown.'});
SEASONINGS.push({name:'Thick Rind',note:'Move 20% faster while below 50% health.'});
MASTER_TITLES.push('Pumpkin Spice');HIGHER_MASTER_TITLES.push(['Harvest Hero','Hollow King','The Last Lantern']);SNACK_ANIMATION_PROFILES.push({walk:.065,attack:.25,super:.3,color:'#ffa348'});
function normalizePumpkin(){saved.levels[PUMPKIN]??=0;saved.snackCalories[PUMPKIN]??=0}
normalizePumpkin();spriteImages[PUMPKIN]=new Image();spriteImages[PUMPKIN].onload=()=>refreshLobby();spriteImages[PUMPKIN].src='assets/pumpkin.png';
const pumpkinFresh=initialProgress;initialProgress=function(){let p=pumpkinFresh();p.levels[PUMPKIN]=0;p.snackCalories[PUMPKIN]=0;return p};
const pumpkinRefresh=refreshLobby;refreshLobby=function(...args){normalizePumpkin();return pumpkinRefresh(...args)};
// A limited, event-only snack must not lock an existing restaurant out of Serving.
allSnacksOwned=function(){return snackRosterReady&&foods.every((_,i)=>rarity[i]==='LIMITED'||isSnackUnlocked(i))};
const pumpkinPortrait=portrait;portrait=function(i,cls=''){return i===PUMPKIN?`<img class="snack-art ${cls}" src="assets/pumpkin.png" alt="Pumpkin" draggable="false">`:pumpkinPortrait(i,cls)};
const pumpkinRoster=roster;roster=function(){pumpkinRoster();$('content').innerHTML=$('content').innerHTML.replaceAll('◆ Infinity BLUE','EVENT EXCLUSIVE')};
const pumpkinOffer=characterOffer;characterOffer=function(i){if(i!==PUMPKIN||isSnackUnlocked(i))return pumpkinOffer(i);modal(`<div class="eyebrow">HALLOWEEN · LIMITED SNACK</div><h1>Pumpkin</h1><div class="upgrade-layout">${portrait(PUMPKIN)}<div><p>${descriptions[PUMPKIN]}</p><p>Find Pumpkin in Pumpkin Cores. A Scary Pumpkin Core guarantees Pumpkin if you do not own him yet.</p><button class="cta" onclick="pumpkinCoresMenu()">PUMPKIN CORES</button><button class="text-button" onclick="trySnack(10)">TRY IN TRAINING →</button></div></div>`)};
const pumpkinBuy=buyCharacterWithShards;buyCharacterWithShards=function(i){if(i===PUMPKIN)return characterOffer(i);return pumpkinBuy(i)};
const pumpkinBuffs=buffs;buffs=function(){if(saved.selected!==PUMPKIN)return pumpkinBuffs();let s=stats(PUMPKIN);modal(`<div class="eyebrow">LIMITED · POWER ${saved.levels[PUMPKIN]}</div><h1>Pumpkin</h1><p>CLASS · ${foods[PUMPKIN].role}</p><div class="upgrade-layout">${portrait(PUMPKIN)}<div><p>${descriptions[PUMPKIN]}</p><div class="row">Health <b>${s.hp}</b></div><div class="row">VINE HOOK <b>${s.damage} DAMAGE</b></div><div class="row">Ammo / Reload <b>3 / 1 SEC</b></div><div class="row">Super charge <b>20% PER HIT · 5 HITS</b></div><button class="cta" onclick="upgrade()">UPGRADE</button><button class="text-button" onclick="trySnack(10)">TRY IN TRAINING →</button></div></div><div class="row"><div><b>TOPPING · BOO!</b><p>${TOPPINGS[PUMPKIN].note}</p></div><button class="cta" onclick="toppingsMenu()">TOPPINGS</button></div><div class="row"><div><b>SEASONING · Thick Rind</b><p>${SEASONINGS[PUMPKIN].note}</p></div><button class="cta" onclick="seasoningsMenu()">SEASONINGS</button></div>`)};
const pumpkinReload=ammoReloadTime;ammoReloadTime=function(food){return food===PUMPKIN?1:pumpkinReload(food)};
let pumpkinRolls=[];
function pumpkinFactor(a){return a===player?1+(saved.levels[PUMPKIN]||0)*.2:a.levelMultiplier||1}
const pumpkinShoot=shoot;shoot=function(a,angle,superShot=false){
 if(a.food!==PUMPKIN)return pumpkinShoot(a,angle,superShot);
 if(!playing||paused||countdown>0||!a.alive||a.cd>0||a===player&&ammo<1||pumpkinRolls.some(r=>r.owner===a))return;
 if(a===player)ammo--;a.cd=a===player?.5:rand(.95,1.35);a.angle=angle;
 let spec=attackProjectileSpec(PUMPKIN);shots.push({owner:a,x:a.x+Math.cos(angle)*spec.spawn,y:a.y+Math.sin(angle)*spec.spawn,vx:Math.cos(angle)*spec.speed,vy:Math.sin(angle)*spec.speed,angle,food:PUMPKIN,life:spec.life,damage:900*pumpkinFactor(a),pumpkinVine:true});animateSnackAction(a,'attack');fxEmit(a.x+Math.cos(angle)*40,a.y+Math.sin(angle)*40,6,'spark','#a7d86a',.5);sfx('shot');
};
function castHarvestRoll(a,angle,distance=330){
 pumpkinRolls.push({owner:a,angle,left:Math.max(90,Math.min(360,distance)),hit:new Set(),age:0});a.pumpkinShieldUntil=elapsed+2;
 animateSnackAction(a,'super');fxEmit(a.x,a.y,24,'crumb','#ff9c3e',1);sfx('super');
}
const pumpkinSuper=superAttack;superAttack=function(){if(player?.food!==PUMPKIN)return pumpkinSuper();if(!playing||paused||countdown>0||!player.alive||charge<100)return;charge=0;let distance=mouseAim?Math.hypot(aim.x/scale+cam.x-player.x,aim.y/scale+cam.y-player.y):330;castHarvestRoll(player,player.angle,distance);questMatch.supers++;toast('HARVEST ROLL!')};
const pumpkinBotSuper=rankedBotSuper;rankedBotSuper=function(a,target){if(a.food!==PUMPKIN)return pumpkinBotSuper(a,target);if(!a.alive||dist(a,target)>430)return;a.rankedCharge=0;castHarvestRoll(a,Math.atan2(target.y-a.y,target.x-a.x),dist(a,target)+60)};
const pumpkinTopping=activateTopping;activateTopping=function(){let before=toppingReadyAt;pumpkinTopping();if(player?.food===PUMPKIN&&toppingReadyAt>before)castPumpkinBoo(player)};toppingButton.onclick=activateTopping;
const pumpkinHurt=hurt;hurt=function(a,n,owner){
 let hp=a.hp,playerCharge=charge,botCharge=owner?.rankedCharge||0,main=owner?.food===PUMPKIN&&!statusTick&&isEnemy(owner,a);
 if(a.food===PUMPKIN&&owner&&isEnemy(a,owner))n*=a.pumpkinShieldUntil>elapsed?.75:1;
 pumpkinHurt(a,n,owner);
 if(main&&a.hp<hp){if(owner===player)charge=Math.min(100,playerCharge+20);else owner.rankedCharge=Math.min(100,botCharge+20);if(a.alive&&makiSlashClear(owner,a))for(let i=0;i<7&&dist(a,owner)>75;i++){let angle=Math.atan2(owner.y-a.y,owner.x-a.x),x=a.x+Math.cos(angle)*5,y=a.y+Math.sin(angle)*5;if(collision(x,y))break;a.x=x;a.y=y}}
};
const pumpkinMove=move;move=function(a,dx,dy,dt){if(pumpkinRolls.some(r=>r.owner===a))return;let passive=a.food===PUMPKIN&&a.hp<a.max*.5&&(a===player?hasSnackSeasoning(PUMPKIN):a.rankedAbilities),factor=passive?1.2:1;return pumpkinMove(a,dx*factor,dy*factor,dt)};
const pumpkinUpdate=update;update=function(dt){let before=elapsed;pumpkinUpdate(dt);let step=elapsed-before;if(!playing||paused||countdown>0||step<=0)return;for(let roll of pumpkinRolls){let a=roll.owner;if(!a.alive){roll.left=0;continue}roll.age+=step;let travel=Math.min(roll.left,850*step);while(travel>0){let amount=Math.min(8,travel),x=a.x+Math.cos(roll.angle)*amount,y=a.y+Math.sin(roll.angle)*amount;if(collision(x,y)||x<28||x>W-28||y<28||y>H-28){roll.left=0;break}a.x=x;a.y=y;roll.left-=amount;travel-=amount;let status=statusTick;statusTick=true;try{for(let enemy of actors)if(enemy.alive&&isEnemy(a,enemy)&&!roll.hit.has(enemy)&&dist(a,enemy)<bossContactRange(a,enemy,65)&&makiSlashClear(a,enemy)){roll.hit.add(enemy);hurt(enemy,1400*pumpkinFactor(a),a);enemy.slowUntil=elapsed+.7;enemy.slowFactor=.6}}finally{statusTick=status}fxEmit(a.x,a.y,1,'crumb','#e9a34b',.3)}}pumpkinRolls=pumpkinRolls.filter(r=>r.left>0&&r.owner.alive)};
const pumpkinAim=drawAttackAim;drawAttackAim=function(a){if(a.food!==PUMPKIN)return pumpkinAim(a);ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.angle);ctx.fillStyle='#c3f19c28';ctx.strokeStyle='#ddffd1aa';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(35,-14);ctx.lineTo(330,-27);ctx.lineTo(330,27);ctx.lineTo(35,14);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()};
const pumpkinDraw=draw;draw=function(){pumpkinDraw();ctx.save();ctx.scale(scale,scale);ctx.translate(-cam.x,-cam.y);for(let shot of shots)if(shot.pumpkinVine){ctx.strokeStyle='#83c66d';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(shot.x-Math.cos(shot.angle)*28,shot.y-Math.sin(shot.angle)*28);ctx.lineTo(shot.x,shot.y);ctx.stroke();ellipse(shot.x,shot.y,13,9,'#f6a849',shot.angle);ellipse(shot.x-3,shot.y-4,6,3,'#ffe6a6',shot.angle)}for(let a of actors)if(a.food===PUMPKIN&&a.alive&&a.pumpkinShieldUntil>elapsed){ctx.strokeStyle='#ffd676';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(a.x,a.y,45,50,0,0,Math.PI*2);ctx.stroke()}for(let r of pumpkinRolls){ctx.strokeStyle='#ffb453';ctx.lineWidth=4;ctx.beginPath();ctx.arc(r.owner.x,r.owner.y,43,r.age*12,r.age*12+Math.PI*1.5);ctx.stroke()}ctx.restore()};
const pumpkinStart=start;start=function(...args){pumpkinRolls=[];return pumpkinStart(...args)};
const pumpkinHome=home;home=function(...args){pumpkinRolls=[];return pumpkinHome(...args)};
refreshLobby();

