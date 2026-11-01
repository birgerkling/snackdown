// Capture the selected snack before the incremental roster has loaded.
let bossMode=false;
let bootSnackChoice=null;try{let data=JSON.parse(localStorage.getItem('snackdown-save')||'{}');bootSnackChoice=data.lastSnack??data.selected}catch{}
