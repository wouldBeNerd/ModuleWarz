module.exports = function changeButtonColour(idPack, invLink, sockLink){	
	var parentID = idPack[0];
	var parentParentID = idPack[1];	
	var targetID = idPack[2];

	
	switch(parentParentID.id){
	case "INVButtons":
		var invCount = Object.keys(invLink).length;	
		for (var i = 0; i<invCount;i++){
			if(invLink[i].prefixID == parentID.id){
				if(invLink[i].selected == true){
					document.getElementById(invLink[i].prefixID+"backBar").className = "backBarSelected";	
				}else{
					document.getElementById(invLink[i].prefixID+"backBar").className = "backBar";
				}
			}else{
				if(document.getElementById(invLink[i].prefixID+"backBar").className == "backBarSelected"){
					document.getElementById(invLink[i].prefixID+"backBar").className = "backBar";
				}
			}
		}
		break;
	case "playerSocks":
		var sockCount = Object.keys(sockLink).length;
		for (var b = 0; b<sockCount;b++){
			if(sockLink[b].prefixID == parentID.id){
				if(sockLink[b].selected == true){
					document.getElementById(sockLink[b].prefixID+"backBar").className = "backBarSelected";
				}else{
					document.getElementById(sockLink[b].prefixID+"backBar").className = "backBar";
				}
			}

		}
		break;
	case "INVControls":	
		clearSelectedSocksAndInv();
		break;
	default :
		clearSelectedSocksAndInv();
	}
	function clearSelectedSocksAndInv(){
		var invCount = Object.keys(invLink).length;	
		for (var i = 0; i<invCount;i++){
			document.getElementById(invLink[i].prefixID+"backBar").className = "backBar";
		}
		var sockCount = Object.keys(sockLink).length;
		for (var b = 0; b<sockCount;b++){
			document.getElementById(sockLink[b].prefixID+"backBar").className = "backBar";
		}
	}

}