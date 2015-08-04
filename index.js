/*
var discogs = require('discogs');
var client = discogs({api_key: 'srolJgNVDDStSniQPnTp'});
client.artist('Marcus Price', function(err, artist) {
		console.log(artist.name); // Marcus Price
});
*/


/*

resumo do funcionamento
========================

- lê as músicas e vai adicionando em um array
	- futuramente vai tentar pegar os nomes pelo NOME do arquivo/folder
- o array é lido e cada entrada vai sendo pedida ao Discogs
- o array é lido e cada entrada vai sendo pedida ao lastFM
- o array de respostas é lido inteiro para montar as tags de cada música, que será colocado em outro array
	- para montar isso, tem que ler o array de  options, 'donotremovethese', 
	  talvez alguma opção de mostre a priorização do merge, e com certeza um replace para uniformizar as tags/generos
	- para usar as tags do last fm, talvez tenha que fazer um algoritmo mais complicado um pouco
	- salvar cada música com as tags novas
	

*/

require('./config.js');

options.init();
console.info('---- ', options, '----');


var prefs = {


	// Replace a discogs genre string with your own
	replaceGenres: {
		'Folk, World, & Country': 'Traditional',
		'RnB/Swing': 'R&B'
	},

	// The title of the album on discogs must not be more dissimilar in % to the title in itunes
	matchThreshold: 35 //%
};


var showTags = function(){
	console.log("tags: ", sourcesTags);
};


var Discogs2 = require('disconnect').Client;
var db = new Discogs2({
	consumerKey: 'srolJgNVDDStSniQPnTp', 
	consumerSecret: 'RqpjuDxPGPIZerYleQeyrbWkTCZurEgG'
}).database();

var taglib = require('taglib');

var LastFmNode = require('lastfm').LastFmNode;

var lastfm = new LastFmNode({
	api_key: '7e4979e72c557156feeb8b1fe1adc12e',    // sign-up for a key at http://www.last.fm/api
	secret: 'be9f587c0ba0635cc4de4762b1d36c47',
	useragent: 'appname/vX.X MyApp' // optional. defaults to lastfm-node.
});



// general variables
var track = "testsong.mp3";
var tracks = ["testsong.mp3","testsong2.mp3"];


var sourcesSource = {mbid: null, lastfm: {track: null, artist: null, album: null}, discogs:{track:{}}};
var sourcesTags = false;

/*
// run them all individually
var tag = taglib.tagSync(track);
 
	console.log('taglib');
	console.log(tag);
	tag.commentxxx = "xxxpark";
	tag.saveSync();
sourcesTags = sourcesSource;


// TODO: save image!
var request = lastfm.request("track.getInfo", {
	track: tag.title,
	artist: tag.artist,
	handlers: {
		success: function(data) {
			//sourcesTags.lastfm.track = data.toptags;

			if(data.track.mbid){
				console.log(' 1=== encontrou track getInfo MBID lastfm');
				sourcesTags.mbid = data.track.mbid;
			}
	//		console.log("UHU: " , data, data.toptags, data.length);
			 for(i=0; i<=data.length; i++){
	//				console.log(i, data[i]); 
			}
			showTags();
		},
		error: function(error) {
				console.log("Error: " , error.message);
		}
	}
});



var request = lastfm.request("track.getTopTags", {
		track: tag.title,
		artist: tag.artist,
		handlers: {
			success: function(data) {
				sourcesTags.lastfm.track = data.toptags;
				console.log(' 2=== encontrou track lastfm');
		//		console.log("Success: " , data, data.toptags, data.length);
				 for(i=0; i<=data.length; i++){
		//				console.log(i, data[i]); 
				}
				showTags();
			},
			error: function(error) {
					console.log("Error: " , error.message);
			}
		}
});
var request = lastfm.request("artist.getTopTags", {
		artist: tag.artist,
		handlers: {
			success: function(data) {
				sourcesTags.lastfm.artist = data.tags;
				console.log(' 3=== encontrou artista lastfm');
		//		console.log("Success: " , data, data.toptags, data.length);
				 for(i=0; i<=data.length; i++){
		//				console.log(i, data[i]); 
				}
				showTags();
			},
			error: function(error) {
					console.log("Error: " , error.message);
			}
		}
});



db.search("", { artist: tag.artist, track: tag.title}, function(err, data){
	// console.log(err, data);
	
	if(data.results.length > 0){
		console.log(' 4=== encontrou discogs');
		sourcesTags.discogs.track = data.results[0];
	}

	showTags();
});
console.log(sourcesTags);


*/



function onReadMusicFile(err, tag, props){
	console.dir(err ? err : {'tag': tag, 'audioProperties': props});
	console.info("sourceTags: ",i, sourceTags);
	// TODO: save image!
	var request = lastfm.request("track.getTopTags", {
		track: tag.title,
		artist: tag.artist,
		handlers: {
			success: onGetLastFMInfo,
			error: onConsultLastFMError
		}
	});
}

function onGetLastFMInfo(data){
	if(data.track.mbid){
		console.log(' 1=== encontrou track getInfo MBID lastfm');
		sourcesTags.mbid = data.track.mbid;
	}

	var request = lastfm.request("track.getTopTags", {
		track: tag.title,
		artist: tag.artist,
		handlers: {
			success: onConsultLastFM,
			error: onConsultLastFMError
		}
	});

	
//	db.search("", { artist: tag.artist, track: tag.title}, onConsultDiscogs);

}

function onConsultLastFM(data){
	console.log(' 2=== encontrou track getInfo MBID lastfm');
	sourcesTags.lastfm.track = data.toptags;
//		console.log("UHU: " , data, data.toptags, data.length);
	for(i=0; i<=data.length; i++){
//				console.log(i, data[i]); 
	}
	showTags();

	
//	db.search("", { artist: tag.artist, track: tag.title}, onConsultDiscogs);

}
function onConsultLastFMError(err){
	console.log("Error: " , err);

}
function onConsultDiscogs(err, data){
	if(data.results.length > 0){
		console.log(' 4=== encontrou discogs');
		sourcesTags.discogs.track = data.results[0];
	}

	showTags();
}


var sourceTags = [];
for (var i = 0; i < tracks.length; i++) {
	sourceTags[i] = sourcesSource;
	taglib.read(tracks[i], onReadMusicFile);
}
console.log(sourcesTags);

/*
var request = lastfm.request("artist.getTopTags", {
		artist: tag.artist,
		handlers: {
			success: function(data) {
				sourcesTags.lastfm.artist = data.toptags;
				console.log("Success: " , data, data.toptags, data.length);
				 for(i=0; i<=data.length; i++){
						console.log(i, data[i]); 
				}
			},
			error: function(error) {
					console.log("Error: " , error.message);
			}
		}
});*/





/*
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
*/
/*
db.release(176126, function(err, data){
 //   console.log(data);
});
*/
/*
var col = new Discogs2().user().collection();
*/
/*
col.releases('dj_spark', 0, {page: 2, per_page: 75}, function(err, data){
		console.log(data);
});
*/
