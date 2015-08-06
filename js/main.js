/* global nsn: true, createjs: true */

window.nsn = window.nsn || {
  ASSETS_PATH: "./"
};

define("Main", ["exports", "Engine", "Stage"], function (exports, engine, Stage) {

  var eng = engine;

  var initGame = function(){

    nsn.Engine = new nsn.GameEngine();
    nsn.Engine.stage = new Stage();

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

  };

  exports.initGame = initGame.bind(this);

});

window.onload = function(){

  require(["Main"], function(main){

    main.initGame();

    console.log("OK");

  });

}