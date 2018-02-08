Project Title - 
	# noVex - Connecting Novices with Experts in the coding world. 

Motivation - 
	It is difficult for novices to start out in the coding world. It can be tricky navigating the different languages and knowing where to start. It is also difficult sometimes for people to commit to a school schedule to learn the traditional way. This site aims to let novices and experts connect and start a dialogue for a working relationship. Experts create a profile and list and bio. They will list their skill sets and what they are comfortable teaching. Novices will search by category or location and can browse all the experts. Once they see someone they feel fits their needs they will contact them and see if a relationship can be agreed upon. 

How it Works - 
	We use Google Maps API and GitHub Jobs API to connect people wanting to learn tech to experts in the field who are willing to teach. Experts create profiles that detail which skills they have, and are loaded into Firebase database. Novices search by skill or location to find out how many experts are in their area. Expert's profiles that pull are determined by radius from the search location the novice chose. Novices then choose an expert they feel fits their needs and communicate directly with them. 

Build Status - 
	In progress. Some functionality is present but still bugs to fix. At the moment we are able to pull in from Github Jobs API and Google Maps API, but Google Maps does not consistently geocode by zip code. 


Code Style - 
	We used HTML, Bootstrap, and CSS for front end styling. Javascript, jquery, APIs and Firebase Database were used for backend development. 

APIs Used - 
  * GoogleMaps API
  * gitHub Jobs API

Libaries Used - 
  * Bootstrap
  * jquery
  * Parsleyjs

Other Technologies Used - 
  * HTML5
  * CSS
  * Javascript
  * jquery
  * AJAX
  * Firebase Database

Link to site - 
   * https://github.com/hmalle/NovEx 


 Challenges & Future Fixes Needed - 
 	* Google Maps API will is not consistent. If we search by a city (Sacramento) we get one set of results. If we search by the same city's zip code, we get a different set of a results (or no results at all). Copy of our function to call Google Maps is here:

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
					        console.log("Error: No coordinates were found for the searched address");
					      }


	* Due to limitations of knowledge at this point we were unable to get more job search APIs in the website to do a more comprehensive list of available jobs. 

	* Experts cannot load photos into profiles yet. 

	* A section is needed for Novices to understand the different types of skills. If they are interested in getting into coding, but do not know how each language functions, a short video or descriptor of each technology would be helpful. 

	* A glossary of terms, converted to "lay person speak" would be helpful for Novices. 

	* Front end layout and styling need to be upgraded to have a more polished look. 

	* We want a form validation library for our contact form. We tried to use parsley.js but could not get it to work properly. We want to have functionality where form fields are required and error messages appear when not filled out. 


Next Steps - Notes for Developers -
	* Please fork from the master if you are going to do any work. 


Please enjoy! Feedback and suggestions are welcome. 

Hillary
Adam
Yusuf
Jason
