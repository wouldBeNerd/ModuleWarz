'use strict'
module.exports = function updateProgressBars(player, enemy, progress, playerEquiped, enemyEquiped){

	var PLSlotCount= Object.keys(playerEquiped).length;	
	var ENSlotCount= Object.keys(enemyEquiped).length;	
	var timeLeft;
	var widthPercentage;
	var temperatureBalancePoint = 370; 
	

	for(var i = 0; i < PLSlotCount; i++){

		//console.log(i, progress);
		if(playerEquiped[i].item == undefined || playerEquiped[i].CDEnd == 0 || playerEquiped[i].disable == true){
			document.getElementById(playerEquiped[i].prefixID + "Mbar").style.width = 0 + "%";
		}else{
			
			timeLeft = playerEquiped[i].CDEnd - progress;
			widthPercentage = (timeLeft / playerEquiped[i].CDTemp) * 100;
			document.getElementById(playerEquiped[i].prefixID + "Mbar").style.width = widthPercentage + "%"; 
			
			if(playerEquiped[i].CDEnd < progress){
			playerEquiped[i].applyStats = true;
			playerEquiped[i].CDTemp = playerEquiped[i].item.CDPL + (playerEquiped[i].item.CDPL * ((((temperatureBalancePoint - player.TPCUR) * -1)/2)/1000));
			playerEquiped[i].CDEnd = progress + playerEquiped[i].CDTemp;
			
			//console.log(playerEquiped[i].CDEnd, progress);
			}
		}
	}
	for(var i = 0; i < ENSlotCount; i++){

		//console.log(i, progress);
		if(enemyEquiped[i].item == undefined || enemyEquiped[i].CDEnd == 0 || enemyEquiped[i].disable == true){
			document.getElementById(enemyEquiped[i].prefixID + "Mbar").style.width = 0 + "%";
		}else{
			
			timeLeft = enemyEquiped[i].CDEnd - progress;
			widthPercentage = (timeLeft / enemyEquiped[i].CDTemp) * 100;
			document.getElementById(enemyEquiped[i].prefixID + "Mbar").style.width = widthPercentage + "%"; 
			
			if(enemyEquiped[i].CDEnd < progress){
				
			enemyEquiped[i].applyStats = true;

			enemyEquiped[i].CDTemp = enemyEquiped[i].item.CDPL + (enemyEquiped[i].item.CDPL * ((((temperatureBalancePoint - enemy.TPCUR) * -1)/2)/1000));
			enemyEquiped[i].CDEnd = progress + enemyEquiped[i].CDTemp;
			
			//console.log(enemyEquiped[i].CDEnd, progress);
			}


		}

	}	

/*	for(var i = 0; i < ENSlotCount; i++){
		//console.log(i, progress);
		if(enemyEquiped[i].item == undefined || enemyEquiped[i].CDEnd == 0){
			document.getElementById(enemyEquiped[i].prefixID + "Mbar").style.width = 0 + "%";
		}else{
			timeLeft = enemyEquiped[i].CDEnd - progress;
			widthPercentage = (timeLeft / enemyEquiped[i].item.CDPL) * 100;
			document.getElementById(enemyEquiped[i].prefixID + "Mbar").style.width = widthPercentage + "%"; 
		}
		if(enemyEquiped[i].CDEnd < progress){
			enemyEquiped[i].applyStats = true;

			//enemyEquiped[i].CDEnd = progress + enemyEquiped[i].item.CDPL;
			//console.log(enemyEquiped[i].CDEnd, progress);
		}
	}*/
}	


