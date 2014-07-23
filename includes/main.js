angular.module('scoreApp', ['ui.bootstrap', 'pasvaz.bindonce', 'googlechart', 'httpModule'])
.filter('object2Array', function () {
	return function (input) {
		var out = [];
		for (i in input) {
			input[i].seasonName = i;
			out.push(input[i]);
		}
		return out;
	}
});

var scoreController = function ($scope, httpService) {
	$scope.httpService = httpService;

    $scope.players = {"Daniel" : 1, "Johan" : 2, "Marcus" : 3, "Mattias" : 4, "Stefan" : 5};
    $scope.seasonName = {"HT-2012" : 1, "VT-2013" : 2, "HT-2013" : 3, "VT-2014" : 4, "HT-2014" : 5};
    $scope.gameName =
    {
        "7 Wonders" : 1,
        "Alfapet" : 2,
        "Backgammon" : 3,
        "Canasta" : 4,
        "Carcassonne" : 5,
        "Diamanten" : 6,
        "Dungeon Raiders" : 7,
        "Hansa" : 8,
        "MIG" : 9,
        "Monopol" : 10,
        "Nya Finans" : 11,
        "Unknown" : 12,
        "Plump Extended" : 13,
        "Plump Satsning" : 14,
        "Plump Vanilj" : 15,
        "Poker" : 16,
        "Puerto Rico" : 17,
        "Risk" : 18,
        "Roborally" : 19,
        "San Juan" : 20,
        "Settlers" : 21,
        "Trivial Pursuit" : 22,
        "Ubongo" : 23,
        "Yatzy" : 24
    };
	$scope.httpService.loadMain(function(data) {
		$scope.$apply(function () {
           // $scope.printValues(data);
			$scope.seasons = data.main.seasons;
			$scope.seasons['VT-2014'].active = true;
			//$scope.calculateGraphValues();
		});
	});

    $scope.printValues = function(data) {
        var sql = '';
        angular.forEach(data.main.seasons, function (season, index) {
            //console.log(index);

            angular.forEach(season.nights, function (night, index2) {
                //console.log(night);
              //console.log(night.date);
              //console.log(night.host);
              //  console.log($scope.players[night.host]);
              //console.log(night.endPoints);
              //console.log(night.endPositions);
               // console.log(night);


           /*     console.log("Insert into speldb.night values ("
                   + $scope.seasonName[index] + ", '"
                    + night.date + "', "
                    + $scope.players[night.host] + ", "
                    + night.endPositions[0] + ", "
                    + night.endPoints[0] + ", "
                    + night.endPositions[1] + ", "
                    + night.endPoints[1] + ", "
                    + night.endPositions[2] + ", "
                    + night.endPoints[2] + ", "
                    + night.endPositions[3] + ", "
                    + night.endPoints[3] + ", "
                    + night.endPositions[4] + ", "
                    + night.endPoints[4] + "); "
                );
             */
                sql = sql + "Insert into speldb.night values (DEFAULT, "
                    + $scope.seasonName[index] + ", "
                    + "STR_TO_DATE('" + night.date + "', '%Y-%m-%d')"
                    + ", "
                    + $scope.players[night.host] + ", "
                    + night.endPositions[0] +", "
                    + night.endPoints[0] + ", "
                    + night.endPositions[1] +", "
                    + night.endPoints[1] + ",  "
                    + night.endPositions[2] + ", "
                    + night.endPoints[2] + ", "
                    + night.endPositions[3] + ", "
                    + night.endPoints[3] + ", "
                    + night.endPositions[4] + ", "
                    + night.endPoints[4] + ");\n ";

                angular.forEach(night.games, function (game, index3) {
                  //  console.log(game);
         /*           console.log("Insert into speldb.playedgame values ((select nightid from night ORDER BY nightid DESC limit 1) ,",
                    $scope.gameName[game.game], ", ", game.gid, ", "
                         ,game.points[0] , ", "
                         ,game.points[1] , ", "
                         ,game.points[2] , ", "
                         ,game.points[3] , ", "
                         ,game.points[0] , "); "

                    );
            */
                    sql = sql + "Insert into speldb.playedgame values (DEFAULT, (select nightid from night ORDER BY nightid DESC limit 1) ,"
                        + $scope.gameName[game.game] + ", " + game.gid + ", "
                        + game.points[0] + ", "
                        + game.points[1] + ", "
                        + game.points[2] + ", "
                        + game.points[3] + ", "
                        + game.points[0] + "); ";
                });

            });
        });
        console.log(sql);
    }

    $scope.httpService.loadNightsBySeason(function(data) {
        //console.log(data.nights);
        $scope.nights = data.nights;
    });

	$scope.navType = 'pills';

	$scope.calculateGraphValues = function () {

		angular.forEach($scope.seasons, function (season, index) {
			var i = 0;
			season.graphData = new Object();
			season.graphData["data"] = new Object();
			season.graphData["data"]["cols"] = [
            {
            	"id": "day",
            	"label": "Day",
            	"type": "string"
            },
            {
            	"id": "daniel-id",
            	"label": "Daniel",
            	"type": "number"
            },
            {
            	"id": "johan-id",
            	"label": "Johan",
            	"type": "number"
            },
            {
            	"id": "marcus-id",
            	"label": "Marcus",
            	"type": "number"
            },
            {
            	"id": "mattias-id",
            	"label": "Mattias",
            	"type": "number"
            },
			{
				"id": "stefan-id",
				"label": "Stefan",
				"type": "number"
			}
			];
			season.graphData["options"] = {
				"title": "Average",
				"isStacked": "true",
				"fill": 20,
				"displayExactValues": true,
				"vAxis": {
					"title": "Point",
					"gridlines": {
						"count": 10
					}
				},
				"hAxis": {
					"title": "Date"
				}
			}
			season.graphData["type"] = "LineChart";
			season.graphData["displayed"] = true;
			season.graphData["cssStyle"] = "height:600px; width:100%;";
			season.agg = [];
			
			season.graphData["data"]["rows"] = [];
			angular.forEach(season.nights, function (night, key) {
				season.agg[i] = new Object();
				season.agg[i].points = [0,0,0,0,0];
				season.agg[i].gamesPlayed = [0, 0, 0, 0, 0];
				season.agg[i].avg = [0, 0, 0, 0, 0];
				angular.forEach(night.endPoints, function (player, index) {
					season.agg[i].points[index] += player;
					if (i != 0) {
						season.agg[i].points[index] += season.agg[i-1].points[index];
						season.agg[i].gamesPlayed[index] += season.agg[i - 1].gamesPlayed[index];
					}
					if (player != 0) {
						season.agg[i].gamesPlayed[index]++;
					}
					if (season.agg[i].gamesPlayed[index] != 0) {
						season.agg[i].avg[index] = season.agg[i].points[index] / season.agg[i].gamesPlayed[index];
					}
				});

				season.graphData["data"]["rows"].push({
					"c": [
						{
							"v": key
						},
						{
							"v": season.agg[i].avg[0]
						},
						{
							"v": season.agg[i].avg[1]
						},
						{
							"v": season.agg[i].avg[2]
						},
						{
							"v": season.agg[i].avg[3]
						},
						{
							"v": season.agg[i].avg[4]
						}
					]
				});
				i++;
			});
			
		});
	}


	$scope.chartReady = function () {
		fixGoogleChartsBarsBootstrap();

	};
	$scope.resizeGraph = function () {
		$(window).trigger("resize");
		
	};
	function fixGoogleChartsBarsBootstrap() {
		// Google charts uses <img height="12px">, which is incompatible with Twitter
		// * bootstrap in responsive mode, which inserts a css rule for: img { height: auto; }.
		// *
		// * The fix is to use inline style width attributes, ie <img style="height: 12px;">.
		// * BUT we can't change the way Google Charts renders its bars. Nor can we change
		// * the Twitter bootstrap CSS and remain future proof.
		// *
		// * Instead, this function can be called after a Google charts render to "fix" the
		// * issue by setting the style attributes dynamically.

		$(".google-visualization-table-table img[width]").each(function (index, img) {
			$(img).css("width", $(img).attr("width")).css("height", $(img).attr("height"));
		});
	};

/*
	function counting() {
		var root = $(document.getElementsByTagName('body'));
		var watchers = [];

		var f = function (element) {
			if (element.data().hasOwnProperty('$scope')) {
				angular.forEach(element.data().$scope.$$watchers, function (watcher) {
					watchers.push(watcher);
				});
			}

			angular.forEach(element.children(), function (childElement) {
				f($(childElement));
			});
		};

		f(root);

		console.log(watchers.length);
	};
	window.setTimeout(counting, 5000);
*/
};
