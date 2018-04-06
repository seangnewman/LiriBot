var dotenv = require("dotenv").config();
//console.log(dotenv.parsed);
var inquirer = require('inquirer');
var omdb = require('omdb');
var twitterKeys = require('twitter');

var spotifyKeys = require('node-spotify-api');
 

// Using the require keyword lets us access all of the exports
// in our keys.js file
var keys = require("./keys.js");

var clientSpotify = keys.spotify;
 
var clientTwitter = keys.twitter;

 



var siriChoice = process.argv[2];

switch(siriChoice){
    case('my-tweets'):
      //Twitter response
      console.log("Twitter Option");
      break;
    case('spotify-this-song'):
      //Spotify Option
      console.log("Spotify Option");
      spotifySearch(process.argv[3]);
      break;
    case('movie-this'):
      //Twitter response
      console.log("OMDB Option");
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
       for(var i =0; i < response.tracks.items.length; i++){
        // Only using the track items returned in object
        // console.log(response.tracks.items);
         var trackInfo = response.tracks.items;
         var artistArray = [];
         for(var artistIndex = 0 ; artistIndex < trackInfo[i].album.artists.length; artistIndex++ ){
            // In case there are multiple objects returned from artists
            artistArray.push(trackInfo[i].artists[artistIndex].name );
         } 
         // Display track information
         console.log("Artists     :",artistArray.join(','));
         console.log("Album Name  :",trackInfo[i].album.name);
         console.log("Track Title :",trackInfo[i].name);
         console.log("Preview URL :" ,trackInfo[i].preview_url);
         console.log('\n');
       }
     })
    .catch(function(err) {
      console.log(err);
    });

      
} 