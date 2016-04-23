
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

var prompt = require('prompt');
prompt.start();


function Track(filename, seq, total, totalAsync) {
	this.seq = seq;
	this.total = total;
	this.filename = filename || "";
	this.title; 
	this.year;
	this.artist; 	
	this.genres = "";
	this.comments = "";
	this.filetag = {};
	this.fileprops = {};
	//this.discogsResults = {};
	this.allResults = {};
	this.mbid = null;
	this.tagObject = {};

}

Track.prototype.getFileInfo = function() {
//	console.log('x', this, this.filename);
	taglib.tag(this.filename, this.getLastfmInfo.bind(this));

	// body...
};
Track.prototype.set = function() {
	// body...
};

Track.prototype.getLastfmInfo = function(err, tag, props){
	//console.dir({'tag': tag, 'audioProperties': props});
	this.filetag = tag;
	this.fileprops = props;
	this.allResults['tags'] = tag;
	this.allResults['props'] = props;

//	tag.comment = "teste2";
//	this.filetag.saveSync();
//	console.log('y', this);
	GLOBAL.totalAsync++;
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
	GLOBAL.totalAsync--;
	GLOBAL.totalAsync++;
	if(data.track.mbid){
//		console.log(' 1=== encontrou track getInfo MBID lastfm');
		this.mbid = data.track.mbid;
		this.allResults['lastfm'] = data;
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
Track.prototype.onConsultLastFMError = function(err) {
//	console.log('====error: ', err, this);
	GLOBAL.totalAsync--;
}

// TODO: permitir ao usuário escolher qual release
Track.prototype.getDiscogsInfo = function(data) {
	var self = this;
	this.allResults['lastfmTopTags'] = data;
	GLOBAL.totalAsync--;
	GLOBAL.totalAsync++;
/*
	var schema = {
	    properties: {
			escolha: {
				type: 'integer',
				message: 'Entre com um número',
			//	required: true,
				default: 0
			}
		}
	};
*/
	db.search("", { artist: this.filetag.artist, track: this.filetag.title}, function(err, data){
		// console.log(err, data);
		if(err){
			console.log('discogs error: ', err);
		}
		if(data.results.length > 0){
	//		console.log(' 4=== encontrou discogs');
	//		console.info(data.results[0].style);
			
			/*
			var tr = [];
			if(data.results.length > 0){
				for(var j=0;j<data.results.length;j++){
					tr.push({escolha: j, genre:data.results[j].genre, style:data.results[j].style,  title:data.results[j].title });	
				}
			}
			console.info("DISCOGSSSS ", tr);
*/
			/*

			prompt.get(schema, function (err, result) {
			    //
			    // Log the results.
			    //
			    console.log('Command-line input received:');
			    console.log('  escolha feita: ' + result.escolha);
			    self.escolha = result.escolha;
			    
			  });
			*/



			self.allResults['discogs'] = data.results;

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
	
// só vou escrever no final! 
//		self.chooseInfo();
	
//	console.log(' <--- pegou pegou --->');
	self.writeInfo();


	});
};

Track.prototype.chooseInfo = function() {
	//console.log(' <--- choooose --->');
	var dr = this.discogsResults[0];
	if(dr.length > 0){
		var t = 'g:'+ dr.genre.join('g:') +' - s:'+ dr.style.join(', s:');
	//	console.log('tag: ', tag)
		this.filetag.genre = t;
		this.filetag.year = dr.year || null;
	//	this.filetag.xxx = "ok";
		this.filetag.saveSync();
		this.writeInfo();
	}
};




Track.prototype.writeInfo = function() {
	// console.log(' <--- É O FIM --->');
	GLOBAL.totalAsync--;
	if(GLOBAL.totalAsync == 0){
		console.log('terminou');
		GLOBAL.finaliza();
	}

};



module.exports = Track;