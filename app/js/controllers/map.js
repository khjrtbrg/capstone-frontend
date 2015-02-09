var mapControllerModule = angular.module('mapControllerModule', []);

mapControllerModule.controller('mapController', ['$scope', '$http',
  function($scope, $http) {

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
        var overlay = new google.maps.OverlayView();

        // Add the container when the overlay is added to the map.
        overlay.onAdd = function() {
          var layer = d3.select(this.getPanes().overlayLayer).append("div")
              .attr("class", "stations");

          // Draw each marker as a separate SVG element.
          overlay.draw = function() {
            var projection = this.getProjection(),
                padding = 10;

            var marker = layer.selectAll("svg")
                .data(d3.entries(data))
                .each(transform) // update existing markers
              .enter().append("svg:svg")
                .each(transform)
                .attr("class", "marker");

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
          };
        };

        // Bind our overlay to the map…
        overlay.setMap($scope.map);
      });
    }

    // initialize map
    google.maps.event.addDomListener(window, 'load', initialize());

  }]);
