/* global nsn: true, createjs: true */

window.nsn = window.nsn || {
  ASSETS_PATH: "./"
};

define("Main", ["exports", "Engine", "Stage", "TesteES2015"], function (exports, engine, stage, teste) {

  var test = teste,
      eng = engine;

  function initGame(){

    nsn.Engine = new nsn.GameEngine();
    nsn.Engine.stage = new nsn.Stage();
    nsn.Engine.gameSound = new nsn.GameSound();
    nsn.Engine.objectManager = new nsn.ObjectManager();

    /*  Tentativa de redimensionar a tela */
    if(document.body.offsetWidth < nsn.Engine.canvas.width ||
       document.body.offsetHeight < nsn.Engine.canvas.height){

      var ratioX = document.body.offsetWidth / nsn.Engine.canvas.width,
          ratioY = document.body.offsetHeight / nsn.Engine.canvas.height;

      var scale = Math.min(ratioX, ratioY);

      nsn.Engine.stage.stage.scaleX = nsn.Engine.stage.stage.scaleY = scale;
    }

    var bootstrap = new nsn.Bootstrap();
    bootstrap.init();

  }

  exports.initGame = initGame;

});

window.onload = function(){

  require(["Main"], function(main){

    main.initGame();

    console.log("OK");

  });

}
