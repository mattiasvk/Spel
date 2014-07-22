/*global $, angular, describe, beforeEach, module, inject */
//, numberPlanId, document, console, window, jQuery, CodeExpiry, Destination, DestinationDetails 

var myApp = angular.module('score', ['ui.bootstrap', 'httpModule']);
var games = [
	{ "season": "HT-2013", "date": "2013-08-20", "host": "Marcus", "game": "Settlers", "gid": 1, "positions": [1,2,5,4,3] }, // "points": [{ "Daniel": 10, "Johan": 7, "Marcus": 1, "Mattias": 2, "Stefan": 4 } },
	{ "season": "HT-2013", "date": "2013-08-20", "host": "Marcus", "game": "Poker", "gid": 2, "positions": [3,5,1,4,2] },// "points": { "Daniel": 4, "Johan": 1, "Marcus": 10, "Mattias": 2, "Stefan": 7 } },
	{ "season": "HT-2013", "date": "2013-08-20", "host": "Marcus", "game": "Plump Satsning", "gid": 3, "positions": [4,2,3,5,1] }, //"points": { "Daniel": 2, "Johan": 7, "Marcus": 4, "Mattias": 1, "Stefan": 10 } },
	{ "season": "HT-2013", "date": "2013-08-26", "host": "Johan", "game": "Alfapet", "gid": 1, "positions": [3, 1, 1, 4, 5] } //, "points": { "Daniel": 4, "Johan": 8.5, "Marcus": 8.5, "Mattias": 2, "Stefan": 1 } }
];
describe("scoreController", function ($scope) {
	//$scope, mnpService, mnpModificationService, countryService, $filter, dialogService

	var $http;

	beforeEach(module("score"));
	beforeEach(inject(function ($injector, httpService) {
		svc = httpService;
		$httpBackend = $injector.get('$httpBackend');
		$httpBackend.whenPOST(/loadGames/).
			respond(saveAll);
	}));

	beforeEach(inject(function ($rootScope, $http, $controller) {
		$scope = $rootScope.$new();
		$controller(scoreController, { $scope: $scope });
	}));

	it('should return load data', function () {
		$httpBackend.expectPOST(/loadGames/);
		svc.load(function (response) {
			//console.log(response);
		});
		//$httpBackend.flush();
//		expect(results[1].id).toBe(2);
	});

	function fillGamePositions(a, b, c, d, e) {
		var gamePositions = new Object();
		gamePositions = {
			"Daniel": a,
			"Johan": b,
			"Marcus": c,
			"Mattias": d,
			"Stefan": e
		};
		return gamePositions;
	}
	function fillGamePositions2(a, b, c, d, e) {
		var gamePositions = [a,b,c,d,e];
		return gamePositions;
	}
	function checkCalculatePointsPerGameResults(a, b) {
		if (a.Daniel == b[0] &&
			a.Johan == b[1] &&
			a.Marcus == b[2] &&
			a.Mattias == b[3] &&
			a.Stefan == b[4]
			)
			return true;
		else 
			return false;
	}
	function checkCalculatePointsPerGameResults2(a, b) {
		if (a[0] == b[0] &&
			a[1] == b[1] &&
			a[2] == b[2] &&
			a[3] == b[3] &&
			a[4] == b[4]
			)
			return true;
		else
			return false;
	}

	it('should calculatePointsPerGame(gamePositions) ', function () {
		var dest;
		dest = calculatePointsPerGame(fillGamePositions2(1, 2, 3, 4, 5));
		expect(checkCalculatePointsPerGameResults2(dest,[10,7,4,2,1])).toBe(true);
		console.log(dest);

		dest = calculatePointsPerGame(fillGamePositions2(1, 1, 3, 4, 5));
		expect(checkCalculatePointsPerGameResults2(dest, [8.5, 8.5, 4, 2, 1])).toBe(true);

		dest = calculatePointsPerGame(fillGamePositions2(1, 1, 3, 3, 0));
		expect(checkCalculatePointsPerGameResults2(dest, [8.5, 8.5, 3, 3, 0])).toBe(true);
	});

	it('should calculate()', function () {
		$scope.allGames = saveAll.admin.games;
		$scope.calculate();

		expect(checkCalculatePointsPerGameResults2($scope.seasons["HT-2013"].total, [56, 40, 67, 61, 61])).toBe(true);
		expect(checkCalculatePointsPerGameResults2($scope.seasons["HT-2012"].total, [55, 71.5, 45.5, 53, 63])).toBe(true);
		expect(checkCalculatePointsPerGameResults2($scope.seasons["VT-2014"].total, [16, 22, 15, 15, 28])).toBe(true);
	});
	
	it('should calculate2()', function () {
		$scope.allGames = games;
		$scope.calculate();
		expect(checkCalculatePointsPerGameResults2($scope.seasons["HT-2013"].total, [11, 11.5, 11.5, 3, 11])).toBe(true);
	});

	it('should calculate2()', function () {
		$scope.allGames = games;
		$scope.calculate();
		console.log(angular.toJson($scope.seasons));
		expect(checkCalculatePointsPerGameResults2($scope.seasons["HT-2013"].total, [11, 11.5, 11.5, 3, 11])).toBe(true);
	});

});
