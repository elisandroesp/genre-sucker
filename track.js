
// BUG: o 'this' do objeto se perde após o primeiro processo 'async'


var taglib = require('taglib');

var LastFmNode = require('lastfm').LastFmNode;
var lastfm = new LastFmNode({
	api_key: '7e4979e72c557156feeb8b1fe1adc12e',    // sign-up for a key at http://www.last.fm/api
	secret: 'be9f587c0ba0635cc4de4762b1d36c47',
	useragent: 'appname/vX.X MyApp' // optional. defaults to lastfm-node.
});

function Track(filename) {
	this.filename = filename || "";
	this.title; 
	this.year;
	this.artist; 	
	this.genres = "";
	this.comments = "";
		this.filetag = {};
	this.fileprops = {};

}

Track.prototype.getFileInfo = function() {
//	console.log('x', this, this.filename);

	taglib.read(this.filename, this.getLastfmInfo);
	// body...
};
Track.prototype.set = function() {
	// body...
};
Track.prototype.getLastfmTags = function(data) {
	if(data.track.mbid){
		console.log(' 1=== encontrou track getInfo MBID lastfm');
		sourcesTags.mbid = data.track.mbid;
	}
/*
	var request = lastfm.request("track.getTopTags", {
		track: tag.title,
		artist: tag.artist,
		handlers: {
			success: this.getLastfmTags,
			error: function(err) {
	console.log("Error: " , err);
}
		}
	});
*/
};
Track.prototype.getLastfmInfo = function(err, tag, props){
	//console.dir({'tag': tag, 'audioProperties': props});
	this.filetag = tag;
	this.fileprops = props;
console.info(typeof this.getLastfmTags);
//	console.log('y', this);
	var request = lastfm.request("track.getTopTags", {
		track: tag.title,
		artist: tag.artist,
		handlers: {
			success: this.getLastfmTags,
			error: function(err) {
	console.log("Error: " , err);
},
		}
	});
	
};

Track.prototype.getDiscogsInfo = function(data) {
	// body...
};

Track.prototype.onConsultLastFMError = function(err) {
	console.log("Error: " , err);
};

module.exports = Track;