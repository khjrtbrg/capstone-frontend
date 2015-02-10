var map2ControllerModule = angular.module('map2ControllerModule', []);

map2ControllerModule.controller('map2Controller', ['$scope', '$http', 'layerService', 'locationService', 'newLayerService',
  function($scope, $http, layerService, locationService, newLayerService) {

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
      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

      // Fetch Noises From API and Process Into Layers
      $http.get('http://localhost:3000/noises').success(function(data) {
        // Saving Data to Scope Variable
        data;

        // Setup Excluded Filters Array
        $scope.excludedNoises = [];
        
        // Create Heatmap Layer
        createLayer(data);

        // Toggle Layer Function
        $scope.toggleLayer = function(layerName) {
          // Add or Remove Filter to excludedNoises
          var i = $scope.excludedNoises.indexOf(layerName)
          if (i == -1) {
            $scope.excludedNoises.push(layerName);
          } else {
            $scope.excludedNoises.splice(i, 1);
          }

          // Remove Old/Create New Heatmap Layer
          $scope.heatmap.setMap(null);
          createLayer(data);
        }

        // // Change Radius on Zoom
        // google.maps.event.addListener($scope.map, 'zoom_changed', function() {
        //   for (var i in layers) {
        //     var newRadius = layerService.findRadius($scope.map, layers[i].radius);
        //     $scope[layer].set('radius', newRadius);
        //   }
        // });
      });
    }

    var createLayer = function(data) {
      var newPoints = newLayerService.setupLayer(data, $scope.excludedNoises);
      $scope.heatmap = newLayerService.createLayer(newPoints);
      $scope.heatmap.setMap($scope.map);
    }

    // Zoom Map to Searched Location
    $scope.markers = [];
    $scope.popups = [];

    // Zoom to Location Function
    $scope.findLocation = function() {
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.locationSearch + ',+Seattle,+WA&key=AIzaSyCY7E9oBmlcDOJ4iBR1aL3PYp5feIpQ0KE';

      $http.get(url).success(function(data) {
        var coordinates = data.results[0].geometry.location;
        locationService.newMarker(coordinates, $scope);
      });
    };

    // Zoom to Current Location
    $scope.currentLocation = function(){
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          locationService.newMarker(coordinates, $scope);
        });
      }
    };

    // initialize map
    google.maps.event.addDomListener(window, 'load', initialize());

  }]);
