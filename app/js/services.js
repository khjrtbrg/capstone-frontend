var servicesModule = angular.module('servicesModule', []);

servicesModule.factory('layerService', function() {
  return {
    setupLayers: function(apiResponse) {
      var layers = {
        fireStations: {radius: 15, items: []},
        colleges: {radius: 16, items: []},
        schools: {radius: 10, items: []},
        hospitals: {radius: 25, items: []},
        bars: {radius: 10, items: []},
        policeStations: {radius: 15, items: []},
        transit: {radius: 10, items: []},
        dumps: {radius: 15, items: []},
        construction: {radius: 30, items: []},
        demolition: {radius: 30, items: []}
      };

      // Add API Response Data to Layers
      for (var i = 0; i < apiResponse.length; i++) {
        var location = apiResponse[i];
        var type = location.noise_type;
        var latLon = new google.maps.LatLng(location.lat, location.lon);
        if (type === "Transit Center" || type === "Bus Stop" || type === "Trolley"){
          layers.transit.items.push({location: latLon, weight: 11});
        }
        else if (type === "Dump") {
          layers.dumps.items.push({location: latLon, weight: 10});
        }
        else if (type === "Fire Station") {
          layers.fireStations.items.push({location: latLon, weight: 14});
        }
        else if (type === "College") {
          layers.colleges.items.push({location: latLon, weight: 11});
        }
        else if (type === "School") {
          layers.schools.items.push({location: latLon, weight: 9});
        }
        else if (type === "Police Station") {
          layers.policeStations.items.push({location: latLon, weight: 14});
        }
        else if (type === "Hospital") {
          layers.hospitals.items.push({location: latLon, weight: 14});
        }
        else if (type === "Bar") {
          layers.bars.items.push({location: latLon, weight: 10});
        }
        else if (type === "Construction") {
          layers.construction.items.push({location: latLon, weight: 16});
        }
        else if (type === "Demolition") {
          layers.demolition.items.push({location: latLon, weight: 16});
        }
      }

      return layers;
    },
    createLayer: function(scope, layer, layers) {
      // Make Layer & Add to Scope
      scope[layer] = new google.maps.visualization.HeatmapLayer({
        data: layers[layer].items,
        radius: layers[layer].radius
      });

      // Bars Won't Show Up Without maxIntensity
      if (layer == 'bars') {
        scope[layer].set('maxIntensity', 40);
      }
      // Add Layer to Map
      scope[layer].setMap(scope.map);
    }
  }
});

servicesModule.factory('locationService', function() {
  return {
    newMarker: function(coordinates, scope, markers) {
      // Clear Any Current Markers
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];

      // Create New Marker
      marker = new google.maps.Marker({
        position: coordinates,
        map: scope.map
      });
      markers.push(marker);

      // Zoom To New Marker
      scope.map.setZoom(15);
      scope.map.setCenter(marker.getPosition());
    }
  }
});
