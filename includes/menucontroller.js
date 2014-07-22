var menuController = function ($scope) {
	$scope.navType = 'pills';
	$scope.loadAdmin = function (flag) {
		if (!flag) {
			setTimeout(function () {
				window.location.href = "admin.html";
			});
		}
	};
	$scope.loadSpel = function (flag) {
		if (!flag) {
			setTimeout(function () {
				window.location.href = "index.html";
			});
		}
	};
	$scope.loadStats = function (flag) {
		if (!flag) {
			setTimeout(function () {
				window.location.href = "stats.html";
			});
		}
	};
	$scope.active = true;
};