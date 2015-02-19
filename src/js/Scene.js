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
}

p._onSceneChanged = function(event){

  if(event.from == this.name){
    this._removeTickListener();
  }else if(event.to == this.name){
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
    if(character.name == "Detetive"){continue;}
    // if(this.player.image.y > character.y){
    if(this.player.image.y * this.player.image.scaleY > character.y){
      index++;
    }
  }

  this.panels.main.setChildIndex(this.player.image, index);

}

p.flashback = function(){
  console.log('flashback');
};

p.widescreen = function(){
  console.log('widescreen');
  var deferred = new $.Deferred();

  deferred.resolve();

  return deferred.promise();
};

p.fadeIn = function(){
  console.log('fadeIn');
};

p.fadeOut = function(){
  console.log('fadeOut');
};

nsn.Scene.prototype.constructor = nsn.Scene;

// nsn.Scene = function(json){

  // self.flashback = function(enabled){
  //   // Chame no console com Engine.currentScene.flashback(true);
  //   if(!bitmapFilter){
  //     bitmapFilter = new createjs.Bitmap("./img/background/filter2.png");
  //     bitmapFilter.compositeOperation = "lighter";
  //   }

  //   if(enabled){
  //     effectsPanel.addChild(bitmapFilter);
  //   }else{
  //     effectsPanel.removeChild(bitmapFilter);
  //   }
  // };

  // self.widescreen = function(enabled){
  //   var deferred = new $.Deferred();
  //   var height = 100;
  //   if(!wideEffect){
  //     wideEffect = new createjs.Container();
  //     // wideEffect.width = container.width;
  //     // wideEffect.height = container.height;


  //     bottomStrip = new createjs.Shape();
  //     bottomStrip.graphics.beginFill("#000000").drawRect(0, 0, 1000, height);
  //     bottomStrip.x = 0;
  //     bottomStrip.alpha = 0.8;

  //     topStrip = new createjs.Shape();
  //     topStrip.graphics.beginFill("#000000").drawRect(0, 0, 1000, height);
  //     topStrip.x = 0;
  //     topStrip.alpha = 0.8;

  //     wideEffect.addChild(bottomStrip);
  //     wideEffect.addChild(topStrip);
  //   }
  //   var duration = 1000;
  //   if(enabled){
  //     topStrip.y = -height;
  //     bottomStrip.y = 600;
  //     effectsPanel.addChild(wideEffect);
  //     createjs.Tween.get(topStrip).to({y: 0}, duration);
  //     createjs.Tween.get(bottomStrip).to({y: bottomStrip.y - height}, duration).call(
  //       function(){
  //         deferred.resolve();
  //       }
  //     );
  //   }else{
  //     createjs.Tween.get(topStrip).to({y: -100}, duration);
  //     createjs.Tween.get(bottomStrip).to({y: 600}, duration).call(
  //       function(){
  //         effectsPanel.removeChild(wideEffect);
  //         deferred.resolve();
  //       }
  //     );
  //   }
  //   return deferred.promise();
  // };

  // self.fadeIn = function(duration, onFinish){
  //   container.alpha = 0;
  //   var callback = onFinish || function(){};
  //   createjs.Tween.get(container).to({alpha: 1}, duration).call(callback);
  // };

  // self.fadeOut = function(duration, onFinish){
  //   var callback = onFinish || function(){};
  //   createjs.Tween.get(container).to({alpha: 0}, duration).call(callback);
  // };

// };
