nsn.StartingScreen = function(){

	this.container = new createjs.Container();

	this.background = new createjs.Bitmap('img/hud/title.png');

	this.loadingBar = new nsn.LoadingBar(20, 300);

	this.buttonStart = new createjs.Bitmap('img/hud/iniciar.jpg');
	this.buttonStart.x = (Engine.canvas.width / 2) - 90;
	this.buttonStart.y = 350;


	this.container.addChild(this.background);
	this.container.addChild(this.loadingBar.component);

	Engine.stage.stage.addChild(this.container);

};

nsn.StartingScreen.prototype.step = function(progress){

	this.loadingBar.step(progress);

	if(progress === 1){
		this.container.addChild(this.buttonStart);

		this.buttonStart.addEventListener('click', function(){
			nsn.fire(nsn.events.GAME_STARTED);

			Engine.stage.stage.removeChild(this.container);
		}.bind(this));
	}

};
