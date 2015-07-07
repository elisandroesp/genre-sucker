/*
var discogs = require('discogs');
var client = discogs({api_key: 'srolJgNVDDStSniQPnTp'});
client.artist('Marcus Price', function(err, artist) {
    console.log(artist.name); // Marcus Price
});
*/


var Discogs2 = require('disconnect').Client;
var db = new Discogs2().database();
db.release(176126, function(err, data){
    console.log(data);
});

var col = new Discogs2().user().collection();

/*
col.releases('dj_spark', 0, {page: 2, per_page: 75}, function(err, data){
    console.log(data);
});
*/

var taglib = require('taglib');

// general variables
var track = "song.mp3";

// run them all individually
taglib.read(track, function(err, tag, audio) {
  console.log('taglib');
  console.log(tag);
  console.log(audio);
});

var LastFmNode = require('lastfm').LastFmNode;

var lastfm = new LastFmNode({
  api_key: '7e4979e72c557156feeb8b1fe1adc12e',    // sign-up for a key at http://www.last.fm/api
  secret: 'be9f587c0ba0635cc4de4762b1d36c47',
  useragent: 'appname/vX.X MyApp' // optional. defaults to lastfm-node.
});


var request = lastfm.request("artist.getInfo", {
    artist: "The Mae Shi",
    handlers: {
        success: function(data) {
            console.log("Success: " + data);
        },
        error: function(error) {
            console.log("Error: " + error.message);
        }
    }
});
