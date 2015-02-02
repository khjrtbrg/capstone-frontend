var servicesModule = angular.module('servicesModule', []);

servicesModule.factory('sortLayerArrays', function() {
  return { 
    go: function(noiseArray, allLayers) {
      for (var i = 0; i < noiseArray.length; i++) {
        var location = noiseArray[i];
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
    }
  }
});