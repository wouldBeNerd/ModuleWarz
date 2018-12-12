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