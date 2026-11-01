function onRankedTable(){return !!rankedSession&&!practice}
function tableOval(c,x,y,rx,ry,fill,stroke,width=2){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke()}}
function tablePlate(c,x,y,size=130){
 c.save();c.shadowColor='#30233755';c.shadowBlur=15;c.shadowOffsetY=9;
 let glaze=c.createRadialGradient(x-size*.3,y-size*.4,5,x,y,size);glaze.addColorStop(0,'#fffef6');glaze.addColorStop(.76,'#f4f0df');glaze.addColorStop(1,'#bdbbb2');
 tableOval(c,x,y,size,size*.85,glaze,'#726775',3);c.shadowBlur=0;c.shadowOffsetY=0;
 tableOval(c,x,y,size*.95,size*.8,'#f8f3e6','#c3a468',4);
 tableOval(c,x,y,size*.76,size*.64,'#eeeadd','#d4cab5',2);
 c.strokeStyle='#ffffffb0';c.lineWidth=4;c.beginPath();c.ellipse(x,y,size*.89,size*.74,0,3.5,5.7);c.stroke();
 for(let i=0;i<12;i++){let angle=i*Math.PI/6;tableOval(c,x+Math.cos(angle)*size*.85,y+Math.sin(angle)*size*.71,2,2,'#c2a366')}
 c.restore();
}
function tableCutlery(c,x,y,kind='fork',angle=0,size=1){
 c.save();c.translate(x,y);c.rotate(angle);c.scale(size,size);c.shadowColor='#352b3844';c.shadowBlur=3;c.shadowOffsetX=4;c.shadowOffsetY=5;
 let metal=c.createLinearGradient(-12,0,15,0);metal.addColorStop(0,'#7d8493');metal.addColorStop(.3,'#f3f8ff');metal.addColorStop(.6,'#aeb7c8');metal.addColorStop(1,'#fff');c.fillStyle=metal;c.strokeStyle='#626c7c';c.lineWidth=2;
 c.beginPath();c.roundRect(-5,-4,10,110,5);c.fill();c.stroke();
 if(kind==='fork'){c.beginPath();c.roundRect(-17,-47,34,53,12);c.fill();c.stroke();c.shadowBlur=0;c.shadowOffsetX=0;c.shadowOffsetY=0;c.strokeStyle='#d9c7af';c.lineWidth=5;for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(i*9,-49);c.lineTo(i*9,-18);c.stroke()}}
 else{c.beginPath();c.moveTo(-5,5);c.lineTo(-5,-83);c.quadraticCurveTo(24,-70,14,6);c.closePath();c.fill();c.stroke()}
 c.shadowBlur=0;c.shadowOffsetX=0;c.shadowOffsetY=0;c.strokeStyle='#fff9';c.lineWidth=2;c.beginPath();c.moveTo(-2,16);c.lineTo(-2,91);c.stroke();c.restore();
}
function tableGlass(c,x,y,size=1){
 c.save();c.translate(x,y);c.scale(size,size);tableOval(c,5,64,33,10,'#44354522');
 tableOval(c,0,56,29,9,'#dff6ff38','#d7eaf1aa');c.strokeStyle='#f3faffcc';c.lineWidth=5;c.beginPath();c.moveTo(0,52);c.lineTo(0,5);c.stroke();
 let glass=c.createLinearGradient(-33,-80,33,0);glass.addColorStop(0,'#b6e1f03d');glass.addColorStop(.25,'#ffffffa0');glass.addColorStop(.6,'#b2d7e533');glass.addColorStop(1,'#edfaffaa');
 c.beginPath();c.moveTo(-31,-85);c.bezierCurveTo(-38,-25,-22,5,0,5);c.bezierCurveTo(22,5,38,-25,31,-85);c.closePath();c.fillStyle=glass;c.fill();c.strokeStyle='#f0faffbb';c.lineWidth=2;c.stroke();
 tableOval(c,0,-84,31,9,'#d2f4ff22','#f8ffffcc');tableOval(c,0,-29,24,8,'#edc96988','#ffecae88');
 c.strokeStyle='#fff';c.lineWidth=4;c.beginPath();c.moveTo(-22,-72);c.quadraticCurveTo(-26,-45,-15,-12);c.stroke();
 for(let i=0;i<6;i++)tableOval(c,-10+i*13%22,-25-i*7,1.7,1.7,'#fff5c9');c.restore();
}
function tableBottle(c,x,y,size=1,angle=0){
 c.save();c.translate(x,y);c.rotate(angle);c.scale(size,size);tableOval(c,8,78,37,13,'#2c243d33');
 let bottle=c.createLinearGradient(-35,0,35,0);bottle.addColorStop(0,'#102f29');bottle.addColorStop(.3,'#4a8460');bottle.addColorStop(.5,'#27533f');bottle.addColorStop(1,'#102d2b');
 c.beginPath();c.moveTo(-13,-115);c.lineTo(13,-115);c.lineTo(14,-56);c.bezierCurveTo(15,-35,35,-30,35,-7);c.lineTo(35,65);c.quadraticCurveTo(0,86,-35,65);c.lineTo(-35,-7);c.bezierCurveTo(-35,-30,-15,-35,-14,-56);c.closePath();c.fillStyle=bottle;c.fill();c.strokeStyle='#142d29';c.lineWidth=3;c.stroke();
 let gold=c.createLinearGradient(-15,0,15,0);gold.addColorStop(0,'#a97836');gold.addColorStop(.45,'#fff0a8');gold.addColorStop(1,'#d8b168');c.fillStyle=gold;c.fillRect(-14,-113,28,62);c.strokeStyle='#987d46';c.lineWidth=1;for(let i=0;i<7;i++){c.beginPath();c.moveTo(-12,-107+i*8);c.lineTo(12,-100+i*8);c.stroke()}
 c.fillStyle='#f5e8c6';c.beginPath();c.roundRect(-29,2,58,49,4);c.fill();c.strokeStyle='#c59c55';c.lineWidth=2;c.stroke();c.fillStyle='#674845';c.textAlign='center';c.font='bold 9px sans-serif';c.fillText('SNACKDOWN',0,19);c.font='8px sans-serif';c.fillText('RÉSERVE',0,34);c.fillStyle='#f4d38a';c.font='15px serif';c.fillText('✦',0,-15);
 c.strokeStyle='#c9ffe544';c.lineWidth=5;c.beginPath();c.moveTo(-24,-12);c.lineTo(-24,56);c.stroke();c.restore();
}
function paintRankedTable(c){
 let cloth=c.createLinearGradient(0,0,W,H);cloth.addColorStop(0,'#eadfc5');cloth.addColorStop(.5,'#f8efda');cloth.addColorStop(1,'#d7c8b1');c.fillStyle=cloth;c.fillRect(0,0,W,H);
 c.strokeStyle='#a38c7720';c.lineWidth=1;for(let y=0;y<H;y+=7){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}for(let x=0;x<W;x+=9){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke()}
 for(let y=50;y<H;y+=110)for(let x=60;x<W;x+=110){c.save();c.translate(x,y);c.strokeStyle='#bda68b20';c.lineWidth=2;for(let i=0;i<4;i++){c.rotate(Math.PI/2);c.beginPath();c.ellipse(0,-15,8,17,0,0,Math.PI*2);c.stroke()}c.restore()}
 let runner=c.createLinearGradient(W/2-170,0,W/2+170,0);runner.addColorStop(0,'#67293f');runner.addColorStop(.5,'#963f55');runner.addColorStop(1,'#67293f');c.fillStyle=runner;c.fillRect(W/2-170,0,340,H);
 for(let x of [W/2-163,W/2+163]){c.strokeStyle='#e4bd76';c.lineWidth=4;c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke()}
 for(let y=40;y<H;y+=120){c.save();c.translate(W/2,y);c.rotate(Math.PI/4);c.strokeStyle='#e5b97933';c.strokeRect(-12,-12,24,24);c.restore()}
 tablePlate(c,W/2,H/2,225);
 for(let y of [220,H-220])for(let x of [W/2-380,W/2,W/2+380]){tablePlate(c,x,y,122);tableCutlery(c,x-150,y-40,'fork',0,.8);tableCutlery(c,x+145,y-40,'knife',0,.8)}
 for(let y of [140,H-125]){tableGlass(c,W/2-215,y,.9);tableBottle(c,W/2+570,y+50,.85,.16);tableGlass(c,W/2+480,y-20,.8)}
 c.save();c.translate(W/2,H/2);c.textAlign='center';c.fillStyle='#85704d';c.font='900 43px "Barlow Condensed",sans-serif';c.fillText(rankedSession?.bossFight?'BOSS FIGHT':'RANKED KITCHEN',0,-7);c.font='700 15px sans-serif';c.fillStyle='#aa9369';c.fillText('THE GRAND TABLE',0,23);c.restore();
}
const tableBuildMap=buildMap;buildMap=function(){tableBuildMap();if(onRankedTable())paintRankedTable(baseMap.getContext('2d'))};
const tableDrawBlock=drawBlock;drawBlock=function(b){
 if(!onRankedTable())return tableDrawBlock(b);
 let x=b.x,y=b.y,w=b.w,h=b.h;
 ctx.save();ellipse(x+w/2+5,y+h+7,w*.58,13,'#332d3f3a');rounded(x,y+5,w,h,7,'#a29280','#645d66',2);rounded(x,y-10,w,h,7,gradient(x,y,w,h,['#ece8df','#b8bbc3']),'#6d6d79',3);
 let index=blocks.indexOf(b);
 if(index%3===0){for(let i=0;i<3;i++)tablePlate(ctx,x+w*.5,y+h*.45-i*7,Math.min(w*.46,h*.7))}
 else if(index%3===1){let scale=Math.min(w/90,h/110);tableBottle(ctx,x+w*.5,y+h*.52,scale*.66);if(w>110)tableGlass(ctx,x+w*.22,y+h*.58,scale*.45)}
 else{ctx.save();ctx.beginPath();ctx.rect(x+4,y-7,w-8,h-5);ctx.clip();for(let i=0;i<Math.max(2,Math.floor(w/25));i++)tableCutlery(ctx,x+16+i*25,y+h*.35,i%2?'knife':'fork',.15,.5);ctx.restore()}
 ctx.restore();
};
const tableDrawBush=drawBush;drawBush=function(b,foreground=false){
 if(!onRankedTable())return tableDrawBush(b,foreground);
 ctx.save();ctx.globalAlpha=foreground?.85:1;
 ellipse(b.x+b.w/2,b.y+b.h,b.w*.55,12,'#332d3f30');
 for(let yy=0;yy<b.h;yy+=38)for(let xx=0;xx<b.w;xx+=44){let x=b.x+xx,y=b.y+yy;
  ctx.beginPath();ctx.moveTo(x,y+35);ctx.lineTo(x+23,y-13);ctx.lineTo(x+44,y+35);ctx.closePath();ctx.fillStyle=gradient(x,y,44,40,['#9b526b','#542f4b']);ctx.fill();ctx.strokeStyle='#d79bb1';ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.moveTo(x+23,y-10);ctx.lineTo(x+25,y+32);ctx.lineTo(x+7,y+32);ctx.closePath();ctx.fillStyle='#bd7189';ctx.fill();ctx.strokeStyle='#efd4be88';ctx.beginPath();ctx.moveTo(x+4,y+31);ctx.lineTo(x+39,y+31);ctx.stroke();
 }
 ctx.restore();
};

const tableMinimap=drawMinimap;drawMinimap=function(radius){
 if(!onRankedTable())return tableMinimap(radius);
 let canvas=document.getElementById('minimap');if(!canvas)return;let c=canvas.getContext('2d'),sx=160/W,sy=116/H;
 c.clearRect(0,0,160,116);c.fillStyle='#e9ddc4';c.fillRect(0,0,160,116);c.fillStyle='#84384e';c.fillRect((W/2-170)*sx,0,340*sx,116);c.fillStyle='#b0a494';for(let b of blocks)c.fillRect(b.x*sx,b.y*sy,b.w*sx,b.h*sy);c.fillStyle='#9b526b';for(let b of bushes)c.fillRect(b.x*sx,b.y*sy,b.w*sx,b.h*sy);c.strokeStyle='#ff9ba1';c.lineWidth=2;if(Number.isFinite(radius)){c.beginPath();c.arc(80,58,radius*sx,0,Math.PI*2);c.stroke()}for(let a of actors){if(!a.alive||!isFriendlyToPlayer(a)&&hiddenInBush(a,player))continue;tableOval(c,a.x*sx,a.y*sy,a===player?3.5:2,a===player?3.5:2,a===player?'#c8ff76':isFriendlyToPlayer(a)?'#65d9ff':'#ff7868')}
};
