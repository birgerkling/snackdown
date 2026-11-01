// Cosmetic only. Potion damage, blast bounds and cooldowns remain in Muffin's kit.
let arcaneEffects=[],arcaneTrails=[],arcaneTrailClock=0;
const arcaneSuperGroups=new WeakSet();
function isArcaneAlchemist(owner){return owner?.food===7&&actorSkinDefinition(owner)?.id==='exclusive-7'}
const arcaneLaunch=launchBerry;
launchBerry=function(owner,...args){
 let before=muffinBombs.length;arcaneLaunch(owner,...args);
 if(!isArcaneAlchemist(owner))return;
 for(let b of muffinBombs.slice(before)){
  b.arcanePotion=true;
  if(b.superBomb&&(!b.superGroup||!arcaneSuperGroups.has(b.superGroup))){
   if(b.superGroup)arcaneSuperGroups.add(b.superGroup);
   arcaneEffects.push({x:owner.x,y:owner.y,radius:110,age:0,life:1.15,type:'cast'});
  }
 }
};
const arcaneDetonate=detonateBerry;
detonateBerry=function(bomb){
 if(bomb.arcanePotion||isArcaneAlchemist(bomb.owner)){
  arcaneEffects.push({x:bomb.x,y:bomb.y,radius:bomb.radius,age:0,life:bomb.superBomb?1.45:1.05,type:bomb.superBomb?'super':'impact'});
  arcaneEffects=arcaneEffects.slice(-24);
  fxEmit(bomb.x,bomb.y,bomb.superBomb?28:16,'spark','#b5ff8d',.85);
 }
 return arcaneDetonate(bomb);
};
const arcaneDash=sweetEscapeDash;
sweetEscapeDash=function(...args){let start=player&&{x:player.x,y:player.y},arcane=isArcaneAlchemist(player),result=arcaneDash(...args);if(arcane&&start){for(let i=0;i<=8;i++)arcaneEffects.push({x:start.x+(player.x-start.x)*i/8,y:start.y+(player.y-start.y)*i/8,radius:24,age:i*.035,life:.8,type:'dash'})}return result};
function arcaneCircle(x,y,r,color,width=2,angle=0){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.ellipse(x,y,r,r*.58,angle,0,Math.PI*2);ctx.stroke()}
function arcaneSeal(x,y,r,phase=0,alpha=1){
 ctx.save();ctx.translate(x,y);ctx.scale(1,.58);ctx.rotate(phase);ctx.globalAlpha*=alpha;
 ctx.shadowColor='#c2ff91';ctx.shadowBlur=reducedFX?0:12;
 ctx.strokeStyle='#b9ff8d';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(0,0,r*.8,0,Math.PI*2);ctx.stroke();
 ctx.strokeStyle='#d0b1ff';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=6;i++){let angle=i*Math.PI*4/6,px=Math.cos(angle)*r*.65,py=Math.sin(angle)*r*.65;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.stroke();
 ctx.font='bold '+Math.max(9,r*.12)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';for(let i=0;i<8;i++){let a=i*Math.PI/4;ctx.save();ctx.translate(Math.cos(a)*r*.9,Math.sin(a)*r*.9);ctx.rotate(a+Math.PI/2);ctx.fillStyle=i%2?'#edddff':'#f0ffd8';ctx.fillText(['✧','⋈','◇','ϟ'][i%4],0,0);ctx.restore()}
 ctx.restore();
}
function arcaneVial(x,y,size,angle=0,superBomb=false){
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.shadowColor=superBomb?'#d2a1ff':'#a4ff94';ctx.shadowBlur=reducedFX?0:16;
 let glass=ctx.createLinearGradient(-size,0,size,0);glass.addColorStop(0,'#8cceebaa');glass.addColorStop(.3,'#efffffee');glass.addColorStop(.55,'#89ccbfaa');glass.addColorStop(1,'#e6fff6cc');
 ctx.beginPath();ctx.moveTo(-size*.3,-size);ctx.lineTo(size*.3,-size);ctx.lineTo(size*.3,-size*.4);ctx.bezierCurveTo(size*1.1,0,size*.9,size*.8,0,size*.9);ctx.bezierCurveTo(-size*.9,size*.8,-size*1.1,0,-size*.3,-size*.4);ctx.closePath();ctx.fillStyle=glass;ctx.fill();ctx.strokeStyle='#efffff';ctx.lineWidth=1.5;ctx.stroke();
 ctx.beginPath();ctx.ellipse(0,size*.27,size*.58,size*.4,0,0,Math.PI*2);ctx.fillStyle=superBomb?'#bd7fff':'#95f776';ctx.fill();ctx.strokeStyle='#eaffbf';ctx.stroke();
 ctx.fillStyle='#d5aa6b';ctx.fillRect(-size*.4,-size*1.2,size*.8,size*.3);ctx.fillStyle='#fff9';ctx.fillRect(-size*.43,-size*.1,size*.12,size*.55);
 for(let i=0;i<3;i++){ctx.beginPath();ctx.arc((i-1)*size*.22,size*(.12+i*.15),size*.07,0,Math.PI*2);ctx.fillStyle='#f1ffd9';ctx.fill()}ctx.restore();
}
const arcaneGround=drawVolcanoGroundEffects;
drawVolcanoGroundEffects=function(){arcaneGround();
 for(let b of muffinBombs)if(b.arcanePotion){let t=Math.min(1,b.age/b.life);arcaneSeal(b.tx,b.ty,b.radius*.85,elapsed*.45,(b.superBomb?.5:.3)+t*.2)}
 for(let effect of arcaneEffects){let t=effect.age/effect.life;arcaneSeal(effect.x,effect.y,effect.radius*(effect.type==='dash'?1:.35+.65*Math.min(1,t*3)),t*.8,Math.max(0,1-t)*.85)}
};
const arcaneUpdate=update;
update=function(dt){let before=elapsed;arcaneUpdate(dt);let step=elapsed-before;if(!playing||paused||countdown>0||step<=0)return;
 for(let e of arcaneEffects)e.age+=step;arcaneEffects=arcaneEffects.filter(e=>e.age<e.life);
 for(let e of arcaneTrails)e.age+=step;arcaneTrails=arcaneTrails.filter(e=>e.age<e.life);
 arcaneTrailClock-=step;if(arcaneTrailClock<=0){arcaneTrailClock=reducedFX?.1:.045;for(let b of muffinBombs)if(b.arcanePotion){let t=b.age/b.life,z=Math.abs(Math.sin(t*Math.PI*2))*55;arcaneTrails.push({x:b.x,y:b.y-z,age:0,life:.45,superBomb:b.superBomb,phase:b.age*12})}arcaneTrails=arcaneTrails.slice(-160)}
};
const arcaneDraw=draw;
draw=function(){arcaneDraw();if(!arcaneEffects.length&&!arcaneTrails.length&&!muffinBombs.some(b=>b.arcanePotion))return;ctx.save();ctx.scale(scale,scale);ctx.translate(-cam.x,-cam.y);
 for(let trail of arcaneTrails){let t=trail.age/trail.life;ctx.globalAlpha=(1-t)*.6;ctx.strokeStyle=trail.superBomb?'#d9a8ff':'#bdff98';ctx.lineWidth=2;ctx.beginPath();ctx.arc(trail.x+Math.sin(trail.phase+t*4)*9,trail.y-t*22,3+t*5,0,Math.PI*2);ctx.stroke()}
 ctx.globalAlpha=1;
 for(let b of muffinBombs)if(b.arcanePotion){let t=Math.min(1,b.age/b.life),z=Math.abs(Math.sin(t*Math.PI*2))*55;arcaneVial(b.x,b.y-z,b.superBomb?23:19,Math.sin(elapsed*7)*.35,b.superBomb);for(let i=0;i<3;i++){let angle=elapsed*4+i*Math.PI*2/3;ctx.fillStyle=i%2?'#e2c3ff':'#e3ffb0';ctx.fillRect(b.x+Math.cos(angle)*29-2,b.y-z+Math.sin(angle)*13-2,4,4)}}
 for(let e of arcaneEffects){if(e.type==='dash')continue;let t=e.age/e.life,fade=1-t,superBomb=e.type==='super';ctx.globalAlpha=fade;ctx.shadowColor=superBomb?'#c399ff':'#b4ff8c';ctx.shadowBlur=reducedFX?0:15;
  arcaneCircle(e.x,e.y,e.radius*Math.min(1,t*2.5),'#e6ffc1',3);arcaneCircle(e.x,e.y,e.radius*Math.min(1,t*3.5),'#c9a1ff',2);
  for(let i=0;i<(reducedFX?5:14);i++){let a=i*2.39996,r=e.radius*(.15+.7*t)*(i%3+1)/3,z=Math.sin(t*Math.PI)*(20+i%5*11);ctx.beginPath();ctx.arc(e.x+Math.cos(a+t)*r,e.y+Math.sin(a+t)*r*.6-z,2+(i%4)*1.5,0,Math.PI*2);ctx.strokeStyle=i%2?'#d2a7ff':'#caff9b';ctx.lineWidth=2;ctx.stroke()}
  if(superBomb&&!reducedFX){ctx.globalAlpha=fade*.15;for(let i=0;i<3;i++){let x=e.x+Math.cos(i*2.1)*e.radius*.4;ellipse(x,e.y-t*65,15+t*25,25+t*35,i%2?'#b280e0':'#a8ef77',Math.sin(t*5+i)*.3)}}
 }
 ctx.restore();
};
function clearArcaneEffects(){arcaneEffects=[];arcaneTrails=[];arcaneTrailClock=0}
const arcaneStart=start;start=function(...args){clearArcaneEffects();return arcaneStart(...args)};
const arcaneHome=home;home=function(...args){clearArcaneEffects();return arcaneHome(...args)};
const arcaneRound=startRankedRound;startRankedRound=function(...args){clearArcaneEffects();return arcaneRound(...args)};
EXCLUSIVE_SKINS.find(s=>s.food===7).note='An alchemist hat and potion harness. Glowing glass potion bombs, swirling bubble trails, rotating runic landing seals, arcane brewing explosions and a magical escape trail.';
