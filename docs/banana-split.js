let splitBananas=[];
function spawnBananaSplit(owner){splitBananas=splitBananas.filter(m=>m.owner!==owner);let factor=owner===player?1+(saved.levels[8]||0)*.2:owner.levelMultiplier||1;for(let i=0;i<4;i++){let angle=owner.angle+(i-1.5)*.7,x=owner.x+Math.cos(angle)*40,y=owner.y+Math.sin(angle)*40;if(collision(x,y)){x=owner.x;y=owner.y}splitBananas.push({owner,x,y,angle,walk:0,age:0,life:bananaHasSeasoning(owner)?8:6,hp:500*factor,max:500*factor,damage:400*factor,radius:bossRange(owner,85),index:i,dead:false,theme:exclusiveTheme(owner),skin:actorSkinDefinition(owner)})}animateSnackAction(owner,'super');fxEmit(owner.x,owner.y,24,'spark',exclusiveTheme(owner)?.color||'#c6ff63',1);sfx('super')}
plantRadiationGrove=function(owner,target){spawnBananaSplit(owner)};
function popSplitBanana(mini,explode){if(mini.dead)return;mini.dead=true;fxEmit(mini.x,mini.y,explode?18:7,'spark',mini.theme?.color||'#c8ff61',explode?1:.4);if(!explode)return;fxBursts.push({x:mini.x,y:mini.y,life:.4,max:.4,radius:mini.radius,color:mini.theme?.color||'#ceff70',type:4});let before=statusTick;statusTick=true;try{for(let enemy of actors)if(enemy.alive&&isEnemy(mini.owner,enemy)&&dist(enemy,mini)<=mini.radius+bossTargetPadding(enemy))hurt(enemy,mini.damage,mini.owner)}finally{statusTick=before}sfx('hit')}
function hurtSplitBanana(mini,damage){if(mini.dead)return;mini.hp-=damage;if(mini.hp<=0)popSplitBanana(mini,false)}
function segmentNearMini(shot,mini,dt){let dx=shot.vx*dt,dy=shot.vy*dt,len=dx*dx+dy*dy,t=len?Math.max(0,Math.min(1,((mini.x-shot.x)*dx+(mini.y-shot.y)*dy)/len)):0;return Math.hypot(shot.x+dx*t-mini.x,shot.y+dy*t-mini.y)<24}
// Walls and intact crates both contribute corners and block route segments.
function splitObstacles(){return [...blocks,...crates.filter(c=>c.hp>0)]}
function splitRouteClear(a,b){
  if(collision(a.x,a.y)||collision(b.x,b.y))return false;
  let dx=b.x-a.x,dy=b.y-a.y;
  return !splitObstacles().some(w=>{let lo=0,hi=1;for(let [p,d,min,max] of [[a.x,dx,w.x-22,w.x+w.w+22],[a.y,dy,w.y-18,w.y+w.h+22]]){if(Math.abs(d)<1e-9){if(p<=min||p>=max)return false}else{let t=(min-p)/d,u=(max-p)/d;if(t>u)[t,u]=[u,t];lo=Math.max(lo,t);hi=Math.min(hi,u);if(lo>hi)return false}}return hi>=0&&lo<=1});
}
let splitRouteMap=null;
function splitWallGraph(){
  let obstacles=splitObstacles(),key=W+','+H+'|'+obstacles.map(b=>[b.x,b.y,b.w,b.h].join(',')).join(';');
  if(splitRouteMap?.key===key)return splitRouteMap;
  let nodes=[];for(let b of obstacles)for(let x of [b.x-24,b.x+b.w+24])for(let y of [b.y-20,b.y+b.h+24])if(!collision(x,y))nodes.push({x,y});
  let edges=nodes.map(()=>[]);for(let i=0;i<nodes.length;i++)for(let j=0;j<i;j++)if(splitRouteClear(nodes[i],nodes[j])){let d=dist(nodes[i],nodes[j]);edges[i].push([j,d]);edges[j].push([i,d])}
  return splitRouteMap={key,nodes,edges};
}
function splitFindRoute(from,target){
  if(splitRouteClear(from,target))return [{x:target.x,y:target.y}];
  let graph=splitWallGraph(),n=graph.nodes.length,score=Array(n).fill(Infinity),prev=Array(n).fill(-1),done=new Set(),end=-1,best=Infinity;
  for(let i=0;i<n;i++)if(splitRouteClear(from,graph.nodes[i]))score[i]=dist(from,graph.nodes[i]);
  for(let k=0;k<n;k++){let u=-1;for(let i=0;i<n;i++)if(!done.has(i)&&(u<0||score[i]<score[u]))u=i;if(u<0||!Number.isFinite(score[u])||score[u]>=best)break;done.add(u);if(splitRouteClear(graph.nodes[u],target)){let total=score[u]+dist(graph.nodes[u],target);if(total<best){best=total;end=u}}for(let [v,d] of graph.edges[u])if(score[u]+d<score[v]){score[v]=score[u]+d;prev[v]=u}}
  if(end<0)return [];
  let route=[{x:target.x,y:target.y}];for(let u=end;u>=0;u=prev[u])route.unshift(graph.nodes[u]);return route;
}
function moveSplitBanana(unit,target,step){
  if(!target)return;
  unit.routeAge=(unit.routeAge||0)+step;
  if(splitRouteClear(unit,target))unit.route=[{x:target.x,y:target.y}];
  else if(unit.routeTarget!==target||unit.routeAge>=.35||!unit.route?.length){unit.route=splitFindRoute(unit,target);unit.routeAge=0}
  unit.routeTarget=target;
  let remaining=285*step;
  while(remaining>0&&unit.route?.length){let point=unit.route[0],distance=dist(unit,point);if(distance<.01){unit.route.shift();continue}unit.angle=Math.atan2(point.y-unit.y,point.x-unit.x);let travel=Math.min(distance,remaining),next={x:unit.x+Math.cos(unit.angle)*travel,y:unit.y+Math.sin(unit.angle)*travel};if(!splitRouteClear(unit,next)){unit.route=[];unit.routeAge=1;break}unit.x=next.x;unit.y=next.y;remaining-=travel;if(travel>=distance-.001)unit.route.shift()}
}
// Initial acquisition is free; only switching to a different enemy extends the hunt.
function retargetSplitBanana(mini,target){
 if(!target||mini.dead)return;
 if(mini.chaseTarget&&mini.chaseTarget!==target)mini.life+=1;
 mini.chaseTarget=target;
}
const splitUpdate=update;update=function(dt){if(playing&&!paused&&countdown<=0){for(let shot of shots)if(shot.life>0){let mini=splitBananas.find(m=>!m.dead&&isEnemy(shot.owner,m.owner)&&segmentNearMini(shot,m,dt)&&makiSlashClear(shot,m));if(mini){hurtSplitBanana(mini,shot.damage);shot.life=0}}shots=shots.filter(s=>s.life>0)}let before=elapsed;splitUpdate(dt);if(!playing||paused||countdown>0)return;let step=Math.max(0,elapsed-before);for(let mini of splitBananas){if(mini.dead)continue;mini.age+=step;let targets=actors.filter(a=>a.alive&&isEnemy(mini.owner,a)).sort((a,b)=>a.hp-b.hp||dist(mini,a)-dist(mini,b)),target=targets.length?targets[0]:null;retargetSplitBanana(mini,target);if(mini.age>=mini.life){popSplitBanana(mini,false);continue}if(target){mini.angle=Math.atan2(target.y-mini.y,target.x-mini.x);if(dist(mini,target)<bossContactRange(mini.owner,target,42)&&splitRouteClear(mini,target)){popSplitBanana(mini,true);continue}}let ox=mini.x,oy=mini.y;moveSplitBanana(mini,target,step);mini.walk+=Math.hypot(mini.x-ox,mini.y-oy)*.08}splitBananas=splitBananas.filter(m=>!m.dead)};
const splitBomb=detonateBerry;detonateBerry=function(b){for(let mini of splitBananas)if(!mini.dead&&isEnemy(b.owner,mini.owner)&&dist(b,mini)<=b.radius)hurtSplitBanana(mini,b.damage);splitBomb(b)};
const splitSlash=shoot;shoot=function(a,angle,superShot=false){let count=makiSlashes.length;splitSlash(a,angle,superShot);if(a.food===1&&makiSlashes.length>count)for(let mini of splitBananas){if(mini.dead||!isEnemy(a,mini.owner)||dist(a,mini)>MAKI_SLASH_RANGE||!makiSlashClear(a,mini))continue;let desired=Math.atan2(mini.y-a.y,mini.x-a.x),delta=Math.atan2(Math.sin(desired-angle),Math.cos(desired-angle));if(Math.abs(delta)<=MAKI_SLASH_HALF_ANGLE)hurtSplitBanana(mini,a===player?stats(1).damage:foods[1].damage*(a.levelMultiplier||1))}};
const splitDraw=draw;draw=function(){splitDraw();ctx.save();ctx.scale(scale,scale);ctx.translate(-cam.x,-cam.y);for(let mini of splitBananas){if(mini.dead)continue;ctx.save();ctx.translate(mini.x,mini.y);ctx.scale(bossAttackScale(mini.owner),bossAttackScale(mini.owner));ellipse(0,15,19,8,'#24301755');let image=mini.skin&&skinImages[mini.skin.id]||spriteImages[8],bob=Math.abs(Math.sin(mini.walk))*4;ctx.save();ctx.translate(0,-bob);ctx.rotate(Math.sin(mini.walk)*.08);ctx.shadowColor=mini.theme?.color||'#c4ff63';ctx.shadowBlur=12;if(image?.complete&&image.naturalWidth)ctx.drawImage(image,-27,-42,54,64);else{ctx.strokeStyle='#f9e45e';ctx.lineWidth=12;ctx.beginPath();ctx.arc(0,-9,16,-1,1.5);ctx.stroke()}ctx.restore();ctx.shadowBlur=0;let pulse=.6+.4*Math.sin(elapsed*12+mini.index);ctx.fillStyle=mini.theme?'#cf9dff':'#d8ff7e';ctx.globalAlpha=pulse;ctx.beginPath();ctx.arc(0,-47,3,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;rounded(-19,-55,38,4,2,'#29372d',null);rounded(-19,-55,38*Math.max(0,mini.hp/mini.max),4,2,mini.theme?'#ca9cff':'#c2ff6f',null);if(mini.theme)drawRadiationIcon(0,17,10,'#c6ff65',elapsed+mini.index);ctx.restore()}ctx.restore()};
const splitCleanup=clearBananaEffects;clearBananaEffects=function(){splitBananas=[];splitCleanup()};
SEASONINGS[8].note='Your mini bananas hunt for 2 seconds longer (8 seconds instead of 6).';
