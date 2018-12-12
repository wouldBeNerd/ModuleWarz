'use strict'
module.exports = function toggleSelected(idPack, invLink, sockLink, equipCheck){
	var parentID = idPack[0];
	var parentParentID = idPack[1];	
	var targetID = idPack[2];
	var invBool = false;
	var sockBool = false;
	switch(parentParentID.id){
	case "INVButtons":
		var invCount = Object.keys(invLink).length;	
		for (var i = 0; i<invCount;i++){
			if(invLink[i].prefixID == parentID.id && invLink[i].selected == false){
				invLink[i].selected = true;
				equipCheck.invBool = true;
				
			}else{
				if(invLink[i].prefixID == parentID.id && invLink[i].selected == true){
					invLink[i].selected = false;
					equipCheck.invBool = false;	
				}
			}
		}
	
		break;
	case "playerSocks":

		var sockCount = Object.keys(sockLink).length;
		var selectedCount = 0;
		for (var b = 0; b<sockCount;b++){
			if(sockLink[b].prefixID == parentID.id && sockLink[b].selected == true){
				sockLink[b].selected = false;
				sockLink[b].disable = false;
				//STATUS CHANGED HERE
				document.getElementById(sockLink[b].prefixID + "Status").style.opacity="0";
				//
			}else{	
				if(sockLink[b].prefixID == parentID.id && sockLink[b].selected == false){
					sockLink[b].selected = true;
					
				}
			}
			if(sockLink[b].selected == true){
				selectedCount++;
			}	
		}
		if(selectedCount > 0){
			equipCheck.sockBool = true;
		}else{
			equipCheck.sockBool = false;
		}
		break;
	case "INVControls":
		clearSelectedSocksAndInv();
		var invCount = Object.keys(invLink).length;	
		switch(parentID.className){
		case "InvUp":
			equipCheck.scrollBackw =true;
			if(equipCheck.invToVisualBegin == 0){
				equipCheck.invToVisualBegin = (Math.floor(equipCheck.inventoryCount / invCount)*invCount);
				equipCheck.invToVisualEnd = equipCheck.inventoryCount;
			}else{
				equipCheck.invToVisualBegin = equipCheck.invToVisualBegin - invCount;
				equipCheck.invToVisualEnd = equipCheck.invToVisualEnd - invCount;
			}
			break;
		case "InvDown":
			equipCheck.scrollForw =true;
			if((equipCheck.invToVisualEnd + invCount) > equipCheck.inventoryCount){
				equipCheck.invToVisualBegin = 0;
				equipCheck.invToVisualEnd = invCount;
			}else{
				equipCheck.invToVisualBegin = equipCheck.invToVisualBegin + invCount;
				equipCheck.invToVisualEnd = equipCheck.invToVisualEnd + invCount;
			}
			break;	
		case "InvMid":
			equipCheck.scrollMid =true;
			equipCheck.invToVisualBegin = 0;
			equipCheck.invToVisualEnd = invCount;
			break;	
		default:
		}
		break;
	default :
		clearSelectedSocksAndInv();
	
	}

	function clearSelectedSocksAndInv(){
				var invCount = Object.keys(invLink).length;	
		for (var i = 0; i<invCount;i++){
			invLink[i].selected = false;
		}
		var sockCount = Object.keys(sockLink).length;
		for (var b = 0; b<sockCount;b++){
			sockLink[b].selected = false;	
		}

	}



}
