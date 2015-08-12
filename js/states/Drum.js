// Game.js

var Vent = Vent || {};

//title screen
Vent.Drum = function() {};

/********************************************************************/

// constants colours
var COLOUR_WHITE = 0xffffff,
	COLOUR_BLACK = 0x000000;

var hitTotal = 0,
	trail = null, // mouse trail particle emitter
	trailOn = false,
	barTotal = 0;

// groups
var buttons, bar_group, bg_drum_group;

// arrays
var hits = [],
	hitSounds = [],
	hitsToDestroy = [],
	playing = [],
	stopPlaying = [],
	bars = [],
	brandColours = [0x4ac7eb, 0x015095, 0xfc6744, 0xf6d809, 0xc1cd23, 0xffffff, 0x000000];

var swipeCoordX,
	swipeCoordY,
	swipeCoordX2,
	swipeCoordY2,
	swipeMinDistance = 100;

var graphics = null;

var bgGame,
	pop,
	hitGoal_txt,
	sw, sw2, sb,
	lastX = 0,
	lastY = 500;

var audioLength = 100,
	audioFileName,
	audioComplete = false,
	averages = [],
	volumes = [],
	all = [],
	guitarLoop;


/********************************************************************/

Vent.Drum.prototype = {
	create: function() {

		createDrumWorldSettings();

		bg_drum_group = Vent.game.add.group();

		bgGame = this.game.add.sprite(this.game.width / 2, this.game.height / 2, "crowd");
		bgGame.width = this.game.world.width;
		bgGame.height = this.game.world.height;
		bgGame.scale.set(1.2);		
		bgGame.anchor.set(0.5);		
		bg_drum_group.add(bgGame);	
		bgGame.bringToTop();	

		createCopyright();
		createDrumAudio();	
		createDrumUI();

		pop = Vent.game.add.sprite(Vent.game.width / 2, Vent.game.height / 2, "circle");
		pop.alpha = 0;
		bg_drum_group.add(pop);

		// Continue prompt
		var text = "Click the drums";
		if (hasTouch) text = "Tap the drums";
		var prompt = this.game.add.text(this.game.width / 2, this.game.height / 2 + 10, text, p_style);
		prompt.anchor.set(0.5);
		setTimeout(function() {
			Vent.game.add.tween(prompt).to({
				alpha: 0
			}, 1500, Phaser.Easing.Cubic.Out, true);
		}, 4000);
	},
	update: function() {},
	render: function() {
		// this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
	}
};

function createDrumWorldSettings() {
	Vent.game.world.setBounds(0, 0, settings.WIDTH, settings.HEIGHT);
	Vent.game.stage.backgroundColor = 0x222222;
}

function createDrumUI() {
	createDrumInputListeners();
	createDrumButtons();	
}

function createDrumInputListeners() {

	bgGame.events.onInputDown.add(function() {

		swipeCoordX = Vent.game.input.activePointer.x;
		swipeCoordY = Vent.game.input.activePointer.y;

		// startTrail();
	}, this);

	bgGame.events.onInputUp.add(function() {

		swipeCoordX2 = Vent.game.input.activePointer.x;
		swipeCoordY2 = Vent.game.input.activePointer.y;

		if (swipeCoordX2 < swipeCoordX - swipeMinDistance) {
			// console.log("left");
		} else if (swipeCoordX2 > swipeCoordX + swipeMinDistance) {
			// console.log("right");
		} else if (swipeCoordY2 < swipeCoordY - swipeMinDistance) {
			// console.log("up");
		} else if (swipeCoordY2 > swipeCoordY + swipeMinDistance) {
			// console.log("down");
		}
		
	}, this);
}

function createDrumButtons() {

	buttons = Vent.game.add.group(); // create a group to contain all option screen elements

	var ExitBt = Vent.game.add.sprite(Vent.game.width - 29, 29, "square");
	createBt(ExitBt, "icon-x", false, "circle");
	ExitBt.events.onInputUp.add(function() {
		drumExit();
	});
	buttons.add(ExitBt);
	buttons.add(ExitBt.label);

	createDrums();
}

function createDrums() {  

	var d2 = Vent.game.add.sprite(Vent.game.width / 2 - 75, Vent.game.height / 2 + 75, "drum-snare");
	createDrum(d2);
	d2.anchor.set(0.75, 0.25);
	d2.events.onInputDown.add(function() {
		playDrumAudio(beat2);
	});
	buttons.add(d2);

	var d3 = Vent.game.add.sprite(Vent.game.width / 2 + 75, Vent.game.height / 2 - 75, "drum-small");
	createDrum(d3);	
	d3.anchor.set(0.25, 0.75);
	d3.events.onInputDown.add(function() {
		playDrumAudio(beat3);
	});
	buttons.add(d3);

	var d4 = Vent.game.add.sprite(Vent.game.width / 2 + 75, Vent.game.width / 2 + 160, "drum-large");
	createDrum(d4);
	d4.anchor.set(0.25);
	d4.events.onInputDown.add(function() {
		playDrumAudio(beat4);
	});
	buttons.add(d4);

	var d1 = Vent.game.add.sprite(Vent.game.width / 2 - 50, Vent.game.height / 2 - 65, "drum-hat");
	createDrum(d1);
	d1.anchor.set(0.75);
	d1.events.onInputDown.add(function() {
		playDrumAudio(beat1);  
	});
	buttons.add(d1);
}

function createDrum(button) {

	button.w = button.width; 
	button.h = button.height;

	button.inputEnabled = true;
	button.input.useHandCursor = true;
	button.tint = 0xffffff;
	button.bringToTop();
	button.alpha = 1;

	button.events.onInputOver.add(function() {
		button.alpha = 0.5;
	});

	button.events.onInputOut.add(function() {
		button.alpha = 1;
	});

	button.events.onInputDown.add(function() {

		var myTint = Math.random() * 0xffffff;
		// var myTint = brandColours[Math.floor(Math.random() * brandColours.length)];

		button.tint = myTint;
		button.width = button.w * 0.5;
		button.height = button.h * 0.5;
		Vent.game.add.tween(button).to({
			width: button.w,
			height: button.h,
			alpha: 1
		}, 200, Phaser.Easing.Bounce.Out, true);
		button.alpha = 0.5;

		create_bg_pop(Vent.game.input.activePointer.x, Vent.game.input.activePointer.y, myTint);
	});

	button.events.onInputUp.add(function() {
		button.alpha = 1;
		button.tint = 0xffffff;
	});
}

function createDrumAudio() {

	beat1 = Vent.game.add.audio('drum4');
	beat2 = Vent.game.add.audio('drum2');
	beat3 = Vent.game.add.audio('drum1');
	beat4 = Vent.game.add.audio('drum3');

	guitarLoop = Vent.game.add.audio('guitarLoop');
	guitarLoop.loop = true;
	guitarLoop.volume = settings.VOLUME;
	guitarLoop.play();
	settings.LOOP = guitarLoop;
}

function createDrumVisualization() {

	// create sound bars

	// add bouncing background
	sb = Vent.game.add.sprite(Vent.game.width / 2, Vent.game.height / 2, "square");
	sb.width = Vent.game.width;
	sb.height = Vent.game.height;
	sb.anchor.set(0.5);
	sb.tint = 0x444444;
	bg_drum_group.add(sb);	
}

function playDrumAudio(mysound) {

	if (settings.SOUND_ON && settings.VOLUME > 0) {		
		mysound.play();
		mysound.frame = 0;
		playing.push(mysound);
	}
}

function drumExit() {

	Vent.game.input.onDown.removeAll();
	Vent.game.input.onUp.removeAll();

	guitarLoop.stop();

	// delayed call to exit current state
	setTimeout(function() {

		// reset game
		hitTotal = 0;
		destroyAllHits();		

		// go to Finish screen
		Vent.game.stateTransition.to("Finish");

	}, 500);
}

function create_bg_pop(x, y, tint) {

	if (!x) x = Vent.game.width / 2;
	if (!y) y = Vent.game.height / 2;
	if (!tint) tint = Math.random() * 0xffffff;

	pop.x = x;
	pop.y = y;

	pop.width = pop.height = 0;
	pop.anchor.set(0.5);
	pop.tint = tint;
	pop.alpha = 1;

	Vent.game.add.tween(pop).to({
		width: 900,
		height: 900,
		alpha: 0
	}, 1000, Phaser.Easing.Exponential.Out, true);
}

function updateDrumVisualization() {

	var len = playing.length,
		total = 0;

	if (len > 0) {
		for (var i = 0; i < len; i++) {

			var fr = playing[i].frame,
				nm = playing[i].name;

			if (fr >= audioData[nm].length) {
				playing[i].frame = -1;
			} else {
				playing[i].frame++;
				total += Number(audioData[nm][fr]);
			}
		}
		cleanPlayVisual();

		var scaleMod = 1 / 2,
			alphaMod = 1 / 100;

		sb.width = Vent.game.width - total * scaleMod;
		sb.height = Vent.game.height - total * scaleMod;

		sw.width = sw.height = 800 - (total * 5);
		sw.alpha = total * alphaMod;
		sw.rotation += 5;

		sw2.width = sw2.height = total * 5;
		sw2.alpha = total * alphaMod;
		sw.rotation -= 5;
		sw.tint = sw2.tint = 0xffffff;

	}
	add_audio_bar(total);
}

function cleanPlayVisual() {

	for (var i = 0; i < playing.length; i++) {
		if (playing[i].frame == -1) {
			playing.splice(i, 1);
			i -= 1;
		}
	}
}