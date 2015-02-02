var homeControllerModule = angular.module('homeControllerModule', []);

homeControllerModule.controller('homeController', ['$scope', '$http', 'sortLayerArrays',
  function($scope, $http, sortLayerArrays) {

    var mapOptions = {
      center: { lat: 47.6, lng: -122.3},
      zoom: 13
    };

    var marker;
    var markers = [];

    // Create & Add Map
    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // Fetch Noises From API and Process Into Layers
    $http.get('http://localhost:3000/').success(function(data) {
      var allLayers = {
        fireStations: [],
        colleges: [],
        schools: [],
        hospitals: [],
        bars: [],
        policeStations: [],
        transit: [],
        dumps: []
      };

      // Sort Data into allLayers
      sortLayerArrays.go(data, allLayers);
      
      // Create Heatmap Layer Function
      var createLayer = function(heatmapName) {
        $scope[heatmapName] = new google.maps.visualization.HeatmapLayer({
          data: allLayers[heatmapName]
        });
        
        $scope[heatmapName].setMap($scope.map);
      }

      // Toggle Layer Function
      $scope.toggleLayer = function(layerName) {
        layerName.setMap(layerName.getMap() ? null : $scope.map);
      }

      // Create Heatmap Layers from allLayers
      for (var heatmapData in allLayers){
        createLayer(heatmapData);
      }
    });

    var clearMarkers = function() {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    };

    var createMarker = function(coordinates) {
      marker = new google.maps.Marker({
        position: coordinates,
        map: $scope.map
      });

      markers.push(marker);
    }

    var addMarkerToMap = function() {
      $scope.map.setZoom(15);
      $scope.map.setCenter(marker.getPosition());
    };

    $scope.findLocation = function() {
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.locationSearch + ',+Seattle,+WA&key=APIKEYHERE';
      
      $http.get(url).success(function(data) {
        clearMarkers();
        createMarker(data.results[0].geometry.location);
        addMarkerToMap();
      });
    }
  }]);
