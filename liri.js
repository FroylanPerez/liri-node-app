require("dotenv").config();

var fs = require("fs");

var keys = require("./keys.js");

var Spotify = require('node-spotify-api'); 

var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var nodeArgs = process.argv;

var action = process.argv[2];

var randomSong = "";

var randomArtist = "";

var randomMovie = "";

function movie() {
    // action = randomAction[0]; No la lee, esta en otro scope

    if (action==="movie-this") {

        var movieName = "";  

        if (nodeArgs.length===3&&nodeArgs[2]!="do-what-it-says") {
            movieName = "Mr. Nobody"
        }

        if (nodeArgs[2]==="do-what-it-says") {
            movieName = randomMovie;
        }

        for (var i = 3; i < nodeArgs.length; i++) {

            if (i > 3 && i < nodeArgs.length) {
            movieName = movieName + "+" + nodeArgs[i];
            } else {
            movieName += nodeArgs[i];
            }
        }

        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

        axios.get(queryUrl).then(
            function(response) {
            console.log("Title of the movie: " + response.data.Title);
            console.log("Year the movie came out: " + response.data.Year);
            console.log("IMDB Rating of the movie: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value);
            console.log("Country where the movie was produced: " + response.data.Country);
            console.log("Language of the movie: " + response.data.Language);
            console.log("Plot of the movie: " + response.data.Plot);
            console.log("Actors in the movie: " + response.data.Actors);
            })
            .catch(function(error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
            });
    }
}

function concert() {
    if (action==="concert-this") {

        var artistName = "";

        if (nodeArgs[2]==="do-what-it-says") {
            artistName = randomArtist;
        }

        var moment = require('moment');
        moment().format();

        for (var i = 3; i < nodeArgs.length; i++) {

            if (i > 3 && i < nodeArgs.length) {
            artistName = artistName + "+" + nodeArgs[i];
            } else {
            artistName += nodeArgs[i];
            }
        }

        var queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

        axios.get(queryUrl).then(
            function(response) {
                for (var i = 0; i < response.data.length; i++) {

                    var date = response.data[0].datetime;
                    var convertedDate = moment(date);
        
                    console.log("Name of the venue: " + response.data[i].venue.name);
                    console.log("Venue location: " + response.data[i].venue.country);
                    console.log("Date of the Event: " + convertedDate.format("MM/DD/YYYY"));
                }
            })
            .catch(function(error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
            });
    }
}

function song() {
    if (action==="spotify-this-song") {

        var songName = "";

        if (nodeArgs.length===3&&nodeArgs[2]!="do-what-it-says") {
            songName = "The Sign";
        }

        if (nodeArgs[2]==="do-what-it-says") {
            songName = randomSong;
        }

            for (var i = 3; i < nodeArgs.length; i++) {

                if (i > 3 && i < nodeArgs.length) {
                songName = songName + "+" + nodeArgs[i];
                } else {
                songName += nodeArgs[i];
                }
            }

            spotify.search({ type: 'track', query: songName }, function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                if (songName==="The Sign") {
                    console.log("artist/band: " + data.tracks.items[4].album.artists[0].name); 
                    console.log("album: " + data.tracks.items[4].album.name); // nombre de cancion
                    console.log("preview link of the song from Spotify: " + data.tracks.items[4].album.external_urls.spotify);
                    console.log("song name: " + data.tracks.items[4].name);
                }
        
                else {
                    for (var i = 0; i < data.tracks.items.length; i++) {
                        console.log("artist/band: " + data.tracks.items[i].album.artists[0].name); 
                        console.log("album: " + data.tracks.items[i].album.name); // nombre de cancion
                        console.log("preview link of the song from Spotify: " + data.tracks.items[i].album.external_urls.spotify);
                        console.log("song name: " + data.tracks.items[i].name);
                    }
                }   
            });

    }
}

movie();
concert();
song();
doWhat();

function doWhat() {
    if(action==="do-what-it-says") {

        fs.readFile("random.txt", "utf8", function(error, data) {
    
            if (error) {
            return console.log(error);
            }
            else {
                var randomText = data.split(",");
            }
            if (randomText[0]==="spotify-this-song") {
                action = "spotify-this-song";
                randomSong = randomText[1];
                song();
            }
            if (randomText[0]==="concert-this") {
                action = "concert-this";
                randomArtist = randomText[1];
                concert();
            }
            if (randomText[0]==="movie-this") {
                action = "movie-this";
                randomMovie = randomText[1];
                movie();
            }
        }); 


    }
  
}

