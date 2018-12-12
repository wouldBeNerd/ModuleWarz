'use strict'
module.exports = function equipItemToSocks(player, progress, invLink, sockLink){
//set socksSlotsContents.json.item to inventorySlotContents.json.item
	var invCount = Object.keys(invLink).length;	
	var sockCount = Object.keys(sockLink).length;
	var temperatureBalancePoint = 370; 
	var differenceMaxandMinTemp;

	for(var i=0; i<invCount; i++){
		if (invLink[i].selected == true){
			for(var b=0; b<sockCount;b++){
				if (sockLink[b].selected == true){
					sockLink[b].item = invLink[i];
					sockLink[b].disable = false; 
					sockLink[b].type = "CD";
					//console.log(sockLink[b]);

					if(sockLink[b].item.CDPL == 0 ||sockLink[b].item.CDPL == undefined||sockLink[b].item.CDPL == null){
					sockLink[b].CDEnd = 0; 

					//STILL NEEDS AN UNEQUIP FUNCTION SOMEWHERE ALSO
					//SPEXP APEXP EPEXP PPEXP - to add still these points reduce or increase the max capacity of a stat by 
					sockLink[b].type = "AO";
					if(sockLink[b].item.SPEXP == undefined || sockLink[b].item.SPEXP == 0 || sockLink[b].disable == true){}else{	
						player.SPMAX = Math.floor((player.SPMAX/100) * (sockLink[b].item.SPEXP + 100));
						player.SPCUR = Math.floor((player.SPCUR/100) * (sockLink[b].item.SPEXP + 100));
					}	//this shit still gotta be removed when unequiped. 
					if(sockLink[b].item.APEXP == undefined || sockLink[b].item.APEXP == 0 || sockLink[b].disable == true){}else{	
						player.APMAX = Math.floor((player.APMAX/100) * (sockLink[b].item.APEXP + 100));
						player.APCUR = Math.floor((player.APCUR/100) * (sockLink[b].item.APEXP + 100));
					}
					if(sockLink[b].item.EPEXP == undefined || sockLink[b].item.EPEXP == 0 || sockLink[b].disable == true){}else{	
						player.EPMAX = Math.floor((player.EPMAX/100) * (sockLink[b].item.EPEXP + 100));
						player.EPCUR = Math.floor((player.EPCUR/100) * (sockLink[b].item.EPEXP + 100));
					}
					if(sockLink[b].item.PPEXP == undefined || sockLink[b].item.PPEXP == 0 || sockLink[b].disable == true){}else{	
						player.PPMAX = Math.floor((player.PPMAX/100) * (sockLink[b].item.PPEXP + 100));
					}
					if(sockLink[b].item.TPEXP == undefined || sockLink[b].item.TPEXP == 0 || sockLink[b].disable == true){}else{	
						differenceMaxandMinTemp = player.TPMAX - player.TPMIN;
						player.TPMAX = Math.floor((player.TPMAX/100) * (sockLink[b].item.TPEXP + 100));
						player.TPMIN = player.TPMAX - differenceMaxandMinTemp;
						//console.log(player.TPMIN, player.TPMAX);
					}
					

					}else{
						//THE COOLDOWN OF THE EQUIPED ITEM IS BASED ON CURRENT INTERNAL TEMPERATURE; 
						sockLink[b].CDTemp = (sockLink[b].item.CDPL + (sockLink[b].item.CDPL * ((((temperatureBalancePoint - player.TPCUR) * -1)/2)/1000)));
						//sockLink[b].CDTemp defines if the actual cooldown will take longer or shorter before it is applied.
						sockLink[b].CDEnd = sockLink[b].CDTemp + progress; 
						

					}
				}

			}

		}

	}	



}