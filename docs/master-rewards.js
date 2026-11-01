const MASTER_SHARD_REWARDS={1:{red:50,blue:15,green:10},2:{red:50,blue:30,green:20},3:{red:100,blue:60,green:40},4:{red:400,blue:120,green:80}};
function masterShardRewardText(tier){let r=MASTER_SHARD_REWARDS[tier];return '+'+r.red+' RED · +'+r.blue+' BLUE · +'+r.green+' GREEN'}
function grantHigherMasterRewards(food){
 saved.masterRewardClaims??={};let earned=[];
 for(let tier=2;tier<=4;tier++){
  let key=food+':'+tier;if(!hasMasterTitle(food,tier)||saved.masterRewardClaims[key])continue;
  saved.masterRewardClaims[key]=true;
  let reward=MASTER_SHARD_REWARDS[tier];saved.shards.red+=reward.red;saved.shards.green+=reward.green;
  let serving=addBlueShards(reward.blue);earned.push({tier,...reward,serving});
 }
 return earned;
}
const higherMasterAward=awardCalories;
awardCalories=function(food,...args){let result=higherMasterAward(food,...args);result.masterRewards=grantHigherMasterRewards(food);return result};
// Existing unlocked titles also receive the newly introduced rewards, once.
const higherMasterRefresh=refreshLobby;
refreshLobby=function(...args){
 higherMasterRefresh(...args);let rewards=[];
 for(let food=0;food<foods.length;food++)rewards.push(...grantHigherMasterRewards(food));
 if(rewards.length){save();toast('MASTER REWARDS ADDED · +'+rewards.reduce((n,r)=>n+r.red,0)+' RED · +'+rewards.reduce((n,r)=>n+r.blue,0)+' BLUE · +'+rewards.reduce((n,r)=>n+r.green,0)+' GREEN')}
};
const higherMasterTitleList=masterTitleList;
masterTitleList=function(title){
 let markup=higherMasterTitleList(title);
 return markup.replace(/(<b>[^<]* · MASTER (IV|III|II|I)<\/b>)/g,(whole,heading,roman)=>heading+'<small style="display:block;color:#b8d9ed">'+masterShardRewardText({I:1,II:2,III:3,IV:4}[roman])+' · ONCE</small>');
};
refreshLobby();
