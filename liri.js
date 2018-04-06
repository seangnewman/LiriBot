var dotenv = require("dotenv").config();
//console.log(dotenv.parsed);
var request = require("request");
var inquirer = require('inquirer');
var omdbKeys = require('omdb');
var twitterKeys = require('twitter');

var spotifyKeys = require('node-spotify-api');
 

// Using the require keyword lets us access all of the exports
// in our keys.js file
var keys = require("./keys.js");

var clientSpotify = keys.spotify;
 
var clientTwitter = keys.twitter;

var clientOMDB = keys.omdb;
 

 



var siriChoice = process.argv[2];

switch(siriChoice){
    case('my-tweets'):
      //Twitter response
      console.log("Twitter Option");
      break;
    case('spotify-this-song'):
      //Spotify Option
       
      spotifySearch(process.argv[3]);
      break;
    case('movie-this'):
      
      //Twitter response
       
      omdbSearch(process.argv[3]);
      break;
    case('spotify-this-song'):
      //Twitter response
       
      spotifySearch(process.argv[3]);
      
      break;
      
    case('do-what-it-says') :
      console.log("Play selections from random.txt");
      break;
    default:
      console.log("Invalid Entry");
      break;
}

// Bonus  create function to record output to log file. 

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
       for(var i =0; i < response.tracks.items.length; i++){
        // Only using the track items returned in object
        // console.log(response.tracks.items);
         var trackInfo = response.tracks.items;
         var artistArray = [];
         for(var artistIndex = 0 ; artistIndex < trackInfo[i].album.artists.length; artistIndex++ ){
            // In case there are multiple objects returned from artists
            artistArray.push(trackInfo[i].artists[artistIndex].name );
         } 
        //Create object for use in logging function needed for bonus 
         var spotifyObject = {
            Artist : artistArray.join(','),
            Album : trackInfo[i].album.name,
            Track : trackInfo[i].name,
            Preview : trackInfo[i].preview_url
         };
         // Display track information
         console.log("Artists     :",spotifyObject.Artist);
         console.log("Album Name  :",spotifyObject.Album);
         console.log("Track Title :",spotifyObject.Track);
         console.log("Preview URL :" ,spotifyObject.Preview);
         console.log('\n');
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
    
  }else{
      console.log(error);
  }
 
});

}