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
var circleMap = new google.maps.Circle(null);
var markers = [];
var locations;

function initialize() {
  //Map start location
  var newyork = new google.maps.LatLng(40.7127,74.0059);
  //initialize and center map
  map = new google.maps.Map(document.getElementById('map'), {
      center: newyork,
      zoom: 15
    });
  //Search request
  var request = {
    query: 'Pizza in new york'
  };
  //Preform search
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);

  /*
  drawCircle();

  $('#lat, #lng, #radius').on('input', function(){
    drawCircle();
  });
  */
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var LatLonList = [results.length];
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      //console.log(results[i]);

      marker = new google.maps.Marker({
        position: results[i].geometry.location,
        map: map,
        title: results[i].name
      });

      markers.push(marker);

      LatLonList[i] = new google.maps.LatLng(results[i].geometry.location.k,results[i].geometry.location.B);
    }
    locations = results;

    //Move the map so that all markers are in view
    var bounds = new google.maps.LatLngBounds();

    for(var i =0, LtLgLen = LatLonList.length; i < LtLgLen; i++){
      bounds.extend(LatLonList[i]);
    }

    map.fitBounds(bounds);
  }
}

function genCSV(){
  if(locations.length > 0){
    var output = "<title>Locations</title>";
    output += "<p>\"name\",\"longitude\",\"latitude\"";
    for(var i = 0; i < locations.length; i++){
      output += "</br>\"" + locations[i].name +
        "\"," + locations[i].geometry.location.B +
        "," + locations[i].geometry.location.k;
    }
    output += "</p>";
    window.open('data:text/html;charset=utf-8,' + output)
  }
}

function mapSearch(type, location) {
  markers.forEach(function(e){
    e.setMap(null);
  });
  service = new google.maps.places.PlacesService(map);
  var request = {
    query: type + " in " + location
  }
  service.textSearch(request, callback);
}

function newMapSearch(){
  mapSearch(
    document.getElementById('type').value,
    document.getElementById('location').value
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
