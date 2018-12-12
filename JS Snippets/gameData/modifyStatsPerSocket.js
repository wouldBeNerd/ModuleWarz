'use strict'
module.exports = function modifyStatsPerSocket(progress, playerEquiped, enemyEquiped, player, enemy, message){

	var PLSlotCount= Object.keys(playerEquiped).length;	
	var ENSlotCount= Object.keys(enemyEquiped).length;	

	player.PPCUR = 0;
	for(var i = 0; i < PLSlotCount; i++){
		if(playerEquiped[i].item.PPPL == undefined){}else{
			player.PPCUR = player.PPCUR + playerEquiped[i].item.PPPL;
			
		}


		if(playerEquiped[i].applyStats == true){
			//console.log(player, playerEquiped[i].item.APPL)

			if(playerEquiped[i].item.EPPL == undefined || playerEquiped[i].item.EPPL == 0){}else{
				if((player.EPCUR + playerEquiped[i].item.EPPL) < player.EPMIN){
					playerEquiped[i].disable = true;
					document.getElementById(playerEquiped[i].prefixID + "Status").style.opacity="0.7";
					message.push(playerEquiped[i].item.name +" in socket 0" + (i + 1) + " was disabled due to insufficient Battery Power; previous cycle was interupted.");
				}else{
					player.EPCUR = player.EPCUR + playerEquiped[i].item.EPPL;
					if(player.EPCUR > player.EPMAX){
						player.EPCUR = player.EPMAX;
					}

				}
			}
			
			if(playerEquiped[i].item.SPPL == undefined || playerEquiped[i].item.SPPL == 0 || playerEquiped[i].disable == true){}else{
				if((player.SPCUR + playerEquiped[i].item.SPPL) > player.SPMAX){
					player.SPCUR = player.SPMAX;
				}else{
					player.SPCUR = player.SPCUR + playerEquiped[i].item.SPPL;
				}
			}	

			if(playerEquiped[i].item.APPL == undefined || playerEquiped[i].item.APPL == 0 || playerEquiped[i].disable == true){}else{
				if((player.APCUR + playerEquiped[i].item.APPL) > player.APMAX){
					player.APCUR = player.APMAX;
				}else{
					player.APCUR = player.APCUR + playerEquiped[i].item.APPL;
				}
			}

			if(playerEquiped[i].item.TPPL == undefined || playerEquiped[i].item.TPPL == 0 || playerEquiped[i].disable == true){}else{
				player.TPCUR = player.TPCUR + (playerEquiped[i].item.TPPL * 10);
				
				if(player.TPCUR > player.TPMAX){
					player.TPCUR = player.TPMAX;
				}
				if(player.TPCUR < player.TPMIN){
					player.TPCUR = player.TPMIN;
				}

			}

			//			SPEN	APEN	EPEN	PPEN	TPEN	DTEN
			// GOTTA FIX SPEN WITH SHIELD RESISTANCE AS BASED ON DAMAGE; SHIELD WILL ABSORB DAMAGE DEPENDENCE ON THE RESISTANCE OF THE SHIELD



			if(playerEquiped[i].item.SPEN == undefined  || playerEquiped[i].item.APEN == undefined || playerEquiped[i].item.SPEN == 0 || playerEquiped[i].disable == true){}else{
				var SPRESP, APRESP, SPenet, SPREStot, SPDAM, APDAM, SPDAMunUsed;

				SPRESP = enemy.SPRES * 0.01;
				APRESP = 1-((enemy.APRES * 0.01)/2);

				SPenet = 1-(playerEquiped[i].item.SPEN * 0.01);

				SPREStot = SPRESP * SPenet;

				SPDAM =  SPREStot * playerEquiped[i].item.APEN;
				APDAM = APRESP * (playerEquiped[i].item.APEN-SPDAM);




				//console.log(SPRESP, APRESP, SPenet,"SPREStot", SPREStot,"SPDAM", SPDAM,"APDAM", APDAM)
				//APRES not implemented properly yet
				if((enemy.SPCUR + SPDAM) < enemy.SPMIN){
					if(enemy.SPCUR == enemy.SPMIN){
						APDAM = APRESP * playerEquiped[i].item.APEN;
						enemy.APCUR = Math.floor(enemy.APCUR + APDAM);
						//console.log("SP",0,"AP",Math.floor(APDAM));
					}else{
						SPDAMunUsed = SPDAM + enemy.SPCUR;
						enemy.SPCUR = enemy.SPMIN;
						enemy.APCUR = Math.floor(enemy.APCUR + (SPDAMunUsed + APDAM));
						//console.log("SP", enemy.SPCUR, "AP", Math.floor(SPDAMunUsed + APDAM));
					}

				}else{
					if((enemy.SPCUR + SPDAM) > enemy.SPMAX){

					}else{
						enemy.SPCUR = Math.floor(enemy.SPCUR + SPDAM);
						enemy.APCUR = Math.floor(enemy.APCUR + APDAM);
						//console.log("SP",Math.floor(SPDAM),"AP",Math.floor(APDAM));
					}
				}
			}
/*			if(playerEquiped[i].item.APEN == undefined || playerEquiped[i].item.APEN == 0 || playerEquiped[i].disable == true){}else{
				
				enemy.APCUR = enemy.APCUR + (playerEquiped[i].item.APEN - Math.floor(((enemy.SPRES/100) - (playerEquiped[i].item.SPEN/100)) * playerEquiped[i].item.APEN));
				if(enemy.APCUR > enemy.APMAX){enemy.APCUR = enemy.APMAX;}
				if(enemy.APCUR < enemy.APMIN){enemy.APCUR = enemy.APMIN;}
				console.log("SP", Math.floor(((enemy.SPRES/100) - (playerEquiped[i].item.SPEN/100)) * playerEquiped[i].item.APEN));
				console.log("AP",  (playerEquiped[i].item.APEN - Math.floor(((enemy.SPRES/100) - (playerEquiped[i].item.SPEN/100)) * playerEquiped[i].item.APEN)));


			}*/
			if(playerEquiped[i].item.EPEN == undefined || playerEquiped[i].item.EPEN == 0 || playerEquiped[i].disable == true){}else{
				enemy.EPCUR = enemy.EPCUR + playerEquiped[i].item.EPEN;
				if(enemy.EPCUR > enemy.EPMAX){enemy.EPCUR = enemy.EPMAX;}
				if(enemy.EPCUR < enemy.EPMIN){enemy.EPCUR = enemy.EPMIN;}
			}
			if(playerEquiped[i].item.TPEN == undefined || playerEquiped[i].item.TPEN == 0 || playerEquiped[i].disable == true){}else{
				enemy.TPCUR = enemy.TPCUR + playerEquiped[i].item.TPEN;
				if(enemy.TPCUR > enemy.TPMAX){enemy.TPCUR = enemy.TPMAX;}
				if(enemy.TPCUR < enemy.TPMIN){enemy.TPCUR = enemy.TPMIN;}
			}

			playerEquiped[i].applyStats = false;	
		}		
	}
	


/*	for(var i = 0; i < ENSlotCount; i++){
		if(enemyEquiped[i].applyStats == true){
		


			enemyEquiped[i].applyStats = false;	
		}

	}*/

}