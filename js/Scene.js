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
