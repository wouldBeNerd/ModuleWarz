'use strict'

module.exports = function AITemplateControl(AIstats, player, plSocks, AISocks, AIInv, equipCheckEnemy, AITemplates, AIEquipLoop){
	var sockCount = Object.keys(AISocks).length;
	var plSockCount = Object.keys(plSocks).length;
	var invCount = Object.keys(AIInv).length;



	var AIStatReport = {"SP":0,	"AP":0,	"EP":0,	"TP":0,}
	function scanStats(){
		AIStatReport.SP = 1-(AIstats.SPCUR / AIstats.SPMAX);
		AIStatReport.AP = 1-(AIstats.APCUR / AIstats.APMAX);
		AIStatReport.EP = 1-(AIstats.EPCUR / AIstats.EPMAX);
		AIStatReport.TP = ((AIstats.TPCUR-AIstats.TPMIN) / (AIstats.TPMAX-AIstats.TPMIN));		
		//return AIStatReport;
	}
	scanStats();
	//console.log(AIStatReport);

	function calculateSocketReqs(){
		var high1 = 0; 
		var high2 = 0;
		var id1, id2;
		//GET HIGHEST VALUE
		for(var key in AIStatReport){
			//console.log(AIStatReport[key]);
			high1 = Math.max(high1, AIStatReport[key]);
			if(high1==AIStatReport[key]){
				id1 = key;
			}
		}
		//COPY TO ARRAY WITHOUT HIGHEST, READY TO FIND SECOND HIGHEST
		var AIStatReport2 = {}
		for(var k in AIStatReport){
			if(high1==AIStatReport[k]){}else{
				AIStatReport2[k] = AIStatReport[k]
			}
		}
		//GET SECOND HIGHEST
		//console.log(AIStatReport2)
		for(var kk in AIStatReport2){
			//console.log(AIStatReport2[kk]);
			high2 = Math.max(high2, AIStatReport2[kk]);
			if(high2==AIStatReport2[kk]){
				id2 = kk;
			}
		}
		console.log(id1 +":"+ high1,id2 +":"+  high2);
		//FINE TUNE CONDITIONS //INDIVIDUAL ENEMY RULES GO HERE FIND A WAY TO JSON THESE
		if(high1 == undefined||high2 == undefined){id1 = "APEN", id2 = "APEN";}{
			//if(high1 == 0||high2 == 0){id1 = "APEN", id2 = "APEN";}
			if(high2 <= 0.3){id2 = "APEN";}
			if(id1 == "EP" && high1 >0.7 && high2 <0.4){id2 = "EP"};
		}
		

		//console.log(AIStatReport);
		var topTwo = [id1, id2];
		return topTwo;
	}
	getTemplateByName(calculateSocketReqs());
	
	function getTemplateByName(topTwo){
		
		//console.log(templateName, templateName[0]+templateName[1]);
		for(var key in AITemplates){
			if(topTwo[0] == topTwo[1]){
				if(key == topTwo[0]){
						//console.log(AITemplates[key]);


					var CATS = AITemplates[key];	
				}
			}else{

				if(key == (topTwo[0]+topTwo[1])){
						//console.log(AITemplates[key]);

					var CATS = AITemplates[key];
					
				}
			}
		}
		console.log(CATS);
		equipTemplate(key, CATS, topTwo);
	}
	function equipTemplate(templateName, template, topTwo){
		//console.log(templateName, template);

		console.log("equipcheckenemyCATS =", equipCheckEnemy.CATS);

		for(var i = 0; i < AIInv.length;i++){
			if(AIInv[i].CAT == topTwo[0]){
				var item1 = i; 				
			}
			if(AIInv[i].CAT == topTwo[1]){
				var item2 = i; 				
			}
			if(AIInv[i].CAT == "TP"){
				var itemTP = i; 				
			}			

		}
		equipCheckEnemy.CATS = [];
		equipCheckEnemy.CATS.push(item1);
		equipCheckEnemy.CATS.push(item2);
		equipCheckEnemy.CATS.push(itemTP);
		for(var b = 0; b < AISocks.length; b++){

			if( AISocks[b].item.CAT == undefined){
				
				//console.log(template[b]);

				if(template[b] == topTwo[0]){
					AIEquipLoop[b].invNr = item1;
					AIEquipLoop[b].sockNr = b;
					equipCheckEnemy.sockBool = true;
					equipCheckEnemy.invBool = true;

				}
				if(template[b] == topTwo[1]){
					AIEquipLoop[b].invNr = item2;
					AIEquipLoop[b].sockNr = b; 
					equipCheckEnemy.sockBool = true;
					equipCheckEnemy.invBool = true;
				}
				if(template[b] == "TP"){
					AIEquipLoop[b].invNr = itemTP;
					AIEquipLoop[b].sockNr = b; 
					equipCheckEnemy.sockBool = true;
					equipCheckEnemy.invBool = true;

				}	
				


			}else{
			//DO NOTHING IF THIS CATEGORY IS ALREADY EQUIPED BY THIS CATEGORY
			//console.log(template[b].CAT, AISocks[b].item.CAT);



				if(template[b] == AISocks[b].item.CAT){
					console.log("CAT = CAT", template[b], AISocks[b].item.CAT);
				}else{
					console.log("CAT != CAT", template[b], AISocks[b].item.CAT);
					
					//ONLY EQUIP ITEM1 to TEMPLATE WHERE NECESSARY
				if(template[b] == topTwo[0]){
					AIEquipLoop[b].invNr = item1;
					AIEquipLoop[b].sockNr = b;
					equipCheckEnemy.sockBool = true;
					equipCheckEnemy.invBool = true;

				}
				if(template[b] == topTwo[1]){
					AIEquipLoop[b].invNr = item2;
					AIEquipLoop[b].sockNr = b; 
					equipCheckEnemy.sockBool = true;
					equipCheckEnemy.invBool = true;
				}
				if(template[b] == "TP"){
					AIEquipLoop[b].invNr = itemTP;
					AIEquipLoop[b].sockNr = b; 
					equipCheckEnemy.sockBool = true;
					equipCheckEnemy.invBool = true;
				}	
				



				}
			}
		}		
		console.log(AIEquipLoop);
	}


































	var equipReport = [
		{//00
		"ID":0,	
		"CAT":"empty",	
		"curr":0,
		"currNrs":[],
		"needsNrs":0,
		},
		{//01
		"ID":1,
		"CAT":"APPL",	
		"curr":0,
		"currNrs":[],
		"needsNrs":0,
		},
		{//02
		"ID":2,
		"CAT":"EPPL",
		"curr":0,
		"currNrs":[],
		"needsNrs":0,
		},
		{//03
		
		"ID":3,
		"CAT":"CDPL",
		"curr":0,
		"currNrs":[],
		"needsNrs":0,
		},
		{//04
		"ID":4,
		"CAT":"SPPL",
		"curr":0,
		"currNrs":[],
		"needsNrs":0,
		},
		{//05
		"ID":5,	
		"CAT":"APEN",
		"curr":0,
		"currNrs":[],
		"needsNrs":0,
		}
	]
	//scanEquiped();
	
	function scanEquiped(){
		//Counts and lists all equiped items in equipReport
		for(var i = 0;i<sockCount;i++){
			if(Object.keys(AISocks[i].item).length == 0||AISocks[i].item == undefined){
				equipReport[0].curr++; 
				equipReport[0].currNrs.push(i);
			}
			if(AISocks[i].item.CAT == "AP"){
				equipReport[1].curr++;
				equipReport[1].currNrs.push(i);
			}		
			if(AISocks[i].item.CAT == "EP"){
				equipReport[2].curr++;
				equipReport[2].currNrs.push(i);
			}	
			if(AISocks[i].item.CAT == "YP"){
				equipReport[3].curr++;
				equipReport[3].currNrs.push(i);
			}
			if(AISocks[i].item.CAT == "SP"){
				equipReport[4].curr++;
				equipReport[4].currNrs.push(i);
			}
			if(AISocks[i].item.CAT == "AP"){
				equipReport[5].curr++;
				equipReport[5].currNrs.push(i);
			}			
		}
		//return equipReport;
	}



//OLD SYSTEM

	function checkStatConditions(){
					
		if(AIStatReport.APPerc > 0.7){
			equipReport[1].needsNrs = Math.ceil((AIStatReport.APPerc/2) * sockCount);
		} 
		if(AIStatReport.SPPerc > 0.7){
			equipReport[4].needsNrs = Math.ceil((AIStatReport.SPPerc/2) * sockCount);
		} 
		if(AIStatReport.EPPerc > 0.7){
			equipReport[2].needsNrs = Math.ceil((AIStatReport.EPPerc/2) * sockCount);
		} 
		if(AIStatReport.TPPerc > 0.5){
			equipReport[3].needsNrs = Math.ceil((AIStatReport.TPPerc/2) * sockCount);
		} 
		
		if(equipReport[2].needsNrs > equipReport[1].needsNrs){
		//NEED EP
			console.log("EP");
			equipSocks(equipReport[2],2);
		}else{
			if(equipReport[1].needsNrs > equipReport[3].needsNrs){
			//NEED AP
			console.log("AP");
			equipSocks(equipReport[1],1);
			}else{
				if(equipReport[3].needsNrs > equipReport[4].needsNrs){
				//NEED TP
				console.log("TP");
				equipSocks(equipReport[3],3);
				}else{
					if(equipReport[4].needsNrs > 1){
					//NEED SP
					console.log("SP");
					equipSocks(equipReport[4],4);
					}else{
						console.log("APEN");
						//NEED ATTACK
						equipSocks(equipReport[5],5);
					}	
				}
			}
		}
	}
	//checkStatConditions();
	//console.log(equipReport);

	function equipSocks(targetStat, eqReportNr){
		
		equipReport[eqReportNr].needsNrs = equipReport[eqReportNr].needsNrs - equipReport[eqReportNr].curr;
		//NOW I NEED TO CHECK WHICH TO SWITCH OUT 
		//CHECK FOR EMPTY
		//CHECK FOR 

		//var highest = finder(Math.max, equipReport, "needsNrs", "ID");
		var lowest = finder(Math.min, equipReport, "needsNrs", "ID");
		
		console.log(equipReport[0].curr, lowest[1]);
		
		if (equipReport[0].curr > lowest[1]){
			//all equipment needs can be filled with empty sockets
			for(var i = 0;i<invCount;i++){
				if(AIInv[i].CAT == targetStat.CAT){
					for(var b = 0;b<lowest[0];b++){
					 var sockNr = equipReport[0].currNrs.shift();
						 	if (sockNr == undefined){}else{
						 	//AISocks[sockNr].item = AIInv[i];
						 	console.log(sockNr);
							AISocks[sockNr].disable = false;
							//console.log(AISocks[i]);
							AIInv[i].selected = true;
							AISocks[sockNr].selected = true;
							equipCheckEnemy.sockBool = true;
							equipCheckEnemy.invBool = true;
						}
					}
					equipReport[0].curr = equipReport[0].curr - lowest[1]; 
				}
			}
		}else{
			for(var i = 0;i<invCount;i++){
				if(AIInv[i].CAT == targetStat.CAT){
					var highest = finder(Math.max, equipReport, "curr", "ID");
					console.log(highest[0], highest[1]);	

					for(var b = 0;b<lowest[0];b++){
					 var sockNr = equipReport[highest[0]].currNrs.shift();
					 console.log(sockNr);
							 if (sockNr == undefined){							 }else{
							 	if (targetStat.CAT == AISocks[sockNr].CAT){}else{
							 	//AISocks[sockNr].item = AIInv[i];
							 	console.log(sockNr);
								AISocks[sockNr].disable = false;
								//console.log(AISocks[i]);
								AIInv[i].selected = true;
								AISocks[sockNr].selected = true;
								equipCheckEnemy.sockBool = true;
								equipCheckEnemy.invBool = true;

							}
						}
					}
					equipReport[highest[0]].curr = equipReport[highest[0]].curr - lowest[1]; 
				}
			}

		}


	}




	function finder(cmp, arr, attr, ID) {
	    var val = arr[0][attr];	
	    var id = 0;
	    for(var i=1;i<arr.length;i++) {
	        val = cmp(val, arr[i][attr]);
	        if(val==arr[i][attr]){id = arr[i][ID];}
	    }
	    var returnval  = [id, val];
	    return returnval;
	    //HOW TO USE
/*   	var highest = finder(Math.max, equipReport, "needsNrs", "ID");
		var lowest = finder(Math.min, equipReport, "needsNrs", "ID");
		*/
	}




	function initActions(){

	}


	function scanPlayerEquipment(){

	}
	



	function initiateBattle(){


	}


/* FIND MIN MAX VALUES
	var testarray = [1.5,2,3,5,4,6,1.1,2,6];
 	var minimum = smallestInArray(testarray);
	console.log(minimum);

	function smallestInArray(numberArray){
		return Math.min.apply(Math,numberArray);
	}
	function largestInArray(numberArray){
		return Math.max.apply(Math,numberArray);
	}*/




}