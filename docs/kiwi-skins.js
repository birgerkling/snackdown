const KIWI_SKINS=[
{id:'kiwi-dojo',food:KIWI,atlas:10,asset:'kiwi-dojo.png',name:'Dojo Kiwi',rarity:'COMMON',price:100,color:'#eee6ce',note:'A cotton karate gi, red headband, wrist wraps and bamboo grapple spool.'},
{id:'kiwi-pitstop',food:KIWI,atlas:10,asset:'kiwi-pitstop.png',name:'Pitstop Kiwi',rarity:'UNCOMMON',price:130,color:'#ffab50',note:'A racing helmet, pit-crew overalls, tire-soled boots and mechanical cable winch.'},
{id:'exclusive-12',food:KIWI,atlas:10,asset:'kiwi-stormblade.png',name:'Stormblade Kiwi',rarity:'LEGENDARY',price:500,color:'#80eaff',motif:'bolt',exclusive:true,note:'Sculpted storm armor, crescent shoulder plates and energy blades. Electric combo projectiles, lightning grapple cable and a thunder-charged Second Wind.'}
];
SKINS.push(...KIWI_SKINS);EXCLUSIVE_SKINS.push(KIWI_SKINS[2]);
for(let skin of KIWI_SKINS){let im=new Image();skinImages[skin.id]=im;im.onload=()=>{refreshLobby();if(playing)draw()};im.src='assets/'+skin.asset}
const kiwiCostumePreview=skinPreview;skinPreview=function(i,s){return i===KIWI&&s.asset?`<img class="snack-art costume-single" src="assets/${s.asset}" alt="${s.name} · Kiwi" draggable="false">`:kiwiCostumePreview(i,s)};
const kiwiCostumePortrait=portrait;portrait=function(i,cls=''){if(i!==KIWI)return kiwiCostumePortrait(i,cls);let skin=activeSkinDefinition(i);return skin?skinPreview(i,skin):kiwiCostumePortrait(i,cls)};
const kiwiCostumeDefault=chefDefaultArt;chefDefaultArt=function(i){return i===KIWI?'<img class="snack-art" src="assets/kiwi-v2.png" alt="Kiwi">':kiwiCostumeDefault(i)};
function stormbladeKiwi(a){return a?.food===KIWI&&actorSkinDefinition(a)?.id==='exclusive-12'}
let kiwiThunderWaves=[];
const kiwiSkinShoot=shoot;shoot=function(a,angle,...rest){let n=shots.length;kiwiSkinShoot(a,angle,...rest);if(stormbladeKiwi(a)&&shots.length>n)fxEmit(a.x+Math.cos(angle)*36,a.y+Math.sin(angle)*36,8,'spark','#80eaff',.7)};
const kiwiSkinHook=castKiwiHook;castKiwiHook=function(a,angle){let ok=kiwiSkinHook(a,angle);if(ok&&stormbladeKiwi(a)){kiwiThunderWaves.push({owner:a,x:a.x,y:a.y,at:elapsed,kind:'hook'});fxEmit(a.x,a.y,18,'spark','#b5f5ff',1)}return ok};
const kiwiSkinTopping=extendKiwiCombo;extendKiwiCombo=function(a){let ok=kiwiSkinTopping(a);if(ok&&stormbladeKiwi(a)){kiwiThunderWaves.push({owner:a,x:a.x,y:a.y,at:elapsed,kind:'topping'});fxEmit(a.x,a.y,22,'spark','#d3f8ff',1.1)}return ok};
function drawKiwiLightning(from,to,width=2){let length=Math.hypot(to.x-from.x,to.y-from.y),nx=-(to.y-from.y)/(length||1),ny=(to.x-from.x)/(length||1),steps=Math.max(2,Math.ceil(length/24));ctx.beginPath();for(let i=0;i<=steps;i++){let t=i/steps,zig=i===0||i===steps?0:(i%2?5:-5);let x=from.x+(to.x-from.x)*t+nx*zig,y=from.y+(to.y-from.y)*t+ny*zig;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle='#c7f6ff';ctx.lineWidth=width;ctx.stroke()}
const kiwiSkinDraw=draw;draw=function(){kiwiSkinDraw();if(!playing)return;ctx.save();ctx.scale(scale,scale);ctx.translate(-cam.x,-cam.y);ctx.shadowColor='#69deff';ctx.shadowBlur=10;
 for(let shot of shots)if(shot.food===KIWI&&stormbladeKiwi(shot.owner)){let scale=bossAttackScale(shot.owner),back={x:shot.x-Math.cos(shot.angle)*38*scale,y:shot.y-Math.sin(shot.angle)*38*scale};drawKiwiLightning(back,shot,2.2);ctx.save();ctx.translate(shot.x,shot.y);ctx.rotate(shot.angle);exclusiveGlyph(KIWI_SKINS[2],0,0,12*scale);ctx.restore()}
 for(let hook of [...kiwiHooks,...kiwiPulls])if(stormbladeKiwi(hook.owner)&&hook.owner.alive&&(isFriendlyToPlayer(hook.owner)||!hiddenInBush(hook.owner,player))){let end=hook.target||hook;drawKiwiLightning(hook.owner,end,2.5);exclusiveGlyph(KIWI_SKINS[2],end.x,end.y,13,elapsed*5)}
 kiwiThunderWaves=kiwiThunderWaves.filter(w=>elapsed-w.at<.7&&elapsed>=w.at&&actors.includes(w.owner));for(let wave of kiwiThunderWaves){let t=(elapsed-wave.at)/.7;ctx.globalAlpha=1-t;ctx.strokeStyle='#9befff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(wave.x,wave.y,25+t*85,0,Math.PI*2);ctx.stroke();for(let i=0;i<6;i++){let a=i*Math.PI/3;exclusiveGlyph(KIWI_SKINS[2],wave.x+Math.cos(a)*(30+t*70),wave.y+Math.sin(a)*(30+t*70),7)}}ctx.restore()};
const kiwiSkinClear=clearKiwiMatch;clearKiwiMatch=function(){kiwiThunderWaves=[];return kiwiSkinClear()};
refreshLobby();
