'use strict'
module.exports = function AIToggleSelected(iNr, equipCheckEnemy, AIEquipLoop, AIInventory, AISocks){
	for(var i = 0; i < AIEquipLoop.length; i++){
		//console.log(i);
		if(AIEquipLoop[i].invNr == iNr){
			AISocks[i].disable = false;
			//console.log(AISocks[i]);
			AISocks[i].selected = true;
			//if(AIInventory[iNr].selected == undefined){
				//console.log(iNr);
			//}else{
				AIInventory[iNr].selected = true;
			//}
			
			

		}

	}


}