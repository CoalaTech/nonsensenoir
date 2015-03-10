(function(){

  window.nsn = window.nsn || {};

  var stage;

  function initGame(){
    nsn.Engine = new nsn.GameEngine();

    nsn.Engine.stage = stage = new nsn.Stage();

    /*  Tentativa de redimensionar a tela */
    if(document.body.offsetWidth < nsn.Engine.canvas.width ||
       document.body.offsetHeight < nsn.Engine.canvas.height){

      var ratioX = document.body.offsetWidth / nsn.Engine.canvas.width,
          ratioY = document.body.offsetHeight / nsn.Engine.canvas.height;

      var scale = Math.min(ratioX, ratioY);

      stage.stage.scaleX = stage.stage.scaleY = scale;
    }

    var bootstrap = new nsn.Bootstrap();
    bootstrap.init();

  }

  window.onload = initGame;

})();
