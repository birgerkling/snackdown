// Nugget: +15% projectile speed, keeping its existing travel range.
const quickerNuggetShot=shoot;shoot=function(a,...args){let before=shots.length;quickerNuggetShot(a,...args);if(a.food!==0)return;for(let shot of shots.slice(before)){shot.vx*=1.15;shot.vy*=1.15;shot.life/=1.15;shot.nuggetMini=!!shot.super}};
descriptions[0]='A quick golden runner. Crunch Shot deals 600 damage (1,200 at level 5), with four ammo bars and 15% faster projectiles. Golden Rush unleashes 20 small projectiles and grants a four-second speed boost. Five hits charge the Super.';foods[0].description=descriptions[0];
