function botNavigationInput(a,target,stormRadius,dx,dy,dt){
  a.botFollowingRoute=false;
  if(practice||!a.alive||a===player||dt<=0)return {x:dx,y:dy};
  let retreat=dist(a,{x:W/2,y:H/2})>stormRadius-110,goal=retreat?{x:W/2,y:H/2}:target;
  if(!goal)return {x:dx,y:dy};
  if(collision(goal.x,goal.y)){
    let origin=goal;goal=null;
    for(let radius=30;radius<=150&&!goal;radius+=30)for(let i=0;i<12;i++){let point={x:origin.x+Math.cos(i*Math.PI/6)*radius,y:origin.y+Math.sin(i*Math.PI/6)*radius};if(!collision(point.x,point.y)){goal=point;break}}
    if(!goal)return {x:dx,y:dy};
  }
  if(splitRouteClear(a,goal)){a.botRoute=null;return {x:dx,y:dy}}
  let route=a.botRoute;
  if(!route||elapsed>=route.retryAt&&(dist(route.goal,goal)>70||!route.points.length)||route.points.length&&!splitRouteClear(a,route.points[0])){
    route=a.botRoute={goal:{x:goal.x,y:goal.y},points:splitFindRoute(a,goal),retryAt:elapsed+.65};
    // An actor can stand closer to cover than a route corner. Step out first.
    if(!route.points.length){let best=null;for(let i=0;i<8;i++){let angle=i*Math.PI/4,point={x:a.x+Math.cos(angle)*26,y:a.y+Math.sin(angle)*26};if(collision(point.x,point.y))continue;let path=splitFindRoute(point,goal);if(path.length&&(!best||dist(point,goal)<dist(best.point,goal)))best={point,path}}if(best)route.points=[best.point,...best.path]}
  }
  if(!route.points.length)return {x:dx,y:dy};
  while(route.points.length&&dist(a,route.points[0])<3)route.points.shift();
  if(!route.points.length)return {x:dx,y:dy};
  let point=route.points[0],distance=dist(a,point),speed=Math.hypot(dx,dy),travel=foods[a.food].speed*.9*speed*dt;
  if(!speed||!distance)return {x:dx,y:dy};
  let amount=speed*Math.min(1,distance/Math.max(.001,travel));a.botFollowingRoute=true;
  return {x:(point.x-a.x)/distance*amount,y:(point.y-a.y)/distance*amount};
}
