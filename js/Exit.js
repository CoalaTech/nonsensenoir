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
    if(playerPosition[0] == this.exitX && playerPosition[1] == this.exitY){
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
