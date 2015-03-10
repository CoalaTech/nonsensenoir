nsn.LoadingBar = function(x, y, width, height){

  this.x = x;
  this.y = y;

  this.width = width || (nsn.Engine.canvas.width - 2*x);
  this.height = height || 30;

  this.component = new createjs.Shape();
  this.rect = this.component.graphics.beginFill("#FF8C1C");
  this.component.x = x;
  this.component.y = y;
  this.component.alpha = 0.8;

};

nsn.LoadingBar.prototype.step = function(percentual){

  this.rect.drawRect(0, 0, percentual * this.width, this.height);

};
