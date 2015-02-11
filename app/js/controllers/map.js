var mapControllerModule = angular.module('mapControllerModule', []);

mapControllerModule.controller('mapController', ['$scope', '$http', 'newLayerService', 'locationService',
  function($scope, $http, newLayerService, locationService) {

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
        // Create Heatmaps
        $scope.dataPoints = data;
        // Setup Excluded Filters Array
        $scope.excludedNoises = [];
        
        // Create Heatmap Layer
        createLayer();


        // Create D3 Points
        var overlay = new google.maps.OverlayView();

        // Add the container when the overlay is added to the map.
        overlay.onAdd = function() {
          var layer = d3.select(this.getPanes().overlayLayer).append("div")
              .attr("class", "noises");

          // Draw each marker as a separate SVG element.
          overlay.draw = function() {
            var projection = this.getProjection(),
                padding = 10;

            var marker = layer.selectAll("svg")
                .data(d3.entries(data))
                .each(transform) // update existing markers
              .enter().append("svg:svg")
                .each(transform)
                .attr("tooltip", "pineapple")
                .attr("tooltip-trigger", "click")
                .attr("class", findClass);

            // Add a circle.
            marker.append("svg:circle")
                .attr("r", 4.5)
                .attr("cx", padding)
                .attr("cy", padding);

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
          };
        };

        // Bind our overlay to the map…
        overlay.setMap($scope.map);
      });
    }


    // Toggle Noises Function
    $scope.toggleNoises = function(layerName) {
      // Add or Remove Filter to excludedNoises
      var i = $scope.excludedNoises.indexOf(layerName)
      if (i == -1) {
        $scope.excludedNoises.push(layerName);
      } else {
        $scope.excludedNoises.splice(i, 1);
      }

      // Remove Old/Create New Heatmap Layer
      $scope.heatmap.setMap(null);
      createLayer();

      // Hide Corresponding D3 Elements
      var noises = document.getElementsByClassName(layerName);
      angular.element(noises).toggleClass('hide');
    }

    // Create Heatmap Layer
    var createLayer = function() {
      var newPoints = newLayerService.setupLayer($scope.dataPoints, $scope.excludedNoises);
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


    // Initialize Map
    google.maps.event.addDomListener(window, 'load', initialize());

  }]);
