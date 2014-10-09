// everything we need to javascript ...
// function initialize() {
//     var mapCanvas = document.getElementById('map');
//     var mapOptions = {
//       center: new google.maps.LatLng(44.5403, -78.5463),
//       zoom: 6,
//       mapTypeId: google.maps.MapTypeId.ROADMAP
//     }
//     var map = new google.maps.Map(mapCanvas, mapOptions);
//   }


var map;
var service;
var infowindow;
var locations;

function initialize() {
  var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

  var request = {
    location: pyrmont,
    radius: '500',
    query: 'store'
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      console.log(results[i]);
      new google.maps.Marker({
        position: results[i].geometry.location,
        map: map,
        title: results[i].name
      });
    }
    locations = results;
  }
}

function genCSV(){
  if(locations.length > 0){
    var output = "\"name\",\"longitude\",\"latitude\"";
    for(var i = 0; i < locations.length; i++){
      output += "\n\"" + locations[i].name +
        "\"," + locations[i].geometry.location.B +
        "," + locations[i].geometry.location.k;
    }
    document.getElementById('CSVOutput').value = output;
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
