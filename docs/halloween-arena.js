function halloweenLantern(c,x,y,size=35,scary=false){
 c.save();c.translate(x,y);c.shadowColor='#ff9c31';c.shadowBlur=12;
 for(let i=-1;i<=1;i++){c.beginPath();c.ellipse(i*size*.35,0,size*.5,size*.57,0,0,Math.PI*2);let g=c.createLinearGradient(-size,-size,size,size);g.addColorStop(0,scary?'#292034':'#ffc268');g.addColorStop(1,scary?'#080710':'#c45123');c.fillStyle=g;c.fill();c.strokeStyle='#a9522c';c.lineWidth=2;c.stroke()}
 c.shadowBlur=0;c.fillStyle='#609052';c.fillRect(-size*.1,-size*.83,size*.2,size*.32);c.fillStyle='#ffed8e';c.shadowColor='#ffc946';c.shadowBlur=8;
 for(let sign of [-1,1]){c.beginPath();c.moveTo(sign*size*.15,-size*.15);c.lineTo(sign*size*.5,-size*.23);c.lineTo(sign*size*.4,size*.08);c.closePath();c.fill()}
 c.beginPath();c.moveTo(-size*.5,size*.19);c.lineTo(-size*.22,size*.3);c.lineTo(0,size*.24);c.lineTo(size*.22,size*.3);c.lineTo(size*.5,size*.19);c.lineTo(size*.3,size*.43);c.lineTo(-size*.3,size*.43);c.closePath();c.fill();c.restore();
}
function paintHalloweenArena(c){
 let ground=c.createLinearGradient(0,0,W,H);ground.addColorStop(0,'#392744');ground.addColorStop(.5,'#574452');ground.addColorStop(1,'#29263f');c.fillStyle=ground;c.fillRect(0,0,W,H);
 for(let y=0;y<H;y+=78)for(let x=0;x<W;x+=112){let shift=(y/78%2)*56;c.fillStyle=(x+y)%3?'#8d76821c':'#a08d9522';c.beginPath();c.roundRect(x+shift+4,y+4,102,65,12);c.fill();c.strokeStyle='#15132744';c.lineWidth=3;c.stroke()}
 for(let i=0;i<60;i++){let x=(i*367+40)%W,y=(i*229+30)%H;c.save();c.translate(x,y);c.rotate(i*1.3);c.fillStyle=['#bd6b2f','#ad8a48','#7859a4'][i%3];c.beginPath();c.ellipse(0,0,8,3,0,0,Math.PI*2);c.fill();c.restore()}
 for(let x of [60,W-60])for(let y=120;y<H;y+=260){halloweenLantern(c,x,y,36);c.strokeStyle='#94739b44';c.lineWidth=2;for(let i=0;i<6;i++){c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(i*Math.PI/3)*100,y+Math.sin(i*Math.PI/3)*100);c.stroke()}for(let radius of [35,65,90]){c.beginPath();c.arc(x,y,radius,0,Math.PI*2);c.stroke()}}
 c.save();c.translate(W/2,H/2);c.rotate(-.08);c.textAlign='center';c.fillStyle='#e0a25a55';c.font='900 78px "Barlow Condensed",sans-serif';c.fillText('HAUNTED HARVEST',0,0);c.font='bold 23px sans-serif';c.fillStyle='#c4a2dd66';c.fillText('TWO TEAMS. ONE SPOOKY WIN STREAK.',0,38);c.restore();
 for(let y of [180,H-180])for(let x of [W/2-260,W/2+260]){c.strokeStyle=y<H/2?'#d3847055':'#84b7d555';c.lineWidth=4;c.beginPath();c.ellipse(x,y,85,45,0,0,Math.PI*2);c.stroke()}
}
const halloweenTable=onRankedTable;onRankedTable=function(){return !inHalloweenMatch()&&halloweenTable()};
const halloweenMap=buildMap;buildMap=function(){halloweenMap();if(inHalloweenMatch())paintHalloweenArena(baseMap.getContext('2d'))};
const halloweenBlock=drawBlock;drawBlock=function(b){
 if(!inHalloweenMatch())return halloweenBlock(b);
 let x=b.x,y=b.y,w=b.w,h=b.h;ctx.save();ellipse(x+w/2+6,y+h+8,w*.56,12,'#11112666');rounded(x,y+7,w,h,9,'#302c43','#201b30',3);rounded(x,y-14,w,h,Math.min(20,w/3),gradient(x,y,w,h,['#928394','#514b63']),'#34283f',3);ctx.strokeStyle='#c9b7cf55';ctx.lineWidth=2;ctx.strokeRect(x+8,y-6,w-16,h-17);
 if(w>80){ctx.fillStyle='#34293f';ctx.font='bold '+Math.min(24,h*.4)+'px serif';ctx.textAlign='center';ctx.fillText('R.I.P.',x+w/2,y+h*.45);ctx.strokeStyle='#a59caf55';ctx.beginPath();ctx.moveTo(x+w*.7,y-5);ctx.lineTo(x+w*.57,y+h*.25);ctx.lineTo(x+w*.7,y+h*.45);ctx.stroke()}else halloweenLantern(ctx,x+w/2,y+h*.4,Math.min(w*.32,25),true);
 ctx.restore();
};
const halloweenBush=drawBush;drawBush=function(b,foreground=false){
 if(!inHalloweenMatch())return halloweenBush(b,foreground);
 ctx.save();ctx.globalAlpha=foreground?.85:1;ellipse(b.x+b.w/2,b.y+b.h,b.w*.56,15,'#13112b55');
 for(let y=0;y<b.h;y+=34)for(let x=0;x<b.w;x+=38){let px=b.x+x+18,py=b.y+y+7;ellipse(px,py+8,23,15,'#29463d',.3);ellipse(px-8,py,10,20,'#46614b',-.5);ellipse(px+10,py,11,21,'#557147',.5);halloweenLantern(ctx,px,py,13,(x+y)%3===0)}ctx.restore();
};
const halloweenMinimap=drawMinimap;drawMinimap=function(radius){if(!inHalloweenMatch())return halloweenMinimap(radius);let canvas=$('minimap'),c=canvas.getContext('2d'),sx=160/W,sy=116/H;c.clearRect(0,0,160,116);c.fillStyle='#49364e';c.fillRect(0,0,160,116);c.fillStyle='#a896ac';for(let b of blocks)c.fillRect(b.x*sx,b.y*sy,b.w*sx,b.h*sy);c.fillStyle='#c58a43';for(let b of bushes)c.fillRect(b.x*sx,b.y*sy,b.w*sx,b.h*sy);for(let a of actors)if(a.alive&&(isFriendlyToPlayer(a)||!hiddenInBush(a,player))){c.fillStyle=a===player?'#d3ff94':a.team===0?'#78dbff':'#ff9a66';c.beginPath();c.arc(a.x*sx,a.y*sy,a===player?3.5:2,0,Math.PI*2);c.fill()}};
