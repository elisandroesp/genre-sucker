
// BUG: o 'this' do objeto se perde após o primeiro processo 'async'


var taglib = require('taglib');

var LastFmNode = require('lastfm').LastFmNode;
var lastfm = new LastFmNode({
	api_key: '7e4979e72c557156feeb8b1fe1adc12e',    // sign-up for a key at http://www.last.fm/api
	secret: 'be9f587c0ba0635cc4de4762b1d36c47',
	useragent: 'appname/vX.X MyApp' // optional. defaults to lastfm-node.
});

var Discogs2 = require('disconnect').Client;
var db = new Discogs2({
	consumerKey: 'srolJgNVDDStSniQPnTp', 
	consumerSecret: 'RqpjuDxPGPIZerYleQeyrbWkTCZurEgG'
}).database();


function Track(filename) {
	this.filename = filename || "";
	this.title; 
	this.year;
	this.artist; 	
	this.genres = "";
	this.comments = "";
	this.filetag = {};
	this.fileprops = {};
	this.discogsResults = {};
	this.mbid = null;

}

Track.prototype.getFileInfo = function() {
//	console.log('x', this, this.filename);

	taglib.read(this.filename, this.getLastfmInfo.bind(this));
	// body...
};
Track.prototype.set = function() {
	// body...
};

Track.prototype.getLastfmInfo = function(err, tag, props){
	//console.dir({'tag': tag, 'audioProperties': props});
	this.filetag = tag;
	this.fileprops = props;

	console.log('y', this);
	var request = lastfm.request("track.getInfo", {
		track: this.filetag.title,
		artist: this.filetag.artist,
		handlers: {
			success: this.getLastfmTags.bind(this),
			error: this.onConsultLastFMError.bind(this),
		}
	});
};

Track.prototype.getLastfmTags = function(data) {
	if(data.track.mbid){
		console.log(' 1=== encontrou track getInfo MBID lastfm');
		this.mbid = data.track.mbid;
	}
	var request = lastfm.request("track.getTopTags", {
		track: this.filetag.title,
		artist: this.filetag.artist,
		handlers: {
			success: this.getDiscogsInfo.bind(this),
			error: this.onConsultLastFMError.bind(this),
		}
	});
};

Track.prototype.getDiscogsInfo = function(data) {
	var self = this;
	db.search("", { artist: this.filetag.artist, track: this.filetag.title}, function(err, data){
		// console.log(err, data);
		
		if(data.results.length > 0){
			console.log(' 4=== encontrou discogs');
			console.info(data.results[0].style);
			console.info(data.results[0]);
			this.discogsResults = data;

/*
{ style: [ 'Hi NRG' ],
  thumb: 'https://api-img.discogs.com/yIM9jA43voZxwooMc0_UpPTQOSE=/fit-in/150x150/filters:strip_icc():format(jpeg):mode_rgb()/discogs-images/R-297751-1261223355.jpeg.jpg',
  format: [ 'Vinyl', '12"', '33 ⅓ RPM' ],
  country: 'Canada',
  barcode: [ 'BS-029 CRC' ],
  uri: '/Divine-Shoot-Your-Shot/release/297751',
  community: { want: 29, have: 23 },
  label: 
   [ 'Black Sun',
     'Downstairs Records Ltd.',
     '"O" Records',
     'Unidisc Records Ltd.' ],
  catno: 'BS-029',
  year: '1982',
  genre: [ 'Electronic' ],
  title: 'Divine - Shoot Your Shot',
  resource_url: 'https://api.discogs.com/releases/297751',
  type: 'release',
  id: 297751 }
*/
		}
		self.chooseInfo();
	});
};

Track.prototype.chooseInfo = function() {
	console.log(' <--- choooose --->', this);
	this.writeInfo();
};

Track.prototype.writeInfo = function() {
	console.log(' <--- É O FIM --->', this);
};

Track.prototype.onConsultLastFMError = function(err) {
	console.log("Error: " , err);
};

module.exports = Track;