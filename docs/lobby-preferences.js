let restoringLobbyPreferences=false;
function rememberLobbyPreferences(){
 if(restoringLobbyPreferences||tutorialRun||Number.isInteger(saved.tutorialTourStep)||skinTrialId!==null)return;
 saved.lastSnack=saved.selected;
 saved.lastGameMode=bossMode?'boss':halloweenMode?'halloween':practice?'training':rankedMode?'ranked':'solo';
}
function restoreLobbyPreferences(snack=saved.lastSnack){
 restoringLobbyPreferences=true;
 try{
  if(Number.isInteger(snack)&&foods[snack]&&isSnackUnlocked(snack))saved.selected=snack;
  let mode=saved.lastGameMode||'solo';bossMode=mode==='boss';halloweenMode=mode==='halloween'&&HALLOWEEN_EVENT_ACTIVE;rankedMode=mode==='ranked';practice=mode==='training';
  updateMode();refreshLobby();
 }finally{restoringLobbyPreferences=false}
 save();
}
const preferenceSave=save;save=function(...args){rememberLobbyPreferences();return preferenceSave(...args)};
const preferenceUpdateMode=updateMode;updateMode=function(...args){let result=preferenceUpdateMode(...args);if(!restoringLobbyPreferences){rememberLobbyPreferences();save()}return result};
const preferenceSwitch=switchAccount;switchAccount=function(...args){
 let before=saved.accountId;restoringLobbyPreferences=true;
 try{preferenceSwitch(...args)}finally{restoringLobbyPreferences=false}
 if(saved.accountId!==before){document.getElementById('halloweenWelcome')?.remove();restoreLobbyPreferences();showHalloweenWelcome()}
};
restoreLobbyPreferences(saved.lastSnack??bootSnackChoice);
