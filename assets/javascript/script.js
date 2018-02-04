

//for initalizing google map!!
//If I place it in document.ready, the initMap is called but it isnt known yet
//before the document is ready.
var map;
function initMap(){
  console.log("The map is being initialized");
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.8716, lng: -122.2727 },
      zoom: 9
    });
}

$(document).ready(function() {

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
    var expertLoc = $("#loc").val().trim();
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
  $("#searchBtn").on("click", function(event) {
      
  });
  
  //------------------------------------------------------------------------------------------------------------------------
  //google maps stuff below here 
  //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY 
  var baseURL = "https://maps.googleapis.com/maps/api/geocode/json?address="; 
  var address = "1995 University Avenue, Berkeley, CA";
  getCoordinates( address);  //returned : {lat: 37.8720355, lng: -122.271258} 
  var mapsApiKey = "AIzaSyAnBhiFh5vRGwz9cQ9eBX2lhFszC_e1jrA";
  function getCoordinates(addr){
    var queryURL = baseURL + addr +"="+ mapsApiKey;
    $.ajax({ url: queryURL, method: "GET" }).done( function(response){
      //console.log(response.results[0].geometry.location);
      var coordinates = response.results[0].geometry.location;
      console.log(coordinates);
      map = new google.maps.Map(document.getElementById('map'), {
          center: coordinates,
          zoom:17
      });
      return coordinates;
    });
  }
  //TODO: get the values from the on seachBtn 
  //      place a pin on the map.
  //      get user values from the database  based on the search query and address coordinate. 

});
