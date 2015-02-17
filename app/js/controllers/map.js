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

      // Disable/Enable Buttons
      $scope.hideAllButton = false;
      $scope.showAllButton = true;

      // Create & Add Map
      $scope.map = new google.maps.Map(d3.select("#map-canvas").node(), mapOptions);

      // Fetch Noises From API and Add To Map
      d3.json("http://54.191.247.160/noises", function(data) {
        $scope.dataPoints = data;
        $scope.excludedNoises = [];

        // Create Heatmap Layer
        createHeatmapLayer();
        $scope.heatmapOn = true;

        // Create D3 Points
        var overlay = newLayerService.createD3Points(data);
        // Bind D3 overlay to the map
        overlay.setMap($scope.map);
      });
    }


    //////////////////////////////////////////////////
    // Functions for Setting Up Layers/Filtering    //
    //////////////////////////////////////////////////

    // Create Heatmap Layer
    var createHeatmapLayer = function() {
      var newPoints = newLayerService.setupLayer($scope.dataPoints, $scope.excludedNoises);
      $scope.heatmap = newLayerService.createLayer(newPoints);
      $scope.heatmap.setMap($scope.map);
    }

    // Re-Render Heatmap on Filter
    var reRenderHeatmap = function() {
      if ($scope.heatmapOn) {
        $scope.heatmap.setMap(null);
        createHeatmapLayer();
      }
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

      if ($scope.excludedNoises.length == 14) {
        $scope.hideAllButton = true;
      } else if ($scope.excludedNoises.length == 0) {
        $scope.showAllButton = true;
      } else {
        $scope.hideAllButton = false;
        $scope.showAllButton = false;
      }
    }

    // Changing filter/switch background color
    $scope.changeColor = function($event) {
      var switchDiv = angular.element($event.toElement.nextElementSibling);
      switchDiv.toggleClass("switched-off");
    }


    //////////////////////////////////////////////////
    // Functions for Toggling All Layers            //
    //////////////////////////////////////////////////

    // Toggle Heatmap
    $scope.toggleHeatmap = function() {
      if ($scope.heatmap.getMap() == null) {
        $scope.heatmapOn = true;
        reRenderHeatmap();
        $scope.heatmap.setMap($scope.map);
      } else {
        $scope.heatmapOn = false;
        $scope.heatmap.setMap(null);
      }
    }

    // Hide All Noises
    $scope.hideAll = function() {
      if ($scope.excludedNoises.length < 14) {
        showAllLayers(false);

        $scope.hideAllButton = true;
        $scope.showAllButton = false;
      };
    }

    // Show All Noises
    $scope.showAll = function() {
      if ($scope.excludedNoises.length > 0) {
        showAllLayers(true);

        $scope.hideAllButton = false;
        $scope.showAllButton = true;
      }
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
