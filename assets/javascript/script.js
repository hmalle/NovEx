
//TODO: Sometimes I get initMap is not defined till I reload the page again!!
//TODO: Error in the deployed page where

//for initalizing google map!!
//If I place it in document.ready, the initMap is called but it isnt known yet
//before the document is ready.

var map;
function initMap(){
  //console.log("The map is being initialized");
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.8716, lng: -122.2727 }, //initially center it around berkeley!
      zoom: 9
    });
}

$(document).ready(function() {
  // $("#validate").parsley();

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
  var tempImage = "no image";

	// This function will be called any time a new profile is added to our database.
	// We will do our jQuery call here to append profile divs (or cards if we are using bootstrap) to our html
  // index.html

  //  database.ref().orderByChild("dateAdded").limitToLast(5).once("value", function(childSnapshot){
	// 	var dataName = childSnapshot.val().name;
	// 	var dataLoc = childSnapshot.val().loc;
	// 	var dataTrade = childSnapshot.val().trade;
	// 	var dataImg = childSnapshot.val().image;
	// 	var dataBio = childSnapshot.val().bio;
	// 	var dataContact = childSnapshot.val().contact;
		
	// 	$("#profiles").append();
	// });

	// This function will be called every time the submit button is clicked on the create profile form
	// Pushes the expert's newly created profile information to the database
  // profile.html
	$("#add-profile").on("click", function(event){
	  // Prevents the page from reloading on click
    event.preventDefault();
    var expertName = $("#name").val().trim();
    var expertLoc = getCoordinates($("#loc").val().trim());
    var expertTrade = $("#tradeInput").val();
    var expertImg = tempImage;
    var expertBio = $("#bio").val().trim();
    var expertContact = $("#contact").val().trim();
    console.log(expertName, expertLoc, expertTrade, expertImg, expertBio, expertContact)
    //
    if(expertName != undefined && expertLoc != undefined && expertImg != undefined && expertBio != undefined && expertContact != undefined) {
      database.ref().push({
        name: expertName,
        loc: expertLoc,
        trade: expertTrade,
        image: expertImg,
        bio: expertBio,
        contact: expertContact,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
      console.log(expertName, expertLoc, expertTrade, expertImg, expertBio, expertContact);
      // Clear the form text boxes after submit
      $("#name").val(" ");
      $("#loc").val(" ");
      $("#tradeInput").val(" ");
      $("#image").val(" ");
      $("#bio").val(" ");
      $("#contact").val(" ")
    }
  });
    
  // This function will be called when the add-image button is clicked
  // Takes an image from the user and saves it as a value
  // profile.html
  $("#add-image").on("click", function(openDialog){
    openDialog.preventDefault();
    tempImage = $("#fileid").click();
    console.log(tempImage);
  });

  // This function will be called when the user clicks the search button
  // Searches database for conditionals and appends profile cards to #profiles div
  // index.html
  $("#searchBtn").on("click", function(ev) {
    ev.preventDefault();
    var addr = $("#loc").val().trim();
    var tradeTitle = $("#tradeInput").val();
    var placeId; 
    var coordinates;
    service.getQueryPredictions({input: addr},function(predictions,status){
      if(status != google.maps.places.PlacesServiceStatus.OK) { return; }
      console.log(JSON.stringify(predictions[0].place_id));
      placeId = predictions[0].place_id;
    });
    setTimeout( function(){
      //wait 500milliseconds before calling getCoordinates
      coordinates = getCoordinates(placeId);
      //center the search coordinates on the map canvas!!
      if(coordinates){ //ignore displaying on the map if its undefined!!
        map = new google.maps.Map(document.getElementById('map'),{
          center: coordinates,
          zoom: 10
        });
        findExperts(tradeTitle, coordinates);
        displayJobs( tradeTitle, addr); //display jobs available in the area!!
      }
    }, 500);
  });

  //----------------------------------------------------------------------------------
  var service = new google.maps.places.AutocompleteService();
  //google maps stuff below here 
  //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY 
  var placesBaseURL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=";
  var geocodeBaseURL = "https://maps.googleapis.com/maps/api/geocode/json?place_id="; 
  //var address = "1995 University Avenue, Berkeley, CA";
  //getCoordinates( address);  //returned : {lat: 37.8720355, lng: -122.271258} 
  var mapsApiKey = "&key=AIzaSyAnBhiFh5vRGwz9cQ9eBX2lhFszC_e1jrA";
  //https://maps.googleapis.com/maps/api/place/autocomplete/output?parameters
  function getCoordinates(placeId){
    var coordinates;
    //gets the coordinates from an address!
      $.ajax({ 
        url: geocodeBaseURL + placeId + mapsApiKey, 
        async:false,  //must wait for this function to complete before firing return! 
        //timeout: 5000, //set timeout of 5 secs so we arent here forever!
        method: "GET" 
      }).done(function(response){
        if(response.status === "OK"){ //then we have at least one result!!
          coordinates = response.results[0].geometry.location;
          console.log(coordinates);
        }else{
          console.log("Error: No coordinates were found for the searched address");
        }
      });
    console.log("Coordinates: "+JSON.stringify(coordinates));
    return coordinates; //TODO: HOW ON EARTH CAN I DELAY THIS RETURN TILL THE CODE ABOVE IS DONE!!!!!
  }

  //---------------------------------------------------------------------------------- 
  function findExperts (/*tradeTitle, coordinates*/){
    //a function to match the tradeTitle and available experts in te specified region(coordinates)
    var experts;
    database.ref().orderByChild("dateAdded").limitToLast(5).once("value", function(snapshot){
      //experts = JSON.stringify(snapshot);
      snapshot.forEach(function(childSnapshot){
        var prof = {
          name: childSnapshot.val().name,
          trade : childSnapshot.val().trade,
          contact : childSnapshot.val().contact,
          bio : childSnapshot.val().bio,
        };
        displayProfile( prof );
        coordinates = childSnapshot.val().loc;
        var marker = new google.maps.Marker({ 
          animation: google.maps.Animation.DROP,
          //draggable: true,
          position: coordinates, 
          map: map
        });
        marker.setMap(map); //marker.setMap(null) //removes the marker!
      });
    },function(errorObject){ console.log("Errors handled: "+errorObject.code); });
  }

  function displayProfile(prof){
    $("#profiles").append("<div class='card' id='prof'>"+
      "<div class='card-header'>"+ prof.name +"</div>"+
      "<div class='card-body'>" +
        "<div class='col-sm-4 float-left'>" +  
          "<img id='bioImg' src='http://lorempixel.com/150/150/'>" +
        "</div>"+
        "<div class='col-sm-8 float-right'>"+
          "<p> Trade: "+prof.trade +"</p>" +
          "<p>contact: "+prof.contact+"</p>"+
          "<p>Bio: "+prof.bio +"</p></div>" +
        "</div>"+
      "</div>");
  }

  function findExperts (/*tradeTitle, coordinates*/){
    //a function to match the tradeTitle and available experts in te specified region(coordinates)
    var experts;
    database.ref().orderByChild("dateAdded").limitToLast(5).once("value", function(snapshot){
      //experts = JSON.stringify(snapshot);
      snapshot.forEach(function(childSnapshot){
        var prof = {
          name: childSnapshot.val().name,
          trade : childSnapshot.val().trade,
          contact : childSnapshot.val().contact,
          bio : childSnapshot.val().bio,
        };
        displayProfile( prof );
        coordinates = childSnapshot.val().loc;
        var marker = new google.maps.Marker({ 
          animation: google.maps.Animation.DROP,
          //draggable: true,
          position: coordinates, 
          map: map
        });
        marker.setMap(map); //marker.setMap(null) //removes the marker!
      });
    },function(errorObject){ console.log("Errors handled: "+errorObject.code); });
  }

  function displayProfile(prof){
    $("#profiles").append("<div class='card' id='prof'>"+
      "<div class='card-header'>"+ prof.name +"</div>"+
      "<div class='card-body'>" +
        "<div class='col-sm-4 float-left'>" +  
          "<img id='bioImg' src='http://lorempixel.com/150/150/'>" +
        "</div>"+
        "<div class='col-sm-8 float-right'>"+
          "<p> Trade: "+prof.trade +"</p>" +
          "<p>contact: "+prof.contact+"</p>"+
          "<p>Bio: "+prof.bio +"</p></div>" +
        "</div>"+
      "</div>");
  }

  function displayJobs (tradeTitle, coordinates){
    console.log("displaying jobs using some job search API");
    console.log(coordinates.lat);
    var queryURL = "https://jobs.github.com/positions.json?lat=" + coordinates.lat + "&long=" + coordinates.lng + "&description=intern&markdown=true";
    var proxy = 'https://cors-anywhere.herokuapp.com/';

    $.ajax({
      type: "GET",
      // Had to use a Haroku Proxy URL to make the API call work.
      url: proxy + queryURL
    }).done(function(response){
      console.log(response.length)
      for (i = 0; i < 4; i++) {
        $("#jobs").append("<div class='card'>"+
         "<div class='card-header'>"+ response[i].title +"</div>"+
         "div class='card-body'>" +
          "<p>Location: "+ response[i].location + "</p>"+
          "<p>Description: "+ response[i].description +
          "<p>How to Apply: "+ responsep[i].how_to_apply
         );
      }
    });
  };  

});

