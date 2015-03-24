nsn.Panels = nsn.Panels || {};

nsn.Panels.Flashback = function(parent){

  this.parent = parent;

  this.filter = new createjs.Bitmap(nsn.ASSETS_PATH + "img/background/filter2.png");
  this.filter.compositeOperation = "lighter";

};

nsn.Panels.Flashback.prototype = {

  show: function(){
    this.parent.addChild(this.filter);
  },

  hide: function(duration, onFinish){
    this.parent.removeChild(this.filter);
  }

};
