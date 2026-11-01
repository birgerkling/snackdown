// Costume-specific silhouettes and effects; hitboxes, damage and portal rules stay shared.
const costumeRavioliFold=drawRavioliFold;
drawRavioliFold=function(x,y,size,angle,theme){
 if(theme.glyph==='pasta')return costumeRavioliFold(x,y,size,angle,theme);
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.shadowColor=theme.color;ctx.shadowBlur=10;
 if(theme.glyph==='leaf'){
  // A sizzling frying pan, sauce and basil.
  ctx.fillStyle='#624b42';ctx.fillRect(-size*1.7,-size*.16,size,size*.32);ellipse(0,0,size*.8,size*.68,'#9d8062');ellipse(0,0,size*.64,size*.52,'#f05d36');ellipse(size*.1,-size*.12,size*.25,size*.14,'#ffc263');ellipse(-size*.2,size*.1,size*.25,size*.1,'#b2d278',-.5);
 }else if(theme.glyph==='moon'){
  // A little lunar pressure capsule with a bright observation window.
  rounded(-size,-size*.5,size*1.8,size,4,'#edf2de','#72d9e5',2);ellipse(size*.2,0,size*.33,size*.33,'#54c9d5');ctx.fillStyle='#a5edff';ctx.beginPath();ctx.moveTo(-size,0);ctx.lineTo(-size*1.8,-size*.35);ctx.lineTo(-size*1.5,0);ctx.lineTo(-size*1.8,size*.35);ctx.closePath();ctx.fill();
 }else{
  // A hovering mech's dimensional energy disk.
  ctx.strokeStyle='#e0d18b';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,size*1.1,size*.55,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#8b62d9';ctx.beginPath();ctx.ellipse(0,0,size*.8,size*.38,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#8ef4ff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,size*.65,size*.24,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#e0fbff';ctx.fillRect(-2,-size*.8,4,size*1.6);
 }ctx.restore();
};
const costumeRavioliPortal=drawRavioliPortal;
drawRavioliPortal=function(point,pair,index){
 let theme=pair.theme;if(theme.glyph==='pasta')return costumeRavioliPortal(point,pair,index);
 let t=elapsed*2+index*Math.PI;ctx.save();ctx.translate(point.x,point.y);ctx.shadowColor=theme.color;ctx.shadowBlur=theme.glyph==='cosmic'?20:9;ctx.fillStyle=theme.glyph==='leaf'?'#942b2655':'#26325188';ctx.strokeStyle=theme.glyph==='leaf'?'#d7ac78':theme.light;ctx.lineWidth=4;
 if(theme.glyph==='cosmic'){
  ctx.beginPath();for(let i=0;i<6;i++){let a=i*Math.PI/3,xx=Math.cos(a)*39,yy=Math.sin(a)*28;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}ctx.closePath();ctx.fill();ctx.stroke();
 }else{ctx.beginPath();ctx.ellipse(0,0,36,26,0,0,Math.PI*2);ctx.fill();ctx.stroke()}
 if(theme.glyph==='leaf'){ctx.fillStyle='#7e6551';ctx.fillRect(-51,-4,17,8);ctx.fillRect(34,-4,17,8);for(let i=0;i<5;i++){let a=t+i*Math.PI*2/5;ellipse(Math.cos(a)*28,Math.sin(a)*18,5,2,'#a9d574',a)}}
 else if(theme.glyph==='moon'){ctx.strokeStyle='#6bd5e5';ctx.lineWidth=3;for(let i=0;i<8;i++){let a=i*Math.PI/4;ctx.beginPath();ctx.moveTo(Math.cos(a)*29,Math.sin(a)*20);ctx.lineTo(Math.cos(a)*35,Math.sin(a)*25);ctx.stroke()}}
 else for(let i=0;i<3;i++){let a=t+i*Math.PI*2/3;ellipse(Math.cos(a)*42,Math.sin(a)*30,5,4,i%2?'#ead291':'#9be9ff');ctx.strokeStyle='#bf98ff';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,45,31,i*.15,0,Math.PI*2);ctx.stroke()}
 ctx.strokeStyle=theme.color;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,22,14,0,t,t+Math.PI*1.5);ctx.stroke();ctx.shadowBlur=0;ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillStyle=isEnemy(pair.owner,player)?'#ffb7bf':'#d5ffdf';ctx.fillText(isEnemy(pair.owner,player)?'ENEMY PORTAL':'ALLY PORTAL',0,44);ctx.restore();
};
const costumeRavioliDraw=draw;draw=function(){costumeRavioliDraw();if(!playing)return;ctx.save();ctx.scale(scale,scale);ctx.translate(-cam.x,-cam.y);
 for(let actor of actors){if(!actor.alive||actor.food!==RAVIOLI||actor!==player&&hiddenInBush(actor,player)||!actor.ravioliBoostArmed&&!(actor.ravioliSpeedUntil>elapsed))continue;let theme=ravioliPalette(actor);if(theme.glyph==='pasta')continue;
  for(let i=0;i<3;i++){let phase=(elapsed*2+i/3)%1,x=actor.x-Math.cos(actor.angle)*(16+phase*30),y=actor.y+18-Math.sin(actor.angle)*phase*25;ctx.globalAlpha=(1-phase)*.65;
   if(theme.glyph==='leaf')ellipse(x,y-phase*25,4+phase*5,3+phase*4,'#fff1da');else if(theme.glyph==='moon'){ctx.fillStyle='#a2f3ff';ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);ctx.lineTo(x,y+10+phase*9);ctx.closePath();ctx.fill()}else{ctx.strokeStyle='#f0d58e';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,9+phase*8,4+phase*3,-actor.angle,0,Math.PI*2);ctx.stroke()}
  }
 }ctx.restore();
};
