'use strict'
module.exports = function checkPPCURSpaceCancel(player, invLink, sockLink, message){

	var invCount = Object.keys(invLink).length;	
	var sockCount = Object.keys(sockLink).length;

	var PPCURallSocks = player.PPCUR;

	for(var i=0; i<invCount; i++){
		if (invLink[i].selected == true){
			for(var b=0; b<sockCount;b++){
				if (sockLink[b].selected == true){
					//console.log(sockLink[b].item);
					if(Object.keys(sockLink[b].item).length == 0){
						if(invLink[i].item.PPPL == 0 ||invLink[i].item.PPPL == undefined||invLink[i].item.PPPL == null){}else{

							//console.log("("+PPCURallSocks+" + "+invLink[i].item.PPPL+") >= "+player.PPMAX);
							if((PPCURallSocks + invLink[i].item.PPPL) >= player.PPMAX){
							//console.log("canceled")	;
									sockLink[b].selected = false;
									message.push("Could not load " + invLink[i].item.name + " in socket " + (b+1) + " due to insufficient Processing Power.");

							}else{
								PPCURallSocks = PPCURallSocks + invLink[i].item.PPPL;
							}
						}		

					}else{

						if(sockLink[b].item.PPPL == 0 ||sockLink[b].item.PPPL == undefined||sockLink[b].item.PPPL == null){
							
						}else{
							
							if(invLink[i].item.PPPL == 0 ||invLink[i].item.PPPL == undefined||invLink[i].item.PPPL == null){
								if((PPCURallSocks - sockLink[b].item.PPPL) >= player.PPMAX){
									sockLink[b].selected = false;
									message.push("Could not unload socket " + (b+1) + "; unloading this item would overload your Processor.");
								}else{
									PPCURallSocks - sockLink[b].item.PPPL;

								}	
							}else{
								if((PPCURallSocks + invLink[i].item.PPPL - sockLink[b].item.PPPL) >= player.PPMAX){
									sockLink[b].selected = false;
									message.push("Could not swap " +sockLink[b].item.name+ " for " +invLink[i].item.name + " in socket " + (b+1) + " as it would overload your Processor");
								}else{
									PPCURallSocks = PPCURallSocks + invLink[i].item.PPPL - sockLink[b].item.PPPL;

								}
							}

						}
				}
				}

			}

		}

	}	
	//console.log(message);

}