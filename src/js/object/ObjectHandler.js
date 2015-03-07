nsn.ObjectHandler = function(){

  this.currentObject;

  this.actions = this._setActions();

  this.defaultActionMessages = this._setDefaultActionMessages();

  this.group = this._createGroup();

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

  // TODO refactor this mess
  _onButtonClicked: function(evt){
    var actionText = "";

    if(this.currentObject.inInventory){
      if(evt.target.name == "use"){
        //TODO Refatorar useItemMessage...
        var useItemMessage = "Usar " + this.currentObject.name + " com: ";
        Engine.inventory.useItemMessage = useItemMessage;
        Engine.inventory.itemSelected = this.currentObject;
        nsn.fire(nsn.events.USE_ITEM_START, {currentObject: this.currentObject, text: useItemMessage});
      }else if (evt.target.name == "see"){
        actionText = this.currentObject.inventory_dialogs.see || this.defaultActionMessages.see;
        Engine.player.say(actionText);
      }else if (evt.target.name == "mouth"){
        actionText = this.currentObject.inventory_dialogs.mouth || this.defaultActionMessages.mouth;
        Engine.player.say(actionText);
      }
    }else{
      if(evt.target.name == "use"){
        Engine.objectManager.unselectObject();
        actionText = this.currentObject.dialogs.use || this.defaultActionMessages.use;
        if(this.currentObject.pickable){
          Engine.currentScene.player.pickItem(this.currentObject, actionText);
        }else{
          Engine.player.say(actionText);
        }
      }else if (evt.target.name == "see"){
        actionText = this.currentObject.dialogs.see || this.defaultActionMessages.see;
        Engine.player.say(actionText);
      }else if (evt.target.name == "mouth"){
        actionText = this.currentObject.dialogs.mouth || this.defaultActionMessages.mouth;
        Engine.player.say(actionText);
      }

      nsn.fire(nsn.events.ON_ACTION, {"type": evt.target.name, "target": this.currentObject.name});
    }

    this.hideHUD();
  },

  showHUD: function(x, y, objectClicked, inline){
    this._calculatePosition(x, y, inline);
    this.currentObject = objectClicked;
    Engine.stage.addHUD(this.group, true);
  },

  hideHUD: function(){
    this.currentObject = null;
    Engine.stage.removeHUD(this.group);
    Engine.objectManager.unselectObject();
  },

  /*
    Inline é um boolean para indicar se o HUD vai
    ser exibido em linha (para o inventário, por exemplo)
    ou ser disposto em torno de um objeto da cena.
  */
  // TODO Refactor
  _calculatePosition: function(x, y, inline){
    // console.log(x, y);
    Engine.mouth = this.mouth;
    Engine.see = this.see;
    Engine.use = this.use;
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

    if(x + 100 + this.use.regX > Engine.stage.width){
      this.use.x = x;
      this.use.y = y + 100;
    }else{
      this.use.x = x + 100;
      this.use.y = y;
    }
  },

  _setActions: function(){
    return {
      "see": Engine.assets.objHandlerSee,
      "mouth": Engine.assets.objHandlerMouth,
      "use": Engine.assets.objHandlerUse
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
    group.width = Engine.stage.width;
    group.height = Engine.stage.height;

    return group;
  }
}

nsn.ObjectHandler.prototype.constructor = nsn.ObjectHandler;
