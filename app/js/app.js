'use strict';

var noiseScoreApp = angular.module('noiseScoreApp', [
  'ui.router',
  'homeControllerModule',
  'mapControllerModule',
  'map2ControllerModule',
  'servicesModule',
  'ui.bootstrap'
]);

noiseScoreApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/views/home.html',
    })
    .state('map', {
      url: '/map',
      templateUrl: 'app/views/map.html'
    })
    .state('map2', {
      url: '/map2',
      templateUrl: 'app/views/map2.html'
    })
  $urlRouterProvider.otherwise('/');
});
