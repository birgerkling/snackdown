function rankedBotSteering(a,dx,dy,dt){
  let speed=Math.hypot(dx,dy);if(!speed||!a.alive)return {x:dx,y:dy};
  let stormRadius=arenaStormRadius();
  // Keep the original retreat direction when the sauce is close.
  if(dist(a,{x:W/2,y:H/2})>stormRadius-120)return {x:dx,y:dy};
  let target=actors.filter(b=>b.alive&&isEnemy(a,b)).sort((b,c)=>dist(a,b)-dist(a,c))[0];
  let x=dx/speed,y=dy/speed;
  if(target){
    let distance=dist(a,target),fade=Math.max(0,1-elapsed/65),approach=Math.max(0,Math.min(1,(distance-280)/330));
    // Side players approach along their own lanes, then converge for the fight.
    let laneX=a.rankedLaneX??a.x,lanePull=Math.max(-1,Math.min(1,(laneX-a.x)/150));
    x+=lanePull*.95*approach*fade;
    // Offset ranged fighters sideways when several allies share one firing line.
    if(distance<520&&distance>230&&a.food!==1&&a.food!==9)x+=(a.rankedLane||0)*.16;
  }
  for(let ally of actors){if(ally===a||!ally.alive||ally.team!==a.team)continue;let d=dist(a,ally);if(d<175){let angle=d>.01?Math.atan2(a.y-ally.y,a.x-ally.x):(a.rankedLane||1)*Math.PI/2,force=(175-d)/175*1.35;x+=Math.cos(angle)*force;y+=Math.sin(angle)*force}}
  let length=Math.hypot(x,y);if(length<.001)return {x:dx,y:dy};x/=length;y/=length;
  // Steer around cover rather than pushing all three bots into the same corner.
  let probe=Math.max(30,foods[a.food].speed*.9*speed*dt),angle=Math.atan2(y,x);
  if(collision(a.x+x*probe,a.y+y*probe)){
    let turn=a.rankedLane<0?-1:1,found=false;
    for(let offset of [turn*.55,-turn*.55,turn*1.05,-turn*1.05,turn*1.55,-turn*1.55]){let nx=Math.cos(angle+offset),ny=Math.sin(angle+offset);if(!collision(a.x+nx*probe,a.y+ny*probe)){x=nx;y=ny;found=true;break}}
    if(!found)return {x:dx,y:dy};
  }
  return {x:x*speed,y:y*speed};
}
