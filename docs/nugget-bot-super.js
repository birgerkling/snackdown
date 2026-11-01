// Solo bots previously never filled the charge meter used by bot Supers.
const nuggetBotHurt=hurt;
hurt=function(target,damage,owner){
 let before=target.hp,eligible=playing&&!practice&&!rankedSession&&owner&&owner!==player&&owner.food===0&&owner.alive&&!statusTick&&isEnemy(owner,target);
 nuggetBotHurt(target,damage,owner);
 if(eligible&&target.hp<before)owner.rankedCharge=Math.min(100,(owner.rankedCharge||0)+20);
};
const nuggetBotSuper=rankedBotSuper;
rankedBotSuper=function(actor,target){
 if(actor.food!==0)return nuggetBotSuper(actor,target);
 if(!playing||paused||countdown>0||!actor.alive||(actor.rankedCharge||0)<100)return;
 actor.rankedCharge=0;actor.nuggetBoostUntil=elapsed+4;
 for(let i=0;i<20;i++)shoot(actor,i*Math.PI/10,true);
 rings.push({x:actor.x,y:actor.y,r:20,max:150,life:.65,color:exclusiveTheme(actor)?.color||'#ffce45'});
 fxEmit(actor.x,actor.y,24,'spark',exclusiveTheme(actor)?.color||'#ffce45',1.1);
 animateSnackAction(actor,'super');sfx('super');
};
const nuggetBotMove=move;
move=function(actor,dx,dy,dt){let boost=actor!==player&&actor.food===0&&elapsed<(actor.nuggetBoostUntil||0)?1.6:1;return nuggetBotMove(actor,dx*boost,dy*boost,dt)};
const nuggetBotDraw=draw;
draw=function(){nuggetBotDraw();if(!playing)return;ctx.save();ctx.scale(scale,scale);ctx.translate(-cam.x,-cam.y);for(let actor of actors){if(actor===player||!actor.alive||actor.food!==0||elapsed>=(actor.nuggetBoostUntil||0)||hiddenInBush(actor,player))continue;ctx.strokeStyle=exclusiveTheme(actor)?.color||'#ffe37a';ctx.lineWidth=3;ctx.globalAlpha=.55+.2*Math.sin(elapsed*14);ctx.beginPath();ctx.ellipse(actor.x,actor.y+16,42,25,0,0,Math.PI*2);ctx.stroke()}ctx.restore()};
