import Walkable from 'Walkable'

class Character extends Walkable.Walkable{

  constructor(options) {

    super()

    this.image = null;
    this.facing = null;
    this.offsetX = null;

    this.isMoving = false;

    this.isPlayingAnimation = false;

    this.options = options;

    if (options) {

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

  }

  get position() {

    return [parseInt(this.image.x * nsn.Engine.scaleX() / nsn.Engine.cellSize, 10),
            parseInt(this.image.y * nsn.Engine.scaleY() / nsn.Engine.cellSize, 10)];

  }

  walk(x, y) {

    var position = this.position();

    var path = nsn.Engine.findPath(position[0], position[1], x, y);

    // Available as long as nsn.Character "implements" nsn.Walkable
    return this.walkPath(path);

  }

  stop() {

    createjs.Tween.removeTweens(this.image);
    this.image.gotoAndStop("idle");
    this.isPlayingAnimation = false;
    this.isMoving = false;

  }

  idle() {

    this.stop();
    this.image.gotoAndStop("idle");

  }

  face(side) {

    if(side === "left"){
      this.faceLeft();
    }else{
      this.faceRight();
    }

  }

  faceRight() {

    if(this.facing === "left"){
      this.image.scaleX = -this.image.scaleX;
      this.offsetX = -this.offsetX;
    }
    this.facing  = "right";

  }

  faceLeft() {

    if(this.facing === "right"){
      this.image.scaleX = -this.image.scaleX;
      this.offsetX = -this.offsetX;
    }
    this.facing = "left";

  }
  
}
