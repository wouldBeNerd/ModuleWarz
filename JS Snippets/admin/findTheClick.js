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