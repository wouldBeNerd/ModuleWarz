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