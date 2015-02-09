var mapControllerModule = angular.module('mapControllerModule', []);

mapControllerModule.controller('mapController', ['$scope', '$http',
  function($scope, $http) {

    function initialize() {
      var mapOptions = {
        center: { lat: 47.6, lng: -122.35},
        zoom: 13,
        maxZoom: 17,
        minZoom: 10,
        zoomControlOptions: { style: 'small' },
        streetViewControl: false
      };

      // Create & Add Map
      $scope.map = new google.maps.Map(d3.select("#map-canvas").node(), mapOptions);

      // Fetch Noises From API and Add To Map
      d3.json("http://54.191.247.160/noises", function(data) {
        console.log(data);
        // process into D3 SVGs here!
      });

    }

    // initialize map
    google.maps.event.addDomListener(window, 'load', initialize());

  }]);
