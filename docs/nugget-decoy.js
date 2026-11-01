TOPPINGS[0]={name:'Crunch Decoy',note:'Leave a crispy double with 1,000 HP (2,000 at power 5). It distracts nearby enemy bots for 3 seconds, then explodes for 600 damage (1,200 at power 5). Destroying it triggers the explosion early.'};
let nuggetDecoys=[];
function spawnNuggetDecoy(owner){
 nuggetDecoys=nuggetDecoys.filter(d=>d.owner!==owner);
 let factor=owner===player?1+(saved.levels[0]||0)*.2:owner.levelMultiplier||1;
 let decoy={owner,skinId:actorSkinDefinition(owner)?.id||null,team:owner.team,food:0,x:owner.x,y:owner.y,hp:1000*factor,max:1000*factor,damage:600*factor,age:0,life:3,alive:true,lastHit:elapsed};
 nuggetDecoys.push(decoy);fxEmit(decoy.x,decoy.y,18,'crumb','#ffcf72',.8);
 return decoy;
}
function nuggetDecoyImage(decoy){
 let costume=decoy.skinId&&skinImages[decoy.skinId];
 return costume?.complete&&costume.naturalWidth?costume:spriteImages[0];
}
function nuggetDecoyTarget(bot,fallback){
 let lure=nuggetDecoys.filter(d=>d.alive&&isEnemy(bot,d.owner)&&dist(bot,d)<400&&lineClear(bot,d)).sort((a,b)=>dist(bot,a)-dist(bot,b))[0];
 bot.crunchDecoyTarget=lure||null;
 return lure||fallback;
}
function explodeNuggetDecoy(decoy){
 if(!decoy.alive)return;decoy.alive=false;
 fxEmit(decoy.x,decoy.y,28,'crumb','#ffcd64',1.2);
 rings.push({x:decoy.x,y:decoy.y,r:15,max:160,life:.45,color:'#ffe1a0'});
 let prior=statusTick;statusTick=true;
 try{for(let enemy of actors)if(enemy.alive&&isEnemy(decoy.owner,enemy)&&dist(enemy,decoy)<=160&&lineClear(decoy,enemy))hurt(enemy,decoy.damage,decoy.owner)}finally{statusTick=prior}
 sfx('hit');
}
function damageNuggetDecoy(decoy,damage){if(!decoy.alive)return;decoy.hp-=damage;decoy.lastHit=elapsed;if(decoy.hp<=0)explodeNuggetDecoy(decoy)}
function hitNuggetDecoy(shot){
 let decoy=nuggetDecoys.find(d=>d.alive&&isEnemy(shot.owner,d.owner)&&dist(shot,d)<30);
 if(!decoy)return false;damageNuggetDecoy(decoy,shot.damage);return true;
}
const decoyShoot=shoot;
shoot=function(actor,angle,superShot=false){
 let decoy=nuggetDecoys.find(d=>d.alive&&isEnemy(actor,d.owner)&&dist(actor,d)<(actor.food===1?145:220)&&lineClear(actor,d)&&Math.abs(Math.atan2(Math.sin(Math.atan2(d.y-actor.y,d.x-actor.x)-angle),Math.cos(Math.atan2(d.y-actor.y,d.x-actor.x)-angle)))<.4);
 let ready=actor.cd<=0&&(actor!==player||ammo>0),prior=actor.cd;
 decoyShoot(actor,angle,superShot);
 if(decoy&&[1,9].includes(actor.food)&&!superShot&&ready&&actor.cd>prior)damageNuggetDecoy(decoy,actor===player?stats(actor.food).damage:foods[actor.food].damage*(actor.levelMultiplier||1));
};
const decoyBerry=detonateBerry;
detonateBerry=function(bomb){for(let d of nuggetDecoys)if(d.alive&&isEnemy(bomb.owner,d.owner)&&dist(d,bomb)<=bomb.radius&&lineClear(bomb,d))damageNuggetDecoy(d,bomb.damage);decoyBerry(bomb)};
const decoyUpdate=update;
update=function(dt){let before=elapsed;decoyUpdate(dt);if(!playing||paused||countdown>0)return;let step=Math.max(0,elapsed-before);for(let d of nuggetDecoys){if(!d.alive)continue;d.age+=step;if(d.age>=d.life)explodeNuggetDecoy(d)}nuggetDecoys=nuggetDecoys.filter(d=>d.alive)};
const decoyDraw=draw;
draw=function(){decoyDraw();if(!nuggetDecoys.length)return;ctx.save();ctx.scale(scale,scale);ctx.translate(-cam.x,-cam.y);for(let d of nuggetDecoys){if(!d.alive)continue;ctx.save();ctx.translate(d.x,d.y);ellipse(0,17,33,13,'#33223c66');ctx.globalAlpha=.78;ctx.shadowColor='#ffdf88';ctx.shadowBlur=18;let image=nuggetDecoyImage(d);if(image?.complete&&image.naturalWidth)ctx.drawImage(image,-38,-62,76,86);else rounded(-26,-44,52,61,18,'#edaf4d','#ffe4a5',3);ctx.shadowBlur=0;ctx.globalAlpha=1;rounded(-26,-74,52,6,3,'#322c3c',null);rounded(-26,-74,52*Math.max(0,d.hp/d.max),6,3,'#ffd466',null);ctx.fillStyle='#ffe3a7';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText('DECOY · '+Math.ceil(d.life-d.age)+'s',0,-83);ctx.restore()}ctx.restore()};
const decoyStart=start;start=function(...args){nuggetDecoys=[];return decoyStart(...args)};
const decoyHome=home;home=function(...args){nuggetDecoys=[];return decoyHome(...args)};
const decoyRankedRound=startRankedRound;startRankedRound=function(...args){nuggetDecoys=[];return decoyRankedRound(...args)};

// A lured bot commits to the decoy rather than keeping its normal firing distance.
function crunchDecoyApproach(bot,target,stormRadius,dx,dy,dt){
 if(!target||!nuggetDecoys.includes(target)||!target.alive||!isEnemy(bot,target.owner)||dt<=0||dist(bot,{x:W/2,y:H/2})>stormRadius-110)return {x:dx,y:dy};
 let distance=dist(bot,target),speed=Math.hypot(dx,dy),remaining=Math.max(0,distance-8),travel=foods[bot.food].speed*.9*speed*dt;
 let amount=speed*Math.min(1,remaining/Math.max(.001,travel));
 return distance?{x:(target.x-bot.x)/distance*amount,y:(target.y-bot.y)/distance*amount}:{x:0,y:0};
}
const decoyNavigation=botNavigationInput;
botNavigationInput=function(bot,target,radius,dx,dy,dt){let input=crunchDecoyApproach(bot,target,radius,dx,dy,dt);return decoyNavigation(bot,target,radius,input.x,input.y,dt)};
const decoyRankedSteering=rankedBotSteering;
rankedBotSteering=function(bot,dx,dy,dt){if(bot.crunchDecoyTarget?.alive&&nuggetDecoys.includes(bot.crunchDecoyTarget))return {x:dx,y:dy};return decoyRankedSteering(bot,dx,dy,dt)};
