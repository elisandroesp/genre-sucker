var Taglib = require('taglib');

/* DISCOGS */
var Discogs = require('disconnect').Client;
var discogsdb = new Discogs({
    consumerKey: 'srolJgNVDDStSniQPnTp', 
    consumerSecret: 'RqpjuDxPGPIZerYleQeyrbWkTCZurEgG'
}).database();

/* LASTFM */
var LastFmNode = require('lastfm').LastFmNode;
var lastfm = new LastFmNode({
	api_key: '7e4979e72c557156feeb8b1fe1adc12e',    // sign-up for a key at http://www.last.fm/api
	secret: 'be9f587c0ba0635cc4de4762b1d36c47',
	useragent: 'appname/vX.X MyApp' // optional. defaults to lastfm-node.
});




var sourcesSource = {mbid: null, lastfm: {track: null, artist: null, album: null}, discogs:{track:{}}};
var sourcesTags = false;

var sourceMusic = [];
var totalFiles = 0;


var readFiles = function(){
	console.log('readFiles', process.argv);
	totalFiles = process.argv.length -2;
	for (var i = 2; i < process.argv.length; i++) {
	    Taglib.read(process.argv[i], function(err, tag, props) {
	        sourceMusic[i] = {"tag":tag, "props": props};
	        console.dir(err ? err : {'tag': tag, 'audioProperties': props});
	    });
	}
}

var getAllTagsLastfm = function(){}
var getAllTagsDiscogs = function(){}
var getAllTags = function(){console.log('getAllTags');

}
var bindGenreTags = function(){console.log('bindGenreTags')}
var writeFiles = function(){console.log('writeFiles')}

readFiles();
// quando terminar assincrono
// getAllTags()

// quando terminar tudo?
bindGenreTags();
writeFiles();
