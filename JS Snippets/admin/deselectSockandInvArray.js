		'use strict'
module.exports = function deselectSockandInvArray(equipCheck, invLink, sockLink){

	var invCount = Object.keys(invLink).length;	
	for (var i = 0; i<invCount;i++){
		invLink[i].selected = false;
	}
	var sockCount = Object.keys(sockLink).length;
	for (var b = 0; b<sockCount;b++){
		sockLink[b].selected = false;	
	}
	equipCheck.invBool = false;
	equipCheck.sockBool = false;
}