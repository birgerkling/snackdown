const smartRankedRound=startRankedRound;
startRankedRound=function(...args){
 let result=smartRankedRound(...args);if(!rankedSession)return result;
 let session=rankedSession,rank=session.botRank;
 if(rank.name==='AMETHYST'&&!session.teammatePowerLevels)session.teammatePowerLevels=[Math.floor(Math.random()*6),Math.floor(Math.random()*6)];
 actors.forEach((a,i)=>{
  if(a===player)return;
  a.rankedSmart=rank.min>=110;
  if(rank.name==='AMETHYST'&&i>0&&i<3){rollOpponentLevel(a,()=>session.teammatePowerLevels[i-1]/6+.001);a.beginnerBot=false;a.botTopping=false;a.rankedAbilities=false}
  a.rankedVelocity={x:0,y:0};
 });
 draw();return result;
};
function smartRankedMovement(a,target,radius,dx,dy,dt){
 if(!rankedSession||!a.rankedSmart||!target||a.crunchDecoyTarget?.alive||dist(a,{x:W/2,y:H/2})>radius-120)return {x:dx,y:dy,target};
 let distance=dist(a,target),speed=Math.hypot(dx,dy),angle=Math.atan2(target.y-a.y,target.x-a.x),low=a.hp<a.max*.3;
 let desired=low?480:a.food===1?105:a.food===9?170:a.food===7?400:330;
 let approach=Math.max(-1,Math.min(1,(distance-desired)/90)),side=(a.rankedLane||1)*.3;
 let x=Math.cos(angle)*approach-Math.sin(angle)*side,y=Math.sin(angle)*approach+Math.cos(angle)*side;
 // Dodge shots on a collision course rather than merely wandering sideways.
 for(let shot of shots){
  if(shot.life<=0||!isEnemy(a,shot.owner))continue;
  let vx=shot.vx||0,vy=shot.vy||0,v2=vx*vx+vy*vy;if(!v2)continue;
  let t=((a.x-shot.x)*vx+(a.y-shot.y)*vy)/v2;
  if(t<0||t>.35||Math.hypot(shot.x+vx*t-a.x,shot.y+vy*t-a.y)>65)continue;
  let length=Math.sqrt(v2),sign=((a.x-shot.x)*-vy+(a.y-shot.y)*vx)>=0?1:-1;
  x+=-vy/length*sign*1.8;y+=vx/length*sign*1.8;
 }
 let length=Math.hypot(x,y)||1;
 let goal=low?{x:Math.max(35,Math.min(W-35,a.x-Math.cos(angle)*180)),y:Math.max(35,Math.min(H-35,a.y-Math.sin(angle)*180))}:target;
 return {x:x/length*speed,y:y/length*speed,target:goal};
}
const smartRankedNavigation=botNavigationInput;
botNavigationInput=function(a,target,radius,dx,dy,dt){let input=smartRankedMovement(a,target,radius,dx,dy,dt);return smartRankedNavigation(a,input.target,radius,input.x,input.y,dt)};
const smartRankedShoot=shoot;
shoot=function(a,angle,superShot=false){
 if(rankedSession&&a!==player&&a.rankedSmart&&!superShot&&![1,9].includes(a.food)){
  let target=nuggetDecoyTarget(a,actors.filter(b=>b.alive&&isEnemy(a,b)&&!hiddenInBush(b,a)).sort((b,c)=>dist(a,b)-dist(a,c))[0]);
  if(target){let velocity=target.rankedVelocity||{x:0,y:0},lead=Math.min(.45,dist(a,target)/(a.food===7?500:680));angle=Math.atan2(target.y+velocity.y*lead-a.y,target.x+velocity.x*lead-a.x)+rand(-.035,.035)}
 }
 return smartRankedShoot(a,angle,superShot);
};
const smartRankedUpdate=update;
update=function(dt){
 let before=elapsed,positions=rankedSession?actors.map(a=>({a,x:a.x,y:a.y})):[];
 smartRankedUpdate(dt);let step=elapsed-before;if(!rankedSession||step<=0)return;
 for(let {a,x,y} of positions)if(actors.includes(a))a.rankedVelocity={x:Math.max(-350,Math.min(350,(a.x-x)/step)),y:Math.max(-350,Math.min(350,(a.y-y)/step))};
};
