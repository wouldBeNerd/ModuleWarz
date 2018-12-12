'use strict'

module.exports = function loadPlayerInventory(arrINV,invLink,equipCheck){
	var sinvID;
	var invCount = Object.keys(invLink).length;	
	//console.log(invLink[0].prefixID);
	var invNumberToEquip;
	var iconIDPreFix;
	for(var i = 0; i<invCount; i++){
		invNumberToEquip = i + equipCheck.invToVisualBegin;
		iconIDPreFix = invLink[i].prefixID;
		
		if(arrINV[invNumberToEquip] == undefined){

			sinvID = document.getElementById(iconIDPreFix+"Icon");
			sinvID.src = "";
			

			sinvID = document.getElementById(iconIDPreFix+"StatTLTxt");
			sinvID.innerHTML= 0;	


			sinvID = document.getElementById(iconIDPreFix+"StatTRTxt");
			sinvID.innerHTML= 0;

			sinvID = document.getElementById(iconIDPreFix+"StatBLTxt");
			sinvID.innerHTML= 0;

			sinvID = document.getElementById(iconIDPreFix+"StatBRTxt");
			sinvID.innerHTML= 0;

		}else{
			
			sinvID = document.getElementById(iconIDPreFix+"Icon");
			sinvID.src = "ASSETS/"+arrINV[invNumberToEquip].filename;
			

			sinvID = document.getElementById(iconIDPreFix+"StatTLTxt");
			sinvID.innerHTML= arrINV[invNumberToEquip].CDPL/1000||0;	


			sinvID = document.getElementById(iconIDPreFix+"StatTRTxt");
			sinvID.innerHTML= arrINV[invNumberToEquip].DTPL/1000||0;

			sinvID = document.getElementById(iconIDPreFix+"StatBLTxt");
			sinvID.innerHTML= arrINV[invNumberToEquip].PPPL||0;

			sinvID = document.getElementById(iconIDPreFix+"StatBRTxt");
			sinvID.innerHTML= arrINV[invNumberToEquip].EPPL||0;
		}


	}
}