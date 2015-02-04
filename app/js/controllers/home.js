var homeControllerModule = angular.module('homeControllerModule', []);

homeControllerModule.controller('homeController', ['$scope', '$http', 'layerService', 'locationService',
  function($scope, $http, layerService, locationService) {

    function initialize() {
      var mapOptions = {
        center: { lat: 47.6, lng: -122.3},
        zoom: 13
      };

      // Create & Add Map
      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


      // Fetch Noises From API and Process Into Layers
      $http.get('http://localhost:3000/').success(function(data) {

        function findRadius(radius) {
          // // Get the zoom level the user is currently at; radius must start as num of px at closest range; 1ft = 6px
          var current_zoom = $scope.map.getZoom();
          // Find the difference between where they currently are and the closest range zoom
          var no_of_divide_times = 21 - current_zoom
          // Divide by 2 for each new level of zoom
          if (no_of_divide_times != 0) {
            for (var i = 0; i < no_of_divide_times; i++) {
              radius = radius / 2
            }
          }
          // Return the adjusted value of the radius
          console.log(radius)
          return radius
        }

        // Sort Data into Layer Arrays
        var layers = layerService.setupLayers(data);

        // Create Heatmap Layers from Layer Arrays
        for (var layer in layers){
          layerService.createLayer($scope, layer, layers, findRadius);
        }

        // Toggle Layer Function
        $scope.toggleLayer = function(layerName) {
          layerName.setMap(layerName.getMap() ? null : $scope.map);
        }
      });
    }

    // Zoom Map to Searched Location
    var markers = [];

    // Zoom to Location Function
    $scope.findLocation = function() {
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.locationSearch + ',+Seattle,+WA&key=AIzaSyCY7E9oBmlcDOJ4iBR1aL3PYp5feIpQ0KE';

      $http.get(url).success(function(data) {
        var coordinates = data.results[0].geometry.location;
        locationService.newMarker(coordinates, $scope, markers);
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
          locationService.newMarker(coordinates, $scope, markers);
        });
      }
    };

    // initialize map
    google.maps.event.addDomListener(window, 'load', initialize());

  }]);
