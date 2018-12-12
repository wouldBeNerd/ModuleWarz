'use strict'
module.exports = function toggleSelected(idPack, invLink, sockLink){

	var parentID = idPack[0];
	var parentParentID = idPack[1];	
	var targetID = idPack[2];


	var INVButtonSelected;
	var SLOTButtonSelected=[];

	var indexofRemovedButton;

	switch(parentParentID.id){
	case "INVButtons":
		var invCount = Object.keys(invLink).length;	
		for (var i = 0; i<invCount;i++){
			if(invLink[i].prefixID == targetID.id){
				invLink[i].selected = true;
				INVButtonSelected = [i,"inventorySlotContent", "eqptModulesID=", invLink[i].eqptModulesID, "playerinventoryID=",  invLink[i].playerinventoryID];
			}else{
				invLink[i].selected = false;
			}
		}
	
		break;
	case "playerSocks":

		var invCount = Object.keys(sockLink).length;
		for (var b = 0; b<invCount;b++){

			if(sockLink[b].prefixID == parentID.id){
				if(sockLink[b].selected == true){
/*					if(SLOTButtonSelected>-1){
						indexofRemovedButton = SLOTButtonSelected.indexof(b);
						SLOTButtonSelected.splice(indexofRemovedButton, 1);
						sockLink[b].selected = false;
						console.log("removed", b);
					}*/
					sockLink[b].selected == false
				}else{

					sockLink[b].selected = true;
					SLOTButtonSelected.push(b);
					//console.log("yes");
				}	
			}else{
				if(sockLink[b].selected == true){
				SLOTButtonSelected.push(b);
				//console.log("no");
				}
			}
		}
		break;
	default :
	
	}
	//console.log(SLOTButtonSelected);



}
