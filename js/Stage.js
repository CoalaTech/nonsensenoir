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
