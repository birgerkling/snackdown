// Muffin aims bombs at a fixed landing distance, so move toward a firing ring,
// not toward the enemy's feet. Use the existing wall pathfinder for that goal.
function muffinSpacingGoal(a,target,radius){
 let range=MUFFIN_FLIGHT.range,distance=dist(a,target),angle=Math.atan2(a.y-target.y,a.x-target.x),side=a.rankedLane<0?-1:1;
 let orbit=Math.abs(distance-range)<45?side*.2:0,best=null;
 for(let offset of [0,side*.35,-side*.35,side*.7,-side*.7,side*1.15,-side*1.15,Math.PI]){
  let direction=angle+orbit+offset,point={x:target.x+Math.cos(direction)*range,y:target.y+Math.sin(direction)*range};
  if(point.x<45||point.x>W-45||point.y<45||point.y>H-45||collision(point.x,point.y)||dist(point,{x:W/2,y:H/2})>radius-80)continue;
  let score=dist(a,point)+(splitRouteClear(a,point)?0:160);
  for(let other of actors)if(other!==a&&other.alive&&isEnemy(a,other)){let threat=dist(point,other);if(threat<240)score+=(240-threat)*2}
  if(!best||score<best.score)best={...point,score};
 }
 return best;
}
const muffinSpacingNavigation=botNavigationInput;
botNavigationInput=function(a,target,radius,dx,dy,dt){
 if(a.food!==7||a===player||practice||!a.alive||!target?.alive||a.crunchDecoyTarget?.alive||dt<=0||dist(a,{x:W/2,y:H/2})>radius-120)return muffinSpacingNavigation(a,target,radius,dx,dy,dt);
 // Keep the existing high-rank projectile dodging when an impact is imminent.
 if(a.rankedSmart&&shots.some(s=>{if(s.life<=0||!isEnemy(a,s.owner))return false;let vx=s.vx||0,vy=s.vy||0,v2=vx*vx+vy*vy;if(!v2)return false;let t=((a.x-s.x)*vx+(a.y-s.y)*vy)/v2;return t>=0&&t<.35&&Math.hypot(s.x+vx*t-a.x,s.y+vy*t-a.y)<65}))return muffinSpacingNavigation(a,target,radius,dx,dy,dt);
 let goal=muffinSpacingGoal(a,target,radius);if(!goal)return muffinSpacingNavigation(a,target,radius,dx,dy,dt);
 let distance=dist(a,goal),speed=Math.hypot(dx,dy);if(distance<4||!speed)return {x:0,y:0};
 // Bypass the generic smart-rank standoff calculation: this goal already
 // represents the desired range, rather than another opponent.
 return smartRankedNavigation(a,goal,radius,(goal.x-a.x)/distance*speed,(goal.y-a.y)/distance*speed,dt);
};
