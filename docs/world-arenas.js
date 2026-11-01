let soloArenaWorld=null;
const WORLD_ARENA_STYLES=[
['#6c9b55','#86ad64','#b98e64','flowers'],['#9ba65d','#b4b76e','#a88350','corn'],
['#bc8c65','#cda17a','#8d634c','tiles'],['#bb7370','#e1b78c','#985746','checker'],
['#65945e','#79a96a','#aa825c','garden'],['#66756c','#839080','#d2b548','factory'],
['#81739a','#aaa0b8','#d4b278','marble'],['#c28cb9','#e1afd2','#a779ab','candy'],
['#70403b','#915043','#d67a49','lava'],['#386b51','#4e8060','#a6ba70','forest'],
['#857b75','#a49a8a','#c7b49b','stone'],['#d6b078','#e8c890','#76adb0','waffle'],
['#766143','#95804d','#f0c956','cheese'],['#476958','#62816a','#aab872','swamp'],
['#b57650','#cb9260','#e7bb81','canyon'],['#a5bbc2','#c6d8d9','#d3b67b','cereal'],
['#b8905a','#d0ac70','#e9ce91','pancake'],['#9c6861','#bc8d79','#e5b793','bacon'],
['#477954','#649362','#b7c77d','pickle'],['#86afc2','#afd0db','#def1ef','ice'],
['#aaa1cd','#c9bfe1','#e9dbef','cloud']
];
function arenaStyle(){return soloArenaWorld?WORLD_ARENA_STYLES[CALORIE_WORLDS.indexOf(soloArenaWorld)]||WORLD_ARENA_STYLES.at(-1):null}
function arenaEllipse(c,x,y,rx,ry,color,angle=0){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,angle,0,Math.PI*2);c.fill()}
function arenaTulip(c,x,y,color,size=1){c.save();c.translate(x,y);c.scale(size,size);c.strokeStyle='#386b37';c.lineWidth=3;c.beginPath();c.moveTo(0,8);c.lineTo(0,-11);c.stroke();arenaEllipse(c,-5,0,7,3,'#67a449',-.6);arenaEllipse(c,5,-3,7,3,'#81b85a',.6);c.fillStyle=color;c.beginPath();c.moveTo(-9,-21);c.lineTo(-3,-16);c.lineTo(0,-23);c.lineTo(4,-16);c.lineTo(9,-21);c.bezierCurveTo(11,-4,-10,-4,-9,-21);c.fill();c.strokeStyle='#fff4d688';c.lineWidth=1.5;c.beginPath();c.moveTo(-5,-17);c.lineTo(-4,-12);c.stroke();c.restore()}
function arenaCorn(c,x,y,size=1){c.save();c.translate(x,y);c.scale(size,size);c.strokeStyle='#537338';c.lineWidth=4;c.beginPath();c.moveTo(0,10);c.lineTo(0,-25);c.stroke();arenaEllipse(c,-7,-3,12,4,'#6f983c',.5);arenaEllipse(c,7,-10,12,4,'#88a84c',-.5);arenaEllipse(c,0,-22,6,14,'#f2c452',.12);for(let i=0;i<4;i++)for(let j=0;j<2;j++)arenaEllipse(c,j*4-2,-30+i*5,1.6,2,'#ffe896');c.restore()}
function paintWorldArena(c,world){
  let [base,light,accent,pattern]=arenaStyle();c.fillStyle=base;c.fillRect(0,0,W,H);
  // Low contrast ground textures keep the fighting surface easy to read.
  for(let y=0;y<H;y+=90)for(let x=0;x<W;x+=120){let seed=(x/120*17+y/90*31),shade=seed%3===0?light:base;c.fillStyle=shade;c.globalAlpha=.3;c.fillRect(x+2,y+2,116,86);c.globalAlpha=1;
    if(['flowers','corn','garden','forest','pickle'].includes(pattern)){c.strokeStyle='#263d2833';c.lineWidth=2;c.beginPath();c.moveTo(x,y+72);c.quadraticCurveTo(x+60,y+67,x+120,y+72);c.stroke();for(let i=0;i<3;i++)arenaEllipse(c,x+20+i*31,y+24+(seed+i)%24,3,1,'#c9d39833',i)}
    else if(pattern==='checker'){c.globalAlpha=.28;c.fillStyle=(seed%2)?'#ffe3b0':'#904b50';c.fillRect(x,y,120,90);c.globalAlpha=1}
    else if(['tiles','marble','factory'].includes(pattern)){c.strokeStyle=pattern==='factory'?'#35464255':'#493b5233';c.lineWidth=2;c.strokeRect(x+3,y+3,114,84);if(pattern==='marble'){c.strokeStyle='#d9cee244';c.beginPath();c.moveTo(x+10,y+10);c.bezierCurveTo(x+25,y+65,x+85,y+15,x+110,y+78);c.stroke()}}
    else if(pattern==='waffle'){c.strokeStyle='#a4783d33';c.lineWidth=5;for(let i=1;i<4;i++){c.beginPath();c.moveTo(x+i*30,y);c.lineTo(x+i*30,y+90);c.stroke()}for(let i=1;i<3;i++){c.beginPath();c.moveTo(x,y+i*30);c.lineTo(x+120,y+i*30);c.stroke()}}
    else if(pattern==='cheese'){for(let i=0;i<3;i++){let px=x+20+i*37,py=y+18+(seed+i*17)%50;arenaEllipse(c,px,py,7+i*2,4+i, '#493c362b');arenaEllipse(c,px,py-1,5+i*2,2+i,'#d2b45b33')}}
    else if(['lava','ice','stone'].includes(pattern)){c.strokeStyle=pattern==='lava'?'#f79a4c44':pattern==='ice'?'#ebffff55':'#423d4430';c.lineWidth=pattern==='lava'?2:1;c.beginPath();c.moveTo(x+10,y+18);c.lineTo(x+36,y+32);c.lineTo(x+51,y+22);c.lineTo(x+80,y+58);c.stroke()}
    else if(pattern==='canyon'||pattern==='bacon'){c.strokeStyle=pattern==='bacon'?'#eed0a655':'#e3b37944';c.lineWidth=pattern==='bacon'?8:3;c.beginPath();c.moveTo(x,y+30);c.bezierCurveTo(x+35,y+5,x+75,y+55,x+120,y+30);c.stroke()}
    else if(pattern==='swamp'){if(seed%3===0){arenaEllipse(c,x+50,y+40,39,16,'#254d4d55');arenaEllipse(c,x+53,y+37,27,8,'#aacd8b20')}}
    else if(pattern==='cereal'){if(seed%3===0){c.strokeStyle=['#e0bb87','#c18c8a','#d5c56d'][seed%3];c.lineWidth=5;c.beginPath();c.ellipse(x+50,y+40,12,9,seed,0,Math.PI*2);c.stroke()}}
    else if(pattern==='pancake'){if(seed%4===0){arenaEllipse(c,x+55,y+45,35,22,'#855c3633');arenaEllipse(c,x+55,y+41,33,21,'#e6c28640');c.fillStyle='#fff0ad55';c.fillRect(x+48,y+34,12,9)}}
    else if(pattern==='cloud'){if(seed%3===0){arenaEllipse(c,x+40,y+45,35,17,'#ffffff26');arenaEllipse(c,x+61,y+34,22,20,'#fff2ff26')}}
    else if(pattern==='candy'){if(seed%3===0){c.strokeStyle='#fff3e933';c.lineWidth=4;c.beginPath();c.arc(x+50,y+45,15,0,Math.PI*1.7);c.stroke()}}
  }
  // Gardens grow in planted beds at the edges, beyond the combat silhouettes.
  if(['flowers','corn','garden'].includes(pattern))for(let side of [0,1])for(let y=100;y<H-50;y+=100){let x=side?W-92:45;c.fillStyle='#79563c';c.fillRect(x-18,y-25,60,56);c.strokeStyle='#c3a477';c.lineWidth=3;c.strokeRect(x-18,y-25,60,56);for(let i=0;i<3;i++)pattern==='corn'?arenaCorn(c,x+i*15,y+10,.9):arenaTulip(c,x+i*15,y+10,['#f792b9','#ffce68','#eab4ed'][(i+y/100)%3],.95)}
  c.save();c.translate(W/2,H/2-65);c.rotate(-.13);c.globalAlpha=.14;c.fillStyle='#fff4db';c.textAlign='center';c.font='900 80px "Barlow Condensed",Impact';c.fillText(world.name.toUpperCase(),0,0);c.font='800 25px sans-serif';c.fillText('SNACKDOWN · SOLO',0,43);c.restore();
  let vignette=c.createRadialGradient(W/2,H/2,200,W/2,H/2,W*.7);vignette.addColorStop(0,'#0000');vignette.addColorStop(1,'#152a3040');c.fillStyle=vignette;c.fillRect(0,0,W,H);
}
const worldArenaBuild=buildMap;buildMap=function(){worldArenaBuild();if(soloArenaWorld&&!practice&&!rankedMode&&!rankedSession)paintWorldArena(baseMap.getContext('2d'),soloArenaWorld)};
const worldArenaBush=drawBush;drawBush=function(b,foreground=false){worldArenaBush(b,foreground);let style=arenaStyle();if(!style)return;let pattern=style[3];ctx.save();if(['flowers','corn','garden','pickle','forest'].includes(pattern)){ctx.globalAlpha=foreground?.85:1;for(let y=b.y+8;y<b.y+b.h-8;y+=31)for(let x=b.x+12;x<b.x+b.w-6;x+=30){let i=Math.floor((x+y)/30);if(pattern==='corn')arenaCorn(ctx,x,y,1.05);else if(pattern==='flowers'||pattern==='garden')arenaTulip(ctx,x,y,['#ff9fc9','#ffd87a','#e3b5ff'][Math.abs(i)%3],.95);else if(pattern==='pickle')arenaEllipse(ctx,x,y-4,5,16,'#afce60',.3);else arenaEllipse(ctx,x,y-8,13,11,'#8fbc5d')}}ctx.restore()};
const worldArenaBlock=drawBlock;drawBlock=function(b){worldArenaBlock(b);let style=arenaStyle();if(!style)return;ctx.save();ctx.globalAlpha=.2;ctx.fillStyle=style[2];ctx.fillRect(b.x+3,b.y-9,b.w-6,b.h-14);ctx.restore()};
const worldArenaBadge=document.createElement('div');worldArenaBadge.id='worldArenaBadge';worldArenaBadge.hidden=true;worldArenaBadge.style.cssText='position:absolute;left:50%;bottom:48px;font-size:13px;text-align:center;max-width:60vw;transform:translateX(-50%);padding:6px 15px;border:1px solid #ffffff55;border-radius:20px;background:#182d36c9;color:#fff3d7;font-weight:800;letter-spacing:1px;pointer-events:none;z-index:5';$('arena').appendChild(worldArenaBadge);
function syncWorldArenaBadge(){worldArenaBadge.hidden=!soloArenaWorld||practice||!!rankedSession;if(soloArenaWorld)worldArenaBadge.textContent=soloArenaWorld.icon+' '+soloArenaWorld.name.toUpperCase()}
const worldArenaStart=start;start=function(){soloArenaWorld=!practice&&!rankedMode&&!rankedSession?calorieWorld(saved.calories):null;worldArenaStart();syncWorldArenaBadge()};
const worldArenaRound=startRankedRound;startRankedRound=function(){soloArenaWorld=null;worldArenaRound();syncWorldArenaBadge()};
const worldArenaHome=home;home=function(){soloArenaWorld=null;worldArenaBadge.hidden=true;worldArenaHome()};
