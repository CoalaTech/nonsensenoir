var GameSound = function(){

	var self = {};

	function init(){
		loadSoundFiles();
	}

	function loadSoundFiles(){

		if (!createjs.Sound.initializeDefaultPlugins()) {
			console.log("deuMerdaNoSom");
		}

		var manifest = [
			{src: "./sound/Thunder1.ogg", id:"startGameButton"},
//			{src: "./sound/SOLtheme.ogg", id:"mainGameMusic"},
			{src: "./sound/SOLthemeshort.ogg", id:"mainGameMusicShort"}
		];

		createjs.Sound.registerManifest(manifest);

	}

	self.playSound = function (targetId, numberOfLoops){

		//Play the sound: play (src, interrupt, delay, offset, loop (-1 for endless loop), volume, pan)
		var instance = createjs.Sound.play(targetId, createjs.Sound.INTERRUPT_NONE, 0, 0, numberOfLoops, 1);

	};

	init();

	return self;


};
