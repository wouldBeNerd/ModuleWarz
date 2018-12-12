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