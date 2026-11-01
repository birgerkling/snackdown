// Cosmetic layers only: combat geometry, damage and cooldowns remain in spud.js.
let volcanoEruptions=[];
function isVolcanoSpud(a){return a?.food===9&&actorSkinDefinition(a)?.id==='exclusive-9'}
const volcanoMashquake=castMashquake;castMashquake=function(a){volcanoMashquake(a);if(isVolcanoSpud(a))volcanoEruptions.push({x:a.x,y:a.y,age:0,life:1.45})};
function lavaFissure(x,y,angle,length,seed,alpha){
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha*=alpha;
  let points=[[20,0],[length*.28,Math.sin(seed)*14],[length*.54,-12-Math.cos(seed)*12],[length*.76,Math.sin(seed+2)*19],[length,0]];
  for(let [color,width,blur] of [['#38242e',10,0],['#f04a24',5,12],['#ffb846',2,6],['#fff1ad',.8,0]]){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.shadowColor='#ff692b';ctx.shadowBlur=reducedFX?0:blur;ctx.beginPath();points.forEach(([px,py],i)=>i?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.stroke()}
  ctx.restore();
}
function volcanoRock(x,y,size,angle,heat=1){
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.shadowColor='#ff8a2d';ctx.shadowBlur=reducedFX?0:12*heat;
  ctx.fillStyle='#482b2d';ctx.strokeStyle='#ff8c35';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-size,-size*.5);ctx.lineTo(-size*.25,-size);ctx.lineTo(size*.8,-size*.55);ctx.lineTo(size,size*.5);ctx.lineTo(-size*.15,size);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='#ffe291';ctx.beginPath();ctx.moveTo(-size*.4,-size*.7);ctx.lineTo(size*.15,0);ctx.lineTo(-size*.2,size*.7);ctx.stroke();ctx.restore();
}
const volcanoUpdate=update;update=function(dt){let before=elapsed;volcanoUpdate(dt);let step=Math.max(0,elapsed-before);if(!playing||paused)return;for(let e of volcanoEruptions)e.age+=step;volcanoEruptions=volcanoEruptions.filter(e=>e.age<e.life)};
const volcanoDraw=draw;draw=function(){
  volcanoDraw();if(!playing)return;ctx.save();ctx.scale(scale,scale);ctx.translate(-cam.x,-cam.y);
  for(let swing of spudSwings){if(!swing.theme)continue;let t=swing.age/swing.life,fade=1-t;
    ctx.save();ctx.translate(swing.x,swing.y);ctx.rotate(swing.angle);ctx.globalAlpha=fade;
    // Three hot ribbons follow the hammer's wall-clipped arc.
    for(let band=0;band<3;band++){ctx.strokeStyle=['#8e291d','#ff692c','#fff1b4'][band];ctx.lineWidth=[20,10,3][band];ctx.shadowColor='#ff5e22';ctx.shadowBlur=reducedFX?0:18;ctx.beginPath();for(let i=0;i<=32;i++){let angle=-SPUD_ARC+i/32*SPUD_ARC*2,range=Math.min(makiRayDistance(swing,swing.angle+angle,SPUD_RANGE),SPUD_RANGE*(.63+t*.33))-band*5,x=Math.cos(angle)*range,y=Math.sin(angle)*range;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y)}ctx.stroke()}
    for(let i=0;i<(reducedFX?4:12);i++){let angle=-SPUD_ARC+i/11*SPUD_ARC*2,range=Math.min(makiRayDistance(swing,swing.angle+angle,SPUD_RANGE),100+t*110);volcanoRock(Math.cos(angle)*range,Math.sin(angle)*range-Math.sin(t*Math.PI)*14,3+i%3,i+t*6,fade)}ctx.restore();
  }

  ctx.restore();
};
const volcanoStart=start;start=function(){volcanoEruptions=[];volcanoStart()};const volcanoHome=home;home=function(){volcanoEruptions=[];volcanoHome()};const volcanoRound=startRankedRound;startRankedRound=function(){volcanoEruptions=[];volcanoRound()};

function drawVolcanoGroundEffects(){
  for(let e of volcanoEruptions){let t=e.age/e.life,growth=Math.min(1,e.age/.42),fade=Math.min(1,(1-t)*2),count=reducedFX?6:12;
    ctx.save();ctx.globalAlpha=fade;
    let glow=ctx.createRadialGradient(e.x,e.y,12,e.x,e.y,310);glow.addColorStop(0,'#ffce6633');glow.addColorStop(.45,'#ff63262b');glow.addColorStop(1,'#ff422000');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(e.x,e.y,310,0,Math.PI*2);ctx.fill();
    for(let i=0;i<count;i++){let angle=i*Math.PI*2/count+.13;lavaFissure(e.x,e.y,angle,(215+i%4*26)*growth,i*2.31,fade);if(i%2===0)lavaFissure(e.x+Math.cos(angle)*120*growth,e.y+Math.sin(angle)*120*growth,angle+.6,85*growth,i,fade*.65)}
    // Expanding ash ring, airborne basalt chunks and pinprick embers.
    ctx.strokeStyle='#ffb14c';ctx.lineWidth=2;ctx.setLineDash([8,11]);ctx.globalAlpha=fade*.65;ctx.beginPath();ctx.ellipse(e.x,e.y,Math.max(1,300*growth),Math.max(1,275*growth),t*.12,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=fade;
    for(let i=0;i<(reducedFX?6:24);i++){let angle=i*2.39996,r=(65+i%7*27)*Math.min(1,t*2),z=Math.sin(Math.min(1,t*1.3)*Math.PI)*(28+i%5*12);volcanoRock(e.x+Math.cos(angle)*r,e.y+Math.sin(angle)*r-z,3+i%4,angle+t*(i%2?4:-4),fade)}
    if(!reducedFX)for(let i=0;i<9;i++){let angle=i*2.4,r=30+i*14;ctx.globalAlpha=fade*.13;ctx.fillStyle='#41343c';ctx.beginPath();ctx.ellipse(e.x+Math.cos(angle)*r,e.y+Math.sin(angle)*r-30-t*90,15+t*22,10+t*17,angle,0,Math.PI*2);ctx.fill()}
    ctx.restore();
  }
}
