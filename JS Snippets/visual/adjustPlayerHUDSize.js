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