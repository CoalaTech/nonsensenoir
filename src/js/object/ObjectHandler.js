nsn.ObjectHandler = function(){

  var self = {};

  var currentObject;

  var actions = {
    "see": Engine.assets.objHandlerSee,
    "mouth": Engine.assets.objHandlerMouth,
    "use": Engine.assets.objHandlerUse
  };

  var defaultActionMessages = {
    see: "Um belo item sem descrição...",
    mouth: "Eu não saio usando minha boca por ai assim.",
    use: "Interações sem sentido? No thx."
  };

  function init(){

    self.group = new createjs.Container();
    self.group.width = Engine.stage.width;
    self.group.height = Engine.stage.height;

    var button;
    for(var action in actions){
      button = createActionButton(action, actions[action]);
      addListener(button);
      self.group.addChild(button);
    }

    nsn.listen(nsn.events.BACKGROUND_CLICKED, self.hideHUD);
    nsn.listen(nsn.events.SCENE_CHANGED, self.hideHUD);
  }

  function createActionButton(name, image){
    var button = new createjs.Bitmap(image);
    button.regX = 59;
    button.regY = 55;
    button.name = name;
    button.cursor = "pointer";
    self[name] = button;
    return button;
  }

  function addListener(target){
    target.addEventListener('click', onButtonClicked);
  }

  function onButtonClicked(evt){
    var actionText = "";

    if(currentObject.inInventory){
      if(evt.target.name == "use"){
        //TODO Refatorar useItemMessage...
        var useItemMessage = "Usar " + currentObject.name + " com: ";
        Engine.inventory.useItemMessage = useItemMessage;
        Engine.inventory.itemSelected = currentObject;
        nsn.fire(nsn.events.USE_ITEM_START, {currentObject: currentObject, text: useItemMessage});
      }else if (evt.target.name == "see"){
        actionText = currentObject.inventory_dialogs.see || defaultActionMessages.see;
        Engine.player.say(actionText);
      }else if (evt.target.name == "mouth"){
        actionText = currentObject.inventory_dialogs.mouth || defaultActionMessages.mouth;
        Engine.player.say(actionText);
      }
    }else{
      if(evt.target.name == "use"){
        Engine.objectManager.unselectObject();
        actionText = currentObject.dialogs.use || defaultActionMessages.use;
        if(currentObject.pickable){
          Engine.currentScene.player.pickItem(currentObject, actionText)
              .then(function(){
                Engine.currentScene.removeObject(currentObject);
              });
        }else{
          Engine.player.say(actionText);
        }
      }else if (evt.target.name == "see"){
        actionText = currentObject.dialogs.see || defaultActionMessages.see;
        Engine.player.say(actionText);
      }else if (evt.target.name == "mouth"){
        actionText = currentObject.dialogs.mouth || defaultActionMessages.mouth;
        Engine.player.say(actionText);
      }

      nsn.fire(nsn.events.ON_ACTION, {"type": evt.target.name, "target": currentObject.name});
    }

    self.hideHUD();
  }

  self.showHUD = function(x, y, objectClicked, inline){
    calculatePosition(x, y, inline);
    currentObject = objectClicked;
    // console.log(objectClicked);
    // Engine.currentScene.container.addChild(self.group);
    Engine.stage.addHUD(self.group, true);
  };

  self.hideHUD = function(){
    this.currentObject = null;
    // Engine.currentScene.container.removeChild(self.group);
    Engine.stage.removeHUD(self.group);
    Engine.objectManager.unselectObject();
  };

  /*
    Inline é um boolean para indicar se o HUD vai
    ser exibido em linha (para o inventário, por exemplo)
    ou ser disposto em torno de um objeto da cena.
  */
  function calculatePosition(x, y, inline){
    // console.log(x, y);
    Engine.mouth = self.mouth;
    Engine.see = self.see;
    Engine.use = self.use;
    // Pooooooodre
    // =]
    if(inline){
      self.mouth.x = x + 10;
      self.mouth.y = y;
      self.see.x = x + 10 + self.see.image.width;
      self.see.y = y;
      self.use.x = x + 10 + (2 * self.see.image.width);
      self.use.y = y;
      return;
    }

    /*  Objeto nos cantos da tela  */
    /*  Podre =}  */
    /*  TODO: Ajustar esses parâmetros e deixar de acordo com o tamanho da tela  */
    if(x < 150){
      if(y < 100){
        // self.mouth.x = 160 + self.mouth.regX;
        self.mouth.x = 180 + self.mouth.regX;
        self.mouth.y = 70;
        self.see.x = 90 + self.see.regX;
        self.see.y = 140;
        // self.use.x = 20 + self.use.regX;
        self.use.x = self.use.regX;
        self.use.y = 230;
        return;
      }else if(y > 500){
        self.mouth.x = self.mouth.regX;
        self.mouth.y = 390;
        self.see.x = 90 + self.see.regX;
        self.see.y = 460;
        self.use.x = 180 + self.use.regX;
        self.use.y = 550;
        return;
      }
    }else if(x > 800){
      if(y < 100){
        self.mouth.x = 740;
        self.mouth.y = 70;
        self.see.x = 810;
        self.see.y = 140;
        self.use.x = 880;
        self.use.y = 230;
        return;
      }else if(y > 500){
        self.mouth.x = 890;
        self.mouth.y = 390;
        self.see.x = 810;
        self.see.y = 460;
        self.use.x = 730;
        self.use.y = 550;
        return;
      }
    }

    /*  Puedre a perder de vista =D  */
    self.see.x = x;
    if(y - 100 - self.see.regY < 0){
      self.see.y = y + 100;
    }else{
      self.see.y = y - 100;
    }

    if(x - 100 - self.mouth.regX < 0){
      self.mouth.x = x;
      self.mouth.y = y + 100;
    }else{
      self.mouth.x = x - 100;
      self.mouth.y = y;
    }

    if(x + 100 + self.use.regX > Engine.stage.width){
      self.use.x = x;
      self.use.y = y + 100;
    }else{
      self.use.x = x + 100;
      self.use.y = y;
    }
  }

  init();

  return self;

};
