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

    /** @type {createjs.Bitmap} The exit's image, e.g, a door, a window, a rug, etc...  */
    this.image = new createjs.Bitmap(Engine.assets[this.config.source]);

    this.image.x = this.config.imageX;
    this.image.y = this.config.imageY;

    this.exitX = this.config.exitX * Engine.stage.stage.scaleX;
    this.exitY = this.config.exitY * Engine.stage.stage.scaleY;

    this._addEventListeners();

  },

  _addEventListeners: function(){

    this.image.addEventListener("click", this._walkToExit.bind(this));
    this.image.addEventListener('mouseover', this._onMouseOver.bind(this));
    this.image.addEventListener('mouseout', this._onMouseOut.bind(this));

  },

  _walkToExit: function(){

    var playerPosition = Engine.player.position();

    /* Going back and forth between scenes */
    if(playerPosition[0] == this.exitX && playerPosition[1] == this.exitY){
      Engine.setSceneAsCurrent(this.config.targetScene, this);
      return;
    }

    /* All hail STOP_EVERYTHING! =] */
    nsn.fire(nsn.events.STOP_EVERYTHING);

    Engine.player.walk(this.exitX, this.exitY)
          .then(function(){
              Engine.setSceneAsCurrent(this.config.targetScene, this);
            }.bind(this));

  },

  _onMouseOver: function(){

    Engine.stage.setCursor("exit");

    if(!Engine.textManager.isShowingDialog){
      Engine.textManager.showTextWithoutTimeout(this.description);
    }

  },

  _onMouseOut: function (){

    Engine.stage.resetCursor();

    if (!Engine.textManager.isShowingDialog){
      Engine.textManager.hideText();
    }

  }

};

nsn.Exit.prototype.constructor = nsn.Exit;
