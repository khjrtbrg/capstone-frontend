var otherControllerModule = angular.module('otherControllerModule', []);

otherControllerModule.controller('aboutController', ['$scope',
  function($scope) {

    $scope.hello = 'oh hey there!';

}]);

otherControllerModule.controller('contactController', ['$scope',
  function($scope) {

    $scope.hello = 'oh hey there!';

}]);
