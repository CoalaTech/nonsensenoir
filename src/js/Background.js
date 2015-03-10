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
  this.cellSize = 1000 / this.matrix[0].length * nsn.Engine.stage.stage.scaleX;

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
