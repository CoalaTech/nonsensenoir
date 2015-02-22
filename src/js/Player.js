nsn.Player = (function(){
  var talkingDeferred;

  /*  Extends Player  */
  function Player(source){
    nsn.Character.apply(this, arguments);
  }
  Player.prototype = new nsn.Character();

  Player.prototype.hasItem = function(item){
    return Engine.inventory.hasItem(item);
  };

  Player.prototype.pickItem = function(item, actionText){

    var deferred = new $.Deferred(),
      path;

    if(item.use_position){

      this.walk(item.use_position.x, item.use_position.y)
        .then(function(){
          if(item.use_position.facing){
            this.face(item.use_position.facing);
          }

          Engine.inventory.addItem(item);

          take.call(this);

          deferred.resolve();
        }.bind(this));

    }else{

      Engine.inventory.addItem(item);

      take.call(this);

      deferred.resolve();

    }

    deferred.then(function(){
      nsn.fire(nsn.events.ITEM_PICKED, {item: item, text: actionText});
    })

    return deferred.promise();
  };

  Player.prototype.useItem = function(item){

    var deferred = new $.Deferred(),
      path;

    if(item.use_position){

      this.walk(item.use_position.x, item.use_position.y)
        .then(function(){
          if(item.use_position.facing){
            this.face(item.use_position.facing);
          }

          grab.call(this, item.use_position.pick_animation_direction);

          deferred.resolve();
        }.bind(this));

    }else{

      grab.call(this);

      deferred.resolve();

    }

    return deferred.promise();
  };

  Player.prototype.say = function(message){
    talkingDeferred = new $.Deferred();
    this.image.gotoAndPlay("talk");

    nsn.fire(nsn.events.PLAYER_TALKING, {text: message});

    return talkingDeferred.promise();
  };

  Player.prototype.addListeners = function(){
    // nsn.listen(nsn.events.PATH_FOUND, this.walkPath, this);
    nsn.listen(nsn.events.BACKGROUND_CLICKED, onBackgroundClicked, this);
    nsn.listen(nsn.events.TEXT_END, this.resetAnimation, this);
    nsn.listen(nsn.events.INVENTORY_OPENED, openInventory, this);
    nsn.listen(nsn.events.INVENTORY_CLOSED, closeInventory, this);
    nsn.listen(nsn.events.PLAYER_SPEECH_TEXT_ENDED, stopTalking, this);

    createjs.Ticker.addEventListener("tick", handleTick.bind(this));
  };

  function onBackgroundClicked(evt){
    this.walk(evt.stageX, evt.stageY);
  }

  function take(){
    this.stop();
    this.image.gotoAndPlay("take");
  }

  function grab(position){
    position = position || "middle";
    this.stop();
    this.image.gotoAndPlay("grab_" + position);
  }

  Player.prototype.resetAnimation = function(){
    this.stop();
    this.image.gotoAndPlay("idle");
  };

  function openInventory(){
    nsn.fire(nsn.events.STOP_EVERYTHING);
    this.image.gotoAndPlay("inventory");
  }

  function closeInventory(evt){
    /*  Se foi fechado pelo botao, toca a animação ao contrário  */
    if(evt.closedFromButton === true){
      this.stop();
      this.image.gotoAndPlay("inventory_close");
    }else{
      this.resetAnimation.call(this);
    }
  }

  function stopTalking(){
    talkingDeferred.resolve();
  }

  function handleTick(){
    // if(this.isMoving){
      var negative = this.image.scaleX > 0 ? 1 : -1;
      this.image.scaleX = this.image.scaleY = ((this.image.y + this.image.regY - 60) / 600);
      this.image.scaleX *= negative;
    // }
  }

  return Player;

})();
