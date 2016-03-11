/* global nsn: true, createjs: true */

/**
* @copyright    2014 CoalaTech.
*/
nsn.Background = function(name, image, matrix){

  this.name = name;

  /**
  * @property {createjs.Bitmap} image - A reference to the background image
  */
  this.image = image;

  /**
   * @property {array} matrix - 2-dimensional array of 1's and 0's.
   * A zero means that the player can walk to/from that spot in the background.
   */
  this.matrix = matrix;

  /**
   * How big is each 'walking cell' on the background.
   * The smaller the cellSize, the more refined the background matrix is.
   * @type {Integer}
   */
  this.cellSize = 1000 / this.matrix[0].length * nsn.Engine.scaleX();

  /**
   * The class responsible for handling the pathfinding
   * @type {nsn.MatrixPathFinding}
   */
  this.pathFinder = new nsn.MatrixPathFinder(this.matrix);
  // this.pathFinder = new nsn.BitmapMaskPathfinder(nsn.Engine.assets.maskAP);

  /**
   * The container for the background image and other children that might be needed
   * @type {createjs.Container}
   */
  this.component = new createjs.Container();

  this.init();

};

nsn.Background.prototype = {

  init: function(){

    /* TODO: Shouldn't be here. Must be updated everytime the scene is switched */
    nsn.Engine.cellSize = this.cellSize;

    this.component.addChildAt(this.image, 0);

    this._addEventListeners();

  },

  findPath: function(fromX, fromY, toX, toY){

    var targetX = parseInt(toX / this.cellSize, 10),
        targetY = parseInt(toY / this.cellSize, 10);

    return this.pathFinder.findPath(fromX, fromY, targetX, targetY);

  },

  _addEventListeners: function(){

    this.image.addEventListener('click',
      function(evt){
          nsn.fire(nsn.events.BACKGROUND_CLICKED, evt);
      }
    );

  }
  
};

nsn.Background.prototype.constructor = nsn.Background;

/* global nsn: true, RSVP: true */

(function(){

  var listeners = {};

  nsn.events = {
    ASSETS_LOADED: "assets_loaded",
    GAME_STARTED: "game_started",

    BACKGROUND_CLICKED: "background_clicked",
    PATH_FOUND: "path_found",
    SCENE_CHANGED: "scene_changed",
    INVENTORY_OPENED: "inventory_opened",
    INVENTORY_CLOSED: "inventory_closed",
    TEXT_END: "text_end",
    STOP_EVERYTHING: "stop_everything",

    ON_ACTION: "on_action",

    ON_MOUSE_OVER_HIGHLIGHT: "on_mouse_over_highlight",
    ON_MOUSE_OUT_HIGHLIGHT: "on_mouse_out_highlight",
    ITEM_PICKED: "item_picked",
    USE_ITEM_START: "use_item_start",
    ACTION_USE_CALLED: "action_use_called",
    PLAYER_TALKING: "player_talking",
    PLAYER_SPEECH_TEXT_ENDED: "player_speech_text_ended",

    ON_COMBINE: "on_combine",
    FINISHED_ON_COMBINE: "finished_on_combine",
    COMBINING_ITEMS_FROM_INVENTORY: "combining_items_from_inventory",
    FINISHED_COMBINING_ITEMS_FROM_INVENTORY: "finished_combining_items_from_inventory",
    USING_ITEM_IN_SCENE: "using_item_in_scene",
    FINISHED_USING_ITEM_IN_SCENE: "finished_using_item_in_scene",
    COMBINATION_MESSAGE_BUILT: "combination_message_built"
  };

  nsn.cursors = {
    "default": "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAgCAYAAAD5VeO1AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAANPSURBVHjaYmZgYLgLxF+A+DwDlQFAAIHQNyD+D8TZ1DYYIICQDf8KxI7UNBgggJANB+F7QBxLLYMBAgjd8P+MjIyPgbQwNQwGCCCw4UAD/0tJSf1nZWWFWTIdKsdIicEAAcQEIlhYWBjk5OQYpKWlYeIZQLwYiO0oMRwggFhAxL9///7//v2bQVxcnPHdu3cMnz59AgnHADEfED8A4ofkGA4QQExQwxn//wcFNyODqqoqAx8fHwMTE1jKD4hLyXU5QACBTQAaDMfAcGfQ0dFhEBISgqkBpf9J5BgOEEBMMAbI1VBfgLGysjLYB1CQC8TzgViRFMMBAghuOMhAkAUgDPIBiNbQ0GDg5uaGKUkA4i3IeggBgADCcDkMgCxgZmYGpyIkC7SA+CwQexBjOEAAgQz/ATMMmYb5RkBAgEFbWxs5iAyAeA0Q6xAyHCCAQIazIwvAggXZAlDKUVNTY+Di4oJJgLxyGYhb8BkOEEDwYAEZADMUWxCBMhrIApBPkEA1EHfjMhwggJiQDcAHQPKcnJyMoEgWFRVFlioB4lVAzIyuByCAmGDlByylYLMIxkdOpvLy8uAIh4JQIG5ENxwggFCSInrKQQ4mWCaDsWVkZBgkJSXRg2gtsg8AAgg5WP6TkkH+/PnDICsryyAhIYEsHATEB2AFHkAAwQ0HepER5jqYq9EjFltKUlJSAgcTklobIO4AYnGAAEKJUORwx2YwMg0KbxD779+/2DxmCcTFAAHEgqQZFDKMuFwNEwMlWRANKpafP3/O8PbtW2RlT4D4GLQc2gEQQCzommFlDLI4yECYoa9fv2Z4+fIlw5cvX5ATwR8g3g3EiUD8EiYIEEAsuLwNVwDMPKDI+/jxI9iVb968QQ+CG0CcDzUcJVEABBALcrAiJz1YeD558gRs6NevX9Hj4AZQfSWQeQFaW2EAgABiQY80UET9+vUL7P3Hjx9ji7DdUJdeJ5RcAQIIZDg44EAGsrGxMdy7d4/hw4cPDN+/f0dW9xtaEs6DFlgvickLAAEEb7eAUgsw0v4jtWE+AvFJaMwbo2tCjxtsACCAMBpFUFcugpbXIrg0EWM4QAAhGw5q5W4EYjliNBFjOEAAwRpAU4CYn5SyhRjDAQIMAAvpMd3fLrDnAAAAAElFTkSuQmCC'), auto",
    "default_highlight": "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAgCAYAAAD5VeO1AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAOMSURBVHjaYmZgYLgLxF+A+DwDlQFAAIHQNyD+D8TZ1DYYIICQDf8KxI7UNBgggJANB+F7QBxLLYMBAgjd8P+MjIyPgbQwNQwGCCCw4czMzP+9vb3/s7CwwCyZDpVjpMRggABiApvAyMjg7+/P4ObmBhPPAOLFQGxHieEAAQQ2/N+/f/8/ffr038nJiUFCQgImFwPERUAsT67hAAEEM5zxz58/jMLCwgwlJSUMkpKSMHk/IC4l13CAAGJC5vz8+ZNBQECAoaamhkFVVRUmDEr/k8gxHCCAUAwHhf2vX78Y2NjYGAoLCxmUlZVhUrlAPB+IFUkxHCCAmNAFQBYAg4iBlZUVHERKSkowqQQg3oJNDy4AEEA4FYIs4OTkZHB0dGSQk5ODCWsB8Vkg9iDGcIAAAhn+A9nV////R2SAb98YbGxsGGpraxm0tLRgwgZAvAaIdQgZDhBAIMPZ0YMFZgGI/ePHDwZg5mLw8vICBRXMZm4gvgzELfgMBwggZiCuBmJWFxcXBg4ODrDBIEORwe/fv8HJU0dHB2QZ49OnT2FSoEzGA8S7sRkOEEBERQ7IMlAyVVRUZMzMzATHAxIoAeJVUIeiAIAAYoKVHyADYC5GDndkPsiC79+/M8TFxYGDCQmEAnEjuuEAAQR3OTCXorgU2VBYPMCCDGRJZGQkg5+fH7JZoOBdi+wDgABiQnXgf6LSL0jdly9fGIKDgxl8fX2RpYKA+ACswAMIICYk1zIiuxZbxKInVVAQhYSEMCQlJTEwMcGNsgHiDiAWBwggrDkUmcYlDkpZIABKquhqgcASiIsBAogFSfN/WORiczXMxaByB1i5MFy+fJlh+/btDNevX0f20RMgPgYth3YABBALsmaYImSDQXyQl2F54OTJkwz79u1juH37NrKaP9C0ngjEL2HiAAHEgi84QIZxcXGBi4HTp08zbNu2jeHBgwfoQXADiPOhhqOkCIAAYkEOVlhyA2V3EAYVXiADT5w4wfDo0SP0OLgBVFsJZF4A4gfYUhVAALGgC/Dx8TG8fPmS4cKFCwyrVq0Cp2k0sBvq0uuEkixAAIEM/wcrP0BBsnDhQnBkvXjxAqV4gZaE86AF1kti8gNAAMHbLaDmBVLTAoQ/AvFJaMwb40qy+ABAAGE0iqCuXAQtr0XwFWaEAEAAIRsOauVuBGI5YktKQgAggGANoClAzE9K5UuM4QABBgCvAjAb5bcwiAAAAABJRU5ErkJggg=='), auto",
    "exit": "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAsCAYAAACUq8NAAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAWvSURBVHjaYvz//z8DOmBkZFSAsYHyDxioBAACCGQYHAOBBBDvBeLXQAv/AGkYfgrEa5HVkoMBAgjZooUgg4GW/Ofi4vovJCT0X0ZG5r+AgMB/Tk5OkAIQvgrEMuRaBhBAjGCCkdEHaMhmDg4OBhEREQagBQz8/PwMbGxsDN+/f2f48uULw6NHjxg+f/4M0nQWiE3ICUWAAGKB0knMzMwM0tLSDJKSkgysrKxwBUBfgTHI4tu3b4MsNAY67gXQQglSLQMIICYozQsyTEJCAsUiZMDHx8cgJSXFICwsDOKKAy38AsQhpFgGEEBMQA0cQFoVSIOCEyXRoAMxMTEGdXV1sKNYWFi4gUJzSLEMIIBAPksBYnmQj/78+QNL+nCLYZaD+EALGNjZ2RmACYdBUFAQ7GGg+DEg5iPGMoAAAlkmDjIEFESgBIItayDT4DDn5QUHKw8PD9AeRkug0DliLAMIIHCcMTExgVMgtmCE+RLZpyAASkwqKirgVAsEIsRYBhBATDDDP378iFyCENQISr2goAQlLCDgJ8YygAACWfbn79+/YN+hFVlERTooRKDqfwPxLnxqAQKIBeZKULyRU9SJiooy/Pjxg+H9+/cswDzojE89QADBvQNLidgSBy4A8j0oGEHxB8oOECHG7bjUAwQQyLJPv3//BhdL2AwjxnegVAxSC0yhIA2WuNQCBBDIsvkghd++fSPoE3xAXFwclBVATC5cagACiAlWioMyK7pPkC3HVarA9IDiHFrUseKyDCCA4PkMVLKD4g3ZQGTLiQlSUGaHqi3EJg8QQGDL/v379+XNmzcMDx48IJgg8AFQ3EHzXQE2eYAAAll2B4hFQXYi5zX0YCMmPkFBCSrGQPZikwcIICagIT9AGMQBpcivX7/CC15cqQ8XANV7UH3M2OQBAgi52PgJzJgMt27dQin90YMQX1DCHAoEwkB1i9DlAQII2bJqYH57AGsGkANAcQYqUYBtGKypEiCAmJCCpx/UggL5CmQZMNEQrGrQAaiMBRVdUDUY5R9AADGh8ZeDLHn58iWorCMpRYL03b9/n+Hhw4eguAfZ9hNdDUAAMaK7FGjYZWCq1AFVH1paWngLaFhCevfuHcOzZ88YXr9+DZO6C5RTQVcPEEDYTEoDunLbp0+fBEDBCcqooCyBXrGC+CALfv36xfD8+XMwDXMDqH0JlGcHqkPxHUAAMeIogsqA1U4nNzc3g5ycHNhgUHEGCl5QJQvig/RB25G4PL4aiA8B5afABAACCHszmYEB1Gi9DXIlMBjBLWKg78AY6vL/oJYzjA3DwNLjP7B8BKsH0aCaC9lcgABixJe6gAbmAKlYIFaEtjMYcZUcsrKy4HoNVBiD8tuLFy/ArWggMALacR7EAAggRmKKIaClMkBqFXJdBQpKkMGgvKWmpgauXpBTKiiIz507B0qlp4B2mIPEAAKIqLYAUPETIGUF6tkAMTOo3QFqrIIKXVCTAhsAJRhQnAMtVYWJAQQQE7GlA9CSZlCZBwoqPT09cDmIbhFyKIGyDrQdCvcQQAAxkVAaScPaG+gtMVyZH6qOC8i2BTEAAogUy8AGoLdVcMU5SC3IZ8wQ74MjEyCASLIM1DAClRKg8o+Y2hxkGbSMBTcuAQKIFMsWATX+fvv2LbhGJ6ZyBVkGDUpwKgYIIKItAxp2AEhNAqay36Di6dWrVwRrb/TGL0AAMZFYZdWAukkgBsh3oOYfvtoAlGKRykwGgAAiyTKkJsQ+kEWgKgXUUMJVt4FCABqMO0AEQACR3sCHWOoM9MknYJ3H+/PnT3DCAXX8QSUKKEGAgvfJkydgDLQUHtYAAUT+mAYDgzsQXwbZDRrKANYO/5WVlf8D68D/wHY/rNAGJcVymB6AAGKgeCAFEkR/YTUBMFHAagFQXaaPrBYggBgpad+jZWI1IKWNFGLr0dUABBgAAF8gLJ9YqmAAAAAASUVORK5CYII='), auto"
  };

  nsn.listen = function(eventName, callback, scope, once){
    if(!listeners[eventName]){
      listeners[eventName] = [];
    }
    listeners[eventName].push({callback: callback, scope: scope, once: once});
  };

  nsn.fire = function(eventName, eventObject){

    var evtListeners = listeners[eventName],
        evtListenersCount,
        listener;

    if(!evtListeners){ return; }

    evtListenersCount = evtListeners.length;

    for (var i = evtListenersCount - 1; i >= 0; i--) {
      listener = evtListeners[i];
      listener.callback.call(listener.scope || this, eventObject);

      if(listener.once === true){
        evtListeners.splice(i, 1);
      }
    }

  };

  Function.prototype.implement = function(base){
    for(var func in base.prototype){
      this.prototype[func] = base.prototype[func];
    }
  };

  /** Adapted from underscore.js - http://underscorejs.org/underscore.js */
  nsn.each = function(obj, func, context){

    if (!obj){ return obj; }

    var i, length = obj.length;

    if (length === +length) {  /* It's an array */
      for (i = 0; i < length; i++) {
        func.call(context, obj[i], i, obj);
      }
    } else {  /* It's an object */
      var keys = Object.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        func.call(context, keys[i], obj[keys[i]], obj);
      }
    }
    return obj;

  };

  /* Based on John Resig's implementation at:
     http://ejohn.org/blog/flexible-javascript-events/
  */
  nsn.DOMEvent = {
    on: function( obj, type, fn ) {
      if ( obj.attachEvent ) {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function(){
          obj['e'+type+fn]( window.event );
        };
        obj.attachEvent( 'on'+type, obj[type+fn] );
      } else {
        obj.addEventListener( type, fn, false );
      }
    },
    off: function( obj, type, fn ) {
      if ( obj.detachEvent ) {
        obj.detachEvent( 'on'+type, obj[type+fn] );
        obj[type+fn] = null;
      } else {
        obj.removeEventListener( type, fn, false );
      }
    }
  };

  /* Facade for RSVP Promises */

  nsn.Promise = RSVP.Promise;
  nsn.Deferred = RSVP.defer;
  nsn.PromiseState = {
    PENDING: 0,
    RESOLVED: 1,
    REJECTED: 2
  };

})();

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

/* global nsn: true, createjs: true */

/**
* @copyright    2014 CoalaTech.
*/
nsn.Exit = function(config){

  this.config = config;

  this.init();

};

nsn.Exit.prototype = {

  init: function(){

    /** @type {string} Exit's name/description */
    this.name = this.config.name;

    /** @type {string} Exit's description */
    this.description = this.config.description;

    /** @type {createjs.Bitmap} The exit's image, e.g, a door, a window, a rug, etc...  */
    this.image = new createjs.Bitmap(nsn.Engine.assets[this.config.source]);

    this.image.x = this.config.imageX;
    this.image.y = this.config.imageY;

    this.exitX = this.config.exitX * nsn.Engine.scaleX();
    this.exitY = this.config.exitY * nsn.Engine.scaleY();

    this._addEventListeners();

  },

  _addEventListeners: function(){

    this.image.addEventListener("click", this._walkToExit.bind(this));
    this.image.addEventListener('mouseover', this._onMouseOver.bind(this));
    this.image.addEventListener('mouseout', this._onMouseOut.bind(this));

  },

  _walkToExit: function(){

    var playerPosition = nsn.Engine.player.position();

    /* Going back and forth between scenes */
    if(playerPosition[0] === this.exitX && playerPosition[1] === this.exitY){
      nsn.Engine.setSceneAsCurrent(this.config.targetScene, this);
      return;
    }

    /* All hail STOP_EVERYTHING! =] */
    nsn.fire(nsn.events.STOP_EVERYTHING);

    nsn.Engine.player.walk(this.exitX, this.exitY)
          .then(function(){
              nsn.Engine.setSceneAsCurrent(this.config.targetScene, this);
            }.bind(this));

  },

  _onMouseOver: function(){

    //TODO Refatorar para stage ouvir novo evento
    nsn.Engine.stage.setCursor("exit");
    //TODO Refatorar para usar o nome do objeto e não uma string
    nsn.fire(nsn.events.ON_MOUSE_OVER_HIGHLIGHT, {type: 'Exit', text: this.description});

  },

  _onMouseOut: function (){

    //TODO Refatorar para stage ouvir novo evento
    nsn.Engine.stage.resetCursor();
    //TODO Refatorar para usar o nome do objeto e não uma string
    nsn.fire(nsn.events.ON_MOUSE_OUT_HIGHLIGHT, {type: 'Exit'});

  }

};

nsn.Exit.prototype.constructor = nsn.Exit;

/* global nsn: true, createjs: true, console: true */

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
      {src: nsn.ASSETS_PATH + "sound/Thunder1.ogg", id:"startGameButton"},
      {src: nsn.ASSETS_PATH + "sound/SOLthemeshort.ogg", id:"mainGameMusicShort"}
    ];

    // createjs.Sound.registerManifest(manifest);

  }

};

nsn.GameSound.prototype.constructor = nsn.GameSound;

/* global nsn: true, createjs: true */

(function(){
  
  var Inventory = function(){

    this.items = {};
    this.useItemMessage = "";

    this.NUM_ITEMS_PER_ROW = 2;
    this.NUM_ITEMS_PER_COL = 4;

    this.itemsGroup = this._createItemsGroup();
    this._itemWithGroupMap = {};

    this.horizontalSize = this.itemsGroup.width / this.NUM_ITEMS_PER_ROW;
    this.verticalSize = this.itemsGroup.height / this.NUM_ITEMS_PER_COL;

    this.numItems = 0;

    this.inventoryIsOpen = false;

    this.itemSelected = null;

    nsn.listen(nsn.events.GAME_STARTED, this.init, this, true);

  };

  Inventory.prototype = {

    init: function(){
      this.openInventoryButton = this._createOpenButton();
      this.closeInventoryButton = this._createCloseButton();

      this.image = this._createImage();
      this.group = this._createGroup();

      this.setOpenInventoryOnKeypress();

      nsn.Engine.stage.addHUD(this.openInventoryButton);

      nsn.listen(nsn.events.BACKGROUND_CLICKED, this.hideInventory, this);
      nsn.listen(nsn.events.SCENE_CHANGED, this.hideInventory, this);
      nsn.listen(nsn.events.ON_COMBINE, this.cancelUseItem, this);
      nsn.listen(nsn.events.COMBINING_ITEMS_FROM_INVENTORY, this._combineItems, this);
      nsn.listen(nsn.events.USE_ITEM_START, this._selectItem, this);
      nsn.listen(nsn.events.USING_ITEM_IN_SCENE, this.hideInventory, this);
      nsn.listen(nsn.events.FINISHED_USING_ITEM_IN_SCENE, this._removeItemAfterUse, this);
      nsn.listen(nsn.events.FINISHED_ON_COMBINE, this._handleCombinationEnd, this);
    },

    setOpenInventoryOnKeypress: function(){
      nsn.DOMEvent.on(document, 'keypress', function(event){

        var keyCode = (event.keyCode ? event.keyCode : event.which);

        /* KeyCodes
         * i = 105
         */
        if (keyCode === 105){
          this._toggleInventory();
        }

      }.bind(this));

    },

    addItem: function(item){
      this.items[item.name] = item;
      this._addToInventory(item);
      this.numItems++;
    },

    removeItem: function(item){
      this._removeFromInventory(item);
      delete this.items[item.name];
      this.numItems--;
    },

    hasItem: function(item){
      if(typeof(item) === "string"){
        return this.items[item] !== undefined;
      }else{
        return this.items[item.name] !== undefined;
      }
    },

    showInventory: function(){
      nsn.Engine.stage.removeHUD(this.openInventoryButton);
      nsn.Engine.stage.addHUD(this.closeInventoryButton);
      nsn.Engine.stage.addHUD(this.group);

      createjs.Tween.get(this.group).to({x: 0}, 200);

      this.inventoryIsOpen = true;

      nsn.fire(nsn.events.INVENTORY_OPENED);
    },

    hideInventory: function(closedFromButton){
      if(!this.inventoryIsOpen){ return; }

      nsn.Engine.stage.removeHUD(this.closeInventoryButton);
      nsn.Engine.stage.addHUD(this.openInventoryButton);
      createjs.Tween.get(this.group)
            .to({x: -200}, 200)
            .call(function(){
              nsn.Engine.stage.removeHUD(this.group);
            });

      this.inventoryIsOpen = false;

      nsn.fire(nsn.events.INVENTORY_CLOSED, {closedFromButton: closedFromButton === true});
    },

    cancelUseItem: function(){
      if(this.itemSelected){
        this.itemSelected = null;
      }
    },

    _createOpenButton: function(){
      var openInventoryButton = new createjs.Bitmap(nsn.Engine.assets.openInventory);
      openInventoryButton.x = 20;
      openInventoryButton.y = 20;
      openInventoryButton.addEventListener('click', this._onOpenClicked.bind(this));

      return openInventoryButton;
    },

    _createCloseButton: function(){
      var closeInventoryButton = new createjs.Bitmap(nsn.Engine.assets.closeInventory);
      closeInventoryButton.x = 200;
      closeInventoryButton.y = 20;
      closeInventoryButton.addEventListener('click', this._onCloseClicked.bind(this));

      return closeInventoryButton;
    },

    _createItemsGroup: function(){
      var itemsGroup = new createjs.Container();
      itemsGroup.width = 150;
      itemsGroup.height = 360;
      itemsGroup.x = 20;
      itemsGroup.y = 175;

      return itemsGroup;
    },

    _createImage: function(){
      return new createjs.Bitmap(nsn.Engine.assets.inventoryBackground);
    },

    _createGroup: function(){
      var group = new createjs.Container();

      group.addChild(this.image);
      group.addChild(this.itemsGroup);

      group.x = -200;
      group.y = 0;

      return group;
    },

    _toggleInventory: function(){
      if(this.inventoryIsOpen){
        this._onCloseClicked();
      }else{
        this._onOpenClicked();
      }
    },

    _onCloseClicked: function(){
      this.hideInventory(true);
      nsn.Engine.objectHandler.hideHUD();
    },

    _onOpenClicked: function(){
      this.showInventory();
    },

    _addToInventory: function(item){
      var group = new createjs.Container();
      var newItem = item.clone();
      /*  Sobreescrever o metodo do EaselJS?  */
      newItem.pickable = item.pickable;
      newItem.dialogs = item.inventory_dialogs;
      newItem.inInventory = true;

      var slot = new createjs.Bitmap(nsn.Engine.assets.slotInventory);
      group.addChild(slot);
      group.addChild(newItem);
      this._setGroupPositionInInventory(group);
      this._centralizeNewItemInsideSlot(newItem);
      this.itemsGroup.addChild(group);

      group.addEventListener('click', this._onObjectClicked.bind(this));
      group.addEventListener('mouseover', this._onMouseOverObject.bind(this));
      group.addEventListener('mouseout', this._onMouseOutObject.bind(this));
      group.name = newItem.name;

      /*  Para recuperar o objeto quando clicado  */
      slot.object = newItem;
      group.object = newItem;
      newItem.group = group;

      this._itemWithGroupMap[newItem.name] = newItem;
    },

    _centralizeNewItemInsideSlot: function(newItem) {
      newItem.regX = newItem.image.width / 2;
      newItem.regY = newItem.image.height / 2;
      newItem.x = 36;
      newItem.y = 36;
    },

    _setGroupPositionInInventory: function(group, position) {
      if (position === undefined){ position = this.numItems; }

      var coordinates = this._calculateGroupPositionCoordinates(position);
      group.x = coordinates.x;
      group.y = coordinates.y;
    },

    _calculateGroupPositionCoordinates: function(position){
      var row = parseInt(position / this.NUM_ITEMS_PER_ROW, 10);
      var column = parseInt(position % this.NUM_ITEMS_PER_ROW, 10);

      return {
        x: column * this.horizontalSize,
        y: row * this.verticalSize
      };
    },

    _removeFromInventory: function(item){
      this.itemsGroup.removeChild(item.group);
      this._itemWithGroupMap[item.name] = null;
    },

    reorganizeItems: function() {
      nsn.each(this.itemsGroup.children, function(itemGroup, position) {
        this._setGroupPositionInInventory(itemGroup, position);
      }.bind(this));
    },

    _onObjectClicked: function(event){
      var target = event.target.object ? event.target.object : event.target;

      nsn.Engine.objectManager.unselectObject();

      if(this.itemSelected){
        nsn.Engine.objectCombiner.combine(this.itemSelected, target);
      }else{
        nsn.Engine.objectManager.selectObject(target);
        nsn.Engine.objectHandler.showHUD(
                      this.image.image.width + 10,
                      this.itemsGroup.y + target.group.y + 35,
                      target,
                      true
                    );
      }
    },

    _onMouseOverObject: function(event){
      event.target = event.target.object ? event.target.object : event.target;
      nsn.Engine.objectManager.onMouseOverObject(event);
    },

    _onMouseOutObject: function(event){
      event.target = event.target.object ? event.target.object : event.target;
      nsn.Engine.objectManager.onMouseOutObject(event);
    },

    _selectItem: function(params){
      this.itemSelected = params.currentObject;
    },

    _combineItems: function(params){
      this.removeItem(params.source);
      this.removeItem(params.target);
      this.reorganizeItems();

      if(params.newItem){
        this.addItem(params.newItem);
      }

      nsn.fire(nsn.events.FINISHED_COMBINE_ITEMS_FROM_INVENTORY, params);
    },

    _removeItemAfterUse: function(params){
      this.removeItem(params.source);
    },

    _handleCombinationEnd: function(params){
      if(!params.itemsWereCombined){ this.hideInventory(true); }
    },

    itemIsNotTheSameOfInventory: function(objectName){
      return this.itemSelected.name !== objectName;
    }
  };

  Inventory.prototype.constructor = Inventory;

  nsn.Inventory = new Inventory();

})();

/* global nsn: true, createjs: true */

nsn.Item = (function(){

  /*  Não está sendo usado no momento */

  function Item(imagePath, x, y, options){

    this.name = options.name || "Item";     /*  Nome de exibição  */
    this.pickable = options.pickable || false;  /*  Pode ser pego?  */
    this.dialogs = options.dialogs || {};   /*  Diálogos de interação */

    this.foreground = options.foreground || false; /*  Item sempre à frente da tela  */

    this.bitmap = new createjs.Bitmap(nsn.Engine.assets[imagePath]);
    this.bitmap.x = x;
    this.bitmap.y = y;
    this.bitmap.item = this;
  }

  Item.prototype.addEventListener = function(type, listener) {
    this.bitmap.addEventListener(type,
      function(evt){
        evt.item = this;
        listener(evt);
      }.bind(this)
    );
  };

  Item.prototype.width = function() {
    return this.bitmap.image.width;
  };

  Item.prototype.height = function() {
    return this.bitmap.image.height;
  };

  Item.prototype.position = function() {
    return {
          x: this.bitmap.image.x,
          y: this.bitmap.image.y
        };
  };

  Item.prototype.center = function() {
    return {
          x: this.bitmap.image.x + this.bitmap.image.width / 2,
          y: this.bitmap.image.y + this.bitmap.image.height / 2
        };
  };

  Item.prototype.clone = function() {
    /*  TODO  */
  };

  var defaultDialogs = {
    use: "Não sei como usar isso.",
    mouth: "Agora não, obrigado.",
    see: "Não sei o que é isso.",
    description: "Um item qualquer"
  };

  return Item;

})();

/* global nsn: true, createjs: true */

/**
* @copyright    2014 CoalaTech.
*/
nsn.Scene = function(){

  /** @type {String} The scene name/description - it can be a room, a street, an alley, etc */
  this.name = "";

  /** @type {createjs.Container} The container for all the scene objects */
  this.component = new createjs.Container();

  this.panels = {};

  /** @type {createjs.Container} A panel for objects in the foreground */
  this.panels.foreground = new createjs.Container();

  /** @type {createjs.Container} A panel for objects in the scene over the background */
  this.panels.main = new createjs.Container();

  /** @type {createjs.Container} A panel for the background */
  this.panels.background = new createjs.Container();

  /** @type {createjs.Container} A panel for filters and effects (widescreen, fade, etc) */
  this.panels.effects = new createjs.Container();

  this.characters = {};

  this.objects = {};

  this.exits = {};

  this.fx = {};

  this.init();

};

var p = {};
nsn.Scene.prototype = p;

p.init = function(){

  this._addEventListeners();

  this.component.addChild(this.panels.background);
  this.component.addChild(this.panels.main);
  this.component.addChild(this.panels.foreground);
  this.component.addChild(this.panels.effects);

  this.fx.widescreen = new nsn.Panels.Widescreen(this.panels.effects, 100);
  this.fx.flashback = new nsn.Panels.Flashback(this.panels.effects);
  this.fx.fade = new nsn.Panels.Fade(this.component);

};

p.addCharacter = function(character){

  /* Do not add the same character twice */
  if(!this.characters[character.name]){
    this.panels.main.removeChild(character.image);
  }

  this.characters[character.name] = character;

  this.panels.main.addChild(character.image);

  if(character.isPlayer){
    this.player = character;
  }

};

p.addBackground = function(background){
  // if(background !== undefined){
    this.panels.background.removeChild(background.component);
  // }
  this.background = background;
  this.panels.background.addChildAt(background.component, 0);
};

p.addObjects = function(objects){
  nsn.each(objects, function(object){
      this.addObject(object);
    }, this
  );
  // nsn.each(objects, this.addObject, this);
};

p.addObject = function(object, depth){

  /* Do not add the same object twice */
  if(this.objects[object.name]){
    return;
  }

  this.objects[object.name] = object;

  if(!object.foreground){
    if(depth){
      this.panels.main.addChildAt(object, depth);
    }else{
      this.panels.main.addChild(object);
    }
  }else{
    this.panels.foreground.addChild(object);
  }

};

p.removeObject = function(object){

  if(this.objects[object.name]){

    this.panels.main.removeChild(this.objects[object.name]);

    delete this.objects[object.name];
  }

};

/* Maybe it can behave like a regular object and be added via addObject(exit) */
p.addExit = function(exit){

  if(!this.exits[exit.name]){
    this.exits[exit.name] = exit;

    this.panels.background.addChild(exit.image);
  }

};

p.findPath = function(fromX, fromY, toX, toY){

  if(!this.background){
    throw new Error('No background, no path to be found =P');
  }

  return this.background.findPath(fromX, fromY, toX, toY);

};


p._addEventListeners = function(){
  nsn.listen(nsn.events.SCENE_CHANGED, this._onSceneChanged, this);
  nsn.listen(nsn.events.FINISHED_USING_ITEM_IN_SCENE, this._handleItemUsedInScene, this);
  nsn.listen(nsn.events.ITEM_PICKED, this._handleItemPicked, this);
};

p._handleItemUsedInScene = function(params){
  this.removeObject(params.target);

  if(params.newItem){
    this.addObject(params.newItem, params.newItem.depth);
  }
};

p._handleItemPicked = function(params){
  this.removeObject(params.item);
};

p._onSceneChanged = function(event){

  if(event.from === this.name){
    this._removeTickListener();
  }else if(event.to === this.name){
    this._addTickListener();
  }

};

p._addTickListener = function(){
  createjs.Ticker.addEventListener("tick", this.handleTick.bind(this));
};

p._removeTickListener = function(){
  createjs.Ticker.removeEventListener("tick", this.handleTick.bind(this));
};

p.handleTick = function(){

  if(!this.player.isMoving){ return; }

  var index = 0,
      character,
      object;

  for(var name in this.objects){
    object = this.objects[name];
    // if(this.player.image.y > object.y + object.image.height){
    if(this.player.image.y > object.y + object.image.height){
      index++;
    }
  }
  for(name in this.characters){
    character = this.characters[name];
    if(character.name === "Detetive"){continue;}
    // if(this.player.image.y > character.y){
    if(this.player.image.y * this.player.image.scaleY > character.y){
      index++;
    }
  }

  this.panels.main.setChildIndex(this.player.image, index);

};

p.flashback = function(enabled){
  if(enabled){
    this.fx.flashback.show();
  }else{
    this.fx.flashback.hide();
  }
};

p.widescreen = function(enabled){
  if(enabled){
    return this.fx.widescreen.show(1000);
  }else{
    return this.fx.widescreen.hide(1000);
  }
};

p.fadeIn = function(cb){
  return this.fx.fade.in(400, cb);
};

p.fadeOut = function(cb){
  return this.fx.fade.out(400, cb);
};

nsn.Scene.prototype.constructor = nsn.Scene;

/* global nsn: true, createjs: true */

/**
* @copyright    2014 CoalaTech.
*/
(function(){

  var scenes = {};

  nsn.SceneBuilder = {

    getScene: function(name){

      var scene = scenes[name];

      if(scene){

        /* The whole point of calling getScene is to get a loaded scene
           with characters, objects and exits instantiated and in place. */
        this.initScene(scene);

        return scene;

      }

      throw new Error('No scene called ' + name + ' found');

    },

    buildScenes: function(scenesConfiguration){

      var scenes = scenesConfiguration;

      nsn.each(scenes, function(name, config){
        this.buildScene(config);
      }.bind(this));

    },

    buildScene: function(config){

      var scene = new nsn.Scene();

      scene.config = config;

      scene.name = config.description;
      scene.showEffect = config.showEffect;
      scene.hideEffect = config.hideEffect;

      scenes[config.description] = scene;

    },

    initScene: function(scene){

      /* The scene hasn't been built yet */
      if(!scene.loaded){

        var config = scene.config,
          characterConfig,
          character,
          background,
          exit;

        nsn.each(config.Characters, function(conf, index){

            character = nsn.Engine.getCharacter(conf.name);

            character.image.x = conf.startingX;
            character.image.y = conf.startingY;

            scene.addCharacter(character);

          }
        );

        background = nsn.Engine.getBackground(config.Background.name);

        scene.addBackground(background);

        /* TODO Refactor me!!! Lets use the objectManager wisely (and Engine.assets, as well) */
        if(config.Objects){
          var objectsConfig = nsn.Engine.assets[config.Objects.source];
          var objects = nsn.Engine.objectManager.createObjects(objectsConfig);
          scene.addObjects(objects);
        }

        if(config.Exits){
          nsn.each(config.Exits, function(conf, index){
            exit = nsn.Engine.buildExit(conf);
            scene.addExit(exit);
          });
        }

        scene.loaded = true;

      }

    }

  };

  // nsn.listen(nsn.events.GAME_STARTED, function(){
  //
  //   nsn.SceneBuilder.buildScenes(nsn.Engine.assets["scenes.json"]);
  //
  // }, this, true);

})();

/* global nsn: true */

nsn.ScriptMachine = function(){

  this.map = {
    widescreen: nsn.Engine.widescreen,
    walk: nsn.Engine.player.walk,
    say: nsn.Engine.player.say,
    wait: this._wait,
    playSound: this._playSound
  };

  this.script = {
    see: {
      "sofa": [
        {
          calls: "widescreen",
          params: [true],
          scope: nsn.Engine
        }
      ]
    },
    enter_scene: {
      "Sacada": [
        {
          calls: "widescreen",
          params: [true],
          scope: nsn.Engine
        },
        {
          calls: "playSound",
          waitForMe: false
        },
        {
          /*  Isso vai falhar se o stage.scale for diferente de 1  */
          calls: "walk",
          params: [404, 557],
          scope: nsn.Engine.player
        },
        {
          calls: "wait",
          params: [1000]
        },
        {
          calls: "say",
          params: ["Oi, tia. O que é a merenda hoje?", 4000],
          scope: nsn.Engine.player
        },
        {
          calls: "widescreen",
          params: [false],
          /*  Se nao for especificado, a acao seguinte espera essa terminar  */
          waitForMe: false,
          scope: nsn.Engine
        }
      ]
    }
  };

  this.init();

};

nsn.ScriptMachine.prototype = {

  init: function(){
    nsn.listen(nsn.events.ON_ACTION, this._executeAction, this);
  },

  _executeAction: function(event){
    if(!this.script[event.type] || !this.script[event.type][event.target]){ return; }

    nsn.Engine.stage.disableInteraction();

    var actions = this.script[event.type][event.target];

    var currentAction = 0;

    var action = actions[currentAction];

    var nextAction = function(){
      currentAction++;
      action = actions[currentAction];
      if(action){
        promise = this.map[action.calls].apply(action.scope, action.params);
        if(action.waitForMe === false){
          nextAction();
        }else{
          promise.then(nextAction);
        }
      }else{
        nsn.Engine.stage.enableInteraction();
      }
    }.bind(this);

    var promise = this.map[action.calls].apply(action.scope, action.params);
    promise.then(nextAction);
  },

  _playSound: function(){
    var deferred = new nsn.Deferred();
    var timesPlayed = 0;

    var interval = setInterval(function(){
      timesPlayed++;
      if(timesPlayed === 3){
        clearInterval(interval);
        deferred.resolve();
      }
    }, 200);

    return deferred.promise;
  },

  _wait: function(timeout){
    timeout = timeout || 500;
    var deferred = new nsn.Deferred();

    setTimeout(function(){
      deferred.resolve();
    }, timeout);

    return deferred.promise;
  }

};

nsn.ScriptMachine.prototype.constructor = nsn.ScriptMachine;

/* global nsn: true, createjs: true, console: true */

/**
* @copyright    2014 CoalaTech.
*/
nsn.Stage = function(){

  /** @type {createjs.Stage} Reference to the createjs Stage instance */
  this.stage = new createjs.Stage(nsn.Engine.canvas);

  this._scenePanel = new createjs.Container();
  this._blankPanel = new createjs.Container();
  this._hudPanel = new createjs.Container();
  this._textPanel = new createjs.Container();
  this._fadePanel = new createjs.Container();

  this.scene = undefined;

  this.init();

};

nsn.Stage.prototype = {

  init: function(){

    this.stage.enableMouseOver(20);

    this.stage.addChild(this._scenePanel);
    this.stage.addChild(this._hudPanel);
    this.stage.addChild(this._blankPanel);
    this.stage.addChild(this._textPanel);
    this.stage.addChild(this._fadePanel);

    this._createTextManager();

    this._createFadePanel();

    this._createBlankPanel();

    this.stage.update();

    this._addEventListeners();

    this.resetCursor();

  },

  _addEventListeners: function(){

    createjs.Ticker.addEventListener("tick", this._handleTick.bind(this));

    createjs.Ticker.setFPS(nsn.Engine.frameRate);

  },

  _handleTick: function(){
    this.stage.update();
  },

  _createTextManager: function(){
    nsn.Engine.textManager = new nsn.TextManager();
    this._textPanel.addChild(nsn.Engine.textManager.textContainer);
  },

  _createFadePanel: function(){
    var graphics = new createjs.Graphics();
    graphics.beginFill("rgba(0,0,0,1)");
    graphics.drawRect(0, 0, nsn.Engine.canvas.width, nsn.Engine.canvas.height);

    var fadeShape = new createjs.Shape(graphics);
    fadeShape.alpha = 0;

    this._fadePanel.addChild(fadeShape);
  },

  _createBlankPanel: function(){
    var graphics = new createjs.Graphics();
    graphics.beginFill("rgba(0,0,0,0.01)");
    graphics.drawRect(0, 0, nsn.Engine.canvas.width, nsn.Engine.canvas.height);

    var blankShape = new createjs.Shape(graphics);

    this._blankPanel.alpha = 0;

    this._blankPanel.addChild(blankShape);
  },

  addChild: function(child){
    this.stage.addChild(child);
  },

  setScene: function(scene){
    if(this.scene){
      this.scene.fadeOut(function(){
        this._scenePanel.removeAllChildren();
        this._addScene(scene);
      }.bind(this));
    }else{
      this._addScene(scene);
    }
  },

  _addScene: function(scene){
    this._scenePanel.addChild(scene.component);
    scene.fadeIn();
    this.scene = scene;
  },

  setCursor: function(name){
    this.stage.cursor = nsn.cursors[name];
  },

  resetCursor: function(name){
    this.stage.cursor = nsn.cursors["default"];
  },

  addHUD: function(item, fadeIn){
    if(fadeIn === true){
      item.alpha = 0;
      this._hudPanel.addChild(item);
      createjs.Tween.get(item).to({alpha: 1}, 100);
    }else{
      this._hudPanel.addChild(item);
    }
  },

  removeHUD: function(item, fadeOut){
    if(fadeOut === true){
      createjs.Tween.get(item).to({alpha: 0}, 100);
      this._hudPanel.removeChild(item);
    }else{
      this._hudPanel.removeChild(item);
    }
  },

  disableInteraction: function(){
    this._blankPanel.alpha = 1;
    console.log("Desabilitando interações");
  },

  enableInteraction: function(){
    this._blankPanel.alpha = 0;
    console.log("Habilitando interações");
  }

};

nsn.Stage.prototype.constructor = nsn.Stage;

/* global nsn: true, createjs: true */

nsn.TextManager = function(){

  this.DEFAULT_COMBINATION_MESSAGE = "Porque eu faria algo tão non sense?";

  this._font = "35px Mouse Memoirs";

  this._textObject = this._createTextObject();

  this._isShowingDialog = false;

  this._nextLineOfText = "";

  this._linesCounter = 0;

  this.canvasContext = nsn.Engine.canvas.getContext("2d");

  this._defaultTimeout = 7000;

  this._currentTextTimeoutId = undefined;

  this._textLayer = new createjs.Container();

  this.textContainer = new createjs.Container();

  this.currentDeferred = undefined;

  this.init();

};

nsn.TextManager.prototype = {

  init: function(){

    this._setSkipTextOnKeypress();

    var graphics = new createjs.Graphics();
    var shape = new createjs.Shape(graphics);
    graphics.beginFill("rgba(255,255,255,0.01)");
    graphics.drawRect(0, 0, nsn.Engine.canvas.width, nsn.Engine.canvas.height);

    this._textLayer.addChild(shape);

    this._textLayer.alpha = 1;

    this.textContainer.addChild(this._textLayer);
    this.textContainer.addChild(this._textObject);

    this.canvasContext.font = this._font;

    this._textLayer.addEventListener('click', this.clearText.bind(this));

    nsn.listen(nsn.events.SCENE_CHANGED, this.hideText, this);
    nsn.listen(nsn.events.ON_MOUSE_OVER_HIGHLIGHT, this._onMouseOverHighlight, this);
    nsn.listen(nsn.events.ON_MOUSE_OUT_HIGHLIGHT, this._onMouseOutHighlight, this);
    nsn.listen(nsn.events.STOP_EVERYTHING, this.stopAllTexts, this);
    nsn.listen(nsn.events.ITEM_PICKED, this._handleItemPicked, this);
    nsn.listen(nsn.events.USE_ITEM_START, this._handleUseItemStart, this);
    nsn.listen(nsn.events.PLAYER_TALKING, this._handlePlayerTalk, this);
    nsn.listen(nsn.events.ON_COMBINE, this.hideText, this);
    nsn.listen(nsn.events.FINISHED_ON_COMBINE, this._handleCombinationMessage, this);
  },

  _setSkipTextOnKeypress: function (){

    nsn.DOMEvent.on(document, 'keypress', function(event){

      var keyCode = (event.keyCode ? event.keyCode : event.which);

      /* KeyCodes
       * spacebar = 32
       * period = 46
       */
      if (keyCode === 32 || keyCode === 46){
        this.clearText();
      }

    }.bind(this));

  },

  clearText: function(){

    this.hideText();

    if(this._nextLineOfText === ""){
      nsn.fire(nsn.events.TEXT_END);
      this.currentDeferred.resolve();
    }

  },

  hideText: function(){
    this._clearCurrentTextTimeout();
    this._textObject.text = "";
    this._isShowingDialog = false;
    this._textLayer.alpha = 0;
  },

  showText: function(text, customTimeout){

    var textBrokenInLines = this._splitTextInLines(text);
    var textWithLineBreaks = "";
    var textTimeout = customTimeout || this._defaultTimeout;

    if(this.currentDeferred && this.currentDeferred.promise._state !== nsn.PromiseState.RESOLVED){
      this.currentDeferred.resolve();
    }
    this.currentDeferred = new nsn.Deferred();

    this.stopAllTexts();

    if(textBrokenInLines.length > 2){
      this._linesCounter = 0;
      this.loopToShowBigTexts(textBrokenInLines, textWithLineBreaks, textTimeout);
    }else{
      this._nextLineOfText = "";
      textWithLineBreaks = this._getTwoLinesOfText(textBrokenInLines, 0);
      this._isShowingDialog = true;
      this._renderText(textWithLineBreaks, textTimeout);
    }

    return this.currentDeferred.promise;

  },

  loopToShowBigTexts: function(textBrokenInLines, textWithLineBreaks, textTimeout){
    this.showTextTimeout = setTimeout(function () {

      if(!this.isShowingText()){

        textWithLineBreaks = this._getTwoLinesOfText(textBrokenInLines, this._linesCounter);

        this._nextLineOfText = textWithLineBreaks;

        this._isShowingDialog = true;

        this._renderText(textWithLineBreaks, textTimeout);
        this._linesCounter += 2;

        if (this._linesCounter < textBrokenInLines.length){
          this.loopToShowBigTexts(textBrokenInLines, textWithLineBreaks, textTimeout);
        }else{
          this._nextLineOfText = "";
        }

      }else{
        this.loopToShowBigTexts(textBrokenInLines, textWithLineBreaks, textTimeout);
      }

     }.bind(this), 100);
  },

  showTextWithoutTimeout: function(text){
    this.hideText();
    this._renderText(text, 0);
    this._isShowingDialog = false;
  },

  _renderText: function(text, timeout){
    if(this._isShowingDialog){
      this._textLayer.alpha = 1;
    }
    this._textObject.text = text;
    this._isShowingDialog = true;

    this._clearCurrentTextTimeout();

    if(timeout && (timeout > 0)){
      this._currentTextTimeoutId = setTimeout(this.clearText.bind(this), timeout);
    }

  },

  _clearCurrentTextTimeout: function(){
    if(this._currentTextTimeoutId){
      clearTimeout(this._currentTextTimeoutId);
    }
  },

  stopAllTexts: function() {
    clearTimeout(this.showTextTimeout);
    this.hideText();
  },

  _getTwoLinesOfText: function(textBrokenInLines, indexToStart){
    var textWithLineBreaks = "";
    var phrase = "";
    var twoLinesCounter = 0;

    for (var i = indexToStart; twoLinesCounter < 2; i++) {

      phrase = textBrokenInLines[i];

      if (phrase !== undefined){
        textWithLineBreaks += phrase + "\n";
        twoLinesCounter++;
      }else{
        break;
      }

    }

    return textWithLineBreaks;
  },

  isShowingText: function(){
    if(this._textObject.text === ""){
      return false;
    }else{
      return true;
    }
  },

  _splitTextInLines: function(text){
    var canvasWidth = nsn.Engine.canvas.width;
    var marginSpace = 2 * this._textObject.x;
    var textAllowedSpace = canvasWidth - marginSpace;

    var textWords = text.split(" ");
    var textBrokenInLines = [];
    var line = "";
    var word = "";
    var possiblePhrase = "";

    for (var i = 0; i < textWords.length; i++) {

      word = textWords[i];
      possiblePhrase = line + word + " ";

      if(this.canvasContext.measureText(possiblePhrase).width < textAllowedSpace){
        line += word + " ";
      }else{
        //Decrease index because the word of this iteration wasn't added to this line
        i--;
        textBrokenInLines.push(line);
        line = "";
      }

    }

    textBrokenInLines.push(line);

    return textBrokenInLines;
  },

  _createTextObject: function(){
    var _textObject = new createjs.Text("", this._font, "#FFFFFF");
    _textObject.x = 100;
    _textObject.y = 545;
    _textObject.textBaseline = "alphabetic";
    _textObject.lineHeight = 30;
    _textObject.shadow = new createjs.Shadow("#000000", 2, 2, 0);

    return _textObject;
  },

  _onMouseOverHighlight: function(params){
    if(!this._isShowingDialog){
      var messageToShow = params.objectName;

      // TODO Shouldn't make direct calls to inventory
      if(nsn.Inventory.itemSelected &&
         nsn.Inventory.itemIsNotTheSameOfInventory(params.objectName)){

        messageToShow = this._buildFullCombinationMessage(nsn.Inventory.itemSelected, params.objectName);
      }

      this.showTextWithoutTimeout(messageToShow);
    }
  },

  _onMouseOutHighlight: function(params){
    if (!this._isShowingDialog){
      this.hideText();
    }

    // TODO Shouldn't make direct calls to inventory
    if(nsn.Inventory.itemSelected){
      var messageToShow = this._buildCombinationMessagePrefix(nsn.Inventory.itemSelected);
      this.showTextWithoutTimeout(messageToShow);
    }
  },

  _handleItemPicked: function(params){
    this.showText(params.text);
  },

  _handleUseItemStart: function(params){
    var messageToShow = this._buildCombinationMessagePrefix(params.currentObject);
    this.showTextWithoutTimeout(messageToShow);
  },

  _handlePlayerTalk: function(params){
    this.showText(params.text);
    this.currentDeferred.promise.then(function(){
      nsn.fire(nsn.events.PLAYER_SPEECH_TEXT_ENDED);
    });
  },

  _handleCombinationMessage: function(params){
    var combinationMessage = this.DEFAULT_COMBINATION_MESSAGE;

    if(params.combinationConfig){
      combinationMessage = params.combinationConfig.message;
    }

    nsn.fire(nsn.events.COMBINATION_MESSAGE_BUILT, {combinationMessage: combinationMessage});
  },

  _buildFullCombinationMessage: function(itemSelected, objectMouseOverName){
    return this._buildCombinationMessagePrefix(itemSelected) + objectMouseOverName;
  },

  //TODO I18n
  _buildCombinationMessagePrefix: function(itemSelected){
    return "Usar " + itemSelected.name + " com: ";
  }

};

nsn.TextManager.prototype.constructor = nsn.TextManager;

/* global nsn: true, createjs: true */

/**
* @copyright    2014 CoalaTech.
* Should not be instantiated.
* Extend this class if you want to add a walking behavior to your class.
* 
* The extented class MUST have a createjs.Sprite attribute called "image" for this to work.
* The image attribute MUST have the following animations:
*   - walkFront - Front walking
*   - walk - Side walking
*/
nsn.Walkable = function(){};

nsn.Walkable.prototype = {

  walkPath: function(path){

    this.stop();

    this.walkDeferred = new nsn.Deferred();

    this.path = path;

    if(!this._pathIsValid()){
      this.walkDeferred.resolve();
    }else{
      this.cellSize = nsn.Engine.cellSize;
      this.pathIndex = 0;

      this.walkAnimated();
    }

    return this.walkDeferred.promise;

  },

  // stop: function(){

  // },

  /* 
    Splits the path into subpaths, calls walkTo() for each subpath.
    In the last subpath it resolves the walkDeferred, finishing the walking cycle.
  */
  walkAnimated: function(){

    var pathEndNode = this.path[this.pathIndex + 1];

    /* TODO: Expose scaleX and scaleY properties directly on the nsn.Engine class */
    var pathWalkPromise = this.walkTo(
      (pathEndNode[0] * this.cellSize + (this.cellSize / 2)) / nsn.Engine.scaleX(),
      (pathEndNode[1] * this.cellSize + (this.cellSize / 2)) / nsn.Engine.scaleY()
    );

    this.pathIndex++;

    if(this.pathIndex === this.path.length - 1){
      pathWalkPromise.then(this.walkDeferred.resolve);
      return;
    }

    pathWalkPromise.then(this.walkAnimated.bind(this));

  },

  walkTo: function(x, y){

    var deferred = new nsn.Deferred();

    this.isPlayingAnimation = true;
    this.isMoving = true;

    /*
      This trial and error 'formula' is an attempt to make the duration
      of the movement be based on the distance traveled
     */
    var distance = Math.abs(x - this.image.x - this.image.regX) +
                  Math.abs((y - this.image.y) * 1.5);

    var duration = distance * 3.5;

    /* Calls the animations depending on the direction */
    if(y > this.image.y && Math.abs(x - this.image.x) < 200){
      this.image.gotoAndPlay('walkFront');
    }else{
      this.updateImageOrientation(x);
      this.image.gotoAndPlay('walk');
    }

    /* Do the actual tweening, resolving the promises as it finishes */
    createjs.Tween.get(this.image)
            .to({x: x, y: y}, duration)
            .call(this._onWalkTweenComplete.bind(this))
            .call(deferred.resolve);

    return deferred.promise;

  },

  updateImageOrientation: function(destX){

    if(destX > this.image.x && this.facing === "left"){
      this.faceRight();
    }else if(destX < this.image.x && this.facing === "right"){
      this.faceLeft();
    }

  },

  _onWalkTweenComplete: function(){

    if(this.pathIndex === this.path.length - 1){
      this.image.gotoAndStop("idle");
      this.isPlayingAnimation = false;
      this.isMoving = false;
    }

  },

  _pathIsValid: function(){

    return (this.path && this.path.length > 0);

  }

};

nsn.Walkable.prototype.constructor = nsn.Walkable;

// nsn.Character.implement(nsn.Walkable);

/* global nsn: true, createjs: true */

nsn.Bootstrap = function(){

  // TODO: Load from a JSON file
  this.manifest = [
    {id: "characters.json", src: nsn.ASSETS_PATH + "json/characters.json"},
    {id: "scenes.json", src: nsn.ASSETS_PATH + "json/scenes.json"},
    {id: "apartamento.json", src: nsn.ASSETS_PATH + "json/apartamento.json"},
    {id: "sacada.json", src: nsn.ASSETS_PATH + "json/sacada.json"},
    {id: "props.json", src: nsn.ASSETS_PATH + "json/props.json"},
    {id: "empty.json", src: nsn.ASSETS_PATH + "json/empty.json"},
    {id: "props_sacada.json", src: nsn.ASSETS_PATH + "json/props_sacada.json"},
    {id: "objectCombinations.json", src: nsn.ASSETS_PATH + "json/objectCombinations.json"},
    {id: "player_sprite", src: nsn.ASSETS_PATH + "img/character/player_sprite.png"},
    {id: "Dona", src: nsn.ASSETS_PATH + "img/character/Dona.png"},
    {id: "scene2_2", src: nsn.ASSETS_PATH + "img/background/scene2_2.jpg"},
    {id: "balcony", src: nsn.ASSETS_PATH + "img/background/balcony.jpg"},
    {id: "entradaSacada", src: nsn.ASSETS_PATH + "img/props/entradaSacada.png"},
    {id: "saidaSacada", src: nsn.ASSETS_PATH + "img/props/saidaSacada.png"},
    {id: "objHandlerSee", src: nsn.ASSETS_PATH + "img/hud/olhos.png"},
    {id: "objHandlerUse", src: nsn.ASSETS_PATH + "img/hud/mao.png"},
    {id: "objHandlerMouth", src: nsn.ASSETS_PATH + "img/hud/boca.png"},
    {id: "inventoryBackground", src: nsn.ASSETS_PATH + "img/hud/inventario_s.png"},
    {id: "openInventory", src: nsn.ASSETS_PATH + "img/hud/icone_inventario.png"},
    {id: "closeInventory", src: nsn.ASSETS_PATH + "img/hud/fechar_inventario.png"},
    {id: "slotInventory", src: nsn.ASSETS_PATH + "img/hud/slot_inventario_2.png"},
    {id: "pinguim_s", src: nsn.ASSETS_PATH + "img/props/pinguim_s.png"},
    {id: "jackers_s", src: nsn.ASSETS_PATH + "img/props/jackers_s.png"},
    {id: "faca_s", src: nsn.ASSETS_PATH + "img/props/faca_s.png"},
    {id: "sofa_s", src: nsn.ASSETS_PATH + "img/props/sofa_s.png"},
    {id: "almofada_s", src: nsn.ASSETS_PATH + "img/props/almofada_s.png"},
    {id: "revista_s", src: nsn.ASSETS_PATH + "img/props/revista_s.png"},
    {id: "oculos_s", src: nsn.ASSETS_PATH + "img/props/oculos_s.png"},
    {id: "tesoura_s", src: nsn.ASSETS_PATH + "img/props/tesoura_s.png"},
    {id: "mesacentro", src: nsn.ASSETS_PATH + "img/props/mesacentro.png"},
    {id: "tv", src: nsn.ASSETS_PATH + "img/props/tv.png"},
    {id: "mesinha", src: nsn.ASSETS_PATH + "img/props/mesinha.png"},
    {id: "relogio", src: nsn.ASSETS_PATH + "img/props/relogio.png"},
    {id: "cavalo", src: nsn.ASSETS_PATH + "img/props/cavalo.png"}
  ];

  this.startingScreen = new nsn.StartingScreen();

};


nsn.Bootstrap.prototype.init = function(){

  var queue = new createjs.LoadQueue(false);

  queue.addEventListener("complete",

    function handleComplete() {

      var asset;
      for(var index in this.manifest){
        asset = this.manifest[index];
        nsn.Engine.assets[asset.id] = queue.getResult(asset.id);
      }

      nsn.fire(nsn.events.ASSETS_LOADED);

    }.bind(this)

  );

  queue.addEventListener("progress",

    function(e){

      this.startingScreen.step(e.loaded);

    }.bind(this)

  );

  queue.loadManifest(this.manifest);

};

/* global nsn: true, createjs: true */

nsn.LoadingBar = function(x, y, width, height){

  this.x = x;
  this.y = y;

  this.width = width || (nsn.Engine.canvas.width - 2*x);
  this.height = height || 30;

  this.component = new createjs.Shape();
  this.rect = this.component.graphics.beginFill("#FF8C1C");
  this.component.x = x;
  this.component.y = y;
  this.component.alpha = 0.8;

};

nsn.LoadingBar.prototype.step = function(percentual){

  this.rect.drawRect(0, 0, percentual * this.width, this.height);

};

/* global nsn: true, createjs: true */

nsn.StartingScreen = function(){

  this.container = new createjs.Container();

  this.background = new createjs.Bitmap(nsn.ASSETS_PATH + 'img/hud/title.png');

  this.loadingBar = new nsn.LoadingBar(20, 300);

  var buttonWidth = 180;

  this.buttonStart = new createjs.Bitmap(nsn.ASSETS_PATH + 'img/hud/iniciar.jpg');
  this.buttonStart.x = (nsn.Engine.canvas.width / 2) - (buttonWidth / 2);
  this.buttonStart.y = 350;

  this.container.addChild(this.background);
  this.container.addChild(this.loadingBar.component);

  nsn.Engine.stage.stage.addChild(this.container);

};

nsn.StartingScreen.prototype.step = function(progress){

  this.loadingBar.step(progress);

  if(progress === 1){
    this.container.addChild(this.buttonStart);

    this.buttonStart.addEventListener('click', function(){
      nsn.fire(nsn.events.GAME_STARTED, {startingScreenContainer: this.container});
    }.bind(this));
  }

};

/* global nsn: true, createjs: true */

nsn.Character = function (options){

  this.image = null;
  this.facing = null;
  this.offsetX = null;

  this.isMoving = false;

  this.isPlayingAnimation = false;

  this.options = options;

  if(options){

    var image_data = options.image_data;

    /*  Gambs. Só funciona pra array com um elemento  */
    image_data.images = [nsn.Engine.assets[image_data.images[0]]];

    var spritesheet = new createjs.SpriteSheet(image_data);

    this.image = new createjs.Sprite(spritesheet);

    this.image.regX = options.regX;
    this.image.regY = options.regY;
    this.image.x = parseInt(options.x, 10);
    this.image.y = parseInt(options.y, 10);

    this.image.gotoAndStop(options.default_animation);

    this.name = this.image.name = options.name;

    this.facing = options.facing || "right";

    this.isPlayer = options.isPlayer;

  }

  this.addListeners();

};

nsn.Character.prototype = {

  walk: function(x, y){

    var position = this.position();

    var path = nsn.Engine.findPath(position[0], position[1], x, y);

    // Available as long as nsn.Character "implements" nsn.Walkable
    return this.walkPath(path);

  },

  position: function (){

    return [parseInt(this.image.x * nsn.Engine.scaleX() / nsn.Engine.cellSize, 10),
            parseInt(this.image.y * nsn.Engine.scaleY() / nsn.Engine.cellSize, 10)];

  },

  addListeners: function(){

  },

  stop: function(){

    createjs.Tween.removeTweens(this.image);
    this.image.gotoAndStop("idle");
    this.isPlayingAnimation = false;
    this.isMoving = false;

  },

  idle: function(){
    this.stop();
    this.image.gotoAndStop("idle");
  },

  face: function(side){
    if(side === "left"){
      this.faceLeft();
    }else{
      this.faceRight();
    }
  },

  faceRight: function(){
    if(this.facing === "left"){
      this.image.scaleX = -this.image.scaleX;
      this.offsetX = -this.offsetX;
    }
    this.facing  = "right";
  },

  faceLeft: function(){
    if(this.facing === "right"){
      this.image.scaleX = -this.image.scaleX;
      this.offsetX = -this.offsetX;
    }
    this.facing = "left";
  }

};

nsn.Character.implement(nsn.Walkable);

/* global nsn: true, createjs: true */

nsn.Player = (function(){
  var talkingDeferred;

  /*  Extends Player  */
  function Player(source){
    nsn.Character.apply(this, arguments);
  }
  Player.prototype = new nsn.Character();

  Player.prototype.hasItem = function(item){
    return nsn.Inventory.hasItem(item);
  };

  Player.prototype.pickItem = function(item, actionText){

    var deferred = new nsn.Deferred();
    var path;

    if(item.use_position){

      this.walk(item.use_position.x, item.use_position.y)
        .then(function(){
          if(item.use_position.facing){
            this.face(item.use_position.facing);
          }

          nsn.Inventory.addItem(item);

          take.call(this);

          deferred.resolve();
        }.bind(this));

    }else{

      nsn.Inventory.addItem(item);

      take.call(this);

      deferred.resolve();

    }

    deferred.promise.then(function(){
      nsn.fire(nsn.events.ITEM_PICKED, {item: item, text: actionText});
    });

    return deferred.promise;
  };

  Player.prototype.useItem = function(params){

    var deferred = new nsn.Deferred();
    var path;

    var item = params.target;

    if(item.use_position){

      this.walk(item.use_position.x, item.use_position.y)
        .then(function(){
          if(item.use_position.facing){
            this.face(item.use_position.facing);
          }

          grab.call(this, item.use_position.pick_animation_direction);

          deferred.resolve();
        }.bind(this));

    }else{

      grab.call(this);

      deferred.resolve();

    }

    deferred.promise.then(function(){
      nsn.fire(nsn.events.FINISHED_USING_ITEM_IN_SCENE, params);
    });

    return deferred.promise;
  };

  Player.prototype.say = function(message){
    talkingDeferred = new nsn.Deferred();
    this.image.gotoAndPlay("talk");

    nsn.fire(nsn.events.PLAYER_TALKING, {text: message});

    return talkingDeferred.promise;
  };

  Player.prototype.addListeners = function(){
    // nsn.listen(nsn.events.PATH_FOUND, this.walkPath, this);
    nsn.listen(nsn.events.BACKGROUND_CLICKED, onBackgroundClicked, this);
    nsn.listen(nsn.events.TEXT_END, this.resetAnimation, this);
    nsn.listen(nsn.events.INVENTORY_OPENED, openInventory, this);
    nsn.listen(nsn.events.INVENTORY_CLOSED, closeInventory, this);
    nsn.listen(nsn.events.PLAYER_SPEECH_TEXT_ENDED, stopTalking, this);
    nsn.listen(nsn.events.USING_ITEM_IN_SCENE, this.useItem, this);
    nsn.listen(nsn.events.COMBINATION_MESSAGE_BUILT, handleCombinationMessageBuilt, this);
    nsn.listen(nsn.events.ACTION_USE_CALLED, reactToActionUse, this);

    createjs.Ticker.addEventListener("tick", handleTick.bind(this));
  };

  function handleCombinationMessageBuilt(params){
    this.say(params.combinationMessage);
  }

  function onBackgroundClicked(evt){
    this.walk(evt.stageX, evt.stageY);
  }

  function take(){
    this.stop();
    this.image.gotoAndPlay("take");
  }

  function grab(position){
    position = position || "middle";
    this.stop();
    this.image.gotoAndPlay("grab_" + position);
  }

  function reactToActionUse(params){
    var objectClicked = params.currentObject;

    if(objectClicked.pickable){
      this.pickItem(objectClicked, params.actionText);
    }else{
      this.say(params.actionText);
    }
  }

  Player.prototype.resetAnimation = function(){
    this.stop();
    this.image.gotoAndPlay("idle");
  };

  function openInventory(){
    nsn.fire(nsn.events.STOP_EVERYTHING);
    this.image.gotoAndPlay("inventory");
  }

  function closeInventory(evt){
    /*  Se foi fechado pelo botao, toca a animação ao contrário  */
    if(evt.closedFromButton === true){
      this.stop();
      this.image.gotoAndPlay("inventory_close");
    }else{
      this.resetAnimation.call(this);
    }
  }

  function stopTalking(){
    talkingDeferred.resolve();
  }

  function handleTick(){
    // if(this.isMoving){
      var negative = this.image.scaleX > 0 ? 1 : -1;
      this.image.scaleX = this.image.scaleY = ((this.image.y + this.image.regY - 60) / 600);
      this.image.scaleX *= negative;
    // }
  }

  return Player;

})();

/* global nsn: true, createjs: true */

/*
* BrightnessFilter
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Adapted from http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
* by Claudio Vinicius de Carvalho - 2013
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * @module EaselJS
 */

// namespace:
this.createjs = this.createjs||{};

(function() {
  "use strict";

var BrightnessFilter = function( adjustment ){
  this.initialize(adjustment);
};
var p = BrightnessFilter.prototype = new createjs.Filter();

// constructor:
  /** @ignore */
  p.initialize = function( adjustment ) {
    if( isNaN(adjustment) || adjustment < 0 ){ adjustment = 100; }
    this.adjustment = adjustment;
  };

// public properties:

  p.adjustment = 100;

// public methods:

  p.applyFilter = function(ctx, x, y, width, height, targetCtx, targetX, targetY) {
    targetCtx = targetCtx || ctx;
    if (!targetX) { targetX = x; }
    if (!targetY) { targetY = y; }
    var imageData, data, l,
      r, g, b, v;
    try {
      imageData = ctx.getImageData(x, y, width, height);
    } catch(e) {
      return false;
    }

    data = imageData.data;
    l = data.length;
    for (var i=0; i<l; i+=4) {
      data[i] += this.adjustment;
      data[i+1] += this.adjustment;
      data[i+2] += this.adjustment;
    }

    targetCtx.putImageData(imageData, targetX, targetY);
    return true;
  };

  /**
   * Returns a clone of this object.
   * @return {BrightnessFilter}
   **/
  p.clone = function() {
    return new BrightnessFilter(this.adjustment);
  };

  p.toString = function() {
    return "[BrightnessFilter]";
  };

  createjs.BrightnessFilter = BrightnessFilter;

}());

/* global createjs: true */

/*
* ThresholdFilter
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Adapted from http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
* by Claudio Vinicius de Carvalho - 2013
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * @module EaselJS
 */

// namespace:
this.createjs = this.createjs||{};

(function() {
  "use strict";

var ThresholdFilter = function( threshold ){
  this.initialize(threshold);
};
var p = ThresholdFilter.prototype = new createjs.Filter();

// constructor:
  /** @ignore */
  p.initialize = function( threshold ) {
    if( isNaN(threshold) || threshold < 0 ){ threshold = 100; }
    this.threshold = threshold;
  };

// public properties:

  p.threshold = 100;

// public methods:

  p.applyFilter = function(ctx, x, y, width, height, targetCtx, targetX, targetY) {
    targetCtx = targetCtx || ctx;
    if (!targetX) { targetX = x; }
    if (!targetY) { targetY = y; }
    var imageData, data, l,
      r, g, b, v;
    try {
      imageData = ctx.getImageData(x, y, width, height);
    } catch(e) {
      return false;
    }

    data = imageData.data;
    l = data.length;
    for (var i=0; i<l; i+=4) {
      r = data[i];
      g = data[i+1];
      b = data[i+2];
      v = (0.2126*r + 0.7152*g + 0.0722*b >= this.threshold) ? 255 : 0;
      data[i] = data[i+1] = data[i+2] = v;
    }
    targetCtx.putImageData(imageData, targetX, targetY);
    return true;
  };

  /**
   * Returns a clone of this object.
   * @return {ThresholdFilter}
   **/
  p.clone = function() {
    return new ThresholdFilter(this.threshold);
  };

  p.toString = function() {
    return "[ThresholdFilter]";
  };

  createjs.ThresholdFilter = ThresholdFilter;

}());

/* global nsn: true, createjs: true */

/*
  Ao combinar dois itens:
  - Pode surgir um novo item
    - No inventário
    - Na tela
  - Pode tocar uma cutscene (disparar um sequencia de scripts)
  - Pode acontecer algo como sumir um item da tela sem gerar um novo
*/

nsn.ObjectCombiner = function(){

  this.combinations = this._setupCombinations();

  this.init();
};

nsn.ObjectCombiner.prototype = {

  init: function(){
    nsn.listen(nsn.events.FINISHED_USING_ITEM_IN_SCENE, this._hideObjectAfterUse, this);
    nsn.listen(nsn.events.FINISHED_COMBINE_ITEMS_FROM_INVENTORY, this._finishObjectCombination, this);
  },

  _setupCombinations: function(){
    return nsn.Engine.assets["objectCombinations.json"];
  },

  combine: function(source, target){
    nsn.fire(nsn.events.ON_COMBINE, {source: source, target: target});

    var combinationConfig = this._findCombinationConfig(source, target);
    var itemsWereCombined = this._combineItemsAccordingTo(combinationConfig, source, target);

    /* TODO Decide if we are going to dispatch this event here.
     * Here, the combination action didn't really finish yet. It only dispatched other
     * events to perform the combination.
     * If we really want to wait for the combination to finish, we need to move this
     * to function 'this._finishObjectCombination'.
     * It's here now because it's handling only the text show and it makes sense to
     * show the combination message concurrently with the combination action being performed.
     * Another option is to create another event only to handle the combination message, in case
     * we really need an event that guarantees the combination action has ended.
     */
    nsn.fire(nsn.events.FINISHED_ON_COMBINE, {combinationConfig: combinationConfig,
                                              itemsWereCombined: itemsWereCombined});
  },

  _findCombinationConfig: function(source, target){
    var combinationName = source.name + "_" + target.name;
    if(this.combinations[combinationName]){
      return this.combinations[combinationName];
    }else{
      combinationName = target.name + "_" + source.name;
      if(this.combinations[combinationName]){
        return this.combinations[combinationName];
      }
    }

    return null;
  },

  _combineItemsAccordingTo: function(combinationConfig, source, target){
    if(combinationConfig && combinationConfig["combinable?"]){
      /*
       * BUG1: como que faz quando se quer combinar um item que era pra ser combinado no inventory
       * na tela? Tipo usar o pinguim no Jackers no cenário mesmo. Vai gerar um item no inventario
       * do cara do nada. E do jeito que o código tá embaixo vai dar pau. Dá pra arrumar tranquilo,
       * mas enfim, acho que temos que organizar melhor.
       */

      var newItemAfterCombination;

      if(combinationConfig["generates_another_item?"]){
        newItemAfterCombination = this._generateCombinedItem(combinationConfig);
      }

      if (combinationConfig.target.name === "inventory") {
        // TODO We need to review these fadeouts
        createjs.Tween.get(source.group).to({alpha: 0}, 500);
        createjs.Tween.get(target.group).to({alpha: 0}, 500).call(function() {
          nsn.fire(nsn.events.COMBINING_ITEMS_FROM_INVENTORY, {source: source,
                                                               target: target,
                                                               newItem: newItemAfterCombination,
                                                               combinationConfig: combinationConfig});
        });
      }else{
        // TODO We need to review these fadeouts
        createjs.Tween.get(source.group).to({alpha: 0}, 300).call(function(){
          nsn.fire(nsn.events.USING_ITEM_IN_SCENE, {source: source,
                                                    target: target,
                                                    newItem: newItemAfterCombination,
                                                    combinationConfig: combinationConfig});
        });
      }

      return true;
    }

    return false;
  },

  _generateCombinedItem: function(combinationConfig){
    var newItemConfig = combinationConfig.item;

    return nsn.Engine.objectManager.createObject(newItemConfig);
  },

  // TODO We need to review these fadeouts
  _hideObjectAfterUse: function(params){
    createjs.Tween.get(params.target).to({alpha: 0}, 500)
      .call(this._finishObjectCombination, [params], this);
  },

  _finishObjectCombination: function(params){
    if(params.combinationConfig["run_script?"]){
      this._runScript(params.combinationConfig);
    }
  },

  _runScript: function(combinationConfig) {
    var script_params = combinationConfig.script_params;
    nsn.fire(nsn.events.ON_ACTION, script_params);
  }

};

nsn.ObjectCombiner.prototype.constructor = nsn.ObjectCombiner;

/* global nsn: true, createjs: true */

nsn.ObjectHandler = function(){

  this.currentObject = {};

  this.actions = this._setActions();

  this.defaultActionMessages = this._setDefaultActionMessages();

  this.group = this._createGroup();

  /* Defined in _createActionButton:
   * this.mouth
   * this.see
   * this.use
   */

  this.init();

};

nsn.ObjectHandler.prototype = {

  init: function(){
    this._generateActionButtons();

    nsn.listen(nsn.events.BACKGROUND_CLICKED, this.hideHUD, this);
    nsn.listen(nsn.events.SCENE_CHANGED, this.hideHUD, this);
  },

  _generateActionButtons: function(){
    var button;
    for(var action in this.actions){
      button = this._createActionButton(action, this.actions[action]);
      button.addEventListener('click', this._onButtonClicked.bind(this));
      this.group.addChild(button);
    }
  },

  _createActionButton: function(name, image){
    var button = new createjs.Bitmap(image);
    button.regX = 59;
    button.regY = 55;
    button.name = name;
    button.cursor = "pointer";
    this[name] = button;

    return button;
  },

  _onButtonClicked: function(evt){
    var actionName = evt.target.name;
    var actionText = this.findActionText(actionName);

    if (actionName === "use"){
      this._handleUseAction(actionText);
    }else{
      this._handleOtherActions(actionText);
    }

    nsn.fire(nsn.events.ON_ACTION, {"type": actionName, "target": this.currentObject.name});

    this.hideHUD();
  },

  _handleUseAction: function(actionText){
    if(this.currentObject.inInventory){
      nsn.fire(nsn.events.USE_ITEM_START, {currentObject: this.currentObject});
    } else {
      nsn.fire(nsn.events.ACTION_USE_CALLED, {currentObject: this.currentObject, actionText: actionText});
    }
  },

  //TODO Shouldn't be calling player directly
  _handleOtherActions: function(actionText){
    nsn.Engine.player.say(actionText);
  },

  findActionText: function(actionName){
    return this.currentObject.dialogs[actionName] || this.defaultActionMessages[actionName];
  },

  showHUD: function(x, y, objectClicked, inline){
    this._calculatePosition(x, y, inline);
    this.currentObject = objectClicked;
    nsn.Engine.stage.addHUD(this.group, true);
  },

  hideHUD: function(){
    this.currentObject = null;
    nsn.Engine.stage.removeHUD(this.group);
    nsn.Engine.objectManager.unselectObject();
  },

  /*
    Inline é um boolean para indicar se o HUD vai
    ser exibido em linha (para o inventário, por exemplo)
    ou ser disposto em torno de um objeto da cena.
  */
  // TODO Refactor
  _calculatePosition: function(x, y, inline){
    // console.log(x, y);
    nsn.Engine.mouth = this.mouth;
    nsn.Engine.see = this.see;
    nsn.Engine.use = this.use;
    // Pooooooodre
    // =]
    if(inline){
      this.mouth.x = x + 10;
      this.mouth.y = y;
      this.see.x = x + 10 + this.see.image.width;
      this.see.y = y;
      this.use.x = x + 10 + (2 * this.see.image.width);
      this.use.y = y;
      return;
    }

    /*  Objeto nos cantos da tela  */
    /*  Podre =}  */
    /*  TODO: Ajustar esses parâmetros e deixar de acordo com o tamanho da tela  */
    if(x < 150){
      if(y < 100){
        // this.mouth.x = 160 + this.mouth.regX;
        this.mouth.x = 180 + this.mouth.regX;
        this.mouth.y = 70;
        this.see.x = 90 + this.see.regX;
        this.see.y = 140;
        // this.use.x = 20 + this.use.regX;
        this.use.x = this.use.regX;
        this.use.y = 230;
        return;
      }else if(y > 500){
        this.mouth.x = this.mouth.regX;
        this.mouth.y = 390;
        this.see.x = 90 + this.see.regX;
        this.see.y = 460;
        this.use.x = 180 + this.use.regX;
        this.use.y = 550;
        return;
      }
    }else if(x > 800){
      if(y < 100){
        this.mouth.x = 740;
        this.mouth.y = 70;
        this.see.x = 810;
        this.see.y = 140;
        this.use.x = 880;
        this.use.y = 230;
        return;
      }else if(y > 500){
        this.mouth.x = 890;
        this.mouth.y = 390;
        this.see.x = 810;
        this.see.y = 460;
        this.use.x = 730;
        this.use.y = 550;
        return;
      }
    }

    /*  Puedre a perder de vista =D  */
    this.see.x = x;
    if(y - 100 - this.see.regY < 0){
      this.see.y = y + 100;
    }else{
      this.see.y = y - 100;
    }

    if(x - 100 - this.mouth.regX < 0){
      this.mouth.x = x;
      this.mouth.y = y + 100;
    }else{
      this.mouth.x = x - 100;
      this.mouth.y = y;
    }

    if(x + 100 + this.use.regX > nsn.Engine.stage.width){
      this.use.x = x;
      this.use.y = y + 100;
    }else{
      this.use.x = x + 100;
      this.use.y = y;
    }
  },

  _setActions: function(){
    return {
      "see": nsn.Engine.assets.objHandlerSee,
      "mouth": nsn.Engine.assets.objHandlerMouth,
      "use": nsn.Engine.assets.objHandlerUse
    };
  },

  _setDefaultActionMessages: function(){
    return {
      see: "Um belo item sem descrição...",
      mouth: "Eu não saio usando minha boca por ai assim.",
      use: "Interações sem sentido? No thx."
    };
  },

  _createGroup: function(){
    var group = new createjs.Container();
    group.width = nsn.Engine.stage.width;
    group.height = nsn.Engine.stage.height;

    return group;
  }
};

nsn.ObjectHandler.prototype.constructor = nsn.ObjectHandler;

/* global nsn: true, createjs: true */

nsn.ObjectManager = function(){
  this.objects = [];

  this.selectedObject = null;

  this.colorFilter = new createjs.ColorFilter(1, 0.8, 0.4, 1, 0, 0, 0, 0);

  this.blurFilter = new createjs.BlurFilter(2, 2, 0.6);

  this.thresholdFilter = new createjs.ThresholdFilter(150);

  this.brightnessFilter = new createjs.BrightnessFilter(50);

  this.bounds = this.blurFilter.getBounds();

  this._addListeners();
};

nsn.ObjectManager.prototype = {

  _addListeners: function(){
    nsn.listen(nsn.events.ACTION_USE_CALLED, this.unselectObject, this);
  },

  createObjects: function(objects){
    var createdObjects = [],
        objectsSize = objects.length;

    for (var i = 0; i < objectsSize; i++) {
      createdObjects.push(this.createObject(objects[i]));
    }

    return createdObjects;
  },

  createObject: function(config) {
    var objectBitmap = this.generateObjectBitmap(config);

    this.objects.push(objectBitmap);

    this.addObjectListeners(objectBitmap);

    return objectBitmap;
  },

  generateObjectBitmap: function(objectConfig) {
    var objectBitmap = new createjs.Bitmap(nsn.Engine.assets[objectConfig.path]);
    for (var property in objectConfig) {
      if(objectConfig.hasOwnProperty(property)){
        objectBitmap[property] = objectConfig[property];
      }
    }

    return objectBitmap;
  },

  addObjectListeners: function(objectBitmap){
    objectBitmap.addEventListener('click', this._onObjectClicked.bind(this));
    objectBitmap.addEventListener('mouseover', this.onMouseOverObject.bind(this));
    objectBitmap.addEventListener('mouseout', this.onMouseOutObject.bind(this));
  },

  _onObjectClicked: function(e){
    if(nsn.Inventory.itemSelected){
      nsn.Engine.objectCombiner.combine(nsn.Inventory.itemSelected, e.currentTarget);
    }else{
      var coordinates = this._targetCoordinates(e.target);

      this.unselectObject();
      this.selectObject(e.target);

      nsn.Engine.objectHandler.showHUD(coordinates.x, coordinates.y, e.target);
    }
  },

  _targetCoordinates: function(target){
    var coordinates = {
      x: target.x + target.image.width / 2,
      y: target.y + target.image.height / 2
    };

    return coordinates;
  },

  onMouseOverObject: function(evt){
    nsn.Engine.stage.setCursor("default_highlight");
    var objectName = evt.target.name;

    nsn.fire(nsn.events.ON_MOUSE_OVER_HIGHLIGHT, {type: 'Object', objectName: objectName});
  },

  onMouseOutObject: function (evt){
    nsn.Engine.stage.resetCursor();

    nsn.fire(nsn.events.ON_MOUSE_OUT_HIGHLIGHT, {type: 'Object'});
  },

  selectObject: function(object){
    this.selectedObject = object;
    this._applyFiltersInSelectedObject(object, [this.colorFilter]);
  },

  _applyFiltersInSelectedObject: function(object, filters){
    this.selectedObject.filters = filters;
    this.selectedObject.cache(0, 0, object.image.width, object.image.height);
  },

  unselectObject: function(){
    if(this.selectedObject){
      this.selectedObject.filters = [];
      this.selectedObject.uncache();
      this.selectedObject = null;
    }
  }
};

nsn.ObjectManager.prototype.constructor = nsn.ObjectManager;

/* global nsn: true, createjs: true */

nsn.Panels = nsn.Panels || {};

nsn.Panels.Fade = function(container){

  this.container = container;

};

nsn.Panels.Fade.prototype = {

  in: function(duration, onFinish){
    this._fade(0, 1, duration, onFinish);
  },

  out: function(duration, onFinish){
    this._fade(1, 0, duration, onFinish);
  },

  _fade: function(from, to, duration, onFinish){

    if(from){
      this.container.alpha = from;
    }

    var tween = createjs.Tween.get(this.container).to({alpha: to}, duration);
    if(onFinish){
      tween.call(onFinish);
    }

  }

};

/* global nsn: true, createjs: true */

nsn.Panels = nsn.Panels || {};

nsn.Panels.Flashback = function(parent){

  this.parent = parent;

  this.filter = new createjs.Bitmap(nsn.ASSETS_PATH + "img/background/filter2.png");
  this.filter.compositeOperation = "lighter";

};

nsn.Panels.Flashback.prototype = {

  show: function(){
    this.parent.addChild(this.filter);
  },

  hide: function(duration, onFinish){
    this.parent.removeChild(this.filter);
  }

};

/* global nsn: true, createjs: true */

nsn.Panels = nsn.Panels || {};

nsn.Panels.Widescreen = function(parent, stripHeight){

  this.parent = parent;

  this.panel = new createjs.Container();

  this.stripHeight = stripHeight || 100;

  this.height = parent.height || 600;
  this.width = parent.width || 1000;

  this.bottomStrip = new createjs.Shape();
  this.bottomStrip.graphics.beginFill("#000000").drawRect(0, 0, this.width, this.stripHeight);
  this.bottomStrip.x = 0;
  this.bottomStrip.y = this.height;
  this.bottomStrip.alpha = 0.8;

  this.topStrip = new createjs.Shape();
  this.topStrip.graphics.beginFill("#000000").drawRect(0, 0, this.width, this.stripHeight);
  this.topStrip.x = 0;
  this.topStrip.y = -this.stripHeight;
  this.topStrip.alpha = 0.8;

  this.panel.addChild(this.bottomStrip);
  this.panel.addChild(this.topStrip);

};

nsn.Panels.Widescreen.prototype = {

  show: function(duration){

    var deferred = new nsn.Deferred();

    this.topStrip.y = -this.stripHeight;
    this.bottomStrip.y = this.height;

    this.parent.addChild(this.panel);
    
    createjs.Tween.get(this.topStrip).to({y: 0}, duration);
    createjs.Tween.get(this.bottomStrip).to({y: this.bottomStrip.y - this.stripHeight}, duration).call(
      function(){
        deferred.resolve();
      }
    );

    return deferred.promise;

  },

  hide: function(duration){

    var deferred = new nsn.Deferred();

    createjs.Tween.get(this.topStrip).to({y: -this.stripHeight}, duration);
    createjs.Tween.get(this.bottomStrip).to({y: this.height}, duration).call(
      function(){
        this.parent.removeChild(this.panel);
        deferred.resolve();
      }.bind(this)
    );

    return deferred.promise;

  }

};

/* global nsn: true, PF: true, console: true */

/**
 * @class BitmapMaskPathfinder
 * 
 * Responsible for handling the A* algorithm for find walkable paths for the player
 * Uses a bitmap image as mask instead of a matrix in a JSON config file.
 * The bitmap image is converted to a 2-dimensional array of 1's and 0's with the aid of a canvas.
 * A zero means that the player can walk to/from that spot in the background.
 */
nsn.BitmapMaskPathfinder = function(image, options){

  this.image = image;

  this.options = options || {
    allowDiagonal: true,
    dontCrossCorners: true
  };

  /* Creating an auxiliary canvas to paste the image and then get the image data */
  var canvas = document.createElement('canvas'),

    ctx = canvas.getContext('2d'),

    width = nsn.Engine.canvas.width,

    height = nsn.Engine.canvas.height;

  canvas.width = width;

  canvas.height = height;

  /* Initializes a 2-dimensional array of 1's */
  var matrix = [], w, h;
  for (h = 0; h < height; h++) {
    matrix[h] = [];
    for (w = 0; w < width; w++) {
      matrix[h][w] = 1;
    }
  }

  /* Draws the mask to the auxiliary canvas */
  ctx.drawImage(image, 0, 0, width, height);

  var imageData = ctx.getImageData(0, 0, width, height),
    pixels = imageData.data;

  /*
    The image data holds 4 positions for each pixel (for red, green, blue and alpha channels).
    We then iterate over the pixels in 4-increments setting '0' in our matrix if the pixel is black
    (or, more precisely, if the pixel is black enough =D)
  */
  var x, y,
    l = pixels.length,
    skip = width * 4;
  for (var i = 0; i < l; i++) {

    /* Is the pixel 'black'? */
    if(pixels[i] < 10){
      x = (i/4) % width;
      y = (i/skip) | 0;

      matrix[y][x] = 0;
    }
  }

  /* We now have a matrix where the walkable positions are '0' and the non-walkable are '1' */

  this.matrix = matrix;

  this.grid = new PF.Grid(this.matrix[0].length, this.matrix.length, this.matrix);

  this.pathfinder = new PF.AStarFinder(this.options);
  // this.pathfinder = new PF.BestFirstFinder(this.options);

};

nsn.BitmapMaskPathfinder.prototype = {

  /**
   * Finds a path between 2 points in the grid
   * 
   * @param  {integer} fromX - The origin x coordinate
   * @param  {integer} fromY - The origin y coordinate
   * @param  {integer} toX - The destination x coordinate
   * @param  {integer} toY - The destination y coordinate
   * @return {array} - An array of coordinates
   */
  findPath: function(fromX, fromY, toX, toY){

    if(!this._isWalkable(fromX, fromY) || !this._isWalkable(toX, toY)){
      return [];
    }

    var updatedGrid = this._getUpdatedGrid();

    var inicio = new Date();

    var path = this.pathfinder.findPath(fromX, fromY, toX, toY, updatedGrid);

    if(path.length < 2){ return []; }

    path = PF.Util.smoothenPath(this.grid, path);

    var fim = new Date();
    console.log("Calculando path...", fim - inicio, "ms");

    return path;

  },

  /**
   * Returns true if the coordinates on the matrix area walkable (set to 0)
   * @param  {object} from - An object with x and y properties
   * @return {Boolean}
   */
  _isWalkable: function(x, y){
    return this.matrix[y][x] === 0;
  },

  /**
   * Updates the grid with the new position of the NPCs and other items that
   * may change the default walking areas.
   * @return {PF.Grid} - The updated grid with updated blocking areas set to 1 (non-walkable).
   */
  _getUpdatedGrid: function(){
    var inicio = new Date();
    var c = this.grid.clone();
    var fim = new Date();
    console.log("Clonando grid...", fim - inicio, "ms");

    return c;
  }

};

nsn.BitmapMaskPathfinder.prototype.constructor = nsn.BitmapMaskPathfinder;

/* global nsn: true, PF: true */

/**
 * @class MatrixPathFinder
 * 
 * Responsible for handling the A* algorithm for find walkable paths for the player
 * Uses a 2-dimensional array of 1's and 0's. A zero means that the player can walk to/from that spot in the background.
 */
nsn.MatrixPathFinder = function(matrix, options){

  this.options = options || {
    allowDiagonal: true,
    dontCrossCorners: true
  };

  this.matrix = matrix;

  this.grid = new PF.Grid(this.matrix[0].length, this.matrix.length, this.matrix);

  this.pathfinder = new PF.AStarFinder(this.options);

};

nsn.MatrixPathFinder.prototype = {

  /**
   * Finds a path between 2 points in the grid
   * 
   * @param  {integer} fromX - The origin x coordinate
   * @param  {integer} fromY - The origin y coordinate
   * @param  {integer} toX - The destination x coordinate
   * @param  {integer} toY - The destination y coordinate
   * @return {array} - An array of coordinates
   */
  findPath: function(fromX, fromY, toX, toY){

    if(!this._isWalkable(fromX, fromY) || !this._isWalkable(toX, toY)){
      return [];
    }

    var updatedGrid = this._getUpdatedGrid();

    var path = this.pathfinder.findPath(fromX, fromY, toX, toY, updatedGrid);

    if(path.length < 2){ return []; }

    path = PF.Util.smoothenPath(this.grid, path);

    return path;

  },

  /**
   * Returns true if the coordinates on the matrix area walkable (set to 0)
   * @param  {object} from - An object with x and y properties
   * @return {Boolean}
   */
  _isWalkable: function(x, y){
    // return this.matrix[x][y] === 0;
    return this.matrix[y][x] === 0;
  },

  /**
   * Updates the grid with the new position of the NPCs and other items that
   * may change the default walking areas.
   * @return {PF.Grid} - The updated grid with updated blocking areas set to 1 (non-walkable).
   */
  _getUpdatedGrid: function(){
    return this.grid.clone();
  }

};

nsn.MatrixPathFinder.prototype.constructor = nsn.MatrixPathFinder;
