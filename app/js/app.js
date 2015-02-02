'use strict';

var noiseScoreApp = angular.module('noiseScoreApp', [
  'ui.router',
  'homeControllerModule',
  'servicesModule'
]);

noiseScoreApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/views/home.html',
    })
  $urlRouterProvider.otherwise('/');
});