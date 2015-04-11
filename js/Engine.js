/* global nsn: true, createjs: true */

nsn.GameEngine = function(){

  this.characters = {};

  this.backgrounds = {};

  this.assets = {};

  this.frameRate = 12;

  this.init();

};

nsn.GameEngine.prototype = {

  init: function(){
    this.canvas = this._setupCanvas();

    nsn.listen(nsn.events.STOP_EVERYTHING, this.stopEverything, this);
    nsn.listen(nsn.events.GAME_STARTED, this._onGameStarted, this, true);
    nsn.listen(nsn.events.ASSETS_LOADED, this._onAssetsLoaded, this, true);
  },

  _setupCanvas: function(){
    var canvas = document.getElementById("canvas");
    canvas.width = 997;
    canvas.height = 600;

    return canvas;
  },

  _onGameStarted: function(params){
    // this.gameSound.playSound(this.id, false);

    this.script = new nsn.ScriptMachine();

    // Descomentar para rodar a música do jogo
    // -1 quer dizer que o áudio fica em loop
    // this.gameSound.playSound("mainGameMusicShort", -1);
  },

  _onAssetsLoaded: function(){

    nsn.SceneBuilder.buildScenes(this.assets["scenes.json"]);

    this.setSceneAsCurrent("Apartamento");

  },

  getCharacter: function(name){

    if(!this.characters[name]){
      this._buildCharacter(name);
    }

    return this.characters[name];

  },

  _buildCharacter: function(name){

    var config = this.assets['characters.json'][name],
      character;

    if(!config){
      throw new Error('No character config found for ' + name);
    }

    if(config.isPlayer){
      character = new nsn.Player(config);
      this.player = character;
    }else{
      character = new nsn.Character(config);
    }

    this.characters[name] = character;

    return character;

  },

  getBackground: function(name){

    if(!this.backgrounds[name]){
      this._buildBackground(name);
    }

    return this.backgrounds[name];

  },

  _buildBackground: function(name){

    var config = this.assets[name + '.json'];

    if(!config){
      throw new Error('No background config found for ' + name);
    }

    var imageSrc = this.assets[config.source],
        image = new createjs.Bitmap(imageSrc);

    var background = new nsn.Background(name, image, config.matrix);

    this.backgrounds[name] = background;

    return background;

  },

  buildExit: function(config){
    return new nsn.Exit(config);
  },

  getCurrentScene: function(){
    return this._currentScene;
  },

  setSceneAsCurrent: function(sceneName, exitObject){

    var scene = nsn.SceneBuilder.getScene(sceneName);

    if(exitObject){
      var targetScene = scene.exits[exitObject.config.targetExit];

      this.player.image.x = targetScene.config.playerX;
      this.player.image.y = targetScene.config.playerY;

      this.player.stop();
      scene.addCharacter(this.player);
    }

    nsn.fire(nsn.events.SCENE_CHANGED, {"from": this._currentScene ? this._currentScene.name : undefined, "to": sceneName});

    this._currentScene = scene;

    this.stage.setScene(scene);

    nsn.fire(nsn.events.ON_ACTION, {"type": "enter_scene", "target": sceneName});

  },

  findPath: function(fromX, fromY, toX, toY){

    if(!this._currentScene){
      throw new Error('No scene set as current.');
    }

    return this._currentScene.findPath(fromX, fromY, toX, toY);

  },

  widescreen: function(value){
    return this._currentScene.widescreen(value);
  },

  stopEverything: function() {
    if(this.player){
      this.player.resetAnimation();
    }
    if(this.objectHandler){
      this.objectHandler.hideHUD();
    }
  },

  scaleX: function(){
    return this.stage.stage.scaleX;
  },

  scaleY: function(){
    return this.stage.stage.scaleY;
  }

};

nsn.GameEngine.prototype.constructor = nsn.GameEngine;
