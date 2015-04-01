nsn.ObjectHandler = function(){

  this.currentObject;

  this.actions = this._setActions();

  this.defaultActionMessages = this._setDefaultActionMessages();

  this.group = this._createGroup();

  /* Defined in _createActionButton:
   * this.mouth
   * this.see
   * this.use
   */

  this.init();

};

nsn.ObjectHandler.prototype = {

  init: function(){
    this._generateActionButtons();

    nsn.listen(nsn.events.BACKGROUND_CLICKED, this.hideHUD, this);
    nsn.listen(nsn.events.SCENE_CHANGED, this.hideHUD, this);
  },

  _generateActionButtons: function(){
    var button;
    for(var action in this.actions){
      button = this._createActionButton(action, this.actions[action]);
      button.addEventListener('click', this._onButtonClicked.bind(this));
      this.group.addChild(button);
    }
  },

  _createActionButton: function(name, image){
    var button = new createjs.Bitmap(image);
    button.regX = 59;
    button.regY = 55;
    button.name = name;
    button.cursor = "pointer";
    this[name] = button;

    return button;
  },

  _onButtonClicked: function(evt){
    var actionName = evt.target.name;
    var actionText = this.findActionText(actionName);

    if (actionName == "use"){
      this._handleUseAction(actionText);
    }else{
      this._handleOtherActions(actionText);
    }

    nsn.fire(nsn.events.ON_ACTION, {"type": actionName, "target": this.currentObject.name});

    this.hideHUD();
  },

  _handleUseAction: function(actionText){
    if(this.currentObject.inInventory){
      nsn.fire(nsn.events.USE_ITEM_START, {currentObject: this.currentObject});
    } else {
      nsn.fire(nsn.events.ACTION_USE_CALLED, {currentObject: this.currentObject, actionText: actionText});
    }
  },

  //TODO Shouldn't be calling player directly
  _handleOtherActions: function(actionText){
    nsn.Engine.player.say(actionText);
  },

  findActionText: function(actionName){
    return this.currentObject.dialogs[actionName] || this.defaultActionMessages[actionName];
  },

  showHUD: function(x, y, objectClicked, inline){
    this._calculatePosition(x, y, inline);
    this.currentObject = objectClicked;
    nsn.Engine.stage.addHUD(this.group, true);
  },

  hideHUD: function(){
    this.currentObject = null;
    nsn.Engine.stage.removeHUD(this.group);
    nsn.Engine.objectManager.unselectObject();
  },

  /*
    Inline é um boolean para indicar se o HUD vai
    ser exibido em linha (para o inventário, por exemplo)
    ou ser disposto em torno de um objeto da cena.
  */
  // TODO Refactor
  _calculatePosition: function(x, y, inline){
    // console.log(x, y);
    nsn.Engine.mouth = this.mouth;
    nsn.Engine.see = this.see;
    nsn.Engine.use = this.use;
    // Pooooooodre
    // =]
    if(inline){
      this.mouth.x = x + 10;
      this.mouth.y = y;
      this.see.x = x + 10 + this.see.image.width;
      this.see.y = y;
      this.use.x = x + 10 + (2 * this.see.image.width);
      this.use.y = y;
      return;
    }

    /*  Objeto nos cantos da tela  */
    /*  Podre =}  */
    /*  TODO: Ajustar esses parâmetros e deixar de acordo com o tamanho da tela  */
    if(x < 150){
      if(y < 100){
        // this.mouth.x = 160 + this.mouth.regX;
        this.mouth.x = 180 + this.mouth.regX;
        this.mouth.y = 70;
        this.see.x = 90 + this.see.regX;
        this.see.y = 140;
        // this.use.x = 20 + this.use.regX;
        this.use.x = this.use.regX;
        this.use.y = 230;
        return;
      }else if(y > 500){
        this.mouth.x = this.mouth.regX;
        this.mouth.y = 390;
        this.see.x = 90 + this.see.regX;
        this.see.y = 460;
        this.use.x = 180 + this.use.regX;
        this.use.y = 550;
        return;
      }
    }else if(x > 800){
      if(y < 100){
        this.mouth.x = 740;
        this.mouth.y = 70;
        this.see.x = 810;
        this.see.y = 140;
        this.use.x = 880;
        this.use.y = 230;
        return;
      }else if(y > 500){
        this.mouth.x = 890;
        this.mouth.y = 390;
        this.see.x = 810;
        this.see.y = 460;
        this.use.x = 730;
        this.use.y = 550;
        return;
      }
    }

    /*  Puedre a perder de vista =D  */
    this.see.x = x;
    if(y - 100 - this.see.regY < 0){
      this.see.y = y + 100;
    }else{
      this.see.y = y - 100;
    }

    if(x - 100 - this.mouth.regX < 0){
      this.mouth.x = x;
      this.mouth.y = y + 100;
    }else{
      this.mouth.x = x - 100;
      this.mouth.y = y;
    }

    if(x + 100 + this.use.regX > nsn.Engine.stage.width){
      this.use.x = x;
      this.use.y = y + 100;
    }else{
      this.use.x = x + 100;
      this.use.y = y;
    }
  },

  _setActions: function(){
    return {
      "see": nsn.Engine.assets.objHandlerSee,
      "mouth": nsn.Engine.assets.objHandlerMouth,
      "use": nsn.Engine.assets.objHandlerUse
    };
  },

  _setDefaultActionMessages: function(){
    return {
      see: "Um belo item sem descrição...",
      mouth: "Eu não saio usando minha boca por ai assim.",
      use: "Interações sem sentido? No thx."
    };
  },

  _createGroup: function(){
    var group = new createjs.Container();
    group.width = nsn.Engine.stage.width;
    group.height = nsn.Engine.stage.height;

    return group;
  }
}

nsn.ObjectHandler.prototype.constructor = nsn.ObjectHandler;
