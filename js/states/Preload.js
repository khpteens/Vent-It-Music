// Preload.js

var Vent = Vent || {};

var h1_style, h2_style, h3_style, p_style, p_style_center, buttonStyle;
var audioData = new Object;

// constant colours
var noColour = 0xffffff,
	isDownColour = 0xf6d809,
	defaultColour = noColour, // 0xfc6744;
	groundColour = 0x646A11;

//loading the game assets
Vent.Preload = function() {};

Vent.Preload.prototype = {
	preload: function() {

		createBG(0x000000);

		// show logo in loading screen
		this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
		this.splash.anchor.setTo(0.5);
		this.splash.scale.set(0.5);

		// add preloader
		this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
		this.preloadBar.anchor.setTo(0.5);

		this.load.setPreloadSprite(this.preloadBar);

		// Images
		// fpo
		this.load.image('fpo-square', 'assets/img/fpo-square.gif');
		this.load.image('fpo-circle', 'assets/img/fpo-circle.png');
		this.load.image('square', 'assets/img/white-square.gif');
		this.load.image('circle', 'assets/img/white-circle.png');

		// wordmark
		this.load.image('wordmark', 'assets/img/wordmark.png');

		// sprites			
		this.load.image('guitar', 'assets/img/guitar.png');
		this.load.image('crowd', 'assets/img/music-bg.jpg');

		// drums
		this.load.image('drum-hat', 'assets/img/drum-hat.png');
		this.load.image('drum-snare', 'assets/img/drum-snare.png');
		this.load.image('drum-small', 'assets/img/drum-small.png');
		this.load.image('drum-large', 'assets/img/drum-large.png');

		// icons & emojis
		this.load.image('emoji1', 'assets/img/emoji1.png');
		this.load.image('emoji2', 'assets/img/emoji2.png');
		this.load.image('emoji3', 'assets/img/emoji3.png');
		this.load.image('emoji4', 'assets/img/emoji4.png');	
		this.load.image('icon-phone', 'assets/img/phone.png');	
		this.load.image('icon-chat', 'assets/img/chat.png');		
		this.load.image('icon-x', 'assets/img/x.png');	

		// Audio        
		this.load.audio('chord1', ['assets/audio/guitar/guitar-power-a2-short.mp3','assets/audio/guitar/guitar-power-a2-short.ogg']);
		this.load.audio('chord2', ['assets/audio/guitar/guitar-power-a-short.mp3','assets/audio/guitar/guitar-power-a-short.ogg']);
		this.load.audio('chord3', ['assets/audio/guitar/guitar-power-d-short.mp3','assets/audio/guitar/guitar-power-d-short.ogg']);
		this.load.audio('chord4', ['assets/audio/guitar/guitar-power-e-short.mp3','assets/audio/guitar/guitar-power-e-short.ogg']);
		this.load.audio('chord5', ['assets/audio/guitar/guitar-power-f-short.mp3','assets/audio/guitar/guitar-power-f-short.ogg']);
		this.load.audio('guitarLoop', ['assets/audio/guitar/guitar-loop-01.mp3','assets/audio/guitar/guitar-loop-01.ogg']);

		this.load.audio('drum1', ['assets/audio/drums/kick.mp3','assets/audio/drums/kick.ogg']);
		this.load.audio('drum2', ['assets/audio/drums/snare.mp3','assets/audio/drums/snare.ogg']);
		this.load.audio('drum3', ['assets/audio/drums/tom.mp3','assets/audio/drums/tom.ogg']);
		this.load.audio('drum4', ['assets/audio/drums/hat.mp3','assets/audio/drums/hat.ogg']);
		this.load.audio('drumLoop', ['assets/audio/drums/drum-loop-09.mp3','assets/audio/drums/drum-loop-09.ogg']);				

		// Webfonts
		// The Google WebFont Loader will look for this object, so create it before loading the script.
		WebFontConfig = {
			//  'active' means all requested fonts have finished loading
			//  We set a 1 second delay before calling 'createText'.
			//  For some reason if we don't the browser cannot render the text the first time it's created.
			active: function() {
				Vent.game.time.events.add(Phaser.Timer.SECOND, createText, this);
			},
			//  The Google Fonts we want to load (specify as many as you like in the array)
			google: {
				families: ['Open+Sans:300,400,700:latin']
			}
		};
		this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		
		createStyles(); // set Title, body styles for project
	},
	create: function() {

		this.state.start('MainMenu');
	}
};

function createText(){
	// do nothing
}

function load_audio_data(obj, path) {
	var fileName = path.substring(path.lastIndexOf("/") + 1, path.indexOf(".mp3"));
	var dataPath = path.substring(0, path.lastIndexOf("/") + 1) + "data/" + fileName;

	jQuery.get(dataPath + '_avg.txt', function(data) {
		save_data(data, obj);
	});
}

function save_data(data, obj) {

	audioData[obj] = data.split(",");
}

function createStyles() {

	var black = "#000";
	var white = "#fff";

	h1_style = {
		font: "700 50px Open Sans",
		fill: white,
		align: "center"
	};
	h2_style = {
		font: "300 40px Open Sans",
		fill: white,
		align: "center"
	};
	h3_style = {
		font: "300 25px Open Sans",
		fill: white,
		align: "center"
	};
	h3_style_bold = {
		font: "700 25px Open Sans",
		fill: white,
		align: "center"
	};
	h3_style_gray = {
		font: "300 25px Open Sans",
		fill: "gray",
		align: "center"
	};
	p_style = {
		font: "300 20px Open Sans",
		fill: white
	};
	p_style_center = {
		font: "300 20px Open Sans",
		fill: white,
		align: "center"
	};
	copyright_style = {
		font: "300 10px Open Sans",
		fill: "#938884",
		align: "right"
	};
	button_style = {
		font: "400 16px Open Sans",
		fill: white,
		align: "center"
	};
	touch_button_style = {
		font: "400 22px Open Sans",
		fill: black,
		align: "center"
	};
}