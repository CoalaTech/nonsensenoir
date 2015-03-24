nsn.StartingScreen = function(){

  this.container = new createjs.Container();

  this.background = new createjs.Bitmap(nsn.ASSETS_PATH + 'img/hud/title.png');

  this.loadingBar = new nsn.LoadingBar(20, 300);

  var buttonWidth = 180;

  this.buttonStart = new createjs.Bitmap(nsn.ASSETS_PATH + 'img/hud/iniciar.jpg');
  this.buttonStart.x = (nsn.Engine.canvas.width / 2) - (buttonWidth / 2);
  this.buttonStart.y = 350;

  this.container.addChild(this.background);
  this.container.addChild(this.loadingBar.component);

  nsn.Engine.stage.stage.addChild(this.container);

};

nsn.StartingScreen.prototype.step = function(progress){

  this.loadingBar.step(progress);

  if(progress === 1){
    this.container.addChild(this.buttonStart);

    this.buttonStart.addEventListener('click', function(){
      nsn.fire(nsn.events.GAME_STARTED);

      nsn.Engine.stage.stage.removeChild(this.container);
    }.bind(this));
  }

};
