// Keep event Candy beside the three permanent shard balances.
const candyWalletRefresh=refreshLobby;
refreshLobby=function(...args){let result=candyWalletRefresh(...args);if(HALLOWEEN_EVENT_ACTIVE){wallet.insertAdjacentHTML('afterbegin',`<span class="shard-chip candy" title="Halloween Candy"><i>🍬</i><b>${halloweenState().candy}</b></span>`);wallet.setAttribute('aria-label','Your Candy and red, blue, and green shards')}return result};
refreshLobby();
