const PUMPKIN_BOO_RADIUS=260,PUMPKIN_BOO_DURATION=1;
let pumpkinBooWaves=[];
function castPumpkinBoo(owner){
 if(!owner.alive)return;
 for(let enemy of actors)if(enemy.alive&&isEnemy(owner,enemy)&&dist(owner,enemy)<=PUMPKIN_BOO_RADIUS&&makiSlashClear(owner,enemy)){enemy.pumpkinFearUntil=elapsed+PUMPKIN_BOO_DURATION;enemy.pumpkinFearAngle=Math.atan2(enemy.y-owner.y,enemy.x-owner.x)}
 pumpkinBooWaves.push({x:owner.x,y:owner.y,age:0});fxEmit(owner.x,owner.y,reducedFX?8:24,'spark','#c6a7ff',1);rings.push({x:owner.x,y:owner.y,r:20,max:PUMPKIN_BOO_RADIUS,life:.55,color:'#d8b4ff'});animateSnackAction(owner,'gadget');sfx('super');if(owner===player)toast('BOO!');
}
function isPumpkinFrightened(actor){return !!actor&&actor.pumpkinFearUntil>elapsed}
const booMove=move;move=function(a,dx,dy,dt){if(isPumpkinFrightened(a)){dx=Math.cos(a.pumpkinFearAngle);dy=Math.sin(a.pumpkinFearAngle);a.angle=a.pumpkinFearAngle}return booMove(a,dx,dy,dt)};
const booShoot=shoot;shoot=function(a,...args){if(isPumpkinFrightened(a))return;return booShoot(a,...args)};
const booSuper=superAttack;superAttack=function(...args){if(isPumpkinFrightened(player))return;return booSuper(...args)};
const booBotSuper=rankedBotSuper;rankedBotSuper=function(a,...args){if(isPumpkinFrightened(a))return;return booBotSuper(a,...args)};
const booBotAbilities=rankedBotAbilities;rankedBotAbilities=function(a){
 if(a.food!==PUMPKIN)return booBotAbilities(a);
 if(isPumpkinFrightened(a))return;
 let enemies=actors.filter(b=>b.alive&&isEnemy(a,b)).sort((b,c)=>dist(a,b)-dist(a,c)),target=enemies[0];if(!target)return;
 if(a.rankedCharge>=100)rankedBotSuper(a,target);
 if(!a.botTopping||elapsed<a.rankedToppingAt||!enemies.some(b=>dist(a,b)<=PUMPKIN_BOO_RADIUS&&makiSlashClear(a,b)))return;
 a.rankedToppingAt=elapsed+TOPPING_COOLDOWN;castPumpkinBoo(a);
};
const booUpdate=update;update=function(dt){let before=elapsed;booUpdate(dt);let step=elapsed-before;if(step<=0||paused)return;for(let wave of pumpkinBooWaves)wave.age+=step;pumpkinBooWaves=pumpkinBooWaves.filter(w=>w.age<.7)};
const booDraw=draw;draw=function(){booDraw();ctx.save();ctx.scale(scale,scale);ctx.translate(-cam.x,-cam.y);
 for(let wave of pumpkinBooWaves){let t=wave.age/.7;ctx.globalAlpha=1-t;ctx.fillStyle='#eedbff';ctx.strokeStyle='#9768da';ctx.lineWidth=2;for(let n=0;n<(reducedFX?4:8);n++){let angle=n*Math.PI*2/(reducedFX?4:8),x=wave.x+Math.cos(angle)*(30+t*210),y=wave.y+Math.sin(angle)*(30+t*210)-Math.sin(t*Math.PI)*25;ctx.beginPath();ctx.arc(x,y,13,Math.PI,0);ctx.lineTo(x+13,y+16);ctx.lineTo(x+6,y+10);ctx.lineTo(x,y+17);ctx.lineTo(x-6,y+10);ctx.lineTo(x-13,y+16);ctx.closePath();ctx.fill();ctx.stroke();ellipse(x-4,y-1,2,4,'#45215f');ellipse(x+4,y-1,2,4,'#45215f')}}
 ctx.globalAlpha=1;for(let a of actors)if(a.alive&&isPumpkinFrightened(a)){ctx.font='900 22px sans-serif';ctx.fillStyle='#e8cfff';ctx.textAlign='center';ctx.fillText('!',a.x+38,a.y-70)}ctx.restore();
};
const booStart=start;start=function(...args){pumpkinBooWaves=[];return booStart(...args)};
const booHome=home;home=function(...args){pumpkinBooWaves=[];for(let a of actors)a.pumpkinFearUntil=0;return booHome(...args)};
const booRound=startRankedRound;startRankedRound=function(...args){pumpkinBooWaves=[];return booRound(...args)};
