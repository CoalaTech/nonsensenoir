/* global nsn: true, createjs: true */

(function(){

  window.nsn = window.nsn || {
    ASSETS_PATH: "./"
  };

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

  window.onload = initGame;

})();
