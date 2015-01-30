'use strict';

/* jasmine specs for controllers go here */
describe('Home Controllers', function() {

  describe('homeController', function(){

    var scope, ctrl, $httpBackend;

    beforeEach(module('noiseScoreApp'));
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('homeController', {$scope: scope});
    }));


    it('should assign $scope.hello', function() {
      expect(scope.hello).toEqual('Noise!!');
    });

  });
});
