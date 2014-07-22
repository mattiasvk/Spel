angular.module("httpModule", [])
	.factory("httpService", function () {
		return {
			loadMain: function (callback) {
				$.ajax({
					type: 'POST',
					url: 'loadGames.pl',
					dataType: 'json',
					data: { action: "request" },
					success: function (data) {
						//data = saveAll;
						callback(data);
					},
					error: function (data) {
						data = saveAllMain;
						callback(data);
						//alert("Failed loading games.");
					}
				});
			},
			loadAdmin: function (callback) {
				$.ajax({
					type: 'POST',
					url: 'loadGamesAdmin.pl',
					dataType: 'json',
					data: { action: "request" },
					success: function (data) {
						//data = saveAll;
						callback(data);
					},
					error: function (data) {
						data = saveAllAdmin;
						callback(data);
						//alert("Failed loading games.");
					}
				});
			},
			save: function (mainData, adminData, passwd, callback) {
				console.log(angular.toJson(mainData));
				console.log(angular.toJson(adminData));
				$.ajax({
					type: 'POST',
					url: 'saveGames.pl',
					dataType: 'text',
					data: { action: "request", main: angular.toJson(mainData), admin: angular.toJson(adminData), password: angular.toJson(passwd) },
					success: function (data) {
						alert(data);
					},
					error: function () {
						alert("Failed saving games.");
					}
				});
			}
		}
	});

