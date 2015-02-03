nsn.Stage = function(){

  var self = {};

  var scenePanel, blankPanel, hudPanel, textPanel, fadePanel,
    fadeShape, blankShape;

  function init(){

    self.stage = new createjs.Stage(Engine.canvas);

    // self.stage.cursor = "url(./build/img/props/cursor.png), auto";

    self.stage.enableMouseOver(20);

    self.stage.update();

    self.resetCursor();

    scenePanel = new createjs.Container();
    blankPanel = new createjs.Container();
    hudPanel = new createjs.Container();
    textPanel = new createjs.Container();
    fadePanel = new createjs.Container();

    self.stage.addChild(scenePanel);
    self.stage.addChild(hudPanel);
    self.stage.addChild(blankPanel);
    self.stage.addChild(textPanel);
    self.stage.addChild(fadePanel);

    createTextManager();

    createFadePanel();

    createBlankPanel();

    addListeners();

  }

  function addListeners(){
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(11);
  }

  function handleTick(){
    self.stage.update();
  }

  function createTextManager(){
    Engine.textManager = new nsn.TextManager();
    textPanel.addChild(Engine.textManager.textContainer);
  }

  self.addChild = function(child){
    self.stage.addChild(child);
  };

  self.setScene = function(scene){
    self.fadeIn(200, function(){
      scenePanel.removeAllChildren();
      scenePanel.addChild(scene.container);
      self.fadeOut(200);
    });
  };

  self.setCursor = function(name){
    // self.stage.cursor = nsn.cursors[name];
  };

  self.resetCursor = function(name){
    // self.stage.cursor = nsn.cursors["default"];
  };

  function createFadePanel(){
    var graphics = new createjs.Graphics();
    graphics.beginFill("rgba(0,0,0,1)");
    graphics.drawRect(0, 0, Engine.canvas.width, Engine.canvas.height);

    fadeShape = new createjs.Shape(graphics);
    fadeShape.alpha = 0;

    fadePanel.addChild(fadeShape);
  }

  function createBlankPanel(){
    var graphics = new createjs.Graphics();
    graphics.beginFill("rgba(0,0,0,0.01)");
    graphics.drawRect(0, 0, Engine.canvas.width, Engine.canvas.height);

    blankShape = new createjs.Shape(graphics);

    blankPanel.alpha = 0;

    blankPanel.addChild(blankShape);
  }

  self.fadeIn = function(duration, onFinish){
    var callback = onFinish || function(){};
    createjs.Tween.get(fadeShape).to({alpha: 1}, duration).call(callback);
  };

  self.fadeOut = function(duration, onFinish){
    var callback = onFinish || function(){};
    createjs.Tween.get(fadeShape).to({alpha: 0}, duration).call(callback);
  };

  self.showHUD = function(item, fadeIn){
    if(fadeIn === true){
      item.alpha = 0;
      hudPanel.addChild(item);
      createjs.Tween.get(item).to({alpha: 1}, 100);
    }else{
      hudPanel.addChild(item);
    }
  };

  self.removeHUD = function(item, fadeOut){
    if(fadeOut === true){
      hudPanel.removeChild(item);
      createjs.Tween.get(item).to({alpha: 0}, 100);
    }else{
      hudPanel.removeChild(item);
    }
  };

  self.disableInteraction = function(){
    // blankPanel.addChild(blankShape);
    blankPanel.alpha = 1;
    console.log("Desabilitando interações");
  };

  self.enableInteraction = function(){
    // blankPanel.removeChild(blankShape);
    blankPanel.alpha = 0;
    console.log("Habilitando interações");
  };


  init();

  return self;

};
