// Preview the same geometry used by the attack factories and collision checks.
function aimRayContact(start,dir,length,includeCrates=true,edges=false){
 let best={distance:length,normal:null,blocked:false};
 for(let b of [...blocks,...(includeCrates?crates.filter(c=>c.hp>0):[])]){
  let enter=-Infinity,exit=Infinity,normal=null,valid=true;
  for(let axis of ['x','y']){let size=axis==='x'?'w':'h',v=dir[axis];if(Math.abs(v)<1e-9){if(start[axis]<b[axis]||start[axis]>b[axis]+b[size])valid=false;continue}
   let t1=(b[axis]-start[axis])/v,t2=(b[axis]+b[size]-start[axis])/v,n={x:0,y:0};n[axis]=v>0?-1:1;if(t1>t2)[t1,t2]=[t2,t1];if(t1>enter){enter=t1;normal=n}exit=Math.min(exit,t2);
  }
  if(valid&&exit>1e-5&&enter<=exit&&Math.max(0,enter)<best.distance)best={distance:Math.max(0,enter),normal,blocked:true};
 }
 if(edges)for(let axis of ['x','y']){let v=dir[axis];if(Math.abs(v)<1e-9)continue;let t=((v>0?(axis==='x'?W:H):0)-start[axis])/v;if(t>=0&&t<best.distance){let normal={x:0,y:0};normal[axis]=v>0?-1:1;best={distance:t,normal,blocked:true}}}
 return best;
}
function aimProjectilePath(start,angle,length,bounces=0,speed=0,includeCrates=true,edges=false){
 let pos={...start},dir={x:Math.cos(angle),y:Math.sin(angle)},segments=[];
 for(let i=0;i<8&&length>0;i++){
  let hit=aimRayContact(pos,dir,length,includeCrates,edges),end={x:pos.x+dir.x*hit.distance,y:pos.y+dir.y*hit.distance};
  segments.push({start:{...pos},end,blocked:hit.blocked});length-=hit.distance;
  // Glaze only bounces off walls / map edges, never crates.
  let crate=includeCrates&&crates.some(c=>c.hp>0&&end.x>=c.x-.001&&end.x<=c.x+c.w+.001&&end.y>=c.y-.001&&end.y<=c.y+c.h+.001);
  if(!hit.blocked||bounces--<=0||crate||!hit.normal)break;
  let dot=dir.x*hit.normal.x+dir.y*hit.normal.y;dir={x:dir.x-2*dot*hit.normal.x,y:dir.y-2*dot*hit.normal.y};pos={x:end.x+hit.normal.x*.02,y:end.y+hit.normal.y*.02};length=Math.max(length,.5*speed);
 }
 return segments;
}
attackAimShape=function(a){
 if(a.food===1)return {kind:'slash',range:MAKI_SLASH_RANGE,halfAngle:MAKI_SLASH_HALF_ANGLE,points:makiSlashPoints(a,a.angle,MAKI_SLASH_RANGE)};
 if(a.food===9)return {kind:'slash',range:SPUD_RANGE,halfAngle:SPUD_ARC,points:spudConePoints(a)};
 if(a.food===7)return {kind:'blast',...muffinMainTarget(a,a.angle),radius:MUFFIN_FLIGHT.radius*(hasSnackSeasoning(7)?1.2:1)};
 let banana=a.food===8,spec=banana?{spawn:BANANA_FLIGHT.spawn,range:BANANA_FLIGHT.spawn+BANANA_FLIGHT.outbound,hitRadius:BANANA_FLIGHT.hitRadius,offsets:[0]}:attackProjectileSpec(a.food);
 if(!spec)return {kind:'projectile',rays:[]};
 let armed=a===player&&toppingArmed,offsets=armed&&a.food===4?[-.24,0,.24]:spec.offsets,range=spec.range,bounces=0;
 if(a.food===5){bounces=1+(hasSnackSeasoning(5)?1:0)+(armed?2:0);if(armed)range*=3}
 let start={x:a.x+Math.cos(a.angle)*spec.spawn,y:a.y+Math.sin(a.angle)*spec.spawn};
 return {kind:'projectile',range,returning:banana,rays:offsets.map(offset=>({halfWidth:spec.hitRadius,segments:aimProjectilePath(start,a.angle+offset,range-spec.spawn,bounces,spec.speed,!banana,banana||a.food===5)}))};
};
function aimStroke(points,width,color,dash=[]){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.lineWidth=width;ctx.strokeStyle=color;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([])}
function aimArrow(start,end,color){let angle=Math.atan2(end.y-start.y,end.x-start.x);ctx.beginPath();ctx.moveTo(end.x-12*Math.cos(angle-.55),end.y-12*Math.sin(angle-.55));ctx.lineTo(end.x,end.y);ctx.lineTo(end.x-12*Math.cos(angle+.55),end.y-12*Math.sin(angle+.55));ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke()}
function drawAimLanding(a,target,radius,height){
 let points=Array.from({length:49},(_,i)=>{let t=i/48;return {x:a.x+(target.x-a.x)*t,y:a.y+(target.y-a.y)*t-height(t)}});
 aimStroke(points,2,'#effff5cc',[7,6]);ctx.fillStyle='#d9fff326';ctx.strokeStyle='#effff5';ctx.lineWidth=2;ctx.beginPath();ctx.arc(target.x,target.y,radius,0,Math.PI*2);ctx.fill();ctx.stroke();aimStroke([{x:target.x-8,y:target.y},{x:target.x+8,y:target.y}],2,'#fff');aimStroke([{x:target.x,y:target.y-8},{x:target.x,y:target.y+8}],2,'#fff');
}
function drawFlyingBreadAim(a){ctx.save();drawAimLanding(a,flyingBreadTarget(a.angle),55,t=>Math.sin(t*Math.PI)*100);ctx.restore()}
drawAttackAim=function(a){
 if(a===player&&((a.food===7&&muffinDashAiming)||(a.food===1&&(makiSuperAiming||makiJumpFor(a)))||(a.food===3&&toppingArmed)))return;
 let shape=attackAimShape(a);ctx.save();
 if(shape.kind==='slash'){ctx.translate(a.x,a.y);ctx.rotate(a.angle);ctx.beginPath();ctx.moveTo(0,0);for(let p of shape.points)ctx.lineTo(p.x,p.y);ctx.closePath();ctx.fillStyle='#d9fff32e';ctx.strokeStyle='#effff5cc';ctx.lineWidth=2;ctx.fill();ctx.stroke()}
 else if(shape.kind==='blast')drawAimLanding(a,shape,shape.radius,muffinBounceHeight);
 else for(let ray of shape.rays){for(let segment of ray.segments){let {start,end}=segment,angle=Math.atan2(end.y-start.y,end.x-start.x),nx=-Math.sin(angle)*ray.halfWidth,ny=Math.cos(angle)*ray.halfWidth;
  aimStroke([start,end],ray.halfWidth*2,'#d9fff322');aimStroke([{x:start.x+nx,y:start.y+ny},{x:end.x+nx,y:end.y+ny}],1.5,'#effff59c');aimStroke([{x:start.x-nx,y:start.y-ny},{x:end.x-nx,y:end.y-ny}],1.5,'#effff59c');aimStroke([start,end],1.5,'#effff5aa',[7,7]);aimStroke([{x:end.x+nx,y:end.y+ny},{x:end.x-nx,y:end.y-ny}],2,'#effff5cc');aimArrow(start,end,'#fff');
 }if(shape.returning){let end=ray.segments.at(-1).end;aimStroke([end,{x:a.x,y:a.y}],2,'#ffe58dcc',[4,8]);aimArrow(end,{x:(end.x+a.x)/2,y:(end.y+a.y)/2},'#ffe58d')}}
 ctx.restore();
};
