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