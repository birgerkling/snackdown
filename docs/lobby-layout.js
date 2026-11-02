(function(){
 const lobby=$('newLobby'),bottom=lobby?.querySelector('.lobby-bottom');if(!lobby||!bottom)return;
 let queued=false;function sync(){queued=false;if(lobby.hidden||!lobby.getBoundingClientRect().height)return;let root=lobby.getBoundingClientRect(),row=bottom.getBoundingClientRect();lobby.style.setProperty('--lobby-bottom-clearance',Math.max(0,root.bottom-row.top+18)+'px')}
 function queue(){if(!queued){queued=true;requestAnimationFrame(sync)}}
 if(typeof ResizeObserver!=='undefined'){let observer=new ResizeObserver(queue);observer.observe(lobby);observer.observe(bottom)}
 addEventListener('resize',queue,{passive:true});if(document.fonts?.ready)document.fonts.ready.then(queue);
 const previousRefresh=refreshLobby;refreshLobby=function(...args){let result=previousRefresh(...args);queue();return result};queue();
})();
