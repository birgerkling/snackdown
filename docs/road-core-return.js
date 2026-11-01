// A claimed road Core remembers the world and scroll position it came from.
let currentCalorieRoadPage=null,roadCoreClaimSource=null,roadCoreReturn=null;
const coreReturnRoad=calorieRoad;calorieRoad=function(page){currentCalorieRoadPage=Number.isSafeInteger(page)&&page>=0?page:Math.floor(saved.calories/500);return coreReturnRoad(page)};
const coreReturnCreate=createRewardCore;createRewardCore=function(...args){let core=coreReturnCreate(...args);if(roadCoreClaimSource)core.calorieRoadReturn={...roadCoreClaimSource};return core};
const coreReturnClaim=claimCalorieMilestone;claimCalorieMilestone=function(step){
 let shell=document.querySelector('#modal > article');
 roadCoreClaimSource={page:currentCalorieRoadPage??Math.floor(step*20/500),scrollTop:Math.max(0,shell?.scrollTop||0)};
 try{return coreReturnClaim(step)}finally{roadCoreClaimSource=null}
};
const roadReturnCloseCore=closeCore;closeCore=function(...args){
 if(roadCoreReturn&&roadCoreReturn.account!==saved.accountId)roadCoreReturn=null;
 let core=activeCore&&findCore(activeCore);
 if(!coreBusy&&core?.status==='opened'){
  if(core.calorieRoadReturn){roadCoreReturn={...core.calorieRoadReturn,account:saved.accountId};pumpkinShopReturnAccount=null}
  else if(core.kind==='pumpkin')roadCoreReturn=null;
 }
 let result=roadReturnCloseCore(...args);
 if(roadCoreReturn&&roadCoreReturn.account===saved.accountId&&coreScreen.hidden&&!coreBusy&&!playing&&!saved.coreInventory.pending.length){
  let destination=roadCoreReturn;roadCoreReturn=null;calorieRoad(destination.page);
  let shell=document.querySelector('#modal > article');if(shell)shell.scrollTop=destination.scrollTop;
 }
 return result;
};
