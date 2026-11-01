// Big Bun uses Bunquake for bots too, rather than the generic radial burst.
const bunquakeBotSuper=rankedBotSuper;
rankedBotSuper=function(a,target){
 if(a.food!==2)return bunquakeBotSuper(a,target);
 a.rankedCharge=0;
 a.hp=Math.min(a.max,a.hp+1100);
 rings.push({x:a.x,y:a.y,r:20,max:bossRange(a,250),life:.65,color:'#ff9750'});
 for(let enemy of actors)if(enemy.alive&&isEnemy(a,enemy)&&dist(a,enemy)<bossContactRange(a,enemy,250))hurtProjectile(enemy,{owner:a,damage:1800,super:true});
 for(let crate of crates)if(crate.hp>0&&dist({x:crate.x+26,y:crate.y+24},a)<250)breakCrate(crate);
 let damage=foods[2].damage*(a.levelMultiplier||1)*1.7;
 for(let i=0;i<12;i++){let angle=i*Math.PI/6;shots.push({owner:a,x:a.x+Math.cos(angle)*36,y:a.y+Math.sin(angle)*36,vx:Math.cos(angle)*620,vy:Math.sin(angle)*620,angle,life:.58,food:2,damage,super:true})}
 animateSnackAction(a,'super',.7);sfx('super');
};
