nsn.Character = (function(){

	/*	Variaveis para controle do andar	*/
	var currentPath,
		cellSize,
		pathIndex,
		pathEndNode,
		walkPromise;

	function Character(source){

		this.image = null;
		this.facing = null;
		this.offsetX = null;

		this.isMoving = false;

		if(source){
			buildFromJSON.call(this, source);
		}

	}

	Character.prototype = {

		walk: function(x, y){

			this.stop();

			walkPromise = new $.Deferred();

			var pathObject = Engine.currentScene.background.findPath(x, y);

			walkPath.call(this, pathObject, walkPromise);

			return walkPromise.promise();

		},

		position: function (){

			return [parseInt(this.image.x * Engine.stage.stage.scaleX / Engine.cellSize, 10),
					parseInt(this.image.y * Engine.stage.stage.scaleY / Engine.cellSize, 10)];

		},

		addListeners: function(){

			this.image.addEventListener('click', function(){
				Engine.textManager.showText("Vou te mandar de volta, meu fio!");
				setTimeout(function(){
					Engine.setSceneAsCurrent('Apartamento', Engine.currentScene.exits.saidaSacada);
				}, 2000);
			});

		},

		stop: function(){

			createjs.Tween.removeTweens(this.image);
			this.image.gotoAndStop("idle");
			this.isPlayingAnimation = false;
			this.isMoving = false;

		},

		idle: function(){
			this.stop();
			this.image.gotoAndStop("idle");
		},

		face: function(side){
			if(side == "left"){
				this.faceLeft();
			}else{
				this.faceRight();
			}
		},

		faceRight: function(){
			if(this.facing == "left"){
				this.image.scaleX = -this.image.scaleX;
				this.offsetX = -this.offsetX;
			}
			this.facing  = "right";
		},

		faceLeft: function(){
			if(this.facing == "right"){
				this.image.scaleX = -this.image.scaleX;
				this.offsetX = -this.offsetX;
			}
			this.facing = "left";
		}

	};

	function walkPath(pathObject){

		if(!thereIsAPath(pathObject)){
			walkPromise.resolve();
			return;
		}

		currentPath = pathObject.path;
		cellSize = pathObject.cellSize;
		pathIndex = 0;

		walkAnimated.call(this);

	}

	function walkAnimated(){

		pathEndNode = currentPath[pathIndex + 1];

		var pathWalkPromise = walkTo.call(this,
					(pathEndNode[0] * cellSize + (cellSize / 2)) / Engine.stage.stage.scaleX,
					(pathEndNode[1] * cellSize + (cellSize / 2)) / Engine.stage.stage.scaleY
				);
		pathIndex++;

		if(pathIndex == currentPath.length - 1){
			pathWalkPromise.then(walkPromise.resolve);
			return;
		}

		pathWalkPromise.then(walkAnimated.bind(this));

	}

	function walkTo(x, y){

		var deferred = new $.Deferred();

		this.isPlayingAnimation = true;
		this.isMoving = true;

		/*	
			A ideia eh fazer a duracao baseada na distancia. 
			Essa 'formula' foi na tentativa e erro.	
		*/
		// var distance = Math.abs(x - image.x) + Math.abs(y - (image.y + 200));
		var distance = Math.abs(x - this.image.x - this.image.regX) +
						Math.abs((y - this.image.y) * 1.5);
		var duration = distance * 3.5;

		if(y > this.image.y && Math.abs(x - this.image.x) < 200){
			this.image.gotoAndPlay('walkFront');
		}else{
			updatePlayerOrientation.call(this, x);
			this.image.gotoAndPlay('walk');
		}
		createjs.Tween.get(this.image)
						.to({x: x, y: y}, duration)
						.call(onWalkTweenComplete.bind(this))
						.call(deferred.resolve);

		return deferred.promise();
	}

	function onWalkTweenComplete(){

		if(pathIndex == currentPath.length - 1){
			this.image.gotoAndStop("idle");
			this.isPlayingAnimation = false;
			this.isMoving = false;
		}

	}

	function updatePlayerOrientation(newX) {

		if(newX > this.image.x && this.facing == "left"){
			this.faceRight();
		}else if(newX < this.image.x && this.facing == "right"){
			this.faceLeft();
		}
	}

	function thereIsAPath(pathToWalk){

		if(pathToWalk){
			return true;
		}else{
			return false;
		}

	}

	function buildFromJSON(jsonContent){

		this.jsonContent = jsonContent;

		var image_data = jsonContent.image_data;

		/*	Gambs. Só funciona pra array com um elemento	*/
		image_data.images = [Engine.assets[image_data.images[0]]];

		var spritesheet = new createjs.SpriteSheet(image_data);
		// image = new createjs.BitmapAnimation(spritesheet);
		this.image = new createjs.Sprite(spritesheet);
		this.image.gotoAndStop(jsonContent.default_animation);

		this.name = this.image.name = jsonContent.name;

		this.isPlayingAnimation = false;

		this.image.regX = jsonContent.regX;
		this.image.regY = jsonContent.regY;
		this.facing = jsonContent.facing || "right";

		this.image.x = parseInt(jsonContent.x, 10);
		this.image.y = parseInt(jsonContent.y, 10);

		this.isPlayer = jsonContent.isPlayer;

		this.image = this.image;

		this.addListeners();

	}

	return Character;

})();