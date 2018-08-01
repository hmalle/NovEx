
$(document).ready(function() {

  var map;
  var markerArray=[];
  var service; 
  function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.8716, lng: -122.2727 }, //initially center it around berkeley!
      zoom: 9
    });
  }

  $(".profileMap").hide();
	// Initialize Firebase
	var config = {
  	apiKey: "AIzaSyCXKNHRqS-OvGJ7ClQvWaJyf62CNlzzxkE",
  	authDomain: "novex-17441.firebaseapp.com",
  	databaseURL: "https://novex-17441.firebaseio.com",
  	projectId: "novex-17441",
  	storageBucket: "novex-17441.appspot.com",
  	messagingSenderId: "748623444399"
	};

	firebase.initializeApp(config);
	var database = firebase.database();
  setTimeout(function(){
    console.log("Initializing maps");
    initMap();
    initPage();
    service = new google.maps.places.AutocompleteService();
  },1000);

  function initPage(){
    database.ref().orderByChild("dateAdded").limitToLast(5).once("value", function(snapshot){
      snapshot.forEach(function(childSnapshot){
        var prof = {
          name: childSnapshot.val().name,
          trade : childSnapshot.val().trade,
          contact : childSnapshot.val().contact,
          bio : childSnapshot.val().bio,
        };
        displayProfile(prof);
        coordinates = childSnapshot.val().loc;
        var marker = new google.maps.Marker({ 
          animation: google.maps.Animation.DROP,
          //draggable: true,
          position: coordinates, 
          map: map
        });
        markerArray.push(marker);
        marker.setMap(map); //marker.setMap(null) //removes the marker!
      });
    },function(errorObject){ console.log("Errors handled: "+errorObject.code); });
  }

  $("#add-profile").on("click", function(event){
    // Prevents the page from reloading on click
    event.preventDefault();
    var expertName = $("#name").val().trim();
    var expertLoc ;
    var expertTrade = $("#tradeInput").val();
    var expertBio = $("#bio").val().trim();
    var expertContact = $("#contact").val().trim();
    var placeId;
    if( $("#loc").val().trim().length > 2 ){
      service.getQueryPredictions({input: $("#loc").val().trim() },function(predictions,status){
        if(status != google.maps.places.PlacesServiceStatus.OK) { return; }
        placeId = predictions[0].place_id;
      });
      setTimeout( function(){
        //wait 500milliseconds before calling getCoordinates
        expertLoc = getCoordinates(placeId);
        if(expertName != "" && expertLoc != undefined && expertBio != "" && expertContact != "") {
          // $('#errorModal').modal('hide');
          database.ref().push({
            name: expertName,
            loc: expertLoc,
            trade: expertTrade,
            bio: expertBio,
            contact: expertContact,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
          });
          // Clear the form text boxes after submit
          $("#name").val(" ");
          $("#loc").val(" ");
          $("#tradeInput").val(" ");
          $("#bio").val(" ");
          $("#contact").val(" ");
        }
        else {
          $('#errorModal').modal('show');
        }
      }, 500);
    }else{ $("#errorModal").modal("show"); }
  });
 
  $("#searchBtn").on("click", function(ev) {
    ev.preventDefault();
    var addr = $("#loc").val().trim();
    var tradeTitle = $("#tradeSearch").val();
    var placeId; 
    var coordinates;
    service.getQueryPredictions({input: addr},function(predictions,status){
      if(status != google.maps.places.PlacesServiceStatus.OK) { return; }
      //console.log(JSON.stringify(predictions[0].place_id));
      placeId = predictions[0].place_id;
    });
    setTimeout( function(){
      //wait 500milliseconds before calling getCoordinates
      coordinates = getCoordinates(placeId);
      //center the search coordinates on the map canvas!!
      if(coordinates){ //ignore displaying on the map if its undefined!!
        map = new google.maps.Map(document.getElementById('map'),{
          center: coordinates,
          zoom: 9
        });
        findExperts(tradeTitle, coordinates);
        displayJobs( tradeTitle, coordinates); //display jobs available in the area!!
      }else{
        console.log("No coordinates returned from your location input");
      }
    }, 500);

    //TODO email validation pulling from parsley.js library
    $("#validate").parsley();
  });

  //google maps stuff below here 
  var placesBaseURL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=";//Didnt really use this!
  var geocodeBaseURL = "https://maps.googleapis.com/maps/api/geocode/json?place_id="; 
  var mapsApiKey = "&key=AIzaSyAnBhiFh5vRGwz9cQ9eBX2lhFszC_e1jrA";
  //https://maps.googleapis.com/maps/api/place/autocomplete/output?parameters
  function getCoordinates(placeId){
    var coordinates;
    //gets the coordinates from an address!
    $.ajax({ 
      url: geocodeBaseURL + placeId + mapsApiKey, 
      async:false,  //must wait for this function to complete before firing return! 
      timeout: 3000, //set timeout  so we arent here forever!
      method: "GET" 
    }).done(function(response){
      if(response.status === "OK"){ //then we have at least one result!!
        coordinates = response.results[0].geometry.location;
      }else{
        coordinates = undefined;
        console.log("Error: No coordinates were found for the searched address");
      }
    });
    return coordinates; 
  }

  //---------------------------------------------------------------------------------- 
  function findExperts (tradeTitle, coordinates){
    //a function to match the tradeTitle and available experts in te specified region(coordinates)
    var experts;
    //clear all markers off the map!!!
    google.maps.Map.prototype.clearOverlays = function() {
      for (var i = 0; i < markersArray.length; i++ ) {
        markersArray[i].setMap(null);
      }
      markersArray.length = 0;
    }
    database.ref().orderByChild("dateAdded").once("value", function(snapshot){
      //experts = JSON.stringify(snapshot);
      $("#profiles").empty(); //empty the profile before appending new experts!!
      snapshot.forEach(function(childSnapshot){
        var prof = {
          name: childSnapshot.val().name,
          trade : childSnapshot.val().trade,
          contact : childSnapshot.val().contact,
          bio : childSnapshot.val().bio,
        };
        var locate = childSnapshot.val().loc;
        var latDiff = Math.abs(parseFloat(locate.lat) - parseFloat(coordinates.lat));
        var lngDiff = Math.abs(parseFloat(locate.lng) - parseFloat(coordinates.lng));
        //console.log("latDiff , lngDiff = " + latDiff + " , " + lngDiff);
        if(latDiff <=0.5 && lngDiff <= 0.5){
          if(prof.trade === tradeTitle){
            displayProfile( prof );
            var marker = new google.maps.Marker({ 
              animation: google.maps.Animation.DROP,
              //draggable: true,
              position: locate, 
              map: map
            });
            marker.setMap(map); //marker.setMap(null) //removes the marker!
          }
        }
      });
    },function(err){ console.log("Errors handled: "+err.code); });
  }

  function clearMarkers(){
    for(var a=0; a<markerArray.length; a++){
      markerArray[a].setMap(null);
    }
    markerArray.length = 0;
  }

  function displayProfile(prof){
    var pic_arr = ["http://donnabertaccini.com/wp-content/uploads/sites/2/2017/09/dmb-passport.jpg",
                    "https://photos1.blogger.com/blogger/6971/3344/1600/11.0.jpg",
                    "https://upload.wikimedia.org/wikipedia/commons/7/76/Russian_passport_photo.JPG",
                    "https://lifewithouttaffy.com/taffy/blog/wp-content/uploads/2012/09/a-guy.jpg",
                    "https://qph.fs.quoracdn.net/main-qimg-b64625fb234eb03e9a0e650195d08fad-c"];
    var selector = Math.floor(Math.random()*5);
    $("#profiles").append(
      "<div class='card' id='each-profile'>"+
        "<div class='card-body container-fluid'>" +
          "<div id='image-section'>" + 
            "<img id='profile-image' src='"+pic_arr[selector]+"'>" +
          "</div>"+
          "<div id='profile-description'>"+
            "<p><strong>Name:</strong>   "+prof.name+"</p>"+
            "<p><strong>Trade:</strong>  "+prof.trade +"</p>" +
            "<p><strong>Contact:</strong> "+prof.contact+"</p>"+
            "<p><strong>Bio:</strong>    "+prof.bio +"</p></div>" +
          "</div>"+
        "</div>"+
      "</div>"
    );
  }

  function displayJobs (tradeTitle, coordinates){
    $("#jobs").html(" ");
    console.log(tradeTitle);
    console.log(coordinates.lat);
    var queryURL = "https://jobs.github.com/positions.json?lat=" + coordinates.lat + "&long=" + coordinates.lng + "&description=" + tradeTitle;
    var proxy = 'https://cors-anywhere.herokuapp.com/';
    $.ajax({
      type: "GET",
      // Had to use a Haroku Proxy URL to make the API call work.
      url: proxy + queryURL
    }).done(function(response){
      console.log(response.length)
      for (i = 0; i < response.length && i < 6; i++) {
        var shortDescription = jQuery.trim(response[i].description).substring(0, 600);
        $("#jobs").append("<div class='card mb-3'>"+
         "<div class='card-header h2'>"+ response[i].title +"</div>"+
         "<div class='card-body mx-2'>" +
          "<p class='h4'>Location: </p>"+ "<p>" + response[i].location + "</p>" +
          "<p class='h4'>Company: </p>" + "<p>" + response[i].company + "</p>" + 
          "<p class='h4'>Job Information: </p>" + shortDescription + "<span>. . .</span>" + "<br><br>" +
          "<p class='h4'>Apply Now: </p>" +
          response[i].how_to_apply + "</div>"
         );
      }
    });
  };  

});

