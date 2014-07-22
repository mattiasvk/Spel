angular.module('scoreApp', ['ui.bootstrap', 'httpModule'])
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

var scoreController = function ($scope, httpService, $filter) {
	$scope.filteredItems = [];
	$scope.totals = [0,0,0,0,0];
	$scope.averages = [0, 0, 0, 0, 0];
	$scope.gameFilter = {};
	$scope.avgFilter = {};
	$scope.predicate = 'game';
	$scope.reverse = false;

	$scope.applyFilter = function () {
		$scope.totals = [0,0,0,0,0];
		$scope.averages = [0, 0, 0, 0, 0];
		$scope.noOfGames = [0, 0, 0, 0, 0];
		$scope.filteredItems = $filter('filter')($scope.allGames, $scope.gameFilter);
		
		for (i = 0; i < $scope.filteredItems.length ; i += 1) {
			for (var j = 0; j < 5; j++) {
				$scope.totals[j] += $scope.filteredItems[i].points[j];
				if ($scope.filteredItems[i].points[j] != 0) { $scope.noOfGames[j]++; }
			}
		}
		for (var j = 0; j < 5; j++) {
			if ($scope.noOfGames[j] != 0) {
				$scope.averages[j] = $scope.totals[j] / $scope.noOfGames[j];
			}
		}
	};

	$scope.applyFilter2 = function () {
		$scope.filteredAvgItems = $filter('filter')($scope.avgGames, $scope.avgFilter);
	};

	$scope.httpService = httpService;
	$scope.httpService.loadAdmin(function (data) {
		$scope.$apply(function () {
			$scope.allGames = data.admin.games;
			$scope.avgGames = data.average;
			$scope.applyFilter();
			$scope.applyFilter2();
		});
	});
};
