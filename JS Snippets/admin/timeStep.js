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
