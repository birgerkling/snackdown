const SNACK_CLASS_TYPES={Nugget:'Hybrid',Maki:'Assassin','Big Bun':'Tank',Toast:'Damage Dealer',Chili:'Controller',Glaze:'Tank',Frosty:'Controller',Muffin:'Artillery','Rad Banana':'Damage Dealer',Spud:'Tank',Pumpkin:'Limited Tank',Ravioli:'Controller',Kiwi:'Assassin'};
for(let food of foods){let type=SNACK_CLASS_TYPES[food.name];if(type)food.role=type}
refreshLobby();
