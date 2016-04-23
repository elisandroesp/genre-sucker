
/*

TODO 20160420
- ler data.json e escolher as tags

 */





require('./config.js');
var walkSync = require('walk-sync');
var paths = walkSync('./', {directories: false, globs: ['**/*.mp3'] });

options.init();
// console.info('---- ', options, '----');


var jsonfile = require('jsonfile')




var prefs = {


	// Replace a discogs genre string with your own
	replaceGenres: {
		'Folk, World, & Country': 'Traditional',
		'RnB/Swing': 'R&B'
	},

	// The title of the album on discogs must not be more dissimilar in % to the title in itunes
	matchThreshold: 35 //%
};



var Choice = require('./choice.js');


var musicFiles = [];

var readJsonData = function(){
	var file = 'data.json'
	var x = jsonfile.readFileSync(file);
	console.log('read: ', x);

};

readJsonData();
/*
var readMusicFiles = function(){
	
//	var musicFile = new Track();
	for (var i = 0; i < paths.length; i++) {
		musicFiles[i] =  new Track(paths[i], i, paths.length, totalAsync);
		musicFiles[i].getFileInfo();
		
	}
}
readMusicFiles();
//console.log('musicFiles', musicFiles);

GLOBAL.finaliza = function(){
	var jsonfile = require('jsonfile')
	var file = 'data.json'
	jsonfile.writeFile(file, musicFiles, function (err) {
	  console.error(err)
	});
};
*/


