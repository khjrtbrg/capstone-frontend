var homeControllerModule = angular.module('homeControllerModule', []);

homeControllerModule.controller('homeController', ['$scope', '$http',
  function($scope, $http) {
    $scope.hello = 'Noise!!';

    var mapOptions = {
      center: { lat: 47.6, lng: -122.3},
      zoom: 13
    };

    // Create & Add Map
    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // Fetch Noises From API and Process Into Layers
    $http.get('http://localhost:3000/').success(function(data) {
      $scope.noiseArray = data;
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

      for(var i = 0; i < $scope.noiseArray.length; i++) {
        var location = $scope.noiseArray[i];
        var type = location.noise_type;
        var latLon = new google.maps.LatLng(location.lat, location.lon);
        if (type === "Transit Center" || type === "Bus Stop" || type === "Trolley"){
          allLayers.transit.push({location: latLon, weight: 11});
        }
        else if (type === "Dump") {
          allLayers.dumps.push({location: latLon, weight: 10});
        }
        else if (type === "Fire Station") {
          allLayers.fireStations.push({location: latLon, weight: 14});
        }
        else if (type === "College") {
          allLayers.colleges.push({location: latLon, weight: 11});
        }
        else if (type === "School") {
          allLayers.schools.push({location: latLon, weight: 9});
        }
        else if (type === "Police Station") {
          allLayers.policeStations.push({location: latLon, weight: 14});
        }
        else if (type === "Hospital") {
          allLayers.hospitals.push({location: latLon, weight: 14});
        }
        else if (type === "Bars") {
          allLayers.bars.push({location: latLon, weight: 10});
        }
      }
      
      // Create Heatmap Layer Function
      var createLayer = function(heatmapName) {
        // Creates Layer
        $scope[heatmapName] = new google.maps.visualization.HeatmapLayer({
          data: allLayers[heatmapName]
        });
        
        // Adds Layer to Map
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

  }]);
