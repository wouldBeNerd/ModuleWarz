'use strict'
module.exports = function setSockIcons(invLink, sockLink){
	var invCount = Object.keys(invLink).length;	
	var sockCount = Object.keys(sockLink).length;

	
	//
	for(var i=0; i<invCount; i++){
		if (invLink[i].selected == true){
				var sourceSRC = "./ASSETS/"+invLink[i].filename;
				for(var b=0; b<sockCount;b++){
					if (sockLink[b].selected == true){
						var destID = document.getElementById(sockLink[b].prefixID+"Icon");
						destID.src = sourceSRC;
						//DISABLE STATUS ICON
						document.getElementById(sockLink[b].prefixID+"Status").style.opacity="0";
					}

				}
		}
	}

}	



