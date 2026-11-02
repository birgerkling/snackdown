(function(){
 let previousFill=null,previousLabel=null;
 function syncSuperFill(){
  const button=$('super'),label=$('charge');if(!button||!label)return;
  let fill=Math.max(0,Math.min(100,Number(charge)||0)),text=label.textContent.trim(),numeric=/^\d+(?:\.\d+)?\s*%$/.test(text);
  label.classList.toggle('super-numeric',fill<100||numeric);
  if(fill!==previousFill){button.style.setProperty('--super-fill',fill+'%');button.classList.toggle('super-full',fill>=100);previousFill=fill}
  let accessible=fill<100||numeric?'Super · '+Math.floor(fill)+'% charged':'Super · '+(text||'charging');
  if(accessible!==previousLabel){button.setAttribute('aria-label',accessible);previousLabel=accessible}
 }
 const previousDraw=draw;draw=function(...args){syncSuperFill();return previousDraw(...args)};
 syncSuperFill();
})();

