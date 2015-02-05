var servicesModule = angular.module('servicesModule', []);

servicesModule.factory('layerService', function() {
  return {
    setupLayers: function(apiResponse) {
      var layers = {
        // fireStations: {radius: 15750, items: []},
        // colleges: {radius: 1000, items: []},
        // schools: {radius: 1000, items: []},
        // hospitals: {radius: 15750, items: []},
        // bars: {radius: 1000, items: []},
        // policeStations: {radius: 15750, items: []},
        transit: {radius: 4000, items: []},
        // dumps: {radius: 1500, items: []},
        // construction: {radius: 9054, items: []},
        // demolition: {radius: 15750, items: []}
      };


      // Add API Response Data to Layers
      for (var i = 0; i < apiResponse.length; i++) {
        var location = apiResponse[i];
        var type = location.noise_type;
        var latLon = new google.maps.LatLng(location.lat, location.lon);
        if (type === "Transit Center" || type === "Bus Stop" || type === "Trolley"){
          layers.transit.items.push({location: latLon, weight: 11});
        }
        // else if (type === "Dump") {
        //   layers.dumps.items.push({location: latLon, weight: 10});
        // }
        // else if (type === "Fire Station") {
        //   layers.fireStations.items.push({location: latLon, weight: 14});
        // }
        // else if (type === "College") {
        //   layers.colleges.items.push({location: latLon, weight: 11});
        // }
        // else if (type === "School") {
        //   layers.schools.items.push({location: latLon, weight: 9});
        // }
        // else if (type === "Police Station") {
        //   layers.policeStations.items.push({location: latLon, weight: 14});
        // }
        // else if (type === "Hospital") {
        //   layers.hospitals.items.push({location: latLon, weight: 14});
        // }
        // else if (type === "Bar") {
        //   layers.bars.items.push({location: latLon, weight: 10});
        // }
        // else if (type === "Construction") {
        //   layers.construction.items.push({location: latLon, weight: 16});
        // }
        // else if (type === "Demolition") {
        //   layers.demolition.items.push({location: latLon, weight: 16});
        // }
      }

      return layers;
    },

    createLayer: function(scope, layer, layers) {
      // Make Layer & Add to Scope
      scope[layer] = new google.maps.visualization.HeatmapLayer({
        data: layers[layer].items,
        radius: this.findRadius(scope.map, layers[layer].radius)
      });

      // Bars Won't Show Up Without maxIntensity
      if (layer == 'bars') {
        scope[layer].set('maxIntensity', 40);
      }
      
      // Add Layer to Map
      scope[layer].setMap(scope.map);
    },

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
      
      // Return the adjusted value of the radius
      return newRadius;
    }
  }
});

servicesModule.factory('locationService', ['$http', function($http) {
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
      scope.map.panTo(marker.getPosition());

      // Score Popup
      var url = 'http://localhost:3000/score?latitude=' + coordinates.lat + '&longitude=' + coordinates.lng
      
      $http.get(url).success(function(data) {

        console.log(data);
        var contentString = '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h1 id="firstHeading" class="firstHeading">Location Noise Score</h1>'+
          '<div id="bodyContent">'+
          '<h2 class="text-center">' + data.score + '</h2>'+
          '</div>'+
          '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        infowindow.open(scope.map,marker);
      });
    }
  }
}]);
