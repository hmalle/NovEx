

//TODO: Error in the deployed page where

//for initalizing google map!!
//If I place it in document.ready, the initMap is called but it isnt known yet
//before the document is ready.


$(document).ready(function() {


  var map;
  var markerArray=[];
  var service = new google.maps.places.AutocompleteService();
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
  //a little delay for the database and maps to be loaded!! TODO: Is this necessary? 
  //TODO: Sometimes I get initMap is not defined till I reload the page again!!
  setTimeout(function(){
    initMap();
    initPage();
  },1000);

	// This function will be called any time a new profile is added to our database.
	// We will do our jQuery call here to append profile divs (or cards if we are using bootstrap) to our html
  // index.html
  function initPage(){
    database.ref().orderByChild("dateAdded").limitToLast(5).once("value", function(snapshot){
      //Disaplays the first at the initial of the page TODO: Maybe this can be made more DRY 
      // with the getExperts function below!!
      //experts = JSON.stringify(snapshot);
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

	// This function will be called every time the submit button is clicked on the create profile form
	// Pushes the expert's newly created profile information to the database
  // profile.html
	$("#add-profile").on("click", function(event){
	  // Prevents the page from reloading on click
    event.preventDefault();
    var expertName = $("#name").val().trim();
    var expertLoc ; //= getCoordinates($("#loc").val().trim());
    var expertTrade = $("#tradeInput").val();
    var expertImg = tempImage;
    var expertBio = $("#bio").val().trim();
    var expertContact = $("#contact").val().trim();
    var placeId;
    service.getQueryPredictions({input: $("#loc").val().trim() },function(predictions,status){
      if(status != google.maps.places.PlacesServiceStatus.OK) { return; }
      placeId = predictions[0].place_id;

    });
    setTimeout( function(){
      //wait 500milliseconds before calling getCoordinates
      expertLoc = getCoordinates(placeId);

      if(expertName != undefined && expertLoc != undefined && expertBio != undefined && expertContact != undefined) {

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
        $("#contact").val(" ")
      }
    }, 500);
  });
    
  // This function will be called when the add-image button is clicked
  // Takes an image from the user and saves it as a value
  // profile.html
  $("#add-image").on("click", function(openDialog){
    openDialog.preventDefault();
    tempImage = $("#fileid").click();
    //console.log(tempImage);
  });

  // This function will be called when the user clicks the search button
  // Searches database for conditionals and appends profile cards to #profiles div
  // index.html
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

  //----------------------------------------------------------------------------------
  //google maps stuff below here 
  //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY 
  var placesBaseURL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=";
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
          //console.log(coordinates);
        }else{
          console.log("Error: No coordinates were found for the searched address");
        }
      });
    //console.log("Coordinates: "+JSON.stringify(coordinates));
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
          displayProfile( prof );
          var marker = new google.maps.Marker({ 
            animation: google.maps.Animation.DROP,
            //draggable: true,
            position: locate, 
            map: map
          });
          marker.setMap(map); //marker.setMap(null) //removes the marker!
        }
      });
    },function(errorObject){ console.log("Errors handled: "+errorObject.code); });
  }

  function clearMarkers(){
    for(var a=0; a<markerArray.length; a++){
      markerArray[a].setMap(null);
    }
    markerArray.length = 0;
  }
  function displayProfile(prof){
    var pic_arr = ["http://donnabertaccini.com/wp-content/uploads/sites/2/2017/09/dmb-passport.jpg",
                    "http://photos1.blogger.com/blogger/6971/3344/1600/11.0.jpg",
                    "https://upload.wikimedia.org/wikipedia/commons/7/76/Russian_passport_photo.JPG",
                    "http://lifewithouttaffy.com/taffy/blog/wp-content/uploads/2012/09/a-guy.jpg",
                    "https://qph.fs.quoracdn.net/main-qimg-b64625fb234eb03e9a0e650195d08fad-c"];
    var selector = Math.floor(Math.random()*5);
    $("#profiles").append("<div class='card' id='prof'>"+
      "<div class='card-body'>" +
        "<div class='col-sm-4 float-left'>" +  
          "<img id='bioImg' src='"+pic_arr[selector]+"'>" +

        "</div>"+
        "<div class='col-sm-8 float-right'>"+
          "<p>Name   :"+prof.name+"</p>"+
          "<p>Trade  :"+prof.trade +"</p>" +
          "<p>Contact:"+prof.contact+"</p>"+
          "<p>Bio    :"+prof.bio +"</p></div>" +
        "</div>"+
      "</div>");
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
