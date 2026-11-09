// Capture the selected snack before the incremental roster has loaded.
let bossMode=false;
let lobbyCatalogReady=false,bootAccountId=null;
let bootGamingMode=false;try{bootGamingMode=JSON.parse(localStorage.getItem('snackdown-save')||'{}').lastGameMode==='gaming'}catch{}
let bootSnackChoice=null;try{let data=JSON.parse(localStorage.getItem('snackdown-save')||'{}');bootSnackChoice=data.lastSnack??data.selected;bootAccountId=data.accountId??null}catch{}
