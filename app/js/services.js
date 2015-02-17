var servicesModule = angular.module('servicesModule', []);

servicesModule.factory('filterService', function() {
  return {
    excludeOneNoise: function(excludedNoises, layerName) {
      var i = excludedNoises.indexOf(layerName)
      if (i == -1) {
        excludedNoises.push(layerName);
      } else {
        excludedNoises.splice(i, 1);
      }
    },
    excludeAllNoises: function(status) {
      if (status) {
        excludedNoises = [
          'transit',
          'dump',
          'fireStation',
          'college',
          'school',
          'policeStation',
          'hospital',
          'bar',
          'construction',
          'demolition',
          'noiseComplaints',
          'stadium',
          'freeway',
          'heliportOrAirport'
        ];
      } else {
        excludedNoises = [];
      }
      return excludedNoises;
    },
    showAllD3Elements: function(status) {
      var svgs = angular.element(document.getElementsByTagName('svg'));
      if (status) {
        svgs.removeClass('hide');
      } else {
        svgs.addClass('hide');
      }
    },
    toggleSwitches: function(status) {
      var checkboxes = [];
      var wrapper = document.getElementsByClassName('map-options')[0];
      checkboxes = wrapper.getElementsByTagName('input');

      for (var i = 0; i < checkboxes.length; i++)  {
        checkboxes[i].checked = status;
      }

      var switches = document.getElementsByClassName('switch');
      for (var i = 0; i < switches.length; i++) {
        if (status) {
          angular.element(switches[i]).removeClass('switched-off');
        } else {
          angular.element(switches[i]).addClass('switched-off');
        }
      }
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
        map: scope.map,
        zIndex: 100
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
      // http://54.191.247.160
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
          nearbyNoises += '<p><span class="glyphicon glyphicon-' +
                          target_noise.icon +
                          ' score-icon"></span><strong>' +
                          target_noise.noise_type + '</strong>';

          if (target_noise.details != null) {
            nearbyNoises += '<ul>';
            for (var i = 0; i < target_noise.details.length; i++) {
              nearbyNoises += '<li>' + target_noise.details[i] + '</li>';
            }
            nearbyNoises += '</ul>';
          }
          nearbyNoises += '</p>';
        }

        var scoreType;
        if (data.score == 'A') {
          scoreType = 'good-score';
        } else if (data.score == 'F') {
          scoreType = 'bad-score';
        } else {
          scoreType = 'med-score';
        }

        var contentString = '<div id="content">' +
          '<div id="siteNotice">' +
          '</div>' +
          '<h1 id="firstHeading" class="firstHeading text-center">Location Score</h1>' +
          '<div id="bodyContent">' +
          '<h2 class="text-center ' +
          scoreType +
          '">' + data.score + '</h2>'+
          nearbyNoises +
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
        maxIntensity: 30,
        zIndex: 95
      });

      return layer;
    },
    createD3Points: function(data) {
      // Set Up Overlay
      var overlay = new google.maps.OverlayView();

      // Remove Freeways from Data
      var d3Points = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].noise_type != 'freeway') {
          d3Points.push(data[i]);
        };
      }

      // Add the container when the overlay is added to the map.
      overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget)
          .append("div")
          .attr("class", "noises");

        // Draw each marker as a separate SVG element.
        overlay.draw = function() {
          var projection = this.getProjection(),
              padding = 200;

          var marker = layer.selectAll("svg")
              .data(d3.entries(d3Points))
              .each(transform) // update existing markers
            .enter().append("svg:svg")
              .each(transform)
              .attr("class", findClass);

          // Add a circle.
          marker.append("svg:circle")
              // .attr("r", 4.5)
              .attr("r", findRadius)
              .attr("cx", padding)
              .attr("cy", padding);

            //  How do I add this to the map as a whole when the markers haven't been created yet?
          // scope.map.event.addListener(marker, 'click', function(){
          //   console.log("It worked!");
          // });

          function transform(d) {
            d = new google.maps.LatLng(d.value.lat, d.value.lon);
            d = projection.fromLatLngToDivPixel(d);
            return d3.select(this)
                .style("left", (d.x - padding) + "px")
                .style("top", (d.y - padding) + "px");
          }

          function findClass(d) {
            return d.value.noise_type;
          }

          function findRadius(d) {
            return d.value.display_reach;
          }
        };
      };
      return overlay;
    },
    radiusMath: function(radius, originalZoom, newZoomLevel) {
      if (originalZoom > newZoomLevel) {
        return radius / 2;
      } else {
        return radius * 2;
      }
    },
    adjustRadius: function(mapZoomLevel, newZoomLevel) {
      var circles = document.getElementsByTagName('circle');
      for (var i = 0; i < circles.length; i++) {
        var circle = circles[i];
        var newRadius = this.radiusMath(circle.r.baseVal.value, mapZoomLevel, newZoomLevel);
        angular.element(circle).attr('r', newRadius);
      }
    }
  }
});
