'use strict';

var noiseScoreApp = angular.module('noiseScoreApp', [
  'ui.router',
  'homeControllerModule',
  'mapControllerModule',
  'servicesModule'
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
  $urlRouterProvider.otherwise('/');
});