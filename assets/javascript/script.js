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
  		var dataProf = childSnapshot.val().profession;
  		var dataImg = childSnapshot.val().image;
  		var dataBio = childSnapshot.val().bio;
  		var dataHours  = childSnapshot.val().hours;
  		var dataContact = childSnapshot.val().contact;
  		
  		$("").append();
  	});

  	// This function will be called every time the submit button is clicked on the create profile form
  	// Pushes the expert's newly created profile information to the database
  	$("#submitBtn").on("click", function(event){
  		// Prevents the page from reloading on click
  		event.preventDefault();

  		var expertName = $(/*an ID*/).val().trim();
  		var expertLoc = $(/*an ID*/).val().trim();
  		var expertProfession = $(/*an ID*/).val().trim();
  		var expertImg = $(/*an ID*/).val().trim();
  		var expertBio = $(/*an ID*/).val().trim();
  		var expertHours = $(/*an ID*/).val().trim();
  		var expertContact = $(/*an ID*/).val().trim();

  		database.ref().push({
  			name: expertName,
  			location: expertLoc,
  			profession: expertProfession,
  			image: expertImg,
  			bio: expertBio,
  			hours: expertHours,
  			contact: expertContact
  		});

  		// Clear the form text boxes after submit
  		$("#").val("");
  		$("#").val("");
  		$("#").val("");
  		$("#").val("");
  		$("#").val("");
  		$("#").val("");
  		$("#").val("");
  	})

});