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

  	// This function will be called any time a new profile is added to our database.
  	// We will do our jQuery call here to append profile divs (or cards if we are using bootstrap) to our html
  	database.ref().on("child_added", function(childSnapshot){
  		var dataName = childSnapshot.val().name;
  		var dataLoc = childSnapshot.val().location;
  		var dataTrade = childSnapshot.val().trade;
  		var dataImg = childSnapshot.val().image;
  		var dataBio = childSnapshot.val().bio;
  		var dataContact = childSnapshot.val().contact;
  		
  		$("").append();
  	});

  	// This function will be called every time the submit button is clicked on the create profile form
  	// Pushes the expert's newly created profile information to the database
  	$("#submitBtn").on("click", function(event){
  		// Prevents the page from reloading on click
  		event.preventDefault();

  		var expertName = $("#name").val().trim();
  		var expertLoc = $("#location").val().trim();
  		var expertTrade = $("#trade").val().trim();
  		var expertImg = $("#image").val().trim();
  		var expertBio = $("#bio").val().trim();
  		var expertContact = $("#contact").val().trim();

  		database.ref().push({
  			name: expertName,
  			location: expertLoc,
  			trade: expertTrade,
  			image: expertImg,
  			bio: expertBio,
  			contact: expertContact
  		});

  		// Clear the form text boxes after submit
  		$("#name").val("");
  		$("#location").val("");
  		$("#trade").val("");
  		$("#image").val("");
  		$("#bio").val("");
  		$("#contact").val("");
  	})

});