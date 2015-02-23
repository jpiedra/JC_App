var JCApp = angular.module('JCApp',[]);
JCApp.controller('AppCtrl', ['$scope', '$http', function ($scope, $http){
	console.log("Hello World from controller");
	
	$http.get('/myLevels').success(function(response){
		console.log("controller received level data");
		$scope.myLevels = response;
	});	
	
	$scope.addLevel = function(){
		if (typeof $scope.level.rA === "undefined" || typeof $scope.level.rB === "undefined" || typeof $scope.level.rC === "undefined" || 
			typeof $scope.level.rD === "undefined" || typeof $scope.level.rE === "undefined" || typeof $scope.level.rF === "undefined" || 
			typeof $scope.level.rG === "undefined" || typeof $scope.level.rH === "undefined" || typeof $scope.level.rI === "undefined" || 
			typeof $scope.level.rJ === "undefined" || typeof $scope.level.rK === "undefined" || typeof $scope.level.rL === "undefined") {
			console.log("Error: cannot process blank fields.");
			return false;
		} else {
			console.log($scope.level);
			rowData = [];
			//because a level entirely made of solid blocks would be disastrous. 
			spaceArr = [];
			spaceMinimum = 10;
			spaceAmount = 0;
			tempRowString = '';
			count_levelData = 0;
			count_rowData = 0;
			//push every value in level
			rowData.push($scope.level.rA);
			rowData.push($scope.level.rB);
			rowData.push($scope.level.rC);
			rowData.push($scope.level.rD);
			rowData.push($scope.level.rE);
			rowData.push($scope.level.rF);
			rowData.push($scope.level.rG);
			rowData.push($scope.level.rH);
			rowData.push($scope.level.rI);
			rowData.push($scope.level.rJ);
			rowData.push($scope.level.rK);
			rowData.push($scope.level.rL);
			
			for (count_levelData = 0; count_levelData < 12; count_levelData++){
				
				if (rowData[count_levelData].length !== 12){
					console.log("Error: row " + (count_levelData + 1) + " incomplete.");
					return false;
				};
			
			};
			$(".upload-form").append("<p class='upload-success'>Upload successful!</p>");
			$http.post('/myLevels', $scope.level);
		};
	};
	
}]);