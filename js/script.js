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
var circleMap = new google.maps.Circle(null);
var markers = [];

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
  drawCircle();

  $('#lat, #lng, #radius').on('input', function(){
    drawCircle();
  });
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      console.log(results[i]);
      marker = new google.maps.Marker({
        position: results[i].geometry.location,
        map: map,
        title: results[i].name
      });
      markers.push(marker);
    }
  }
}

function mapSearch(location, query, radius) {
  markers.forEach(function(e){
    e.setMap(null);
  });
  service = new google.maps.places.PlacesService(map);
  var request = {
    location: location,
    radius: radius,
    query: query
  }
  service.textSearch(request, callback);
}

function newMapSearch(){
  mapSearch(
    new google.maps.LatLng(document.getElementById('lat').value, document.getElementById('lng').value),
    document.getElementById('query').value,
    document.getElementById('radius').value
  )
}

function drawCircle(){
  circleMap.setMap(null);
  var circle = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.4,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0.20,
      map: map,
      center: new google.maps.LatLng(document.getElementById('lat').value, document.getElementById('lng').value),
      radius: parseInt(document.getElementById('radius').value)
    };
    circleMap = new google.maps.Circle(circle);
}

google.maps.event.addDomListener(window, 'load', initialize);
