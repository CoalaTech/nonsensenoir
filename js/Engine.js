/* global nsn: true, createjs: true */

import events from 'Base';
import ObjectManager from 'ObjectManager';
import Scene from 'Scene';
import Character from 'Character';
import Player from 'Player';
import BackgroundFactory from 'BackgroundFactory';

import 'Exit';
import 'ObjectHandler';
import 'ObjectCombiner';
import 'Inventory';
import 'ScriptMachine';
import 'SceneBuilder';

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
    this.canvas = this._setupCanvas();

    nsn.listen(nsn.events.STOP_EVERYTHING, this.stopEverything, this);
    nsn.listen(nsn.events.GAME_STARTED, this._onGameStarted, this, true);
  },

  _setupCanvas: function(){
    var canvas = document.getElementById("canvas");
    canvas.width = 997;
    canvas.height = 600;

    return canvas;
  },

  _onGameStarted: function(params){
    // this.gameSound.playSound(this.id, false);

    this.stage.stage.removeChild(params.startingScreenContainer);

    // this.buildScenes();
    nsn.SceneBuilder.buildScenes(this.assets["scenes.json"]);
    this.setSceneAsCurrent("Apartamento");

    this.objectHandler = new nsn.ObjectHandler();
    this.objectCombiner = new nsn.ObjectCombiner();
    this.script = new nsn.ScriptMachine();

    // Descomentar para rodar a música do jogo
    // -1 quer dizer que o áudio fica em loop
    // this.gameSound.playSound("mainGameMusicShort", -1);
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
      character = new Player(config);
      this.player = character;
    }else{
      character = new Character(config);
    }

    this.characters[name] = character;

    return character;

  },

  getBackground: function(name){

    return BackgroundFactory.getBackground(name);

  },

  // _buildBackground: function(name){

  //   var config = this.assets[`${name}.json`];

  //   BackgroundFactory.build(config);

  // },

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
