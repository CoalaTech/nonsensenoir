nsn.Panels = nsn.Panels || {};

nsn.Panels.Widescreen = function(parent, stripHeight){

  this.parent = parent;

  this.panel = new createjs.Container();

  this.stripHeight = stripHeight || 100;

  this.height = parent.height || 600;
  this.width = parent.width || 1000;

  this.bottomStrip = new createjs.Shape();
  this.bottomStrip.graphics.beginFill("#000000").drawRect(0, 0, this.width, this.stripHeight);
  this.bottomStrip.x = 0;
  this.bottomStrip.y = this.height;
  this.bottomStrip.alpha = 0.8;

  this.topStrip = new createjs.Shape();
  this.topStrip.graphics.beginFill("#000000").drawRect(0, 0, this.width, this.stripHeight);
  this.topStrip.x = 0;
  this.topStrip.y = -this.stripHeight;
  this.topStrip.alpha = 0.8;

  this.panel.addChild(this.bottomStrip);
  this.panel.addChild(this.topStrip);

};

nsn.Panels.Widescreen.prototype = {

  show: function(duration){

    var deferred = new nsn.Deferred();

    this.topStrip.y = -this.stripHeight;
    this.bottomStrip.y = this.height;

    this.parent.addChild(this.panel);
    
    createjs.Tween.get(this.topStrip).to({y: 0}, duration);
    createjs.Tween.get(this.bottomStrip).to({y: this.bottomStrip.y - this.stripHeight}, duration).call(
      function(){
        deferred.resolve();
      }
    );

    return deferred.promise;

  },

  hide: function(duration){

    var deferred = new nsn.Deferred();

    createjs.Tween.get(this.topStrip).to({y: -this.stripHeight}, duration);
    createjs.Tween.get(this.bottomStrip).to({y: this.height}, duration).call(
      function(){
        this.parent.removeChild(this.panel);
        deferred.resolve();
      }.bind(this)
    );

    return deferred.promise;

  }

};
