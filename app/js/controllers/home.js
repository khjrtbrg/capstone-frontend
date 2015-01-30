var homeControllerModule = angular.module('homeControllerModule', []);

homeControllerModule.controller('homeController', ['$scope', '$http',
  function($scope, $http) {
    $scope.hello = 'Noise!!';

    var mapOptions = {
      center: { lat: 47.6, lng: -122.3},
      zoom: 11
    };

    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    $http.get('http://localhost:3000/').success(function(data) {
      $scope.noiseArray = data;
      var allLayers = {
        fireStations: [],
        colleges: [],
        schools: [],
        trolley: [],
        buses: [],
        hospitals: [],
        bars: [],
        policeStations: [],
        transitCenters: [],
        dumps: []
      };

      for(var i = 0; i < $scope.noiseArray.length; i++) {
        var location = $scope.noiseArray[i];
        var latLon = new google.maps.LatLng(location.lat, location.lon);
        if (location.noise_type === "Transit Center"){
          allLayers.transitCenters.push({location: latLon, weight: 11});
          }
        else if (location.noise_type === "Dump") {
          allLayers.dumps.push({location: latLon, weight: 10});
        }
        else if (location.noise_type === "Fire Station"){
          allLayers.fireStations.push({location: latLon, weight: 14});
        }
        else if (location.noise_type === "College"){
          allLayers.colleges.push({location: latLon, weight: 11});
        }
        else if (location.noise_type === "School"){
          allLayers.schools.push({location: latLon, weight: 9});
        }
        else if (location.noise_type === "Trolley"){
          allLayers.trolley.push({location: latLon, weight: 8});
        }
        else if (location.noise_type === "Bus Stop"){
          allLayers.buses.push({location: latLon, weight: 10});
        }
        else if (location.noise_type === "Police Station"){
          allLayers.policeStations.push({location: latLon, weight: 14});
        }
        else if (location.noise_type === "Hospital"){
          allLayers.hospitals.push({location: latLon, weight: 14});
        }
        else if (location.noise_type === "Bars"){
          allLayers.bars.push({location: latLon, weight: 10});
        }
      }

      for (var heatmapData in allLayers){
        console.log(heatmapData)
        var heatmap = new google.maps.visualization.HeatmapLayer({
          data: allLayers[heatmapData]
        });
        heatmap.setMap($scope.map);
      }
    });


  // google.maps.event.addDomListener(window, 'load', initialize);

  }]);
