nsn.ObjectManager = function(){

	var self = {},
		objects, selectedObject,
		colorFilter, blurFilter,
		thresholdFilter, brightnessFilter,
		bounds;

	function init(){
		self.objects = [];

		selectedObject = null;

		colorFilter = new createjs.ColorFilter(1, 0.8, 0.4, 1, 0, 0, 0, 0);

		blurFilter = new createjs.BlurFilter(2, 2, 0.6);

		thresholdFilter = new createjs.ThresholdFilter(150);

		brightnessFilter = new createjs.BrightnessFilter(50);

		bounds = blurFilter.getBounds();
	}

	self.createObjects = function(objects){

		var createdObjects = [];
		for (var i = 0; objectsSize = objects.length, i < objectsSize; i++) {
			createdObjects.push(self.createObject(objects[i]));
		}

		return createdObjects;
	};

	self.createObject = function(config) {
		var objectBitmap = self.generateObjectBitmap(config);

		self.objects.push(objectBitmap);

		self.addObjectListeners(objectBitmap);

		return objectBitmap;
	};

	self.generateObjectBitmap = function(objectConfig) {
		var objectBitmap = new createjs.Bitmap(Engine.assets[objectConfig.path]);
		for (var property in objectConfig) {
			if(objectConfig.hasOwnProperty(property)){
				objectBitmap[property] = objectConfig[property];
			}
		}
		// objectBitmap.name = objectConfig.name;
		// objectBitmap.pickable = objectConfig.pickable;
		// objectBitmap.use_position = objectConfig.use_position;
		// objectBitmap.dialogs =  objectConfig.dialogs;
		// objectBitmap.x = objectConfig.x;
		// objectBitmap.y = objectConfig.y;
		// objectBitmap.foreground = objectConfig.foreground;

		return objectBitmap;
	};

	self.addObjectListeners = function(objectBitmap){
		objectBitmap.addEventListener('click', onObjectClicked);
		objectBitmap.addEventListener('mouseover', self.onMouseOverObject);
		objectBitmap.addEventListener('mouseout', self.onMouseOutObject);
	};

	function onObjectClicked(e){

		if(Engine.inventory.itemSelected){
			Engine.objectCombiner.combine(Engine.inventory.itemSelected, e.currentTarget);
		}else{
			var coordinates = targetCoordinates(e.target);

			self.unselectObject();
			self.selectObject(e.target);

			Engine.objectHandler.showHUD(coordinates.x, coordinates.y, e.target);
		}

	}

	function targetCoordinates(target){
		var coordinates = {
			x: target.x + target.image.width / 2,
			y: target.y + target.image.height / 2
		};
		return coordinates;
	}

	self.onMouseOverObject = function(evt){
		Engine.stage.setCursor("default_highlight");
		if(!Engine.textManager.isShowingDialog){
			var objectName = evt.target.name;
			if(Engine.inventory.itemSelected){
				if(isNotTheSameObjectInInventory(objectName)){
					Engine.textManager.showTextWithoutTimeout(Engine.inventory.useItemMessage + " " + objectName);
				}
			}else{
				Engine.textManager.showTextWithoutTimeout(objectName);
			}
		}
	};

	self.onMouseOutObject = function (evt){
		Engine.stage.resetCursor();
		if(Engine.inventory.itemSelected){
			Engine.textManager.hideText();
			Engine.textManager.showTextWithoutTimeout(Engine.inventory.useItemMessage);
		}else if (!Engine.textManager.isShowingDialog){
			Engine.textManager.hideText();
		}
	};

	function isNotTheSameObjectInInventory(objectName){
		return Engine.inventory.itemSelected.name != objectName;
	}

	self.selectObject = function(object){
		selectedObject = object;
		coordinates = targetCoordinates(object);
		x = coordinates.x;
		y = coordinates.y;

		/*	Color filter	*/
		selectedObject.filters = [colorFilter];
		selectedObject.cache(0, 0, object.image.width, object.image.height);

		/*	Blur e Color Filter	*/
		// this.selectedObject.filters = [this.blurFilter, this.colorFilter];
		// this.selectedObject.cache(this.bounds.x, this.bounds.y, object.image.width + this.bounds.width, object.image.height + this.bounds.height);

		/*	Threshold filter	*/
		// selectedObject.filters = [brightnessFilter, thresholdFilter];
		// selectedObject.cache(0, 0, object.image.width, object.image.height);

	};

	self.unselectObject = function(){
		if(selectedObject){
			selectedObject.filters = [];
			selectedObject.uncache();
			selectedObject = null;
		}
	};

	init();

	return self;
};