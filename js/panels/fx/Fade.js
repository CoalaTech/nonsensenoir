/* global nsn: true, createjs: true */

nsn.Panels = nsn.Panels || {};

nsn.Panels.Fade = function(container){

  this.container = container;

};

nsn.Panels.Fade.prototype = {

  in: function(duration, onFinish){
    this._fade(0, 1, duration, onFinish);
  },

  out: function(duration, onFinish){
    this._fade(1, 0, duration, onFinish);
  },

  _fade: function(from, to, duration, onFinish){

    if(from){
      this.container.alpha = from;
    }

    var tween = createjs.Tween.get(this.container).to({alpha: to}, duration);
    if(onFinish){
      tween.call(onFinish);
    }

  }

};
