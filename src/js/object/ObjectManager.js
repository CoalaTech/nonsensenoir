nsn.ObjectManager = function(){
  this.objects = [];

  this.selectedObject = null;

  this.colorFilter = new createjs.ColorFilter(1, 0.8, 0.4, 1, 0, 0, 0, 0);

  this.blurFilter = new createjs.BlurFilter(2, 2, 0.6);

  this.thresholdFilter = new createjs.ThresholdFilter(150);

  this.brightnessFilter = new createjs.BrightnessFilter(50);

  this.bounds = this.blurFilter.getBounds();
};

nsn.ObjectManager.prototype = {

  createObjects: function(objects){

    var createdObjects = [];
    for (var i = 0; objectsSize = objects.length, i < objectsSize; i++) {
      createdObjects.push(this.createObject(objects[i]));
    }

    return createdObjects;
  },

  createObject: function(config) {
    var objectBitmap = this.generateObjectBitmap(config);

    this.objects.push(objectBitmap);

    this.addObjectListeners(objectBitmap);

    return objectBitmap;
  },

  generateObjectBitmap: function(objectConfig) {
    var objectBitmap = new createjs.Bitmap(Engine.assets[objectConfig.path]);
    for (var property in objectConfig) {
      if(objectConfig.hasOwnProperty(property)){
        objectBitmap[property] = objectConfig[property];
      }
    }

    return objectBitmap;
  },

  addObjectListeners: function(objectBitmap){
    objectBitmap.addEventListener('click', this._onObjectClicked.bind(this));
    objectBitmap.addEventListener('mouseover', this.onMouseOverObject.bind(this));
    objectBitmap.addEventListener('mouseout', this.onMouseOutObject.bind(this));
  },

  _onObjectClicked: function(e){
    if(Engine.inventory.itemSelected){
      Engine.objectCombiner.combine(Engine.inventory.itemSelected, e.currentTarget);
    }else{
      var coordinates = this._targetCoordinates(e.target);

      this.unselectObject();
      this.selectObject(e.target);

      Engine.objectHandler.showHUD(coordinates.x, coordinates.y, e.target);
    }
  },

  _targetCoordinates: function(target){
    var coordinates = {
      x: target.x + target.image.width / 2,
      y: target.y + target.image.height / 2
    };

    return coordinates;
  },

  onMouseOverObject: function(evt){
    Engine.stage.setCursor("default_highlight");

    var objectName = evt.target.name;
    var messageToShow = objectName;

    //TODO Refatorar useItemMessage...
    if(Engine.inventory.itemSelected){
      if(this._isNotTheSameObjectInInventory(objectName)){
        messageToShow = Engine.inventory.useItemMessage + " " + objectName
      }
    }

    nsn.fire(nsn.events.ON_MOUSE_OVER_HIGHLIGHT, {type: 'Object', text: messageToShow});

  },

  onMouseOutObject: function (evt){
    Engine.stage.resetCursor();

    var messageToShow;

    //TODO Refatorar useItemMessage...
    if(Engine.inventory.itemSelected){
      messageToShow = Engine.inventory.useItemMessage;
    }

    nsn.fire(nsn.events.ON_MOUSE_OUT_HIGHLIGHT, {type: 'Object', text: messageToShow});
  },

  _isNotTheSameObjectInInventory: function(objectName){
    return Engine.inventory.itemSelected.name != objectName;
  },

  selectObject: function(object){
    this.selectedObject = object;
    this._applyFiltersInSelectedObject(object, [this.colorFilter]);

    /* TODO Check if this is necessary
     *
     * Blur e Color Filter Example
     * Example to show how it needs to be called to mimic the old behavior below
     *
     * this.selectedObject.filters = [this.blurFilter, this.colorFilter];
     * this.selectedObject.cache(this.bounds.x, this.bounds.y, object.image.width + this.bounds.width, object.image.height + this.bounds.height);
     *
     * We could simplificate the function _applyFiltersInSelectedObject if the extra parameters were not necessary...
     */
     //this._applyFiltersInSelectedObject(object, [this.blurFilter, this.colorFilter], this.bounds.x, this.bounds.y);
  },

  _applyFiltersInSelectedObject: function(object, filters, cord_x, cord_y){
    var x = cord_x | 0;
    var y = cord_y | 0;

    var width_offset = 0;
    var height_offset = 0;

    if(cord_x && cord_y){
      width_offset = this.bounds.width;
      height_offset = this.bounds.height;
    }

    this.selectedObject.filters = filters;
    this.selectedObject.cache(x, y, object.image.width + width_offset, object.image.height + height_offset);
  },

  unselectObject: function(){
    if(this.selectedObject){
      this.selectedObject.filters = [];
      this.selectedObject.uncache();
      this.selectedObject = null;
    }
  }
};

nsn.ObjectManager.prototype.constructor = nsn.ObjectManager;
