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

	$scope.httpService.loadMain(function(data) {
		$scope.$apply(function () {
			$scope.seasons = data.main.seasons;
			$scope.seasons['VT-2014'].active = true;
			$scope.calculateGraphValues();
		});
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
