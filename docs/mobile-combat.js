// A second touch may not produce a compatibility click while the joystick is held.
(function(){
 const button=$('super');let lastTouchAt=-Infinity;
 button.onpointerdown=function(event){
  if(event.pointerType!=='touch'&&event.pointerType!=='pen')return;
  event.preventDefault();lastTouchAt=performance.now();superAttack();
 };
 button.onclick=function(event){
  // Ignore the click belonging to an already handled touch. Keep mouse,
  // keyboard and controller-generated clicks working independently.
  if(event?.pointerType==='touch'||event?.pointerType==='pen')return;
  if(!event?.pointerType&&event?.detail>0&&performance.now()-lastTouchAt<800)return;
  superAttack();
 };
})();

