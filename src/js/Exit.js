nsn.Exit = function(){

	var self = {};

	self.init = function(config){
		self.config = config;
		self.name = config.name;
		self.description = config.description;

		self.image = new createjs.Bitmap(Engine.assets[config.source]);
		self.image.x = config.imageX;
		self.image.y = config.imageY;

		self.exitX = config.exitX * Engine.stage.stage.scaleX;
		self.exitY = config.exitY * Engine.stage.stage.scaleY;

		self.image.addEventListener("click", onExitClicked);
		self.image.addEventListener('mouseover', onMouseOverObject);
		self.image.addEventListener('mouseout', onMouseOutObject);
	};

	var onExitClicked = function(event){
		/*	TODO: Chegar na cena com o 'facing' correto e no nsn.Exit correto	*/
		// var pathToExit = Engine.currentScene.background.findPath(event.stageX, event.stageY);
		var playerPosition = Engine.player.position();
		if(playerPosition[0] == self.exitX && playerPosition[1] == self.exitY){
			Engine.setSceneAsCurrent(self.config.targetScene, self);
			return;
		}

		nsn.fire(nsn.events.STOP_EVERYTHING);

		Engine.player.walk(self.exitX, self.exitY)
					.then(function(){
							Engine.setSceneAsCurrent(self.config.targetScene, self);
						}
					);
	};

	var onMouseOverObject = function(event){
		Engine.stage.setCursor("exit");
		if(!Engine.textManager.isShowingDialog){
			// Engine.textManager.showTextWithoutTimeout(self.description);
			Engine.textManager.showTextWithoutTimeout(self.description);
		}
	};

	var onMouseOutObject = function (evt){
		Engine.stage.resetCursor();
		if (!Engine.textManager.isShowingDialog){
			Engine.textManager.hideText();
		}
	};

	return self;

};