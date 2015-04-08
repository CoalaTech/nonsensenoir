/* global nsn: true, createjs: true */

nsn.GameEngine = function(){

  this.scenes = {};

  this.characters = {};

  this.backgrounds = {};

  this.assets = {};

  this.frameRate = 12;

  this.init();

};

nsn.GameEngine.prototype = {

  init: function(){
    this.gameSound = new nsn.GameSound();
    this.canvas = this._setupCanvas();

    nsn.listen(nsn.events.STOP_EVERYTHING, this.stopEverything, this);
    nsn.listen(nsn.events.GAME_STARTED, this._onGameStarted, this);
  },

  _setupCanvas: function(){
    var canvas = document.getElementById("canvas");
    canvas.width = 997;
    canvas.height = 600;

    return canvas;
  },

  _onGameStarted: function(params){
    // this.gameSound.playSound(this.id, false);

    // this.buildScenes();
    nsn.SceneBuilder.buildScenes(this.assets["scenes.json"]);

    this.setSceneAsCurrent("Apartamento");

    /* All the classes below can be 'static' or 'singletons' */
    this.objectHandler = new nsn.ObjectHandler();
    this.objectCombiner = new nsn.ObjectCombiner();
    this.inventory = new nsn.Inventory();
    this.script = new nsn.ScriptMachine();

    // Descomentar para rodar a música do jogo
    // -1 quer dizer que o áudio fica em loop
    // this.gameSound.playSound("mainGameMusicShort", -1);
  },

  getCharacter: function(name){

    if(!this.characters[name]){
      buildCharacter(name);
    }

    return this.characters[name];

  },

  buildCharacter: function(name){

    var config = this.assets['characters.json'][name];

    if(this.characters[name]){
      return this.characters[name];
    }

    var character;

    if(config.isPlayer){
      character = new nsn.Player(config);
      this.player = character;
    }else{
      character = new nsn.Character(config);
    }

    this.characters[name] = character;

    return character;

  },

  buildBackground: function(name){

    var config = this.assets[name + '.json'];

    if(this.backgrounds[name]){
      return this.backgrounds[name];
    }

    var imageSrc = this.assets[config.source],
        image = new createjs.Bitmap(imageSrc);

    var background = new nsn.Background(name, image, config.matrix);

    this.backgrounds[name] = background;

    return background;

  },

  buildExit: function(config){
    var exit = new nsn.Exit(config);
  },

  setSceneAsCurrent: function(sceneName, exitObject){

    var scene = this.scenes[sceneName];

    if(!scene){
      return;
    }

    nsn.SceneBuilder.initScene();

    if(exitObject){
      var targetScene = scene.exits[exitObject.config.targetExit];

      this.player.image.x = targetScene.config.playerX;
      this.player.image.y = targetScene.config.playerY;
      // this.player.facing = exitObject.config.facingOnEnter;

      this.player.stop();
      scene.addCharacter(this.player);
    }

    nsn.fire(nsn.events.SCENE_CHANGED, {"from": this._currentScene ? this._currentScene.name : undefined, "to": sceneName});

    this._currentScene = scene;

    this.stage.setScene(scene);

    nsn.fire(nsn.events.ON_ACTION, {"type": "enter_scene", "target": sceneName});

  },

  widescreen: function(value){
    return this._currentScene.widescreen(value);
  },

  stopEverything: function() {
    this.player.resetAnimation();
    this.objectHandler.hideHUD();
  },

  scaleX: function(){
    return this.stage.stage.scaleX;
  },

  scaleY: function(){
    return this.stage.stage.scaleY;
  }

};

nsn.GameEngine.prototype.constructor = nsn.GameEngine;
