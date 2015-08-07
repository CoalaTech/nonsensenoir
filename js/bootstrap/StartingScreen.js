/* global nsn: true, createjs: true */

export default class StartingScreen {

  constructor(){

    this.container = new createjs.Container();

    this.background = new createjs.Bitmap(nsn.ASSETS_PATH + 'img/hud/title.png');

    this.loadingBar = new LoadingBar(20, 300);

    var buttonWidth = 180;

    this.buttonStart = new createjs.Bitmap(nsn.ASSETS_PATH + 'img/hud/iniciar.jpg');
    this.buttonStart.x = (nsn.Engine.canvas.width / 2) - (buttonWidth / 2);
    this.buttonStart.y = 350;

    this.container.addChild(this.background);
    this.container.addChild(this.loadingBar.component);

    nsn.Engine.stage.stage.addChild(this.container);

  }

  step(progress){

    this.loadingBar.step(progress);

    if(progress === 1){
      this.container.addChild(this.buttonStart);

      this.buttonStart.addEventListener('click', function(){
        nsn.fire(nsn.events.GAME_STARTED, {startingScreenContainer: this.container});
      }.bind(this));
    }

  }

}



class LoadingBar{

  constructor(x, y, width, height){
    this.x = x;
    this.y = y;

    this.width = width || (nsn.Engine.canvas.width - 2*x);
    this.height = height || 30;

    this.component = new createjs.Shape();
    this.rect = this.component.graphics.beginFill("#FF8C1C");
    this.component.x = x;
    this.component.y = y;
    this.component.alpha = 0.8;
  }

  step(percentual){

    this.rect.drawRect(0, 0, percentual * this.width, this.height);

  }

};