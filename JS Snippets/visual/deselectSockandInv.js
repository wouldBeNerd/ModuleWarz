module.exports = function deselectSockandInv(invLink, sockLink){

	var invCount = Object.keys(invLink).length;	
	for (var i = 0; i<invCount;i++){
		document.getElementById(invLink[i].prefixID+"backBar").className = "backBar";
	}
	var sockCount = Object.keys(sockLink).length;
	for (var b = 0; b<sockCount;b++){
		document.getElementById(sockLink[b].prefixID+"backBar").className = "backBar";
	}
}