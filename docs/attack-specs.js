// Shared by projectile creation, collision tests and aiming previews.
const PROJECTILE_ATTACK_SPECS={
 0:{spawn:36,speed:620,life:.88,hitRadius:27,offsets:[0]},
 2:{spawn:36,speed:620,life:.58,hitRadius:27,offsets:[-.14,0,.14]},
 3:{spawn:36,speed:620,range:432,hitRadius:37,offsets:[0]},
 4:{spawn:36,speed:680,range:490,hitRadius:27,offsets:[0]},
 5:{spawn:36,speed:680,range:560,hitRadius:27,offsets:[0]},
 6:{spawn:36,speed:540,range:530,hitRadius:27,offsets:[0]},
 10:{spawn:36,speed:700,range:330,hitRadius:27,offsets:[0]}
};
function attackProjectileSpec(food){let spec=PROJECTILE_ATTACK_SPECS[food];if(!spec)return null;return {...spec,life:spec.life??(spec.range-spec.spawn)/spec.speed,range:spec.range??spec.spawn+spec.speed*spec.life}}
// Infinity means no storm: shared by damage, AI, warnings and rendering.
function sauceStormEnabled(){return !rankedSession?.bossFight}
function arenaStormRadius(){return sauceStormEnabled()?(practice?2000:Math.max(125,1176-elapsed*6)):Infinity}
function bossAttackScale(actor){return actor?.bossFightBoss?2:1}
function bossTargetPadding(actor){return actor?.bossFightBoss?22:0}
function bossRange(actor,range){return range*bossAttackScale(actor)}
function bossContactRange(owner,target,range){return bossRange(owner,range)+bossTargetPadding(target)}
function projectileHitRadius(shot,target){let base=shot.food===3&&shot.burst?32:PROJECTILE_ATTACK_SPECS[shot.food]?.hitRadius||27;return (base-22)*bossAttackScale(shot.owner)+22*bossAttackScale(target)}
const BANANA_FLIGHT={spawn:35,outbound:430,speed:650,returnSpeed:780,hitRadius:30,maxAge:2.3};
const MUFFIN_FLIGHT={range:400,radius:100,superRadius:135,bounceHeight:55};
function muffinBounceHeight(t){return Math.abs(Math.sin(t*Math.PI*2))*MUFFIN_FLIGHT.bounceHeight}
