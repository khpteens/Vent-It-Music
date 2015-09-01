// Guitar.js

var Vent = Vent || {};

//title screen
Vent.Guitar = function() {};

/********************************************************************/

// constants colours
var COLOUR_WHITE = 0xffffff,
	COLOUR_BLACK = 0x000000;

var hitTotal = 0,
	trail = null, // mouse trail particle emitter
	trailOn = false,
	barTotal = 0;

// groups
var buttons, bar_group, bg_guitar_group;

// arrays
var hits = [],
	hitSounds = [],
	hitsToDestroy = [],
	playing = [],
	stopPlaying = [],
	bars = [];

var swipeCoordX,
	swipeCoordY,
	swipeCoordX2,
	swipeCoordY2,
	swipeMinDistance = 100,
	chord1, chord2, chord3, chord4, chord5, drumLoop;

var graphics = null;

var bgGame,
	guitar,
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
	bounce, bounce_guitar;


/********************************************************************/

Vent.Guitar.prototype = {
	create: function() {

		createGuitarWorldSettings();

		bg_guitar_group = Vent.game.add.group();

		bgGame = this.game.add.sprite(this.game.width / 2, this.game.height / 2, "crowd");
		bgGame.width = this.game.world.width;
		bgGame.height = this.game.world.height;
		bgGame.scale.set(1.2);
		bgGame.anchor.set(0.5);
		bg_guitar_group.add(bgGame);
		bgGame.bringToTop();

		createCopyright();

		createGuitarAudio();
		// createGuitarVisualization();

		createGuitarUI();

		pop = this.game.add.sprite(this.game.width / 2, this.game.height / 2, "circle");
		pop.alpha = 0;
		bg_guitar_group.add(pop);

		create_guitar_prompt();
	},
	update: function() {},
	render: function() {
		// this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
	}
};

function create_guitar_prompt() {

	var guitarPrompt = Vent.game.add.group();

	var clickblock = Vent.game.add.graphics(0,0);
	clickblock.inputEnabled = true;
	clickblock.beginFill(0x000000, 1);
	clickblock.boundsPadding = 0;
	clickblock.drawRect(0, 0, Vent.game.width, Vent.game.height - 30);
	clickblock.alpha = 0;
	guitarPrompt.add(clickblock);

	var overlay = Vent.game.add.graphics(0, 0);	
	overlay.beginFill(0x000000, 1);
	overlay.boundsPadding = 0;
	overlay.drawRect(0, Vent.game.height / 2-100, Vent.game.width, 200);
	overlay.alpha = 0.5;	
	guitarPrompt.add(overlay);

	// Instruction prompt   
	text = "Click the guitar to shred";
	if (hasTouch) text = "Tap the guitar to shred";
	winText = Vent.game.add.text(settings.WIDTH / 2, settings.HEIGHT / 2 - 40, text, h3_style_bold);
	winText.anchor.set(0.5);
	guitarPrompt.add(winText);

	// Continue button
	ContinueBt = Vent.game.add.sprite(settings.WIDTH / 2, settings.HEIGHT / 2 + 30, 'square');
	createBt(ContinueBt, "Continue", false);
	ContinueBt.events.onInputUp.add(function() {
		guitarPrompt.visible = false;
	}, this);
	guitarPrompt.add(ContinueBt.group);

	guitarPrompt.bringToTop = true;
}

function start_bg_bounce_tween() {

	bounce = Vent.game.add.tween(bgGame);

	bgGame.y = Vent.game.height / 2;

	bounce.to({
		y: Vent.game.world.height / 2 + (Math.random() * 200 - 100)
	}, 100, Phaser.Easing.Quadratic.In);
	bounce.onComplete.addOnce(back_bg_bounce_tween, this);
	bounce.start();
}

function back_bg_bounce_tween() {

	bounce = Vent.game.add.tween(bgGame);

	bounce.to({
		y: Vent.game.world.height / 2
	}, 400, Phaser.Easing.Bounce.Out);	
	bounce.start();
}

function start_guitar_bounce_tween() {

	bounce_guitar = Vent.game.add.tween(guitar);

	guitar.y = Vent.game.height / 2;

	bounce_guitar.to({
		y: Vent.game.world.height / 2 + (Math.random() * 100 - 50)
	}, 100, Phaser.Easing.Quadratic.In);
	bounce_guitar.onComplete.addOnce(back_guitar_bounce_tween, this);
	bounce_guitar.start();
}

function back_guitar_bounce_tween() {

	bounce_guitar = Vent.game.add.tween(guitar);

	bounce_guitar.to({
		y: Vent.game.world.height / 2
	}, 400, Phaser.Easing.Bounce.Out);
	bounce_guitar.start();
}

function createGuitarWorldSettings() {
	Vent.game.world.setBounds(0, 0, settings.WIDTH, settings.HEIGHT);
	Vent.game.stage.backgroundColor = 0x000000;
}

function createGuitarUI() {
	createGuitarInputListeners();
	createGuitarButtons();	
}

function createGuitarInputListeners() {

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

function createGuitarButtons() {

	buttons = Vent.game.add.group(); // create a group to contain all option screen elements

	var ExitBt = Vent.game.add.sprite(Vent.game.width - 29, 29, "square");
	createBt(ExitBt, "icon-x", false, "circle");
	ExitBt.events.onInputUp.add(function() {
		guitarExit();
	});
	buttons.add(ExitBt);
	buttons.add(ExitBt.label);

	createFrets();
}

function createFrets() {

	guitar = Vent.game.add.sprite(0, Vent.game.height / 2, "guitar");
	guitar.anchor.set(0, 0.5);
	buttons.add(guitar);

	var f1 = Vent.game.add.sprite(0, Vent.game.height / 2, "square");
	createFret(f1);
	f1.events.onInputDown.add(function() {
		playGuitarAudio(chord4);
	});
	buttons.add(f1);

	var f2 = Vent.game.add.sprite(Vent.game.width / 4, Vent.game.height / 2, "square");
	createFret(f2);
	f2.events.onInputDown.add(function() {
		playGuitarAudio(chord2);
	});
	buttons.add(f2);

	var f3 = Vent.game.add.sprite(Vent.game.width / 2, Vent.game.height / 2, "square");
	createFret(f3);
	f3.events.onInputDown.add(function() {
		playGuitarAudio(chord3);
	});
	buttons.add(f3);

	var f4 = Vent.game.add.sprite(Vent.game.width / 4 * 3, Vent.game.height / 2, "square");
	createFret(f4);
	f4.events.onInputDown.add(function() {
		playGuitarAudio(chord1);
	});
	buttons.add(f4);	
}

function createFret(button) {

	button.width = button.w = Vent.game.width / 4 - 1;
	button.height = button.h = 250;

	button.anchor.set(0, 0.5);
	button.inputEnabled = true;
	button.input.useHandCursor = true;
	button.tint = 0xffffff;
	button.bringToTop();
	button.alpha = 0;

	button.events.onInputOver.add(function() {
		button.alpha = 0.5;
	});

	button.events.onInputOut.add(function() {
		button.alpha = 0;
	});

	button.events.onInputDown.add(function() {		

		var myTint = Math.random() * 0xffffff;		

		button.tint = myTint;

		button.height = Vent.game.height;
		Vent.game.add.tween(button).to({
			//width: button.w,
			height: button.h,
			alpha: 0
		}, 300, Phaser.Easing.Quadratic.Out, true);
		button.alpha = 1;

		create_bg_pop(Vent.game.input.activePointer.x, Vent.game.input.activePointer.y, myTint);
	});

	button.events.onInputUp.add(function() {
		button.alpha = 1;		
	});
}

function createTrailGraphic(x, y, x2, y2) {
	if (graphics != null) {
		graphics.destroy();
	}
	graphics = Vent.game.add.graphics(0, 0);

	graphics.lineStyle(1, 0xffffff, 1);

	graphics.moveTo(swipeCoordX, swipeCoordY);
	graphics.lineTo(Vent.game.input.activePointer.x, Vent.game.input.activePointer.y);
	// graphics.alpha = 0.4;
}

function removeTrailGraphic() {

	graphics.destroy();
	graphics = null;
}

function createTrail() {

	trail = Vent.game.add.emitter(Vent.game.input.activePointer.x, Vent.game.input.activePointer.y, 200);
	trail.makeParticles(["smoke1", "smoke1", "smoke3"]); // set sprite or an array of sprites to use as particles
	//trail.bringToTop = true;

	// ALPHA
	trail.setAlpha(1, 0, 1000, Phaser.Easing.Cubic.Out); // start alpha, end alpha, animation duration, will always fade out as lifespan ends

	// SCALE
	trail.setScale(1, 0.5, 1, 0.5, 1000, Phaser.Easing.Cubic.Out); // (x start, x end, y start, y end, animation duration, Type of ease)    

	trail.minParticleSpeed.setTo(-10, -10); // x speed, y speed
	trail.maxParticleSpeed.setTo(10, 10); // x speed, y speed

	// ROTATION    
	trail.setRotation(0, 0); // (start rotation, end rotation, duration, ease) default is (0, 360)

	trail.gravity = 0; // default is 0;  

	// START
	// 1. set the effect to "explode" which means all particles are emitted at once
	// 2. each particle's lifespan (ms). 
	// 3. set the rate of particle emission in particles per frame. This is ignored when parameter 1 is true.
	// 4. # of particles to be emitted.
	trail.start(false, 1000, 0.5, 200);

	updateTrail();
}

function startTrail() {

	createTrail();
}

function stopTrail() {

	trail.destroy();
	trail = null;
}

function updateTrail() {

	if (trail != null) {
		// make trail follow pointer
		trail.emitX = Vent.game.input.activePointer.x;
		trail.emitY = Vent.game.input.activePointer.y;

		createTrailGraphic();
	}
}

function createGuitarAudio() {

	chord1 = Vent.game.add.audio('chord1');
	chord2 = Vent.game.add.audio('chord2');
	chord3 = Vent.game.add.audio('chord3');
	chord4 = Vent.game.add.audio('chord4');
	chord5 = Vent.game.add.audio('chord5');

	drumLoop = Vent.game.add.audio('drumLoop');
	drumLoop.loop = true;
	drumLoop.volume = settings.VOLUME;
	drumLoop.play();
	settings.LOOP = drumLoop;
}

function createGuitarVisualization() {

	// create sound bars

	// add bouncing background
	sb = Vent.game.add.sprite(Vent.game.width / 2, Vent.game.height / 2, "square");
	sb.width = Vent.game.width;
	sb.height = Vent.game.height;
	sb.anchor.set(0.5);
	sb.tint = 0x444444;
	bg_guitar_group.add(sb);

	// create a group to keep all bars at the same depth
	bars_group = Vent.game.add.group();
}

function playGuitarAudio(mysound) {

	start_bg_bounce_tween();
	start_guitar_bounce_tween();

	if (settings.SOUND_ON && settings.VOLUME > 0) {
		mysound.play();
		mysound.frame = 0;
		// playing.push(mysound);
	}
}

function guitarExit() {

	Vent.game.input.onDown.removeAll();
	Vent.game.input.onUp.removeAll();

	drumLoop.stop();

	// delayed call to exit current state
	setTimeout(function() {

		// reset game
		hitTotal = 0;
		destroyAllHits();

		// go to Finish screen
		if (!hasTouch) {
			Vent.game.stateTransition.to("Finish");
		} else {
			Vent.game.state.start("Finish");
		}

	}, 500);
}

function createHit() {

	hitTotal++;

	if (hitTotal === hitGoal) {
		guitarExit();

	} else {
		var r = Math.floor(Math.random() * hitSounds.length);
		playAudio(hitSounds[r]);

		var r2 = Math.floor(Math.random() * 6); // 0,1,2,3        
		if (r2 == 0) {
			playAudio(cheer);
		}

		var x = Vent.game.input.activePointer.x,
			y = Vent.game.input.activePointer.y;

		createSmoke(x, y);
		createSplinters(x, y);
		createWave(x, y);
		createBall(x, y);
		create_bg_pop();
		sw.x = sw2.x = x;
		sw.y = sw2.y = y;
	}
}

function create_bg_pop() {

	var pop = Vent.game.add.sprite(Vent.game.width / 2, Vent.game.height / 2, "circle");
	pop.width = pop.height = 0;
	pop.anchor.set(0.5);
	pop.tint = Math.random() * 0xffffff;
	pop.alpha = 1;

	bg_guitar_group.add(pop);

	Vent.game.add.tween(pop).to({
		width: 900,
		height: 900,
		alpha: 0
	}, 1000, Phaser.Easing.Exponential.Out, true);
}

function createSplinters(x, y) {

	var em = Vent.game.add.emitter(x, y, 8); // x, y and # of particles
	// particles auto rotate and auto fade based on their lifespan.

	em.makeParticles(["wood1", "wood2", "wood3", "wood4", "dirt2"]); // set sprite or an array of sprites to use as particles
	em.bringToTop = true;

	// ALPHA
	em.setAlpha(1, 1, 3000); // start alpha, end alpha, animation duration, will always fade out as lifespan ends

	// SCALE
	em.setScale(0, 0.5, 0, 0.5, 3000); // (x start, x end, y start, y end, animation duration, Type of ease)    

	em.minParticleSpeed.setTo(-300, -500); // x speed, y speed
	em.maxParticleSpeed.setTo(300, 100); // x speed, y speed

	// ROTATION    
	em.setRotation(-360, 360, 3000); // (start rotation, end rotation, duration, ease) default is (0, 360)

	em.gravity = 400; // default is 0;

	em.start(true, 3000, null, 50);

	hits.push(em);
}

function createBall(x, y) {

	var em = Vent.game.add.emitter(x, y, 1); // x, y and # of particles
	// particles auto rotate and auto fade based on their lifespan.

	em.makeParticles("ball"); // set sprite or an array of sprites to use as particles
	em.bringToTop = true;

	// ALPHA
	em.setAlpha(1, 1, 3000); // start alpha, end alpha, animation duration, will always fade out as lifespan ends

	/* TOWARDS USER */
	// SCALE
	em.setScale(0, 2, 0, 2, 3000); // (x start, x end, y start, y end, animation duration, Type of ease)    

	em.minParticleSpeed.setTo(-500, -800); // x speed, y speed
	em.maxParticleSpeed.setTo(500, 100); // x speed, y speed

	em.setRotation(0, 180, 3000); // (start rotation, end rotation, duration, ease) default is (0, 360)

	em.gravity = 400; // default is 0;

	// START
	// 1. set the effect to "explode" which means all particles are emitted at once
	// 2. each particle's lifespan (ms). 
	// 3. set the rate of particle emission in particles per frame. This is ignored when parameter 1 is true.
	// 4. # of particles to be emitted.
	em.start(true, 3000, null, 50);

	hits.push(em);
}

function createSmoke(x, y) {

	var em = Vent.game.add.emitter(x, y, 10); // x, y and # of particles    

	em.makeParticles(["smoke1", "smoke2", "smoke3"]); // set sprite or an array of sprites to use as particles        

	// ALPHA
	em.setAlpha(1, 0, 3000); // start alpha, end alpha, animation duration, will always fade out as lifespan ends

	// SCALE
	em.setScale(0, 5, 0, 5, 3000); // (x start, x end, y start, y end, animation duration, Type of ease)
	em.minParticleScale = 0; // set starting min scale
	em.maxParticleScale = 4; // set starting max scale

	em.minParticleSpeed.setTo(-200, -200); // x speed, y speed
	em.maxParticleSpeed.setTo(200, 200); // x speed, y speed

	// ROTATION
	em.setRotation(0, 180, 3000); // (start rotation, end rotation, duration, ease) default is (0, 360)

	em.start(true, 3000, null, 50);

	hits.push(em);
}

function createWave(x, y) {

	var em = Vent.game.add.emitter(x, y, 2); // x, y and # of particles    

	em.makeParticles("wave"); // set sprite or an array of sprites to use as particles
	em.bringToTop = true;

	// ALPHA
	em.setAlpha(0.5, 0, 1000); // start alpha, end alpha, animation duration, will always fade out as lifespan ends

	// SCALE
	em.setScale(0, 0.35, 0, 0.35, 1000); // (x start, x end, y start, y end, animation duration, Type of ease)

	em.setRotation(-45, 45, 1000); // (start rotation, end rotation, duration, ease) default is (0, 360)

	em.gravity = 0; // default is 0;

	em.start(true, 1000, null, 1);

	hits.push(em);
}

function updateHits() {

	var i = 0;
	var len = hits.length;
	var max = 9;

	if (len > max) {
		var lenR = len - max;
		for (var j = 0; j < lenR; j++) {
			hitsToDestroy.push(hits[j]);
		}
	}

	// update hits that are not currently being removed
	for (i = lenR; i < len; i++) {
		updateHit(hits[i]);
	}
	destroyHits();
}

function updateHit(h) {
	h.y += 2;

	h.width += 5;
	h.height += 5;
	h.alpha -= 0.01;

	if (h.y > Vent.game.world.height) {
		hitsToDestroy.push(h);
	}
}

function updateGuitarVisualization() {

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

	}
	add_audio_bar(total);
}

function add_audio_bar(v) {

	var scaleMod = 2,
		shift = 0;

	var curY = v * scaleMod,
		curX = barTotal;
	if (lastY == 0 && lastX == 0) {
		lastY = curY;
	}

	var bar = Vent.game.add.sprite(curX, Vent.game.height + shift, "square");
	bar.width = 3;
	bar.height = curY;
	bar.anchor.set(0, 1);
	bar.tint = 0x777777;
	bars.push(bar);
	bars_group.add(bar);

	var line = Vent.game.add.graphics(0, 0);
	line.lineStyle(3, 0xffffff, 1);
	line.moveTo(lastX, Vent.game.height + shift - lastY);
	line.lineTo(curX, Vent.game.height + shift - curY);
	bars.push(line);
	bars_group.add(line);

	if (barTotal < Vent.game.width) {
		barTotal += 5;
		lastX = curX;
		lastY = curY;
	} else {
		bars_reset();
		lastX = 0;
		lastY = 0;
	}
}

function bars_reset() {
	barTotal = 0;
	for (var i = 0, len = bars.length; i < len; i++) {
		bars[i].destroy();
	}
	bars = [];
	lastY = 0;
	lastX = 0;
}

function cleanPlayVisual() {

	for (var i = 0; i < playing.length; i++) {
		if (playing[i].frame == -1) {
			playing.splice(i, 1);
			i -= 1;
		}
	}
}

// Garbage collection
function destroyAllHits() {
	for (var i = 0, len = hits.length; i < len; i++) {
		hitsToDestroy.push(hits[i]);
	}
	hits = [];
	destroyHits();
}

function destroyHits() {

	for (var i = 0, len = hitsToDestroy.length; i < len; i++) {
		destroyHit(hitsToDestroy[i]);
	}
	hitsToDestroy = [];
}

function destroyHit(h) {

	// 1. destroy sprite
	h.destroy();

	// 2. remove hit from hits array    
	for (var i = 0, len = hits.length; i < len; i++) {
		if (h == hits[i]) {
			hits.splice(i, 1);
		}
	}
}