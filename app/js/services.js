var servicesModule = angular.module('servicesModule', []);

servicesModule.factory('layerService', function() {
  return {
    findRadius: function(map, radius) {
      // Get the zoom level the user is currently at; radius must start as num of px at closest range; 1ft = 6px
      var current_zoom = map.getZoom();

      // Find the difference between where they currently are and the closest range zoom
      var no_of_divide_times = 21 - current_zoom;

      // Divide by 2 for each new level of zoom
      if (no_of_divide_times > 0) {
        for (var i = 0; i < no_of_divide_times; i++) {
          radius = radius / 2;
        }
      }

      // Round to nearest whole number to make Google's API happy
      var newRadius = Math.round(radius);
      return newRadius;
    }
  }
});

servicesModule.factory('locationService', ['$http', function($http) {
  return {
    newMarker: function(coordinates, scope) {
      // Clear Any Current Markers
      for (var i = 0; i < scope.markers.length; i++) {
        scope.markers[i].setMap(null);
      }
      scope.markers = [];

      // Create New Marker
      marker = new google.maps.Marker({
        position: coordinates,
        map: scope.map
      });
      scope.markers.push(marker);

      // Zoom To New Marker
      scope.map.setZoom(15);
      scope.map.panTo(marker.getPosition());

      // Add Popup
      this.scorePopup(coordinates, scope);
    },
    scorePopup: function(coordinates, scope) {
      var url = 'http://localhost:3000/score?latitude=' + coordinates.lat + '&longitude=' + coordinates.lng

      $http.get(url).success(function(data) {
        // Clear Any Current Popups
        for (var i = 0; i < scope.popups.length; i++) {
          scope.popups[i].setMap(null);
        }
        scope.popups = [];

        // Create Score String
        var nearbyNoises = '';
        for (var noise in data.noises) {
          target_noise = data.noises[noise]
          nearbyNoises += '<p><strong>' + target_noise.count + ' ' + target_noise.noise_type + '</strong>';

          if (target_noise.details != null) {
            nearbyNoises += '<ul>';
            for (var i = 0; i < target_noise.details.length; i++) {
              nearbyNoises += '<li>' + target_noise.details[i] + '</li>';
            }
            nearbyNoises += '</ul>';
          }
          nearbyNoises += '</p>';
        }

        var contentString = '<div id="content">' +
          '<div id="siteNotice">' +
          '</div>' +
          '<h1 id="firstHeading" class="firstHeading">Location Noise Score</h1>' +
          '<div id="bodyContent">' +
          '<h2 class="text-center">' + data.score + '</h2>'+
          '<ul>' + nearbyNoises + '</ul>'
          '</div>' +
          '</div>';

        // Create InfoWindow
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        scope.popups.push(infowindow);

        // Add InfoWindow to Marker
        infowindow.open(scope.map,marker);
      });
    }
  }
}]);

servicesModule.factory('newLayerService', function() {
  return {
    setupLayer: function(apiResponse, excludedNoiseTypes) {
      var noiseArray = [];

      for (var i = 0; i < apiResponse.length; i++) {
        var location = apiResponse[i];
        var latLon = new google.maps.LatLng(location.lat, location.lon);
        var type = location.noise_type;
        var adjustedWeight = location.decibel * 0.15

        if (excludedNoiseTypes.indexOf(type) == -1) {
          noiseArray.push({location: latLon, noiseType: type, weight: adjustedWeight});
        }
      }

      return noiseArray;
    },
    createLayer: function(points) {
      var layer = new google.maps.visualization.HeatmapLayer({
        data: points,
        maxIntensity: 30
      });

      return layer;
    }
  }
});
