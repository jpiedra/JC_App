var JCApp = angular.module('JCApp',[]);
JCApp.controller('AppCtrl', ['$scope', '$http', function ($scope, $http){
	console.log("Hello World from controller");
	
	$http.get('/myLevels').success(function(response){
	
		console.log("controller received level data");
		$scope.myLevels = response;
	})	
	
}]);