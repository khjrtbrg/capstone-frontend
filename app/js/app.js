'use strict';

var noiseScoreApp = angular.module('noiseScoreApp', [
  'ui.router',
  'mapControllerModule',
  'servicesModule',
  'ui.bootstrap'
]);

noiseScoreApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('map', {
      url: '/',
      templateUrl: 'app/views/map.html'
    })
  $urlRouterProvider.otherwise('/');
});
