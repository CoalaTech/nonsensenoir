/**
* @copyright    2014 CoalaTech.
*/
nsn.GameSound = function(){

  this.init();

};

nsn.GameSound.prototype = {

  init: function(){
    this._loadSounds();
  },

  play: function(id, numberOfLoops){

    // play (src, interrupt, delay, offset, loop (-1 for endless loop), volume, pan)
    var instance = createjs.Sound.play(id, createjs.Sound.INTERRUPT_NONE, 0, 0, numberOfLoops, 1);

  },

  _loadSounds: function(){

    if (!createjs.Sound.initializeDefaultPlugins()) {
      console.log("deuMerdaNoSom");
    }

    var manifest = [
      {src: "./sound/Thunder1.ogg", id:"startGameButton"},
      {src: "./sound/SOLthemeshort.ogg", id:"mainGameMusicShort"}
    ];

    createjs.Sound.registerManifest(manifest);

  }

};

nsn.GameSound.prototype.constructor = nsn.GameSound;
