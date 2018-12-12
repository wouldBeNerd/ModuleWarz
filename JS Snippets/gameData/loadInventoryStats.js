'use strict'
module.exports = function loadInventoryStats(equipCheck, invLink, playerInventory){
//set inventorySlotContents.json.item to playerInventory.json.item
	var invCount = Object.keys(invLink).length;	
	equipCheck.inventoryCount = Object.keys(playerInventory).length;
	for (var i = 0; i<invCount;i++){
		if (playerInventory[i+equipCheck.invToVisualBegin] == undefined){
			invLink[i].item = {};
		}else{
		invLink[i].item = playerInventory[i+equipCheck.invToVisualBegin];
		}
	}

} 