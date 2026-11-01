let spudTunnels=[];
function spudTunnel(a){
  let sx=a.x,sy=a.y,dx=Math.cos(a.angle),dy=Math.sin(a.angle),destination=null;
  // Search backwards for an open landing; the underground path can cross cover.
  for(let distance=250;distance>=20;distance-=5){let x=sx+dx*distance,y=sy+dy*distance;if(!collision(x,y)){destination={x,y};break}}
  if(!destination)destination={x:sx,y:sy};
  a.x=destination.x;a.y=destination.y;
  for(let enemy of actors)if(enemy.alive&&isEnemy(a,enemy)&&dist(a,enemy)<=130&&makiSlashClear(a,enemy)){enemy.slowUntil=elapsed+2;enemy.slowFactor=.5}
  let theme=exclusiveTheme(a);spudTunnels.push({sx,sy,x:a.x,y:a.y,age:0,life:.8,theme});
  fxEmit(a.x,a.y,theme?24:16,'crumb',theme?'#ff9b40':'#c59a65',1);animateSnackAction(a,'gadget');sfx('super');
}
const tunnelUpdate=update;update=function(dt){let before=elapsed;tunnelUpdate(dt);let step=Math.max(0,elapsed-before);if(!playing||paused)return;for(let e of spudTunnels)e.age+=step;spudTunnels=spudTunnels.filter(e=>e.age<e.life)};
const tunnelDraw=draw;draw=function(){tunnelDraw();if(!playing)return;ctx.save();ctx.scale(scale,scale);ctx.translate(-cam.x,-cam.y);for(let e of spudTunnels){let t=e.age/e.life;ctx.save();ctx.globalAlpha=1-t;let color=e.theme?'#ff8c37':'#e4bf83';ctx.strokeStyle=color;ctx.lineWidth=3;ctx.shadowColor=color;ctx.shadowBlur=e.theme&&!reducedFX?15:0;let count=reducedFX?6:12;for(let i=0;i<count;i++){let u=i/(count-1),x=e.sx+(e.x-e.sx)*u,y=e.sy+(e.y-e.sy)*u;ctx.beginPath();ctx.ellipse(x,y+12,8+Math.sin(u*Math.PI)*7,5+t*4,0,0,Math.PI*2);ctx.stroke();if(e.theme&&i%2===0)volcanoRock(x,y-t*18,4,i+t*3,1-t)}for(let i=0;i<2;i++){ctx.beginPath();ctx.ellipse(e.x,e.y+10,Math.max(1,(40+t*90)-i*15),Math.max(1,(24+t*50)-i*10),0,0,Math.PI*2);ctx.stroke()}ctx.restore()}ctx.restore()};
const tunnelStart=start;start=function(){spudTunnels=[];tunnelStart()};const tunnelHome=home;home=function(){spudTunnels=[];tunnelHome()};const tunnelRound=startRankedRound;startRankedRound=function(){spudTunnels=[];tunnelRound()};
