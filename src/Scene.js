nsn.Scene = function(json){

	var self = {};

	var container,
		bitmapFilter, wideEffect, bottomStrip, topStrip,
		backgroundPanel, mainPanel, foregroundPanel,
		effectsPanel, hudPanel, textPanel,
		characters = {},
		objects = {},
		properties = {};

	self.background = null;
	self.exits = {};

	function init(){
		/*	Container principal de todos os objetos da cena	*/
		container = new createjs.Container();

		/*	Containers pra diferentes 'profundidades'	*/
		backgroundPanel = new createjs.Container();
		mainPanel = new createjs.Container();
		foregroundPanel = new createjs.Container();
		effectsPanel = new createjs.Container();
		// hudPanel = new createjs.Container();
		// textPanel = new createjs.Container();

		container.addChild(backgroundPanel);
		container.addChild(mainPanel);
		container.addChild(foregroundPanel);
		container.addChild(effectsPanel);
		// container.addChild(hudPanel);
		// container.addChild(textPanel);

		// createText();
		self.container = container;

	}

	self.addListeners = function(){
		// addTickListener();
		nsn.listen(nsn.events.SCENE_CHANGED, onSceneChanged);
	};

	var onSceneChanged = function(evt){
		if(evt.from == self.name){
			removeTickListener();
		}else if(evt.to == self.name){
			addTickListener();
		}
	};

	var addTickListener = function(){
		createjs.Ticker.addEventListener("tick", handleTick);
	};

	var removeTickListener = function(){
		createjs.Ticker.removeEventListener("tick", handleTick);
	};

	self.flashback = function(enabled){
		// Chame no console com Engine.currentScene.flashback(true);
		if(!bitmapFilter){
			bitmapFilter = new createjs.Bitmap("./assets/background/filter2.png");
			bitmapFilter.compositeOperation = "lighter";
		}

		if(enabled){
			effectsPanel.addChild(bitmapFilter);
		}else{
			effectsPanel.removeChild(bitmapFilter);
		}
	};

	self.widescreen = function(enabled){
		var deferred = new $.Deferred();
		var height = 100;
		if(!wideEffect){
			wideEffect = new createjs.Container();
			// wideEffect.width = container.width;
			// wideEffect.height = container.height;


			bottomStrip = new createjs.Shape();
			bottomStrip.graphics.beginFill("#000000").drawRect(0, 0, 1000, height);
			bottomStrip.x = 0;
			bottomStrip.alpha = 0.8;

			topStrip = new createjs.Shape();
			topStrip.graphics.beginFill("#000000").drawRect(0, 0, 1000, height);
			topStrip.x = 0;
			topStrip.alpha = 0.8;

			wideEffect.addChild(bottomStrip);
			wideEffect.addChild(topStrip);
		}
		var duration = 1000;
		if(enabled){
			topStrip.y = -height;
			bottomStrip.y = 600;
			effectsPanel.addChild(wideEffect);
			createjs.Tween.get(topStrip).to({y: 0}, duration);
			createjs.Tween.get(bottomStrip).to({y: bottomStrip.y - height}, duration).call(
				function(){
					deferred.resolve();
				}
			);
		}else{
			createjs.Tween.get(topStrip).to({y: -100}, duration);
			createjs.Tween.get(bottomStrip).to({y: 600}, duration).call(
				function(){
					effectsPanel.removeChild(wideEffect);
					deferred.resolve();
				}
			);
		}
		return deferred.promise();
	};

	self.fadeIn = function(duration, onFinish){
		container.alpha = 0;
		var callback = onFinish || function(){};
		createjs.Tween.get(container).to({alpha: 1}, duration).call(callback);
	};

	self.fadeOut = function(duration, onFinish){
		var callback = onFinish || function(){};
		createjs.Tween.get(container).to({alpha: 0}, duration).call(callback);
	};

	self.addBackground = function(background){
		if(background !== undefined){
			backgroundPanel.removeChild(background.component);
		}
		self.background = background;
		backgroundPanel.addChildAt(background.component, 0);
	};

	self.addCharacter = function(character, depth){
		var c = character.image;
		/*	Não adicionar o mesmo personagem duas vezes	*/
		if(characters[c.name] !== undefined){
			// return;
			mainPanel.removeChild(c);
		}

		characters[c.name] = c;
		mainPanel.addChild(c);

		if(character.isPlayer){
			self.player = character;
		}
	};

	self.addObjects = function(objects){
		$(objects).each(
			function(){
				self.addObject(this);
			}
		);
	};

	self.addObject = function(object, depth){
		/*	Não adicionar o mesmo objeto duas vezes	*/
		if(objects[object.name] !== undefined){
			return;
		}

		objects[object.name] = object;
		if(!object.foreground){
			if(depth){
				mainPanel.addChildAt(object, depth);
			}else{
				mainPanel.addChild(object);
			}
		}else{
			foregroundPanel.addChild(object);
		}
	};

	self.removeObject = function(object){
		if(objects[object.name]){
			mainPanel.removeChild(objects[object.name]);
			delete objects[object.name];
		}
	};

	self.setObjectsConfig = function(objectsConfig){
		var objects = Engine.objectManager.createObjects(objectsConfig);
		self.addObjects(objects);
	};

	self.addExit = function(exit){
		self.exits[exit.name] = exit;
		backgroundPanel.addChild(exit.image);
	};

	function handleTick(){

		if(!self.player.isMoving){ return; }

		var index = 0,
			object;
		for(var name in objects){
			object = objects[name];
			// if(self.player.image.y > object.y + object.image.height){
			if(self.player.image.y > object.y + object.image.height){
				index++;
			}
		}
		for(name in characters){
			character = characters[name];
			if(character.name == "Detetive"){continue;}
			// if(self.player.image.y > character.y){
			if(self.player.image.y * self.player.image.scaleY > character.y){
				index++;
			}
		}

		mainPanel.setChildIndex(self.player.image, index);
	}

	init();

	return self;

};