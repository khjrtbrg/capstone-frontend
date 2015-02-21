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
    .state('about', {
      url: '/about',
      templateUrl: 'app/views/about.html'
    })
    .state('contact', {
      url: '/contact',
      templateUrl: 'app/views/contact.html'
    })
    .state('api', {
      url: '/api',
      templateUrl: 'app/views/api.html'
    })
  $urlRouterProvider.otherwise('/');
});
