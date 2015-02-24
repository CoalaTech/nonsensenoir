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
    image_data.images = [Engine.assets[image_data.images[0]]];

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

    /* TODO: Refatorar esse pedaço. Character nao tem que conhecer o background */
    var path = Engine.currentScene.background.findPath(position[0], position[1], x, y);

    // Available since Character 'implements' nsn.Walkable
    return this.walkPath(path);

    // return walkPromise.promise();

  },

  position: function (){

    return [parseInt(this.image.x * Engine.stage.stage.scaleX / Engine.cellSize, 10),
        parseInt(this.image.y * Engine.stage.stage.scaleY / Engine.cellSize, 10)];

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
    if(side == "left"){
      this.faceLeft();
    }else{
      this.faceRight();
    }
  },

  faceRight: function(){
    if(this.facing == "left"){
      this.image.scaleX = -this.image.scaleX;
      this.offsetX = -this.offsetX;
    }
    this.facing  = "right";
  },

  faceLeft: function(){
    if(this.facing == "right"){
      this.image.scaleX = -this.image.scaleX;
      this.offsetX = -this.offsetX;
    }
    this.facing = "left";
  }

};

nsn.Character.implement(nsn.Walkable);
