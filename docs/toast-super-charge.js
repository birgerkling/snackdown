function hurtProjectile(target,shot){
 let owner=shot.owner,fixedSuperCharge=owner?.food===3||(owner?.food===2&&shot.super),hp=target.hp,alive=target.alive,before=owner===player?charge:owner?.rankedCharge||0;
 hurt(target,shot.damage,owner);
 if(fixedSuperCharge&&alive&&target.hp<hp&&isEnemy(owner,target)){let next=Math.min(100,before+20);if(owner===player)charge=next;else owner.rankedCharge=next}
}
