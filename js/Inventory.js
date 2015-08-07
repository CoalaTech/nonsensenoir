/* global nsn: true, createjs: true */

import events from 'Base';

(function(){
  
  var Inventory = function(){

    this.items = {};
    this.useItemMessage = "";

    this.NUM_ITEMS_PER_ROW = 2;
    this.NUM_ITEMS_PER_COL = 4;

    this.itemsGroup = this._createItemsGroup();
    this._itemWithGroupMap = {};

    this.horizontalSize = this.itemsGroup.width / this.NUM_ITEMS_PER_ROW;
    this.verticalSize = this.itemsGroup.height / this.NUM_ITEMS_PER_COL;

    this.numItems = 0;

    this.inventoryIsOpen = false;

    this.itemSelected = null;

    nsn.listen(nsn.events.GAME_STARTED, this.init, this, true);

  };

  Inventory.prototype = {

    init: function(){
      this.openInventoryButton = this._createOpenButton();
      this.closeInventoryButton = this._createCloseButton();

      this.image = this._createImage();
      this.group = this._createGroup();

      this.setOpenInventoryOnKeypress();

      nsn.Engine.stage.addHUD(this.openInventoryButton);

      nsn.listen(nsn.events.BACKGROUND_CLICKED, this.hideInventory, this);
      nsn.listen(nsn.events.SCENE_CHANGED, this.hideInventory, this);
      nsn.listen(nsn.events.ON_COMBINE, this.cancelUseItem, this);
      nsn.listen(nsn.events.COMBINING_ITEMS_FROM_INVENTORY, this._combineItems, this);
      nsn.listen(nsn.events.USE_ITEM_START, this._selectItem, this);
      nsn.listen(nsn.events.USING_ITEM_IN_SCENE, this.hideInventory, this);
      nsn.listen(nsn.events.FINISHED_USING_ITEM_IN_SCENE, this._removeItemAfterUse, this);
      nsn.listen(nsn.events.FINISHED_ON_COMBINE, this._handleCombinationEnd, this);
    },

    setOpenInventoryOnKeypress: function(){
      nsn.DOMEvent.on(document, 'keypress', function(event){

        var keyCode = (event.keyCode ? event.keyCode : event.which);

        /* KeyCodes
         * i = 105
         */
        if (keyCode === 105){
          this._toggleInventory();
        }

      }.bind(this));

    },

    addItem: function(item){
      this.items[item.name] = item;
      this._addToInventory(item);
      this.numItems++;
    },

    removeItem: function(item){
      this._removeFromInventory(item);
      delete this.items[item.name];
      this.numItems--;
    },

    hasItem: function(item){
      if(typeof(item) === "string"){
        return this.items[item] !== undefined;
      }else{
        return this.items[item.name] !== undefined;
      }
    },

    showInventory: function(){
      nsn.Engine.stage.removeHUD(this.openInventoryButton);
      nsn.Engine.stage.addHUD(this.closeInventoryButton);
      nsn.Engine.stage.addHUD(this.group);

      createjs.Tween.get(this.group).to({x: 0}, 200);

      this.inventoryIsOpen = true;

      nsn.fire(nsn.events.INVENTORY_OPENED);
    },

    hideInventory: function(closedFromButton){
      if(!this.inventoryIsOpen){ return; }

      nsn.Engine.stage.removeHUD(this.closeInventoryButton);
      nsn.Engine.stage.addHUD(this.openInventoryButton);
      createjs.Tween.get(this.group)
            .to({x: -200}, 200)
            .call(function(){
              nsn.Engine.stage.removeHUD(this.group);
            });

      this.inventoryIsOpen = false;

      nsn.fire(nsn.events.INVENTORY_CLOSED, {closedFromButton: closedFromButton === true});
    },

    cancelUseItem: function(){
      if(this.itemSelected){
        this.itemSelected = null;
      }
    },

    _createOpenButton: function(){
      var openInventoryButton = new createjs.Bitmap(nsn.Engine.assets.openInventory);
      openInventoryButton.x = 20;
      openInventoryButton.y = 20;
      openInventoryButton.addEventListener('click', this._onOpenClicked.bind(this));

      return openInventoryButton;
    },

    _createCloseButton: function(){
      var closeInventoryButton = new createjs.Bitmap(nsn.Engine.assets.closeInventory);
      closeInventoryButton.x = 200;
      closeInventoryButton.y = 20;
      closeInventoryButton.addEventListener('click', this._onCloseClicked.bind(this));

      return closeInventoryButton;
    },

    _createItemsGroup: function(){
      var itemsGroup = new createjs.Container();
      itemsGroup.width = 150;
      itemsGroup.height = 360;
      itemsGroup.x = 20;
      itemsGroup.y = 175;

      return itemsGroup;
    },

    _createImage: function(){
      return new createjs.Bitmap(nsn.Engine.assets.inventoryBackground);
    },

    _createGroup: function(){
      var group = new createjs.Container();

      group.addChild(this.image);
      group.addChild(this.itemsGroup);

      group.x = -200;
      group.y = 0;

      return group;
    },

    _toggleInventory: function(){
      if(this.inventoryIsOpen){
        this._onCloseClicked();
      }else{
        this._onOpenClicked();
      }
    },

    _onCloseClicked: function(){
      this.hideInventory(true);
      nsn.Engine.objectHandler.hideHUD();
    },

    _onOpenClicked: function(){
      this.showInventory();
    },

    _addToInventory: function(item){
      var group = new createjs.Container();
      var newItem = item.clone();
      /*  Sobreescrever o metodo do EaselJS?  */
      newItem.pickable = item.pickable;
      newItem.dialogs = item.inventory_dialogs;
      newItem.inInventory = true;

      var slot = new createjs.Bitmap(nsn.Engine.assets.slotInventory);
      group.addChild(slot);
      group.addChild(newItem);
      this._setGroupPositionInInventory(group);
      this._centralizeNewItemInsideSlot(newItem);
      this.itemsGroup.addChild(group);

      group.addEventListener('click', this._onObjectClicked.bind(this));
      group.addEventListener('mouseover', this._onMouseOverObject.bind(this));
      group.addEventListener('mouseout', this._onMouseOutObject.bind(this));
      group.name = newItem.name;

      /*  Para recuperar o objeto quando clicado  */
      slot.object = newItem;
      group.object = newItem;
      newItem.group = group;

      this._itemWithGroupMap[newItem.name] = newItem;
    },

    _centralizeNewItemInsideSlot: function(newItem) {
      newItem.regX = newItem.image.width / 2;
      newItem.regY = newItem.image.height / 2;
      newItem.x = 36;
      newItem.y = 36;
    },

    _setGroupPositionInInventory: function(group, position) {
      if (position === undefined){ position = this.numItems; }

      var coordinates = this._calculateGroupPositionCoordinates(position);
      group.x = coordinates.x;
      group.y = coordinates.y;
    },

    _calculateGroupPositionCoordinates: function(position){
      var row = parseInt(position / this.NUM_ITEMS_PER_ROW, 10);
      var column = parseInt(position % this.NUM_ITEMS_PER_ROW, 10);

      return {
        x: column * this.horizontalSize,
        y: row * this.verticalSize
      };
    },

    _removeFromInventory: function(item){
      this.itemsGroup.removeChild(item.group);
      this._itemWithGroupMap[item.name] = null;
    },

    reorganizeItems: function() {
      nsn.each(this.itemsGroup.children, function(itemGroup, position) {
        this._setGroupPositionInInventory(itemGroup, position);
      }.bind(this));
    },

    _onObjectClicked: function(event){
      var target = event.target.object ? event.target.object : event.target;

      nsn.Engine.objectManager.unselectObject();

      if(this.itemSelected){
        nsn.Engine.objectCombiner.combine(this.itemSelected, target);
      }else{
        nsn.Engine.objectManager.selectObject(target);
        nsn.Engine.objectHandler.showHUD(
                      this.image.image.width + 10,
                      this.itemsGroup.y + target.group.y + 35,
                      target,
                      true
                    );
      }
    },

    _onMouseOverObject: function(event){
      event.target = event.target.object ? event.target.object : event.target;
      nsn.Engine.objectManager.onMouseOverObject(event);
    },

    _onMouseOutObject: function(event){
      event.target = event.target.object ? event.target.object : event.target;
      nsn.Engine.objectManager.onMouseOutObject(event);
    },

    _selectItem: function(params){
      this.itemSelected = params.currentObject;
    },

    _combineItems: function(params){
      this.removeItem(params.source);
      this.removeItem(params.target);
      this.reorganizeItems();

      if(params.newItem){
        this.addItem(params.newItem);
      }

      nsn.fire(nsn.events.FINISHED_COMBINE_ITEMS_FROM_INVENTORY, params);
    },

    _removeItemAfterUse: function(params){
      this.removeItem(params.source);
    },

    _handleCombinationEnd: function(params){
      if(!params.itemsWereCombined){ this.hideInventory(true); }
    },

    itemIsNotTheSameOfInventory: function(objectName){
      return this.itemSelected.name !== objectName;
    }
  };

  Inventory.prototype.constructor = Inventory;

  nsn.Inventory = new Inventory();

})();
