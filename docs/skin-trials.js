let skinTrialId=null;
const trialActorSkin=actorSkinDefinition;actorSkinDefinition=function(actor){if(actor===player&&practice&&skinTrialId){let skin=SKINS.find(s=>s.id===skinTrialId&&s.food===actor.food);if(skin)return skin}return trialActorSkin(actor)};
function trySkin(id){let skin=SKINS.find(s=>s.id===id);if(!skin)return;skinTrialId=id;trySnack(skin.food);charge=100;$('status').textContent='TRYING '+skin.name.toUpperCase();draw();toast('TRYING '+skin.name.toUpperCase()+' · FREE TRAINING · SUPER READY')}
const trialSkinHome=home;home=function(){let returnToShop=skinTrialId!==null;skinTrialId=null;trialSkinHome();if(returnToShop)skinShop()};
