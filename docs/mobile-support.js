// Small fallbacks for older mobile browsers; never replace working native APIs.
(function(){
 if(!Array.prototype.at)Object.defineProperty(Array.prototype,'at',{configurable:true,writable:true,value:function(index){let n=Math.trunc(Number(index)||0);if(n<0)n+=this.length;return this[n]}});
 let realm=typeof window==='undefined'?globalThis:window;
 if(!realm.AudioContext&&realm.webkitAudioContext)realm.AudioContext=realm.webkitAudioContext;
 if(typeof CanvasRenderingContext2D!=='undefined'&&!CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,radii=0){
   let r=Array.isArray(radii)?radii.slice():[radii];if(!r.length||r.length>4)throw new RangeError('Invalid corner radii');r=r.map(v=>Number(v));if(r.some(v=>!Number.isFinite(v)||v<0))throw new RangeError('Invalid corner radii');
   if(r.length===1)r=[r[0],r[0],r[0],r[0]];else if(r.length===2)r=[r[0],r[1],r[0],r[1]];else if(r.length===3)r=[r[0],r[1],r[2],r[1]];
   if(w<0){x+=w;w=-w;r=[r[1],r[0],r[3],r[2]]}if(h<0){y+=h;h=-h;r=[r[3],r[2],r[1],r[0]]}
   let fit=Math.min(1,w/(r[0]+r[1]||1),h/(r[1]+r[2]||1),w/(r[2]+r[3]||1),h/(r[3]+r[0]||1));r=r.map(v=>v*fit);
   this.moveTo(x+r[0],y);this.lineTo(x+w-r[1],y);this.quadraticCurveTo(x+w,y,x+w,y+r[1]);this.lineTo(x+w,y+h-r[2]);this.quadraticCurveTo(x+w,y+h,x+w-r[2],y+h);this.lineTo(x+r[3],y+h);this.quadraticCurveTo(x,y+h,x,y+h-r[3]);this.lineTo(x,y+r[0]);this.quadraticCurveTo(x,y,x+r[0],y);this.closePath();
  };
 }
 if(typeof document==='undefined'||!document.documentElement)return;
 let pending=false;function syncMobileHeight(){pending=false;let h=Math.min(innerHeight,realm.visualViewport?.height||innerHeight);document.documentElement.style.setProperty('--mobile-view-height',h+'px')}
 function queueMobileHeight(){if(!pending){pending=true;requestAnimationFrame(syncMobileHeight)}}syncMobileHeight();addEventListener('resize',queueMobileHeight,{passive:true});realm.visualViewport?.addEventListener('resize',queueMobileHeight,{passive:true});
})();
