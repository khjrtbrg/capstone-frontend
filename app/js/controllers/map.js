var mapControllerModule = angular.module('mapControllerModule', []);

mapControllerModule.controller('mapController', ['$scope', '$http', 'newLayerService', 'locationService', 'filterService',
  function($scope, $http, newLayerService, locationService, filterService) {

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
                padding = 10;

            var marker = layer.selectAll("svg")
                .data(d3.entries(d3Points))
                .each(transform) // update existing markers
              .enter().append("svg:svg")
                .each(transform)
                .attr("tooltip", findClass)
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


    //////////////////////////////////////////////////
    // Functions for Setting Up Layers/Filtering    //
    //////////////////////////////////////////////////

    // Create Heatmap Layer
    var createLayer = function() {
      var newPoints = newLayerService.setupLayer($scope.dataPoints, $scope.excludedNoises);
      $scope.heatmap = newLayerService.createLayer(newPoints);
      $scope.heatmap.setMap($scope.map);
    }

    // Re-Render Heatmap on Filter
    var reRenderHeatmap = function() {
      $scope.heatmap.setMap(null);
      createLayer();
    }


    //////////////////////////////////////////////////
    // Functions for Toggling Single Layer          //
    //////////////////////////////////////////////////

    // Toggle Individual Noises
    $scope.toggleNoises = function(layerName) {
      filterService.excludeOneNoise($scope.excludedNoises, layerName);
      reRenderHeatmap();

      if (layerName != 'freeway') {
        var noises = document.getElementsByClassName(layerName);
        angular.element(noises).toggleClass('hide');
      };
    }

    // Changing filter/switch background color
    $scope.changeColor = function($event) {
      var switchDiv = angular.element($event.toElement.nextElementSibling);
      switchDiv.toggleClass("switched-off");
    }


    //////////////////////////////////////////////////
    // Functions for Toggling All Layers            //
    //////////////////////////////////////////////////

    // // Toggle Heatmap
    // $scope.toggleHeatmap = function() {
    //   $scope.heatmap.setMap($scope.heatmap.getMap() ? null : $scope.map);
    // }

    // Hide All Noises
    $scope.hideAll = function() {
      if ($scope.excludedNoises.length < 14) {
        showAllLayers(false);
      };
    }

    // Show All Noises
    $scope.showAll = function() {
      showAllLayers(true);
    }

    // All the things that happen when you toggle all layers
    var showAllLayers = function(status) {
      filterService.toggleSwitches(status);
      $scope.excludedNoises = filterService.excludeAllNoises(!status);
      
      reRenderHeatmap();
      filterService.showAllD3Elements(status);
    }


    //////////////////////////////////////////////////
    // Functions for Searching for Locations        //
    //////////////////////////////////////////////////

    // Zoom Map to Searched Location
    $scope.markers = [];
    $scope.popups = [];

    // Zoom to Location Function
    $scope.findLocation = function() {
      var url = 'http://54.191.247.160/coordinates?address=' + $scope.locationSearch;

      $http.get(url).
        success(function(data) {
          $scope.address_error = '';
          locationService.newMarker(data, $scope);
        }).
        error(function(data, status, headers, config) {
          $scope.address_error = 'Whoops, can\'t find that address!';
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
