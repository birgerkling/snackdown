const SPUD_TRAP_TRIGGER_RADIUS=85,SPUD_TRAP_BLAST_RADIUS=130;
let spudTraps=[],spudTrapBursts=[];
function plantSpudTrap(owner){
  let range=Math.max(0,makiRayDistance(owner,owner.angle,180)-26),x=owner.x,y=owner.y;
  for(let d=range;d>=0;d-=5){let px=owner.x+Math.cos(owner.angle)*d,py=owner.y+Math.sin(owner.angle)*d;if(!collision(px,py)){x=px;y=py;break}}
  spudTraps=spudTraps.filter(t=>t.owner!==owner);
  spudTraps.push({owner,x,y,age:0,life:8,theme:exclusiveTheme(owner),damage:600*(owner===player?1+(saved.levels[9]||0)*.2:owner.levelMultiplier||1)});
  animateSnackAction(owner,'gadget');fxEmit(x,y,12,'crumb',exclusiveTheme(owner)?.color||'#c8d77a',.6);sfx('pickup');
}
function burstSpudTrap(trap){
  let before=statusTick;statusTick=true;
  try{for(let a of actors)if(a.alive&&isEnemy(trap.owner,a)&&dist(a,trap)<=SPUD_TRAP_BLAST_RADIUS&&makiSlashClear(trap,a)){let hp=a.hp;hurt(a,trap.damage,trap.owner);if(a.hp<hp&&a.alive){a.slowUntil=elapsed+2;a.slowFactor=.3}}}finally{statusTick=before}
  spudTrapBursts.push({...trap,age:0,life:.55});fxEmit(trap.x,trap.y,24,'crumb',trap.theme?'#ff9a45':'#c6e68b',1);sfx('hit');
}
const trapUpdate=update;update=function(dt){let before=elapsed;trapUpdate(dt);let step=Math.max(0,elapsed-before);if(!playing||paused||!step)return;
  for(let t of spudTraps){t.age+=step;if(t.age>=t.life)continue;if(t.age>=.5&&actors.some(a=>a.alive&&isEnemy(t.owner,a)&&dist(a,t)<=SPUD_TRAP_TRIGGER_RADIUS&&makiSlashClear(t,a))){burstSpudTrap(t);t.age=t.life}}
  spudTraps=spudTraps.filter(t=>t.age<t.life);for(let e of spudTrapBursts)e.age+=step;spudTrapBursts=spudTrapBursts.filter(e=>e.age<e.life);
};

function spudTrapRangePoints(trap){return Array.from({length:97},(_,i)=>{let angle=i/96*Math.PI*2,radius=makiRayDistance(trap,angle,SPUD_TRAP_TRIGGER_RADIUS);return {x:trap.x+Math.cos(angle)*radius,y:trap.y+Math.sin(angle)*radius}})}
function drawSpudTrapRange(trap){
  if(!isFriendlyToPlayer(trap.owner))return false;
  ctx.save();ctx.globalAlpha=Math.min(1,(trap.life-trap.age)*2);ctx.shadowBlur=0;
  ctx.strokeStyle=trap.age<.5?'#c4ccd7':trap.theme?'#ffb65d':'#c3f89c';ctx.fillStyle=trap.theme?'#ff9a3710':'#b7f58b10';ctx.lineWidth=2;
  if(trap.age<.5)ctx.setLineDash([6,5]);
  ctx.beginPath();for(let [i,p] of spudTrapRangePoints(trap).entries()){if(i)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y)}ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();return true;
}
const trapDraw=draw;draw=function(){trapDraw();if(!playing)return;ctx.save();ctx.scale(scale,scale);ctx.translate(-cam.x,-cam.y);
  for(let t of spudTraps){if(!isFriendlyToPlayer(t.owner)&&hiddenInBush(t,player))continue;drawSpudTrapRange(t);let pulse=.7+Math.sin(elapsed*8)*.15,color=t.theme?'#ff9a40':'#b9ee82';ctx.save();ctx.translate(t.x,t.y);ctx.globalAlpha=Math.min(1,(t.life-t.age)*2);ctx.shadowColor=color;ctx.shadowBlur=t.theme&&!reducedFX?14:0;ellipse(0,10,23,10,'#473428');ellipse(0,3,18,13,t.theme?'#683127':'#b98a4d');ctx.strokeStyle=t.theme?'#ffb75f':'#5d9d52';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-18);ctx.stroke();ellipse(-7,-16,9,4,color);ellipse(7,-21,9,4,color);ctx.globalAlpha*=pulse;ctx.strokeStyle=t.age<.5?'#aaa':color;ctx.lineWidth=2;ctx.setLineDash([4,6]);ctx.beginPath();ctx.ellipse(0,8,31,17,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
  for(let e of spudTrapBursts){let t=e.age/e.life,color=e.theme?'#ff9740':'#c6ee85';ctx.save();ctx.globalAlpha=1-t;ctx.strokeStyle=color;ctx.lineWidth=5*(1-t)+1;ctx.shadowColor=color;ctx.shadowBlur=e.theme&&!reducedFX?18:0;ctx.beginPath();ctx.arc(e.x,e.y,Math.max(1,130*t),0,Math.PI*2);ctx.stroke();for(let i=0;i<(reducedFX?5:10);i++){let angle=i*Math.PI/5,r=30+90*t;ctx.beginPath();ctx.moveTo(e.x+Math.cos(angle)*20,e.y+Math.sin(angle)*20);ctx.lineTo(e.x+Math.cos(angle+.12)*r,e.y+Math.sin(angle+.12)*r);ctx.stroke();if(e.theme)volcanoRock(e.x+Math.cos(angle)*r,e.y+Math.sin(angle)*r-Math.sin(t*Math.PI)*25,4,angle+t*4,1-t)}ctx.restore()}
  ctx.restore();
};
function clearSpudTraps(){spudTraps=[];spudTrapBursts=[]}
const trapStart=start;start=function(){clearSpudTraps();trapStart()};const trapHome=home;home=function(){clearSpudTraps();trapHome()};const trapRound=startRankedRound;startRankedRound=function(){clearSpudTraps();trapRound()};
