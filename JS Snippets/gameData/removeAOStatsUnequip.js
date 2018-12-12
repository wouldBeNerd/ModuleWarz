'use strict'
module.exports = function removeAOStatsUnequip(player, sockLink){

	var sockCount = Object.keys(sockLink).length;
	var differenceMaxandMinTemp;

	for(var b=0; b<sockCount;b++){
		if (sockLink[b].selected == true){
			//console.log(sockLink[b].item);
			if(Object.keys(sockLink[b].item).length == 0){}else{
				if(sockLink[b].item.CDorAO == "AO"){
					console.log("reversing AO stat for socket b");
					if(sockLink[b].item.SPEXP == undefined || sockLink[b].item.SPEXP == 0 || sockLink[b].disable == true){}else{	
						player.SPMAX = Math.ceil((player.SPMAX/(100 + sockLink[b].item.SPEXP)*100));
						player.SPCUR = Math.ceil((player.SPCUR/(100 + sockLink[b].item.SPEXP)*100));
					}	//this shit still gotta be removed when unequiped. 
					if(sockLink[b].item.APEXP == undefined || sockLink[b].item.APEXP == 0 || sockLink[b].disable == true){}else{	
						player.APMAX = Math.ceil((player.APMAX/(100 + sockLink[b].item.APEXP)*100));
						player.APCUR = Math.ceil((player.APCUR/(100 + sockLink[b].item.APEXP)*100));
					}
					if(sockLink[b].item.EPEXP == undefined || sockLink[b].item.EPEXP == 0 || sockLink[b].disable == true){}else{	
						player.EPMAX = Math.ceil((player.EPMAX/(100 + sockLink[b].item.EPEXP)*100));
						player.EPCUR = Math.ceil((player.EPCUR/(100 + sockLink[b].item.EPEXP)*100));
					}
					if(sockLink[b].item.PPEXP == undefined || sockLink[b].item.PPEXP == 0 || sockLink[b].disable == true){}else{	
						player.PPMAX = Math.ceil((player.PPMAX/(100 + sockLink[b].item.PPEXP)*100));
					}
					if(sockLink[b].item.TPEXP == undefined || sockLink[b].item.TPEXP == 0 || sockLink[b].disable == true){}else{	
						differenceMaxandMinTemp = player.TPMAX - player.TPMIN;
						player.TPMAX = Math.ceil((player.TPMAX/(100 + sockLink[b].item.TPEXP)*100));
						player.TPMIN = player.TPMAX - differenceMaxandMinTemp;
						//console.log(player.TPMIN, player.TPMAX);
					}
					sockLink[b].type = "";
				}
			}
		}
	}
}