function GameLoad() {
  this.corsProxy = "https://cors-anywhere.herokuapp.com/";
  this.acLoc = "https://www.airconsole.com/";

  this.gamesList = [];
}

GameLoad.prototype.initialize = function () {
  gLoad.loadPage(gLoad.corsProxy + gLoad.acLoc, function (pageData) {
    gLoad.parseGamesList(pageData);
  }, 
  function(xhr) { console.error(xhr); });
}
GameLoad.prototype.parseGamesList = function (pageData) {
	var data = pageData.match(/(?<=games_with_categories *= *){.*}(?=;)/);
	gLoad.mapACGamesListToOC(JSON.parse(data));
}
GameLoad.prototype.mapACGamesListToOC = function (acGamesList) {
	console.log(acGamesList);
	var games = acGamesList.games;
	for (var gameKey of Object.keys(games)) {
		var game = games[gameKey];
		if (gameKey.startsWith("com.airconsole") && !gameKey.startsWith("com.airconsole.game")) continue;
		if (game.author === "AirConsole") continue;

		var ocGame = {};
		ocGame.name = game.name;
		ocGame.author = game.author;
		ocGame.live = game.live;
		if (game.players_min !== null) ocGame.minPlayers = game.players_min;
		if (game.players_max !== null) ocGame.maxPlayers = game.players_max;
		else ocGame.maxPlayers = 0;
		if (game.cover !== null) ocGame.gamePic = game.cover;
		if (game.video !== null) ocGame.highlightPic = game.video;
		gLoad.gamesList.push(ocGame);
	}
}

GameLoad.prototype.loadPage = function (path, success, error) {
  console.log("Attemting to read page at: " + path);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    if (xhr.status === 200) {
      if (success) success(xhr.responseText);
    }
    else {
      if (error) error(xhr);
    }
  };
  xhr.open("GET", path, true);
  xhr.send();
}

var gLoad = new GameLoad();
gLoad.initialize();

