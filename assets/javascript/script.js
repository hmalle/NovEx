$(document).ready(function() {

  var tempImage;

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
    // index.html
  	database.ref().orderByChild("dateAdded").limitToLast(5).once("value", function(childSnapshot){
  		var dataName = childSnapshot.val().name;
  		var dataLoc = childSnapshot.val().loc;
  		var dataTrade = childSnapshot.val().trade;
  		var dataImg = childSnapshot.val().image;
  		var dataBio = childSnapshot.val().bio;
  		var dataContact = childSnapshot.val().contact;
  		
  		$("#profiles").append();
  	});

    // This function will be called when the add-image button is clicked
    // Takes an image from the user and saves it as a value
    // profile.html
    $("#add-image").on("click", function(openDialog){
      openDialog.preventDefault();
      tempImage = $("#fileid").click();
      console.log(tempImage);
    })

  	// This function will be called every time the submit button is clicked on the create profile form
  	// Pushes the expert's newly created profile information to the database
    // profile.html
  	$("#add-profile").on("click", function(event){
  		// Prevents the page from reloading on click
  		event.preventDefault();

  		var expertName = $("#name").val().trim();
  		var expertLoc = $("#loc").val().trim();
  		var expertTrade = $("#trade").val();
  		var expertImg = tempImage;
  		var expertBio = $("#bio").val().trim();
  		var expertContact = $("#contact").val().trim();

  		database.ref().push({
  			name: expertName,
  			loc: expertLoc,
  			trade: expertTrade,
  			image: expertImg,
  			bio: expertBio,
  			contact: expertContact,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
  		});

      // This function will be called when the user clicks the search button
      // Searches database for conditionals and appends profile cards to #profiles div
      // index.html
      $("#searchBtn").on("click", function(event) {

      })

  		// Clear the form text boxes after submit
  		$("#name").val("");
  		$("#loc").val("");
  		$("#trade").val("");
  		$("#image").val("");
  		$("#bio").val("");
  		$("#contact").val("");
  	})
});
