var homeControllerModule = angular.module('homeControllerModule', []);

homeControllerModule.controller('homeController', ['$scope', '$http',
  function($scope, $http) {
    $scope.hello = 'Noise!!';

    var mapOptions = {
      center: { lat: 47.6, lng: -122.3},
      zoom: 13
    };

    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

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


      // Brute Force Filters
      // Transit
      $scope.transitHeatmap = new google.maps.visualization.HeatmapLayer({
        data: allLayers['transit']
      });
      
      $scope.transitHeatmap.setMap($scope.map);

      $scope.toggleTransit = function() {
        $scope.transitHeatmap.setMap($scope.transitHeatmap.getMap() ? null : $scope.map);
      }

      // Dumps
      $scope.dumpsHeatmap = new google.maps.visualization.HeatmapLayer({
        data: allLayers['dumps']
      });
      
      $scope.dumpsHeatmap.setMap($scope.map);

      $scope.toggleDumps = function() {
        $scope.dumpsHeatmap.setMap($scope.dumpsHeatmap.getMap() ? null : $scope.map);
      }

      // Fire Stations
      $scope.fireStationsHeatmap = new google.maps.visualization.HeatmapLayer({
        data: allLayers['fireStations']
      });
      
      $scope.fireStationsHeatmap.setMap($scope.map);

      $scope.toggleFireStations = function() {
        $scope.fireStationsHeatmap.setMap($scope.fireStationsHeatmap.getMap() ? null : $scope.map);
      }

      // Colleges
      $scope.collegesHeatmap = new google.maps.visualization.HeatmapLayer({
        data: allLayers['colleges']
      });
      
      $scope.collegesHeatmap.setMap($scope.map);

      $scope.toggleColleges = function() {
        $scope.collegesHeatmap.setMap($scope.collegesHeatmap.getMap() ? null : $scope.map);
      }

      // Schools
      $scope.schoolsHeatmap = new google.maps.visualization.HeatmapLayer({
        data: allLayers['schools']
      });
      
      $scope.schoolsHeatmap.setMap($scope.map);

      $scope.toggleSchools = function() {
        $scope.schoolsHeatmap.setMap($scope.schoolsHeatmap.getMap() ? null : $scope.map);
      }

      // Police Stations
      $scope.policeStationsHeatmap = new google.maps.visualization.HeatmapLayer({
        data: allLayers['policeStations']
      });
      
      $scope.policeStationsHeatmap.setMap($scope.map);

      $scope.togglePoliceStations = function() {
        $scope.policeStationsHeatmap.setMap($scope.policeStationsHeatmap.getMap() ? null : $scope.map);
      }

      // Hospitals
      $scope.hospitalsHeatmap = new google.maps.visualization.HeatmapLayer({
        data: allLayers['hospitals']
      });
      
      $scope.hospitalsHeatmap.setMap($scope.map);

      $scope.toggleHospitals = function() {
        $scope.hospitalsHeatmap.setMap($scope.hospitalsHeatmap.getMap() ? null : $scope.map);
      }

      // Bars
      $scope.barsHeatmap = new google.maps.visualization.HeatmapLayer({
        data: allLayers['bars']
      });
      
      $scope.barsHeatmap.setMap($scope.map);

      $scope.toggleBars = function() {
        $scope.barsHeatmap.setMap($scope.barsHeatmap.getMap() ? null : $scope.map);
      }
      

      // for (var heatmapData in allLayers){
      //   $scope[heatmapData] = new google.maps.visualization.HeatmapLayer({
      //     data: allLayers[heatmapData]
      //   });
      //   $scope[heatmapData].setMap($scope.map);

      //   // Filter Layer on Click
      //   $scope['toggle' + heatmapData] = function() {
      //     console.log('clicked on ' + heatmapData);
      //     $scope[heatmapData].setMap($scope[heatmapData].getMap() ? null : $scope.map);
      //   }
      // }
    });

  }]);
