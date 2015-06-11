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

  google.maps.event.addListener(map, 'click', clearAllInfo);
  //Search request
  var request = {
    query: 'Pizza in new york'
  };
  //Preform search
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function clearAllInfo(){
  markers.forEach(function(marker){
    marker.info.close(map,marker);
  });
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var LatLonList = [results.length];
    for (var i = 0; i < results.length; i++) {
      var place = results[i];

      marker = new google.maps.Marker({
        position: results[i].geometry.location,
        map: map,
        title: results[i].name,
        animation: google.maps.Animation.DROP
      });

      var infoContent = "<strong>" + marker.title +
        "</strong><br /><hr />Latitude: " +
        marker.position.A + "<br />Longitude: " +
        marker.position.F;

      if(typeof results[i].price_level !== 'undefined'){
        infoContent += "<br />Price Level: " + results[i].price_level;
      }
      if(typeof results[i].rating !== 'undefined'){
        infoContent += "<br />Rating: " + results[i].rating;
      }

      marker.info = new google.maps.InfoWindow({
        content: infoContent
      });

      //add a listener for the markers
      google.maps.event.addListener(marker, 'click',
      (function (marker) {
        return function() {
          clearAllInfo();
          map.setCenter(new google.maps.LatLng(marker.position.lat(), marker.position.lng()));
          map.setZoom(15); // good zoom level
          marker.info.open(map, marker);
        }
      })(marker));

      markers.push(marker);
      //add point to a list to find the bounds of the map later
      LatLonList[i] = new google.maps.LatLng(results[i].geometry.location.lat(),results[i].geometry.location.lng());
    }
    locations = results;

    //Move the map so that all markers are in view
    var bounds = new google.maps.LatLngBounds();

    for(var i = 0; i < LatLonList.length; i++){
      bounds.extend(LatLonList[i]);
    }

    map.fitBounds(bounds);
  }
}

function genCSV(){
  if(locations.length > 0){
    var output = "\"name\",\"latitude\",\"longitude\",\"price_level\",\"rating\"";
    for(var i = 0; i < locations.length; i++){
      var price = locations[i].price_level;
      var rating = locations[i].rating;
      if(typeof price === 'undefined'){price = "N/A";}
      if(typeof rating === 'undefined'){rating = "N/A";}
      output += "\n\"" + locations[i].name +
        "\"," + locations[i].geometry.location.lat() +  //A = latitude
        "," + locations[i].geometry.location.lng() +    //F = longitude
        "," + price +
        "," + rating;
    }
    window.open('data:text/csv;charset=utf-8,' + escape(output))
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


function isEnter(keyEvent, func){
  if(keyEvent && keyEvent.keyCode == 13){
    func();
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
