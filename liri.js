//Gather the packages required
var dotenv = require("dotenv").config();
var fs = require("fs");
var request = require("request");
var inquirer = require('inquirer');
var omdbKeys = require('omdb');
var twitterKeys = require('twitter');
var spotifyKeys = require('node-spotify-api');
var keys = require("./keys.js");

//Specify the values in the envirnments 
//returned from dotenv
var clientSpotify = keys.spotify;
var clientTwitter = keys.twitter;
var clientOMDB = keys.omdb;
 
//Retrieve user choice 
var siriChoice = process.argv[2];

//Determine action based on user choice
switch(siriChoice){
    case('my-tweets'):
      //Twitter response
      console.log("Twitter Option");
      break;
    case('movie-this'):
      omdbSearch(process.argv[3]);
      break;

    case('spotify-this-song'):
      spotifySearch(process.argv[3]);
      break;
      
    case('do-what-it-says') :
      console.log("Play selections from random.txt");
      randomSearch();
      break;

    default:
      console.log("Invalid Entry");
      break;
}



function spotifySearch(songTrack = 'The Sign'){
  // Note: No paramaters passed defaults to 'The Sign'
  // Credentials for Spotify
  var spotify = new spotifyKeys({
    id: clientSpotify.id,
    secret: clientSpotify.secret
  });
  // Return a promise from Spotify
  spotify
    .search({ type: 'track', query: songTrack, limit: 20 })
    .then(function(response) {
       var spotifyArray = [];
       for(var i =0; i < response.tracks.items.length -1; i++){
        // Only using the track items returned in object
        //console.log(response.tracks.items);
       var trackInfo = response.tracks.items;
       var artistArray = [];
       for(var artistIndex = 0 ; artistIndex < trackInfo[i].album.artists.length; artistIndex++ ){
         // In case there are multiple objects returned from artists
         //var aName = trackInfo[i].artists[artistIndex].name === null? "N/A":trackInfo[i].artists[artistIndex].name;
         if(trackInfo[i].artists.length < 1) {
           artistArray.push('N/A');
         }else {
           artistArray.push(trackInfo[i].artists[artistIndex].name );
         }
           
       } 
       //Create object for use in logging function needed for bonus 
       var spotifyObject = {
         Artist : artistArray.join(','),
         Album : trackInfo[i].album.name === null? "N/A":trackInfo[i].album.name,
         Track : trackInfo[i].name === null? "N/A" : trackInfo[i].name ,
         Preview : trackInfo[i].preview_url === null? "N/A" : trackInfo[i].preview_url
       };
       // Display track information
       console.log("Artists     :",spotifyObject.Artist);
       console.log("Album Name  :",spotifyObject.Album);
       console.log("Track Title :",spotifyObject.Track);
       console.log("Preview URL :" ,spotifyObject.Preview);
       console.log('\n');

       //record result
       recordOutput(siriChoice, spotifyObject);
      }
    })
    .catch(function(err) {
       console.log(err);
  });
} 

function omdbSearch(movieTitle='Mr. Nobody'){     
  var omdbURL = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey="+ clientOMDB.id;
  request(omdbURL , function(error, response, body) {
  // If the request is successful (i.e. if the response status code is 200)
  if (!error && response.statusCode === 200) {
  // Parse the body of the site and recover  omdb data
  //Create object for use in logging function needed for bonus
  var movieObject = {
    Title : JSON.parse(body).Title,
    Year : JSON.parse(body).Year,
    Rating : JSON.parse(body).Ratings.length > 1? JSON.parse(body).Ratings[1].Value:"N/A",
    Country : JSON.parse(body).Country,
    Language : JSON.parse(body).Language,
    Plot : JSON.parse(body).Plot,
    Actors : JSON.parse(body).Actors
  };

  console.log('\n');
  console.log("Title    : " + movieObject.Title);
  console.log("Year     : " + movieObject.Year);
  console.log("RT Score : " + movieObject.Rating);
  console.log("Country  : " + movieObject.Country);
  console.log("Language : " + movieObject.Language);
  console.log("Plot     : " + movieObject.Plot);
  console.log("Actors   : " + movieObject.Actors);

  //record output
  recordOutput(siriChoice, movieObject);
  }else{
    console.log(error);
  }
 });
}

function randomSearch(){
  fs.readFile("random.txt", "utf8", function(error, data) {
  // If the code experiences any errors it will log the error to the console.
  if (error) {
    return console.log(error);
  }
  
  // Then split it by commas (to make it more readable)
  var dataArr = data.split(",");
       
  //New Switch Statement, this time on dataArr
  switch(dataArr[0]){
    case('my-tweets'):
    //Twitter response
    console.log("Twitter Option");
    break;

    case('movie-this'):
      omdbSearch(dataArr[1]);
      break;
        
    case('spotify-this-song'):
      spotifySearch(dataArr[1]);
      break;
        
    default:
      console.log("Invalid Entry");
      break;
    }
  });
}


// Bonus  create function to record output to log file. 
function recordOutput(choice, objectOutput){
    
    var objectText = '';
    for(var prop in objectOutput){
        objectText += prop + " = " + objectOutput[prop] + " ";
    }
    
    var appendText = choice +  " : " + objectText + "\n"
    fs.appendFile("log.txt", appendText, function(err){
        if(err){
            throw err;
        }
    } );
}