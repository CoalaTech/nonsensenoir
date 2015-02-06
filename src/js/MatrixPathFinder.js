/**
 * @class MatrixPathFinder
 * 
 * Responsible for handling the A* algorithm for find walkable paths for the player
 * Uses a 2-dimensional array of 1's and 0's. A zero means that the player can walk to/from that spot in the background.
 */
nsn.MatrixPathFinder = function(matrix, options){

	this.options = options || {
		allowDiagonal: true,
		dontCrossCorners: true
	};

	/**
	 * [matrix description]
	 * @type {[type]}
	 */
	this.matrix = matrix;

	this.grid = new PF.Grid(this.matrix[0].length, this.matrix.length, this.matrix);

	this.pathfinder = new PF.AStarFinder(this.options);

};

nsn.MatrixPathFinder.prototype = {

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

		var path = this.pathfinder.findPath(fromX, fromY, toX, toY, updatedGrid);

		if(path.length < 2){ return []; }

		path = PF.Util.smoothenPath(this.grid, path);

		return path;

	},

	/**
	 * Returns true if the coordinates on the matrix area walkable (set to 0)
	 * @param  {object} from - An object with x and y properties
	 * @return {Boolean}
	 */
	_isWalkable: function(x, y){
		// return this.matrix[x][y] === 0;
		return this.matrix[y][x] === 0;
	},

	/**
	 * Updates the grid with the new position of the NPCs and other items that
	 * may change the default walking areas.
	 * @return {PF.Grid} - The updated grid with updated blocking areas set to 1 (non-walkable).
	 */
	_getUpdatedGrid: function(){
		return this.grid.clone();
	}

};

nsn.MatrixPathFinder.prototype.constructor = nsn.MatrixPathFinder;
