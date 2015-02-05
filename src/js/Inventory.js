nsn.Inventory = function(){

  var self = {};

  self.items = {};
  self.useItemMessage = "";

  var NUM_ITEMS_PER_ROW = 2;
  var NUM_ITEMS_PER_COL = 4;

  var num_items = 0;

  var inventoryIsOpen = false;

  self.itemSelected = null;

  function init(){

    self.group = new createjs.Container();
    // self.group.width = Engine.stage.width;
    // self.group.height = Engine.stage.height;

    createOpenButton();
    createCloseButton();
    setOpenInventoryOnKeypress();

    Engine.stage.showHUD(self.openInventoryButton);

    self.image = new createjs.Bitmap(Engine.assets.inventoryBackground);

    self.itemsGroup = new createjs.Container();
    self.itemsGroup.width = 150;
    self.itemsGroup.height = 360;
    self.itemsGroup.x = 20;
    self.itemsGroup.y = 175;

    self.hor = self.itemsGroup.width / NUM_ITEMS_PER_ROW;
    self.ver = self.itemsGroup.height / NUM_ITEMS_PER_COL;

    // var graphics = new createjs.Graphics().beginFill("#ff0000").drawRect(0, 0, 130, 400);
    // var shape = new createjs.Shape(graphics);

    // //Alternatively use can also use the graphics property of the Shape class to renderer the same as above.
    // var shape = new createjs.Shape();
    // shape.graphics.beginFill("#ff0000").drawRect(0, 0, 140, 400);

    // self.itemsGroup.addChild(shape);

    self.group.addChild(self.image);

    self.group.addChild(self.itemsGroup);

    self.group.x = -200;
    self.group.y = 0;

    nsn.listen(nsn.events.BACKGROUND_CLICKED, self.hideInventory);
    nsn.listen(nsn.events.SCENE_CHANGED, self.hideInventory);
  }

  function setOpenInventoryOnKeypress(){
    $(document).keypress(function(event){
      var keyCode = (event.keyCode ? event.keyCode : event.which);

      /* KeyCodes
       *
       * i = 105
       *
       */
      if (keyCode == 105){
        toggleInventory();
      }
    });
  }

  self.addItem = function(item){
    self.items[item.name] = item;
    addToInventory(item);
    num_items++;
  };

  self.removeItem = function(item){
    removeFromInventory(item);
    delete self.items[item.name];
    num_items--;
  };

  self.hasItem = function(item){
    if(typeof(item) == "string"){
      return self.items[item] !== undefined;
    }else{
      return self.items[item.name] !== undefined;
    }
  };

  self.showInventory = function(){
    Engine.stage.removeHUD(self.openInventoryButton);
    Engine.stage.showHUD(self.closeInventoryButton);
    Engine.stage.showHUD(self.group);

    createjs.Tween.get(self.group).to({x: 0}, 200);

    inventoryIsOpen = true;

    nsn.fire(nsn.events.INVENTORY_OPENED);
  };

  self.hideInventory = function(closedFromButton){

    if(!inventoryIsOpen){
      return;
    }

    Engine.stage.removeHUD(self.closeInventoryButton);
    Engine.stage.showHUD(self.openInventoryButton);
    createjs.Tween.get(self.group)
          .to({x: -200}, 200)
          .call(function(){
            Engine.stage.removeHUD(self.group);
          });

    inventoryIsOpen = false;

    nsn.fire(nsn.events.INVENTORY_CLOSED, {closedFromButton: closedFromButton === true});
  };

  self.cancelUseItem = function(){
    self.itemSelected = null;
    Engine.textManager.hideText();
  };

  var createOpenButton = function(){
    self.openInventoryButton = new createjs.Bitmap(Engine.assets.openInventory);
    self.openInventoryButton.x = 20;
    self.openInventoryButton.y = 20;
    self.openInventoryButton.addEventListener('click', onOpenClicked);
  };

  var createCloseButton = function(){
    self.closeInventoryButton = new createjs.Bitmap(Engine.assets.closeInventory);
    self.closeInventoryButton.x = 200;
    self.closeInventoryButton.y = 20;
    self.closeInventoryButton.addEventListener('click', onCloseClicked);
  };

  var toggleInventory = function(){
    if(inventoryIsOpen){
      onCloseClicked();
    }else{
      onOpenClicked();
    }
  };

  var onCloseClicked = function(){
    self.hideInventory(true);
    Engine.objectHandler.hideHUD();
  };

  var onOpenClicked = function(){
    self.showInventory();
  };

  var addToInventory = function(item){
    var group = new createjs.Container();
    var newItem = item.clone();
    /*  Sobreescrever o metodo do EaselJS?  */
    newItem.pickable = item.pickable;
    newItem.inventory_dialogs = item.inventory_dialogs;
    newItem.inInventory = true;

    var slot = new createjs.Bitmap(Engine.assets.slotInventory);
    group.addChild(slot);
    group.addChild(newItem);
    setGroupPositionInInventory(group);
    centralizeNewItemInsideSlot(newItem);
    self.itemsGroup.addChild(group);

    group.addEventListener('click', onObjectClicked);
    group.addEventListener('mouseover', onMouseOverObject);
    group.addEventListener('mouseout', onMouseOutObject);
    group.name = newItem.name;

    /*  Para recuperar o objeto quando clicado  */
    slot.object = newItem;
    group.object = newItem;
    newItem.group = group;
  };

  var centralizeNewItemInsideSlot = function(newItem) {
    newItem.regX = newItem.image.width / 2;
    newItem.regY = newItem.image.height / 2;
    newItem.x = 36;
    newItem.y = 36;
  };

  var setGroupPositionInInventory = function(group, position) {
    if (position === undefined) position = num_items;

    var row = parseInt(position / NUM_ITEMS_PER_ROW, 10);
    var column = parseInt(position % NUM_ITEMS_PER_ROW, 10);
    group.x = column * self.hor;
    group.y = row * self.ver;
  };

  var removeFromInventory = function(item){
    self.itemsGroup.removeChild(item.group);
  };

  self.reorganizeItems = function() {
    var position = 0;
    $.each(self.itemsGroup.children, function() {
      setGroupPositionInInventory(this, position);
      position++;
    });
  };

  var onObjectClicked = function(event){
    var target = event.target.object ? event.target.object : event.target;
    Engine.objectManager.unselectObject();

    if(self.itemSelected){
      Engine.objectCombiner.combine(self.itemSelected, target);
    }else{
      Engine.objectManager.selectObject(target);
      Engine.objectHandler.showHUD(
                    self.image.image.width + 10,
                    self.itemsGroup.y + target.group.y + 35,
                    target,
                    true
                  );
    }
  };

  var onMouseOverObject = function(event){
    event.target = event.target.object ? event.target.object : event.target;
    Engine.objectManager.onMouseOverObject(event);
  };

  var onMouseOutObject = function(event){
    event.target = event.target.object ? event.target.object : event.target;
    Engine.objectManager.onMouseOutObject(event);
  };

  init();

  return self;

};
