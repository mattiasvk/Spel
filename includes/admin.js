var pointsTable = [0, 10, 7, 4, 2, 1];
var sortOrder = { "HT-2012": 1, "VT-2013": 2, "HT-2013": 3, "VT-2014": 4, "HT-2014": 5 };
angular.module('scoreApp', ['ui.bootstrap', 'httpModule'])
	.directive('myformat', function (dateFilter) {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, ngModel) {
				ngModel.$parsers.push(function (viewValue) {
					return dateFilter(viewValue, 'yyyy-MM-dd');
				});
			}
		}
	})
	.directive('resize', function ($window) {
		return function (scope, element, attrs) {
			scope.getWinHeight = function () {
				return $window.innerHeight;
			};

			var setNavHeight = function (newHeight) {
				element.css('height', newHeight + 'px');
			};

			// Set on load
			scope.$watch(scope.getWinHeight, function (newValue, oldValue) {
				var num = scope.$eval(attrs.padding);
				setNavHeight(scope.getWinHeight() - num);
			}, true);

			// Set on resize
			angular.element($window).bind('resize', function () {
				scope.$apply();
			});
		};
	});

// get points per game

function calculatePointsPerGame(gamePositions) { //4
	// hur många har varje placering
	var tmpTable = [0, 0, 0, 0, 0, 0];
	for (i = 0; i <= 5; i++) {
		angular.forEach(gamePositions, function (position, index) {
			if (position == i) {
				tmpTable[i]++;
			}
		})
	}
	//tmpTable = [2,1,1,1,0,0]
	// vad blir varje placerings totalpoäng
	var tmpTablePoints = [0, 0, 0, 0, 0, 0];
	for (i = 1; i <= 5; i++) { //skip those with zero points
		for (j = 0; j < tmpTable[i]; j++) {
			tmpTablePoints[i] += pointsTable[i + j];
		}
	}
	//tmpTablePoints = [0,10,7,4,2,0]
	// totalpoängen delat med antal på den placeringen
	for (i = 0; i <= 5; i++) {
		if (tmpTable[i] != 0) { tmpTablePoints[i] = tmpTablePoints[i] / tmpTable[i]; }
	}
	//tmpTablePoints = [0,10,7,4,2,0]
	// skapa retur-tabell
	dest = angular.copy(gamePositions);
	angular.forEach(gamePositions, function (position, index) {
		dest[index] = tmpTablePoints[position];
	});
	return dest;
}

function calculatePointsPerGameGroup(night) { //5
	tmpGames = new Object();
	angular.forEach(night, function (game, index) {
		if (!(game.gid in tmpGames)) { tmpGames[game.gid] = [];}
		tmpGames[game.gid].push(game);
	});

	angular.forEach(tmpGames, function (games, index) {
		games[0].totalPoints = angular.copy(games[0].points);
		for (i = 1; i < games.length; i++) {
			games[i].totalPoints = angular.copy(games[i].points);

			angular.forEach(games[i].points, function (point, index) {
				games[0].totalPoints[index] += games[i].points[index];
				games[i].totalPoints[index] = 0;
			});
		}
	});
	
	angular.forEach(night, function (game, index) {
		calculatePointsFromPosition(game);
	});
}
function calculatePointsFromPosition(game) { //6
	game.endPoints = [0,0,0,0,0];
	game.endPositions = [0, 0, 0, 0, 0];
		var totalPoints = 0;
		var indexOuter = 0;
		var pointsArr = [0,0,0,0,0];
		angular.forEach(game.totalPoints, function (points, index) {
			game.endPositions[index] = 0;
			game.endPoints[index] = 0;
			pointsArr[indexOuter] = points;
			totalPoints += points;
			indexOuter++;
		});
		pointsArr.sort(function (a, b) { return b - a });
		if (totalPoints != 0) {
			var positions = [0, 0, 0, 0, 0];
			for (i = 0; i < 5; i++) {
				angular.forEach(game.totalPoints, function (points, index) {
					if (points == pointsArr[i] && game.endPositions[index] == 0 && points!= 0) { game.endPositions[index] = i + 1; }
				});
			}
			game.endPoints = calculatePointsPerGame(game.endPositions);
		}
}

function calculateGameNight(night) { //3
	angular.forEach(night, function (game, index) {
		game.points = calculatePointsPerGame(game.positions);
	});
}

function generateGameNights(allGames) { //2
	var seasons = new Object();
	var gameNights = [];
	var currentDate = "";
	var nightIndex = -1;
	angular.forEach(allGames, function (game, index) {

		if (!(game.season in seasons)) {
			seasons[game.season] = new Object();
			seasons[game.season].nights = new Object();
		}
		if (!(game.date in seasons[game.season].nights)) {
			seasons[game.season].nights[game.date] = new Object();
			seasons[game.season].nights[game.date].host = game.host;
			seasons[game.season].nights[game.date].date = game.date;
			seasons[game.season].nights[game.date].games = [];
			seasons[game.season].nights[game.date].players = [];
			seasons[game.season].nights[game.date].endPoints = [];
		}
		seasons[game.season].nights[game.date].games.push(game);
	});
	angular.forEach(seasons, function (season, key) {
		season.index = sortOrder[key];
	});
	return seasons;
}

function calculatePositionsForNight(night) { //7
	var totalPoints = [0,0,0,0,0];
	angular.forEach(night.games, function (game, index) {
		angular.forEach(game.endPoints, function (point, index) {
			totalPoints[index] += point;
		});
	});
	night.totalPoints = angular.copy(totalPoints);
}

function calculateTotal(season) {
	season.players = ["Daniel", "Johan", "Marcus", "Mattias", "Stefan"];
	season.average = [0, 0, 0, 0, 0];
	season.total = [0, 0, 0, 0, 0];
	season.gamesPlayed = [0, 0, 0, 0, 0];

	angular.forEach(season.nights, function (night, index) {
		angular.forEach(night.endPoints, function (value, index) {
			season.total[index] += value;
			if (value != 0 ) {
				season.gamesPlayed[index] += 1;
			}
		});
		angular.forEach(season.players, function (player, index) {
			season.average[index] = season.total[index] / season.gamesPlayed[index];
		});
		
	});
}

function calculateAverages(games) {
	var gameAverage = new Object();
	angular.forEach(games, function (game, index) {
		if (!(game.game in gameAverage)) {
			gameAverage[game.game] = new Object();
			gameAverage[game.game].gameTotal = 0;
			gameAverage[game.game].gamesPlayed = [0,0,0,0,0];
			gameAverage[game.game].total = [0, 0, 0, 0, 0];
			gameAverage[game.game].average = [0, 0, 0, 0, 0];
			gameAverage[game.game].game = game.game;
		}
		angular.forEach(game.points, function (point, index) {
			gameAverage[game.game].total[index] += point;
			if (point != 0) {
				gameAverage[game.game].gamesPlayed[index] += 1;
			}
		});
		gameAverage[game.game].gameTotal += 1;
	});

	angular.forEach(gameAverage, function (game, index) {
		angular.forEach(game.gamesPlayed, function (player, index2) {
			if (game.gamesPlayed[index2] != 0) {
				game.average[index2] = game.total[index2] / game.gamesPlayed[index2];
			}
		});
	});

	var avgArray = [];
	var i = 0;
	angular.forEach(gameAverage, function (game, index) {
		avgArray[i++] = game;
	});
	return avgArray;
}

var scoreController = function ($scope, httpService) {
	$scope.httpService = httpService;
	$scope.allGames = [];

	$scope.save = function (passwd) {
		$scope.calculate();
		var gameAvg = calculateAverages($scope.allGames);
		var saveAdminStruct = $scope.buildAdminStruct($scope.allGames);
		var saveMainStruct = $scope.buildMainStruct($scope.seasons);
		var saveMainStruct2 = new Object();
		var saveAdminStruct2 = new Object();
		saveMainStruct2["main"] = saveMainStruct;
		saveAdminStruct2["admin"] = saveAdminStruct;
		saveAdminStruct2["average"] = gameAvg;

		$scope.httpService.save(saveMainStruct2, saveAdminStruct2, passwd, function () {
		});

	}

	$scope.httpService.loadAdmin(function (data) {
		$scope.$apply(function () {
			angular.forEach(data.admin.games, function (game, index) {
				var tmp = [0,0,0,0,0];
				var i = 0;
				angular.forEach(game.positions, function (pos, key) {
					tmp[i] = parseInt(pos);
					i++;
				});
				game.positions = tmp;
			});
			$scope.allGames = data.admin.games;
			$scope.gameNames = data.admin.gameNames;
			$scope.allPlayers = data.admin.allPlayers;
			$scope.allSeasons = data.admin.seasons;
		});
	});

	$scope.buildAllGamesData = function (oldGames) {
		var newArray = [];

		angular.forEach(oldGames, function (game, index) {
			newArray[index] = new Object();
			newArray[index]["season"] = game["season"];
			newArray[index]["date"] = game["date"];
			newArray[index]["host"] = game["host"];
			newArray[index]["game"] = game["game"];
			newArray[index]["gid"] = game["gid"];
			newArray[index]["positions"] = game["positions"];
			newArray[index]["points"] = game["points"];
		});
		return newArray;
	}

	$scope.buildAdminStruct = function (allGames) {
		var newStruct = new Object();
		newStruct["games"] = $scope.buildAllGamesData(allGames);
		newStruct["seasons"] = $scope.allSeasons;
		newStruct["gameNames"] = $scope.gameNames;
		newStruct["allPlayers"] = $scope.allPlayers;
		return newStruct;
	}


	$scope.buildMainStruct = function (seasons) {
		var newStruct = new Object();
		newStruct["seasons"] = jQuery.extend(true, {}, seasons);
		angular.forEach(newStruct["seasons"], function (season, key) {
			angular.forEach(season.nights, function (night, key) {
				delete night["players"];
				angular.forEach(night.games, function (game, index) {
					delete game["date"];
					delete game["endPoints"];
					delete game["endPositions"];
					delete game["host"];
					delete game["positions"];
					delete game["season"];
					delete game["totalPoints"];
				});
			});
		});
		
		return newStruct;
	}

	$scope.calculate = function() { //1
		$scope.seasons = generateGameNights($scope.allGames);
		angular.forEach($scope.seasons, function (season, index) {
			angular.forEach(season.nights, function (night, index) {
				
				calculateGameNight(night.games);
				calculatePointsPerGameGroup(night.games);
				calculatePositionsForNight(night);
				calculatePointsFromPosition(night);
			});
			calculateTotal(season);
		});
	}

	$scope.seasonFilter = function (game) {
		return ($scope.seasonSearchCriteria == "All" || game.season == $scope.seasonSearchCriteria);
	}

	$scope.addGame = function () {
		last = $scope.allGames[$scope.allGames.length - 1];
		$scope.allGames.push({ "season": last.season, "date": last.date, "host": last.host, "game": last.game, "gid": last.gid, "positions": [0,0,0,0,0], "points": [0,0,0,0,0], "new":true });
	}

	$scope.deleteGame = function (item) {
		var index = $scope.allGames.indexOf(item);
		if (index != -1) {
			$scope.allGames.splice(index,1);
		}
	}

	$scope.addGameName = function () {
		$scope.gameNames.push("");
	}
	$scope.deleteGameName = function (item) {
		var index = $scope.gameNames.indexOf(item);
		if (index != -1) {
			$scope.gameNames.splice(index, 1);
		}
	}
	$scope.sortGameNames = function () {
		$scope.gameNames.sort();
	}

};

