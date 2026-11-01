// Every theme replaces the scenery itself, while keeping collision and cover bounds.
const WORLD_PROP_THEMES=[
['Tulip beds','Terracotta planters','Seed sacks','#d6a078','#86553e','#ffadc9','flowers'],
['Corn stalks','Hay bales','Harvest baskets','#e6c65e','#9c7638','#fff0a0','corn'],
['Flour sacks & wheat','Baguette stacks','Flour bags','#e6bd86','#a36b40','#fff1ca','bakery'],
['French fries','Burger stacks','Takeaway cartons','#f4c16b','#a95f3e','#ffe99b','fries'],
['Carrot tops','Raised garden beds','Vegetable baskets','#bd9365','#755139','#a9d974','garden'],
['Banana bunches','Factory containers','Banana shipping drums','#bac7ae','#5e756d','#ffe67c','factory'],
['Royal topiary','Marble counters','Golden serving cases','#e9e1ef','#8a78a5','#f4d17b','royal'],
['Cotton candy','Candy-cane blocks','Wrapped candy gifts','#ffc6e6','#b76aa6','#aeeeff','candy'],
['Fiery pepper shrubs','Volcanic basalt','Charred supply barrels','#6c4d4b','#382b35','#ff9650','lava'],
['Broccoli crowns','Root-covered logs','Forest seed pods','#b39768','#65523e','#79bd6e','broccoli'],
['Potato clusters','Potato boulders','Potato sacks','#c9b193','#7c6b5e','#f5d49b','potato'],
['Cream & waffle sticks','Waffle slabs','Syrup crates','#e9be76','#9e7449','#fff0d0','waffle'],
['Glowing cave mushrooms','Swiss cheese rocks','Cheese wheels','#ffe083','#b98a3e','#fff6b0','cheese'],
['Moldy mushrooms','Moss-covered logs','Swamp jars','#8b9f6d','#4d6150','#c5dd8a','swamp'],
['Caramel crystals','Caramel cliffs','Caramel jars','#e8b379','#a3653d','#ffe0a1','caramel'],
['Cereal clusters','Cereal bars','Cereal cartons','#dfc59b','#9e7d5e','#e4f1ec','cereal'],
['Cream & berries','Pancake stacks','Butter boxes','#edcf94','#a47e4f','#fff0bd','pancake'],
['Crispy bacon strips','Bacon slabs','Smoked supply tins','#d69c88','#8f4e49','#ffe0b5','bacon'],
['Pickle vines','Pickle jar walls','Pickle jars','#b1cf83','#62844f','#e2eeab','pickle'],
['Frozen popsicles','Ice blocks','Ice cream cartons','#c2edf4','#6fa2bf','#f5fdff','ice'],
['Marshmallow clouds','Marshmallow pillows','Cloud candy boxes','#f6e5f5','#bb9ec9','#fffaff','cloud']
];
function worldPropTheme(){return soloArenaWorld?WORLD_PROP_THEMES[CALORIE_WORLDS.indexOf(soloArenaWorld)]||WORLD_PROP_THEMES.at(-1):null}
function propShade(hex,factor=.72){return '#'+hex.slice(1).match(/../g).map(v=>Math.round(parseInt(v,16)*factor).toString(16).padStart(2,'0')).join('')}
function propRound(x,y,w,h,r,top,edge='#503c4155'){rounded(x,y,w,h,r,top,edge,2)}
function propStripe(x,y,w,h,color,gap=15){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.strokeStyle=color;ctx.lineWidth=5;for(let i=-h;i<w+h;i+=gap){ctx.beginPath();ctx.moveTo(x+i,y+h);ctx.lineTo(x+i+h,y);ctx.stroke()}ctx.restore()}
function propPuff(x,y,color,highlight,size=14){ellipse(x,y+6,size*1.08,size*.55,'#24303a25');ellipse(x,y,size,size*.78,color);ellipse(x-size*.5,y-size*.4,size*.7,size*.7,color);ellipse(x+size*.42,y-size*.4,size*.73,size*.68,color);ellipse(x,y-size*.66,size*.8,size*.62,highlight);ctx.strokeStyle='#ffffff45';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x-2,y-size*.4,size*.45,3.2,5);ctx.stroke()}
function propLeaf(x,y,color,angle=0){ellipse(x,y,7,19,color,angle);ctx.strokeStyle='#e9f7c64d';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y+10);ctx.lineTo(x,y-12);ctx.stroke()}
function propCrystal(x,y,color,size=25){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x-size*.4,y+10);ctx.lineTo(x-size*.5,y-size*.5);ctx.lineTo(x,y-size);ctx.lineTo(x+size*.5,y-size*.45);ctx.lineTo(x+size*.35,y+10);ctx.closePath();ctx.fill();ctx.strokeStyle='#ffffff88';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y-size);ctx.lineTo(x+2,y+7);ctx.stroke()}
function propMotif(type,x,y,w,h,accent){
  ctx.save();ctx.strokeStyle=accent;ctx.fillStyle=accent;ctx.lineWidth=3;
  if(['candy','factory','bacon'].includes(type)){propStripe(x+3,y+3,w-6,h-6,type==='candy'?'#fff4f4':type==='bacon'?'#ffe0b5':'#e4c252',type==='bacon'?22:18)}
  else if(['cheese','potato'].includes(type)){for(let i=0;i<5;i++){let px=x+12+i*23%(Math.max(12,w-22)),py=y+10+i*17%Math.max(10,h-18);ellipse(px,py,type==='cheese'?7:3,type==='cheese'?5:2,type==='cheese'?'#b87b34':'#8c7055');if(type==='cheese')ellipse(px-1,py-1,4,2,'#e7b94c')}}
  else if(['waffle','cereal'].includes(type)){for(let yy=y+9;yy<y+h-5;yy+=16)for(let xx=x+9;xx<x+w-5;xx+=18)if(type==='waffle')propRound(xx-4,yy-3,11,9,2,'#a77b452f');else{ctx.strokeStyle=['#eac467','#dc9a9c','#a6c39c'][Math.abs(Math.floor(xx+yy))%3];ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(xx,yy,6,4,0,0,Math.PI*2);ctx.stroke()}}
  else if(['pancake','bakery','caramel'].includes(type)){for(let i=0;i<3;i++){ctx.strokeStyle=type==='bakery'?'#a9764755':accent;ctx.lineWidth=type==='bakery'?4:3;ctx.beginPath();ctx.moveTo(x+10+i*18,y+8);ctx.lineTo(x+19+i*18,y+h-10);ctx.stroke()}if(type==='pancake')propRound(x+w*.4,y+h*.3,16,11,2,'#fff0a0')}
  else if(type==='lava'||type==='ice'){for(let i=0;i<3;i++){let px=x+10+i*w*.27;ctx.strokeStyle=type==='lava'?'#ff9c4f':'#f3feff';ctx.beginPath();ctx.moveTo(px,y+3);ctx.lineTo(px+9,y+h*.4);ctx.lineTo(px+2,y+h*.55);ctx.lineTo(px+14,y+h-3);ctx.stroke()}}
  else if(type==='cloud'){for(let i=0;i<3;i++)propRound(x+5+i*w/3,y+6,w/3-9,h-12,9,'#fff5ff66')}
  else if(type==='royal'){ctx.strokeStyle='#e8c984';ctx.strokeRect(x+7,y+7,w-14,h-14);ctx.beginPath();ctx.moveTo(x+w/2-10,y+h/2+4);ctx.lineTo(x+w/2-12,y+h/2-9);ctx.lineTo(x+w/2,y+h/2-2);ctx.lineTo(x+w/2+12,y+h/2-9);ctx.lineTo(x+w/2+10,y+h/2+4);ctx.closePath();ctx.fill()}
  else if(type==='pickle'){for(let i=0;i<3;i++){let px=x+12+i*(w-24)/2;ellipse(px,y+h/2,6,h*.3,'#668c48',-.12);for(let n=0;n<3;n++)ellipse(px+2,y+12+n*9,1.5,2,'#badc80')}}
  else if(type==='fries'){for(let i=0;i<5;i++)ellipse(x+10+i*13%(w-15),y+8+i*11%(h-12),2,4,'#fff0bd',i)}
  else{ctx.strokeStyle=type==='corn'?'#f8df87':'#694d3744';for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(x+5,y+8+i*12);ctx.lineTo(x+w-5,y+8+i*12);ctx.stroke()}if(['flowers','garden','broccoli','swamp'].includes(type))for(let i=0;i<3;i++)propLeaf(x+16+i*17,y+h*.5,'#8eae5a',i-.6)}
  ctx.restore();
}
const themedObstacle=drawBlock;drawBlock=function(b){let t=worldPropTheme();if(!t)return themedObstacle(b);let [,,,top,front,accent,type]=t,x=b.x,y=b.y,w=b.w,h=b.h;
  ellipse(x+w*.5+6,y+h+9,w*.6,12,'#1a273944');propRound(x,y+7,w,h,8,gradient(x,y,0,h,[front,propShade(front)]),front);propRound(x,y-12,w,h-7,type==='cloud'?15:8,gradient(x,y,w,h,[top,front]),front);ctx.strokeStyle='#fff6df88';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+9,y-8);ctx.lineTo(x+w-9,y-8);ctx.stroke();
  propMotif(type,x+2,y-10,w-4,h-9,accent);
  if(['flowers','garden'].includes(type)){propRound(x+5,y-8,w-10,h-16,4,'#604a38');for(let xx=x+16;xx<x+w-8;xx+=23)type==='flowers'?arenaTulip(ctx,xx,y+15,accent,.8):propLeaf(xx,y+8,'#8aba60',.3)}
  if(type==='broccoli'||type==='swamp'){for(let xx=x+9;xx<x+w;xx+=22)ellipse(xx,y-4,13,6,type==='broccoli'?'#72a34c':'#9aaf72')}
  if(type==='caramel'){ctx.strokeStyle='#f7cc8e';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x+8,y+2);ctx.bezierCurveTo(x+10,y+35,x+21,y+26,x+21,y+7);ctx.stroke()}
};
const themedCover=drawBush;drawBush=function(b,foreground=false){let t=worldPropTheme();if(!t)return themedCover(b,foreground);let [,,,,,accent,type]=t;ctx.save();ctx.globalAlpha=foreground?.85:1;ellipse(b.x+b.w/2,b.y+b.h-2,b.w*.55,15,'#192d3438');
  for(let yy=0;yy<b.h;yy+=25)for(let xx=0;xx<b.w;xx+=25){let seed=Math.floor(xx+yy),x=b.x+xx+12+Math.sin(seed)*3,y=b.y+yy+6+Math.sin(elapsed*1.8+xx)*1.2;
    if(type==='flowers'||type==='garden'){propLeaf(x-4,y+2,'#75a956',-.4);propLeaf(x+5,y+2,'#97bb5c',.4);if(type==='flowers')arenaTulip(ctx,x,y,['#ffb4d1','#ffe28e','#e8bfff'][Math.abs(seed)%3],1.1);else{ellipse(x,y+1,5,11,'#e59c50');propLeaf(x,y-13,'#94bd61',.2)}}
    else if(type==='corn')arenaCorn(ctx,x,y,1.35);
    else if(type==='candy')propPuff(x,y,['#eea6d8','#91d9ed','#c4a7ed'][Math.abs(Math.floor(xx/25+yy/25))%3],'#ffe0f0',17);
    else if(type==='cloud')propPuff(x,y,'#e4cfe9','#fff5ff',18);
    else if(type==='broccoli'||type==='royal'){ctx.fillStyle='#719353';ctx.fillRect(x-4,y,8,15);propPuff(x,y-6,type==='broccoli'?'#4e955b':'#5f8b63',type==='broccoli'?'#8ec578':'#a0c88b',16)}
    else if(type==='fries'){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(seed)*.12);propRound(-4,-28,9,39,2,gradient(0,-25,6,35,['#ffe896','#d99a43']));ctx.restore()}
    else if(type==='bakery'){propRound(x-10,y-16,22,30,8,'#e9d7b0');ctx.strokeStyle='#a78959';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-8,y-9);ctx.lineTo(x+8,y-9);ctx.stroke();arenaCorn(ctx,x,y-9,.55)}
    else if(type==='factory'){for(let i=0;i<3;i++){ctx.strokeStyle=i===1?'#ffe780':'#e1b943';ctx.lineWidth=7;ctx.beginPath();ctx.arc(x+i*3,y-7,12,-1,1.6);ctx.stroke()}propLeaf(x,y-22,'#79a564',.6)}
    else if(type==='potato'){ellipse(x,y+2,11,15,'#9f8765',.3);ellipse(x-1,y-2,10,13,'#cfb68b',.3);ellipse(x-5,y-3,2,2,'#9e7e59');ellipse(x+4,y+4,2,2,'#9e7e59')}
    else if(type==='waffle'||type==='pancake'){propPuff(x,y,'#e9d6ae','#fff1d1',15);if(type==='waffle'){propRound(x-3,y-28,9,24,2,'#c89b57');ctx.strokeStyle='#f0cd8f';ctx.lineWidth=1;ctx.strokeRect(x-1,y-24,5,4)}else ellipse(x+7,y-15,4,4,'#77749c')}
    else if(type==='swamp'||type==='cheese'){ctx.fillStyle=type==='swamp'?'#b6b18b':'#dfc582';ctx.fillRect(x-3,y-12,6,24);ellipse(x,y-12,15,9,type==='swamp'?'#8d9e77':'#edcc67');ellipse(x-4,y-14,3,2,accent);ellipse(x+7,y-12,2,2,accent)}
    else if(type==='caramel'||type==='ice')propCrystal(x,y,type==='caramel'?'#edbe7c':['#b3e8ed','#cbdff7','#ecf7ff'][Math.abs(seed)%3],26);
    else if(type==='cereal'){propPuff(x,y,'#d1ae76','#ecd1a0',13);ctx.strokeStyle=['#e5a8af','#b7c87e','#e8d389'][Math.abs(seed)%3];ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(x,y-9,7,5,0,0,Math.PI*2);ctx.stroke()}
    else if(type==='bacon'){ctx.strokeStyle='#d68f7d';ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(x-5,y+12);ctx.bezierCurveTo(x+12,y-2,x-10,y-12,x+3,y-27);ctx.stroke();ctx.strokeStyle='#ffe2bf';ctx.lineWidth=3;ctx.stroke()}
    else if(type==='pickle'){propLeaf(x,y-1,'#729b55',-.25);propLeaf(x+6,y-3,'#b1d17a',.3);for(let i=0;i<4;i++)ellipse(x+2,y-15+i*7,2,2,'#e0e6a0')}
    else if(type==='lava'){propLeaf(x,y-4,'#b8624f',-.3);propLeaf(x+7,y-8,'#e78956',.3);propCrystal(x-5,y+4,'#f3b65b',16)}
  }ctx.restore();
};
const themedCrate=drawCrate;drawCrate=function(b){let t=worldPropTheme();if(!t)return themedCrate(b);let [,,,top,front,accent,type]=t,x=b.x,y=b.y;ellipse(x+27,y+52,33,10,'#19263244');let round=['bakery','potato','cheese','pickle','swamp'].includes(type)?12:5;propRound(x,y+3,52,48,round,front,front);propRound(x,y-8,52,45,round,gradient(x,y,52,45,[top,front]),front);propMotif(type,x+4,y-5,44,37,accent);
  if(type==='candy'){ctx.fillStyle='#fff1cb';ctx.fillRect(x+22,y-8,8,47);ctx.fillRect(x,y+9,52,7);ellipse(x+20,y-11,9,5,'#fff1cb',.3);ellipse(x+33,y-11,9,5,'#fff1cb',-.3)}
  else if(type==='pickle'||type==='swamp'){propRound(x-1,y-12,54,9,3,accent);ctx.strokeStyle='#ffffff66';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+7,y-1);ctx.lineTo(x+7,y+25);ctx.stroke()}
  else if(type==='factory'){ctx.fillStyle='#4e625c';ctx.fillRect(x,y+2,52,5);ctx.fillRect(x,y+27,52,5)}
  else if(['flowers','corn','garden','broccoli'].includes(type)){ctx.strokeStyle=accent;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+4,y+31);ctx.lineTo(x+47,y-2);ctx.stroke()}
  if(b.hp<b.max){propRound(x,y-22,52,5,2,'#303446');propRound(x,y-22,52*Math.max(0,b.hp/b.max),5,2,'#ffe4a0')}
};
