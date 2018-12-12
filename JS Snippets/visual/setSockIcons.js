'use strict'
module.exports = function setSockIcons(invLink, sockLink){
	var invCount = Object.keys(invLink).length;	
	var sockCount = Object.keys(sockLink).length;

	
	//
	for(var i=0; i<invCount; i++){
		if (invLink[i].selected == true){
			if(Object.keys(invLink[i].item).length == 0){
				for(var b=0; b<sockCount;b++){
					if (sockLink[b].selected == true){
						var destID = document.getElementById(sockLink[b].prefixID+"Icon");
						destID.src = "";
						//DISABLE STATUS ICON
						document.getElementById(sockLink[b].prefixID+"Status").style.opacity="0";
					}

				}
			}else{
				var sourceSRC = document.getElementById(invLink[i].prefixID+"Icon").src;
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



}