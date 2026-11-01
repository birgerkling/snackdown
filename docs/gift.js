// A specific one-time gift is redeemed only by opening its gift link.
function redeemGreenGift(search=location.search){
  const token='bro-green-600-7c9e42';
  if(new URLSearchParams(search).get('gift')!==token)return false;
  saved.giftClaims??=[];
  if(saved.giftClaims.includes(token))return false;
  saved.shards.green+=600;saved.giftClaims.push(token);save();refreshLobby();
  toast('GIFT RECEIVED: +600 GREEN SHARDS!');return true;
}
redeemGreenGift();

// Account-only ownership correction requested by the player. Catalog stays intact.
function removeOwnedVolcanoBun(search=location.search){
  const token='volcano-bun-ownership-3a8f16';
  if(new URLSearchParams(search).get('accountAction')!==token)return false;
  saved.accountActions??=[];
  if(saved.accountActions.includes(token))return false;
  saved.ownedSkins=saved.ownedSkins.filter(id=>id!=='exclusive-2');
  if(saved.equippedSkins[2]==='exclusive-2')delete saved.equippedSkins[2];
  if(saved.activeSkin==='exclusive-2')saved.activeSkin=null;
  saved.skin=!!activeSkinDefinition();
  saved.accountActions.push(token);save();refreshLobby();
  toast('VOLCANO BUN REMOVED FROM YOUR OWNED SKINS');return true;
}
removeOwnedVolcanoBun();
