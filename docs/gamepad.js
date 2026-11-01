// Standard Gamepad mapping includes DualShock 4 on supported Windows browsers.
let padAimAngle=0,padAimDistance=560,padAimActor=null;
let padPrevious=[],padOwnedInput=false,padConnected=false,padMenuAt=0;
function padStick(x=0,y=0){let length=Math.hypot(x,y);if(length<=.2)return {x:0,y:0,length:0};let amount=Math.min(1,(length-.2)/.8);return {x:x/length*amount,y:y/length*amount,length:amount}}
function releasePadInput(){if(typeof clearPadFocus==='function')clearPadFocus();if(padOwnedInput){joy={x:0,y:0};pointer=false;mouseAim=false;padOwnedInput=false}padPrevious=[]}
function padButtons(){let root=document.getElementById('halloweenWelcome')||(!coreScreen.hidden?coreScreen:!servingCelebration.hidden?servingCelebration:!scoreboard.hidden?scoreboard:!resultsScreen.hidden?resultsScreen:!$('modal').hidden?$('modal'):playing?$('arena'):$('newLobby'));return [...root.querySelectorAll('button,input,select,.quest-card')].filter(el=>!el.disabled&&!el.classList.contains?.('quest-reward')&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden')}
let padFocusedButton=null;
function clearPadFocus(){padFocusedButton?.classList.remove("pad-focused","pad-focus-anchor");padFocusedButton=null}
function markPadFocus(button){clearPadFocus();if(!button)return;padFocusedButton=button;if(getComputedStyle(button).position==='static')button.classList.add("pad-focus-anchor");button.classList.add("pad-focused");button.focus();button.scrollIntoView?.({block:"nearest",inline:"nearest"})}
addEventListener("pointerdown",clearPadFocus);addEventListener("keydown",clearPadFocus);
function padMenuMove(direction){let buttons=padButtons();if(!buttons.length)return;let index=buttons.indexOf(document.activeElement);markPadFocus(buttons[index<0?(direction>0?0:buttons.length-1):(index+direction+buttons.length)%buttons.length])}
function padShortcut(button){
 if(playing||document.getElementById('halloweenWelcome')||!coreScreen.hidden||!servingCelebration.hidden||!scoreboard.hidden)return false;
 let target=null;
 if(button===2){
  if(!resultsScreen.hidden||!$('modal').hidden)target=padButtons().find(el=>/PLAY.*AGAIN/i.test(el.textContent));
  else target=document.querySelector('#newLobby .big-play');
 }else if(button===3&&resultsScreen.hidden&&$('modal').hidden)target=document.querySelector('#newLobby .hero-button');
 else if(button===9&&resultsScreen.hidden&&!$('modal').hidden)target=document.querySelector('#modal .to-reward-button');
 if(!target||target.disabled||!target.getClientRects().length)return false;
 markPadFocus(target);target.click();return true;
}
function pollSnackGamepad(now=performance.now()){
 let pads=navigator.getGamepads?.()||[],pad=Array.from(pads).find(p=>p?.connected&&p.mapping==='standard');
 if(!pad){if(padConnected){releasePadInput();padConnected=false;toast('CONTROLLER DISCONNECTED')}return}
 if(!padConnected){padConnected=true;toast('CONTROLLER READY · L STICK MOVE · R2 ATTACK');padPrevious=pad.buttons.map(b=>b.pressed)}
 if(document.hidden||!document.hasFocus()){releasePadInput();return}
 let down=i=>!!pad.buttons[i]?.pressed,pressed=i=>down(i)&&!padPrevious[i],left=padStick(pad.axes[0],pad.axes[1]),right=padStick(pad.axes[2],pad.axes[3]);
 let overlay=document.getElementById('halloweenWelcome')||!coreScreen.hidden||!servingCelebration.hidden||!$('modal').hidden||!resultsScreen.hidden||!scoreboard.hidden;
 if(playing&&!paused&&!overlay&&player?.alive){
  if(left.length||right.length||down(7)||padOwnedInput){joy={x:left.x,y:left.y};pointer=down(7);padOwnedInput=true;if(padAimActor!==player){padAimActor=player;padAimAngle=player.angle;padAimDistance=560}if(right.length){padAimAngle=Math.atan2(right.y,right.x);padAimDistance=60+right.length*500}mouseAim=true;player.angle=padAimAngle;aim={x:(player.x+Math.cos(padAimAngle)*padAimDistance-cam.x)*scale,y:(player.y+Math.sin(padAimAngle)*padAimDistance-cam.y)*scale}}
  if(pressed(5))superAttack();if(pressed(4))activateTopping();if(pressed(9))pauseGame();
 }else{
  if(padOwnedInput){joy={x:0,y:0};pointer=false;padOwnedInput=false}
  if((pressed(2)&&padShortcut(2))||(pressed(3)&&padShortcut(3))||(pressed(9)&&padShortcut(9))){padPrevious=pad.buttons.map(b=>b.pressed);return}
  let direction=down(13)||down(15)||left.y>.55||left.x>.55?1:down(12)||down(14)||left.y<-.55||left.x<-.55?-1:0;
  if(direction&&now>=padMenuAt){padMenuMove(direction);padMenuAt=now+230}
  if(pressed(0)){let buttons=padButtons(),focused=buttons.includes(document.activeElement)?document.activeElement:buttons[0];markPadFocus(focused);let action=focused?.classList.contains?.('quest-card')?focused.querySelector('button:not(:disabled)'):focused;action?.click()}
  if(pressed(1)){if(paused)resume();else if(!$('modal').hidden)closeModal()}
  if(pressed(9)&&paused)resume();
 }
 padPrevious=pad.buttons.map(b=>b.pressed);
}
function snackGamepadFrame(now){pollSnackGamepad(now);requestAnimationFrame(snackGamepadFrame)}requestAnimationFrame(snackGamepadFrame);
addEventListener('gamepaddisconnected',releasePadInput);addEventListener('blur',releasePadInput);
const gamepadSettings=settings;settings=function(...args){gamepadSettings(...args);$('content').insertAdjacentHTML('beforeend','<h2>CONTROLLER · DUALSHOCK 4</h2><p>Press any controller button to connect. Left stick: move. Right stick: aim; tilt farther for more distance. R2: attack. R1: Super. L1: Topping (press again to confirm an aimed Topping). Options: pause/resume in a match; To Reward in Calorie Road. D-pad or left stick: browse menus. Cross: select. Circle: back. Square: Play / Play Again. Triangle: inspect your selected snack in the lobby.</p><p>Release the right stick to keep your last aim direction. Connect by USB or Bluetooth and keep this game tab focused.</p>')};
