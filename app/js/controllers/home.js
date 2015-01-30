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
      var heatmapData = [];
      for(var i = 0; i < $scope.noiseArray.length; i += 1) {
        var location = $scope.noiseArray[i];
        var latLon = new google.maps.LatLng(location.lat, location.lon);
        heatmapData.push(latLon);
      }

      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
      });
      heatmap.setMap($scope.map);
    });


  // google.maps.event.addDomListener(window, 'load', initialize);

  }]);
