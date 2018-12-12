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