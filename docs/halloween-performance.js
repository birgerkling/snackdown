// The event's round display changes only on a round, KO, spectator or streak change.
let halloweenHUDSession=null,halloweenHUDKey='';
const efficientHalloweenHUD=updateRankedHUD;
updateRankedHUD=function(...args){
 if(!inHalloweenMatch()){halloweenHUDSession=null;halloweenHUDKey='';return efficientHalloweenHUD(...args)}
 let s=rankedSession,key=[s.round,s.results.join(','),actors.filter(a=>a.alive&&a.team===0).length,actors.filter(a=>a.alive&&a.team===1).length,player.alive,arenaCameraFocus?.name||'',halloweenState().streak].join('|');
 if(halloweenHUDSession===s&&halloweenHUDKey===key&&!eventHUD.hidden)return;
 halloweenHUDSession=s;halloweenHUDKey=key;return efficientHalloweenHUD(...args);
};
// Reuse rendered lanterns: soft shadows and gradients are baked once per size.
const rawHalloweenLantern=halloweenLantern;
const halloweenLanternSprites=new Map();
halloweenLantern=function(c,x,y,size=35,scary=false){
 let key=size+'|'+scary,sprite=halloweenLanternSprites.get(key);
 if(!sprite){let padding=24,extent=Math.ceil(size*2+padding*2);sprite=document.createElement('canvas');sprite.width=sprite.height=extent;rawHalloweenLantern(sprite.getContext('2d'),extent/2,extent/2,size,scary);halloweenLanternSprites.set(key,sprite)}
 c.drawImage(sprite,x-sprite.width/2,y-sprite.height/2);
};
