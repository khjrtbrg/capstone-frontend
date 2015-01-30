'use strict';

describe('Home Controllers', function() {

  describe('homeController', function(){

    var scope, ctrl, $httpBackend;
    var noise_array = [{
          noise_type: 'Traffic',
          lat: 44,
          lon: 122,
          decibel: 50,
          reach: 100,
          seasonal: false
        }];

    beforeEach(module('noiseScoreApp'));
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('http://localhost:3000/').
        respond(noise_array);

      scope = $rootScope.$new();
      ctrl = $controller('homeController', {$scope: scope});
    }));


    it('should assign $scope.hello', function() {
      expect(scope.hello).toEqual('Noise!!');
    });

    it('should assign $scope.noiseArray', function() {
      $httpBackend.flush();
      expect(scope.noiseArray).toEqual(noise_array);
    })

  });
});
