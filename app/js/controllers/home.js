var homeControllerModule = angular.module('homeControllerModule', []);

homeControllerModule.controller('homeController', ['$scope', '$http', function($scope, $http) {
  $scope.hello = "Noise!!";

}]);
