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
