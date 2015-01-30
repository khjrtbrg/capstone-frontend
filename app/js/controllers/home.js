var homeControllerModule = angular.module('homeControllerModule', []);

homeControllerModule.controller('homeController', ['$scope', '$http',
  function($scope, $http) {
    $scope.hello = 'Noise!!';

    $http.get('http://localhost:3000/').success(function(data) {
      $scope.noiseArray = data;
    });

  }]);
