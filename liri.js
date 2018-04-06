var dotenv = require("dotenv").config();
//console.log(dotenv.parsed);
var inquirer = require('inquirer');
var omdb = require('omdb');
var twitterKeys = require('twitter');
var spotifyKeys = require('spotify');

// Using the require keyword lets us access all of the exports
// in our keys.js file
var keys = require("./keys.js");

var clientSpotify = keys.spotify;
var clientTwitter = keys.twitter;

//console.log(clientSpotify);
//console.log(clientTwitter);

var siriChoice = process.argv[2];

switch(siriChoice){
    case('my-tweets'):
      //Twitter response
      console.log("Twitter Option");
      break;
    case('spotify-this-song'):
      //Twitter response
      console.log("Spotify Option");
      break;
    case('movie-this'):
      //Twitter response
      console.log("OMDB Option");
      break;
    case('spotify-this-song'):
      //Twitter response
      console.log("Spotify Option");
      break;
      
    case('do-what-it-says') :
      console.log("Play selections from random.txt");
      break;
    default:
      console.log("Invalid Entry");
      break;
}

// Bonus  create function to record output to log file. 


 