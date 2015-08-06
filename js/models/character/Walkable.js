/**
* @copyright    2014 CoalaTech.
* Should not be instantiated.
* Extend this class if you want to add a walking behavior to your class.
* 
* The extented class MUST have a createjs.Sprite attribute called "image" for this to work.
* The image attribute MUST have the following animations:
*   - walkFront - Front walking
*   - walk - Side walking
*/
export default class Walkable{

  walkPath() {

    this.stop();

    this.walkDeferred = new nsn.Deferred();

    this.path = path;

    if(!this._pathIsValid()){
      this.walkDeferred.resolve();
    }else{
      this.cellSize = nsn.Engine.cellSize;
      this.pathIndex = 0;

      this.walkAnimated();
    }

    return this.walkDeferred.promise;

  }

  /* 
    Splits the path into subpaths, calls walkTo() for each subpath.
    In the last subpath it resolves the walkDeferred, finishing the walking cycle.
  */
  walkAnimated() {

    var pathEndNode = this.path[this.pathIndex + 1];

    /* TODO: Expose scaleX and scaleY properties directly on the nsn.Engine class */
    var pathWalkPromise = this.walkTo(
      (pathEndNode[0] * this.cellSize + (this.cellSize / 2)) / nsn.Engine.scaleX(),
      (pathEndNode[1] * this.cellSize + (this.cellSize / 2)) / nsn.Engine.scaleY()
    );

    this.pathIndex++;

    if(this.pathIndex === this.path.length - 1){
      pathWalkPromise.then(this.walkDeferred.resolve);
      return;
    }

    pathWalkPromise.then(this.walkAnimated.bind(this));

  }

  walkTo(x, y) {

    var deferred = new nsn.Deferred();

    this.isPlayingAnimation = true;
    this.isMoving = true;

    /*
      This trial and error 'formula' is an attempt to make the duration
      of the movement be based on the distance traveled
     */
    var distance = Math.abs(x - this.image.x - this.image.regX) +
                  Math.abs((y - this.image.y) * 1.5);

    var duration = distance * 3.5;

    /* Calls the animations depending on the direction */
    if(y > this.image.y && Math.abs(x - this.image.x) < 200){
      this.image.gotoAndPlay('walkFront');
    }else{
      this.updateImageOrientation(x);
      this.image.gotoAndPlay('walk');
    }

    /* Do the actual tweening, resolving the promises as it finishes */
    createjs.Tween.get(this.image)
            .to({x: x, y: y}, duration)
            .call(this._onWalkTweenComplete.bind(this))
            .call(deferred.resolve);

    return deferred.promise;

  }

  updateImageOrientation(destX) {

    if(destX > this.image.x && this.facing === "left"){
      this.faceRight();
    }else if(destX < this.image.x && this.facing === "right"){
      this.faceLeft();
    }

  }

  _onWalkTweenComplete() {

    if(this.pathIndex === this.path.length - 1){
      this.image.gotoAndStop("idle");
      this.isPlayingAnimation = false;
      this.isMoving = false;
    }

  }

  _pathIsValid() {

    return (this.path && this.path.length > 0);

  }
  
}