// Finish.js

var hitGoal = null;

var Vent = Vent || {};

//loading the game assets
Vent.Pick = function() {};

Vent.Pick.prototype = {
	create: function() {

		createBG(0x938884);
		createCopyright();

		// // "How stressed are you?"
		// var text = "How stressed are you?";		
		// var t = this.game.add.text(this.game.width / 2, this.game.height / 2 - 125, text, h3_style);
		// t.anchor.set(0.5);	

		// "How many baseballs do you need to hit?"
		text = "Which instrument\ndo you want to play?";
		var t2 = this.game.add.text(this.game.width / 2, this.game.height / 2 - 70, text, h2_style);
		t2.anchor.set(0.5);

		// bt "Just a few"
		text = "Shred on guitar";
		var aFewBt = this.game.add.sprite(this.game.width / 2, this.game.height / 2 + 50, "square");
		createBt(aFewBt, text, false, false, "emoji1");
		aFewBt.events.onInputUp.add(function() {
			hitGoal = 10;
			Vent.game.stateTransition.to('Guitar');
		}, this);

		// bt "A lot"
		text = "Bang the drums";
		var aLotBt = this.game.add.sprite(this.game.width / 2, this.game.height / 2 + 110, "square");
		createBt(aLotBt, text, false, false, "emoji2");
		aLotBt.events.onInputUp.add(function() {
			hitGoal = 50;
			Vent.game.stateTransition.to('Drum');
		}, this);

	},
	update: function() {

	}
};