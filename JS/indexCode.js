(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function findPlayer(){

function loadJSON(callback) { 


var xobj = new XMLHttpRequest();
 xobj.overrideMimeType("application/json");
 xobj.open('GET', 'JSON/players.json', true);
 xobj.onreadystatechange = function () {
 if (xobj.readyState == 4 && xobj.status == "200") {
// .open will NOT return a value but simply returns undefined in async mode so use a callback
 callback(xobj.responseText);
}
 }
 xobj.send(null);
}
// Call to function with anonymous callback
 loadJSON(function(response) {
 // Do Something with the response e.g.
 //jsonresponse = JSON.parse(response);

// Assuming json data is wrapped in square brackets as Drew suggests
 console.log(jsonresponse[0].name);
});
}





/*
init();

function init() {
 loadJSON(function(response) {
  // Parse JSON string into object
    var actual_JSON = JSON.parse(response);
    console.log(actual_JSON);
 });
}


 function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'JSON/players.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }*/
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
'use strict'
module.exports = function AIToggleSelected(iNr, equipCheckEnemy, AIEquipLoop, AIInventory, AISocks){
	for(var i = 0; i < AIEquipLoop.length; i++){
		//console.log(i);
		if(AIEquipLoop[i].invNr == iNr){
			AISocks[i].disable = false;
			//console.log(AISocks[i]);
			AISocks[i].selected = true;
			//if(AIInventory[iNr].selected == undefined){
				//console.log(iNr);
			//}else{
				AIInventory[iNr].selected = true;
			//}
			
			

		}

	}


}
},{}],4:[function(require,module,exports){
		'use strict'
module.exports = function deselectSockandInvArray(equipCheck, invLink, sockLink){

	var invCount = Object.keys(invLink).length;	
	for (var i = 0; i<invCount;i++){
		invLink[i].selected = false;
	}
	var sockCount = Object.keys(sockLink).length;
	for (var b = 0; b<sockCount;b++){
		sockLink[b].selected = false;	
	}
	equipCheck.invBool = false;
	equipCheck.sockBool = false;
}
},{}],5:[function(require,module,exports){
'use strict';
//SENSITIVETO#CSS(backBar, backBarSelected) #HTML(INVButtons, plsinv01backBar-plsinv08backBar) 
module.exports = function findTheClick(e){
	
			var parentID = obtainParent(e);
			var parentParentID = obtainParentParent(parentID);	
			var targetID = obtainTargetID(parentID);

			var idPackage = [parentID, parentParentID, targetID];

	return idPackage


	function obtainParent(e){
		var parentID = e.target.parentNode;
		return parentID;
	}
	function obtainParentParent(parentID){
		var parentParentID = parentID.parentNode;
		return	parentParentID;	
	}
	function obtainTargetID(parentID){
		var targetID = document.getElementById(parentID.id + "backBar");
		return targetID;
	}


};






/*
module.exports = function findTheClick(){

	console.log("found a click");
	
	document.getElementById("plSock01Button").onclick = function(){
		document.getElementById("plSock01backBar").className = "backBarSelected"
	};

};
*/

//FOR TIMING START
/*	var startDate = new Date();
	console.log(startDate.getSeconds(), startDate.getMilliseconds());

	var stopDate = new Date();
	console.log(stopDate.getSeconds(), stopDate.getMilliseconds());*/
},{}],6:[function(require,module,exports){
/*'use strict'

module.exports = function timeStep(){

	var progress;
	var start = null;

	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		this.Tprogress = function(){
			return this.progress;
		}
		this.Tstart = function(){
			return this.start;
		}
		function step(timestamp) {
		  	//THIS IS WHERE THE GAME LIVES
		  	//console.log(progress); 	
			if (start === null) start = timestamp;
			progress = timestamp - start;
			
		    requestAnimationFrame(step);
		}
	requestAnimationFrame(step);


}
*/

},{}],7:[function(require,module,exports){
'use strict'
module.exports = function toggleSelected(idPack, invLink, sockLink, equipCheck){
	var parentID = idPack[0];
	var parentParentID = idPack[1];	
	var targetID = idPack[2];
	var invBool = false;
	var sockBool = false;
	switch(parentParentID.id){
	case "INVButtons":
		var invCount = Object.keys(invLink).length;	
		for (var i = 0; i<invCount;i++){
			if(invLink[i].prefixID == parentID.id && invLink[i].selected == false){
				invLink[i].selected = true;
				equipCheck.invBool = true;
				
			}else{
				if(invLink[i].prefixID == parentID.id && invLink[i].selected == true){
					invLink[i].selected = false;
					equipCheck.invBool = false;	
				}
			}
		}
	
		break;
	case "playerSocks":

		var sockCount = Object.keys(sockLink).length;
		var selectedCount = 0;
		for (var b = 0; b<sockCount;b++){
			if(sockLink[b].prefixID == parentID.id && sockLink[b].selected == true){
				sockLink[b].selected = false;
				sockLink[b].disable = false;
				//STATUS CHANGED HERE
				document.getElementById(sockLink[b].prefixID + "Status").style.opacity="0";
				//
			}else{	
				if(sockLink[b].prefixID == parentID.id && sockLink[b].selected == false){
					sockLink[b].selected = true;
					
				}
			}
			if(sockLink[b].selected == true){
				selectedCount++;
			}	
		}
		if(selectedCount > 0){
			equipCheck.sockBool = true;
		}else{
			equipCheck.sockBool = false;
		}
		break;
	case "INVControls":
		clearSelectedSocksAndInv();
		var invCount = Object.keys(invLink).length;	
		switch(parentID.className){
		case "InvUp":
			equipCheck.scrollBackw =true;
			if(equipCheck.invToVisualBegin == 0){
				equipCheck.invToVisualBegin = (Math.floor(equipCheck.inventoryCount / invCount)*invCount);
				equipCheck.invToVisualEnd = equipCheck.inventoryCount;
			}else{
				equipCheck.invToVisualBegin = equipCheck.invToVisualBegin - invCount;
				equipCheck.invToVisualEnd = equipCheck.invToVisualEnd - invCount;
			}
			break;
		case "InvDown":
			equipCheck.scrollForw =true;
			if((equipCheck.invToVisualEnd + invCount) > equipCheck.inventoryCount){
				equipCheck.invToVisualBegin = 0;
				equipCheck.invToVisualEnd = invCount;
			}else{
				equipCheck.invToVisualBegin = equipCheck.invToVisualBegin + invCount;
				equipCheck.invToVisualEnd = equipCheck.invToVisualEnd + invCount;
			}
			break;	
		case "InvMid":
			equipCheck.scrollMid =true;
			equipCheck.invToVisualBegin = 0;
			equipCheck.invToVisualEnd = invCount;
			break;	
		default:
		}
		break;
	default :
		clearSelectedSocksAndInv();
	
	}

	function clearSelectedSocksAndInv(){
				var invCount = Object.keys(invLink).length;	
		for (var i = 0; i<invCount;i++){
			invLink[i].selected = false;
		}
		var sockCount = Object.keys(sockLink).length;
		for (var b = 0; b<sockCount;b++){
			sockLink[b].selected = false;	
		}

	}



}

},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
						if(invLink[i].PPPL == 0 ||invLink[i].PPPL == undefined||invLink[i].PPPL == null){}else{

							//console.log("("+PPCURallSocks+" + "+invLink[i].PPPL+") >= "+player.PPMAX);
							if((PPCURallSocks + invLink[i].PPPL) >= player.PPMAX){
							//console.log("canceled")	;
									sockLink[b].selected = false;
									message.push("Could not load " + invLink[i].name + " in socket " + (b+1) + " due to insufficient Processing Power.");

							}else{
								PPCURallSocks = PPCURallSocks + invLink[i].PPPL;
							}
						}		

					}else{

						if(sockLink[b].item.PPPL == 0 ||sockLink[b].item.PPPL == undefined||sockLink[b].item.PPPL == null){
							
						}else{
							
							if(invLink[i].PPPL == 0 ||invLink[i].PPPL == undefined||invLink[i].PPPL == null){
								if((PPCURallSocks - sockLink[b].item.PPPL) >= player.PPMAX){
									sockLink[b].selected = false;
									message.push("Could not unload socket " + (b+1) + "; unloading this item would overload your Processor.");
								}else{
									PPCURallSocks - sockLink[b].item.PPPL;

								}	
							}else{
								if((PPCURallSocks + invLink[i].PPPL - sockLink[b].item.PPPL) >= player.PPMAX){
									sockLink[b].selected = false;
									message.push("Could not swap " +sockLink[b].item.name+ " for " +invLink[i].name + " in socket " + (b+1) + " as it would overload your Processor");
								}else{
									PPCURallSocks = PPCURallSocks + invLink[i].PPPL - sockLink[b].item.PPPL;

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
},{}],10:[function(require,module,exports){
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
					sockLink[b].item = invLink[i].item;
					sockLink[b].disable = false; 
					sockLink[b].type = "CD";
					console.log(sockLink[b]);

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
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
'use strict'
module.exports = function loadInventoryStats(equipCheck, invLink, playerInventory){
//set inventorySlotContents.json.item to playerInventory.json.item
	var invCount = Object.keys(invLink).length;	
	equipCheck.inventoryCount = Object.keys(playerInventory).length;
	for (var i = 0; i<invCount;i++){
		if (playerInventory[i+equipCheck.invToVisualBegin] == undefined){
			invLink[i].item = {};
		}else{
		invLink[i].item = playerInventory[i+equipCheck.invToVisualBegin];
		}
	}

} 
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
'use strict'
module.exports = function scrollInventoryClick(e){
	//console.log(e);
		


		        
	        for (var i = 1;i<= 8; i++ ){
	        	document.getElementById("plSinv0" + i +"Icon").src = "backBar";
	        }

}
},{}],16:[function(require,module,exports){
'use strict'
module.exports = function toggleSelected(idPack, invLink, sockLink){

	var parentID = idPack[0];
	var parentParentID = idPack[1];	
	var targetID = idPack[2];


	var INVButtonSelected;
	var SLOTButtonSelected=[];

	var indexofRemovedButton;

	switch(parentParentID.id){
	case "INVButtons":
		var invCount = Object.keys(invLink).length;	
		for (var i = 0; i<invCount;i++){
			if(invLink[i].prefixID == targetID.id){
				invLink[i].selected = true;
				INVButtonSelected = [i,"inventorySlotContent", "eqptModulesID=", invLink[i].eqptModulesID, "playerinventoryID=",  invLink[i].playerinventoryID];
			}else{
				invLink[i].selected = false;
			}
		}
	
		break;
	case "playerSocks":

		var invCount = Object.keys(sockLink).length;
		for (var b = 0; b<invCount;b++){

			if(sockLink[b].prefixID == parentID.id){
				if(sockLink[b].selected == true){
/*					if(SLOTButtonSelected>-1){
						indexofRemovedButton = SLOTButtonSelected.indexof(b);
						SLOTButtonSelected.splice(indexofRemovedButton, 1);
						sockLink[b].selected = false;
						console.log("removed", b);
					}*/
					sockLink[b].selected == false
				}else{

					sockLink[b].selected = true;
					SLOTButtonSelected.push(b);
					//console.log("yes");
				}	
			}else{
				if(sockLink[b].selected == true){
				SLOTButtonSelected.push(b);
				//console.log("no");
				}
			}
		}
		break;
	default :
	
	}
	//console.log(SLOTButtonSelected);



}

},{}],17:[function(require,module,exports){
'use strict';


(function(window,document,undefined){

//CLEAR SOCKETS FOR PLAYER AND ENEMY FOR B EGINNING OF GAME
var prepSocksGame = require('./visual/prepSocksGame.js');
var resetSocksForGame = new prepSocksGame();

//LOAD HUDSIZECONFIG
var hudSizeData = require('../JSON/hudSizesData.json');
//console.log(hudSizeData);
var adjustEnemyHUDSize = require('./visual/adjustEnemyHUDSize.js');
var adjsEnHUDSize= new adjustEnemyHUDSize(hudSizeData);
var adjustPlayerHUDSize = require('./visual/adjustPlayerHUDSize.js');
var adjsPlHUDSize= new adjustPlayerHUDSize(hudSizeData);
//LOAD PLAYER AND ENEMY STATS
var player = require('../JSON/playerStats.json');
var enemy = require('../JSON/enemyStats.json');
//console.log(player.name, player);
//console.log(enemy.name, enemy);
//enemy.SPMAX = 3988;

//LOAD EQUIPMENTMODULESTATS AND SVG LINKS
var eqptMods = require('../JSON/eqptModules.json');
//console.log(Object.keys(eqptMods).length , "Equipment Modules loaded.");
//console.log(eqptMods[21]);
//EQUIPCHECK ARRAY
var equipCheck = require('../JSON/equipCheck.json')
var equipCheckEnemy = require('../JSON/equipCheckEnemy.json')
//LOAD PLAYERINVENTORY ITEMQUALITY AND UPGRADES
var playerInventory = require('../JSON/playerInventory.json');
var invSlotContentLinks = require('../JSON/inventorySlotContents.json');
var loadPlayerInventory = require('./visual/loadPlayerInventory.js');
var playerInv = new loadPlayerInventory(playerInventory,invSlotContentLinks, equipCheck);
//LOAD SOCKINVARRAY
var socksContentLinks = require('../JSON/socksSlotContents.json');
var socksContentLinksEnemy = require('../JSON/socksSlotContentsEnemy.json');

//UPDATE STATS PLAYER AND ENEMY(updates all stats, better to update stas 1 at a time in gametime)
var setPlayerStats = require('./visual/setPlayerStats.js');
var updatePlayerHUD = new setPlayerStats(player);
var setEnemyStats = require('./visual/setEnemyStats.js');
var updateEnemyHUD = new setEnemyStats(enemy);

//ALL BUTTONS DEFINED HERE
var findTheClickContinued = require('./admin/findTheClick.js');
var toggleSelectedInventory = require('./admin/toggleSelected.js');
var changeButtonColour = require('./visual/changeButtonColour.js');

//SETSOCKICONS
var setSockIcons = require('./visual/setSockIcons.js');
var loadInventoryStats = require('./gameData/loadInventoryStats');
var loadItemsToRow = new loadInventoryStats(equipCheck, invSlotContentLinks, playerInventory);
var equipItemToSocks = require('./gameData/equipItemToSocks.js');
var equipItemToSocksEnemy = require('./gameData/equipItemToSocksEnemy.js');

//DESELECTSOCKANDINV ICONS AND ARRAYS
var deselectSockandInv = require('./visual/deselectSockandInv.js');
var deselectSockandInvArray = require('./admin/deselectSockandInvArray.js');

//CHECK PROCESSOR SPACE AND CANCEL THE EQUIP IF NECESSARY.
var checkPPCURSpaceCancel = require('./gameData/checkPPCURSpaceCancel');
var checkPPCURSpaceCancelEnemy = require('./gameData/checkPPCURSpaceCancelEnemy');

//IN GAME MESSAGE LOG - STARTS OFF EMPTY
var gameMessageLog = require('../JSON/gameMessageLog.json');

//UNEQUIPING ALWAYS ON ITEM STATS
var removeAOStatsUnequip = require('./gameData/removeAOStatsUnequip.js');

//GAMETIME MECHANICS REQUIRMENTS
var updateProgressBars = require('./visual/updateProgressBars.js');
var modifyStatsPerSocket = require('./gameData/modifyStatsPerSocket.js');

//AI CONTROLS
var AITemplateControl = require('./admin/AITemplateControl.js');
var AIInventory = require('../JSON/enemyInventory.json');
var AITemplates = require('../JSON/AITemplates.json');
var setSockIconsEnemy = require('./visual/setSockIconsEnemy.js');
var AIToggleSelected = require('./admin/AIToggleSelected.js');

var invSlotContentLinksEnemy = require('../JSON/inventorySlotContentsEnemy.json');
var AIEquipLoop = require('../JSON/AIEquipLoop.json');

//SOCKET CLICKS
document.getElementById("plSock01Button").addEventListener( "click", findTheClick, false);
document.getElementById("plSock02Button").addEventListener( "click", findTheClick, false);
document.getElementById("plSock03Button").addEventListener( "click", findTheClick, false);
document.getElementById("plSock04Button").addEventListener( "click", findTheClick, false);
document.getElementById("plSock05Button").addEventListener( "click", findTheClick, false);
document.getElementById("plSock06Button").addEventListener( "click", findTheClick, false);
document.getElementById("plSock07Button").addEventListener( "click", findTheClick, false);
document.getElementById("plSock08Button").addEventListener( "click", findTheClick, false);
document.getElementById("plSock09Button").addEventListener( "click", findTheClick, false);
//INVENTORY CLICKS
document.getElementById("plSinv01Button").addEventListener( "click", findTheClick, false);
document.getElementById("plSinv02Button").addEventListener( "click", findTheClick, false);
document.getElementById("plSinv03Button").addEventListener( "click", findTheClick, false);
document.getElementById("plSinv04Button").addEventListener( "click", findTheClick, false);
document.getElementById("plSinv05Button").addEventListener( "click", findTheClick, false);
document.getElementById("plSinv06Button").addEventListener( "click", findTheClick, false);
document.getElementById("plSinv07Button").addEventListener( "click", findTheClick, false);
document.getElementById("plSinv08Button").addEventListener( "click", findTheClick, false);

//SCROLLINVENTORY CONTROLS
var scrollInventoryClickContinued = require('./gameData/scrollInventoryClick.js');
document.getElementById("plInvArrowUp").addEventListener( "click", findTheClick, false);
document.getElementById("plInvArrowDown").addEventListener( "click", findTheClick, false);
document.getElementById("plInvArrowMid").addEventListener( "click", findTheClick, false);

function findTheClick(e){
  var idPackClicked = new findTheClickContinued(e);
  var toggleSelected = new toggleSelectedInventory(idPackClicked, invSlotContentLinks,socksContentLinks, equipCheck);
  var changeColour = new changeButtonColour(idPackClicked, invSlotContentLinks, socksContentLinks);  
  if(equipCheck.invBool == true && equipCheck.sockBool == true){equipActions();}
  if(equipCheck.scrollForw==true||equipCheck.scrollBackw==true||equipCheck.scrollMid==true){
    var nextInventoryRow = new loadPlayerInventory(playerInventory,invSlotContentLinks, equipCheck);
    var nextInventoryStats = new loadInventoryStats(equipCheck, invSlotContentLinks, playerInventory);
  }
}
function equipActions(){
  var removeAOStatsUnequipPlayer = new removeAOStatsUnequip(player, socksContentLinks);
  var checkPPCURSpaceAndCancel = new checkPPCURSpaceCancel(player, invSlotContentLinks, socksContentLinks, gameMessageLog);
  var setIcons = new setSockIcons(invSlotContentLinks, socksContentLinks);
  var setItemInSock = new equipItemToSocks(player, progress, invSlotContentLinks, socksContentLinks);
  var deselectSandI = new deselectSockandInv(invSlotContentLinks, socksContentLinks); 
  var deselectSandIArray = new deselectSockandInvArray(equipCheck, invSlotContentLinks, socksContentLinks);
  console.log(invSlotContentLinks, socksContentLinks);
}


function enemyEquipActions(){
  var removeAOStatsUnequipEnemy = new removeAOStatsUnequip(enemy, socksContentLinksEnemy);
  var checkPPCURSpaceAndCancel = new checkPPCURSpaceCancelEnemy(enemy, AIInventory, socksContentLinksEnemy, gameMessageLog);
  var setIconsEnemy = new setSockIconsEnemy(AIInventory, socksContentLinksEnemy);
  var setItemInSock = new equipItemToSocksEnemy(enemy, progress, AIInventory, socksContentLinksEnemy);
  var deselectSandIArray = new deselectSockandInvArray(equipCheckEnemy,AIInventory, socksContentLinksEnemy);
}
function enemyEquipLoop(){

  for(var i = 0; i < equipCheckEnemy.CATS.length; i++){
      if(equipCheckEnemy.CATS[i] == 0||equipCheckEnemy.CATS[i] == undefined){

      }else{

      //console.log(equipCheckEnemy.CATS[i]);

      var AIToggleSelecteds = new AIToggleSelected(equipCheckEnemy.CATS[i], equipCheckEnemy, AIEquipLoop, AIInventory, socksContentLinksEnemy);

      enemyEquipActions();
      }

  }
}





//ANIMATION LOOP
var progress;
var start = null;
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var enemyTimer = start + 3000;
function step(timestamp) {
  	//THIS IS WHERE THE GAMETIME RUNS
    var updatePlayerHUDVisual = new setPlayerStats(player);
    var updateEnemyHUDVisual = new setEnemyStats(enemy);
    var updateStatsPerSocketEquipedPLAYER = new modifyStatsPerSocket(progress, socksContentLinks, socksContentLinksEnemy, player, enemy, gameMessageLog);
    var updateStatsPerSocketEquipedENEMY = new modifyStatsPerSocket(progress, socksContentLinksEnemy, socksContentLinks, enemy, player, gameMessageLog);
    var updateAndCheckAllProgressBarsVisual = new updateProgressBars(player, enemy, progress, socksContentLinks, socksContentLinksEnemy);
    // CHECK FOR ENEMY EQUIP
    if (enemyTimer < progress){
      var initAIBehaviour = new AITemplateControl(enemy, player, socksContentLinks, socksContentLinksEnemy, AIInventory, equipCheckEnemy, AITemplates, AIEquipLoop);
    
      if(equipCheckEnemy.invBool == true && equipCheckEnemy.sockBool == true){enemyEquipLoop();}
    	//console.log(socksContentLinksEnemy);
      enemyTimer = progress + 3000;
    }

	if (start === null) start = timestamp;
	progress = timestamp - start;
    requestAnimationFrame(step);
}
requestAnimationFrame(step);





})(this,document);

//http://stackoverflow.com/questions/5601773/how-do-i-create-a-globally-accessible-variable
//PASS VARIABLE BETWEEN FUNCTIONS
/*
function Person() {
    var secret = "Secret Message";

    this.revealSecret = function() {
        return secret;
    }
}
var me = new Person();
me.revealSecret(); //returns "Secret Message"*/

//REAL JSON CALL
/*var findplayer = require('./findPlayer.js');
var playerlist = findplayer();*/
},{"../JSON/AIEquipLoop.json":30,"../JSON/AITemplates.json":31,"../JSON/enemyInventory.json":32,"../JSON/enemyStats.json":33,"../JSON/eqptModules.json":34,"../JSON/equipCheck.json":35,"../JSON/equipCheckEnemy.json":36,"../JSON/gameMessageLog.json":37,"../JSON/hudSizesData.json":38,"../JSON/inventorySlotContents.json":39,"../JSON/inventorySlotContentsEnemy.json":40,"../JSON/playerInventory.json":41,"../JSON/playerStats.json":42,"../JSON/socksSlotContents.json":43,"../JSON/socksSlotContentsEnemy.json":44,"./admin/AITemplateControl.js":2,"./admin/AIToggleSelected.js":3,"./admin/deselectSockandInvArray.js":4,"./admin/findTheClick.js":5,"./admin/toggleSelected.js":7,"./gameData/checkPPCURSpaceCancel":8,"./gameData/checkPPCURSpaceCancelEnemy":9,"./gameData/equipItemToSocks.js":10,"./gameData/equipItemToSocksEnemy.js":11,"./gameData/loadInventoryStats":12,"./gameData/modifyStatsPerSocket.js":13,"./gameData/removeAOStatsUnequip.js":14,"./gameData/scrollInventoryClick.js":15,"./visual/adjustEnemyHUDSize.js":18,"./visual/adjustPlayerHUDSize.js":19,"./visual/changeButtonColour.js":20,"./visual/deselectSockandInv.js":21,"./visual/loadPlayerInventory.js":23,"./visual/prepSocksGame.js":24,"./visual/setEnemyStats.js":25,"./visual/setPlayerStats.js":26,"./visual/setSockIcons.js":27,"./visual/setSockIconsEnemy.js":28,"./visual/updateProgressBars.js":29}],18:[function(require,module,exports){
module.exports = function adjustEnemyHUDSize(sizesObject){
	//var objCount =  Object.keys(sizesObject).length - 1;
	var enemyHUDDIV = document.getElementById("enemyHUD");
	var widthENHUD = enemyHUDDIV.clientWidth;
	var heightENHUD = Math.ceil(widthENHUD*sizesObject[0].WidthtoHeightHUD);
	document.getElementById("enemyHUD").style.height = heightENHUD;
	var docWidth = document.body.clientWidth;//window.outerWidth;
	document.getElementById("enemyHUD").style.left = docWidth - widthENHUD - 20;
	document.getElementById("enemySOCKS").style.left = docWidth - widthENHUD - 20;
	var sizeFactorFont = widthENHUD / sizesObject[0].width;


	document.getElementById("enShieldTxt").style.fontSize = sizesObject[0].text25 * sizeFactorFont;
	document.getElementById("enArmorTxt").style.fontSize = sizesObject[0].text25 * sizeFactorFont;
	document.getElementById("enBatteryTxt").style.fontSize = sizesObject[0].text25 * sizeFactorFont;
	document.getElementById("enProcessorTxtGhz").style.fontSize = sizesObject[0].text16 * sizeFactorFont;
	document.getElementById("enProcessorMbarPerc").style.fontSize = sizesObject[0].text30 * sizeFactorFont;
	document.getElementById("enProcessorTxtGhzS").style.fontSize =sizesObject[0].text20 * sizeFactorFont;
	document.getElementById("enTemperatureTxtS").style.fontSize = sizesObject[0].text20 * sizeFactorFont;
	document.getElementById("enTemperatureTxt").style.fontSize = sizesObject[0].text50 * sizeFactorFont;



}
},{}],19:[function(require,module,exports){
module.exports = function adjustplayerHUDSize(sizesObject){
	//var objCount =  Object.keys(sizesObject).length - 1;
	var playerHUDDIV = document.getElementById("playerHUD");
	var widthPLHUD = playerHUDDIV.clientWidth;
	var heightPLHUD = Math.ceil(widthPLHUD*sizesObject[0].WidthtoHeightHUD);
	document.getElementById("playerHUD").style.height = heightPLHUD;
	var docWidth = document.body.clientWidth;//window.outerWidth;
/*	document.getElementById("playerHUD").style.left = docWidth - widthPLHUD - 20;
	console.log(docWidth);*/
	var sizeFactorFont = widthPLHUD / sizesObject[0].width;


	document.getElementById("plShieldTxt").style.fontSize = sizesObject[0].text25 * sizeFactorFont;
	document.getElementById("plArmorTxt").style.fontSize = sizesObject[0].text25 * sizeFactorFont;
	document.getElementById("plBatteryTxt").style.fontSize = sizesObject[0].text25 * sizeFactorFont;
	document.getElementById("plProcessorTxtGhz").style.fontSize = sizesObject[0].text16 * sizeFactorFont;
	document.getElementById("plProcessorMbarPerc").style.fontSize = sizesObject[0].text30 * sizeFactorFont;
	document.getElementById("plProcessorTxtGhzS").style.fontSize =sizesObject[0].text20 * sizeFactorFont;
	document.getElementById("plTemperatureTxtS").style.fontSize = sizesObject[0].text20 * sizeFactorFont;
	document.getElementById("plTemperatureTxt").style.fontSize = sizesObject[0].text50 * sizeFactorFont;



}
},{}],20:[function(require,module,exports){
module.exports = function changeButtonColour(idPack, invLink, sockLink){	
	var parentID = idPack[0];
	var parentParentID = idPack[1];	
	var targetID = idPack[2];

	
	switch(parentParentID.id){
	case "INVButtons":
		var invCount = Object.keys(invLink).length;	
		for (var i = 0; i<invCount;i++){
			if(invLink[i].prefixID == parentID.id){
				if(invLink[i].selected == true){
					document.getElementById(invLink[i].prefixID+"backBar").className = "backBarSelected";	
				}else{
					document.getElementById(invLink[i].prefixID+"backBar").className = "backBar";
				}
			}else{
				if(document.getElementById(invLink[i].prefixID+"backBar").className == "backBarSelected"){
					document.getElementById(invLink[i].prefixID+"backBar").className = "backBar";
				}
			}
		}
		break;
	case "playerSocks":
		var sockCount = Object.keys(sockLink).length;
		for (var b = 0; b<sockCount;b++){
			if(sockLink[b].prefixID == parentID.id){
				if(sockLink[b].selected == true){
					document.getElementById(sockLink[b].prefixID+"backBar").className = "backBarSelected";
				}else{
					document.getElementById(sockLink[b].prefixID+"backBar").className = "backBar";
				}
			}

		}
		break;
	case "INVControls":	
		clearSelectedSocksAndInv();
		break;
	default :
		clearSelectedSocksAndInv();
	}
	function clearSelectedSocksAndInv(){
		var invCount = Object.keys(invLink).length;	
		for (var i = 0; i<invCount;i++){
			document.getElementById(invLink[i].prefixID+"backBar").className = "backBar";
		}
		var sockCount = Object.keys(sockLink).length;
		for (var b = 0; b<sockCount;b++){
			document.getElementById(sockLink[b].prefixID+"backBar").className = "backBar";
		}
	}

}
},{}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
'use strict';
//SENSITIVETO#CSS(backBar, backBarSelected) #HTML(INVButtons, plsinv01backBar-plsinv08backBar) 
module.exports = function findTheClick(e){
	
			var parentID = obtainParent(e);
			var parentParentID = obtainParentParent(parentID);	
			var targetID = obtainTargetID(parentID);

			var idPackage = [parentID, parentParentID, targetID, e.id];

	return idPackage


	function obtainParent(e){
		var parentID = e.target.parentNode;
		return parentID;
	}
	function obtainParentParent(parentID){
		var parentParentID = parentID.parentNode;
		return	parentParentID;	
	}
	function obtainTargetID(parentID){
		var targetID = document.getElementById(parentID.id + "backBar");
		return targetID;
	}


};






/*
module.exports = function findTheClick(){

	console.log("found a click");
	
	document.getElementById("plSock01Button").onclick = function(){
		document.getElementById("plSock01backBar").className = "backBarSelected"
	};

};
*/

//FOR TIMING START
/*	var startDate = new Date();
	console.log(startDate.getSeconds(), startDate.getMilliseconds());

	var stopDate = new Date();
	console.log(stopDate.getSeconds(), stopDate.getMilliseconds());*/
},{}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
'use strict'

module.exports = function prepSocksGame(){

	var sockId;
	for(var i = 1;i<=9; i++){

		sockId = "plSock0"+i+"Icon"
		document.getElementById(sockId).src = "";
		document.getElementById(sockId).border = "0px solid";


		sockId = "enSock0"+i+"Icon"
		document.getElementById(sockId).src = "";
		document.getElementById(sockId).border = "0px solid";
	}

}
},{}],25:[function(require,module,exports){
'use strict'

module.exports = function setenemyStats(enemy){
	var pl = enemy;
	var maxwidth = 100;

	document.getElementById("enShieldTxt").innerHTML = pl.SPCUR+"/"+pl.SPMAX;
	document.getElementById("enShieldMbar").style.width = (pl.SPCUR / pl.SPMAX * maxwidth) + "%"; 

	document.getElementById("enArmorTxt").innerHTML = pl.APCUR+"/"+pl.APMAX;
	document.getElementById("enArmorMbar").style.width = (pl.APCUR / pl.APMAX * maxwidth) + "%"; 

	document.getElementById("enBatteryTxt").innerHTML = pl.EPCUR+"/"+pl.EPMAX;
	document.getElementById("enBatteryMbar").style.width = (pl.EPCUR / pl.EPMAX * maxwidth) + "%"; 

	enemyTempUpdateUI(pl.TPCUR, pl.TPMAX);
	enemyCPUUpdateUI(pl.PPCUR, pl.PPMAX);


	function enemyTempUpdateUI(TempPoints, MaxPoints) {
		var r,g,b;
		var tempTextDiv = document.getElementById("enTemperatureTxt");
		tempTextDiv.innerHTML = parseInt(TempPoints/10);
		
		if (TempPoints >240){
		//TRANSITION WHITE TO BLUE
			b = 255-((TempPoints/990)*255);
			b = truncate(b);
			r = 255 ;
			g = b;
		}else{
			//TRANSITION WHITE TO RED
			r = 255 - (((TempPoints* -1)/990)*255);
			r = truncate(r);
			g = r;
			b = 255;
		}
		tempTextDiv.style.color = "rgb(" + r + ","+ g +","+ b +")";
	};
	
	function enemyCPUUpdateUI(CPUPoints, MaxPoints) {
		var barHeight, barTopPos;
		barHeight = ((CPUPoints / MaxPoints) * 100) / 100 * 108;
		barTopPos = 76 - (((CPUPoints / MaxPoints) * 100) / 100 * 76);
		
		document.getElementById("enProcessorTxtGhz").innerHTML = (CPUPoints / 1000);
		document.getElementById("enProcessorMbarPerc").innerHTML = parseInt((CPUPoints / MaxPoints) * 100) + "%" ;
		document.getElementById("enProcessorMbar").style.height = barHeight + "%";
		document.getElementById("enProcessorMbar").style.marginTop = barTopPos + "%";
	};

	//BELOW IS TO TRUNCATE THE RGB VALUES
	function truncate(value){
	    if (value < 0){
	        return Math.ceil(value);
	    }{
	    	return Math.floor(value);
		}
	}	

}
},{}],26:[function(require,module,exports){
'use strict'

module.exports = function setPlayerStats(player){
	var pl = player;
	var maxwidth = 100;

	document.getElementById("plShieldTxt").innerHTML = pl.SPCUR+"/"+pl.SPMAX;
	document.getElementById("plShieldMbar").style.width = (pl.SPCUR / pl.SPMAX * maxwidth) + "%"; 

	document.getElementById("plArmorTxt").innerHTML = pl.APCUR+"/"+pl.APMAX;
	document.getElementById("plArmorMbar").style.width = (pl.APCUR / pl.APMAX * maxwidth) + "%"; 

	document.getElementById("plBatteryTxt").innerHTML = pl.EPCUR+"/"+pl.EPMAX;
	document.getElementById("plBatteryMbar").style.width = (pl.EPCUR / pl.EPMAX * maxwidth) + "%"; 

	PlayerTempUpdateUI(pl.TPCUR, pl.TPMAX);
	PlayerCPUUpdateUI(pl.PPCUR, pl.PPMAX);


	function PlayerTempUpdateUI(TempPoints, MaxPoints) {
		var r,g,b;
		var tempTextDiv = document.getElementById("plTemperatureTxt");
		tempTextDiv.innerHTML = parseInt(TempPoints/10);
		
		if (TempPoints >240){
		//TRANSITION WHITE TO BLUE
			b = 255-((TempPoints/990)*255);
			b = truncate(b);
			r = 255 ;
			g = b;
		}else{
			//TRANSITION WHITE TO RED
			r = 255 - (((TempPoints* -1)/990)*255);
			r = truncate(r);
			g = r;
			b = 255;
		}
		tempTextDiv.style.color = "rgb(" + r + ","+ g +","+ b +")";
	};
	
	function PlayerCPUUpdateUI(CPUPoints, MaxPoints) {
		var barHeight, barTopPos;
		barHeight = ((CPUPoints / MaxPoints) * 100) / 100 * 108;
		barTopPos = 76 - (((CPUPoints / MaxPoints) * 100) / 100 * 76);
		
		document.getElementById("plProcessorTxtGhz").innerHTML = (CPUPoints / 1000);
		document.getElementById("plProcessorMbarPerc").innerHTML = parseInt((CPUPoints / MaxPoints) * 100) + "%" ;
		document.getElementById("plProcessorMbar").style.height = barHeight + "%";
		document.getElementById("plProcessorMbar").style.marginTop = barTopPos + "%";
	};

	//BELOW IS TO TRUNCATE THE RGB VALUES
	function truncate(value){
	    if (value < 0){
	        return Math.ceil(value);
	    }{
	    	return Math.floor(value);
		}
	}	

}
},{}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
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




},{}],29:[function(require,module,exports){
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



},{}],30:[function(require,module,exports){
module.exports='use strict'
module.exports = [
{//0
"invNr":0,
"sockNr":0,
},
{//1
"invNr":0,
"sockNr":0,
},
{//2
"invNr":0,
"sockNr":0,
},
{//3
"invNr":0,
"sockNr":0,
},
{//4
"invNr":0,
"sockNr":0,
},
{//5
"invNr":0,
"sockNr":0,
},
{//6
"invNr":0,
"sockNr":0,
},
{//7
"invNr":0,
"sockNr":0,
},
{//8
"invNr":0,
"sockNr":0,
},

]
},{}],31:[function(require,module,exports){
module.exports='use strict'

module.exports = {
"EP":[
"EP",
"EP",
"EP",
"EP",
"EP",
"EP",
"EP",
"EP",
"TP",
],
"AP":[
"AP",
"AP",
"AP",
"AP",
"AP",
"AP",
"AP",
"AP",
"TP",
],
"TP":[
"EP",
"EP",
"EP",
"TP",
"TP",
"TP",
"TP",
"TP",
"TP",
],
"SP":[
"SP",
"SP",
"SP",
"SP",
"SP",
"SP",
"SP",
"SP",
"TP",
],
"APEN":[
"APEN",
"APEN",
"APEN",
"APEN",
"APEN",
"APEN",
"APEN",
"APEN",
"TP",
],
"EPAP":[
"EP",
"EP",
"EP",
"EP",
"AP",
"AP",
"AP",
"AP",
"TP",
],
"EPSP":[
"EP",
"EP",
"EP",
"EP",
"SP",
"SP",
"SP",
"SP",
"TP",
],
"EPAPEN":[
"EP",
"EP",
"EP",
"EP",
"APEN",
"APEN",
"APEN",
"APEN",
"TP",
],
"APEP":[
"EP",
"EP",
"EP",
"AP",
"AP",
"AP",
"AP",
"AP",
"TP",
],
"APSP":[
"SP",
"SP",
"SP",
"AP",
"AP",
"AP",
"AP",
"AP",
"TP",
],
"APAPEN":[
"APEN",
"APEN",
"APEN",
"AP",
"AP",
"AP",
"AP",
"AP",
"TP",
],
"SPEP":[
"EP",
"EP",
"EP",
"SP",
"SP",
"SP",
"SP",
"SP",
"TP",
],
"SPAP":[
"AP",
"AP",
"AP",
"SP",
"SP",
"SP",
"SP",
"SP",
"TP",
],
"SPAPEN":[
"APEN",
"APEN",
"APEN",
"SP",
"SP",
"SP",
"SP",
"SP",
"TP",
],
"EPTP":[
"EP",
"EP",
"EP",
"EP",
"EP",
"EP",
"TP",
"TP",
"TP",
],
"APTP":[
"AP",
"AP",
"AP",
"AP",
"AP",
"AP",
"TP",
"TP",
"TP",
],
"SPTP":[
"SP",
"SP",
"SP",
"SP",
"SP",
"SP",
"TP",
"TP",
"TP",
],
"APENEP":[
"EP",
"EP",
"EP",
"APEN",
"APEN",
"APEN",
"APEN",
"APEN",
"TP",
],
"APENAP":[
"AP",
"AP",
"AP",
"APEN",
"APEN",
"APEN",
"APEN",
"APEN",
"TP",
],
"APENTP":[
"TP",
"TP",
"TP",
"APEN",
"APEN",
"APEN",
"APEN",
"APEN",
"TP",
],
"APENSP":[
"SP",
"SP",
"SP",
"APEN",
"APEN",
"APEN",
"APEN",
"APEN",
"TP",
],
"TPEP":[
"EP",
"EP",
"EP",
"EP",
"EP",
"TP",
"TP",
"TP",
"TP",
],
"TPAP":[
"AP",
"AP",
"AP",
"AP",
"AP",
"TP",
"TP",
"TP",
"TP",
],
"TPSP":[
"SP",
"SP",
"SP",
"SP",
"SP",
"TP",
"TP",
"TP",
"TP",
],
"TPAPEN":[
"APEN",
"APEN",
"APEN",
"APEN",
"APEN",
"TP",
"TP",
"TP",
"TP",
],


}
},{}],32:[function(require,module,exports){
module.exports='use strict'
module.exports = [
//{},
{//2
"name":"Battery",
"description":"Replenishes your Energy Points",
"filename":"a_battery.svg",
"CDorAO":"CD",
"PPPL":17,
"EPPL":60,
"CDPL":4000,
"CAT":"EP",
"UPGRADES":{"EPPL":1.5,},
"UPGRADELVL":5,
"QUALITIES":{},
"QUALITYLVL":4,
},
{//7
"name":"Cooling Fan",
"description":"Use a Cooling Fan to reduce your Temperature Points",
"filename":"a_coolingFan.svg",
"CDorAO":"CD",
"PPPL":5,
"EPPL":-25,
"CDPL":3000,
"TPPL":-13,
"CAT":"TP",
"UPGRADES":{"CDPL":1.4,"TPPL":1.4,},
"UPGRADELVL":8,
"QUALITIES":{},
"QUALITYLVL":1,
},
{//9
"name":"Laser",
"description":"Attacks the enemy with a Laser",
"filename":"a_laser.svg",
"CDorAO":"CD",
"PPPL":30,
"EPPL":-30,
"CDPL":1500,
"TPPL":3,
"SPEN":40,
"APEN":-40,
"TPEN":30,
"CAT":"APEN",
"UPGRADES":{"CDPL":1.4,},
"UPGRADELVL":4,
"QUALITIES":{},
"QUALITYLVL":1,
},

{//13
"name":"Repair Drone",
"description":"Replenishes your Armor Points",
"filename":"a_nanobotBluePositive.svg",
"CDorAO":"CD",
"APPL":40,
"PPPL":30,
"EPPL":-5,
"CDPL":3000,
"CAT":"AP",
"UPGRADES":{"APPL":1.2,},
"UPGRADELVL":2,
"QUALITIES":{},
"QUALITYLVL":5,
},

{//21
"name":"Shield",
"description":"Replenishes your Shield Points",
"filename":"a_shield.svg",
"CDorAO":"CD",
"SPPL":50,
"PPPL":5,
"EPPL":-30,
"CDPL":4000,
"CAT":"SP",
"UPGRADES":{},
"UPGRADELVL":0,
"QUALITIES":{},
"QUALITYLVL":1,
},


];

},{}],33:[function(require,module,exports){
module.exports='use strict'

module.exports = {
	"name":"EnemyBastard",
	"LVL":6,
	"SPMAX":3321,
	"SPMIN":0,
	"SPCUR":300,
	"APMAX":3150,
	"APMIN":0,
	"APCUR":2500,
	"EPMAX":3000,
	"EPMIN":0,
	"EPCUR":2500,
	"PPMAX":332,
	"PPCUR":0,
	"PPMIN":0,
	"TPMAX":990,
	"TPMIN":-340,
	"TPCUR":-250,
	"APRES":10,
	"SPRES":10,
}
},{}],34:[function(require,module,exports){
module.exports='use strict'
module.exports = [
{//1
"name":"Armor Enforcment",
"description":"Temporarily enforces your armor Increasing your maximum Armor Points",
"filename":"a_armorExtender.svg",
"CDorAO":"AO",
"PPPL":100,
"EPPL":-25,
"SPEXP":-20,
"TPEXP":15,
"APEXP":30,
"PPEXP":-5,
"EPEXP":-15,
"CAT":"AP",
},
{//2
"name":"Battery",
"description":"Replenishes your Energy Points",
"filename":"a_battery.svg",
"CDorAO":"CD",
"PPPL":17,
"EPPL":60,
"CDPL":4000,
"CAT":"EN",
},
{//3
"name":"Battery Booster",
"description":"Replenishes your Energy Points",
"filename":"a_batteryBooster.svg",
"CDorAO":"CD",
"PPPL":50,
"EPPL":400,
"CDPL":15000,
"TPPL":2,
"DTPL":4000,
"CAT":"EN",
},
{//4
"name":"Battery Extender",
"description":"Temporarily extends the maxium capacity of your Energy Points",
"filename":"a_batteryExtension.svg",
"CDorAO":"AO",
"PPPL":15,
"EPPL":-50,
"TPEXP":30,
"EPEXP":40,
"CAT":"ENEXP",
},
{//5
"name":"Minigun",
"description":"Attacks the enemy with a Minigun",
"filename":"a_bullet.svg",
"CDorAO":"CD",
"PPPL":10,
"EPPL":-10,
"CDPL":2500,
"TPPL":1,
"SPEN":20,
"APEN":-20,
"TPEN":1,
"CAT":"APEN",
},
{//6
"name":"Clamp",
"description":"Attacks the enemy with a Clamp",
"filename":"a_clamp.svg",
"CDorAO":"CD",
"PPPL":5,
"EPPL":-40,
"CDPL":2500,
"SPEN":10,
"APEN":-50,
"CAT":"APEN",
},
{//7
"name":"Cooling Fan",
"description":"Use a Cooling Fan to reduce your Temperature Points",
"filename":"a_coolingFan.svg",
"CDorAO":"CD",
"PPPL":5,
"EPPL":-25,
"CDPL":3000,
"TPPL":-13,
"CAT":"TP",
},
{//8
"name":"Liquid Cooling",
"description":"use Liquid Cooling to reduce your Temperature Points",
"filename":"a_coolingLiquid.svg",
"CDorAO":"CD",
"PPPL":5,
"EPPL":-40,
"CDPL":3000,
"TPPL":-30,
"CAT":"TP",
},
{//9
"name":"Laser",
"description":"Attacks the enemy with a Laser",
"filename":"a_laser.svg",
"CDorAO":"CD",
"PPPL":30,
"EPPL":-30,
"CDPL":1500,
"TPPL":3,
"SPEN":40,
"APEN":-40,
"TPEN":6,
"CAT":"APEN",
},
{//10
"name":"Electocute",
"description":"Attacks the enemy by Electrocution.",
"filename":"a_lightning.svg",
"CDorAO":"CD",
"PPPL":60,
"EPPL":-60,
"CDPL":6000,
"TPPL":7,
"DTPL":1000,
"DTLOCKPL":6000,
"SPEN":70,
"APEN":-60,
"TPEN":15,
"CAT":"APEN",
},
{//11
"name":"Microwave",
"description":"Attacks the enemy with Microwaves",
"filename":"a_microwave.svg",
"CDorAO":"CD",
"PPPL":60,
"EPPL":-60,
"CDPL":6000,
"TPPL":7,
"DTPL":1000,
"DTLOCKPL":6000,
"SPEN":70,
"APEN":-100,
"TPEN":18,
"DTEN":3000,
"CAT":"APEN",
},
{//12
"name":"Scout Drone",
"description":"Use a Scout Drone to extract information from the Enemy",
"filename":"a_nanobotBlueNegative.svg",
"CDorAO":"CD",
"PPPL":30,
"EPPL":-5,
"CDPL":3000,
"CAT":"SPY",
},
{//13
"name":"Repair Drone",
"description":"Replenishes your Armor Points",
"filename":"a_nanobotBluePositive.svg",
"CDorAO":"CD",
"APPL":40,
"PPPL":30,
"EPPL":-5,
"CDPL":3000,
"CAT":"AP",
},
{//14
"name":"Sabotage Drone",
"description":"Sabotage Drones can Hack the Enemy's CPU",
"filename":"a_nanobotRedNegative.svg",
"CDorAO":"CD",
"PPPL":30,
"EPPL":-5,
"CDPL":3000,
"EPEN":-40,
"TPEN":10,
"CAT":"EPEN",
},
{//15
"name":"Attack Drone",
"description":"Attacks the enemy with attack drones",
"filename":"a_nanobotRedPositive.svg",
"CDorAO":"CD",
"PPPL":30,
"EPPL":-5,
"CDPL":3000,
"SPEN":40,
"APEN":-60,
"TPEN":2,
"CAT":"APEN",
},
{//16
"name":"Mini Nuke",
"description":"Attacks the enemy with a nuclear warhead",
"filename":"a_nuke.svg",
"CDorAO":"CD",
"PPPL":60,
"EPPL":-60,
"CDPL":12000,
"TPPL":15,
"DTPL":2000,
"DTLOCKPL":8000,
"SPEN":70,
"APEN":-230,
"TPEN":50,
"CAT":"APEN",
},
{//17
"name":"CPU Cacher",
"description":"Caches your CPU freeing up Space",
"filename":"a_processorBooster.svg",
"CDorAO":"CD",
"PPPL":-400,
"EPPL":-50,
"CDPL":15000,
"TPPL":5,
"DTPL":4000,
"CAT":"PP",
},
{//18
"name":"CPU Compressor",
"description":"Compresses your processes granting additional Processing Points",
"filename":"a_processorExtension.svg",
"CDorAO":"AO",
"PPPL":50,
"EPPL":-40,
"TPPL":15,
"TPEXP":30,
"PPEXP":40,
"EPEXP":-40,
"CAT":"PPEXP",
},
{//19
"name":"CPU OverClock",
"description":"Overclocks your CPU granting additional Processing Points",
"filename":"a_processorOverclock.svg",
"CDorAO":"AO",
"PPPL":-150,
"EPPL":-40,
"TPPL":30,
"TPEXP":20,
"APEXP":-10,
"PPEXP":30,
"EPEXP":-20,
"CAT":"PPEXP",
},
{//20
"name":"Rocket Launcher",
"description":"Attacks the enemy with a Rocket Launcher",
"filename":"a_rocket.svg",
"CDorAO":"CD",
"PPPL":30,
"EPPL":-30,
"CDPL":2500,
"TPPL":2,
"SPEN":20,
"APEN":-40,
"TPEN":3,
"CAT":"APEN",
},
{//21
"name":"Shield",
"description":"Replenishes your Shield Points",
"filename":"a_shield.svg",
"CDorAO":"CD",
"SPPL":50,
"PPPL":5,
"EPPL":-30,
"CDPL":4000,
"CAT":"SP",
},
{//22
"name":"Shield Extender",
"description":"Extends the maximum capacity of your Shield Points",
"filename":"a_shieldExtender.svg",
"CDorAO":"AO",
"PPPL":25,
"EPPL":-100,
"SPEXP":30,
"TPEXP":15,
"APEXP":-20,
"PPEXP":-15,
"EPEXP":-5,
"CAT":"SPEXP",
},


];

},{}],35:[function(require,module,exports){
module.exports='use strict'

module.exports = {
"invBool":false,
"sockBool":false,
"invToVisualBegin":0,
"invToVisualEnd":8,
"scrollForw":false,
"scrollBackw":false,
"scrollMid":false,
"inventoryCount":0,
}
},{}],36:[function(require,module,exports){
module.exports='use strict'

module.exports = {
"invBool":false,
"sockBool":false,
"invToVisualBegin":0,
"invToVisualEnd":8,
"scrollForw":false,
"scrollBackw":false,
"scrollMid":false,
"inventoryCount":0,
"CATS":[],
}
},{}],37:[function(require,module,exports){
module.exports='use strict'

module.exports = []
},{}],38:[function(require,module,exports){
module.exports='use strict'

module.exports = [

{//default ratio indicators HUD
"name":"size 100%",
"WidthtoHeightHUD":0.328571,
"height":115,
"width":350,
"text16":16,
"text20":20,
"text25":25,
"text30":40,
"text50":50,
},
]
},{}],39:[function(require,module,exports){
module.exports='use strict'
//ITEMS THAT ARE EQUIPED IN THE INVENTORY BUT NOT CURRENTLY IN USE

module.exports = [
{//1
"prefixID":"plSinv01",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
{//2
"prefixID":"plSinv02",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
{//3
"prefixID":"plSinv03",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
{//4
"prefixID":"plSinv04",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
{//5
"prefixID":"plSinv05",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
{//6
"prefixID":"plSinv06",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
{//7
"prefixID":"plSinv07",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
{//8
"prefixID":"plSinv08",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
]
},{}],40:[function(require,module,exports){
module.exports='use strict'
//ITEMS THAT ARE EQUIPED IN THE INVENTORY BUT NOT CURRENTLY IN USE
module.exports = [
{//1
"prefixID":"enSinv01",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
{//2
"prefixID":"enSinv02",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
{//3
"prefixID":"enSinv03",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
{//4
"prefixID":"enSinv04",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
{//5
"prefixID":"enSinv05",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
{//6
"prefixID":"enSinv06",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
{//7
"prefixID":"enSinv07",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
{//8
"prefixID":"enSinv08",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
},
]
},{}],41:[function(require,module,exports){
module.exports='use strict'
module.exports = [
{//1
"name":"Armor Enforcment",
"description":"Temporarily enforces your armor Increasing your maximum Armor Points",
"filename":"a_armorExtender.svg",
"CDorAO":"AO",
"PPPL":100,
"EPPL":-25,
"SPEXP":-20,
"TPEXP":15,
"APEXP":30,
"PPEXP":-5,
"EPEXP":-15,
"CAT":"AP",
"UPGRADES":{"APEXP":1.8,},
"UPGRADELVL":8,
"QUALITIES":{},
"QUALITYLVL":5,
},
{//2
"name":"Battery",
"description":"Replenishes your Energy Points",
"filename":"a_battery.svg",
"CDorAO":"CD",
"PPPL":17,
"EPPL":60,
"CDPL":4000,
"CAT":"EN",
"UPGRADES":{"EPPL":1.5,},
"UPGRADELVL":5,
"QUALITIES":{},
"QUALITYLVL":4,
},
{//3
"name":"Battery Booster",
"description":"Replenishes your Energy Points",
"filename":"a_batteryBooster.svg",
"CDorAO":"CD",
"PPPL":50,
"EPPL":400,
"CDPL":15000,
"TPPL":2,
"DTPL":4000,
"CAT":"EN",
"UPGRADES":{"CDPL":1.1,},
"UPGRADELVL":1,
"QUALITIES":{},
"QUALITYLVL":1,
},
{//4
"name":"Battery Extender",
"description":"Temporarily extends the maxium capacity of your Energy Points",
"filename":"a_batteryExtension.svg",
"CDorAO":"AO",
"PPPL":15,
"EPPL":-50,
"TPEXP":30,
"EPEXP":40,
"CAT":"ENEXP",
"UPGRADES":{"EPEXP":1.1,},
"UPGRADELVL":1,
"QUALITIES":{},
"QUALITYLVL":2,
},
{//5
"name":"Minigun",
"description":"Attacks the enemy with a Minigun",
"filename":"a_bullet.svg",
"CDorAO":"CD",
"PPPL":10,
"EPPL":-10,
"CDPL":2500,
"TPPL":1,
"SPEN":20,
"APEN":-20,
"TPEN":10,
"CAT":"APEN",
"UPGRADES":{"APEN":1.7,},
"UPGRADELVL":7,
"QUALITIES":{},
"QUALITYLVL":3,
},
{//6
"name":"Clamp",
"description":"Attacks the enemy with a Clamp",
"filename":"a_clamp.svg",
"CDorAO":"CD",
"PPPL":5,
"EPPL":-40,
"CDPL":2500,
"SPEN":10,
"APEN":-50,
"CAT":"APEN",
"UPGRADES":{"CDPL":1.3,"APEN":1.3,},
"UPGRADELVL":6,
"QUALITIES":{},
"QUALITYLVL":4,
},
{//7
"name":"Cooling Fan",
"description":"Use a Cooling Fan to reduce your Temperature Points",
"filename":"a_coolingFan.svg",
"CDorAO":"CD",
"PPPL":5,
"EPPL":-25,
"CDPL":3000,
"TPPL":-13,
"CAT":"TP",
"UPGRADES":{"CDPL":1.4,"TPPL":1.4,},
"UPGRADELVL":8,
"QUALITIES":{},
"QUALITYLVL":1,
},
{//8
"name":"Liquid Cooling",
"description":"use Liquid Cooling to reduce your Temperature Points",
"filename":"a_coolingLiquid.svg",
"CDorAO":"CD",
"PPPL":5,
"EPPL":-40,
"CDPL":3000,
"TPPL":-30,
"CAT":"TP",
"UPGRADES":{"CDPL":1.4,"TPPL":1.5,},
"UPGRADELVL":9,
"QUALITIES":{},
"QUALITYLVL":3,
},
{//9
"name":"Laser",
"description":"Attacks the enemy with a Laser",
"filename":"a_laser.svg",
"CDorAO":"CD",
"PPPL":30,
"EPPL":-30,
"CDPL":1500,
"TPPL":3,
"SPEN":40,
"APEN":-40,
"TPEN":30,
"CAT":"APEN",
"UPGRADES":{"CDPL":1.4,},
"UPGRADELVL":4,
"QUALITIES":{},
"QUALITYLVL":1,
},
{//10
"name":"Electocute",
"description":"Attacks the enemy by Electrocution.",
"filename":"a_lightning.svg",
"CDorAO":"CD",
"PPPL":60,
"EPPL":-60,
"CDPL":6000,
"TPPL":7,
"DTPL":1000,
"DTLOCKPL":6000,
"SPEN":70,
"APEN":-60,
"TPEN":100,
"CAT":"APEN",
"UPGRADES":{"EPPL":1.4,"APEN":1.5,},
"UPGRADELVL":9,
"QUALITIES":{},
"QUALITYLVL":3,
},
{//11
"name":"Microwave",
"description":"Attacks the enemy with Microwaves",
"filename":"a_microwave.svg",
"CDorAO":"CD",
"PPPL":60,
"EPPL":-60,
"CDPL":6000,
"TPPL":7,
"DTPL":1000,
"DTLOCKPL":6000,
"SPEN":70,
"APEN":-100,
"TPEN":150,
"DTEN":3000,
"CAT":"APEN",
"UPGRADES":{},
"UPGRADELVL":0,
"QUALITIES":{},
"QUALITYLVL":4,
},
{//12
"name":"Scout Drone",
"description":"Use a Scout Drone to extract information from the Enemy",
"filename":"a_nanobotBlueNegative.svg",
"CDorAO":"CD",
"PPPL":30,
"EPPL":-5,
"CDPL":3000,
"CAT":"SPY",
"UPGRADES":{},
"UPGRADELVL":0,
"QUALITIES":{},
"QUALITYLVL":3,
},
{//13
"name":"Repair Drone",
"description":"Replenishes your Armor Points",
"filename":"a_nanobotBluePositive.svg",
"CDorAO":"CD",
"APPL":40,
"PPPL":30,
"EPPL":-5,
"CDPL":3000,
"CAT":"AP",
"UPGRADES":{"APPL":1.2,},
"UPGRADELVL":2,
"QUALITIES":{},
"QUALITYLVL":5,
},
{//14
"name":"Sabotage Drone",
"description":"Sabotage Drones can Hack the Enemy's CPU",
"filename":"a_nanobotRedNegative.svg",
"CDorAO":"CD",
"PPPL":30,
"EPPL":-5,
"CDPL":3000,
"EPEN":-40,
"TPEN":100,
"CAT":"EPEN",
"UPGRADES":{"CDPL":1.9,},
"UPGRADELVL":9,
"QUALITIES":{},
"QUALITYLVL":1,
},
{//15
"name":"Attack Drone",
"description":"Attacks the enemy with attack drones",
"filename":"a_nanobotRedPositive.svg",
"CDorAO":"CD",
"PPPL":60,
"EPPL":-5,
"CDPL":3000,
"SPEN":40,
"APEN":-60,
"TPEN":150,
"CAT":"APEN",
"UPGRADES":{},
"UPGRADELVL":0,
"QUALITIES":{},
"QUALITYLVL":4,
},
{//16
"name":"Mini Nuke",
"description":"Attacks the enemy with a nuclear warhead",
"filename":"a_nuke.svg",
"CDorAO":"CD",
"PPPL":60,
"EPPL":-60,
"CDPL":12000,
"TPPL":15,
"DTPL":2000,
"DTLOCKPL":8000,
"SPEN":70,
"APEN":-230,
"TPEN":250,
"CAT":"APEN",
"UPGRADES":{},
"UPGRADELVL":0,
"QUALITIES":{},
"QUALITYLVL":1,
},
{//17
"name":"CPU Cacher",
"description":"Caches your CPU freeing up Space",
"filename":"a_processorBooster.svg",
"CDorAO":"CD",
"PPPL":-400,
"EPPL":-50,
"CDPL":15000,
"TPPL":5,
"DTPL":4000,
"CAT":"PP",
"UPGRADES":{},
"UPGRADELVL":0,
"QUALITIES":{},
"QUALITYLVL":3,
},
{//18
"name":"CPU Compressor",
"description":"Compresses your processes granting additional Processing Points",
"filename":"a_processorExtension.svg",
"CDorAO":"AO",
"PPPL":50,
"EPPL":-40,
"TPPL":15,
"TPEXP":30,
"PPEXP":40,
"EPEXP":-40,
"CAT":"PPEXP",
"UPGRADES":{},
"UPGRADELVL":0,
"QUALITIES":{},
"QUALITYLVL":3,
},
{//19
"name":"CPU OverClock",
"description":"Overclocks your CPU granting additional Processing Points",
"filename":"a_processorOverclock.svg",
"CDorAO":"AO",
"PPPL":-150,
"EPPL":-40,
"TPPL":30,
"TPEXP":20,
"APEXP":-10,
"PPEXP":30,
"EPEXP":-20,
"CAT":"PPEXP",
"UPGRADES":{},
"UPGRADELVL":0,
"QUALITIES":{},
"QUALITYLVL":4,
},
{//20
"name":"Rocket Launcher",
"description":"Attacks the enemy with a Rocket Launcher",
"filename":"a_rocket.svg",
"CDorAO":"CD",
"PPPL":30,
"EPPL":-30,
"CDPL":2500,
"TPPL":2,
"SPEN":20,
"APEN":-40,
"TPEN":3,
"CAT":"APEN",
"UPGRADES":{},
"UPGRADELVL":0,
"QUALITIES":{},
"QUALITYLVL":5,
},
{//21
"name":"Shield",
"description":"Replenishes your Shield Points",
"filename":"a_shield.svg",
"CDorAO":"CD",
"SPPL":50,
"PPPL":5,
"EPPL":-30,
"CDPL":4000,
"CAT":"SP",
"UPGRADES":{},
"UPGRADELVL":0,
"QUALITIES":{},
"QUALITYLVL":1,
},
{//22
"name":"Shield Extender",
"description":"Extends the maximum capacity of your Shield Points",
"filename":"a_shieldExtender.svg",
"CDorAO":"AO",
"PPPL":25,
"EPPL":-100,
"SPEXP":30,
"TPEXP":15,
"APEXP":-20,
"PPEXP":-15,
"EPEXP":-5,
"CAT":"SPEXP",
"UPGRADES":{},
"UPGRADELVL":0,
"QUALITIES":{},
"QUALITYLVL":3,
},


];

},{}],42:[function(require,module,exports){
module.exports='use strict'

module.exports = {
	"name":"PlayerGoodGuy",
	"LVL":5,
	"SPMAX":2532,
	"SPMIN":0,
	"SPCUR":2312,
	"APMAX":2756,
	"APMIN":0,
	"APCUR":2756,
	"EPMAX":1500,
	"EPMIN":0,
	"EPCUR":750,
	"PPMAX":324,
	"PPCUR":0,
	"PPMIN":0,
	"TPMAX":990,
	"TPMIN":-340,
	"TPCUR":340,
	"APRES":50,
	"SPRES":65,
}
},{}],43:[function(require,module,exports){
module.exports='use strict'
//EQUIPED ITEMS GO HERE GO HERE
module.exports = [
{//1
"prefixID":"plSock01", //NEED THIS FOR ALL HTML OR CSS LINKS
"eqptModulesID":1, //CURRENTLY UNUSED 
"playerinventoryID":1, //CURRENTLY UNUSED 
"selected":false, //TOGGLES TO TRUE WHEN SELECTED
"item":{}, //EQUIPED ITEMS ARE STORED IN HERE
"CDEnd":0, //USED TO ANIMATE PROGRESS BARS
"CDTemp":0, //CD CORRECTED BY TEMPERATURE
"applyStats":false,
"disable":false,
"type":"",
},
{//2
"prefixID":"plSock02",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
"type":"",
},
{//3
"prefixID":"plSock03",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
"type":"",
},
{//4
"prefixID":"plSock04",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
"type":"",
},
{//5
"prefixID":"plSock05",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
"type":"",
},
{//6
"prefixID":"plSock06",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
"type":"",
},
{//7
"prefixID":"plSock07",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
"type":"",
},
{//8
"prefixID":"plSock08",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
"type":"",
},
{//9
"prefixID":"plSock09",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
"type":"",
},
]
},{}],44:[function(require,module,exports){
module.exports='use strict'
//EQUIPED ITEMS GO HERE GO HERE
module.exports = [
{//1
"prefixID":"enSock01", //NEED THIS FOR ALL HTML OR CSS LINKS
"eqptModulesID":1, //CURRENTLY UNUSED 
"playerinventoryID":1, //CURRENTLY UNUSED 
"selected":false, //TOGGLES TO TRUE WHEN SELECTED
"item":{}, //EQUIPED ITEMS ARE STORED IN HERE
"CDEnd":0, //USED TO ANIMATE PROGRESS BARS
"CDTemp":0, //CD CORRECTED BY TEMPERATURE
"applyStats":false,
"disable":false,
},
{//2
"prefixID":"enSock02",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
},
{//3
"prefixID":"enSock03",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
},
{//4
"prefixID":"enSock04",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
},
{//5
"prefixID":"enSock05",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
},
{//6
"prefixID":"enSock06",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
},
{//7
"prefixID":"enSock07",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
},
{//8
"prefixID":"enSock08",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
},
{//9
"prefixID":"enSock09",
"eqptModulesID":1,
"playerinventoryID":1,
"selected":false,
"item":{},
"CDEnd":0,
"CDTemp":0,
"applyStats":false,
"disable":false,
},
]
},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJKUyBTbmlwcGV0cy9aX0lOQUNUSVZFZmluZFBsYXllci5qcyIsIkpTIFNuaXBwZXRzL2FkbWluL0FJVGVtcGxhdGVDb250cm9sLmpzIiwiSlMgU25pcHBldHMvYWRtaW4vQUlUb2dnbGVTZWxlY3RlZC5qcyIsIkpTIFNuaXBwZXRzL2FkbWluL2Rlc2VsZWN0U29ja2FuZEludkFycmF5LmpzIiwiSlMgU25pcHBldHMvYWRtaW4vZmluZFRoZUNsaWNrLmpzIiwiSlMgU25pcHBldHMvYWRtaW4vdGltZVN0ZXAuanMiLCJKUyBTbmlwcGV0cy9hZG1pbi90b2dnbGVTZWxlY3RlZC5qcyIsIkpTIFNuaXBwZXRzL2dhbWVEYXRhL2NoZWNrUFBDVVJTcGFjZUNhbmNlbC5qcyIsIkpTIFNuaXBwZXRzL2dhbWVEYXRhL2NoZWNrUFBDVVJTcGFjZUNhbmNlbEVuZW15LmpzIiwiSlMgU25pcHBldHMvZ2FtZURhdGEvZXF1aXBJdGVtVG9Tb2Nrcy5qcyIsIkpTIFNuaXBwZXRzL2dhbWVEYXRhL2VxdWlwSXRlbVRvU29ja3NFbmVteS5qcyIsIkpTIFNuaXBwZXRzL2dhbWVEYXRhL2xvYWRJbnZlbnRvcnlTdGF0cy5qcyIsIkpTIFNuaXBwZXRzL2dhbWVEYXRhL21vZGlmeVN0YXRzUGVyU29ja2V0LmpzIiwiSlMgU25pcHBldHMvZ2FtZURhdGEvcmVtb3ZlQU9TdGF0c1VuZXF1aXAuanMiLCJKUyBTbmlwcGV0cy9nYW1lRGF0YS9zY3JvbGxJbnZlbnRvcnlDbGljay5qcyIsIkpTIFNuaXBwZXRzL2dhbWVEYXRhL3RvZ2dsZVNlbGVjdGVkLmpzIiwiSlMgU25pcHBldHMvbWFpbi5qcyIsIkpTIFNuaXBwZXRzL3Zpc3VhbC9hZGp1c3RFbmVteUhVRFNpemUuanMiLCJKUyBTbmlwcGV0cy92aXN1YWwvYWRqdXN0UGxheWVySFVEU2l6ZS5qcyIsIkpTIFNuaXBwZXRzL3Zpc3VhbC9jaGFuZ2VCdXR0b25Db2xvdXIuanMiLCJKUyBTbmlwcGV0cy92aXN1YWwvZGVzZWxlY3RTb2NrYW5kSW52LmpzIiwiSlMgU25pcHBldHMvdmlzdWFsL2ZpbmRUaGVDbGljay5qcyIsIkpTIFNuaXBwZXRzL3Zpc3VhbC9sb2FkUGxheWVySW52ZW50b3J5LmpzIiwiSlMgU25pcHBldHMvdmlzdWFsL3ByZXBTb2Nrc0dhbWUuanMiLCJKUyBTbmlwcGV0cy92aXN1YWwvc2V0RW5lbXlTdGF0cy5qcyIsIkpTIFNuaXBwZXRzL3Zpc3VhbC9zZXRQbGF5ZXJTdGF0cy5qcyIsIkpTIFNuaXBwZXRzL3Zpc3VhbC9zZXRTb2NrSWNvbnMuanMiLCJKUyBTbmlwcGV0cy92aXN1YWwvc2V0U29ja0ljb25zRW5lbXkuanMiLCJKUyBTbmlwcGV0cy92aXN1YWwvdXBkYXRlUHJvZ3Jlc3NCYXJzLmpzIiwiSlNPTi9BSUVxdWlwTG9vcC5qc29uIiwiSlNPTi9BSVRlbXBsYXRlcy5qc29uIiwiSlNPTi9lbmVteUludmVudG9yeS5qc29uIiwiSlNPTi9lbmVteVN0YXRzLmpzb24iLCJKU09OL2VxcHRNb2R1bGVzLmpzb24iLCJKU09OL2VxdWlwQ2hlY2suanNvbiIsIkpTT04vZXF1aXBDaGVja0VuZW15Lmpzb24iLCJKU09OL2dhbWVNZXNzYWdlTG9nLmpzb24iLCJKU09OL2h1ZFNpemVzRGF0YS5qc29uIiwiSlNPTi9pbnZlbnRvcnlTbG90Q29udGVudHMuanNvbiIsIkpTT04vaW52ZW50b3J5U2xvdENvbnRlbnRzRW5lbXkuanNvbiIsIkpTT04vcGxheWVySW52ZW50b3J5Lmpzb24iLCJKU09OL3BsYXllclN0YXRzLmpzb24iLCJKU09OL3NvY2tzU2xvdENvbnRlbnRzLmpzb24iLCJKU09OL3NvY2tzU2xvdENvbnRlbnRzRW5lbXkuanNvbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmluZFBsYXllcigpe1xyXG5cclxuZnVuY3Rpb24gbG9hZEpTT04oY2FsbGJhY2spIHsgXHJcblxyXG5cclxudmFyIHhvYmogPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuIHhvYmoub3ZlcnJpZGVNaW1lVHlwZShcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiB4b2JqLm9wZW4oJ0dFVCcsICdKU09OL3BsYXllcnMuanNvbicsIHRydWUpO1xyXG4geG9iai5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiBpZiAoeG9iai5yZWFkeVN0YXRlID09IDQgJiYgeG9iai5zdGF0dXMgPT0gXCIyMDBcIikge1xyXG4vLyAub3BlbiB3aWxsIE5PVCByZXR1cm4gYSB2YWx1ZSBidXQgc2ltcGx5IHJldHVybnMgdW5kZWZpbmVkIGluIGFzeW5jIG1vZGUgc28gdXNlIGEgY2FsbGJhY2tcclxuIGNhbGxiYWNrKHhvYmoucmVzcG9uc2VUZXh0KTtcclxufVxyXG4gfVxyXG4geG9iai5zZW5kKG51bGwpO1xyXG59XHJcbi8vIENhbGwgdG8gZnVuY3Rpb24gd2l0aCBhbm9ueW1vdXMgY2FsbGJhY2tcclxuIGxvYWRKU09OKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAvLyBEbyBTb21ldGhpbmcgd2l0aCB0aGUgcmVzcG9uc2UgZS5nLlxyXG4gLy9qc29ucmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuXHJcbi8vIEFzc3VtaW5nIGpzb24gZGF0YSBpcyB3cmFwcGVkIGluIHNxdWFyZSBicmFja2V0cyBhcyBEcmV3IHN1Z2dlc3RzXHJcbiBjb25zb2xlLmxvZyhqc29ucmVzcG9uc2VbMF0ubmFtZSk7XHJcbn0pO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuaW5pdCgpO1xyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuIGxvYWRKU09OKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgLy8gUGFyc2UgSlNPTiBzdHJpbmcgaW50byBvYmplY3RcclxuICAgIHZhciBhY3R1YWxfSlNPTiA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgY29uc29sZS5sb2coYWN0dWFsX0pTT04pO1xyXG4gfSk7XHJcbn1cclxuXHJcblxyXG4gZnVuY3Rpb24gbG9hZEpTT04oY2FsbGJhY2spIHsgICBcclxuXHJcbiAgICB2YXIgeG9iaiA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHhvYmoub3ZlcnJpZGVNaW1lVHlwZShcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiAgICB4b2JqLm9wZW4oJ0dFVCcsICdKU09OL3BsYXllcnMuanNvbicsIHRydWUpOyAvLyBSZXBsYWNlICdteV9kYXRhJyB3aXRoIHRoZSBwYXRoIHRvIHlvdXIgZmlsZVxyXG4gICAgeG9iai5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAoeG9iai5yZWFkeVN0YXRlID09IDQgJiYgeG9iai5zdGF0dXMgPT0gXCIyMDBcIikge1xyXG4gICAgICAgICAgICAvLyBSZXF1aXJlZCB1c2Ugb2YgYW4gYW5vbnltb3VzIGNhbGxiYWNrIGFzIC5vcGVuIHdpbGwgTk9UIHJldHVybiBhIHZhbHVlIGJ1dCBzaW1wbHkgcmV0dXJucyB1bmRlZmluZWQgaW4gYXN5bmNocm9ub3VzIG1vZGVcclxuICAgICAgICAgICAgY2FsbGJhY2soeG9iai5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHhvYmouc2VuZChudWxsKTsgIFxyXG4gfSovIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEFJVGVtcGxhdGVDb250cm9sKEFJc3RhdHMsIHBsYXllciwgcGxTb2NrcywgQUlTb2NrcywgQUlJbnYsIGVxdWlwQ2hlY2tFbmVteSwgQUlUZW1wbGF0ZXMsIEFJRXF1aXBMb29wKXtcclxuXHR2YXIgc29ja0NvdW50ID0gT2JqZWN0LmtleXMoQUlTb2NrcykubGVuZ3RoO1xyXG5cdHZhciBwbFNvY2tDb3VudCA9IE9iamVjdC5rZXlzKHBsU29ja3MpLmxlbmd0aDtcclxuXHR2YXIgaW52Q291bnQgPSBPYmplY3Qua2V5cyhBSUludikubGVuZ3RoO1xyXG5cclxuXHJcblxyXG5cdHZhciBBSVN0YXRSZXBvcnQgPSB7XCJTUFwiOjAsXHRcIkFQXCI6MCxcdFwiRVBcIjowLFx0XCJUUFwiOjAsfVxyXG5cdGZ1bmN0aW9uIHNjYW5TdGF0cygpe1xyXG5cdFx0QUlTdGF0UmVwb3J0LlNQID0gMS0oQUlzdGF0cy5TUENVUiAvIEFJc3RhdHMuU1BNQVgpO1xyXG5cdFx0QUlTdGF0UmVwb3J0LkFQID0gMS0oQUlzdGF0cy5BUENVUiAvIEFJc3RhdHMuQVBNQVgpO1xyXG5cdFx0QUlTdGF0UmVwb3J0LkVQID0gMS0oQUlzdGF0cy5FUENVUiAvIEFJc3RhdHMuRVBNQVgpO1xyXG5cdFx0QUlTdGF0UmVwb3J0LlRQID0gKChBSXN0YXRzLlRQQ1VSLUFJc3RhdHMuVFBNSU4pIC8gKEFJc3RhdHMuVFBNQVgtQUlzdGF0cy5UUE1JTikpO1x0XHRcclxuXHRcdC8vcmV0dXJuIEFJU3RhdFJlcG9ydDtcclxuXHR9XHJcblx0c2NhblN0YXRzKCk7XHJcblx0Ly9jb25zb2xlLmxvZyhBSVN0YXRSZXBvcnQpO1xyXG5cclxuXHRmdW5jdGlvbiBjYWxjdWxhdGVTb2NrZXRSZXFzKCl7XHJcblx0XHR2YXIgaGlnaDEgPSAwOyBcclxuXHRcdHZhciBoaWdoMiA9IDA7XHJcblx0XHR2YXIgaWQxLCBpZDI7XHJcblx0XHQvL0dFVCBISUdIRVNUIFZBTFVFXHJcblx0XHRmb3IodmFyIGtleSBpbiBBSVN0YXRSZXBvcnQpe1xyXG5cdFx0XHQvL2NvbnNvbGUubG9nKEFJU3RhdFJlcG9ydFtrZXldKTtcclxuXHRcdFx0aGlnaDEgPSBNYXRoLm1heChoaWdoMSwgQUlTdGF0UmVwb3J0W2tleV0pO1xyXG5cdFx0XHRpZihoaWdoMT09QUlTdGF0UmVwb3J0W2tleV0pe1xyXG5cdFx0XHRcdGlkMSA9IGtleTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly9DT1BZIFRPIEFSUkFZIFdJVEhPVVQgSElHSEVTVCwgUkVBRFkgVE8gRklORCBTRUNPTkQgSElHSEVTVFxyXG5cdFx0dmFyIEFJU3RhdFJlcG9ydDIgPSB7fVxyXG5cdFx0Zm9yKHZhciBrIGluIEFJU3RhdFJlcG9ydCl7XHJcblx0XHRcdGlmKGhpZ2gxPT1BSVN0YXRSZXBvcnRba10pe31lbHNle1xyXG5cdFx0XHRcdEFJU3RhdFJlcG9ydDJba10gPSBBSVN0YXRSZXBvcnRba11cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly9HRVQgU0VDT05EIEhJR0hFU1RcclxuXHRcdC8vY29uc29sZS5sb2coQUlTdGF0UmVwb3J0MilcclxuXHRcdGZvcih2YXIga2sgaW4gQUlTdGF0UmVwb3J0Mil7XHJcblx0XHRcdC8vY29uc29sZS5sb2coQUlTdGF0UmVwb3J0Mltra10pO1xyXG5cdFx0XHRoaWdoMiA9IE1hdGgubWF4KGhpZ2gyLCBBSVN0YXRSZXBvcnQyW2trXSk7XHJcblx0XHRcdGlmKGhpZ2gyPT1BSVN0YXRSZXBvcnQyW2trXSl7XHJcblx0XHRcdFx0aWQyID0ga2s7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGNvbnNvbGUubG9nKGlkMSArXCI6XCIrIGhpZ2gxLGlkMiArXCI6XCIrICBoaWdoMik7XHJcblx0XHQvL0ZJTkUgVFVORSBDT05ESVRJT05TIC8vSU5ESVZJRFVBTCBFTkVNWSBSVUxFUyBHTyBIRVJFIEZJTkQgQSBXQVkgVE8gSlNPTiBUSEVTRVxyXG5cdFx0aWYoaGlnaDEgPT0gdW5kZWZpbmVkfHxoaWdoMiA9PSB1bmRlZmluZWQpe2lkMSA9IFwiQVBFTlwiLCBpZDIgPSBcIkFQRU5cIjt9e1xyXG5cdFx0XHQvL2lmKGhpZ2gxID09IDB8fGhpZ2gyID09IDApe2lkMSA9IFwiQVBFTlwiLCBpZDIgPSBcIkFQRU5cIjt9XHJcblx0XHRcdGlmKGhpZ2gyIDw9IDAuMyl7aWQyID0gXCJBUEVOXCI7fVxyXG5cdFx0XHRpZihpZDEgPT0gXCJFUFwiICYmIGhpZ2gxID4wLjcgJiYgaGlnaDIgPDAuNCl7aWQyID0gXCJFUFwifTtcclxuXHRcdH1cclxuXHRcdFxyXG5cclxuXHRcdC8vY29uc29sZS5sb2coQUlTdGF0UmVwb3J0KTtcclxuXHRcdHZhciB0b3BUd28gPSBbaWQxLCBpZDJdO1xyXG5cdFx0cmV0dXJuIHRvcFR3bztcclxuXHR9XHJcblx0Z2V0VGVtcGxhdGVCeU5hbWUoY2FsY3VsYXRlU29ja2V0UmVxcygpKTtcclxuXHRcclxuXHRmdW5jdGlvbiBnZXRUZW1wbGF0ZUJ5TmFtZSh0b3BUd28pe1xyXG5cdFx0XHJcblx0XHQvL2NvbnNvbGUubG9nKHRlbXBsYXRlTmFtZSwgdGVtcGxhdGVOYW1lWzBdK3RlbXBsYXRlTmFtZVsxXSk7XHJcblx0XHRmb3IodmFyIGtleSBpbiBBSVRlbXBsYXRlcyl7XHJcblx0XHRcdGlmKHRvcFR3b1swXSA9PSB0b3BUd29bMV0pe1xyXG5cdFx0XHRcdGlmKGtleSA9PSB0b3BUd29bMF0pe1xyXG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKEFJVGVtcGxhdGVzW2tleV0pO1xyXG5cclxuXHJcblx0XHRcdFx0XHR2YXIgQ0FUUyA9IEFJVGVtcGxhdGVzW2tleV07XHRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cclxuXHRcdFx0XHRpZihrZXkgPT0gKHRvcFR3b1swXSt0b3BUd29bMV0pKXtcclxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhBSVRlbXBsYXRlc1trZXldKTtcclxuXHJcblx0XHRcdFx0XHR2YXIgQ0FUUyA9IEFJVGVtcGxhdGVzW2tleV07XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGNvbnNvbGUubG9nKENBVFMpO1xyXG5cdFx0ZXF1aXBUZW1wbGF0ZShrZXksIENBVFMsIHRvcFR3byk7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGVxdWlwVGVtcGxhdGUodGVtcGxhdGVOYW1lLCB0ZW1wbGF0ZSwgdG9wVHdvKXtcclxuXHRcdC8vY29uc29sZS5sb2codGVtcGxhdGVOYW1lLCB0ZW1wbGF0ZSk7XHJcblxyXG5cdFx0Y29uc29sZS5sb2coXCJlcXVpcGNoZWNrZW5lbXlDQVRTID1cIiwgZXF1aXBDaGVja0VuZW15LkNBVFMpO1xyXG5cclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBBSUludi5sZW5ndGg7aSsrKXtcclxuXHRcdFx0aWYoQUlJbnZbaV0uQ0FUID09IHRvcFR3b1swXSl7XHJcblx0XHRcdFx0dmFyIGl0ZW0xID0gaTsgXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihBSUludltpXS5DQVQgPT0gdG9wVHdvWzFdKXtcclxuXHRcdFx0XHR2YXIgaXRlbTIgPSBpOyBcdFx0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKEFJSW52W2ldLkNBVCA9PSBcIlRQXCIpe1xyXG5cdFx0XHRcdHZhciBpdGVtVFAgPSBpOyBcdFx0XHRcdFxyXG5cdFx0XHR9XHRcdFx0XHJcblxyXG5cdFx0fVxyXG5cdFx0ZXF1aXBDaGVja0VuZW15LkNBVFMgPSBbXTtcclxuXHRcdGVxdWlwQ2hlY2tFbmVteS5DQVRTLnB1c2goaXRlbTEpO1xyXG5cdFx0ZXF1aXBDaGVja0VuZW15LkNBVFMucHVzaChpdGVtMik7XHJcblx0XHRlcXVpcENoZWNrRW5lbXkuQ0FUUy5wdXNoKGl0ZW1UUCk7XHJcblx0XHRmb3IodmFyIGIgPSAwOyBiIDwgQUlTb2Nrcy5sZW5ndGg7IGIrKyl7XHJcblxyXG5cdFx0XHRpZiggQUlTb2Nrc1tiXS5pdGVtLkNBVCA9PSB1bmRlZmluZWQpe1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vY29uc29sZS5sb2codGVtcGxhdGVbYl0pO1xyXG5cclxuXHRcdFx0XHRpZih0ZW1wbGF0ZVtiXSA9PSB0b3BUd29bMF0pe1xyXG5cdFx0XHRcdFx0QUlFcXVpcExvb3BbYl0uaW52TnIgPSBpdGVtMTtcclxuXHRcdFx0XHRcdEFJRXF1aXBMb29wW2JdLnNvY2tOciA9IGI7XHJcblx0XHRcdFx0XHRlcXVpcENoZWNrRW5lbXkuc29ja0Jvb2wgPSB0cnVlO1xyXG5cdFx0XHRcdFx0ZXF1aXBDaGVja0VuZW15LmludkJvb2wgPSB0cnVlO1xyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodGVtcGxhdGVbYl0gPT0gdG9wVHdvWzFdKXtcclxuXHRcdFx0XHRcdEFJRXF1aXBMb29wW2JdLmludk5yID0gaXRlbTI7XHJcblx0XHRcdFx0XHRBSUVxdWlwTG9vcFtiXS5zb2NrTnIgPSBiOyBcclxuXHRcdFx0XHRcdGVxdWlwQ2hlY2tFbmVteS5zb2NrQm9vbCA9IHRydWU7XHJcblx0XHRcdFx0XHRlcXVpcENoZWNrRW5lbXkuaW52Qm9vbCA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHRlbXBsYXRlW2JdID09IFwiVFBcIil7XHJcblx0XHRcdFx0XHRBSUVxdWlwTG9vcFtiXS5pbnZOciA9IGl0ZW1UUDtcclxuXHRcdFx0XHRcdEFJRXF1aXBMb29wW2JdLnNvY2tOciA9IGI7IFxyXG5cdFx0XHRcdFx0ZXF1aXBDaGVja0VuZW15LnNvY2tCb29sID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGVxdWlwQ2hlY2tFbmVteS5pbnZCb29sID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0fVx0XHJcblx0XHRcdFx0XHJcblxyXG5cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdC8vRE8gTk9USElORyBJRiBUSElTIENBVEVHT1JZIElTIEFMUkVBRFkgRVFVSVBFRCBCWSBUSElTIENBVEVHT1JZXHJcblx0XHRcdC8vY29uc29sZS5sb2codGVtcGxhdGVbYl0uQ0FULCBBSVNvY2tzW2JdLml0ZW0uQ0FUKTtcclxuXHJcblxyXG5cclxuXHRcdFx0XHRpZih0ZW1wbGF0ZVtiXSA9PSBBSVNvY2tzW2JdLml0ZW0uQ0FUKXtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiQ0FUID0gQ0FUXCIsIHRlbXBsYXRlW2JdLCBBSVNvY2tzW2JdLml0ZW0uQ0FUKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiQ0FUICE9IENBVFwiLCB0ZW1wbGF0ZVtiXSwgQUlTb2Nrc1tiXS5pdGVtLkNBVCk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vT05MWSBFUVVJUCBJVEVNMSB0byBURU1QTEFURSBXSEVSRSBORUNFU1NBUllcclxuXHRcdFx0XHRpZih0ZW1wbGF0ZVtiXSA9PSB0b3BUd29bMF0pe1xyXG5cdFx0XHRcdFx0QUlFcXVpcExvb3BbYl0uaW52TnIgPSBpdGVtMTtcclxuXHRcdFx0XHRcdEFJRXF1aXBMb29wW2JdLnNvY2tOciA9IGI7XHJcblx0XHRcdFx0XHRlcXVpcENoZWNrRW5lbXkuc29ja0Jvb2wgPSB0cnVlO1xyXG5cdFx0XHRcdFx0ZXF1aXBDaGVja0VuZW15LmludkJvb2wgPSB0cnVlO1xyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodGVtcGxhdGVbYl0gPT0gdG9wVHdvWzFdKXtcclxuXHRcdFx0XHRcdEFJRXF1aXBMb29wW2JdLmludk5yID0gaXRlbTI7XHJcblx0XHRcdFx0XHRBSUVxdWlwTG9vcFtiXS5zb2NrTnIgPSBiOyBcclxuXHRcdFx0XHRcdGVxdWlwQ2hlY2tFbmVteS5zb2NrQm9vbCA9IHRydWU7XHJcblx0XHRcdFx0XHRlcXVpcENoZWNrRW5lbXkuaW52Qm9vbCA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHRlbXBsYXRlW2JdID09IFwiVFBcIil7XHJcblx0XHRcdFx0XHRBSUVxdWlwTG9vcFtiXS5pbnZOciA9IGl0ZW1UUDtcclxuXHRcdFx0XHRcdEFJRXF1aXBMb29wW2JdLnNvY2tOciA9IGI7IFxyXG5cdFx0XHRcdFx0ZXF1aXBDaGVja0VuZW15LnNvY2tCb29sID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGVxdWlwQ2hlY2tFbmVteS5pbnZCb29sID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHRcclxuXHRcdFx0XHRcclxuXHJcblxyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cdFx0XHJcblx0XHRjb25zb2xlLmxvZyhBSUVxdWlwTG9vcCk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHR2YXIgZXF1aXBSZXBvcnQgPSBbXHJcblx0XHR7Ly8wMFxyXG5cdFx0XCJJRFwiOjAsXHRcclxuXHRcdFwiQ0FUXCI6XCJlbXB0eVwiLFx0XHJcblx0XHRcImN1cnJcIjowLFxyXG5cdFx0XCJjdXJyTnJzXCI6W10sXHJcblx0XHRcIm5lZWRzTnJzXCI6MCxcclxuXHRcdH0sXHJcblx0XHR7Ly8wMVxyXG5cdFx0XCJJRFwiOjEsXHJcblx0XHRcIkNBVFwiOlwiQVBQTFwiLFx0XHJcblx0XHRcImN1cnJcIjowLFxyXG5cdFx0XCJjdXJyTnJzXCI6W10sXHJcblx0XHRcIm5lZWRzTnJzXCI6MCxcclxuXHRcdH0sXHJcblx0XHR7Ly8wMlxyXG5cdFx0XCJJRFwiOjIsXHJcblx0XHRcIkNBVFwiOlwiRVBQTFwiLFxyXG5cdFx0XCJjdXJyXCI6MCxcclxuXHRcdFwiY3Vyck5yc1wiOltdLFxyXG5cdFx0XCJuZWVkc05yc1wiOjAsXHJcblx0XHR9LFxyXG5cdFx0ey8vMDNcclxuXHRcdFxyXG5cdFx0XCJJRFwiOjMsXHJcblx0XHRcIkNBVFwiOlwiQ0RQTFwiLFxyXG5cdFx0XCJjdXJyXCI6MCxcclxuXHRcdFwiY3Vyck5yc1wiOltdLFxyXG5cdFx0XCJuZWVkc05yc1wiOjAsXHJcblx0XHR9LFxyXG5cdFx0ey8vMDRcclxuXHRcdFwiSURcIjo0LFxyXG5cdFx0XCJDQVRcIjpcIlNQUExcIixcclxuXHRcdFwiY3VyclwiOjAsXHJcblx0XHRcImN1cnJOcnNcIjpbXSxcclxuXHRcdFwibmVlZHNOcnNcIjowLFxyXG5cdFx0fSxcclxuXHRcdHsvLzA1XHJcblx0XHRcIklEXCI6NSxcdFxyXG5cdFx0XCJDQVRcIjpcIkFQRU5cIixcclxuXHRcdFwiY3VyclwiOjAsXHJcblx0XHRcImN1cnJOcnNcIjpbXSxcclxuXHRcdFwibmVlZHNOcnNcIjowLFxyXG5cdFx0fVxyXG5cdF1cclxuXHQvL3NjYW5FcXVpcGVkKCk7XHJcblx0XHJcblx0ZnVuY3Rpb24gc2NhbkVxdWlwZWQoKXtcclxuXHRcdC8vQ291bnRzIGFuZCBsaXN0cyBhbGwgZXF1aXBlZCBpdGVtcyBpbiBlcXVpcFJlcG9ydFxyXG5cdFx0Zm9yKHZhciBpID0gMDtpPHNvY2tDb3VudDtpKyspe1xyXG5cdFx0XHRpZihPYmplY3Qua2V5cyhBSVNvY2tzW2ldLml0ZW0pLmxlbmd0aCA9PSAwfHxBSVNvY2tzW2ldLml0ZW0gPT0gdW5kZWZpbmVkKXtcclxuXHRcdFx0XHRlcXVpcFJlcG9ydFswXS5jdXJyKys7IFxyXG5cdFx0XHRcdGVxdWlwUmVwb3J0WzBdLmN1cnJOcnMucHVzaChpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihBSVNvY2tzW2ldLml0ZW0uQ0FUID09IFwiQVBcIil7XHJcblx0XHRcdFx0ZXF1aXBSZXBvcnRbMV0uY3VycisrO1xyXG5cdFx0XHRcdGVxdWlwUmVwb3J0WzFdLmN1cnJOcnMucHVzaChpKTtcclxuXHRcdFx0fVx0XHRcclxuXHRcdFx0aWYoQUlTb2Nrc1tpXS5pdGVtLkNBVCA9PSBcIkVQXCIpe1xyXG5cdFx0XHRcdGVxdWlwUmVwb3J0WzJdLmN1cnIrKztcclxuXHRcdFx0XHRlcXVpcFJlcG9ydFsyXS5jdXJyTnJzLnB1c2goaSk7XHJcblx0XHRcdH1cdFxyXG5cdFx0XHRpZihBSVNvY2tzW2ldLml0ZW0uQ0FUID09IFwiWVBcIil7XHJcblx0XHRcdFx0ZXF1aXBSZXBvcnRbM10uY3VycisrO1xyXG5cdFx0XHRcdGVxdWlwUmVwb3J0WzNdLmN1cnJOcnMucHVzaChpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihBSVNvY2tzW2ldLml0ZW0uQ0FUID09IFwiU1BcIil7XHJcblx0XHRcdFx0ZXF1aXBSZXBvcnRbNF0uY3VycisrO1xyXG5cdFx0XHRcdGVxdWlwUmVwb3J0WzRdLmN1cnJOcnMucHVzaChpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihBSVNvY2tzW2ldLml0ZW0uQ0FUID09IFwiQVBcIil7XHJcblx0XHRcdFx0ZXF1aXBSZXBvcnRbNV0uY3VycisrO1xyXG5cdFx0XHRcdGVxdWlwUmVwb3J0WzVdLmN1cnJOcnMucHVzaChpKTtcclxuXHRcdFx0fVx0XHRcdFxyXG5cdFx0fVxyXG5cdFx0Ly9yZXR1cm4gZXF1aXBSZXBvcnQ7XHJcblx0fVxyXG5cclxuXHJcblxyXG4vL09MRCBTWVNURU1cclxuXHJcblx0ZnVuY3Rpb24gY2hlY2tTdGF0Q29uZGl0aW9ucygpe1xyXG5cdFx0XHRcdFx0XHJcblx0XHRpZihBSVN0YXRSZXBvcnQuQVBQZXJjID4gMC43KXtcclxuXHRcdFx0ZXF1aXBSZXBvcnRbMV0ubmVlZHNOcnMgPSBNYXRoLmNlaWwoKEFJU3RhdFJlcG9ydC5BUFBlcmMvMikgKiBzb2NrQ291bnQpO1xyXG5cdFx0fSBcclxuXHRcdGlmKEFJU3RhdFJlcG9ydC5TUFBlcmMgPiAwLjcpe1xyXG5cdFx0XHRlcXVpcFJlcG9ydFs0XS5uZWVkc05ycyA9IE1hdGguY2VpbCgoQUlTdGF0UmVwb3J0LlNQUGVyYy8yKSAqIHNvY2tDb3VudCk7XHJcblx0XHR9IFxyXG5cdFx0aWYoQUlTdGF0UmVwb3J0LkVQUGVyYyA+IDAuNyl7XHJcblx0XHRcdGVxdWlwUmVwb3J0WzJdLm5lZWRzTnJzID0gTWF0aC5jZWlsKChBSVN0YXRSZXBvcnQuRVBQZXJjLzIpICogc29ja0NvdW50KTtcclxuXHRcdH0gXHJcblx0XHRpZihBSVN0YXRSZXBvcnQuVFBQZXJjID4gMC41KXtcclxuXHRcdFx0ZXF1aXBSZXBvcnRbM10ubmVlZHNOcnMgPSBNYXRoLmNlaWwoKEFJU3RhdFJlcG9ydC5UUFBlcmMvMikgKiBzb2NrQ291bnQpO1xyXG5cdFx0fSBcclxuXHRcdFxyXG5cdFx0aWYoZXF1aXBSZXBvcnRbMl0ubmVlZHNOcnMgPiBlcXVpcFJlcG9ydFsxXS5uZWVkc05ycyl7XHJcblx0XHQvL05FRUQgRVBcclxuXHRcdFx0Y29uc29sZS5sb2coXCJFUFwiKTtcclxuXHRcdFx0ZXF1aXBTb2NrcyhlcXVpcFJlcG9ydFsyXSwyKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRpZihlcXVpcFJlcG9ydFsxXS5uZWVkc05ycyA+IGVxdWlwUmVwb3J0WzNdLm5lZWRzTnJzKXtcclxuXHRcdFx0Ly9ORUVEIEFQXHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQVBcIik7XHJcblx0XHRcdGVxdWlwU29ja3MoZXF1aXBSZXBvcnRbMV0sMSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGlmKGVxdWlwUmVwb3J0WzNdLm5lZWRzTnJzID4gZXF1aXBSZXBvcnRbNF0ubmVlZHNOcnMpe1xyXG5cdFx0XHRcdC8vTkVFRCBUUFxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiVFBcIik7XHJcblx0XHRcdFx0ZXF1aXBTb2NrcyhlcXVpcFJlcG9ydFszXSwzKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGlmKGVxdWlwUmVwb3J0WzRdLm5lZWRzTnJzID4gMSl7XHJcblx0XHRcdFx0XHQvL05FRUQgU1BcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiU1BcIik7XHJcblx0XHRcdFx0XHRlcXVpcFNvY2tzKGVxdWlwUmVwb3J0WzRdLDQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiQVBFTlwiKTtcclxuXHRcdFx0XHRcdFx0Ly9ORUVEIEFUVEFDS1xyXG5cdFx0XHRcdFx0XHRlcXVpcFNvY2tzKGVxdWlwUmVwb3J0WzVdLDUpO1xyXG5cdFx0XHRcdFx0fVx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdC8vY2hlY2tTdGF0Q29uZGl0aW9ucygpO1xyXG5cdC8vY29uc29sZS5sb2coZXF1aXBSZXBvcnQpO1xyXG5cclxuXHRmdW5jdGlvbiBlcXVpcFNvY2tzKHRhcmdldFN0YXQsIGVxUmVwb3J0TnIpe1xyXG5cdFx0XHJcblx0XHRlcXVpcFJlcG9ydFtlcVJlcG9ydE5yXS5uZWVkc05ycyA9IGVxdWlwUmVwb3J0W2VxUmVwb3J0TnJdLm5lZWRzTnJzIC0gZXF1aXBSZXBvcnRbZXFSZXBvcnROcl0uY3VycjtcclxuXHRcdC8vTk9XIEkgTkVFRCBUTyBDSEVDSyBXSElDSCBUTyBTV0lUQ0ggT1VUIFxyXG5cdFx0Ly9DSEVDSyBGT1IgRU1QVFlcclxuXHRcdC8vQ0hFQ0sgRk9SIFxyXG5cclxuXHRcdC8vdmFyIGhpZ2hlc3QgPSBmaW5kZXIoTWF0aC5tYXgsIGVxdWlwUmVwb3J0LCBcIm5lZWRzTnJzXCIsIFwiSURcIik7XHJcblx0XHR2YXIgbG93ZXN0ID0gZmluZGVyKE1hdGgubWluLCBlcXVpcFJlcG9ydCwgXCJuZWVkc05yc1wiLCBcIklEXCIpO1xyXG5cdFx0XHJcblx0XHRjb25zb2xlLmxvZyhlcXVpcFJlcG9ydFswXS5jdXJyLCBsb3dlc3RbMV0pO1xyXG5cdFx0XHJcblx0XHRpZiAoZXF1aXBSZXBvcnRbMF0uY3VyciA+IGxvd2VzdFsxXSl7XHJcblx0XHRcdC8vYWxsIGVxdWlwbWVudCBuZWVkcyBjYW4gYmUgZmlsbGVkIHdpdGggZW1wdHkgc29ja2V0c1xyXG5cdFx0XHRmb3IodmFyIGkgPSAwO2k8aW52Q291bnQ7aSsrKXtcclxuXHRcdFx0XHRpZihBSUludltpXS5DQVQgPT0gdGFyZ2V0U3RhdC5DQVQpe1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBiID0gMDtiPGxvd2VzdFswXTtiKyspe1xyXG5cdFx0XHRcdFx0IHZhciBzb2NrTnIgPSBlcXVpcFJlcG9ydFswXS5jdXJyTnJzLnNoaWZ0KCk7XHJcblx0XHRcdFx0XHRcdCBcdGlmIChzb2NrTnIgPT0gdW5kZWZpbmVkKXt9ZWxzZXtcclxuXHRcdFx0XHRcdFx0IFx0Ly9BSVNvY2tzW3NvY2tOcl0uaXRlbSA9IEFJSW52W2ldO1xyXG5cdFx0XHRcdFx0XHQgXHRjb25zb2xlLmxvZyhzb2NrTnIpO1xyXG5cdFx0XHRcdFx0XHRcdEFJU29ja3Nbc29ja05yXS5kaXNhYmxlID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhBSVNvY2tzW2ldKTtcclxuXHRcdFx0XHRcdFx0XHRBSUludltpXS5zZWxlY3RlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0QUlTb2Nrc1tzb2NrTnJdLnNlbGVjdGVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRlcXVpcENoZWNrRW5lbXkuc29ja0Jvb2wgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdGVxdWlwQ2hlY2tFbmVteS5pbnZCb29sID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZXF1aXBSZXBvcnRbMF0uY3VyciA9IGVxdWlwUmVwb3J0WzBdLmN1cnIgLSBsb3dlc3RbMV07IFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGZvcih2YXIgaSA9IDA7aTxpbnZDb3VudDtpKyspe1xyXG5cdFx0XHRcdGlmKEFJSW52W2ldLkNBVCA9PSB0YXJnZXRTdGF0LkNBVCl7XHJcblx0XHRcdFx0XHR2YXIgaGlnaGVzdCA9IGZpbmRlcihNYXRoLm1heCwgZXF1aXBSZXBvcnQsIFwiY3VyclwiLCBcIklEXCIpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coaGlnaGVzdFswXSwgaGlnaGVzdFsxXSk7XHRcclxuXHJcblx0XHRcdFx0XHRmb3IodmFyIGIgPSAwO2I8bG93ZXN0WzBdO2IrKyl7XHJcblx0XHRcdFx0XHQgdmFyIHNvY2tOciA9IGVxdWlwUmVwb3J0W2hpZ2hlc3RbMF1dLmN1cnJOcnMuc2hpZnQoKTtcclxuXHRcdFx0XHRcdCBjb25zb2xlLmxvZyhzb2NrTnIpO1xyXG5cdFx0XHRcdFx0XHRcdCBpZiAoc29ja05yID09IHVuZGVmaW5lZCl7XHRcdFx0XHRcdFx0XHQgfWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0IFx0aWYgKHRhcmdldFN0YXQuQ0FUID09IEFJU29ja3Nbc29ja05yXS5DQVQpe31lbHNle1xyXG5cdFx0XHRcdFx0XHRcdCBcdC8vQUlTb2Nrc1tzb2NrTnJdLml0ZW0gPSBBSUludltpXTtcclxuXHRcdFx0XHRcdFx0XHQgXHRjb25zb2xlLmxvZyhzb2NrTnIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0QUlTb2Nrc1tzb2NrTnJdLmRpc2FibGUgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coQUlTb2Nrc1tpXSk7XHJcblx0XHRcdFx0XHRcdFx0XHRBSUludltpXS5zZWxlY3RlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0XHRBSVNvY2tzW3NvY2tOcl0uc2VsZWN0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdFx0ZXF1aXBDaGVja0VuZW15LnNvY2tCb29sID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRcdGVxdWlwQ2hlY2tFbmVteS5pbnZCb29sID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlcXVpcFJlcG9ydFtoaWdoZXN0WzBdXS5jdXJyID0gZXF1aXBSZXBvcnRbaGlnaGVzdFswXV0uY3VyciAtIGxvd2VzdFsxXTsgXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHRmdW5jdGlvbiBmaW5kZXIoY21wLCBhcnIsIGF0dHIsIElEKSB7XHJcblx0ICAgIHZhciB2YWwgPSBhcnJbMF1bYXR0cl07XHRcclxuXHQgICAgdmFyIGlkID0gMDtcclxuXHQgICAgZm9yKHZhciBpPTE7aTxhcnIubGVuZ3RoO2krKykge1xyXG5cdCAgICAgICAgdmFsID0gY21wKHZhbCwgYXJyW2ldW2F0dHJdKTtcclxuXHQgICAgICAgIGlmKHZhbD09YXJyW2ldW2F0dHJdKXtpZCA9IGFycltpXVtJRF07fVxyXG5cdCAgICB9XHJcblx0ICAgIHZhciByZXR1cm52YWwgID0gW2lkLCB2YWxdO1xyXG5cdCAgICByZXR1cm4gcmV0dXJudmFsO1xyXG5cdCAgICAvL0hPVyBUTyBVU0VcclxuLyogICBcdHZhciBoaWdoZXN0ID0gZmluZGVyKE1hdGgubWF4LCBlcXVpcFJlcG9ydCwgXCJuZWVkc05yc1wiLCBcIklEXCIpO1xyXG5cdFx0dmFyIGxvd2VzdCA9IGZpbmRlcihNYXRoLm1pbiwgZXF1aXBSZXBvcnQsIFwibmVlZHNOcnNcIiwgXCJJRFwiKTtcclxuXHRcdCovXHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHRmdW5jdGlvbiBpbml0QWN0aW9ucygpe1xyXG5cclxuXHR9XHJcblxyXG5cclxuXHRmdW5jdGlvbiBzY2FuUGxheWVyRXF1aXBtZW50KCl7XHJcblxyXG5cdH1cclxuXHRcclxuXHJcblxyXG5cclxuXHRmdW5jdGlvbiBpbml0aWF0ZUJhdHRsZSgpe1xyXG5cclxuXHJcblx0fVxyXG5cclxuXHJcbi8qIEZJTkQgTUlOIE1BWCBWQUxVRVNcclxuXHR2YXIgdGVzdGFycmF5ID0gWzEuNSwyLDMsNSw0LDYsMS4xLDIsNl07XHJcbiBcdHZhciBtaW5pbXVtID0gc21hbGxlc3RJbkFycmF5KHRlc3RhcnJheSk7XHJcblx0Y29uc29sZS5sb2cobWluaW11bSk7XHJcblxyXG5cdGZ1bmN0aW9uIHNtYWxsZXN0SW5BcnJheShudW1iZXJBcnJheSl7XHJcblx0XHRyZXR1cm4gTWF0aC5taW4uYXBwbHkoTWF0aCxudW1iZXJBcnJheSk7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGxhcmdlc3RJbkFycmF5KG51bWJlckFycmF5KXtcclxuXHRcdHJldHVybiBNYXRoLm1heC5hcHBseShNYXRoLG51bWJlckFycmF5KTtcclxuXHR9Ki9cclxuXHJcblxyXG5cclxuXHJcbn0iLCIndXNlIHN0cmljdCdcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBBSVRvZ2dsZVNlbGVjdGVkKGlOciwgZXF1aXBDaGVja0VuZW15LCBBSUVxdWlwTG9vcCwgQUlJbnZlbnRvcnksIEFJU29ja3Mpe1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBBSUVxdWlwTG9vcC5sZW5ndGg7IGkrKyl7XHJcblx0XHQvL2NvbnNvbGUubG9nKGkpO1xyXG5cdFx0aWYoQUlFcXVpcExvb3BbaV0uaW52TnIgPT0gaU5yKXtcclxuXHRcdFx0QUlTb2Nrc1tpXS5kaXNhYmxlID0gZmFsc2U7XHJcblx0XHRcdC8vY29uc29sZS5sb2coQUlTb2Nrc1tpXSk7XHJcblx0XHRcdEFJU29ja3NbaV0uc2VsZWN0ZWQgPSB0cnVlO1xyXG5cdFx0XHQvL2lmKEFJSW52ZW50b3J5W2lOcl0uc2VsZWN0ZWQgPT0gdW5kZWZpbmVkKXtcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKGlOcik7XHJcblx0XHRcdC8vfWVsc2V7XHJcblx0XHRcdFx0QUlJbnZlbnRvcnlbaU5yXS5zZWxlY3RlZCA9IHRydWU7XHJcblx0XHRcdC8vfVxyXG5cdFx0XHRcclxuXHRcdFx0XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cclxufSIsIlx0XHQndXNlIHN0cmljdCdcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZXNlbGVjdFNvY2thbmRJbnZBcnJheShlcXVpcENoZWNrLCBpbnZMaW5rLCBzb2NrTGluayl7XHJcblxyXG5cdHZhciBpbnZDb3VudCA9IE9iamVjdC5rZXlzKGludkxpbmspLmxlbmd0aDtcdFxyXG5cdGZvciAodmFyIGkgPSAwOyBpPGludkNvdW50O2krKyl7XHJcblx0XHRpbnZMaW5rW2ldLnNlbGVjdGVkID0gZmFsc2U7XHJcblx0fVxyXG5cdHZhciBzb2NrQ291bnQgPSBPYmplY3Qua2V5cyhzb2NrTGluaykubGVuZ3RoO1xyXG5cdGZvciAodmFyIGIgPSAwOyBiPHNvY2tDb3VudDtiKyspe1xyXG5cdFx0c29ja0xpbmtbYl0uc2VsZWN0ZWQgPSBmYWxzZTtcdFxyXG5cdH1cclxuXHRlcXVpcENoZWNrLmludkJvb2wgPSBmYWxzZTtcclxuXHRlcXVpcENoZWNrLnNvY2tCb29sID0gZmFsc2U7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbi8vU0VOU0lUSVZFVE8jQ1NTKGJhY2tCYXIsIGJhY2tCYXJTZWxlY3RlZCkgI0hUTUwoSU5WQnV0dG9ucywgcGxzaW52MDFiYWNrQmFyLXBsc2ludjA4YmFja0JhcikgXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmluZFRoZUNsaWNrKGUpe1xyXG5cdFxyXG5cdFx0XHR2YXIgcGFyZW50SUQgPSBvYnRhaW5QYXJlbnQoZSk7XHJcblx0XHRcdHZhciBwYXJlbnRQYXJlbnRJRCA9IG9idGFpblBhcmVudFBhcmVudChwYXJlbnRJRCk7XHRcclxuXHRcdFx0dmFyIHRhcmdldElEID0gb2J0YWluVGFyZ2V0SUQocGFyZW50SUQpO1xyXG5cclxuXHRcdFx0dmFyIGlkUGFja2FnZSA9IFtwYXJlbnRJRCwgcGFyZW50UGFyZW50SUQsIHRhcmdldElEXTtcclxuXHJcblx0cmV0dXJuIGlkUGFja2FnZVxyXG5cclxuXHJcblx0ZnVuY3Rpb24gb2J0YWluUGFyZW50KGUpe1xyXG5cdFx0dmFyIHBhcmVudElEID0gZS50YXJnZXQucGFyZW50Tm9kZTtcclxuXHRcdHJldHVybiBwYXJlbnRJRDtcclxuXHR9XHJcblx0ZnVuY3Rpb24gb2J0YWluUGFyZW50UGFyZW50KHBhcmVudElEKXtcclxuXHRcdHZhciBwYXJlbnRQYXJlbnRJRCA9IHBhcmVudElELnBhcmVudE5vZGU7XHJcblx0XHRyZXR1cm5cdHBhcmVudFBhcmVudElEO1x0XHJcblx0fVxyXG5cdGZ1bmN0aW9uIG9idGFpblRhcmdldElEKHBhcmVudElEKXtcclxuXHRcdHZhciB0YXJnZXRJRCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhcmVudElELmlkICsgXCJiYWNrQmFyXCIpO1xyXG5cdFx0cmV0dXJuIHRhcmdldElEO1xyXG5cdH1cclxuXHJcblxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbmRUaGVDbGljaygpe1xyXG5cclxuXHRjb25zb2xlLmxvZyhcImZvdW5kIGEgY2xpY2tcIik7XHJcblx0XHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbFNvY2swMUJ1dHRvblwiKS5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxTb2NrMDFiYWNrQmFyXCIpLmNsYXNzTmFtZSA9IFwiYmFja0JhclNlbGVjdGVkXCJcclxuXHR9O1xyXG5cclxufTtcclxuKi9cclxuXHJcbi8vRk9SIFRJTUlORyBTVEFSVFxyXG4vKlx0dmFyIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XHJcblx0Y29uc29sZS5sb2coc3RhcnREYXRlLmdldFNlY29uZHMoKSwgc3RhcnREYXRlLmdldE1pbGxpc2Vjb25kcygpKTtcclxuXHJcblx0dmFyIHN0b3BEYXRlID0gbmV3IERhdGUoKTtcclxuXHRjb25zb2xlLmxvZyhzdG9wRGF0ZS5nZXRTZWNvbmRzKCksIHN0b3BEYXRlLmdldE1pbGxpc2Vjb25kcygpKTsqLyIsIi8qJ3VzZSBzdHJpY3QnXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRpbWVTdGVwKCl7XHJcblxyXG5cdHZhciBwcm9ncmVzcztcclxuXHR2YXIgc3RhcnQgPSBudWxsO1xyXG5cclxuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XHJcblxyXG5cdFx0dGhpcy5UcHJvZ3Jlc3MgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wcm9ncmVzcztcclxuXHRcdH1cclxuXHRcdHRoaXMuVHN0YXJ0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0cmV0dXJuIHRoaXMuc3RhcnQ7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBzdGVwKHRpbWVzdGFtcCkge1xyXG5cdFx0ICBcdC8vVEhJUyBJUyBXSEVSRSBUSEUgR0FNRSBMSVZFU1xyXG5cdFx0ICBcdC8vY29uc29sZS5sb2cocHJvZ3Jlc3MpOyBcdFxyXG5cdFx0XHRpZiAoc3RhcnQgPT09IG51bGwpIHN0YXJ0ID0gdGltZXN0YW1wO1xyXG5cdFx0XHRwcm9ncmVzcyA9IHRpbWVzdGFtcCAtIHN0YXJ0O1xyXG5cdFx0XHRcclxuXHRcdCAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XHJcblx0XHR9XHJcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG5cclxuXHJcbn1cclxuKi9cclxuIiwiJ3VzZSBzdHJpY3QnXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9nZ2xlU2VsZWN0ZWQoaWRQYWNrLCBpbnZMaW5rLCBzb2NrTGluaywgZXF1aXBDaGVjayl7XHJcblx0dmFyIHBhcmVudElEID0gaWRQYWNrWzBdO1xyXG5cdHZhciBwYXJlbnRQYXJlbnRJRCA9IGlkUGFja1sxXTtcdFxyXG5cdHZhciB0YXJnZXRJRCA9IGlkUGFja1syXTtcclxuXHR2YXIgaW52Qm9vbCA9IGZhbHNlO1xyXG5cdHZhciBzb2NrQm9vbCA9IGZhbHNlO1xyXG5cdHN3aXRjaChwYXJlbnRQYXJlbnRJRC5pZCl7XHJcblx0Y2FzZSBcIklOVkJ1dHRvbnNcIjpcclxuXHRcdHZhciBpbnZDb3VudCA9IE9iamVjdC5rZXlzKGludkxpbmspLmxlbmd0aDtcdFxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGk8aW52Q291bnQ7aSsrKXtcclxuXHRcdFx0aWYoaW52TGlua1tpXS5wcmVmaXhJRCA9PSBwYXJlbnRJRC5pZCAmJiBpbnZMaW5rW2ldLnNlbGVjdGVkID09IGZhbHNlKXtcclxuXHRcdFx0XHRpbnZMaW5rW2ldLnNlbGVjdGVkID0gdHJ1ZTtcclxuXHRcdFx0XHRlcXVpcENoZWNrLmludkJvb2wgPSB0cnVlO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRpZihpbnZMaW5rW2ldLnByZWZpeElEID09IHBhcmVudElELmlkICYmIGludkxpbmtbaV0uc2VsZWN0ZWQgPT0gdHJ1ZSl7XHJcblx0XHRcdFx0XHRpbnZMaW5rW2ldLnNlbGVjdGVkID0gZmFsc2U7XHJcblx0XHRcdFx0XHRlcXVpcENoZWNrLmludkJvb2wgPSBmYWxzZTtcdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFxyXG5cdFx0YnJlYWs7XHJcblx0Y2FzZSBcInBsYXllclNvY2tzXCI6XHJcblxyXG5cdFx0dmFyIHNvY2tDb3VudCA9IE9iamVjdC5rZXlzKHNvY2tMaW5rKS5sZW5ndGg7XHJcblx0XHR2YXIgc2VsZWN0ZWRDb3VudCA9IDA7XHJcblx0XHRmb3IgKHZhciBiID0gMDsgYjxzb2NrQ291bnQ7YisrKXtcclxuXHRcdFx0aWYoc29ja0xpbmtbYl0ucHJlZml4SUQgPT0gcGFyZW50SUQuaWQgJiYgc29ja0xpbmtbYl0uc2VsZWN0ZWQgPT0gdHJ1ZSl7XHJcblx0XHRcdFx0c29ja0xpbmtbYl0uc2VsZWN0ZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRzb2NrTGlua1tiXS5kaXNhYmxlID0gZmFsc2U7XHJcblx0XHRcdFx0Ly9TVEFUVVMgQ0hBTkdFRCBIRVJFXHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc29ja0xpbmtbYl0ucHJlZml4SUQgKyBcIlN0YXR1c1wiKS5zdHlsZS5vcGFjaXR5PVwiMFwiO1xyXG5cdFx0XHRcdC8vXHJcblx0XHRcdH1lbHNle1x0XHJcblx0XHRcdFx0aWYoc29ja0xpbmtbYl0ucHJlZml4SUQgPT0gcGFyZW50SUQuaWQgJiYgc29ja0xpbmtbYl0uc2VsZWN0ZWQgPT0gZmFsc2Upe1xyXG5cdFx0XHRcdFx0c29ja0xpbmtbYl0uc2VsZWN0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHNvY2tMaW5rW2JdLnNlbGVjdGVkID09IHRydWUpe1xyXG5cdFx0XHRcdHNlbGVjdGVkQ291bnQrKztcclxuXHRcdFx0fVx0XHJcblx0XHR9XHJcblx0XHRpZihzZWxlY3RlZENvdW50ID4gMCl7XHJcblx0XHRcdGVxdWlwQ2hlY2suc29ja0Jvb2wgPSB0cnVlO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGVxdWlwQ2hlY2suc29ja0Jvb2wgPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGJyZWFrO1xyXG5cdGNhc2UgXCJJTlZDb250cm9sc1wiOlxyXG5cdFx0Y2xlYXJTZWxlY3RlZFNvY2tzQW5kSW52KCk7XHJcblx0XHR2YXIgaW52Q291bnQgPSBPYmplY3Qua2V5cyhpbnZMaW5rKS5sZW5ndGg7XHRcclxuXHRcdHN3aXRjaChwYXJlbnRJRC5jbGFzc05hbWUpe1xyXG5cdFx0Y2FzZSBcIkludlVwXCI6XHJcblx0XHRcdGVxdWlwQ2hlY2suc2Nyb2xsQmFja3cgPXRydWU7XHJcblx0XHRcdGlmKGVxdWlwQ2hlY2suaW52VG9WaXN1YWxCZWdpbiA9PSAwKXtcclxuXHRcdFx0XHRlcXVpcENoZWNrLmludlRvVmlzdWFsQmVnaW4gPSAoTWF0aC5mbG9vcihlcXVpcENoZWNrLmludmVudG9yeUNvdW50IC8gaW52Q291bnQpKmludkNvdW50KTtcclxuXHRcdFx0XHRlcXVpcENoZWNrLmludlRvVmlzdWFsRW5kID0gZXF1aXBDaGVjay5pbnZlbnRvcnlDb3VudDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZXF1aXBDaGVjay5pbnZUb1Zpc3VhbEJlZ2luID0gZXF1aXBDaGVjay5pbnZUb1Zpc3VhbEJlZ2luIC0gaW52Q291bnQ7XHJcblx0XHRcdFx0ZXF1aXBDaGVjay5pbnZUb1Zpc3VhbEVuZCA9IGVxdWlwQ2hlY2suaW52VG9WaXN1YWxFbmQgLSBpbnZDb3VudDtcclxuXHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgXCJJbnZEb3duXCI6XHJcblx0XHRcdGVxdWlwQ2hlY2suc2Nyb2xsRm9ydyA9dHJ1ZTtcclxuXHRcdFx0aWYoKGVxdWlwQ2hlY2suaW52VG9WaXN1YWxFbmQgKyBpbnZDb3VudCkgPiBlcXVpcENoZWNrLmludmVudG9yeUNvdW50KXtcclxuXHRcdFx0XHRlcXVpcENoZWNrLmludlRvVmlzdWFsQmVnaW4gPSAwO1xyXG5cdFx0XHRcdGVxdWlwQ2hlY2suaW52VG9WaXN1YWxFbmQgPSBpbnZDb3VudDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZXF1aXBDaGVjay5pbnZUb1Zpc3VhbEJlZ2luID0gZXF1aXBDaGVjay5pbnZUb1Zpc3VhbEJlZ2luICsgaW52Q291bnQ7XHJcblx0XHRcdFx0ZXF1aXBDaGVjay5pbnZUb1Zpc3VhbEVuZCA9IGVxdWlwQ2hlY2suaW52VG9WaXN1YWxFbmQgKyBpbnZDb3VudDtcclxuXHRcdFx0fVxyXG5cdFx0XHRicmVhaztcdFxyXG5cdFx0Y2FzZSBcIkludk1pZFwiOlxyXG5cdFx0XHRlcXVpcENoZWNrLnNjcm9sbE1pZCA9dHJ1ZTtcclxuXHRcdFx0ZXF1aXBDaGVjay5pbnZUb1Zpc3VhbEJlZ2luID0gMDtcclxuXHRcdFx0ZXF1aXBDaGVjay5pbnZUb1Zpc3VhbEVuZCA9IGludkNvdW50O1xyXG5cdFx0XHRicmVhaztcdFxyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdH1cclxuXHRcdGJyZWFrO1xyXG5cdGRlZmF1bHQgOlxyXG5cdFx0Y2xlYXJTZWxlY3RlZFNvY2tzQW5kSW52KCk7XHJcblx0XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjbGVhclNlbGVjdGVkU29ja3NBbmRJbnYoKXtcclxuXHRcdFx0XHR2YXIgaW52Q291bnQgPSBPYmplY3Qua2V5cyhpbnZMaW5rKS5sZW5ndGg7XHRcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpPGludkNvdW50O2krKyl7XHJcblx0XHRcdGludkxpbmtbaV0uc2VsZWN0ZWQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdHZhciBzb2NrQ291bnQgPSBPYmplY3Qua2V5cyhzb2NrTGluaykubGVuZ3RoO1xyXG5cdFx0Zm9yICh2YXIgYiA9IDA7IGI8c29ja0NvdW50O2IrKyl7XHJcblx0XHRcdHNvY2tMaW5rW2JdLnNlbGVjdGVkID0gZmFsc2U7XHRcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHJcblxyXG59XHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNoZWNrUFBDVVJTcGFjZUNhbmNlbChwbGF5ZXIsIGludkxpbmssIHNvY2tMaW5rLCBtZXNzYWdlKXtcclxuXHJcblx0dmFyIGludkNvdW50ID0gT2JqZWN0LmtleXMoaW52TGluaykubGVuZ3RoO1x0XHJcblx0dmFyIHNvY2tDb3VudCA9IE9iamVjdC5rZXlzKHNvY2tMaW5rKS5sZW5ndGg7XHJcblxyXG5cdHZhciBQUENVUmFsbFNvY2tzID0gcGxheWVyLlBQQ1VSO1xyXG5cclxuXHRmb3IodmFyIGk9MDsgaTxpbnZDb3VudDsgaSsrKXtcclxuXHRcdGlmIChpbnZMaW5rW2ldLnNlbGVjdGVkID09IHRydWUpe1xyXG5cdFx0XHRmb3IodmFyIGI9MDsgYjxzb2NrQ291bnQ7YisrKXtcclxuXHRcdFx0XHRpZiAoc29ja0xpbmtbYl0uc2VsZWN0ZWQgPT0gdHJ1ZSl7XHJcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHNvY2tMaW5rW2JdLml0ZW0pO1xyXG5cdFx0XHRcdFx0aWYoT2JqZWN0LmtleXMoc29ja0xpbmtbYl0uaXRlbSkubGVuZ3RoID09IDApe1xyXG5cdFx0XHRcdFx0XHRpZihpbnZMaW5rW2ldLml0ZW0uUFBQTCA9PSAwIHx8aW52TGlua1tpXS5pdGVtLlBQUEwgPT0gdW5kZWZpbmVkfHxpbnZMaW5rW2ldLml0ZW0uUFBQTCA9PSBudWxsKXt9ZWxzZXtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIihcIitQUENVUmFsbFNvY2tzK1wiICsgXCIraW52TGlua1tpXS5pdGVtLlBQUEwrXCIpID49IFwiK3BsYXllci5QUE1BWCk7XHJcblx0XHRcdFx0XHRcdFx0aWYoKFBQQ1VSYWxsU29ja3MgKyBpbnZMaW5rW2ldLml0ZW0uUFBQTCkgPj0gcGxheWVyLlBQTUFYKXtcclxuXHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiY2FuY2VsZWRcIilcdDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0c29ja0xpbmtbYl0uc2VsZWN0ZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZS5wdXNoKFwiQ291bGQgbm90IGxvYWQgXCIgKyBpbnZMaW5rW2ldLml0ZW0ubmFtZSArIFwiIGluIHNvY2tldCBcIiArIChiKzEpICsgXCIgZHVlIHRvIGluc3VmZmljaWVudCBQcm9jZXNzaW5nIFBvd2VyLlwiKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRQUENVUmFsbFNvY2tzID0gUFBDVVJhbGxTb2NrcyArIGludkxpbmtbaV0uaXRlbS5QUFBMO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVx0XHRcclxuXHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHJcblx0XHRcdFx0XHRcdGlmKHNvY2tMaW5rW2JdLml0ZW0uUFBQTCA9PSAwIHx8c29ja0xpbmtbYl0uaXRlbS5QUFBMID09IHVuZGVmaW5lZHx8c29ja0xpbmtbYl0uaXRlbS5QUFBMID09IG51bGwpe1xyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRpZihpbnZMaW5rW2ldLml0ZW0uUFBQTCA9PSAwIHx8aW52TGlua1tpXS5pdGVtLlBQUEwgPT0gdW5kZWZpbmVkfHxpbnZMaW5rW2ldLml0ZW0uUFBQTCA9PSBudWxsKXtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKChQUENVUmFsbFNvY2tzIC0gc29ja0xpbmtbYl0uaXRlbS5QUFBMKSA+PSBwbGF5ZXIuUFBNQVgpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRzb2NrTGlua1tiXS5zZWxlY3RlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlLnB1c2goXCJDb3VsZCBub3QgdW5sb2FkIHNvY2tldCBcIiArIChiKzEpICsgXCI7IHVubG9hZGluZyB0aGlzIGl0ZW0gd291bGQgb3ZlcmxvYWQgeW91ciBQcm9jZXNzb3IuXCIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFBQQ1VSYWxsU29ja3MgLSBzb2NrTGlua1tiXS5pdGVtLlBQUEw7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0fVx0XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRpZigoUFBDVVJhbGxTb2NrcyArIGludkxpbmtbaV0uaXRlbS5QUFBMIC0gc29ja0xpbmtbYl0uaXRlbS5QUFBMKSA+PSBwbGF5ZXIuUFBNQVgpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRzb2NrTGlua1tiXS5zZWxlY3RlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlLnB1c2goXCJDb3VsZCBub3Qgc3dhcCBcIiArc29ja0xpbmtbYl0uaXRlbS5uYW1lKyBcIiBmb3IgXCIgK2ludkxpbmtbaV0uaXRlbS5uYW1lICsgXCIgaW4gc29ja2V0IFwiICsgKGIrMSkgKyBcIiBhcyBpdCB3b3VsZCBvdmVybG9hZCB5b3VyIFByb2Nlc3NvclwiKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRQUENVUmFsbFNvY2tzID0gUFBDVVJhbGxTb2NrcyArIGludkxpbmtbaV0uaXRlbS5QUFBMIC0gc29ja0xpbmtbYl0uaXRlbS5QUFBMO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdH1cdFxyXG5cdC8vY29uc29sZS5sb2cobWVzc2FnZSk7XHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2hlY2tQUENVUlNwYWNlQ2FuY2VsKHBsYXllciwgaW52TGluaywgc29ja0xpbmssIG1lc3NhZ2Upe1xyXG5cclxuXHR2YXIgaW52Q291bnQgPSBPYmplY3Qua2V5cyhpbnZMaW5rKS5sZW5ndGg7XHRcclxuXHR2YXIgc29ja0NvdW50ID0gT2JqZWN0LmtleXMoc29ja0xpbmspLmxlbmd0aDtcclxuXHJcblx0dmFyIFBQQ1VSYWxsU29ja3MgPSBwbGF5ZXIuUFBDVVI7XHJcblxyXG5cdGZvcih2YXIgaT0wOyBpPGludkNvdW50OyBpKyspe1xyXG5cdFx0aWYgKGludkxpbmtbaV0uc2VsZWN0ZWQgPT0gdHJ1ZSl7XHJcblx0XHRcdGZvcih2YXIgYj0wOyBiPHNvY2tDb3VudDtiKyspe1xyXG5cdFx0XHRcdGlmIChzb2NrTGlua1tiXS5zZWxlY3RlZCA9PSB0cnVlKXtcclxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coc29ja0xpbmtbYl0uaXRlbSk7XHJcblx0XHRcdFx0XHRpZihPYmplY3Qua2V5cyhzb2NrTGlua1tiXS5pdGVtKS5sZW5ndGggPT0gMCl7XHJcblx0XHRcdFx0XHRcdGlmKGludkxpbmtbaV0uUFBQTCA9PSAwIHx8aW52TGlua1tpXS5QUFBMID09IHVuZGVmaW5lZHx8aW52TGlua1tpXS5QUFBMID09IG51bGwpe31lbHNle1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiKFwiK1BQQ1VSYWxsU29ja3MrXCIgKyBcIitpbnZMaW5rW2ldLlBQUEwrXCIpID49IFwiK3BsYXllci5QUE1BWCk7XHJcblx0XHRcdFx0XHRcdFx0aWYoKFBQQ1VSYWxsU29ja3MgKyBpbnZMaW5rW2ldLlBQUEwpID49IHBsYXllci5QUE1BWCl7XHJcblx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImNhbmNlbGVkXCIpXHQ7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHNvY2tMaW5rW2JdLnNlbGVjdGVkID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2UucHVzaChcIkNvdWxkIG5vdCBsb2FkIFwiICsgaW52TGlua1tpXS5uYW1lICsgXCIgaW4gc29ja2V0IFwiICsgKGIrMSkgKyBcIiBkdWUgdG8gaW5zdWZmaWNpZW50IFByb2Nlc3NpbmcgUG93ZXIuXCIpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdFBQQ1VSYWxsU29ja3MgPSBQUENVUmFsbFNvY2tzICsgaW52TGlua1tpXS5QUFBMO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVx0XHRcclxuXHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHJcblx0XHRcdFx0XHRcdGlmKHNvY2tMaW5rW2JdLml0ZW0uUFBQTCA9PSAwIHx8c29ja0xpbmtbYl0uaXRlbS5QUFBMID09IHVuZGVmaW5lZHx8c29ja0xpbmtbYl0uaXRlbS5QUFBMID09IG51bGwpe1xyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRpZihpbnZMaW5rW2ldLlBQUEwgPT0gMCB8fGludkxpbmtbaV0uUFBQTCA9PSB1bmRlZmluZWR8fGludkxpbmtbaV0uUFBQTCA9PSBudWxsKXtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKChQUENVUmFsbFNvY2tzIC0gc29ja0xpbmtbYl0uaXRlbS5QUFBMKSA+PSBwbGF5ZXIuUFBNQVgpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRzb2NrTGlua1tiXS5zZWxlY3RlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlLnB1c2goXCJDb3VsZCBub3QgdW5sb2FkIHNvY2tldCBcIiArIChiKzEpICsgXCI7IHVubG9hZGluZyB0aGlzIGl0ZW0gd291bGQgb3ZlcmxvYWQgeW91ciBQcm9jZXNzb3IuXCIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFBQQ1VSYWxsU29ja3MgLSBzb2NrTGlua1tiXS5pdGVtLlBQUEw7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0fVx0XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRpZigoUFBDVVJhbGxTb2NrcyArIGludkxpbmtbaV0uUFBQTCAtIHNvY2tMaW5rW2JdLml0ZW0uUFBQTCkgPj0gcGxheWVyLlBQTUFYKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0c29ja0xpbmtbYl0uc2VsZWN0ZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZS5wdXNoKFwiQ291bGQgbm90IHN3YXAgXCIgK3NvY2tMaW5rW2JdLml0ZW0ubmFtZSsgXCIgZm9yIFwiICtpbnZMaW5rW2ldLm5hbWUgKyBcIiBpbiBzb2NrZXQgXCIgKyAoYisxKSArIFwiIGFzIGl0IHdvdWxkIG92ZXJsb2FkIHlvdXIgUHJvY2Vzc29yXCIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFBQQ1VSYWxsU29ja3MgPSBQUENVUmFsbFNvY2tzICsgaW52TGlua1tpXS5QUFBMIC0gc29ja0xpbmtbYl0uaXRlbS5QUFBMO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdH1cdFxyXG5cdC8vY29uc29sZS5sb2cobWVzc2FnZSk7XHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXF1aXBJdGVtVG9Tb2NrcyhwbGF5ZXIsIHByb2dyZXNzLCBpbnZMaW5rLCBzb2NrTGluayl7XHJcbi8vc2V0IHNvY2tzU2xvdHNDb250ZW50cy5qc29uLml0ZW0gdG8gaW52ZW50b3J5U2xvdENvbnRlbnRzLmpzb24uaXRlbVxyXG5cdHZhciBpbnZDb3VudCA9IE9iamVjdC5rZXlzKGludkxpbmspLmxlbmd0aDtcdFxyXG5cdHZhciBzb2NrQ291bnQgPSBPYmplY3Qua2V5cyhzb2NrTGluaykubGVuZ3RoO1xyXG5cdHZhciB0ZW1wZXJhdHVyZUJhbGFuY2VQb2ludCA9IDM3MDsgXHJcblx0dmFyIGRpZmZlcmVuY2VNYXhhbmRNaW5UZW1wO1xyXG5cclxuXHRmb3IodmFyIGk9MDsgaTxpbnZDb3VudDsgaSsrKXtcclxuXHRcdGlmIChpbnZMaW5rW2ldLnNlbGVjdGVkID09IHRydWUpe1xyXG5cdFx0XHRmb3IodmFyIGI9MDsgYjxzb2NrQ291bnQ7YisrKXtcclxuXHRcdFx0XHRpZiAoc29ja0xpbmtbYl0uc2VsZWN0ZWQgPT0gdHJ1ZSl7XHJcblx0XHRcdFx0XHRzb2NrTGlua1tiXS5pdGVtID0gaW52TGlua1tpXS5pdGVtO1xyXG5cdFx0XHRcdFx0c29ja0xpbmtbYl0uZGlzYWJsZSA9IGZhbHNlOyBcclxuXHRcdFx0XHRcdHNvY2tMaW5rW2JdLnR5cGUgPSBcIkNEXCI7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhzb2NrTGlua1tiXSk7XHJcblxyXG5cdFx0XHRcdFx0aWYoc29ja0xpbmtbYl0uaXRlbS5DRFBMID09IDAgfHxzb2NrTGlua1tiXS5pdGVtLkNEUEwgPT0gdW5kZWZpbmVkfHxzb2NrTGlua1tiXS5pdGVtLkNEUEwgPT0gbnVsbCl7XHJcblx0XHRcdFx0XHRzb2NrTGlua1tiXS5DREVuZCA9IDA7IFxyXG5cclxuXHRcdFx0XHRcdC8vU1RJTEwgTkVFRFMgQU4gVU5FUVVJUCBGVU5DVElPTiBTT01FV0hFUkUgQUxTT1xyXG5cdFx0XHRcdFx0Ly9TUEVYUCBBUEVYUCBFUEVYUCBQUEVYUCAtIHRvIGFkZCBzdGlsbCB0aGVzZSBwb2ludHMgcmVkdWNlIG9yIGluY3JlYXNlIHRoZSBtYXggY2FwYWNpdHkgb2YgYSBzdGF0IGJ5IFxyXG5cdFx0XHRcdFx0c29ja0xpbmtbYl0udHlwZSA9IFwiQU9cIjtcclxuXHRcdFx0XHRcdGlmKHNvY2tMaW5rW2JdLml0ZW0uU1BFWFAgPT0gdW5kZWZpbmVkIHx8IHNvY2tMaW5rW2JdLml0ZW0uU1BFWFAgPT0gMCB8fCBzb2NrTGlua1tiXS5kaXNhYmxlID09IHRydWUpe31lbHNle1x0XHJcblx0XHRcdFx0XHRcdHBsYXllci5TUE1BWCA9IE1hdGguZmxvb3IoKHBsYXllci5TUE1BWC8xMDApICogKHNvY2tMaW5rW2JdLml0ZW0uU1BFWFAgKyAxMDApKTtcclxuXHRcdFx0XHRcdFx0cGxheWVyLlNQQ1VSID0gTWF0aC5mbG9vcigocGxheWVyLlNQQ1VSLzEwMCkgKiAoc29ja0xpbmtbYl0uaXRlbS5TUEVYUCArIDEwMCkpO1xyXG5cdFx0XHRcdFx0fVx0Ly90aGlzIHNoaXQgc3RpbGwgZ290dGEgYmUgcmVtb3ZlZCB3aGVuIHVuZXF1aXBlZC4gXHJcblx0XHRcdFx0XHRpZihzb2NrTGlua1tiXS5pdGVtLkFQRVhQID09IHVuZGVmaW5lZCB8fCBzb2NrTGlua1tiXS5pdGVtLkFQRVhQID09IDAgfHwgc29ja0xpbmtbYl0uZGlzYWJsZSA9PSB0cnVlKXt9ZWxzZXtcdFxyXG5cdFx0XHRcdFx0XHRwbGF5ZXIuQVBNQVggPSBNYXRoLmZsb29yKChwbGF5ZXIuQVBNQVgvMTAwKSAqIChzb2NrTGlua1tiXS5pdGVtLkFQRVhQICsgMTAwKSk7XHJcblx0XHRcdFx0XHRcdHBsYXllci5BUENVUiA9IE1hdGguZmxvb3IoKHBsYXllci5BUENVUi8xMDApICogKHNvY2tMaW5rW2JdLml0ZW0uQVBFWFAgKyAxMDApKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKHNvY2tMaW5rW2JdLml0ZW0uRVBFWFAgPT0gdW5kZWZpbmVkIHx8IHNvY2tMaW5rW2JdLml0ZW0uRVBFWFAgPT0gMCB8fCBzb2NrTGlua1tiXS5kaXNhYmxlID09IHRydWUpe31lbHNle1x0XHJcblx0XHRcdFx0XHRcdHBsYXllci5FUE1BWCA9IE1hdGguZmxvb3IoKHBsYXllci5FUE1BWC8xMDApICogKHNvY2tMaW5rW2JdLml0ZW0uRVBFWFAgKyAxMDApKTtcclxuXHRcdFx0XHRcdFx0cGxheWVyLkVQQ1VSID0gTWF0aC5mbG9vcigocGxheWVyLkVQQ1VSLzEwMCkgKiAoc29ja0xpbmtbYl0uaXRlbS5FUEVYUCArIDEwMCkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoc29ja0xpbmtbYl0uaXRlbS5QUEVYUCA9PSB1bmRlZmluZWQgfHwgc29ja0xpbmtbYl0uaXRlbS5QUEVYUCA9PSAwIHx8IHNvY2tMaW5rW2JdLmRpc2FibGUgPT0gdHJ1ZSl7fWVsc2V7XHRcclxuXHRcdFx0XHRcdFx0cGxheWVyLlBQTUFYID0gTWF0aC5mbG9vcigocGxheWVyLlBQTUFYLzEwMCkgKiAoc29ja0xpbmtbYl0uaXRlbS5QUEVYUCArIDEwMCkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoc29ja0xpbmtbYl0uaXRlbS5UUEVYUCA9PSB1bmRlZmluZWQgfHwgc29ja0xpbmtbYl0uaXRlbS5UUEVYUCA9PSAwIHx8IHNvY2tMaW5rW2JdLmRpc2FibGUgPT0gdHJ1ZSl7fWVsc2V7XHRcclxuXHRcdFx0XHRcdFx0ZGlmZmVyZW5jZU1heGFuZE1pblRlbXAgPSBwbGF5ZXIuVFBNQVggLSBwbGF5ZXIuVFBNSU47XHJcblx0XHRcdFx0XHRcdHBsYXllci5UUE1BWCA9IE1hdGguZmxvb3IoKHBsYXllci5UUE1BWC8xMDApICogKHNvY2tMaW5rW2JdLml0ZW0uVFBFWFAgKyAxMDApKTtcclxuXHRcdFx0XHRcdFx0cGxheWVyLlRQTUlOID0gcGxheWVyLlRQTUFYIC0gZGlmZmVyZW5jZU1heGFuZE1pblRlbXA7XHJcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2cocGxheWVyLlRQTUlOLCBwbGF5ZXIuVFBNQVgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblxyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdC8vVEhFIENPT0xET1dOIE9GIFRIRSBFUVVJUEVEIElURU0gSVMgQkFTRUQgT04gQ1VSUkVOVCBJTlRFUk5BTCBURU1QRVJBVFVSRTsgXHJcblx0XHRcdFx0XHRcdHNvY2tMaW5rW2JdLkNEVGVtcCA9IChzb2NrTGlua1tiXS5pdGVtLkNEUEwgKyAoc29ja0xpbmtbYl0uaXRlbS5DRFBMICogKCgoKHRlbXBlcmF0dXJlQmFsYW5jZVBvaW50IC0gcGxheWVyLlRQQ1VSKSAqIC0xKS8yKS8xMDAwKSkpO1xyXG5cdFx0XHRcdFx0XHQvL3NvY2tMaW5rW2JdLkNEVGVtcCBkZWZpbmVzIGlmIHRoZSBhY3R1YWwgY29vbGRvd24gd2lsbCB0YWtlIGxvbmdlciBvciBzaG9ydGVyIGJlZm9yZSBpdCBpcyBhcHBsaWVkLlxyXG5cdFx0XHRcdFx0XHRzb2NrTGlua1tiXS5DREVuZCA9IHNvY2tMaW5rW2JdLkNEVGVtcCArIHByb2dyZXNzOyBcclxuXHRcdFx0XHRcdFx0XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdH1cdFxyXG5cclxuXHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXF1aXBJdGVtVG9Tb2NrcyhwbGF5ZXIsIHByb2dyZXNzLCBpbnZMaW5rLCBzb2NrTGluayl7XHJcbi8vc2V0IHNvY2tzU2xvdHNDb250ZW50cy5qc29uLml0ZW0gdG8gaW52ZW50b3J5U2xvdENvbnRlbnRzLmpzb24uaXRlbVxyXG5cdHZhciBpbnZDb3VudCA9IE9iamVjdC5rZXlzKGludkxpbmspLmxlbmd0aDtcdFxyXG5cdHZhciBzb2NrQ291bnQgPSBPYmplY3Qua2V5cyhzb2NrTGluaykubGVuZ3RoO1xyXG5cdHZhciB0ZW1wZXJhdHVyZUJhbGFuY2VQb2ludCA9IDM3MDsgXHJcblx0dmFyIGRpZmZlcmVuY2VNYXhhbmRNaW5UZW1wO1xyXG5cclxuXHRmb3IodmFyIGk9MDsgaTxpbnZDb3VudDsgaSsrKXtcclxuXHRcdGlmIChpbnZMaW5rW2ldLnNlbGVjdGVkID09IHRydWUpe1xyXG5cdFx0XHRmb3IodmFyIGI9MDsgYjxzb2NrQ291bnQ7YisrKXtcclxuXHRcdFx0XHRpZiAoc29ja0xpbmtbYl0uc2VsZWN0ZWQgPT0gdHJ1ZSl7XHJcblx0XHRcdFx0XHRzb2NrTGlua1tiXS5pdGVtID0gaW52TGlua1tpXTtcclxuXHRcdFx0XHRcdHNvY2tMaW5rW2JdLmRpc2FibGUgPSBmYWxzZTsgXHJcblx0XHRcdFx0XHRzb2NrTGlua1tiXS50eXBlID0gXCJDRFwiO1xyXG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhzb2NrTGlua1tiXSk7XHJcblxyXG5cdFx0XHRcdFx0aWYoc29ja0xpbmtbYl0uaXRlbS5DRFBMID09IDAgfHxzb2NrTGlua1tiXS5pdGVtLkNEUEwgPT0gdW5kZWZpbmVkfHxzb2NrTGlua1tiXS5pdGVtLkNEUEwgPT0gbnVsbCl7XHJcblx0XHRcdFx0XHRzb2NrTGlua1tiXS5DREVuZCA9IDA7IFxyXG5cclxuXHRcdFx0XHRcdC8vU1RJTEwgTkVFRFMgQU4gVU5FUVVJUCBGVU5DVElPTiBTT01FV0hFUkUgQUxTT1xyXG5cdFx0XHRcdFx0Ly9TUEVYUCBBUEVYUCBFUEVYUCBQUEVYUCAtIHRvIGFkZCBzdGlsbCB0aGVzZSBwb2ludHMgcmVkdWNlIG9yIGluY3JlYXNlIHRoZSBtYXggY2FwYWNpdHkgb2YgYSBzdGF0IGJ5IFxyXG5cdFx0XHRcdFx0c29ja0xpbmtbYl0udHlwZSA9IFwiQU9cIjtcclxuXHRcdFx0XHRcdGlmKHNvY2tMaW5rW2JdLml0ZW0uU1BFWFAgPT0gdW5kZWZpbmVkIHx8IHNvY2tMaW5rW2JdLml0ZW0uU1BFWFAgPT0gMCB8fCBzb2NrTGlua1tiXS5kaXNhYmxlID09IHRydWUpe31lbHNle1x0XHJcblx0XHRcdFx0XHRcdHBsYXllci5TUE1BWCA9IE1hdGguZmxvb3IoKHBsYXllci5TUE1BWC8xMDApICogKHNvY2tMaW5rW2JdLml0ZW0uU1BFWFAgKyAxMDApKTtcclxuXHRcdFx0XHRcdFx0cGxheWVyLlNQQ1VSID0gTWF0aC5mbG9vcigocGxheWVyLlNQQ1VSLzEwMCkgKiAoc29ja0xpbmtbYl0uaXRlbS5TUEVYUCArIDEwMCkpO1xyXG5cdFx0XHRcdFx0fVx0Ly90aGlzIHNoaXQgc3RpbGwgZ290dGEgYmUgcmVtb3ZlZCB3aGVuIHVuZXF1aXBlZC4gXHJcblx0XHRcdFx0XHRpZihzb2NrTGlua1tiXS5pdGVtLkFQRVhQID09IHVuZGVmaW5lZCB8fCBzb2NrTGlua1tiXS5pdGVtLkFQRVhQID09IDAgfHwgc29ja0xpbmtbYl0uZGlzYWJsZSA9PSB0cnVlKXt9ZWxzZXtcdFxyXG5cdFx0XHRcdFx0XHRwbGF5ZXIuQVBNQVggPSBNYXRoLmZsb29yKChwbGF5ZXIuQVBNQVgvMTAwKSAqIChzb2NrTGlua1tiXS5pdGVtLkFQRVhQICsgMTAwKSk7XHJcblx0XHRcdFx0XHRcdHBsYXllci5BUENVUiA9IE1hdGguZmxvb3IoKHBsYXllci5BUENVUi8xMDApICogKHNvY2tMaW5rW2JdLml0ZW0uQVBFWFAgKyAxMDApKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKHNvY2tMaW5rW2JdLml0ZW0uRVBFWFAgPT0gdW5kZWZpbmVkIHx8IHNvY2tMaW5rW2JdLml0ZW0uRVBFWFAgPT0gMCB8fCBzb2NrTGlua1tiXS5kaXNhYmxlID09IHRydWUpe31lbHNle1x0XHJcblx0XHRcdFx0XHRcdHBsYXllci5FUE1BWCA9IE1hdGguZmxvb3IoKHBsYXllci5FUE1BWC8xMDApICogKHNvY2tMaW5rW2JdLml0ZW0uRVBFWFAgKyAxMDApKTtcclxuXHRcdFx0XHRcdFx0cGxheWVyLkVQQ1VSID0gTWF0aC5mbG9vcigocGxheWVyLkVQQ1VSLzEwMCkgKiAoc29ja0xpbmtbYl0uaXRlbS5FUEVYUCArIDEwMCkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoc29ja0xpbmtbYl0uaXRlbS5QUEVYUCA9PSB1bmRlZmluZWQgfHwgc29ja0xpbmtbYl0uaXRlbS5QUEVYUCA9PSAwIHx8IHNvY2tMaW5rW2JdLmRpc2FibGUgPT0gdHJ1ZSl7fWVsc2V7XHRcclxuXHRcdFx0XHRcdFx0cGxheWVyLlBQTUFYID0gTWF0aC5mbG9vcigocGxheWVyLlBQTUFYLzEwMCkgKiAoc29ja0xpbmtbYl0uaXRlbS5QUEVYUCArIDEwMCkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoc29ja0xpbmtbYl0uaXRlbS5UUEVYUCA9PSB1bmRlZmluZWQgfHwgc29ja0xpbmtbYl0uaXRlbS5UUEVYUCA9PSAwIHx8IHNvY2tMaW5rW2JdLmRpc2FibGUgPT0gdHJ1ZSl7fWVsc2V7XHRcclxuXHRcdFx0XHRcdFx0ZGlmZmVyZW5jZU1heGFuZE1pblRlbXAgPSBwbGF5ZXIuVFBNQVggLSBwbGF5ZXIuVFBNSU47XHJcblx0XHRcdFx0XHRcdHBsYXllci5UUE1BWCA9IE1hdGguZmxvb3IoKHBsYXllci5UUE1BWC8xMDApICogKHNvY2tMaW5rW2JdLml0ZW0uVFBFWFAgKyAxMDApKTtcclxuXHRcdFx0XHRcdFx0cGxheWVyLlRQTUlOID0gcGxheWVyLlRQTUFYIC0gZGlmZmVyZW5jZU1heGFuZE1pblRlbXA7XHJcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2cocGxheWVyLlRQTUlOLCBwbGF5ZXIuVFBNQVgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblxyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdC8vVEhFIENPT0xET1dOIE9GIFRIRSBFUVVJUEVEIElURU0gSVMgQkFTRUQgT04gQ1VSUkVOVCBJTlRFUk5BTCBURU1QRVJBVFVSRTsgXHJcblx0XHRcdFx0XHRcdHNvY2tMaW5rW2JdLkNEVGVtcCA9IChzb2NrTGlua1tiXS5pdGVtLkNEUEwgKyAoc29ja0xpbmtbYl0uaXRlbS5DRFBMICogKCgoKHRlbXBlcmF0dXJlQmFsYW5jZVBvaW50IC0gcGxheWVyLlRQQ1VSKSAqIC0xKS8yKS8xMDAwKSkpO1xyXG5cdFx0XHRcdFx0XHQvL3NvY2tMaW5rW2JdLkNEVGVtcCBkZWZpbmVzIGlmIHRoZSBhY3R1YWwgY29vbGRvd24gd2lsbCB0YWtlIGxvbmdlciBvciBzaG9ydGVyIGJlZm9yZSBpdCBpcyBhcHBsaWVkLlxyXG5cdFx0XHRcdFx0XHRzb2NrTGlua1tiXS5DREVuZCA9IHNvY2tMaW5rW2JdLkNEVGVtcCArIHByb2dyZXNzOyBcclxuXHRcdFx0XHRcdFx0XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdH1cdFxyXG5cclxuXHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbG9hZEludmVudG9yeVN0YXRzKGVxdWlwQ2hlY2ssIGludkxpbmssIHBsYXllckludmVudG9yeSl7XHJcbi8vc2V0IGludmVudG9yeVNsb3RDb250ZW50cy5qc29uLml0ZW0gdG8gcGxheWVySW52ZW50b3J5Lmpzb24uaXRlbVxyXG5cdHZhciBpbnZDb3VudCA9IE9iamVjdC5rZXlzKGludkxpbmspLmxlbmd0aDtcdFxyXG5cdGVxdWlwQ2hlY2suaW52ZW50b3J5Q291bnQgPSBPYmplY3Qua2V5cyhwbGF5ZXJJbnZlbnRvcnkpLmxlbmd0aDtcclxuXHRmb3IgKHZhciBpID0gMDsgaTxpbnZDb3VudDtpKyspe1xyXG5cdFx0aWYgKHBsYXllckludmVudG9yeVtpK2VxdWlwQ2hlY2suaW52VG9WaXN1YWxCZWdpbl0gPT0gdW5kZWZpbmVkKXtcclxuXHRcdFx0aW52TGlua1tpXS5pdGVtID0ge307XHJcblx0XHR9ZWxzZXtcclxuXHRcdGludkxpbmtbaV0uaXRlbSA9IHBsYXllckludmVudG9yeVtpK2VxdWlwQ2hlY2suaW52VG9WaXN1YWxCZWdpbl07XHJcblx0XHR9XHJcblx0fVxyXG5cclxufSAiLCIndXNlIHN0cmljdCdcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtb2RpZnlTdGF0c1BlclNvY2tldChwcm9ncmVzcywgcGxheWVyRXF1aXBlZCwgZW5lbXlFcXVpcGVkLCBwbGF5ZXIsIGVuZW15LCBtZXNzYWdlKXtcclxuXHJcblx0dmFyIFBMU2xvdENvdW50PSBPYmplY3Qua2V5cyhwbGF5ZXJFcXVpcGVkKS5sZW5ndGg7XHRcclxuXHR2YXIgRU5TbG90Q291bnQ9IE9iamVjdC5rZXlzKGVuZW15RXF1aXBlZCkubGVuZ3RoO1x0XHJcblxyXG5cdHBsYXllci5QUENVUiA9IDA7XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IFBMU2xvdENvdW50OyBpKyspe1xyXG5cdFx0aWYocGxheWVyRXF1aXBlZFtpXS5pdGVtLlBQUEwgPT0gdW5kZWZpbmVkKXt9ZWxzZXtcclxuXHRcdFx0cGxheWVyLlBQQ1VSID0gcGxheWVyLlBQQ1VSICsgcGxheWVyRXF1aXBlZFtpXS5pdGVtLlBQUEw7XHJcblx0XHRcdFxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRpZihwbGF5ZXJFcXVpcGVkW2ldLmFwcGx5U3RhdHMgPT0gdHJ1ZSl7XHJcblx0XHRcdC8vY29uc29sZS5sb2cocGxheWVyLCBwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uQVBQTClcclxuXHJcblx0XHRcdGlmKHBsYXllckVxdWlwZWRbaV0uaXRlbS5FUFBMID09IHVuZGVmaW5lZCB8fCBwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uRVBQTCA9PSAwKXt9ZWxzZXtcclxuXHRcdFx0XHRpZigocGxheWVyLkVQQ1VSICsgcGxheWVyRXF1aXBlZFtpXS5pdGVtLkVQUEwpIDwgcGxheWVyLkVQTUlOKXtcclxuXHRcdFx0XHRcdHBsYXllckVxdWlwZWRbaV0uZGlzYWJsZSA9IHRydWU7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwbGF5ZXJFcXVpcGVkW2ldLnByZWZpeElEICsgXCJTdGF0dXNcIikuc3R5bGUub3BhY2l0eT1cIjAuN1wiO1xyXG5cdFx0XHRcdFx0bWVzc2FnZS5wdXNoKHBsYXllckVxdWlwZWRbaV0uaXRlbS5uYW1lICtcIiBpbiBzb2NrZXQgMFwiICsgKGkgKyAxKSArIFwiIHdhcyBkaXNhYmxlZCBkdWUgdG8gaW5zdWZmaWNpZW50IEJhdHRlcnkgUG93ZXI7IHByZXZpb3VzIGN5Y2xlIHdhcyBpbnRlcnVwdGVkLlwiKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHBsYXllci5FUENVUiA9IHBsYXllci5FUENVUiArIHBsYXllckVxdWlwZWRbaV0uaXRlbS5FUFBMO1xyXG5cdFx0XHRcdFx0aWYocGxheWVyLkVQQ1VSID4gcGxheWVyLkVQTUFYKXtcclxuXHRcdFx0XHRcdFx0cGxheWVyLkVQQ1VSID0gcGxheWVyLkVQTUFYO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGlmKHBsYXllckVxdWlwZWRbaV0uaXRlbS5TUFBMID09IHVuZGVmaW5lZCB8fCBwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uU1BQTCA9PSAwIHx8IHBsYXllckVxdWlwZWRbaV0uZGlzYWJsZSA9PSB0cnVlKXt9ZWxzZXtcclxuXHRcdFx0XHRpZigocGxheWVyLlNQQ1VSICsgcGxheWVyRXF1aXBlZFtpXS5pdGVtLlNQUEwpID4gcGxheWVyLlNQTUFYKXtcclxuXHRcdFx0XHRcdHBsYXllci5TUENVUiA9IHBsYXllci5TUE1BWDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHBsYXllci5TUENVUiA9IHBsYXllci5TUENVUiArIHBsYXllckVxdWlwZWRbaV0uaXRlbS5TUFBMO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVx0XHJcblxyXG5cdFx0XHRpZihwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uQVBQTCA9PSB1bmRlZmluZWQgfHwgcGxheWVyRXF1aXBlZFtpXS5pdGVtLkFQUEwgPT0gMCB8fCBwbGF5ZXJFcXVpcGVkW2ldLmRpc2FibGUgPT0gdHJ1ZSl7fWVsc2V7XHJcblx0XHRcdFx0aWYoKHBsYXllci5BUENVUiArIHBsYXllckVxdWlwZWRbaV0uaXRlbS5BUFBMKSA+IHBsYXllci5BUE1BWCl7XHJcblx0XHRcdFx0XHRwbGF5ZXIuQVBDVVIgPSBwbGF5ZXIuQVBNQVg7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRwbGF5ZXIuQVBDVVIgPSBwbGF5ZXIuQVBDVVIgKyBwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uQVBQTDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBsYXllckVxdWlwZWRbaV0uaXRlbS5UUFBMID09IHVuZGVmaW5lZCB8fCBwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uVFBQTCA9PSAwIHx8IHBsYXllckVxdWlwZWRbaV0uZGlzYWJsZSA9PSB0cnVlKXt9ZWxzZXtcclxuXHRcdFx0XHRwbGF5ZXIuVFBDVVIgPSBwbGF5ZXIuVFBDVVIgKyAocGxheWVyRXF1aXBlZFtpXS5pdGVtLlRQUEwgKiAxMCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYocGxheWVyLlRQQ1VSID4gcGxheWVyLlRQTUFYKXtcclxuXHRcdFx0XHRcdHBsYXllci5UUENVUiA9IHBsYXllci5UUE1BWDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYocGxheWVyLlRQQ1VSIDwgcGxheWVyLlRQTUlOKXtcclxuXHRcdFx0XHRcdHBsYXllci5UUENVUiA9IHBsYXllci5UUE1JTjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL1x0XHRcdFNQRU5cdEFQRU5cdEVQRU5cdFBQRU5cdFRQRU5cdERURU5cclxuXHRcdFx0Ly8gR09UVEEgRklYIFNQRU4gV0lUSCBTSElFTEQgUkVTSVNUQU5DRSBBUyBCQVNFRCBPTiBEQU1BR0U7IFNISUVMRCBXSUxMIEFCU09SQiBEQU1BR0UgREVQRU5ERU5DRSBPTiBUSEUgUkVTSVNUQU5DRSBPRiBUSEUgU0hJRUxEXHJcblxyXG5cclxuXHJcblx0XHRcdGlmKHBsYXllckVxdWlwZWRbaV0uaXRlbS5TUEVOID09IHVuZGVmaW5lZCAgfHwgcGxheWVyRXF1aXBlZFtpXS5pdGVtLkFQRU4gPT0gdW5kZWZpbmVkIHx8IHBsYXllckVxdWlwZWRbaV0uaXRlbS5TUEVOID09IDAgfHwgcGxheWVyRXF1aXBlZFtpXS5kaXNhYmxlID09IHRydWUpe31lbHNle1xyXG5cdFx0XHRcdHZhciBTUFJFU1AsIEFQUkVTUCwgU1BlbmV0LCBTUFJFU3RvdCwgU1BEQU0sIEFQREFNLCBTUERBTXVuVXNlZDtcclxuXHJcblx0XHRcdFx0U1BSRVNQID0gZW5lbXkuU1BSRVMgKiAwLjAxO1xyXG5cdFx0XHRcdEFQUkVTUCA9IDEtKChlbmVteS5BUFJFUyAqIDAuMDEpLzIpO1xyXG5cclxuXHRcdFx0XHRTUGVuZXQgPSAxLShwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uU1BFTiAqIDAuMDEpO1xyXG5cclxuXHRcdFx0XHRTUFJFU3RvdCA9IFNQUkVTUCAqIFNQZW5ldDtcclxuXHJcblx0XHRcdFx0U1BEQU0gPSAgU1BSRVN0b3QgKiBwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uQVBFTjtcclxuXHRcdFx0XHRBUERBTSA9IEFQUkVTUCAqIChwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uQVBFTi1TUERBTSk7XHJcblxyXG5cclxuXHJcblxyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coU1BSRVNQLCBBUFJFU1AsIFNQZW5ldCxcIlNQUkVTdG90XCIsIFNQUkVTdG90LFwiU1BEQU1cIiwgU1BEQU0sXCJBUERBTVwiLCBBUERBTSlcclxuXHRcdFx0XHQvL0FQUkVTIG5vdCBpbXBsZW1lbnRlZCBwcm9wZXJseSB5ZXRcclxuXHRcdFx0XHRpZigoZW5lbXkuU1BDVVIgKyBTUERBTSkgPCBlbmVteS5TUE1JTil7XHJcblx0XHRcdFx0XHRpZihlbmVteS5TUENVUiA9PSBlbmVteS5TUE1JTil7XHJcblx0XHRcdFx0XHRcdEFQREFNID0gQVBSRVNQICogcGxheWVyRXF1aXBlZFtpXS5pdGVtLkFQRU47XHJcblx0XHRcdFx0XHRcdGVuZW15LkFQQ1VSID0gTWF0aC5mbG9vcihlbmVteS5BUENVUiArIEFQREFNKTtcclxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIlNQXCIsMCxcIkFQXCIsTWF0aC5mbG9vcihBUERBTSkpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFNQREFNdW5Vc2VkID0gU1BEQU0gKyBlbmVteS5TUENVUjtcclxuXHRcdFx0XHRcdFx0ZW5lbXkuU1BDVVIgPSBlbmVteS5TUE1JTjtcclxuXHRcdFx0XHRcdFx0ZW5lbXkuQVBDVVIgPSBNYXRoLmZsb29yKGVuZW15LkFQQ1VSICsgKFNQREFNdW5Vc2VkICsgQVBEQU0pKTtcclxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIlNQXCIsIGVuZW15LlNQQ1VSLCBcIkFQXCIsIE1hdGguZmxvb3IoU1BEQU11blVzZWQgKyBBUERBTSkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGlmKChlbmVteS5TUENVUiArIFNQREFNKSA+IGVuZW15LlNQTUFYKXtcclxuXHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0ZW5lbXkuU1BDVVIgPSBNYXRoLmZsb29yKGVuZW15LlNQQ1VSICsgU1BEQU0pO1xyXG5cdFx0XHRcdFx0XHRlbmVteS5BUENVUiA9IE1hdGguZmxvb3IoZW5lbXkuQVBDVVIgKyBBUERBTSk7XHJcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJTUFwiLE1hdGguZmxvb3IoU1BEQU0pLFwiQVBcIixNYXRoLmZsb29yKEFQREFNKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbi8qXHRcdFx0aWYocGxheWVyRXF1aXBlZFtpXS5pdGVtLkFQRU4gPT0gdW5kZWZpbmVkIHx8IHBsYXllckVxdWlwZWRbaV0uaXRlbS5BUEVOID09IDAgfHwgcGxheWVyRXF1aXBlZFtpXS5kaXNhYmxlID09IHRydWUpe31lbHNle1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGVuZW15LkFQQ1VSID0gZW5lbXkuQVBDVVIgKyAocGxheWVyRXF1aXBlZFtpXS5pdGVtLkFQRU4gLSBNYXRoLmZsb29yKCgoZW5lbXkuU1BSRVMvMTAwKSAtIChwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uU1BFTi8xMDApKSAqIHBsYXllckVxdWlwZWRbaV0uaXRlbS5BUEVOKSk7XHJcblx0XHRcdFx0aWYoZW5lbXkuQVBDVVIgPiBlbmVteS5BUE1BWCl7ZW5lbXkuQVBDVVIgPSBlbmVteS5BUE1BWDt9XHJcblx0XHRcdFx0aWYoZW5lbXkuQVBDVVIgPCBlbmVteS5BUE1JTil7ZW5lbXkuQVBDVVIgPSBlbmVteS5BUE1JTjt9XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJTUFwiLCBNYXRoLmZsb29yKCgoZW5lbXkuU1BSRVMvMTAwKSAtIChwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uU1BFTi8xMDApKSAqIHBsYXllckVxdWlwZWRbaV0uaXRlbS5BUEVOKSk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJBUFwiLCAgKHBsYXllckVxdWlwZWRbaV0uaXRlbS5BUEVOIC0gTWF0aC5mbG9vcigoKGVuZW15LlNQUkVTLzEwMCkgLSAocGxheWVyRXF1aXBlZFtpXS5pdGVtLlNQRU4vMTAwKSkgKiBwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uQVBFTikpKTtcclxuXHJcblxyXG5cdFx0XHR9Ki9cclxuXHRcdFx0aWYocGxheWVyRXF1aXBlZFtpXS5pdGVtLkVQRU4gPT0gdW5kZWZpbmVkIHx8IHBsYXllckVxdWlwZWRbaV0uaXRlbS5FUEVOID09IDAgfHwgcGxheWVyRXF1aXBlZFtpXS5kaXNhYmxlID09IHRydWUpe31lbHNle1xyXG5cdFx0XHRcdGVuZW15LkVQQ1VSID0gZW5lbXkuRVBDVVIgKyBwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uRVBFTjtcclxuXHRcdFx0XHRpZihlbmVteS5FUENVUiA+IGVuZW15LkVQTUFYKXtlbmVteS5FUENVUiA9IGVuZW15LkVQTUFYO31cclxuXHRcdFx0XHRpZihlbmVteS5FUENVUiA8IGVuZW15LkVQTUlOKXtlbmVteS5FUENVUiA9IGVuZW15LkVQTUlOO31cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uVFBFTiA9PSB1bmRlZmluZWQgfHwgcGxheWVyRXF1aXBlZFtpXS5pdGVtLlRQRU4gPT0gMCB8fCBwbGF5ZXJFcXVpcGVkW2ldLmRpc2FibGUgPT0gdHJ1ZSl7fWVsc2V7XHJcblx0XHRcdFx0ZW5lbXkuVFBDVVIgPSBlbmVteS5UUENVUiArIHBsYXllckVxdWlwZWRbaV0uaXRlbS5UUEVOO1xyXG5cdFx0XHRcdGlmKGVuZW15LlRQQ1VSID4gZW5lbXkuVFBNQVgpe2VuZW15LlRQQ1VSID0gZW5lbXkuVFBNQVg7fVxyXG5cdFx0XHRcdGlmKGVuZW15LlRQQ1VSIDwgZW5lbXkuVFBNSU4pe2VuZW15LlRQQ1VSID0gZW5lbXkuVFBNSU47fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwbGF5ZXJFcXVpcGVkW2ldLmFwcGx5U3RhdHMgPSBmYWxzZTtcdFxyXG5cdFx0fVx0XHRcclxuXHR9XHJcblx0XHJcblxyXG5cclxuLypcdGZvcih2YXIgaSA9IDA7IGkgPCBFTlNsb3RDb3VudDsgaSsrKXtcclxuXHRcdGlmKGVuZW15RXF1aXBlZFtpXS5hcHBseVN0YXRzID09IHRydWUpe1xyXG5cdFx0XHJcblxyXG5cclxuXHRcdFx0ZW5lbXlFcXVpcGVkW2ldLmFwcGx5U3RhdHMgPSBmYWxzZTtcdFxyXG5cdFx0fVxyXG5cclxuXHR9Ki9cclxuXHJcbn0iLCIndXNlIHN0cmljdCdcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZW1vdmVBT1N0YXRzVW5lcXVpcChwbGF5ZXIsIHNvY2tMaW5rKXtcclxuXHJcblx0dmFyIHNvY2tDb3VudCA9IE9iamVjdC5rZXlzKHNvY2tMaW5rKS5sZW5ndGg7XHJcblx0dmFyIGRpZmZlcmVuY2VNYXhhbmRNaW5UZW1wO1xyXG5cclxuXHRmb3IodmFyIGI9MDsgYjxzb2NrQ291bnQ7YisrKXtcclxuXHRcdGlmIChzb2NrTGlua1tiXS5zZWxlY3RlZCA9PSB0cnVlKXtcclxuXHRcdFx0Ly9jb25zb2xlLmxvZyhzb2NrTGlua1tiXS5pdGVtKTtcclxuXHRcdFx0aWYoT2JqZWN0LmtleXMoc29ja0xpbmtbYl0uaXRlbSkubGVuZ3RoID09IDApe31lbHNle1xyXG5cdFx0XHRcdGlmKHNvY2tMaW5rW2JdLml0ZW0uQ0RvckFPID09IFwiQU9cIil7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInJldmVyc2luZyBBTyBzdGF0IGZvciBzb2NrZXQgYlwiKTtcclxuXHRcdFx0XHRcdGlmKHNvY2tMaW5rW2JdLml0ZW0uU1BFWFAgPT0gdW5kZWZpbmVkIHx8IHNvY2tMaW5rW2JdLml0ZW0uU1BFWFAgPT0gMCB8fCBzb2NrTGlua1tiXS5kaXNhYmxlID09IHRydWUpe31lbHNle1x0XHJcblx0XHRcdFx0XHRcdHBsYXllci5TUE1BWCA9IE1hdGguY2VpbCgocGxheWVyLlNQTUFYLygxMDAgKyBzb2NrTGlua1tiXS5pdGVtLlNQRVhQKSoxMDApKTtcclxuXHRcdFx0XHRcdFx0cGxheWVyLlNQQ1VSID0gTWF0aC5jZWlsKChwbGF5ZXIuU1BDVVIvKDEwMCArIHNvY2tMaW5rW2JdLml0ZW0uU1BFWFApKjEwMCkpO1xyXG5cdFx0XHRcdFx0fVx0Ly90aGlzIHNoaXQgc3RpbGwgZ290dGEgYmUgcmVtb3ZlZCB3aGVuIHVuZXF1aXBlZC4gXHJcblx0XHRcdFx0XHRpZihzb2NrTGlua1tiXS5pdGVtLkFQRVhQID09IHVuZGVmaW5lZCB8fCBzb2NrTGlua1tiXS5pdGVtLkFQRVhQID09IDAgfHwgc29ja0xpbmtbYl0uZGlzYWJsZSA9PSB0cnVlKXt9ZWxzZXtcdFxyXG5cdFx0XHRcdFx0XHRwbGF5ZXIuQVBNQVggPSBNYXRoLmNlaWwoKHBsYXllci5BUE1BWC8oMTAwICsgc29ja0xpbmtbYl0uaXRlbS5BUEVYUCkqMTAwKSk7XHJcblx0XHRcdFx0XHRcdHBsYXllci5BUENVUiA9IE1hdGguY2VpbCgocGxheWVyLkFQQ1VSLygxMDAgKyBzb2NrTGlua1tiXS5pdGVtLkFQRVhQKSoxMDApKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKHNvY2tMaW5rW2JdLml0ZW0uRVBFWFAgPT0gdW5kZWZpbmVkIHx8IHNvY2tMaW5rW2JdLml0ZW0uRVBFWFAgPT0gMCB8fCBzb2NrTGlua1tiXS5kaXNhYmxlID09IHRydWUpe31lbHNle1x0XHJcblx0XHRcdFx0XHRcdHBsYXllci5FUE1BWCA9IE1hdGguY2VpbCgocGxheWVyLkVQTUFYLygxMDAgKyBzb2NrTGlua1tiXS5pdGVtLkVQRVhQKSoxMDApKTtcclxuXHRcdFx0XHRcdFx0cGxheWVyLkVQQ1VSID0gTWF0aC5jZWlsKChwbGF5ZXIuRVBDVVIvKDEwMCArIHNvY2tMaW5rW2JdLml0ZW0uRVBFWFApKjEwMCkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoc29ja0xpbmtbYl0uaXRlbS5QUEVYUCA9PSB1bmRlZmluZWQgfHwgc29ja0xpbmtbYl0uaXRlbS5QUEVYUCA9PSAwIHx8IHNvY2tMaW5rW2JdLmRpc2FibGUgPT0gdHJ1ZSl7fWVsc2V7XHRcclxuXHRcdFx0XHRcdFx0cGxheWVyLlBQTUFYID0gTWF0aC5jZWlsKChwbGF5ZXIuUFBNQVgvKDEwMCArIHNvY2tMaW5rW2JdLml0ZW0uUFBFWFApKjEwMCkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoc29ja0xpbmtbYl0uaXRlbS5UUEVYUCA9PSB1bmRlZmluZWQgfHwgc29ja0xpbmtbYl0uaXRlbS5UUEVYUCA9PSAwIHx8IHNvY2tMaW5rW2JdLmRpc2FibGUgPT0gdHJ1ZSl7fWVsc2V7XHRcclxuXHRcdFx0XHRcdFx0ZGlmZmVyZW5jZU1heGFuZE1pblRlbXAgPSBwbGF5ZXIuVFBNQVggLSBwbGF5ZXIuVFBNSU47XHJcblx0XHRcdFx0XHRcdHBsYXllci5UUE1BWCA9IE1hdGguY2VpbCgocGxheWVyLlRQTUFYLygxMDAgKyBzb2NrTGlua1tiXS5pdGVtLlRQRVhQKSoxMDApKTtcclxuXHRcdFx0XHRcdFx0cGxheWVyLlRQTUlOID0gcGxheWVyLlRQTUFYIC0gZGlmZmVyZW5jZU1heGFuZE1pblRlbXA7XHJcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2cocGxheWVyLlRQTUlOLCBwbGF5ZXIuVFBNQVgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0c29ja0xpbmtbYl0udHlwZSA9IFwiXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2Nyb2xsSW52ZW50b3J5Q2xpY2soZSl7XHJcblx0Ly9jb25zb2xlLmxvZyhlKTtcclxuXHRcdFxyXG5cclxuXHJcblx0XHQgICAgICAgIFxyXG5cdCAgICAgICAgZm9yICh2YXIgaSA9IDE7aTw9IDg7IGkrKyApe1xyXG5cdCAgICAgICAgXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsU2ludjBcIiArIGkgK1wiSWNvblwiKS5zcmMgPSBcImJhY2tCYXJcIjtcclxuXHQgICAgICAgIH1cclxuXHJcbn0iLCIndXNlIHN0cmljdCdcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b2dnbGVTZWxlY3RlZChpZFBhY2ssIGludkxpbmssIHNvY2tMaW5rKXtcclxuXHJcblx0dmFyIHBhcmVudElEID0gaWRQYWNrWzBdO1xyXG5cdHZhciBwYXJlbnRQYXJlbnRJRCA9IGlkUGFja1sxXTtcdFxyXG5cdHZhciB0YXJnZXRJRCA9IGlkUGFja1syXTtcclxuXHJcblxyXG5cdHZhciBJTlZCdXR0b25TZWxlY3RlZDtcclxuXHR2YXIgU0xPVEJ1dHRvblNlbGVjdGVkPVtdO1xyXG5cclxuXHR2YXIgaW5kZXhvZlJlbW92ZWRCdXR0b247XHJcblxyXG5cdHN3aXRjaChwYXJlbnRQYXJlbnRJRC5pZCl7XHJcblx0Y2FzZSBcIklOVkJ1dHRvbnNcIjpcclxuXHRcdHZhciBpbnZDb3VudCA9IE9iamVjdC5rZXlzKGludkxpbmspLmxlbmd0aDtcdFxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGk8aW52Q291bnQ7aSsrKXtcclxuXHRcdFx0aWYoaW52TGlua1tpXS5wcmVmaXhJRCA9PSB0YXJnZXRJRC5pZCl7XHJcblx0XHRcdFx0aW52TGlua1tpXS5zZWxlY3RlZCA9IHRydWU7XHJcblx0XHRcdFx0SU5WQnV0dG9uU2VsZWN0ZWQgPSBbaSxcImludmVudG9yeVNsb3RDb250ZW50XCIsIFwiZXFwdE1vZHVsZXNJRD1cIiwgaW52TGlua1tpXS5lcXB0TW9kdWxlc0lELCBcInBsYXllcmludmVudG9yeUlEPVwiLCAgaW52TGlua1tpXS5wbGF5ZXJpbnZlbnRvcnlJRF07XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGludkxpbmtbaV0uc2VsZWN0ZWQgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFxyXG5cdFx0YnJlYWs7XHJcblx0Y2FzZSBcInBsYXllclNvY2tzXCI6XHJcblxyXG5cdFx0dmFyIGludkNvdW50ID0gT2JqZWN0LmtleXMoc29ja0xpbmspLmxlbmd0aDtcclxuXHRcdGZvciAodmFyIGIgPSAwOyBiPGludkNvdW50O2IrKyl7XHJcblxyXG5cdFx0XHRpZihzb2NrTGlua1tiXS5wcmVmaXhJRCA9PSBwYXJlbnRJRC5pZCl7XHJcblx0XHRcdFx0aWYoc29ja0xpbmtbYl0uc2VsZWN0ZWQgPT0gdHJ1ZSl7XHJcbi8qXHRcdFx0XHRcdGlmKFNMT1RCdXR0b25TZWxlY3RlZD4tMSl7XHJcblx0XHRcdFx0XHRcdGluZGV4b2ZSZW1vdmVkQnV0dG9uID0gU0xPVEJ1dHRvblNlbGVjdGVkLmluZGV4b2YoYik7XHJcblx0XHRcdFx0XHRcdFNMT1RCdXR0b25TZWxlY3RlZC5zcGxpY2UoaW5kZXhvZlJlbW92ZWRCdXR0b24sIDEpO1xyXG5cdFx0XHRcdFx0XHRzb2NrTGlua1tiXS5zZWxlY3RlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInJlbW92ZWRcIiwgYik7XHJcblx0XHRcdFx0XHR9Ki9cclxuXHRcdFx0XHRcdHNvY2tMaW5rW2JdLnNlbGVjdGVkID09IGZhbHNlXHJcblx0XHRcdFx0fWVsc2V7XHJcblxyXG5cdFx0XHRcdFx0c29ja0xpbmtbYl0uc2VsZWN0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0U0xPVEJ1dHRvblNlbGVjdGVkLnB1c2goYik7XHJcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwieWVzXCIpO1xyXG5cdFx0XHRcdH1cdFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRpZihzb2NrTGlua1tiXS5zZWxlY3RlZCA9PSB0cnVlKXtcclxuXHRcdFx0XHRTTE9UQnV0dG9uU2VsZWN0ZWQucHVzaChiKTtcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKFwibm9cIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRicmVhaztcclxuXHRkZWZhdWx0IDpcclxuXHRcclxuXHR9XHJcblx0Ly9jb25zb2xlLmxvZyhTTE9UQnV0dG9uU2VsZWN0ZWQpO1xyXG5cclxuXHJcblxyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4oZnVuY3Rpb24od2luZG93LGRvY3VtZW50LHVuZGVmaW5lZCl7XHJcblxyXG4vL0NMRUFSIFNPQ0tFVFMgRk9SIFBMQVlFUiBBTkQgRU5FTVkgRk9SIEIgRUdJTk5JTkcgT0YgR0FNRVxyXG52YXIgcHJlcFNvY2tzR2FtZSA9IHJlcXVpcmUoJy4vdmlzdWFsL3ByZXBTb2Nrc0dhbWUuanMnKTtcclxudmFyIHJlc2V0U29ja3NGb3JHYW1lID0gbmV3IHByZXBTb2Nrc0dhbWUoKTtcclxuXHJcbi8vTE9BRCBIVURTSVpFQ09ORklHXHJcbnZhciBodWRTaXplRGF0YSA9IHJlcXVpcmUoJy4uL0pTT04vaHVkU2l6ZXNEYXRhLmpzb24nKTtcclxuLy9jb25zb2xlLmxvZyhodWRTaXplRGF0YSk7XHJcbnZhciBhZGp1c3RFbmVteUhVRFNpemUgPSByZXF1aXJlKCcuL3Zpc3VhbC9hZGp1c3RFbmVteUhVRFNpemUuanMnKTtcclxudmFyIGFkanNFbkhVRFNpemU9IG5ldyBhZGp1c3RFbmVteUhVRFNpemUoaHVkU2l6ZURhdGEpO1xyXG52YXIgYWRqdXN0UGxheWVySFVEU2l6ZSA9IHJlcXVpcmUoJy4vdmlzdWFsL2FkanVzdFBsYXllckhVRFNpemUuanMnKTtcclxudmFyIGFkanNQbEhVRFNpemU9IG5ldyBhZGp1c3RQbGF5ZXJIVURTaXplKGh1ZFNpemVEYXRhKTtcclxuLy9MT0FEIFBMQVlFUiBBTkQgRU5FTVkgU1RBVFNcclxudmFyIHBsYXllciA9IHJlcXVpcmUoJy4uL0pTT04vcGxheWVyU3RhdHMuanNvbicpO1xyXG52YXIgZW5lbXkgPSByZXF1aXJlKCcuLi9KU09OL2VuZW15U3RhdHMuanNvbicpO1xyXG4vL2NvbnNvbGUubG9nKHBsYXllci5uYW1lLCBwbGF5ZXIpO1xyXG4vL2NvbnNvbGUubG9nKGVuZW15Lm5hbWUsIGVuZW15KTtcclxuLy9lbmVteS5TUE1BWCA9IDM5ODg7XHJcblxyXG4vL0xPQUQgRVFVSVBNRU5UTU9EVUxFU1RBVFMgQU5EIFNWRyBMSU5LU1xyXG52YXIgZXFwdE1vZHMgPSByZXF1aXJlKCcuLi9KU09OL2VxcHRNb2R1bGVzLmpzb24nKTtcclxuLy9jb25zb2xlLmxvZyhPYmplY3Qua2V5cyhlcXB0TW9kcykubGVuZ3RoICwgXCJFcXVpcG1lbnQgTW9kdWxlcyBsb2FkZWQuXCIpO1xyXG4vL2NvbnNvbGUubG9nKGVxcHRNb2RzWzIxXSk7XHJcbi8vRVFVSVBDSEVDSyBBUlJBWVxyXG52YXIgZXF1aXBDaGVjayA9IHJlcXVpcmUoJy4uL0pTT04vZXF1aXBDaGVjay5qc29uJylcclxudmFyIGVxdWlwQ2hlY2tFbmVteSA9IHJlcXVpcmUoJy4uL0pTT04vZXF1aXBDaGVja0VuZW15Lmpzb24nKVxyXG4vL0xPQUQgUExBWUVSSU5WRU5UT1JZIElURU1RVUFMSVRZIEFORCBVUEdSQURFU1xyXG52YXIgcGxheWVySW52ZW50b3J5ID0gcmVxdWlyZSgnLi4vSlNPTi9wbGF5ZXJJbnZlbnRvcnkuanNvbicpO1xyXG52YXIgaW52U2xvdENvbnRlbnRMaW5rcyA9IHJlcXVpcmUoJy4uL0pTT04vaW52ZW50b3J5U2xvdENvbnRlbnRzLmpzb24nKTtcclxudmFyIGxvYWRQbGF5ZXJJbnZlbnRvcnkgPSByZXF1aXJlKCcuL3Zpc3VhbC9sb2FkUGxheWVySW52ZW50b3J5LmpzJyk7XHJcbnZhciBwbGF5ZXJJbnYgPSBuZXcgbG9hZFBsYXllckludmVudG9yeShwbGF5ZXJJbnZlbnRvcnksaW52U2xvdENvbnRlbnRMaW5rcywgZXF1aXBDaGVjayk7XHJcbi8vTE9BRCBTT0NLSU5WQVJSQVlcclxudmFyIHNvY2tzQ29udGVudExpbmtzID0gcmVxdWlyZSgnLi4vSlNPTi9zb2Nrc1Nsb3RDb250ZW50cy5qc29uJyk7XHJcbnZhciBzb2Nrc0NvbnRlbnRMaW5rc0VuZW15ID0gcmVxdWlyZSgnLi4vSlNPTi9zb2Nrc1Nsb3RDb250ZW50c0VuZW15Lmpzb24nKTtcclxuXHJcbi8vVVBEQVRFIFNUQVRTIFBMQVlFUiBBTkQgRU5FTVkodXBkYXRlcyBhbGwgc3RhdHMsIGJldHRlciB0byB1cGRhdGUgc3RhcyAxIGF0IGEgdGltZSBpbiBnYW1ldGltZSlcclxudmFyIHNldFBsYXllclN0YXRzID0gcmVxdWlyZSgnLi92aXN1YWwvc2V0UGxheWVyU3RhdHMuanMnKTtcclxudmFyIHVwZGF0ZVBsYXllckhVRCA9IG5ldyBzZXRQbGF5ZXJTdGF0cyhwbGF5ZXIpO1xyXG52YXIgc2V0RW5lbXlTdGF0cyA9IHJlcXVpcmUoJy4vdmlzdWFsL3NldEVuZW15U3RhdHMuanMnKTtcclxudmFyIHVwZGF0ZUVuZW15SFVEID0gbmV3IHNldEVuZW15U3RhdHMoZW5lbXkpO1xyXG5cclxuLy9BTEwgQlVUVE9OUyBERUZJTkVEIEhFUkVcclxudmFyIGZpbmRUaGVDbGlja0NvbnRpbnVlZCA9IHJlcXVpcmUoJy4vYWRtaW4vZmluZFRoZUNsaWNrLmpzJyk7XHJcbnZhciB0b2dnbGVTZWxlY3RlZEludmVudG9yeSA9IHJlcXVpcmUoJy4vYWRtaW4vdG9nZ2xlU2VsZWN0ZWQuanMnKTtcclxudmFyIGNoYW5nZUJ1dHRvbkNvbG91ciA9IHJlcXVpcmUoJy4vdmlzdWFsL2NoYW5nZUJ1dHRvbkNvbG91ci5qcycpO1xyXG5cclxuLy9TRVRTT0NLSUNPTlNcclxudmFyIHNldFNvY2tJY29ucyA9IHJlcXVpcmUoJy4vdmlzdWFsL3NldFNvY2tJY29ucy5qcycpO1xyXG52YXIgbG9hZEludmVudG9yeVN0YXRzID0gcmVxdWlyZSgnLi9nYW1lRGF0YS9sb2FkSW52ZW50b3J5U3RhdHMnKTtcclxudmFyIGxvYWRJdGVtc1RvUm93ID0gbmV3IGxvYWRJbnZlbnRvcnlTdGF0cyhlcXVpcENoZWNrLCBpbnZTbG90Q29udGVudExpbmtzLCBwbGF5ZXJJbnZlbnRvcnkpO1xyXG52YXIgZXF1aXBJdGVtVG9Tb2NrcyA9IHJlcXVpcmUoJy4vZ2FtZURhdGEvZXF1aXBJdGVtVG9Tb2Nrcy5qcycpO1xyXG52YXIgZXF1aXBJdGVtVG9Tb2Nrc0VuZW15ID0gcmVxdWlyZSgnLi9nYW1lRGF0YS9lcXVpcEl0ZW1Ub1NvY2tzRW5lbXkuanMnKTtcclxuXHJcbi8vREVTRUxFQ1RTT0NLQU5ESU5WIElDT05TIEFORCBBUlJBWVNcclxudmFyIGRlc2VsZWN0U29ja2FuZEludiA9IHJlcXVpcmUoJy4vdmlzdWFsL2Rlc2VsZWN0U29ja2FuZEludi5qcycpO1xyXG52YXIgZGVzZWxlY3RTb2NrYW5kSW52QXJyYXkgPSByZXF1aXJlKCcuL2FkbWluL2Rlc2VsZWN0U29ja2FuZEludkFycmF5LmpzJyk7XHJcblxyXG4vL0NIRUNLIFBST0NFU1NPUiBTUEFDRSBBTkQgQ0FOQ0VMIFRIRSBFUVVJUCBJRiBORUNFU1NBUlkuXHJcbnZhciBjaGVja1BQQ1VSU3BhY2VDYW5jZWwgPSByZXF1aXJlKCcuL2dhbWVEYXRhL2NoZWNrUFBDVVJTcGFjZUNhbmNlbCcpO1xyXG52YXIgY2hlY2tQUENVUlNwYWNlQ2FuY2VsRW5lbXkgPSByZXF1aXJlKCcuL2dhbWVEYXRhL2NoZWNrUFBDVVJTcGFjZUNhbmNlbEVuZW15Jyk7XHJcblxyXG4vL0lOIEdBTUUgTUVTU0FHRSBMT0cgLSBTVEFSVFMgT0ZGIEVNUFRZXHJcbnZhciBnYW1lTWVzc2FnZUxvZyA9IHJlcXVpcmUoJy4uL0pTT04vZ2FtZU1lc3NhZ2VMb2cuanNvbicpO1xyXG5cclxuLy9VTkVRVUlQSU5HIEFMV0FZUyBPTiBJVEVNIFNUQVRTXHJcbnZhciByZW1vdmVBT1N0YXRzVW5lcXVpcCA9IHJlcXVpcmUoJy4vZ2FtZURhdGEvcmVtb3ZlQU9TdGF0c1VuZXF1aXAuanMnKTtcclxuXHJcbi8vR0FNRVRJTUUgTUVDSEFOSUNTIFJFUVVJUk1FTlRTXHJcbnZhciB1cGRhdGVQcm9ncmVzc0JhcnMgPSByZXF1aXJlKCcuL3Zpc3VhbC91cGRhdGVQcm9ncmVzc0JhcnMuanMnKTtcclxudmFyIG1vZGlmeVN0YXRzUGVyU29ja2V0ID0gcmVxdWlyZSgnLi9nYW1lRGF0YS9tb2RpZnlTdGF0c1BlclNvY2tldC5qcycpO1xyXG5cclxuLy9BSSBDT05UUk9MU1xyXG52YXIgQUlUZW1wbGF0ZUNvbnRyb2wgPSByZXF1aXJlKCcuL2FkbWluL0FJVGVtcGxhdGVDb250cm9sLmpzJyk7XHJcbnZhciBBSUludmVudG9yeSA9IHJlcXVpcmUoJy4uL0pTT04vZW5lbXlJbnZlbnRvcnkuanNvbicpO1xyXG52YXIgQUlUZW1wbGF0ZXMgPSByZXF1aXJlKCcuLi9KU09OL0FJVGVtcGxhdGVzLmpzb24nKTtcclxudmFyIHNldFNvY2tJY29uc0VuZW15ID0gcmVxdWlyZSgnLi92aXN1YWwvc2V0U29ja0ljb25zRW5lbXkuanMnKTtcclxudmFyIEFJVG9nZ2xlU2VsZWN0ZWQgPSByZXF1aXJlKCcuL2FkbWluL0FJVG9nZ2xlU2VsZWN0ZWQuanMnKTtcclxuXHJcbnZhciBpbnZTbG90Q29udGVudExpbmtzRW5lbXkgPSByZXF1aXJlKCcuLi9KU09OL2ludmVudG9yeVNsb3RDb250ZW50c0VuZW15Lmpzb24nKTtcclxudmFyIEFJRXF1aXBMb29wID0gcmVxdWlyZSgnLi4vSlNPTi9BSUVxdWlwTG9vcC5qc29uJyk7XHJcblxyXG4vL1NPQ0tFVCBDTElDS1NcclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbFNvY2swMUJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKCBcImNsaWNrXCIsIGZpbmRUaGVDbGljaywgZmFsc2UpO1xyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsU29jazAyQnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoIFwiY2xpY2tcIiwgZmluZFRoZUNsaWNrLCBmYWxzZSk7XHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxTb2NrMDNCdXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lciggXCJjbGlja1wiLCBmaW5kVGhlQ2xpY2ssIGZhbHNlKTtcclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbFNvY2swNEJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKCBcImNsaWNrXCIsIGZpbmRUaGVDbGljaywgZmFsc2UpO1xyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsU29jazA1QnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoIFwiY2xpY2tcIiwgZmluZFRoZUNsaWNrLCBmYWxzZSk7XHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxTb2NrMDZCdXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lciggXCJjbGlja1wiLCBmaW5kVGhlQ2xpY2ssIGZhbHNlKTtcclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbFNvY2swN0J1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKCBcImNsaWNrXCIsIGZpbmRUaGVDbGljaywgZmFsc2UpO1xyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsU29jazA4QnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoIFwiY2xpY2tcIiwgZmluZFRoZUNsaWNrLCBmYWxzZSk7XHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxTb2NrMDlCdXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lciggXCJjbGlja1wiLCBmaW5kVGhlQ2xpY2ssIGZhbHNlKTtcclxuLy9JTlZFTlRPUlkgQ0xJQ0tTXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxTaW52MDFCdXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lciggXCJjbGlja1wiLCBmaW5kVGhlQ2xpY2ssIGZhbHNlKTtcclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbFNpbnYwMkJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKCBcImNsaWNrXCIsIGZpbmRUaGVDbGljaywgZmFsc2UpO1xyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsU2ludjAzQnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoIFwiY2xpY2tcIiwgZmluZFRoZUNsaWNrLCBmYWxzZSk7XHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxTaW52MDRCdXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lciggXCJjbGlja1wiLCBmaW5kVGhlQ2xpY2ssIGZhbHNlKTtcclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbFNpbnYwNUJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKCBcImNsaWNrXCIsIGZpbmRUaGVDbGljaywgZmFsc2UpO1xyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsU2ludjA2QnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoIFwiY2xpY2tcIiwgZmluZFRoZUNsaWNrLCBmYWxzZSk7XHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxTaW52MDdCdXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lciggXCJjbGlja1wiLCBmaW5kVGhlQ2xpY2ssIGZhbHNlKTtcclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbFNpbnYwOEJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKCBcImNsaWNrXCIsIGZpbmRUaGVDbGljaywgZmFsc2UpO1xyXG5cclxuLy9TQ1JPTExJTlZFTlRPUlkgQ09OVFJPTFNcclxudmFyIHNjcm9sbEludmVudG9yeUNsaWNrQ29udGludWVkID0gcmVxdWlyZSgnLi9nYW1lRGF0YS9zY3JvbGxJbnZlbnRvcnlDbGljay5qcycpO1xyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsSW52QXJyb3dVcFwiKS5hZGRFdmVudExpc3RlbmVyKCBcImNsaWNrXCIsIGZpbmRUaGVDbGljaywgZmFsc2UpO1xyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsSW52QXJyb3dEb3duXCIpLmFkZEV2ZW50TGlzdGVuZXIoIFwiY2xpY2tcIiwgZmluZFRoZUNsaWNrLCBmYWxzZSk7XHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxJbnZBcnJvd01pZFwiKS5hZGRFdmVudExpc3RlbmVyKCBcImNsaWNrXCIsIGZpbmRUaGVDbGljaywgZmFsc2UpO1xyXG5cclxuZnVuY3Rpb24gZmluZFRoZUNsaWNrKGUpe1xyXG4gIHZhciBpZFBhY2tDbGlja2VkID0gbmV3IGZpbmRUaGVDbGlja0NvbnRpbnVlZChlKTtcclxuICB2YXIgdG9nZ2xlU2VsZWN0ZWQgPSBuZXcgdG9nZ2xlU2VsZWN0ZWRJbnZlbnRvcnkoaWRQYWNrQ2xpY2tlZCwgaW52U2xvdENvbnRlbnRMaW5rcyxzb2Nrc0NvbnRlbnRMaW5rcywgZXF1aXBDaGVjayk7XHJcbiAgdmFyIGNoYW5nZUNvbG91ciA9IG5ldyBjaGFuZ2VCdXR0b25Db2xvdXIoaWRQYWNrQ2xpY2tlZCwgaW52U2xvdENvbnRlbnRMaW5rcywgc29ja3NDb250ZW50TGlua3MpOyAgXHJcbiAgaWYoZXF1aXBDaGVjay5pbnZCb29sID09IHRydWUgJiYgZXF1aXBDaGVjay5zb2NrQm9vbCA9PSB0cnVlKXtlcXVpcEFjdGlvbnMoKTt9XHJcbiAgaWYoZXF1aXBDaGVjay5zY3JvbGxGb3J3PT10cnVlfHxlcXVpcENoZWNrLnNjcm9sbEJhY2t3PT10cnVlfHxlcXVpcENoZWNrLnNjcm9sbE1pZD09dHJ1ZSl7XHJcbiAgICB2YXIgbmV4dEludmVudG9yeVJvdyA9IG5ldyBsb2FkUGxheWVySW52ZW50b3J5KHBsYXllckludmVudG9yeSxpbnZTbG90Q29udGVudExpbmtzLCBlcXVpcENoZWNrKTtcclxuICAgIHZhciBuZXh0SW52ZW50b3J5U3RhdHMgPSBuZXcgbG9hZEludmVudG9yeVN0YXRzKGVxdWlwQ2hlY2ssIGludlNsb3RDb250ZW50TGlua3MsIHBsYXllckludmVudG9yeSk7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIGVxdWlwQWN0aW9ucygpe1xyXG4gIHZhciByZW1vdmVBT1N0YXRzVW5lcXVpcFBsYXllciA9IG5ldyByZW1vdmVBT1N0YXRzVW5lcXVpcChwbGF5ZXIsIHNvY2tzQ29udGVudExpbmtzKTtcclxuICB2YXIgY2hlY2tQUENVUlNwYWNlQW5kQ2FuY2VsID0gbmV3IGNoZWNrUFBDVVJTcGFjZUNhbmNlbChwbGF5ZXIsIGludlNsb3RDb250ZW50TGlua3MsIHNvY2tzQ29udGVudExpbmtzLCBnYW1lTWVzc2FnZUxvZyk7XHJcbiAgdmFyIHNldEljb25zID0gbmV3IHNldFNvY2tJY29ucyhpbnZTbG90Q29udGVudExpbmtzLCBzb2Nrc0NvbnRlbnRMaW5rcyk7XHJcbiAgdmFyIHNldEl0ZW1JblNvY2sgPSBuZXcgZXF1aXBJdGVtVG9Tb2NrcyhwbGF5ZXIsIHByb2dyZXNzLCBpbnZTbG90Q29udGVudExpbmtzLCBzb2Nrc0NvbnRlbnRMaW5rcyk7XHJcbiAgdmFyIGRlc2VsZWN0U2FuZEkgPSBuZXcgZGVzZWxlY3RTb2NrYW5kSW52KGludlNsb3RDb250ZW50TGlua3MsIHNvY2tzQ29udGVudExpbmtzKTsgXHJcbiAgdmFyIGRlc2VsZWN0U2FuZElBcnJheSA9IG5ldyBkZXNlbGVjdFNvY2thbmRJbnZBcnJheShlcXVpcENoZWNrLCBpbnZTbG90Q29udGVudExpbmtzLCBzb2Nrc0NvbnRlbnRMaW5rcyk7XHJcbiAgY29uc29sZS5sb2coaW52U2xvdENvbnRlbnRMaW5rcywgc29ja3NDb250ZW50TGlua3MpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZW5lbXlFcXVpcEFjdGlvbnMoKXtcclxuICB2YXIgcmVtb3ZlQU9TdGF0c1VuZXF1aXBFbmVteSA9IG5ldyByZW1vdmVBT1N0YXRzVW5lcXVpcChlbmVteSwgc29ja3NDb250ZW50TGlua3NFbmVteSk7XHJcbiAgdmFyIGNoZWNrUFBDVVJTcGFjZUFuZENhbmNlbCA9IG5ldyBjaGVja1BQQ1VSU3BhY2VDYW5jZWxFbmVteShlbmVteSwgQUlJbnZlbnRvcnksIHNvY2tzQ29udGVudExpbmtzRW5lbXksIGdhbWVNZXNzYWdlTG9nKTtcclxuICB2YXIgc2V0SWNvbnNFbmVteSA9IG5ldyBzZXRTb2NrSWNvbnNFbmVteShBSUludmVudG9yeSwgc29ja3NDb250ZW50TGlua3NFbmVteSk7XHJcbiAgdmFyIHNldEl0ZW1JblNvY2sgPSBuZXcgZXF1aXBJdGVtVG9Tb2Nrc0VuZW15KGVuZW15LCBwcm9ncmVzcywgQUlJbnZlbnRvcnksIHNvY2tzQ29udGVudExpbmtzRW5lbXkpO1xyXG4gIHZhciBkZXNlbGVjdFNhbmRJQXJyYXkgPSBuZXcgZGVzZWxlY3RTb2NrYW5kSW52QXJyYXkoZXF1aXBDaGVja0VuZW15LEFJSW52ZW50b3J5LCBzb2Nrc0NvbnRlbnRMaW5rc0VuZW15KTtcclxufVxyXG5mdW5jdGlvbiBlbmVteUVxdWlwTG9vcCgpe1xyXG5cclxuICBmb3IodmFyIGkgPSAwOyBpIDwgZXF1aXBDaGVja0VuZW15LkNBVFMubGVuZ3RoOyBpKyspe1xyXG4gICAgICBpZihlcXVpcENoZWNrRW5lbXkuQ0FUU1tpXSA9PSAwfHxlcXVpcENoZWNrRW5lbXkuQ0FUU1tpXSA9PSB1bmRlZmluZWQpe1xyXG5cclxuICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAvL2NvbnNvbGUubG9nKGVxdWlwQ2hlY2tFbmVteS5DQVRTW2ldKTtcclxuXHJcbiAgICAgIHZhciBBSVRvZ2dsZVNlbGVjdGVkcyA9IG5ldyBBSVRvZ2dsZVNlbGVjdGVkKGVxdWlwQ2hlY2tFbmVteS5DQVRTW2ldLCBlcXVpcENoZWNrRW5lbXksIEFJRXF1aXBMb29wLCBBSUludmVudG9yeSwgc29ja3NDb250ZW50TGlua3NFbmVteSk7XHJcblxyXG4gICAgICBlbmVteUVxdWlwQWN0aW9ucygpO1xyXG4gICAgICB9XHJcblxyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vQU5JTUFUSU9OIExPT1BcclxudmFyIHByb2dyZXNzO1xyXG52YXIgc3RhcnQgPSBudWxsO1xyXG53aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xyXG52YXIgZW5lbXlUaW1lciA9IHN0YXJ0ICsgMzAwMDtcclxuZnVuY3Rpb24gc3RlcCh0aW1lc3RhbXApIHtcclxuICBcdC8vVEhJUyBJUyBXSEVSRSBUSEUgR0FNRVRJTUUgUlVOU1xyXG4gICAgdmFyIHVwZGF0ZVBsYXllckhVRFZpc3VhbCA9IG5ldyBzZXRQbGF5ZXJTdGF0cyhwbGF5ZXIpO1xyXG4gICAgdmFyIHVwZGF0ZUVuZW15SFVEVmlzdWFsID0gbmV3IHNldEVuZW15U3RhdHMoZW5lbXkpO1xyXG4gICAgdmFyIHVwZGF0ZVN0YXRzUGVyU29ja2V0RXF1aXBlZFBMQVlFUiA9IG5ldyBtb2RpZnlTdGF0c1BlclNvY2tldChwcm9ncmVzcywgc29ja3NDb250ZW50TGlua3MsIHNvY2tzQ29udGVudExpbmtzRW5lbXksIHBsYXllciwgZW5lbXksIGdhbWVNZXNzYWdlTG9nKTtcclxuICAgIHZhciB1cGRhdGVTdGF0c1BlclNvY2tldEVxdWlwZWRFTkVNWSA9IG5ldyBtb2RpZnlTdGF0c1BlclNvY2tldChwcm9ncmVzcywgc29ja3NDb250ZW50TGlua3NFbmVteSwgc29ja3NDb250ZW50TGlua3MsIGVuZW15LCBwbGF5ZXIsIGdhbWVNZXNzYWdlTG9nKTtcclxuICAgIHZhciB1cGRhdGVBbmRDaGVja0FsbFByb2dyZXNzQmFyc1Zpc3VhbCA9IG5ldyB1cGRhdGVQcm9ncmVzc0JhcnMocGxheWVyLCBlbmVteSwgcHJvZ3Jlc3MsIHNvY2tzQ29udGVudExpbmtzLCBzb2Nrc0NvbnRlbnRMaW5rc0VuZW15KTtcclxuICAgIC8vIENIRUNLIEZPUiBFTkVNWSBFUVVJUFxyXG4gICAgaWYgKGVuZW15VGltZXIgPCBwcm9ncmVzcyl7XHJcbiAgICAgIHZhciBpbml0QUlCZWhhdmlvdXIgPSBuZXcgQUlUZW1wbGF0ZUNvbnRyb2woZW5lbXksIHBsYXllciwgc29ja3NDb250ZW50TGlua3MsIHNvY2tzQ29udGVudExpbmtzRW5lbXksIEFJSW52ZW50b3J5LCBlcXVpcENoZWNrRW5lbXksIEFJVGVtcGxhdGVzLCBBSUVxdWlwTG9vcCk7XHJcbiAgICBcclxuICAgICAgaWYoZXF1aXBDaGVja0VuZW15LmludkJvb2wgPT0gdHJ1ZSAmJiBlcXVpcENoZWNrRW5lbXkuc29ja0Jvb2wgPT0gdHJ1ZSl7ZW5lbXlFcXVpcExvb3AoKTt9XHJcbiAgICBcdC8vY29uc29sZS5sb2coc29ja3NDb250ZW50TGlua3NFbmVteSk7XHJcbiAgICAgIGVuZW15VGltZXIgPSBwcm9ncmVzcyArIDMwMDA7XHJcbiAgICB9XHJcblxyXG5cdGlmIChzdGFydCA9PT0gbnVsbCkgc3RhcnQgPSB0aW1lc3RhbXA7XHJcblx0cHJvZ3Jlc3MgPSB0aW1lc3RhbXAgLSBzdGFydDtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxufVxyXG5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxufSkodGhpcyxkb2N1bWVudCk7XHJcblxyXG4vL2h0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTYwMTc3My9ob3ctZG8taS1jcmVhdGUtYS1nbG9iYWxseS1hY2Nlc3NpYmxlLXZhcmlhYmxlXHJcbi8vUEFTUyBWQVJJQUJMRSBCRVRXRUVOIEZVTkNUSU9OU1xyXG4vKlxyXG5mdW5jdGlvbiBQZXJzb24oKSB7XHJcbiAgICB2YXIgc2VjcmV0ID0gXCJTZWNyZXQgTWVzc2FnZVwiO1xyXG5cclxuICAgIHRoaXMucmV2ZWFsU2VjcmV0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlY3JldDtcclxuICAgIH1cclxufVxyXG52YXIgbWUgPSBuZXcgUGVyc29uKCk7XHJcbm1lLnJldmVhbFNlY3JldCgpOyAvL3JldHVybnMgXCJTZWNyZXQgTWVzc2FnZVwiKi9cclxuXHJcbi8vUkVBTCBKU09OIENBTExcclxuLyp2YXIgZmluZHBsYXllciA9IHJlcXVpcmUoJy4vZmluZFBsYXllci5qcycpO1xyXG52YXIgcGxheWVybGlzdCA9IGZpbmRwbGF5ZXIoKTsqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYWRqdXN0RW5lbXlIVURTaXplKHNpemVzT2JqZWN0KXtcclxuXHQvL3ZhciBvYmpDb3VudCA9ICBPYmplY3Qua2V5cyhzaXplc09iamVjdCkubGVuZ3RoIC0gMTtcclxuXHR2YXIgZW5lbXlIVURESVYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVuZW15SFVEXCIpO1xyXG5cdHZhciB3aWR0aEVOSFVEID0gZW5lbXlIVURESVYuY2xpZW50V2lkdGg7XHJcblx0dmFyIGhlaWdodEVOSFVEID0gTWF0aC5jZWlsKHdpZHRoRU5IVUQqc2l6ZXNPYmplY3RbMF0uV2lkdGh0b0hlaWdodEhVRCk7XHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbmVteUhVRFwiKS5zdHlsZS5oZWlnaHQgPSBoZWlnaHRFTkhVRDtcclxuXHR2YXIgZG9jV2lkdGggPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoOy8vd2luZG93Lm91dGVyV2lkdGg7XHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbmVteUhVRFwiKS5zdHlsZS5sZWZ0ID0gZG9jV2lkdGggLSB3aWR0aEVOSFVEIC0gMjA7XHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbmVteVNPQ0tTXCIpLnN0eWxlLmxlZnQgPSBkb2NXaWR0aCAtIHdpZHRoRU5IVUQgLSAyMDtcclxuXHR2YXIgc2l6ZUZhY3RvckZvbnQgPSB3aWR0aEVOSFVEIC8gc2l6ZXNPYmplY3RbMF0ud2lkdGg7XHJcblxyXG5cclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVuU2hpZWxkVHh0XCIpLnN0eWxlLmZvbnRTaXplID0gc2l6ZXNPYmplY3RbMF0udGV4dDI1ICogc2l6ZUZhY3RvckZvbnQ7XHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbkFybW9yVHh0XCIpLnN0eWxlLmZvbnRTaXplID0gc2l6ZXNPYmplY3RbMF0udGV4dDI1ICogc2l6ZUZhY3RvckZvbnQ7XHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbkJhdHRlcnlUeHRcIikuc3R5bGUuZm9udFNpemUgPSBzaXplc09iamVjdFswXS50ZXh0MjUgKiBzaXplRmFjdG9yRm9udDtcclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVuUHJvY2Vzc29yVHh0R2h6XCIpLnN0eWxlLmZvbnRTaXplID0gc2l6ZXNPYmplY3RbMF0udGV4dDE2ICogc2l6ZUZhY3RvckZvbnQ7XHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlblByb2Nlc3Nvck1iYXJQZXJjXCIpLnN0eWxlLmZvbnRTaXplID0gc2l6ZXNPYmplY3RbMF0udGV4dDMwICogc2l6ZUZhY3RvckZvbnQ7XHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlblByb2Nlc3NvclR4dEdoelNcIikuc3R5bGUuZm9udFNpemUgPXNpemVzT2JqZWN0WzBdLnRleHQyMCAqIHNpemVGYWN0b3JGb250O1xyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW5UZW1wZXJhdHVyZVR4dFNcIikuc3R5bGUuZm9udFNpemUgPSBzaXplc09iamVjdFswXS50ZXh0MjAgKiBzaXplRmFjdG9yRm9udDtcclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVuVGVtcGVyYXR1cmVUeHRcIikuc3R5bGUuZm9udFNpemUgPSBzaXplc09iamVjdFswXS50ZXh0NTAgKiBzaXplRmFjdG9yRm9udDtcclxuXHJcblxyXG5cclxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYWRqdXN0cGxheWVySFVEU2l6ZShzaXplc09iamVjdCl7XHJcblx0Ly92YXIgb2JqQ291bnQgPSAgT2JqZWN0LmtleXMoc2l6ZXNPYmplY3QpLmxlbmd0aCAtIDE7XHJcblx0dmFyIHBsYXllckhVRERJViA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVySFVEXCIpO1xyXG5cdHZhciB3aWR0aFBMSFVEID0gcGxheWVySFVERElWLmNsaWVudFdpZHRoO1xyXG5cdHZhciBoZWlnaHRQTEhVRCA9IE1hdGguY2VpbCh3aWR0aFBMSFVEKnNpemVzT2JqZWN0WzBdLldpZHRodG9IZWlnaHRIVUQpO1xyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVySFVEXCIpLnN0eWxlLmhlaWdodCA9IGhlaWdodFBMSFVEO1xyXG5cdHZhciBkb2NXaWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7Ly93aW5kb3cub3V0ZXJXaWR0aDtcclxuLypcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVySFVEXCIpLnN0eWxlLmxlZnQgPSBkb2NXaWR0aCAtIHdpZHRoUExIVUQgLSAyMDtcclxuXHRjb25zb2xlLmxvZyhkb2NXaWR0aCk7Ki9cclxuXHR2YXIgc2l6ZUZhY3RvckZvbnQgPSB3aWR0aFBMSFVEIC8gc2l6ZXNPYmplY3RbMF0ud2lkdGg7XHJcblxyXG5cclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsU2hpZWxkVHh0XCIpLnN0eWxlLmZvbnRTaXplID0gc2l6ZXNPYmplY3RbMF0udGV4dDI1ICogc2l6ZUZhY3RvckZvbnQ7XHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbEFybW9yVHh0XCIpLnN0eWxlLmZvbnRTaXplID0gc2l6ZXNPYmplY3RbMF0udGV4dDI1ICogc2l6ZUZhY3RvckZvbnQ7XHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbEJhdHRlcnlUeHRcIikuc3R5bGUuZm9udFNpemUgPSBzaXplc09iamVjdFswXS50ZXh0MjUgKiBzaXplRmFjdG9yRm9udDtcclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsUHJvY2Vzc29yVHh0R2h6XCIpLnN0eWxlLmZvbnRTaXplID0gc2l6ZXNPYmplY3RbMF0udGV4dDE2ICogc2l6ZUZhY3RvckZvbnQ7XHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbFByb2Nlc3Nvck1iYXJQZXJjXCIpLnN0eWxlLmZvbnRTaXplID0gc2l6ZXNPYmplY3RbMF0udGV4dDMwICogc2l6ZUZhY3RvckZvbnQ7XHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbFByb2Nlc3NvclR4dEdoelNcIikuc3R5bGUuZm9udFNpemUgPXNpemVzT2JqZWN0WzBdLnRleHQyMCAqIHNpemVGYWN0b3JGb250O1xyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxUZW1wZXJhdHVyZVR4dFNcIikuc3R5bGUuZm9udFNpemUgPSBzaXplc09iamVjdFswXS50ZXh0MjAgKiBzaXplRmFjdG9yRm9udDtcclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsVGVtcGVyYXR1cmVUeHRcIikuc3R5bGUuZm9udFNpemUgPSBzaXplc09iamVjdFswXS50ZXh0NTAgKiBzaXplRmFjdG9yRm9udDtcclxuXHJcblxyXG5cclxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2hhbmdlQnV0dG9uQ29sb3VyKGlkUGFjaywgaW52TGluaywgc29ja0xpbmspe1x0XHJcblx0dmFyIHBhcmVudElEID0gaWRQYWNrWzBdO1xyXG5cdHZhciBwYXJlbnRQYXJlbnRJRCA9IGlkUGFja1sxXTtcdFxyXG5cdHZhciB0YXJnZXRJRCA9IGlkUGFja1syXTtcclxuXHJcblx0XHJcblx0c3dpdGNoKHBhcmVudFBhcmVudElELmlkKXtcclxuXHRjYXNlIFwiSU5WQnV0dG9uc1wiOlxyXG5cdFx0dmFyIGludkNvdW50ID0gT2JqZWN0LmtleXMoaW52TGluaykubGVuZ3RoO1x0XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaTxpbnZDb3VudDtpKyspe1xyXG5cdFx0XHRpZihpbnZMaW5rW2ldLnByZWZpeElEID09IHBhcmVudElELmlkKXtcclxuXHRcdFx0XHRpZihpbnZMaW5rW2ldLnNlbGVjdGVkID09IHRydWUpe1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW52TGlua1tpXS5wcmVmaXhJRCtcImJhY2tCYXJcIikuY2xhc3NOYW1lID0gXCJiYWNrQmFyU2VsZWN0ZWRcIjtcdFxyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW52TGlua1tpXS5wcmVmaXhJRCtcImJhY2tCYXJcIikuY2xhc3NOYW1lID0gXCJiYWNrQmFyXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnZMaW5rW2ldLnByZWZpeElEK1wiYmFja0JhclwiKS5jbGFzc05hbWUgPT0gXCJiYWNrQmFyU2VsZWN0ZWRcIil7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnZMaW5rW2ldLnByZWZpeElEK1wiYmFja0JhclwiKS5jbGFzc05hbWUgPSBcImJhY2tCYXJcIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGJyZWFrO1xyXG5cdGNhc2UgXCJwbGF5ZXJTb2Nrc1wiOlxyXG5cdFx0dmFyIHNvY2tDb3VudCA9IE9iamVjdC5rZXlzKHNvY2tMaW5rKS5sZW5ndGg7XHJcblx0XHRmb3IgKHZhciBiID0gMDsgYjxzb2NrQ291bnQ7YisrKXtcclxuXHRcdFx0aWYoc29ja0xpbmtbYl0ucHJlZml4SUQgPT0gcGFyZW50SUQuaWQpe1xyXG5cdFx0XHRcdGlmKHNvY2tMaW5rW2JdLnNlbGVjdGVkID09IHRydWUpe1xyXG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc29ja0xpbmtbYl0ucHJlZml4SUQrXCJiYWNrQmFyXCIpLmNsYXNzTmFtZSA9IFwiYmFja0JhclNlbGVjdGVkXCI7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzb2NrTGlua1tiXS5wcmVmaXhJRCtcImJhY2tCYXJcIikuY2xhc3NOYW1lID0gXCJiYWNrQmFyXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cdFx0YnJlYWs7XHJcblx0Y2FzZSBcIklOVkNvbnRyb2xzXCI6XHRcclxuXHRcdGNsZWFyU2VsZWN0ZWRTb2Nrc0FuZEludigpO1xyXG5cdFx0YnJlYWs7XHJcblx0ZGVmYXVsdCA6XHJcblx0XHRjbGVhclNlbGVjdGVkU29ja3NBbmRJbnYoKTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gY2xlYXJTZWxlY3RlZFNvY2tzQW5kSW52KCl7XHJcblx0XHR2YXIgaW52Q291bnQgPSBPYmplY3Qua2V5cyhpbnZMaW5rKS5sZW5ndGg7XHRcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpPGludkNvdW50O2krKyl7XHJcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGludkxpbmtbaV0ucHJlZml4SUQrXCJiYWNrQmFyXCIpLmNsYXNzTmFtZSA9IFwiYmFja0JhclwiO1xyXG5cdFx0fVxyXG5cdFx0dmFyIHNvY2tDb3VudCA9IE9iamVjdC5rZXlzKHNvY2tMaW5rKS5sZW5ndGg7XHJcblx0XHRmb3IgKHZhciBiID0gMDsgYjxzb2NrQ291bnQ7YisrKXtcclxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc29ja0xpbmtbYl0ucHJlZml4SUQrXCJiYWNrQmFyXCIpLmNsYXNzTmFtZSA9IFwiYmFja0JhclwiO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlc2VsZWN0U29ja2FuZEludihpbnZMaW5rLCBzb2NrTGluayl7XHJcblxyXG5cdHZhciBpbnZDb3VudCA9IE9iamVjdC5rZXlzKGludkxpbmspLmxlbmd0aDtcdFxyXG5cdGZvciAodmFyIGkgPSAwOyBpPGludkNvdW50O2krKyl7XHJcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnZMaW5rW2ldLnByZWZpeElEK1wiYmFja0JhclwiKS5jbGFzc05hbWUgPSBcImJhY2tCYXJcIjtcclxuXHR9XHJcblx0dmFyIHNvY2tDb3VudCA9IE9iamVjdC5rZXlzKHNvY2tMaW5rKS5sZW5ndGg7XHJcblx0Zm9yICh2YXIgYiA9IDA7IGI8c29ja0NvdW50O2IrKyl7XHJcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzb2NrTGlua1tiXS5wcmVmaXhJRCtcImJhY2tCYXJcIikuY2xhc3NOYW1lID0gXCJiYWNrQmFyXCI7XHJcblx0fVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG4vL1NFTlNJVElWRVRPI0NTUyhiYWNrQmFyLCBiYWNrQmFyU2VsZWN0ZWQpICNIVE1MKElOVkJ1dHRvbnMsIHBsc2ludjAxYmFja0Jhci1wbHNpbnYwOGJhY2tCYXIpIFxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbmRUaGVDbGljayhlKXtcclxuXHRcclxuXHRcdFx0dmFyIHBhcmVudElEID0gb2J0YWluUGFyZW50KGUpO1xyXG5cdFx0XHR2YXIgcGFyZW50UGFyZW50SUQgPSBvYnRhaW5QYXJlbnRQYXJlbnQocGFyZW50SUQpO1x0XHJcblx0XHRcdHZhciB0YXJnZXRJRCA9IG9idGFpblRhcmdldElEKHBhcmVudElEKTtcclxuXHJcblx0XHRcdHZhciBpZFBhY2thZ2UgPSBbcGFyZW50SUQsIHBhcmVudFBhcmVudElELCB0YXJnZXRJRCwgZS5pZF07XHJcblxyXG5cdHJldHVybiBpZFBhY2thZ2VcclxuXHJcblxyXG5cdGZ1bmN0aW9uIG9idGFpblBhcmVudChlKXtcclxuXHRcdHZhciBwYXJlbnRJRCA9IGUudGFyZ2V0LnBhcmVudE5vZGU7XHJcblx0XHRyZXR1cm4gcGFyZW50SUQ7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIG9idGFpblBhcmVudFBhcmVudChwYXJlbnRJRCl7XHJcblx0XHR2YXIgcGFyZW50UGFyZW50SUQgPSBwYXJlbnRJRC5wYXJlbnROb2RlO1xyXG5cdFx0cmV0dXJuXHRwYXJlbnRQYXJlbnRJRDtcdFxyXG5cdH1cclxuXHRmdW5jdGlvbiBvYnRhaW5UYXJnZXRJRChwYXJlbnRJRCl7XHJcblx0XHR2YXIgdGFyZ2V0SUQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYXJlbnRJRC5pZCArIFwiYmFja0JhclwiKTtcclxuXHRcdHJldHVybiB0YXJnZXRJRDtcclxuXHR9XHJcblxyXG5cclxufTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmaW5kVGhlQ2xpY2soKXtcclxuXHJcblx0Y29uc29sZS5sb2coXCJmb3VuZCBhIGNsaWNrXCIpO1xyXG5cdFxyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxTb2NrMDFCdXR0b25cIikub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsU29jazAxYmFja0JhclwiKS5jbGFzc05hbWUgPSBcImJhY2tCYXJTZWxlY3RlZFwiXHJcblx0fTtcclxuXHJcbn07XHJcbiovXHJcblxyXG4vL0ZPUiBUSU1JTkcgU1RBUlRcclxuLypcdHZhciBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xyXG5cdGNvbnNvbGUubG9nKHN0YXJ0RGF0ZS5nZXRTZWNvbmRzKCksIHN0YXJ0RGF0ZS5nZXRNaWxsaXNlY29uZHMoKSk7XHJcblxyXG5cdHZhciBzdG9wRGF0ZSA9IG5ldyBEYXRlKCk7XHJcblx0Y29uc29sZS5sb2coc3RvcERhdGUuZ2V0U2Vjb25kcygpLCBzdG9wRGF0ZS5nZXRNaWxsaXNlY29uZHMoKSk7Ki8iLCIndXNlIHN0cmljdCdcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbG9hZFBsYXllckludmVudG9yeShhcnJJTlYsaW52TGluayxlcXVpcENoZWNrKXtcclxuXHR2YXIgc2ludklEO1xyXG5cdHZhciBpbnZDb3VudCA9IE9iamVjdC5rZXlzKGludkxpbmspLmxlbmd0aDtcdFxyXG5cdC8vY29uc29sZS5sb2coaW52TGlua1swXS5wcmVmaXhJRCk7XHJcblx0dmFyIGludk51bWJlclRvRXF1aXA7XHJcblx0dmFyIGljb25JRFByZUZpeDtcclxuXHRmb3IodmFyIGkgPSAwOyBpPGludkNvdW50OyBpKyspe1xyXG5cdFx0aW52TnVtYmVyVG9FcXVpcCA9IGkgKyBlcXVpcENoZWNrLmludlRvVmlzdWFsQmVnaW47XHJcblx0XHRpY29uSURQcmVGaXggPSBpbnZMaW5rW2ldLnByZWZpeElEO1xyXG5cdFx0XHJcblx0XHRpZihhcnJJTlZbaW52TnVtYmVyVG9FcXVpcF0gPT0gdW5kZWZpbmVkKXtcclxuXHJcblx0XHRcdHNpbnZJRCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGljb25JRFByZUZpeCtcIkljb25cIik7XHJcblx0XHRcdHNpbnZJRC5zcmMgPSBcIlwiO1xyXG5cdFx0XHRcclxuXHJcblx0XHRcdHNpbnZJRCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGljb25JRFByZUZpeCtcIlN0YXRUTFR4dFwiKTtcclxuXHRcdFx0c2ludklELmlubmVySFRNTD0gMDtcdFxyXG5cclxuXHJcblx0XHRcdHNpbnZJRCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGljb25JRFByZUZpeCtcIlN0YXRUUlR4dFwiKTtcclxuXHRcdFx0c2ludklELmlubmVySFRNTD0gMDtcclxuXHJcblx0XHRcdHNpbnZJRCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGljb25JRFByZUZpeCtcIlN0YXRCTFR4dFwiKTtcclxuXHRcdFx0c2ludklELmlubmVySFRNTD0gMDtcclxuXHJcblx0XHRcdHNpbnZJRCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGljb25JRFByZUZpeCtcIlN0YXRCUlR4dFwiKTtcclxuXHRcdFx0c2ludklELmlubmVySFRNTD0gMDtcclxuXHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0XHJcblx0XHRcdHNpbnZJRCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGljb25JRFByZUZpeCtcIkljb25cIik7XHJcblx0XHRcdHNpbnZJRC5zcmMgPSBcIkFTU0VUUy9cIithcnJJTlZbaW52TnVtYmVyVG9FcXVpcF0uZmlsZW5hbWU7XHJcblx0XHRcdFxyXG5cclxuXHRcdFx0c2ludklEID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWNvbklEUHJlRml4K1wiU3RhdFRMVHh0XCIpO1xyXG5cdFx0XHRzaW52SUQuaW5uZXJIVE1MPSBhcnJJTlZbaW52TnVtYmVyVG9FcXVpcF0uQ0RQTC8xMDAwfHwwO1x0XHJcblxyXG5cclxuXHRcdFx0c2ludklEID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWNvbklEUHJlRml4K1wiU3RhdFRSVHh0XCIpO1xyXG5cdFx0XHRzaW52SUQuaW5uZXJIVE1MPSBhcnJJTlZbaW52TnVtYmVyVG9FcXVpcF0uRFRQTC8xMDAwfHwwO1xyXG5cclxuXHRcdFx0c2ludklEID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWNvbklEUHJlRml4K1wiU3RhdEJMVHh0XCIpO1xyXG5cdFx0XHRzaW52SUQuaW5uZXJIVE1MPSBhcnJJTlZbaW52TnVtYmVyVG9FcXVpcF0uUFBQTHx8MDtcclxuXHJcblx0XHRcdHNpbnZJRCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGljb25JRFByZUZpeCtcIlN0YXRCUlR4dFwiKTtcclxuXHRcdFx0c2ludklELmlubmVySFRNTD0gYXJySU5WW2ludk51bWJlclRvRXF1aXBdLkVQUEx8fDA7XHJcblx0XHR9XHJcblxyXG5cclxuXHR9XHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcHJlcFNvY2tzR2FtZSgpe1xyXG5cclxuXHR2YXIgc29ja0lkO1xyXG5cdGZvcih2YXIgaSA9IDE7aTw9OTsgaSsrKXtcclxuXHJcblx0XHRzb2NrSWQgPSBcInBsU29jazBcIitpK1wiSWNvblwiXHJcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzb2NrSWQpLnNyYyA9IFwiXCI7XHJcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzb2NrSWQpLmJvcmRlciA9IFwiMHB4IHNvbGlkXCI7XHJcblxyXG5cclxuXHRcdHNvY2tJZCA9IFwiZW5Tb2NrMFwiK2krXCJJY29uXCJcclxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNvY2tJZCkuc3JjID0gXCJcIjtcclxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNvY2tJZCkuYm9yZGVyID0gXCIwcHggc29saWRcIjtcclxuXHR9XHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldGVuZW15U3RhdHMoZW5lbXkpe1xyXG5cdHZhciBwbCA9IGVuZW15O1xyXG5cdHZhciBtYXh3aWR0aCA9IDEwMDtcclxuXHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlblNoaWVsZFR4dFwiKS5pbm5lckhUTUwgPSBwbC5TUENVUitcIi9cIitwbC5TUE1BWDtcclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVuU2hpZWxkTWJhclwiKS5zdHlsZS53aWR0aCA9IChwbC5TUENVUiAvIHBsLlNQTUFYICogbWF4d2lkdGgpICsgXCIlXCI7IFxyXG5cclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVuQXJtb3JUeHRcIikuaW5uZXJIVE1MID0gcGwuQVBDVVIrXCIvXCIrcGwuQVBNQVg7XHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbkFybW9yTWJhclwiKS5zdHlsZS53aWR0aCA9IChwbC5BUENVUiAvIHBsLkFQTUFYICogbWF4d2lkdGgpICsgXCIlXCI7IFxyXG5cclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVuQmF0dGVyeVR4dFwiKS5pbm5lckhUTUwgPSBwbC5FUENVUitcIi9cIitwbC5FUE1BWDtcclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVuQmF0dGVyeU1iYXJcIikuc3R5bGUud2lkdGggPSAocGwuRVBDVVIgLyBwbC5FUE1BWCAqIG1heHdpZHRoKSArIFwiJVwiOyBcclxuXHJcblx0ZW5lbXlUZW1wVXBkYXRlVUkocGwuVFBDVVIsIHBsLlRQTUFYKTtcclxuXHRlbmVteUNQVVVwZGF0ZVVJKHBsLlBQQ1VSLCBwbC5QUE1BWCk7XHJcblxyXG5cclxuXHRmdW5jdGlvbiBlbmVteVRlbXBVcGRhdGVVSShUZW1wUG9pbnRzLCBNYXhQb2ludHMpIHtcclxuXHRcdHZhciByLGcsYjtcclxuXHRcdHZhciB0ZW1wVGV4dERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW5UZW1wZXJhdHVyZVR4dFwiKTtcclxuXHRcdHRlbXBUZXh0RGl2LmlubmVySFRNTCA9IHBhcnNlSW50KFRlbXBQb2ludHMvMTApO1xyXG5cdFx0XHJcblx0XHRpZiAoVGVtcFBvaW50cyA+MjQwKXtcclxuXHRcdC8vVFJBTlNJVElPTiBXSElURSBUTyBCTFVFXHJcblx0XHRcdGIgPSAyNTUtKChUZW1wUG9pbnRzLzk5MCkqMjU1KTtcclxuXHRcdFx0YiA9IHRydW5jYXRlKGIpO1xyXG5cdFx0XHRyID0gMjU1IDtcclxuXHRcdFx0ZyA9IGI7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Ly9UUkFOU0lUSU9OIFdISVRFIFRPIFJFRFxyXG5cdFx0XHRyID0gMjU1IC0gKCgoVGVtcFBvaW50cyogLTEpLzk5MCkqMjU1KTtcclxuXHRcdFx0ciA9IHRydW5jYXRlKHIpO1xyXG5cdFx0XHRnID0gcjtcclxuXHRcdFx0YiA9IDI1NTtcclxuXHRcdH1cclxuXHRcdHRlbXBUZXh0RGl2LnN0eWxlLmNvbG9yID0gXCJyZ2IoXCIgKyByICsgXCIsXCIrIGcgK1wiLFwiKyBiICtcIilcIjtcclxuXHR9O1xyXG5cdFxyXG5cdGZ1bmN0aW9uIGVuZW15Q1BVVXBkYXRlVUkoQ1BVUG9pbnRzLCBNYXhQb2ludHMpIHtcclxuXHRcdHZhciBiYXJIZWlnaHQsIGJhclRvcFBvcztcclxuXHRcdGJhckhlaWdodCA9ICgoQ1BVUG9pbnRzIC8gTWF4UG9pbnRzKSAqIDEwMCkgLyAxMDAgKiAxMDg7XHJcblx0XHRiYXJUb3BQb3MgPSA3NiAtICgoKENQVVBvaW50cyAvIE1heFBvaW50cykgKiAxMDApIC8gMTAwICogNzYpO1xyXG5cdFx0XHJcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVuUHJvY2Vzc29yVHh0R2h6XCIpLmlubmVySFRNTCA9IChDUFVQb2ludHMgLyAxMDAwKTtcclxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW5Qcm9jZXNzb3JNYmFyUGVyY1wiKS5pbm5lckhUTUwgPSBwYXJzZUludCgoQ1BVUG9pbnRzIC8gTWF4UG9pbnRzKSAqIDEwMCkgKyBcIiVcIiA7XHJcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVuUHJvY2Vzc29yTWJhclwiKS5zdHlsZS5oZWlnaHQgPSBiYXJIZWlnaHQgKyBcIiVcIjtcclxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW5Qcm9jZXNzb3JNYmFyXCIpLnN0eWxlLm1hcmdpblRvcCA9IGJhclRvcFBvcyArIFwiJVwiO1xyXG5cdH07XHJcblxyXG5cdC8vQkVMT1cgSVMgVE8gVFJVTkNBVEUgVEhFIFJHQiBWQUxVRVNcclxuXHRmdW5jdGlvbiB0cnVuY2F0ZSh2YWx1ZSl7XHJcblx0ICAgIGlmICh2YWx1ZSA8IDApe1xyXG5cdCAgICAgICAgcmV0dXJuIE1hdGguY2VpbCh2YWx1ZSk7XHJcblx0ICAgIH17XHJcblx0ICAgIFx0cmV0dXJuIE1hdGguZmxvb3IodmFsdWUpO1xyXG5cdFx0fVxyXG5cdH1cdFxyXG5cclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXRQbGF5ZXJTdGF0cyhwbGF5ZXIpe1xyXG5cdHZhciBwbCA9IHBsYXllcjtcclxuXHR2YXIgbWF4d2lkdGggPSAxMDA7XHJcblxyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxTaGllbGRUeHRcIikuaW5uZXJIVE1MID0gcGwuU1BDVVIrXCIvXCIrcGwuU1BNQVg7XHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbFNoaWVsZE1iYXJcIikuc3R5bGUud2lkdGggPSAocGwuU1BDVVIgLyBwbC5TUE1BWCAqIG1heHdpZHRoKSArIFwiJVwiOyBcclxuXHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbEFybW9yVHh0XCIpLmlubmVySFRNTCA9IHBsLkFQQ1VSK1wiL1wiK3BsLkFQTUFYO1xyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxBcm1vck1iYXJcIikuc3R5bGUud2lkdGggPSAocGwuQVBDVVIgLyBwbC5BUE1BWCAqIG1heHdpZHRoKSArIFwiJVwiOyBcclxuXHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbEJhdHRlcnlUeHRcIikuaW5uZXJIVE1MID0gcGwuRVBDVVIrXCIvXCIrcGwuRVBNQVg7XHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbEJhdHRlcnlNYmFyXCIpLnN0eWxlLndpZHRoID0gKHBsLkVQQ1VSIC8gcGwuRVBNQVggKiBtYXh3aWR0aCkgKyBcIiVcIjsgXHJcblxyXG5cdFBsYXllclRlbXBVcGRhdGVVSShwbC5UUENVUiwgcGwuVFBNQVgpO1xyXG5cdFBsYXllckNQVVVwZGF0ZVVJKHBsLlBQQ1VSLCBwbC5QUE1BWCk7XHJcblxyXG5cclxuXHRmdW5jdGlvbiBQbGF5ZXJUZW1wVXBkYXRlVUkoVGVtcFBvaW50cywgTWF4UG9pbnRzKSB7XHJcblx0XHR2YXIgcixnLGI7XHJcblx0XHR2YXIgdGVtcFRleHREaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsVGVtcGVyYXR1cmVUeHRcIik7XHJcblx0XHR0ZW1wVGV4dERpdi5pbm5lckhUTUwgPSBwYXJzZUludChUZW1wUG9pbnRzLzEwKTtcclxuXHRcdFxyXG5cdFx0aWYgKFRlbXBQb2ludHMgPjI0MCl7XHJcblx0XHQvL1RSQU5TSVRJT04gV0hJVEUgVE8gQkxVRVxyXG5cdFx0XHRiID0gMjU1LSgoVGVtcFBvaW50cy85OTApKjI1NSk7XHJcblx0XHRcdGIgPSB0cnVuY2F0ZShiKTtcclxuXHRcdFx0ciA9IDI1NSA7XHJcblx0XHRcdGcgPSBiO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdC8vVFJBTlNJVElPTiBXSElURSBUTyBSRURcclxuXHRcdFx0ciA9IDI1NSAtICgoKFRlbXBQb2ludHMqIC0xKS85OTApKjI1NSk7XHJcblx0XHRcdHIgPSB0cnVuY2F0ZShyKTtcclxuXHRcdFx0ZyA9IHI7XHJcblx0XHRcdGIgPSAyNTU7XHJcblx0XHR9XHJcblx0XHR0ZW1wVGV4dERpdi5zdHlsZS5jb2xvciA9IFwicmdiKFwiICsgciArIFwiLFwiKyBnICtcIixcIisgYiArXCIpXCI7XHJcblx0fTtcclxuXHRcclxuXHRmdW5jdGlvbiBQbGF5ZXJDUFVVcGRhdGVVSShDUFVQb2ludHMsIE1heFBvaW50cykge1xyXG5cdFx0dmFyIGJhckhlaWdodCwgYmFyVG9wUG9zO1xyXG5cdFx0YmFySGVpZ2h0ID0gKChDUFVQb2ludHMgLyBNYXhQb2ludHMpICogMTAwKSAvIDEwMCAqIDEwODtcclxuXHRcdGJhclRvcFBvcyA9IDc2IC0gKCgoQ1BVUG9pbnRzIC8gTWF4UG9pbnRzKSAqIDEwMCkgLyAxMDAgKiA3Nik7XHJcblx0XHRcclxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxQcm9jZXNzb3JUeHRHaHpcIikuaW5uZXJIVE1MID0gKENQVVBvaW50cyAvIDEwMDApO1xyXG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbFByb2Nlc3Nvck1iYXJQZXJjXCIpLmlubmVySFRNTCA9IHBhcnNlSW50KChDUFVQb2ludHMgLyBNYXhQb2ludHMpICogMTAwKSArIFwiJVwiIDtcclxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxQcm9jZXNzb3JNYmFyXCIpLnN0eWxlLmhlaWdodCA9IGJhckhlaWdodCArIFwiJVwiO1xyXG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbFByb2Nlc3Nvck1iYXJcIikuc3R5bGUubWFyZ2luVG9wID0gYmFyVG9wUG9zICsgXCIlXCI7XHJcblx0fTtcclxuXHJcblx0Ly9CRUxPVyBJUyBUTyBUUlVOQ0FURSBUSEUgUkdCIFZBTFVFU1xyXG5cdGZ1bmN0aW9uIHRydW5jYXRlKHZhbHVlKXtcclxuXHQgICAgaWYgKHZhbHVlIDwgMCl7XHJcblx0ICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHZhbHVlKTtcclxuXHQgICAgfXtcclxuXHQgICAgXHRyZXR1cm4gTWF0aC5mbG9vcih2YWx1ZSk7XHJcblx0XHR9XHJcblx0fVx0XHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0U29ja0ljb25zKGludkxpbmssIHNvY2tMaW5rKXtcclxuXHR2YXIgaW52Q291bnQgPSBPYmplY3Qua2V5cyhpbnZMaW5rKS5sZW5ndGg7XHRcclxuXHR2YXIgc29ja0NvdW50ID0gT2JqZWN0LmtleXMoc29ja0xpbmspLmxlbmd0aDtcclxuXHJcblx0XHJcblx0Ly9cclxuXHRmb3IodmFyIGk9MDsgaTxpbnZDb3VudDsgaSsrKXtcclxuXHRcdGlmIChpbnZMaW5rW2ldLnNlbGVjdGVkID09IHRydWUpe1xyXG5cdFx0XHRpZihPYmplY3Qua2V5cyhpbnZMaW5rW2ldLml0ZW0pLmxlbmd0aCA9PSAwKXtcclxuXHRcdFx0XHRmb3IodmFyIGI9MDsgYjxzb2NrQ291bnQ7YisrKXtcclxuXHRcdFx0XHRcdGlmIChzb2NrTGlua1tiXS5zZWxlY3RlZCA9PSB0cnVlKXtcclxuXHRcdFx0XHRcdFx0dmFyIGRlc3RJRCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNvY2tMaW5rW2JdLnByZWZpeElEK1wiSWNvblwiKTtcclxuXHRcdFx0XHRcdFx0ZGVzdElELnNyYyA9IFwiXCI7XHJcblx0XHRcdFx0XHRcdC8vRElTQUJMRSBTVEFUVVMgSUNPTlxyXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzb2NrTGlua1tiXS5wcmVmaXhJRCtcIlN0YXR1c1wiKS5zdHlsZS5vcGFjaXR5PVwiMFwiO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHZhciBzb3VyY2VTUkMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnZMaW5rW2ldLnByZWZpeElEK1wiSWNvblwiKS5zcmM7XHJcblx0XHRcdFx0Zm9yKHZhciBiPTA7IGI8c29ja0NvdW50O2IrKyl7XHJcblx0XHRcdFx0XHRpZiAoc29ja0xpbmtbYl0uc2VsZWN0ZWQgPT0gdHJ1ZSl7XHJcblx0XHRcdFx0XHRcdHZhciBkZXN0SUQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzb2NrTGlua1tiXS5wcmVmaXhJRCtcIkljb25cIik7XHJcblx0XHRcdFx0XHRcdGRlc3RJRC5zcmMgPSBzb3VyY2VTUkM7XHJcblx0XHRcdFx0XHRcdC8vRElTQUJMRSBTVEFUVVMgSUNPTlxyXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzb2NrTGlua1tiXS5wcmVmaXhJRCtcIlN0YXR1c1wiKS5zdHlsZS5vcGFjaXR5PVwiMFwiO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdH1cdFxyXG5cclxuXHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0U29ja0ljb25zKGludkxpbmssIHNvY2tMaW5rKXtcclxuXHR2YXIgaW52Q291bnQgPSBPYmplY3Qua2V5cyhpbnZMaW5rKS5sZW5ndGg7XHRcclxuXHR2YXIgc29ja0NvdW50ID0gT2JqZWN0LmtleXMoc29ja0xpbmspLmxlbmd0aDtcclxuXHJcblx0XHJcblx0Ly9cclxuXHRmb3IodmFyIGk9MDsgaTxpbnZDb3VudDsgaSsrKXtcclxuXHRcdGlmIChpbnZMaW5rW2ldLnNlbGVjdGVkID09IHRydWUpe1xyXG5cdFx0XHRcdHZhciBzb3VyY2VTUkMgPSBcIi4vQVNTRVRTL1wiK2ludkxpbmtbaV0uZmlsZW5hbWU7XHJcblx0XHRcdFx0Zm9yKHZhciBiPTA7IGI8c29ja0NvdW50O2IrKyl7XHJcblx0XHRcdFx0XHRpZiAoc29ja0xpbmtbYl0uc2VsZWN0ZWQgPT0gdHJ1ZSl7XHJcblx0XHRcdFx0XHRcdHZhciBkZXN0SUQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzb2NrTGlua1tiXS5wcmVmaXhJRCtcIkljb25cIik7XHJcblx0XHRcdFx0XHRcdGRlc3RJRC5zcmMgPSBzb3VyY2VTUkM7XHJcblx0XHRcdFx0XHRcdC8vRElTQUJMRSBTVEFUVVMgSUNPTlxyXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzb2NrTGlua1tiXS5wcmVmaXhJRCtcIlN0YXR1c1wiKS5zdHlsZS5vcGFjaXR5PVwiMFwiO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxufVx0XHJcblxyXG5cclxuXHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHVwZGF0ZVByb2dyZXNzQmFycyhwbGF5ZXIsIGVuZW15LCBwcm9ncmVzcywgcGxheWVyRXF1aXBlZCwgZW5lbXlFcXVpcGVkKXtcclxuXHJcblx0dmFyIFBMU2xvdENvdW50PSBPYmplY3Qua2V5cyhwbGF5ZXJFcXVpcGVkKS5sZW5ndGg7XHRcclxuXHR2YXIgRU5TbG90Q291bnQ9IE9iamVjdC5rZXlzKGVuZW15RXF1aXBlZCkubGVuZ3RoO1x0XHJcblx0dmFyIHRpbWVMZWZ0O1xyXG5cdHZhciB3aWR0aFBlcmNlbnRhZ2U7XHJcblx0dmFyIHRlbXBlcmF0dXJlQmFsYW5jZVBvaW50ID0gMzcwOyBcclxuXHRcclxuXHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IFBMU2xvdENvdW50OyBpKyspe1xyXG5cclxuXHRcdC8vY29uc29sZS5sb2coaSwgcHJvZ3Jlc3MpO1xyXG5cdFx0aWYocGxheWVyRXF1aXBlZFtpXS5pdGVtID09IHVuZGVmaW5lZCB8fCBwbGF5ZXJFcXVpcGVkW2ldLkNERW5kID09IDAgfHwgcGxheWVyRXF1aXBlZFtpXS5kaXNhYmxlID09IHRydWUpe1xyXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwbGF5ZXJFcXVpcGVkW2ldLnByZWZpeElEICsgXCJNYmFyXCIpLnN0eWxlLndpZHRoID0gMCArIFwiJVwiO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdFxyXG5cdFx0XHR0aW1lTGVmdCA9IHBsYXllckVxdWlwZWRbaV0uQ0RFbmQgLSBwcm9ncmVzcztcclxuXHRcdFx0d2lkdGhQZXJjZW50YWdlID0gKHRpbWVMZWZ0IC8gcGxheWVyRXF1aXBlZFtpXS5DRFRlbXApICogMTAwO1xyXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwbGF5ZXJFcXVpcGVkW2ldLnByZWZpeElEICsgXCJNYmFyXCIpLnN0eWxlLndpZHRoID0gd2lkdGhQZXJjZW50YWdlICsgXCIlXCI7IFxyXG5cdFx0XHRcclxuXHRcdFx0aWYocGxheWVyRXF1aXBlZFtpXS5DREVuZCA8IHByb2dyZXNzKXtcclxuXHRcdFx0cGxheWVyRXF1aXBlZFtpXS5hcHBseVN0YXRzID0gdHJ1ZTtcclxuXHRcdFx0cGxheWVyRXF1aXBlZFtpXS5DRFRlbXAgPSBwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uQ0RQTCArIChwbGF5ZXJFcXVpcGVkW2ldLml0ZW0uQ0RQTCAqICgoKCh0ZW1wZXJhdHVyZUJhbGFuY2VQb2ludCAtIHBsYXllci5UUENVUikgKiAtMSkvMikvMTAwMCkpO1xyXG5cdFx0XHRwbGF5ZXJFcXVpcGVkW2ldLkNERW5kID0gcHJvZ3Jlc3MgKyBwbGF5ZXJFcXVpcGVkW2ldLkNEVGVtcDtcclxuXHRcdFx0XHJcblx0XHRcdC8vY29uc29sZS5sb2cocGxheWVyRXF1aXBlZFtpXS5DREVuZCwgcHJvZ3Jlc3MpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBFTlNsb3RDb3VudDsgaSsrKXtcclxuXHJcblx0XHQvL2NvbnNvbGUubG9nKGksIHByb2dyZXNzKTtcclxuXHRcdGlmKGVuZW15RXF1aXBlZFtpXS5pdGVtID09IHVuZGVmaW5lZCB8fCBlbmVteUVxdWlwZWRbaV0uQ0RFbmQgPT0gMCB8fCBlbmVteUVxdWlwZWRbaV0uZGlzYWJsZSA9PSB0cnVlKXtcclxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZW5lbXlFcXVpcGVkW2ldLnByZWZpeElEICsgXCJNYmFyXCIpLnN0eWxlLndpZHRoID0gMCArIFwiJVwiO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdFxyXG5cdFx0XHR0aW1lTGVmdCA9IGVuZW15RXF1aXBlZFtpXS5DREVuZCAtIHByb2dyZXNzO1xyXG5cdFx0XHR3aWR0aFBlcmNlbnRhZ2UgPSAodGltZUxlZnQgLyBlbmVteUVxdWlwZWRbaV0uQ0RUZW1wKSAqIDEwMDtcclxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZW5lbXlFcXVpcGVkW2ldLnByZWZpeElEICsgXCJNYmFyXCIpLnN0eWxlLndpZHRoID0gd2lkdGhQZXJjZW50YWdlICsgXCIlXCI7IFxyXG5cdFx0XHRcclxuXHRcdFx0aWYoZW5lbXlFcXVpcGVkW2ldLkNERW5kIDwgcHJvZ3Jlc3Mpe1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRlbmVteUVxdWlwZWRbaV0uYXBwbHlTdGF0cyA9IHRydWU7XHJcblxyXG5cdFx0XHRlbmVteUVxdWlwZWRbaV0uQ0RUZW1wID0gZW5lbXlFcXVpcGVkW2ldLml0ZW0uQ0RQTCArIChlbmVteUVxdWlwZWRbaV0uaXRlbS5DRFBMICogKCgoKHRlbXBlcmF0dXJlQmFsYW5jZVBvaW50IC0gZW5lbXkuVFBDVVIpICogLTEpLzIpLzEwMDApKTtcclxuXHRcdFx0ZW5lbXlFcXVpcGVkW2ldLkNERW5kID0gcHJvZ3Jlc3MgKyBlbmVteUVxdWlwZWRbaV0uQ0RUZW1wO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly9jb25zb2xlLmxvZyhlbmVteUVxdWlwZWRbaV0uQ0RFbmQsIHByb2dyZXNzKTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHR9XHJcblxyXG5cdH1cdFxyXG5cclxuLypcdGZvcih2YXIgaSA9IDA7IGkgPCBFTlNsb3RDb3VudDsgaSsrKXtcclxuXHRcdC8vY29uc29sZS5sb2coaSwgcHJvZ3Jlc3MpO1xyXG5cdFx0aWYoZW5lbXlFcXVpcGVkW2ldLml0ZW0gPT0gdW5kZWZpbmVkIHx8IGVuZW15RXF1aXBlZFtpXS5DREVuZCA9PSAwKXtcclxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZW5lbXlFcXVpcGVkW2ldLnByZWZpeElEICsgXCJNYmFyXCIpLnN0eWxlLndpZHRoID0gMCArIFwiJVwiO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHRpbWVMZWZ0ID0gZW5lbXlFcXVpcGVkW2ldLkNERW5kIC0gcHJvZ3Jlc3M7XHJcblx0XHRcdHdpZHRoUGVyY2VudGFnZSA9ICh0aW1lTGVmdCAvIGVuZW15RXF1aXBlZFtpXS5pdGVtLkNEUEwpICogMTAwO1xyXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbmVteUVxdWlwZWRbaV0ucHJlZml4SUQgKyBcIk1iYXJcIikuc3R5bGUud2lkdGggPSB3aWR0aFBlcmNlbnRhZ2UgKyBcIiVcIjsgXHJcblx0XHR9XHJcblx0XHRpZihlbmVteUVxdWlwZWRbaV0uQ0RFbmQgPCBwcm9ncmVzcyl7XHJcblx0XHRcdGVuZW15RXF1aXBlZFtpXS5hcHBseVN0YXRzID0gdHJ1ZTtcclxuXHJcblx0XHRcdC8vZW5lbXlFcXVpcGVkW2ldLkNERW5kID0gcHJvZ3Jlc3MgKyBlbmVteUVxdWlwZWRbaV0uaXRlbS5DRFBMO1xyXG5cdFx0XHQvL2NvbnNvbGUubG9nKGVuZW15RXF1aXBlZFtpXS5DREVuZCwgcHJvZ3Jlc3MpO1xyXG5cdFx0fVxyXG5cdH0qL1xyXG59XHRcclxuXHJcblxyXG4iLCJtb2R1bGUuZXhwb3J0cz0ndXNlIHN0cmljdCdcclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcbnsvLzBcclxuXCJpbnZOclwiOjAsXHJcblwic29ja05yXCI6MCxcclxufSxcclxuey8vMVxyXG5cImludk5yXCI6MCxcclxuXCJzb2NrTnJcIjowLFxyXG59LFxyXG57Ly8yXHJcblwiaW52TnJcIjowLFxyXG5cInNvY2tOclwiOjAsXHJcbn0sXHJcbnsvLzNcclxuXCJpbnZOclwiOjAsXHJcblwic29ja05yXCI6MCxcclxufSxcclxuey8vNFxyXG5cImludk5yXCI6MCxcclxuXCJzb2NrTnJcIjowLFxyXG59LFxyXG57Ly81XHJcblwiaW52TnJcIjowLFxyXG5cInNvY2tOclwiOjAsXHJcbn0sXHJcbnsvLzZcclxuXCJpbnZOclwiOjAsXHJcblwic29ja05yXCI6MCxcclxufSxcclxuey8vN1xyXG5cImludk5yXCI6MCxcclxuXCJzb2NrTnJcIjowLFxyXG59LFxyXG57Ly84XHJcblwiaW52TnJcIjowLFxyXG5cInNvY2tOclwiOjAsXHJcbn0sXHJcblxyXG5dIiwibW9kdWxlLmV4cG9ydHM9J3VzZSBzdHJpY3QnXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXCJFUFwiOltcclxuXCJFUFwiLFxyXG5cIkVQXCIsXHJcblwiRVBcIixcclxuXCJFUFwiLFxyXG5cIkVQXCIsXHJcblwiRVBcIixcclxuXCJFUFwiLFxyXG5cIkVQXCIsXHJcblwiVFBcIixcclxuXSxcclxuXCJBUFwiOltcclxuXCJBUFwiLFxyXG5cIkFQXCIsXHJcblwiQVBcIixcclxuXCJBUFwiLFxyXG5cIkFQXCIsXHJcblwiQVBcIixcclxuXCJBUFwiLFxyXG5cIkFQXCIsXHJcblwiVFBcIixcclxuXSxcclxuXCJUUFwiOltcclxuXCJFUFwiLFxyXG5cIkVQXCIsXHJcblwiRVBcIixcclxuXCJUUFwiLFxyXG5cIlRQXCIsXHJcblwiVFBcIixcclxuXCJUUFwiLFxyXG5cIlRQXCIsXHJcblwiVFBcIixcclxuXSxcclxuXCJTUFwiOltcclxuXCJTUFwiLFxyXG5cIlNQXCIsXHJcblwiU1BcIixcclxuXCJTUFwiLFxyXG5cIlNQXCIsXHJcblwiU1BcIixcclxuXCJTUFwiLFxyXG5cIlNQXCIsXHJcblwiVFBcIixcclxuXSxcclxuXCJBUEVOXCI6W1xyXG5cIkFQRU5cIixcclxuXCJBUEVOXCIsXHJcblwiQVBFTlwiLFxyXG5cIkFQRU5cIixcclxuXCJBUEVOXCIsXHJcblwiQVBFTlwiLFxyXG5cIkFQRU5cIixcclxuXCJBUEVOXCIsXHJcblwiVFBcIixcclxuXSxcclxuXCJFUEFQXCI6W1xyXG5cIkVQXCIsXHJcblwiRVBcIixcclxuXCJFUFwiLFxyXG5cIkVQXCIsXHJcblwiQVBcIixcclxuXCJBUFwiLFxyXG5cIkFQXCIsXHJcblwiQVBcIixcclxuXCJUUFwiLFxyXG5dLFxyXG5cIkVQU1BcIjpbXHJcblwiRVBcIixcclxuXCJFUFwiLFxyXG5cIkVQXCIsXHJcblwiRVBcIixcclxuXCJTUFwiLFxyXG5cIlNQXCIsXHJcblwiU1BcIixcclxuXCJTUFwiLFxyXG5cIlRQXCIsXHJcbl0sXHJcblwiRVBBUEVOXCI6W1xyXG5cIkVQXCIsXHJcblwiRVBcIixcclxuXCJFUFwiLFxyXG5cIkVQXCIsXHJcblwiQVBFTlwiLFxyXG5cIkFQRU5cIixcclxuXCJBUEVOXCIsXHJcblwiQVBFTlwiLFxyXG5cIlRQXCIsXHJcbl0sXHJcblwiQVBFUFwiOltcclxuXCJFUFwiLFxyXG5cIkVQXCIsXHJcblwiRVBcIixcclxuXCJBUFwiLFxyXG5cIkFQXCIsXHJcblwiQVBcIixcclxuXCJBUFwiLFxyXG5cIkFQXCIsXHJcblwiVFBcIixcclxuXSxcclxuXCJBUFNQXCI6W1xyXG5cIlNQXCIsXHJcblwiU1BcIixcclxuXCJTUFwiLFxyXG5cIkFQXCIsXHJcblwiQVBcIixcclxuXCJBUFwiLFxyXG5cIkFQXCIsXHJcblwiQVBcIixcclxuXCJUUFwiLFxyXG5dLFxyXG5cIkFQQVBFTlwiOltcclxuXCJBUEVOXCIsXHJcblwiQVBFTlwiLFxyXG5cIkFQRU5cIixcclxuXCJBUFwiLFxyXG5cIkFQXCIsXHJcblwiQVBcIixcclxuXCJBUFwiLFxyXG5cIkFQXCIsXHJcblwiVFBcIixcclxuXSxcclxuXCJTUEVQXCI6W1xyXG5cIkVQXCIsXHJcblwiRVBcIixcclxuXCJFUFwiLFxyXG5cIlNQXCIsXHJcblwiU1BcIixcclxuXCJTUFwiLFxyXG5cIlNQXCIsXHJcblwiU1BcIixcclxuXCJUUFwiLFxyXG5dLFxyXG5cIlNQQVBcIjpbXHJcblwiQVBcIixcclxuXCJBUFwiLFxyXG5cIkFQXCIsXHJcblwiU1BcIixcclxuXCJTUFwiLFxyXG5cIlNQXCIsXHJcblwiU1BcIixcclxuXCJTUFwiLFxyXG5cIlRQXCIsXHJcbl0sXHJcblwiU1BBUEVOXCI6W1xyXG5cIkFQRU5cIixcclxuXCJBUEVOXCIsXHJcblwiQVBFTlwiLFxyXG5cIlNQXCIsXHJcblwiU1BcIixcclxuXCJTUFwiLFxyXG5cIlNQXCIsXHJcblwiU1BcIixcclxuXCJUUFwiLFxyXG5dLFxyXG5cIkVQVFBcIjpbXHJcblwiRVBcIixcclxuXCJFUFwiLFxyXG5cIkVQXCIsXHJcblwiRVBcIixcclxuXCJFUFwiLFxyXG5cIkVQXCIsXHJcblwiVFBcIixcclxuXCJUUFwiLFxyXG5cIlRQXCIsXHJcbl0sXHJcblwiQVBUUFwiOltcclxuXCJBUFwiLFxyXG5cIkFQXCIsXHJcblwiQVBcIixcclxuXCJBUFwiLFxyXG5cIkFQXCIsXHJcblwiQVBcIixcclxuXCJUUFwiLFxyXG5cIlRQXCIsXHJcblwiVFBcIixcclxuXSxcclxuXCJTUFRQXCI6W1xyXG5cIlNQXCIsXHJcblwiU1BcIixcclxuXCJTUFwiLFxyXG5cIlNQXCIsXHJcblwiU1BcIixcclxuXCJTUFwiLFxyXG5cIlRQXCIsXHJcblwiVFBcIixcclxuXCJUUFwiLFxyXG5dLFxyXG5cIkFQRU5FUFwiOltcclxuXCJFUFwiLFxyXG5cIkVQXCIsXHJcblwiRVBcIixcclxuXCJBUEVOXCIsXHJcblwiQVBFTlwiLFxyXG5cIkFQRU5cIixcclxuXCJBUEVOXCIsXHJcblwiQVBFTlwiLFxyXG5cIlRQXCIsXHJcbl0sXHJcblwiQVBFTkFQXCI6W1xyXG5cIkFQXCIsXHJcblwiQVBcIixcclxuXCJBUFwiLFxyXG5cIkFQRU5cIixcclxuXCJBUEVOXCIsXHJcblwiQVBFTlwiLFxyXG5cIkFQRU5cIixcclxuXCJBUEVOXCIsXHJcblwiVFBcIixcclxuXSxcclxuXCJBUEVOVFBcIjpbXHJcblwiVFBcIixcclxuXCJUUFwiLFxyXG5cIlRQXCIsXHJcblwiQVBFTlwiLFxyXG5cIkFQRU5cIixcclxuXCJBUEVOXCIsXHJcblwiQVBFTlwiLFxyXG5cIkFQRU5cIixcclxuXCJUUFwiLFxyXG5dLFxyXG5cIkFQRU5TUFwiOltcclxuXCJTUFwiLFxyXG5cIlNQXCIsXHJcblwiU1BcIixcclxuXCJBUEVOXCIsXHJcblwiQVBFTlwiLFxyXG5cIkFQRU5cIixcclxuXCJBUEVOXCIsXHJcblwiQVBFTlwiLFxyXG5cIlRQXCIsXHJcbl0sXHJcblwiVFBFUFwiOltcclxuXCJFUFwiLFxyXG5cIkVQXCIsXHJcblwiRVBcIixcclxuXCJFUFwiLFxyXG5cIkVQXCIsXHJcblwiVFBcIixcclxuXCJUUFwiLFxyXG5cIlRQXCIsXHJcblwiVFBcIixcclxuXSxcclxuXCJUUEFQXCI6W1xyXG5cIkFQXCIsXHJcblwiQVBcIixcclxuXCJBUFwiLFxyXG5cIkFQXCIsXHJcblwiQVBcIixcclxuXCJUUFwiLFxyXG5cIlRQXCIsXHJcblwiVFBcIixcclxuXCJUUFwiLFxyXG5dLFxyXG5cIlRQU1BcIjpbXHJcblwiU1BcIixcclxuXCJTUFwiLFxyXG5cIlNQXCIsXHJcblwiU1BcIixcclxuXCJTUFwiLFxyXG5cIlRQXCIsXHJcblwiVFBcIixcclxuXCJUUFwiLFxyXG5cIlRQXCIsXHJcbl0sXHJcblwiVFBBUEVOXCI6W1xyXG5cIkFQRU5cIixcclxuXCJBUEVOXCIsXHJcblwiQVBFTlwiLFxyXG5cIkFQRU5cIixcclxuXCJBUEVOXCIsXHJcblwiVFBcIixcclxuXCJUUFwiLFxyXG5cIlRQXCIsXHJcblwiVFBcIixcclxuXSxcclxuXHJcblxyXG59IiwibW9kdWxlLmV4cG9ydHM9J3VzZSBzdHJpY3QnXHJcbm1vZHVsZS5leHBvcnRzID0gW1xyXG4vL3t9LFxyXG57Ly8yXHJcblwibmFtZVwiOlwiQmF0dGVyeVwiLFxyXG5cImRlc2NyaXB0aW9uXCI6XCJSZXBsZW5pc2hlcyB5b3VyIEVuZXJneSBQb2ludHNcIixcclxuXCJmaWxlbmFtZVwiOlwiYV9iYXR0ZXJ5LnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQ0RcIixcclxuXCJQUFBMXCI6MTcsXHJcblwiRVBQTFwiOjYwLFxyXG5cIkNEUExcIjo0MDAwLFxyXG5cIkNBVFwiOlwiRVBcIixcclxuXCJVUEdSQURFU1wiOntcIkVQUExcIjoxLjUsfSxcclxuXCJVUEdSQURFTFZMXCI6NSxcclxuXCJRVUFMSVRJRVNcIjp7fSxcclxuXCJRVUFMSVRZTFZMXCI6NCxcclxufSxcclxuey8vN1xyXG5cIm5hbWVcIjpcIkNvb2xpbmcgRmFuXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIlVzZSBhIENvb2xpbmcgRmFuIHRvIHJlZHVjZSB5b3VyIFRlbXBlcmF0dXJlIFBvaW50c1wiLFxyXG5cImZpbGVuYW1lXCI6XCJhX2Nvb2xpbmdGYW4uc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjo1LFxyXG5cIkVQUExcIjotMjUsXHJcblwiQ0RQTFwiOjMwMDAsXHJcblwiVFBQTFwiOi0xMyxcclxuXCJDQVRcIjpcIlRQXCIsXHJcblwiVVBHUkFERVNcIjp7XCJDRFBMXCI6MS40LFwiVFBQTFwiOjEuNCx9LFxyXG5cIlVQR1JBREVMVkxcIjo4LFxyXG5cIlFVQUxJVElFU1wiOnt9LFxyXG5cIlFVQUxJVFlMVkxcIjoxLFxyXG59LFxyXG57Ly85XHJcblwibmFtZVwiOlwiTGFzZXJcIixcclxuXCJkZXNjcmlwdGlvblwiOlwiQXR0YWNrcyB0aGUgZW5lbXkgd2l0aCBhIExhc2VyXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfbGFzZXIuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjozMCxcclxuXCJFUFBMXCI6LTMwLFxyXG5cIkNEUExcIjoxNTAwLFxyXG5cIlRQUExcIjozLFxyXG5cIlNQRU5cIjo0MCxcclxuXCJBUEVOXCI6LTQwLFxyXG5cIlRQRU5cIjozMCxcclxuXCJDQVRcIjpcIkFQRU5cIixcclxuXCJVUEdSQURFU1wiOntcIkNEUExcIjoxLjQsfSxcclxuXCJVUEdSQURFTFZMXCI6NCxcclxuXCJRVUFMSVRJRVNcIjp7fSxcclxuXCJRVUFMSVRZTFZMXCI6MSxcclxufSxcclxuXHJcbnsvLzEzXHJcblwibmFtZVwiOlwiUmVwYWlyIERyb25lXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIlJlcGxlbmlzaGVzIHlvdXIgQXJtb3IgUG9pbnRzXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfbmFub2JvdEJsdWVQb3NpdGl2ZS5zdmdcIixcclxuXCJDRG9yQU9cIjpcIkNEXCIsXHJcblwiQVBQTFwiOjQwLFxyXG5cIlBQUExcIjozMCxcclxuXCJFUFBMXCI6LTUsXHJcblwiQ0RQTFwiOjMwMDAsXHJcblwiQ0FUXCI6XCJBUFwiLFxyXG5cIlVQR1JBREVTXCI6e1wiQVBQTFwiOjEuMix9LFxyXG5cIlVQR1JBREVMVkxcIjoyLFxyXG5cIlFVQUxJVElFU1wiOnt9LFxyXG5cIlFVQUxJVFlMVkxcIjo1LFxyXG59LFxyXG5cclxuey8vMjFcclxuXCJuYW1lXCI6XCJTaGllbGRcIixcclxuXCJkZXNjcmlwdGlvblwiOlwiUmVwbGVuaXNoZXMgeW91ciBTaGllbGQgUG9pbnRzXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfc2hpZWxkLnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQ0RcIixcclxuXCJTUFBMXCI6NTAsXHJcblwiUFBQTFwiOjUsXHJcblwiRVBQTFwiOi0zMCxcclxuXCJDRFBMXCI6NDAwMCxcclxuXCJDQVRcIjpcIlNQXCIsXHJcblwiVVBHUkFERVNcIjp7fSxcclxuXCJVUEdSQURFTFZMXCI6MCxcclxuXCJRVUFMSVRJRVNcIjp7fSxcclxuXCJRVUFMSVRZTFZMXCI6MSxcclxufSxcclxuXHJcblxyXG5dO1xyXG4iLCJtb2R1bGUuZXhwb3J0cz0ndXNlIHN0cmljdCdcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFwibmFtZVwiOlwiRW5lbXlCYXN0YXJkXCIsXHJcblx0XCJMVkxcIjo2LFxyXG5cdFwiU1BNQVhcIjozMzIxLFxyXG5cdFwiU1BNSU5cIjowLFxyXG5cdFwiU1BDVVJcIjozMDAsXHJcblx0XCJBUE1BWFwiOjMxNTAsXHJcblx0XCJBUE1JTlwiOjAsXHJcblx0XCJBUENVUlwiOjI1MDAsXHJcblx0XCJFUE1BWFwiOjMwMDAsXHJcblx0XCJFUE1JTlwiOjAsXHJcblx0XCJFUENVUlwiOjI1MDAsXHJcblx0XCJQUE1BWFwiOjMzMixcclxuXHRcIlBQQ1VSXCI6MCxcclxuXHRcIlBQTUlOXCI6MCxcclxuXHRcIlRQTUFYXCI6OTkwLFxyXG5cdFwiVFBNSU5cIjotMzQwLFxyXG5cdFwiVFBDVVJcIjotMjUwLFxyXG5cdFwiQVBSRVNcIjoxMCxcclxuXHRcIlNQUkVTXCI6MTAsXHJcbn0iLCJtb2R1bGUuZXhwb3J0cz0ndXNlIHN0cmljdCdcclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcbnsvLzFcclxuXCJuYW1lXCI6XCJBcm1vciBFbmZvcmNtZW50XCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIlRlbXBvcmFyaWx5IGVuZm9yY2VzIHlvdXIgYXJtb3IgSW5jcmVhc2luZyB5b3VyIG1heGltdW0gQXJtb3IgUG9pbnRzXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfYXJtb3JFeHRlbmRlci5zdmdcIixcclxuXCJDRG9yQU9cIjpcIkFPXCIsXHJcblwiUFBQTFwiOjEwMCxcclxuXCJFUFBMXCI6LTI1LFxyXG5cIlNQRVhQXCI6LTIwLFxyXG5cIlRQRVhQXCI6MTUsXHJcblwiQVBFWFBcIjozMCxcclxuXCJQUEVYUFwiOi01LFxyXG5cIkVQRVhQXCI6LTE1LFxyXG5cIkNBVFwiOlwiQVBcIixcclxufSxcclxuey8vMlxyXG5cIm5hbWVcIjpcIkJhdHRlcnlcIixcclxuXCJkZXNjcmlwdGlvblwiOlwiUmVwbGVuaXNoZXMgeW91ciBFbmVyZ3kgUG9pbnRzXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfYmF0dGVyeS5zdmdcIixcclxuXCJDRG9yQU9cIjpcIkNEXCIsXHJcblwiUFBQTFwiOjE3LFxyXG5cIkVQUExcIjo2MCxcclxuXCJDRFBMXCI6NDAwMCxcclxuXCJDQVRcIjpcIkVOXCIsXHJcbn0sXHJcbnsvLzNcclxuXCJuYW1lXCI6XCJCYXR0ZXJ5IEJvb3N0ZXJcIixcclxuXCJkZXNjcmlwdGlvblwiOlwiUmVwbGVuaXNoZXMgeW91ciBFbmVyZ3kgUG9pbnRzXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfYmF0dGVyeUJvb3N0ZXIuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjo1MCxcclxuXCJFUFBMXCI6NDAwLFxyXG5cIkNEUExcIjoxNTAwMCxcclxuXCJUUFBMXCI6MixcclxuXCJEVFBMXCI6NDAwMCxcclxuXCJDQVRcIjpcIkVOXCIsXHJcbn0sXHJcbnsvLzRcclxuXCJuYW1lXCI6XCJCYXR0ZXJ5IEV4dGVuZGVyXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIlRlbXBvcmFyaWx5IGV4dGVuZHMgdGhlIG1heGl1bSBjYXBhY2l0eSBvZiB5b3VyIEVuZXJneSBQb2ludHNcIixcclxuXCJmaWxlbmFtZVwiOlwiYV9iYXR0ZXJ5RXh0ZW5zaW9uLnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQU9cIixcclxuXCJQUFBMXCI6MTUsXHJcblwiRVBQTFwiOi01MCxcclxuXCJUUEVYUFwiOjMwLFxyXG5cIkVQRVhQXCI6NDAsXHJcblwiQ0FUXCI6XCJFTkVYUFwiLFxyXG59LFxyXG57Ly81XHJcblwibmFtZVwiOlwiTWluaWd1blwiLFxyXG5cImRlc2NyaXB0aW9uXCI6XCJBdHRhY2tzIHRoZSBlbmVteSB3aXRoIGEgTWluaWd1blwiLFxyXG5cImZpbGVuYW1lXCI6XCJhX2J1bGxldC5zdmdcIixcclxuXCJDRG9yQU9cIjpcIkNEXCIsXHJcblwiUFBQTFwiOjEwLFxyXG5cIkVQUExcIjotMTAsXHJcblwiQ0RQTFwiOjI1MDAsXHJcblwiVFBQTFwiOjEsXHJcblwiU1BFTlwiOjIwLFxyXG5cIkFQRU5cIjotMjAsXHJcblwiVFBFTlwiOjEsXHJcblwiQ0FUXCI6XCJBUEVOXCIsXHJcbn0sXHJcbnsvLzZcclxuXCJuYW1lXCI6XCJDbGFtcFwiLFxyXG5cImRlc2NyaXB0aW9uXCI6XCJBdHRhY2tzIHRoZSBlbmVteSB3aXRoIGEgQ2xhbXBcIixcclxuXCJmaWxlbmFtZVwiOlwiYV9jbGFtcC5zdmdcIixcclxuXCJDRG9yQU9cIjpcIkNEXCIsXHJcblwiUFBQTFwiOjUsXHJcblwiRVBQTFwiOi00MCxcclxuXCJDRFBMXCI6MjUwMCxcclxuXCJTUEVOXCI6MTAsXHJcblwiQVBFTlwiOi01MCxcclxuXCJDQVRcIjpcIkFQRU5cIixcclxufSxcclxuey8vN1xyXG5cIm5hbWVcIjpcIkNvb2xpbmcgRmFuXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIlVzZSBhIENvb2xpbmcgRmFuIHRvIHJlZHVjZSB5b3VyIFRlbXBlcmF0dXJlIFBvaW50c1wiLFxyXG5cImZpbGVuYW1lXCI6XCJhX2Nvb2xpbmdGYW4uc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjo1LFxyXG5cIkVQUExcIjotMjUsXHJcblwiQ0RQTFwiOjMwMDAsXHJcblwiVFBQTFwiOi0xMyxcclxuXCJDQVRcIjpcIlRQXCIsXHJcbn0sXHJcbnsvLzhcclxuXCJuYW1lXCI6XCJMaXF1aWQgQ29vbGluZ1wiLFxyXG5cImRlc2NyaXB0aW9uXCI6XCJ1c2UgTGlxdWlkIENvb2xpbmcgdG8gcmVkdWNlIHlvdXIgVGVtcGVyYXR1cmUgUG9pbnRzXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfY29vbGluZ0xpcXVpZC5zdmdcIixcclxuXCJDRG9yQU9cIjpcIkNEXCIsXHJcblwiUFBQTFwiOjUsXHJcblwiRVBQTFwiOi00MCxcclxuXCJDRFBMXCI6MzAwMCxcclxuXCJUUFBMXCI6LTMwLFxyXG5cIkNBVFwiOlwiVFBcIixcclxufSxcclxuey8vOVxyXG5cIm5hbWVcIjpcIkxhc2VyXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIkF0dGFja3MgdGhlIGVuZW15IHdpdGggYSBMYXNlclwiLFxyXG5cImZpbGVuYW1lXCI6XCJhX2xhc2VyLnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQ0RcIixcclxuXCJQUFBMXCI6MzAsXHJcblwiRVBQTFwiOi0zMCxcclxuXCJDRFBMXCI6MTUwMCxcclxuXCJUUFBMXCI6MyxcclxuXCJTUEVOXCI6NDAsXHJcblwiQVBFTlwiOi00MCxcclxuXCJUUEVOXCI6NixcclxuXCJDQVRcIjpcIkFQRU5cIixcclxufSxcclxuey8vMTBcclxuXCJuYW1lXCI6XCJFbGVjdG9jdXRlXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIkF0dGFja3MgdGhlIGVuZW15IGJ5IEVsZWN0cm9jdXRpb24uXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfbGlnaHRuaW5nLnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQ0RcIixcclxuXCJQUFBMXCI6NjAsXHJcblwiRVBQTFwiOi02MCxcclxuXCJDRFBMXCI6NjAwMCxcclxuXCJUUFBMXCI6NyxcclxuXCJEVFBMXCI6MTAwMCxcclxuXCJEVExPQ0tQTFwiOjYwMDAsXHJcblwiU1BFTlwiOjcwLFxyXG5cIkFQRU5cIjotNjAsXHJcblwiVFBFTlwiOjE1LFxyXG5cIkNBVFwiOlwiQVBFTlwiLFxyXG59LFxyXG57Ly8xMVxyXG5cIm5hbWVcIjpcIk1pY3Jvd2F2ZVwiLFxyXG5cImRlc2NyaXB0aW9uXCI6XCJBdHRhY2tzIHRoZSBlbmVteSB3aXRoIE1pY3Jvd2F2ZXNcIixcclxuXCJmaWxlbmFtZVwiOlwiYV9taWNyb3dhdmUuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjo2MCxcclxuXCJFUFBMXCI6LTYwLFxyXG5cIkNEUExcIjo2MDAwLFxyXG5cIlRQUExcIjo3LFxyXG5cIkRUUExcIjoxMDAwLFxyXG5cIkRUTE9DS1BMXCI6NjAwMCxcclxuXCJTUEVOXCI6NzAsXHJcblwiQVBFTlwiOi0xMDAsXHJcblwiVFBFTlwiOjE4LFxyXG5cIkRURU5cIjozMDAwLFxyXG5cIkNBVFwiOlwiQVBFTlwiLFxyXG59LFxyXG57Ly8xMlxyXG5cIm5hbWVcIjpcIlNjb3V0IERyb25lXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIlVzZSBhIFNjb3V0IERyb25lIHRvIGV4dHJhY3QgaW5mb3JtYXRpb24gZnJvbSB0aGUgRW5lbXlcIixcclxuXCJmaWxlbmFtZVwiOlwiYV9uYW5vYm90Qmx1ZU5lZ2F0aXZlLnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQ0RcIixcclxuXCJQUFBMXCI6MzAsXHJcblwiRVBQTFwiOi01LFxyXG5cIkNEUExcIjozMDAwLFxyXG5cIkNBVFwiOlwiU1BZXCIsXHJcbn0sXHJcbnsvLzEzXHJcblwibmFtZVwiOlwiUmVwYWlyIERyb25lXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIlJlcGxlbmlzaGVzIHlvdXIgQXJtb3IgUG9pbnRzXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfbmFub2JvdEJsdWVQb3NpdGl2ZS5zdmdcIixcclxuXCJDRG9yQU9cIjpcIkNEXCIsXHJcblwiQVBQTFwiOjQwLFxyXG5cIlBQUExcIjozMCxcclxuXCJFUFBMXCI6LTUsXHJcblwiQ0RQTFwiOjMwMDAsXHJcblwiQ0FUXCI6XCJBUFwiLFxyXG59LFxyXG57Ly8xNFxyXG5cIm5hbWVcIjpcIlNhYm90YWdlIERyb25lXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIlNhYm90YWdlIERyb25lcyBjYW4gSGFjayB0aGUgRW5lbXkncyBDUFVcIixcclxuXCJmaWxlbmFtZVwiOlwiYV9uYW5vYm90UmVkTmVnYXRpdmUuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjozMCxcclxuXCJFUFBMXCI6LTUsXHJcblwiQ0RQTFwiOjMwMDAsXHJcblwiRVBFTlwiOi00MCxcclxuXCJUUEVOXCI6MTAsXHJcblwiQ0FUXCI6XCJFUEVOXCIsXHJcbn0sXHJcbnsvLzE1XHJcblwibmFtZVwiOlwiQXR0YWNrIERyb25lXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIkF0dGFja3MgdGhlIGVuZW15IHdpdGggYXR0YWNrIGRyb25lc1wiLFxyXG5cImZpbGVuYW1lXCI6XCJhX25hbm9ib3RSZWRQb3NpdGl2ZS5zdmdcIixcclxuXCJDRG9yQU9cIjpcIkNEXCIsXHJcblwiUFBQTFwiOjMwLFxyXG5cIkVQUExcIjotNSxcclxuXCJDRFBMXCI6MzAwMCxcclxuXCJTUEVOXCI6NDAsXHJcblwiQVBFTlwiOi02MCxcclxuXCJUUEVOXCI6MixcclxuXCJDQVRcIjpcIkFQRU5cIixcclxufSxcclxuey8vMTZcclxuXCJuYW1lXCI6XCJNaW5pIE51a2VcIixcclxuXCJkZXNjcmlwdGlvblwiOlwiQXR0YWNrcyB0aGUgZW5lbXkgd2l0aCBhIG51Y2xlYXIgd2FyaGVhZFwiLFxyXG5cImZpbGVuYW1lXCI6XCJhX251a2Uuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjo2MCxcclxuXCJFUFBMXCI6LTYwLFxyXG5cIkNEUExcIjoxMjAwMCxcclxuXCJUUFBMXCI6MTUsXHJcblwiRFRQTFwiOjIwMDAsXHJcblwiRFRMT0NLUExcIjo4MDAwLFxyXG5cIlNQRU5cIjo3MCxcclxuXCJBUEVOXCI6LTIzMCxcclxuXCJUUEVOXCI6NTAsXHJcblwiQ0FUXCI6XCJBUEVOXCIsXHJcbn0sXHJcbnsvLzE3XHJcblwibmFtZVwiOlwiQ1BVIENhY2hlclwiLFxyXG5cImRlc2NyaXB0aW9uXCI6XCJDYWNoZXMgeW91ciBDUFUgZnJlZWluZyB1cCBTcGFjZVwiLFxyXG5cImZpbGVuYW1lXCI6XCJhX3Byb2Nlc3NvckJvb3N0ZXIuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjotNDAwLFxyXG5cIkVQUExcIjotNTAsXHJcblwiQ0RQTFwiOjE1MDAwLFxyXG5cIlRQUExcIjo1LFxyXG5cIkRUUExcIjo0MDAwLFxyXG5cIkNBVFwiOlwiUFBcIixcclxufSxcclxuey8vMThcclxuXCJuYW1lXCI6XCJDUFUgQ29tcHJlc3NvclwiLFxyXG5cImRlc2NyaXB0aW9uXCI6XCJDb21wcmVzc2VzIHlvdXIgcHJvY2Vzc2VzIGdyYW50aW5nIGFkZGl0aW9uYWwgUHJvY2Vzc2luZyBQb2ludHNcIixcclxuXCJmaWxlbmFtZVwiOlwiYV9wcm9jZXNzb3JFeHRlbnNpb24uc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJBT1wiLFxyXG5cIlBQUExcIjo1MCxcclxuXCJFUFBMXCI6LTQwLFxyXG5cIlRQUExcIjoxNSxcclxuXCJUUEVYUFwiOjMwLFxyXG5cIlBQRVhQXCI6NDAsXHJcblwiRVBFWFBcIjotNDAsXHJcblwiQ0FUXCI6XCJQUEVYUFwiLFxyXG59LFxyXG57Ly8xOVxyXG5cIm5hbWVcIjpcIkNQVSBPdmVyQ2xvY2tcIixcclxuXCJkZXNjcmlwdGlvblwiOlwiT3ZlcmNsb2NrcyB5b3VyIENQVSBncmFudGluZyBhZGRpdGlvbmFsIFByb2Nlc3NpbmcgUG9pbnRzXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfcHJvY2Vzc29yT3ZlcmNsb2NrLnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQU9cIixcclxuXCJQUFBMXCI6LTE1MCxcclxuXCJFUFBMXCI6LTQwLFxyXG5cIlRQUExcIjozMCxcclxuXCJUUEVYUFwiOjIwLFxyXG5cIkFQRVhQXCI6LTEwLFxyXG5cIlBQRVhQXCI6MzAsXHJcblwiRVBFWFBcIjotMjAsXHJcblwiQ0FUXCI6XCJQUEVYUFwiLFxyXG59LFxyXG57Ly8yMFxyXG5cIm5hbWVcIjpcIlJvY2tldCBMYXVuY2hlclwiLFxyXG5cImRlc2NyaXB0aW9uXCI6XCJBdHRhY2tzIHRoZSBlbmVteSB3aXRoIGEgUm9ja2V0IExhdW5jaGVyXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfcm9ja2V0LnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQ0RcIixcclxuXCJQUFBMXCI6MzAsXHJcblwiRVBQTFwiOi0zMCxcclxuXCJDRFBMXCI6MjUwMCxcclxuXCJUUFBMXCI6MixcclxuXCJTUEVOXCI6MjAsXHJcblwiQVBFTlwiOi00MCxcclxuXCJUUEVOXCI6MyxcclxuXCJDQVRcIjpcIkFQRU5cIixcclxufSxcclxuey8vMjFcclxuXCJuYW1lXCI6XCJTaGllbGRcIixcclxuXCJkZXNjcmlwdGlvblwiOlwiUmVwbGVuaXNoZXMgeW91ciBTaGllbGQgUG9pbnRzXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfc2hpZWxkLnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQ0RcIixcclxuXCJTUFBMXCI6NTAsXHJcblwiUFBQTFwiOjUsXHJcblwiRVBQTFwiOi0zMCxcclxuXCJDRFBMXCI6NDAwMCxcclxuXCJDQVRcIjpcIlNQXCIsXHJcbn0sXHJcbnsvLzIyXHJcblwibmFtZVwiOlwiU2hpZWxkIEV4dGVuZGVyXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIkV4dGVuZHMgdGhlIG1heGltdW0gY2FwYWNpdHkgb2YgeW91ciBTaGllbGQgUG9pbnRzXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfc2hpZWxkRXh0ZW5kZXIuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJBT1wiLFxyXG5cIlBQUExcIjoyNSxcclxuXCJFUFBMXCI6LTEwMCxcclxuXCJTUEVYUFwiOjMwLFxyXG5cIlRQRVhQXCI6MTUsXHJcblwiQVBFWFBcIjotMjAsXHJcblwiUFBFWFBcIjotMTUsXHJcblwiRVBFWFBcIjotNSxcclxuXCJDQVRcIjpcIlNQRVhQXCIsXHJcbn0sXHJcblxyXG5cclxuXTtcclxuIiwibW9kdWxlLmV4cG9ydHM9J3VzZSBzdHJpY3QnXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXCJpbnZCb29sXCI6ZmFsc2UsXHJcblwic29ja0Jvb2xcIjpmYWxzZSxcclxuXCJpbnZUb1Zpc3VhbEJlZ2luXCI6MCxcclxuXCJpbnZUb1Zpc3VhbEVuZFwiOjgsXHJcblwic2Nyb2xsRm9yd1wiOmZhbHNlLFxyXG5cInNjcm9sbEJhY2t3XCI6ZmFsc2UsXHJcblwic2Nyb2xsTWlkXCI6ZmFsc2UsXHJcblwiaW52ZW50b3J5Q291bnRcIjowLFxyXG59IiwibW9kdWxlLmV4cG9ydHM9J3VzZSBzdHJpY3QnXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXCJpbnZCb29sXCI6ZmFsc2UsXHJcblwic29ja0Jvb2xcIjpmYWxzZSxcclxuXCJpbnZUb1Zpc3VhbEJlZ2luXCI6MCxcclxuXCJpbnZUb1Zpc3VhbEVuZFwiOjgsXHJcblwic2Nyb2xsRm9yd1wiOmZhbHNlLFxyXG5cInNjcm9sbEJhY2t3XCI6ZmFsc2UsXHJcblwic2Nyb2xsTWlkXCI6ZmFsc2UsXHJcblwiaW52ZW50b3J5Q291bnRcIjowLFxyXG5cIkNBVFNcIjpbXSxcclxufSIsIm1vZHVsZS5leHBvcnRzPSd1c2Ugc3RyaWN0J1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXSIsIm1vZHVsZS5leHBvcnRzPSd1c2Ugc3RyaWN0J1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcblxyXG57Ly9kZWZhdWx0IHJhdGlvIGluZGljYXRvcnMgSFVEXHJcblwibmFtZVwiOlwic2l6ZSAxMDAlXCIsXHJcblwiV2lkdGh0b0hlaWdodEhVRFwiOjAuMzI4NTcxLFxyXG5cImhlaWdodFwiOjExNSxcclxuXCJ3aWR0aFwiOjM1MCxcclxuXCJ0ZXh0MTZcIjoxNixcclxuXCJ0ZXh0MjBcIjoyMCxcclxuXCJ0ZXh0MjVcIjoyNSxcclxuXCJ0ZXh0MzBcIjo0MCxcclxuXCJ0ZXh0NTBcIjo1MCxcclxufSxcclxuXSIsIm1vZHVsZS5leHBvcnRzPSd1c2Ugc3RyaWN0J1xyXG4vL0lURU1TIFRIQVQgQVJFIEVRVUlQRUQgSU4gVEhFIElOVkVOVE9SWSBCVVQgTk9UIENVUlJFTlRMWSBJTiBVU0VcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gW1xyXG57Ly8xXHJcblwicHJlZml4SURcIjpcInBsU2ludjAxXCIsXHJcblwiZXFwdE1vZHVsZXNJRFwiOjEsXHJcblwicGxheWVyaW52ZW50b3J5SURcIjoxLFxyXG5cInNlbGVjdGVkXCI6ZmFsc2UsXHJcblwiaXRlbVwiOnt9LFxyXG59LFxyXG57Ly8yXHJcblwicHJlZml4SURcIjpcInBsU2ludjAyXCIsXHJcblwiZXFwdE1vZHVsZXNJRFwiOjEsXHJcblwicGxheWVyaW52ZW50b3J5SURcIjoxLFxyXG5cInNlbGVjdGVkXCI6ZmFsc2UsXHJcblwiaXRlbVwiOnt9LFxyXG59LFxyXG57Ly8zXHJcblwicHJlZml4SURcIjpcInBsU2ludjAzXCIsXHJcblwiZXFwdE1vZHVsZXNJRFwiOjEsXHJcblwicGxheWVyaW52ZW50b3J5SURcIjoxLFxyXG5cInNlbGVjdGVkXCI6ZmFsc2UsXHJcblwiaXRlbVwiOnt9LFxyXG59LFxyXG57Ly80XHJcblwicHJlZml4SURcIjpcInBsU2ludjA0XCIsXHJcblwiZXFwdE1vZHVsZXNJRFwiOjEsXHJcblwicGxheWVyaW52ZW50b3J5SURcIjoxLFxyXG5cInNlbGVjdGVkXCI6ZmFsc2UsXHJcblwiaXRlbVwiOnt9LFxyXG59LFxyXG57Ly81XHJcblwicHJlZml4SURcIjpcInBsU2ludjA1XCIsXHJcblwiZXFwdE1vZHVsZXNJRFwiOjEsXHJcblwicGxheWVyaW52ZW50b3J5SURcIjoxLFxyXG5cInNlbGVjdGVkXCI6ZmFsc2UsXHJcblwiaXRlbVwiOnt9LFxyXG59LFxyXG57Ly82XHJcblwicHJlZml4SURcIjpcInBsU2ludjA2XCIsXHJcblwiZXFwdE1vZHVsZXNJRFwiOjEsXHJcblwicGxheWVyaW52ZW50b3J5SURcIjoxLFxyXG5cInNlbGVjdGVkXCI6ZmFsc2UsXHJcblwiaXRlbVwiOnt9LFxyXG59LFxyXG57Ly83XHJcblwicHJlZml4SURcIjpcInBsU2ludjA3XCIsXHJcblwiZXFwdE1vZHVsZXNJRFwiOjEsXHJcblwicGxheWVyaW52ZW50b3J5SURcIjoxLFxyXG5cInNlbGVjdGVkXCI6ZmFsc2UsXHJcblwiaXRlbVwiOnt9LFxyXG59LFxyXG57Ly84XHJcblwicHJlZml4SURcIjpcInBsU2ludjA4XCIsXHJcblwiZXFwdE1vZHVsZXNJRFwiOjEsXHJcblwicGxheWVyaW52ZW50b3J5SURcIjoxLFxyXG5cInNlbGVjdGVkXCI6ZmFsc2UsXHJcblwiaXRlbVwiOnt9LFxyXG59LFxyXG5dIiwibW9kdWxlLmV4cG9ydHM9J3VzZSBzdHJpY3QnXHJcbi8vSVRFTVMgVEhBVCBBUkUgRVFVSVBFRCBJTiBUSEUgSU5WRU5UT1JZIEJVVCBOT1QgQ1VSUkVOVExZIElOIFVTRVxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuey8vMVxyXG5cInByZWZpeElEXCI6XCJlblNpbnYwMVwiLFxyXG5cImVxcHRNb2R1bGVzSURcIjoxLFxyXG5cInBsYXllcmludmVudG9yeUlEXCI6MSxcclxuXCJzZWxlY3RlZFwiOmZhbHNlLFxyXG5cIml0ZW1cIjp7fSxcclxufSxcclxuey8vMlxyXG5cInByZWZpeElEXCI6XCJlblNpbnYwMlwiLFxyXG5cImVxcHRNb2R1bGVzSURcIjoxLFxyXG5cInBsYXllcmludmVudG9yeUlEXCI6MSxcclxuXCJzZWxlY3RlZFwiOmZhbHNlLFxyXG5cIml0ZW1cIjp7fSxcclxufSxcclxuey8vM1xyXG5cInByZWZpeElEXCI6XCJlblNpbnYwM1wiLFxyXG5cImVxcHRNb2R1bGVzSURcIjoxLFxyXG5cInBsYXllcmludmVudG9yeUlEXCI6MSxcclxuXCJzZWxlY3RlZFwiOmZhbHNlLFxyXG5cIml0ZW1cIjp7fSxcclxufSxcclxuey8vNFxyXG5cInByZWZpeElEXCI6XCJlblNpbnYwNFwiLFxyXG5cImVxcHRNb2R1bGVzSURcIjoxLFxyXG5cInBsYXllcmludmVudG9yeUlEXCI6MSxcclxuXCJzZWxlY3RlZFwiOmZhbHNlLFxyXG5cIml0ZW1cIjp7fSxcclxufSxcclxuey8vNVxyXG5cInByZWZpeElEXCI6XCJlblNpbnYwNVwiLFxyXG5cImVxcHRNb2R1bGVzSURcIjoxLFxyXG5cInBsYXllcmludmVudG9yeUlEXCI6MSxcclxuXCJzZWxlY3RlZFwiOmZhbHNlLFxyXG5cIml0ZW1cIjp7fSxcclxufSxcclxuey8vNlxyXG5cInByZWZpeElEXCI6XCJlblNpbnYwNlwiLFxyXG5cImVxcHRNb2R1bGVzSURcIjoxLFxyXG5cInBsYXllcmludmVudG9yeUlEXCI6MSxcclxuXCJzZWxlY3RlZFwiOmZhbHNlLFxyXG5cIml0ZW1cIjp7fSxcclxufSxcclxuey8vN1xyXG5cInByZWZpeElEXCI6XCJlblNpbnYwN1wiLFxyXG5cImVxcHRNb2R1bGVzSURcIjoxLFxyXG5cInBsYXllcmludmVudG9yeUlEXCI6MSxcclxuXCJzZWxlY3RlZFwiOmZhbHNlLFxyXG5cIml0ZW1cIjp7fSxcclxufSxcclxuey8vOFxyXG5cInByZWZpeElEXCI6XCJlblNpbnYwOFwiLFxyXG5cImVxcHRNb2R1bGVzSURcIjoxLFxyXG5cInBsYXllcmludmVudG9yeUlEXCI6MSxcclxuXCJzZWxlY3RlZFwiOmZhbHNlLFxyXG5cIml0ZW1cIjp7fSxcclxufSxcclxuXSIsIm1vZHVsZS5leHBvcnRzPSd1c2Ugc3RyaWN0J1xyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuey8vMVxyXG5cIm5hbWVcIjpcIkFybW9yIEVuZm9yY21lbnRcIixcclxuXCJkZXNjcmlwdGlvblwiOlwiVGVtcG9yYXJpbHkgZW5mb3JjZXMgeW91ciBhcm1vciBJbmNyZWFzaW5nIHlvdXIgbWF4aW11bSBBcm1vciBQb2ludHNcIixcclxuXCJmaWxlbmFtZVwiOlwiYV9hcm1vckV4dGVuZGVyLnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQU9cIixcclxuXCJQUFBMXCI6MTAwLFxyXG5cIkVQUExcIjotMjUsXHJcblwiU1BFWFBcIjotMjAsXHJcblwiVFBFWFBcIjoxNSxcclxuXCJBUEVYUFwiOjMwLFxyXG5cIlBQRVhQXCI6LTUsXHJcblwiRVBFWFBcIjotMTUsXHJcblwiQ0FUXCI6XCJBUFwiLFxyXG5cIlVQR1JBREVTXCI6e1wiQVBFWFBcIjoxLjgsfSxcclxuXCJVUEdSQURFTFZMXCI6OCxcclxuXCJRVUFMSVRJRVNcIjp7fSxcclxuXCJRVUFMSVRZTFZMXCI6NSxcclxufSxcclxuey8vMlxyXG5cIm5hbWVcIjpcIkJhdHRlcnlcIixcclxuXCJkZXNjcmlwdGlvblwiOlwiUmVwbGVuaXNoZXMgeW91ciBFbmVyZ3kgUG9pbnRzXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfYmF0dGVyeS5zdmdcIixcclxuXCJDRG9yQU9cIjpcIkNEXCIsXHJcblwiUFBQTFwiOjE3LFxyXG5cIkVQUExcIjo2MCxcclxuXCJDRFBMXCI6NDAwMCxcclxuXCJDQVRcIjpcIkVOXCIsXHJcblwiVVBHUkFERVNcIjp7XCJFUFBMXCI6MS41LH0sXHJcblwiVVBHUkFERUxWTFwiOjUsXHJcblwiUVVBTElUSUVTXCI6e30sXHJcblwiUVVBTElUWUxWTFwiOjQsXHJcbn0sXHJcbnsvLzNcclxuXCJuYW1lXCI6XCJCYXR0ZXJ5IEJvb3N0ZXJcIixcclxuXCJkZXNjcmlwdGlvblwiOlwiUmVwbGVuaXNoZXMgeW91ciBFbmVyZ3kgUG9pbnRzXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfYmF0dGVyeUJvb3N0ZXIuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjo1MCxcclxuXCJFUFBMXCI6NDAwLFxyXG5cIkNEUExcIjoxNTAwMCxcclxuXCJUUFBMXCI6MixcclxuXCJEVFBMXCI6NDAwMCxcclxuXCJDQVRcIjpcIkVOXCIsXHJcblwiVVBHUkFERVNcIjp7XCJDRFBMXCI6MS4xLH0sXHJcblwiVVBHUkFERUxWTFwiOjEsXHJcblwiUVVBTElUSUVTXCI6e30sXHJcblwiUVVBTElUWUxWTFwiOjEsXHJcbn0sXHJcbnsvLzRcclxuXCJuYW1lXCI6XCJCYXR0ZXJ5IEV4dGVuZGVyXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIlRlbXBvcmFyaWx5IGV4dGVuZHMgdGhlIG1heGl1bSBjYXBhY2l0eSBvZiB5b3VyIEVuZXJneSBQb2ludHNcIixcclxuXCJmaWxlbmFtZVwiOlwiYV9iYXR0ZXJ5RXh0ZW5zaW9uLnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQU9cIixcclxuXCJQUFBMXCI6MTUsXHJcblwiRVBQTFwiOi01MCxcclxuXCJUUEVYUFwiOjMwLFxyXG5cIkVQRVhQXCI6NDAsXHJcblwiQ0FUXCI6XCJFTkVYUFwiLFxyXG5cIlVQR1JBREVTXCI6e1wiRVBFWFBcIjoxLjEsfSxcclxuXCJVUEdSQURFTFZMXCI6MSxcclxuXCJRVUFMSVRJRVNcIjp7fSxcclxuXCJRVUFMSVRZTFZMXCI6MixcclxufSxcclxuey8vNVxyXG5cIm5hbWVcIjpcIk1pbmlndW5cIixcclxuXCJkZXNjcmlwdGlvblwiOlwiQXR0YWNrcyB0aGUgZW5lbXkgd2l0aCBhIE1pbmlndW5cIixcclxuXCJmaWxlbmFtZVwiOlwiYV9idWxsZXQuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjoxMCxcclxuXCJFUFBMXCI6LTEwLFxyXG5cIkNEUExcIjoyNTAwLFxyXG5cIlRQUExcIjoxLFxyXG5cIlNQRU5cIjoyMCxcclxuXCJBUEVOXCI6LTIwLFxyXG5cIlRQRU5cIjoxMCxcclxuXCJDQVRcIjpcIkFQRU5cIixcclxuXCJVUEdSQURFU1wiOntcIkFQRU5cIjoxLjcsfSxcclxuXCJVUEdSQURFTFZMXCI6NyxcclxuXCJRVUFMSVRJRVNcIjp7fSxcclxuXCJRVUFMSVRZTFZMXCI6MyxcclxufSxcclxuey8vNlxyXG5cIm5hbWVcIjpcIkNsYW1wXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIkF0dGFja3MgdGhlIGVuZW15IHdpdGggYSBDbGFtcFwiLFxyXG5cImZpbGVuYW1lXCI6XCJhX2NsYW1wLnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQ0RcIixcclxuXCJQUFBMXCI6NSxcclxuXCJFUFBMXCI6LTQwLFxyXG5cIkNEUExcIjoyNTAwLFxyXG5cIlNQRU5cIjoxMCxcclxuXCJBUEVOXCI6LTUwLFxyXG5cIkNBVFwiOlwiQVBFTlwiLFxyXG5cIlVQR1JBREVTXCI6e1wiQ0RQTFwiOjEuMyxcIkFQRU5cIjoxLjMsfSxcclxuXCJVUEdSQURFTFZMXCI6NixcclxuXCJRVUFMSVRJRVNcIjp7fSxcclxuXCJRVUFMSVRZTFZMXCI6NCxcclxufSxcclxuey8vN1xyXG5cIm5hbWVcIjpcIkNvb2xpbmcgRmFuXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIlVzZSBhIENvb2xpbmcgRmFuIHRvIHJlZHVjZSB5b3VyIFRlbXBlcmF0dXJlIFBvaW50c1wiLFxyXG5cImZpbGVuYW1lXCI6XCJhX2Nvb2xpbmdGYW4uc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjo1LFxyXG5cIkVQUExcIjotMjUsXHJcblwiQ0RQTFwiOjMwMDAsXHJcblwiVFBQTFwiOi0xMyxcclxuXCJDQVRcIjpcIlRQXCIsXHJcblwiVVBHUkFERVNcIjp7XCJDRFBMXCI6MS40LFwiVFBQTFwiOjEuNCx9LFxyXG5cIlVQR1JBREVMVkxcIjo4LFxyXG5cIlFVQUxJVElFU1wiOnt9LFxyXG5cIlFVQUxJVFlMVkxcIjoxLFxyXG59LFxyXG57Ly84XHJcblwibmFtZVwiOlwiTGlxdWlkIENvb2xpbmdcIixcclxuXCJkZXNjcmlwdGlvblwiOlwidXNlIExpcXVpZCBDb29saW5nIHRvIHJlZHVjZSB5b3VyIFRlbXBlcmF0dXJlIFBvaW50c1wiLFxyXG5cImZpbGVuYW1lXCI6XCJhX2Nvb2xpbmdMaXF1aWQuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjo1LFxyXG5cIkVQUExcIjotNDAsXHJcblwiQ0RQTFwiOjMwMDAsXHJcblwiVFBQTFwiOi0zMCxcclxuXCJDQVRcIjpcIlRQXCIsXHJcblwiVVBHUkFERVNcIjp7XCJDRFBMXCI6MS40LFwiVFBQTFwiOjEuNSx9LFxyXG5cIlVQR1JBREVMVkxcIjo5LFxyXG5cIlFVQUxJVElFU1wiOnt9LFxyXG5cIlFVQUxJVFlMVkxcIjozLFxyXG59LFxyXG57Ly85XHJcblwibmFtZVwiOlwiTGFzZXJcIixcclxuXCJkZXNjcmlwdGlvblwiOlwiQXR0YWNrcyB0aGUgZW5lbXkgd2l0aCBhIExhc2VyXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfbGFzZXIuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjozMCxcclxuXCJFUFBMXCI6LTMwLFxyXG5cIkNEUExcIjoxNTAwLFxyXG5cIlRQUExcIjozLFxyXG5cIlNQRU5cIjo0MCxcclxuXCJBUEVOXCI6LTQwLFxyXG5cIlRQRU5cIjozMCxcclxuXCJDQVRcIjpcIkFQRU5cIixcclxuXCJVUEdSQURFU1wiOntcIkNEUExcIjoxLjQsfSxcclxuXCJVUEdSQURFTFZMXCI6NCxcclxuXCJRVUFMSVRJRVNcIjp7fSxcclxuXCJRVUFMSVRZTFZMXCI6MSxcclxufSxcclxuey8vMTBcclxuXCJuYW1lXCI6XCJFbGVjdG9jdXRlXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIkF0dGFja3MgdGhlIGVuZW15IGJ5IEVsZWN0cm9jdXRpb24uXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfbGlnaHRuaW5nLnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQ0RcIixcclxuXCJQUFBMXCI6NjAsXHJcblwiRVBQTFwiOi02MCxcclxuXCJDRFBMXCI6NjAwMCxcclxuXCJUUFBMXCI6NyxcclxuXCJEVFBMXCI6MTAwMCxcclxuXCJEVExPQ0tQTFwiOjYwMDAsXHJcblwiU1BFTlwiOjcwLFxyXG5cIkFQRU5cIjotNjAsXHJcblwiVFBFTlwiOjEwMCxcclxuXCJDQVRcIjpcIkFQRU5cIixcclxuXCJVUEdSQURFU1wiOntcIkVQUExcIjoxLjQsXCJBUEVOXCI6MS41LH0sXHJcblwiVVBHUkFERUxWTFwiOjksXHJcblwiUVVBTElUSUVTXCI6e30sXHJcblwiUVVBTElUWUxWTFwiOjMsXHJcbn0sXHJcbnsvLzExXHJcblwibmFtZVwiOlwiTWljcm93YXZlXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIkF0dGFja3MgdGhlIGVuZW15IHdpdGggTWljcm93YXZlc1wiLFxyXG5cImZpbGVuYW1lXCI6XCJhX21pY3Jvd2F2ZS5zdmdcIixcclxuXCJDRG9yQU9cIjpcIkNEXCIsXHJcblwiUFBQTFwiOjYwLFxyXG5cIkVQUExcIjotNjAsXHJcblwiQ0RQTFwiOjYwMDAsXHJcblwiVFBQTFwiOjcsXHJcblwiRFRQTFwiOjEwMDAsXHJcblwiRFRMT0NLUExcIjo2MDAwLFxyXG5cIlNQRU5cIjo3MCxcclxuXCJBUEVOXCI6LTEwMCxcclxuXCJUUEVOXCI6MTUwLFxyXG5cIkRURU5cIjozMDAwLFxyXG5cIkNBVFwiOlwiQVBFTlwiLFxyXG5cIlVQR1JBREVTXCI6e30sXHJcblwiVVBHUkFERUxWTFwiOjAsXHJcblwiUVVBTElUSUVTXCI6e30sXHJcblwiUVVBTElUWUxWTFwiOjQsXHJcbn0sXHJcbnsvLzEyXHJcblwibmFtZVwiOlwiU2NvdXQgRHJvbmVcIixcclxuXCJkZXNjcmlwdGlvblwiOlwiVXNlIGEgU2NvdXQgRHJvbmUgdG8gZXh0cmFjdCBpbmZvcm1hdGlvbiBmcm9tIHRoZSBFbmVteVwiLFxyXG5cImZpbGVuYW1lXCI6XCJhX25hbm9ib3RCbHVlTmVnYXRpdmUuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjozMCxcclxuXCJFUFBMXCI6LTUsXHJcblwiQ0RQTFwiOjMwMDAsXHJcblwiQ0FUXCI6XCJTUFlcIixcclxuXCJVUEdSQURFU1wiOnt9LFxyXG5cIlVQR1JBREVMVkxcIjowLFxyXG5cIlFVQUxJVElFU1wiOnt9LFxyXG5cIlFVQUxJVFlMVkxcIjozLFxyXG59LFxyXG57Ly8xM1xyXG5cIm5hbWVcIjpcIlJlcGFpciBEcm9uZVwiLFxyXG5cImRlc2NyaXB0aW9uXCI6XCJSZXBsZW5pc2hlcyB5b3VyIEFybW9yIFBvaW50c1wiLFxyXG5cImZpbGVuYW1lXCI6XCJhX25hbm9ib3RCbHVlUG9zaXRpdmUuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIkFQUExcIjo0MCxcclxuXCJQUFBMXCI6MzAsXHJcblwiRVBQTFwiOi01LFxyXG5cIkNEUExcIjozMDAwLFxyXG5cIkNBVFwiOlwiQVBcIixcclxuXCJVUEdSQURFU1wiOntcIkFQUExcIjoxLjIsfSxcclxuXCJVUEdSQURFTFZMXCI6MixcclxuXCJRVUFMSVRJRVNcIjp7fSxcclxuXCJRVUFMSVRZTFZMXCI6NSxcclxufSxcclxuey8vMTRcclxuXCJuYW1lXCI6XCJTYWJvdGFnZSBEcm9uZVwiLFxyXG5cImRlc2NyaXB0aW9uXCI6XCJTYWJvdGFnZSBEcm9uZXMgY2FuIEhhY2sgdGhlIEVuZW15J3MgQ1BVXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfbmFub2JvdFJlZE5lZ2F0aXZlLnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQ0RcIixcclxuXCJQUFBMXCI6MzAsXHJcblwiRVBQTFwiOi01LFxyXG5cIkNEUExcIjozMDAwLFxyXG5cIkVQRU5cIjotNDAsXHJcblwiVFBFTlwiOjEwMCxcclxuXCJDQVRcIjpcIkVQRU5cIixcclxuXCJVUEdSQURFU1wiOntcIkNEUExcIjoxLjksfSxcclxuXCJVUEdSQURFTFZMXCI6OSxcclxuXCJRVUFMSVRJRVNcIjp7fSxcclxuXCJRVUFMSVRZTFZMXCI6MSxcclxufSxcclxuey8vMTVcclxuXCJuYW1lXCI6XCJBdHRhY2sgRHJvbmVcIixcclxuXCJkZXNjcmlwdGlvblwiOlwiQXR0YWNrcyB0aGUgZW5lbXkgd2l0aCBhdHRhY2sgZHJvbmVzXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfbmFub2JvdFJlZFBvc2l0aXZlLnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQ0RcIixcclxuXCJQUFBMXCI6NjAsXHJcblwiRVBQTFwiOi01LFxyXG5cIkNEUExcIjozMDAwLFxyXG5cIlNQRU5cIjo0MCxcclxuXCJBUEVOXCI6LTYwLFxyXG5cIlRQRU5cIjoxNTAsXHJcblwiQ0FUXCI6XCJBUEVOXCIsXHJcblwiVVBHUkFERVNcIjp7fSxcclxuXCJVUEdSQURFTFZMXCI6MCxcclxuXCJRVUFMSVRJRVNcIjp7fSxcclxuXCJRVUFMSVRZTFZMXCI6NCxcclxufSxcclxuey8vMTZcclxuXCJuYW1lXCI6XCJNaW5pIE51a2VcIixcclxuXCJkZXNjcmlwdGlvblwiOlwiQXR0YWNrcyB0aGUgZW5lbXkgd2l0aCBhIG51Y2xlYXIgd2FyaGVhZFwiLFxyXG5cImZpbGVuYW1lXCI6XCJhX251a2Uuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjo2MCxcclxuXCJFUFBMXCI6LTYwLFxyXG5cIkNEUExcIjoxMjAwMCxcclxuXCJUUFBMXCI6MTUsXHJcblwiRFRQTFwiOjIwMDAsXHJcblwiRFRMT0NLUExcIjo4MDAwLFxyXG5cIlNQRU5cIjo3MCxcclxuXCJBUEVOXCI6LTIzMCxcclxuXCJUUEVOXCI6MjUwLFxyXG5cIkNBVFwiOlwiQVBFTlwiLFxyXG5cIlVQR1JBREVTXCI6e30sXHJcblwiVVBHUkFERUxWTFwiOjAsXHJcblwiUVVBTElUSUVTXCI6e30sXHJcblwiUVVBTElUWUxWTFwiOjEsXHJcbn0sXHJcbnsvLzE3XHJcblwibmFtZVwiOlwiQ1BVIENhY2hlclwiLFxyXG5cImRlc2NyaXB0aW9uXCI6XCJDYWNoZXMgeW91ciBDUFUgZnJlZWluZyB1cCBTcGFjZVwiLFxyXG5cImZpbGVuYW1lXCI6XCJhX3Byb2Nlc3NvckJvb3N0ZXIuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlBQUExcIjotNDAwLFxyXG5cIkVQUExcIjotNTAsXHJcblwiQ0RQTFwiOjE1MDAwLFxyXG5cIlRQUExcIjo1LFxyXG5cIkRUUExcIjo0MDAwLFxyXG5cIkNBVFwiOlwiUFBcIixcclxuXCJVUEdSQURFU1wiOnt9LFxyXG5cIlVQR1JBREVMVkxcIjowLFxyXG5cIlFVQUxJVElFU1wiOnt9LFxyXG5cIlFVQUxJVFlMVkxcIjozLFxyXG59LFxyXG57Ly8xOFxyXG5cIm5hbWVcIjpcIkNQVSBDb21wcmVzc29yXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIkNvbXByZXNzZXMgeW91ciBwcm9jZXNzZXMgZ3JhbnRpbmcgYWRkaXRpb25hbCBQcm9jZXNzaW5nIFBvaW50c1wiLFxyXG5cImZpbGVuYW1lXCI6XCJhX3Byb2Nlc3NvckV4dGVuc2lvbi5zdmdcIixcclxuXCJDRG9yQU9cIjpcIkFPXCIsXHJcblwiUFBQTFwiOjUwLFxyXG5cIkVQUExcIjotNDAsXHJcblwiVFBQTFwiOjE1LFxyXG5cIlRQRVhQXCI6MzAsXHJcblwiUFBFWFBcIjo0MCxcclxuXCJFUEVYUFwiOi00MCxcclxuXCJDQVRcIjpcIlBQRVhQXCIsXHJcblwiVVBHUkFERVNcIjp7fSxcclxuXCJVUEdSQURFTFZMXCI6MCxcclxuXCJRVUFMSVRJRVNcIjp7fSxcclxuXCJRVUFMSVRZTFZMXCI6MyxcclxufSxcclxuey8vMTlcclxuXCJuYW1lXCI6XCJDUFUgT3ZlckNsb2NrXCIsXHJcblwiZGVzY3JpcHRpb25cIjpcIk92ZXJjbG9ja3MgeW91ciBDUFUgZ3JhbnRpbmcgYWRkaXRpb25hbCBQcm9jZXNzaW5nIFBvaW50c1wiLFxyXG5cImZpbGVuYW1lXCI6XCJhX3Byb2Nlc3Nvck92ZXJjbG9jay5zdmdcIixcclxuXCJDRG9yQU9cIjpcIkFPXCIsXHJcblwiUFBQTFwiOi0xNTAsXHJcblwiRVBQTFwiOi00MCxcclxuXCJUUFBMXCI6MzAsXHJcblwiVFBFWFBcIjoyMCxcclxuXCJBUEVYUFwiOi0xMCxcclxuXCJQUEVYUFwiOjMwLFxyXG5cIkVQRVhQXCI6LTIwLFxyXG5cIkNBVFwiOlwiUFBFWFBcIixcclxuXCJVUEdSQURFU1wiOnt9LFxyXG5cIlVQR1JBREVMVkxcIjowLFxyXG5cIlFVQUxJVElFU1wiOnt9LFxyXG5cIlFVQUxJVFlMVkxcIjo0LFxyXG59LFxyXG57Ly8yMFxyXG5cIm5hbWVcIjpcIlJvY2tldCBMYXVuY2hlclwiLFxyXG5cImRlc2NyaXB0aW9uXCI6XCJBdHRhY2tzIHRoZSBlbmVteSB3aXRoIGEgUm9ja2V0IExhdW5jaGVyXCIsXHJcblwiZmlsZW5hbWVcIjpcImFfcm9ja2V0LnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQ0RcIixcclxuXCJQUFBMXCI6MzAsXHJcblwiRVBQTFwiOi0zMCxcclxuXCJDRFBMXCI6MjUwMCxcclxuXCJUUFBMXCI6MixcclxuXCJTUEVOXCI6MjAsXHJcblwiQVBFTlwiOi00MCxcclxuXCJUUEVOXCI6MyxcclxuXCJDQVRcIjpcIkFQRU5cIixcclxuXCJVUEdSQURFU1wiOnt9LFxyXG5cIlVQR1JBREVMVkxcIjowLFxyXG5cIlFVQUxJVElFU1wiOnt9LFxyXG5cIlFVQUxJVFlMVkxcIjo1LFxyXG59LFxyXG57Ly8yMVxyXG5cIm5hbWVcIjpcIlNoaWVsZFwiLFxyXG5cImRlc2NyaXB0aW9uXCI6XCJSZXBsZW5pc2hlcyB5b3VyIFNoaWVsZCBQb2ludHNcIixcclxuXCJmaWxlbmFtZVwiOlwiYV9zaGllbGQuc3ZnXCIsXHJcblwiQ0RvckFPXCI6XCJDRFwiLFxyXG5cIlNQUExcIjo1MCxcclxuXCJQUFBMXCI6NSxcclxuXCJFUFBMXCI6LTMwLFxyXG5cIkNEUExcIjo0MDAwLFxyXG5cIkNBVFwiOlwiU1BcIixcclxuXCJVUEdSQURFU1wiOnt9LFxyXG5cIlVQR1JBREVMVkxcIjowLFxyXG5cIlFVQUxJVElFU1wiOnt9LFxyXG5cIlFVQUxJVFlMVkxcIjoxLFxyXG59LFxyXG57Ly8yMlxyXG5cIm5hbWVcIjpcIlNoaWVsZCBFeHRlbmRlclwiLFxyXG5cImRlc2NyaXB0aW9uXCI6XCJFeHRlbmRzIHRoZSBtYXhpbXVtIGNhcGFjaXR5IG9mIHlvdXIgU2hpZWxkIFBvaW50c1wiLFxyXG5cImZpbGVuYW1lXCI6XCJhX3NoaWVsZEV4dGVuZGVyLnN2Z1wiLFxyXG5cIkNEb3JBT1wiOlwiQU9cIixcclxuXCJQUFBMXCI6MjUsXHJcblwiRVBQTFwiOi0xMDAsXHJcblwiU1BFWFBcIjozMCxcclxuXCJUUEVYUFwiOjE1LFxyXG5cIkFQRVhQXCI6LTIwLFxyXG5cIlBQRVhQXCI6LTE1LFxyXG5cIkVQRVhQXCI6LTUsXHJcblwiQ0FUXCI6XCJTUEVYUFwiLFxyXG5cIlVQR1JBREVTXCI6e30sXHJcblwiVVBHUkFERUxWTFwiOjAsXHJcblwiUVVBTElUSUVTXCI6e30sXHJcblwiUVVBTElUWUxWTFwiOjMsXHJcbn0sXHJcblxyXG5cclxuXTtcclxuIiwibW9kdWxlLmV4cG9ydHM9J3VzZSBzdHJpY3QnXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcIm5hbWVcIjpcIlBsYXllckdvb2RHdXlcIixcclxuXHRcIkxWTFwiOjUsXHJcblx0XCJTUE1BWFwiOjI1MzIsXHJcblx0XCJTUE1JTlwiOjAsXHJcblx0XCJTUENVUlwiOjIzMTIsXHJcblx0XCJBUE1BWFwiOjI3NTYsXHJcblx0XCJBUE1JTlwiOjAsXHJcblx0XCJBUENVUlwiOjI3NTYsXHJcblx0XCJFUE1BWFwiOjE1MDAsXHJcblx0XCJFUE1JTlwiOjAsXHJcblx0XCJFUENVUlwiOjc1MCxcclxuXHRcIlBQTUFYXCI6MzI0LFxyXG5cdFwiUFBDVVJcIjowLFxyXG5cdFwiUFBNSU5cIjowLFxyXG5cdFwiVFBNQVhcIjo5OTAsXHJcblx0XCJUUE1JTlwiOi0zNDAsXHJcblx0XCJUUENVUlwiOjM0MCxcclxuXHRcIkFQUkVTXCI6NTAsXHJcblx0XCJTUFJFU1wiOjY1LFxyXG59IiwibW9kdWxlLmV4cG9ydHM9J3VzZSBzdHJpY3QnXHJcbi8vRVFVSVBFRCBJVEVNUyBHTyBIRVJFIEdPIEhFUkVcclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcbnsvLzFcclxuXCJwcmVmaXhJRFwiOlwicGxTb2NrMDFcIiwgLy9ORUVEIFRISVMgRk9SIEFMTCBIVE1MIE9SIENTUyBMSU5LU1xyXG5cImVxcHRNb2R1bGVzSURcIjoxLCAvL0NVUlJFTlRMWSBVTlVTRUQgXHJcblwicGxheWVyaW52ZW50b3J5SURcIjoxLCAvL0NVUlJFTlRMWSBVTlVTRUQgXHJcblwic2VsZWN0ZWRcIjpmYWxzZSwgLy9UT0dHTEVTIFRPIFRSVUUgV0hFTiBTRUxFQ1RFRFxyXG5cIml0ZW1cIjp7fSwgLy9FUVVJUEVEIElURU1TIEFSRSBTVE9SRUQgSU4gSEVSRVxyXG5cIkNERW5kXCI6MCwgLy9VU0VEIFRPIEFOSU1BVEUgUFJPR1JFU1MgQkFSU1xyXG5cIkNEVGVtcFwiOjAsIC8vQ0QgQ09SUkVDVEVEIEJZIFRFTVBFUkFUVVJFXHJcblwiYXBwbHlTdGF0c1wiOmZhbHNlLFxyXG5cImRpc2FibGVcIjpmYWxzZSxcclxuXCJ0eXBlXCI6XCJcIixcclxufSxcclxuey8vMlxyXG5cInByZWZpeElEXCI6XCJwbFNvY2swMlwiLFxyXG5cImVxcHRNb2R1bGVzSURcIjoxLFxyXG5cInBsYXllcmludmVudG9yeUlEXCI6MSxcclxuXCJzZWxlY3RlZFwiOmZhbHNlLFxyXG5cIml0ZW1cIjp7fSxcclxuXCJDREVuZFwiOjAsXHJcblwiQ0RUZW1wXCI6MCxcclxuXCJhcHBseVN0YXRzXCI6ZmFsc2UsXHJcblwiZGlzYWJsZVwiOmZhbHNlLFxyXG5cInR5cGVcIjpcIlwiLFxyXG59LFxyXG57Ly8zXHJcblwicHJlZml4SURcIjpcInBsU29jazAzXCIsXHJcblwiZXFwdE1vZHVsZXNJRFwiOjEsXHJcblwicGxheWVyaW52ZW50b3J5SURcIjoxLFxyXG5cInNlbGVjdGVkXCI6ZmFsc2UsXHJcblwiaXRlbVwiOnt9LFxyXG5cIkNERW5kXCI6MCxcclxuXCJDRFRlbXBcIjowLFxyXG5cImFwcGx5U3RhdHNcIjpmYWxzZSxcclxuXCJkaXNhYmxlXCI6ZmFsc2UsXHJcblwidHlwZVwiOlwiXCIsXHJcbn0sXHJcbnsvLzRcclxuXCJwcmVmaXhJRFwiOlwicGxTb2NrMDRcIixcclxuXCJlcXB0TW9kdWxlc0lEXCI6MSxcclxuXCJwbGF5ZXJpbnZlbnRvcnlJRFwiOjEsXHJcblwic2VsZWN0ZWRcIjpmYWxzZSxcclxuXCJpdGVtXCI6e30sXHJcblwiQ0RFbmRcIjowLFxyXG5cIkNEVGVtcFwiOjAsXHJcblwiYXBwbHlTdGF0c1wiOmZhbHNlLFxyXG5cImRpc2FibGVcIjpmYWxzZSxcclxuXCJ0eXBlXCI6XCJcIixcclxufSxcclxuey8vNVxyXG5cInByZWZpeElEXCI6XCJwbFNvY2swNVwiLFxyXG5cImVxcHRNb2R1bGVzSURcIjoxLFxyXG5cInBsYXllcmludmVudG9yeUlEXCI6MSxcclxuXCJzZWxlY3RlZFwiOmZhbHNlLFxyXG5cIml0ZW1cIjp7fSxcclxuXCJDREVuZFwiOjAsXHJcblwiQ0RUZW1wXCI6MCxcclxuXCJhcHBseVN0YXRzXCI6ZmFsc2UsXHJcblwiZGlzYWJsZVwiOmZhbHNlLFxyXG5cInR5cGVcIjpcIlwiLFxyXG59LFxyXG57Ly82XHJcblwicHJlZml4SURcIjpcInBsU29jazA2XCIsXHJcblwiZXFwdE1vZHVsZXNJRFwiOjEsXHJcblwicGxheWVyaW52ZW50b3J5SURcIjoxLFxyXG5cInNlbGVjdGVkXCI6ZmFsc2UsXHJcblwiaXRlbVwiOnt9LFxyXG5cIkNERW5kXCI6MCxcclxuXCJDRFRlbXBcIjowLFxyXG5cImFwcGx5U3RhdHNcIjpmYWxzZSxcclxuXCJkaXNhYmxlXCI6ZmFsc2UsXHJcblwidHlwZVwiOlwiXCIsXHJcbn0sXHJcbnsvLzdcclxuXCJwcmVmaXhJRFwiOlwicGxTb2NrMDdcIixcclxuXCJlcXB0TW9kdWxlc0lEXCI6MSxcclxuXCJwbGF5ZXJpbnZlbnRvcnlJRFwiOjEsXHJcblwic2VsZWN0ZWRcIjpmYWxzZSxcclxuXCJpdGVtXCI6e30sXHJcblwiQ0RFbmRcIjowLFxyXG5cIkNEVGVtcFwiOjAsXHJcblwiYXBwbHlTdGF0c1wiOmZhbHNlLFxyXG5cImRpc2FibGVcIjpmYWxzZSxcclxuXCJ0eXBlXCI6XCJcIixcclxufSxcclxuey8vOFxyXG5cInByZWZpeElEXCI6XCJwbFNvY2swOFwiLFxyXG5cImVxcHRNb2R1bGVzSURcIjoxLFxyXG5cInBsYXllcmludmVudG9yeUlEXCI6MSxcclxuXCJzZWxlY3RlZFwiOmZhbHNlLFxyXG5cIml0ZW1cIjp7fSxcclxuXCJDREVuZFwiOjAsXHJcblwiQ0RUZW1wXCI6MCxcclxuXCJhcHBseVN0YXRzXCI6ZmFsc2UsXHJcblwiZGlzYWJsZVwiOmZhbHNlLFxyXG5cInR5cGVcIjpcIlwiLFxyXG59LFxyXG57Ly85XHJcblwicHJlZml4SURcIjpcInBsU29jazA5XCIsXHJcblwiZXFwdE1vZHVsZXNJRFwiOjEsXHJcblwicGxheWVyaW52ZW50b3J5SURcIjoxLFxyXG5cInNlbGVjdGVkXCI6ZmFsc2UsXHJcblwiaXRlbVwiOnt9LFxyXG5cIkNERW5kXCI6MCxcclxuXCJDRFRlbXBcIjowLFxyXG5cImFwcGx5U3RhdHNcIjpmYWxzZSxcclxuXCJkaXNhYmxlXCI6ZmFsc2UsXHJcblwidHlwZVwiOlwiXCIsXHJcbn0sXHJcbl0iLCJtb2R1bGUuZXhwb3J0cz0ndXNlIHN0cmljdCdcclxuLy9FUVVJUEVEIElURU1TIEdPIEhFUkUgR08gSEVSRVxyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuey8vMVxyXG5cInByZWZpeElEXCI6XCJlblNvY2swMVwiLCAvL05FRUQgVEhJUyBGT1IgQUxMIEhUTUwgT1IgQ1NTIExJTktTXHJcblwiZXFwdE1vZHVsZXNJRFwiOjEsIC8vQ1VSUkVOVExZIFVOVVNFRCBcclxuXCJwbGF5ZXJpbnZlbnRvcnlJRFwiOjEsIC8vQ1VSUkVOVExZIFVOVVNFRCBcclxuXCJzZWxlY3RlZFwiOmZhbHNlLCAvL1RPR0dMRVMgVE8gVFJVRSBXSEVOIFNFTEVDVEVEXHJcblwiaXRlbVwiOnt9LCAvL0VRVUlQRUQgSVRFTVMgQVJFIFNUT1JFRCBJTiBIRVJFXHJcblwiQ0RFbmRcIjowLCAvL1VTRUQgVE8gQU5JTUFURSBQUk9HUkVTUyBCQVJTXHJcblwiQ0RUZW1wXCI6MCwgLy9DRCBDT1JSRUNURUQgQlkgVEVNUEVSQVRVUkVcclxuXCJhcHBseVN0YXRzXCI6ZmFsc2UsXHJcblwiZGlzYWJsZVwiOmZhbHNlLFxyXG59LFxyXG57Ly8yXHJcblwicHJlZml4SURcIjpcImVuU29jazAyXCIsXHJcblwiZXFwdE1vZHVsZXNJRFwiOjEsXHJcblwicGxheWVyaW52ZW50b3J5SURcIjoxLFxyXG5cInNlbGVjdGVkXCI6ZmFsc2UsXHJcblwiaXRlbVwiOnt9LFxyXG5cIkNERW5kXCI6MCxcclxuXCJDRFRlbXBcIjowLFxyXG5cImFwcGx5U3RhdHNcIjpmYWxzZSxcclxuXCJkaXNhYmxlXCI6ZmFsc2UsXHJcbn0sXHJcbnsvLzNcclxuXCJwcmVmaXhJRFwiOlwiZW5Tb2NrMDNcIixcclxuXCJlcXB0TW9kdWxlc0lEXCI6MSxcclxuXCJwbGF5ZXJpbnZlbnRvcnlJRFwiOjEsXHJcblwic2VsZWN0ZWRcIjpmYWxzZSxcclxuXCJpdGVtXCI6e30sXHJcblwiQ0RFbmRcIjowLFxyXG5cIkNEVGVtcFwiOjAsXHJcblwiYXBwbHlTdGF0c1wiOmZhbHNlLFxyXG5cImRpc2FibGVcIjpmYWxzZSxcclxufSxcclxuey8vNFxyXG5cInByZWZpeElEXCI6XCJlblNvY2swNFwiLFxyXG5cImVxcHRNb2R1bGVzSURcIjoxLFxyXG5cInBsYXllcmludmVudG9yeUlEXCI6MSxcclxuXCJzZWxlY3RlZFwiOmZhbHNlLFxyXG5cIml0ZW1cIjp7fSxcclxuXCJDREVuZFwiOjAsXHJcblwiQ0RUZW1wXCI6MCxcclxuXCJhcHBseVN0YXRzXCI6ZmFsc2UsXHJcblwiZGlzYWJsZVwiOmZhbHNlLFxyXG59LFxyXG57Ly81XHJcblwicHJlZml4SURcIjpcImVuU29jazA1XCIsXHJcblwiZXFwdE1vZHVsZXNJRFwiOjEsXHJcblwicGxheWVyaW52ZW50b3J5SURcIjoxLFxyXG5cInNlbGVjdGVkXCI6ZmFsc2UsXHJcblwiaXRlbVwiOnt9LFxyXG5cIkNERW5kXCI6MCxcclxuXCJDRFRlbXBcIjowLFxyXG5cImFwcGx5U3RhdHNcIjpmYWxzZSxcclxuXCJkaXNhYmxlXCI6ZmFsc2UsXHJcbn0sXHJcbnsvLzZcclxuXCJwcmVmaXhJRFwiOlwiZW5Tb2NrMDZcIixcclxuXCJlcXB0TW9kdWxlc0lEXCI6MSxcclxuXCJwbGF5ZXJpbnZlbnRvcnlJRFwiOjEsXHJcblwic2VsZWN0ZWRcIjpmYWxzZSxcclxuXCJpdGVtXCI6e30sXHJcblwiQ0RFbmRcIjowLFxyXG5cIkNEVGVtcFwiOjAsXHJcblwiYXBwbHlTdGF0c1wiOmZhbHNlLFxyXG5cImRpc2FibGVcIjpmYWxzZSxcclxufSxcclxuey8vN1xyXG5cInByZWZpeElEXCI6XCJlblNvY2swN1wiLFxyXG5cImVxcHRNb2R1bGVzSURcIjoxLFxyXG5cInBsYXllcmludmVudG9yeUlEXCI6MSxcclxuXCJzZWxlY3RlZFwiOmZhbHNlLFxyXG5cIml0ZW1cIjp7fSxcclxuXCJDREVuZFwiOjAsXHJcblwiQ0RUZW1wXCI6MCxcclxuXCJhcHBseVN0YXRzXCI6ZmFsc2UsXHJcblwiZGlzYWJsZVwiOmZhbHNlLFxyXG59LFxyXG57Ly84XHJcblwicHJlZml4SURcIjpcImVuU29jazA4XCIsXHJcblwiZXFwdE1vZHVsZXNJRFwiOjEsXHJcblwicGxheWVyaW52ZW50b3J5SURcIjoxLFxyXG5cInNlbGVjdGVkXCI6ZmFsc2UsXHJcblwiaXRlbVwiOnt9LFxyXG5cIkNERW5kXCI6MCxcclxuXCJDRFRlbXBcIjowLFxyXG5cImFwcGx5U3RhdHNcIjpmYWxzZSxcclxuXCJkaXNhYmxlXCI6ZmFsc2UsXHJcbn0sXHJcbnsvLzlcclxuXCJwcmVmaXhJRFwiOlwiZW5Tb2NrMDlcIixcclxuXCJlcXB0TW9kdWxlc0lEXCI6MSxcclxuXCJwbGF5ZXJpbnZlbnRvcnlJRFwiOjEsXHJcblwic2VsZWN0ZWRcIjpmYWxzZSxcclxuXCJpdGVtXCI6e30sXHJcblwiQ0RFbmRcIjowLFxyXG5cIkNEVGVtcFwiOjAsXHJcblwiYXBwbHlTdGF0c1wiOmZhbHNlLFxyXG5cImRpc2FibGVcIjpmYWxzZSxcclxufSxcclxuXSJdfQ==
