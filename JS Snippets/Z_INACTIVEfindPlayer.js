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