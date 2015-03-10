(function(){

  window.nsn = window.nsn || {};

  var canvas,
    stage,
    scene,
    background,
    startButton,
    bootstrap;

  function initGame(){

    nsn.Engine = new nsn.GameEngine();

    nsn.Engine.gameSound = new nsn.GameSound();

    var canvas = document.getElementById("canvas");
    canvas.width = 997;
    canvas.height = 600;

    nsn.Engine.canvas = canvas;

    nsn.Engine.stage = stage = new nsn.Stage();

    addEventListeners();

    /*  Tentativa de redimensionar a tela */
    if(document.body.offsetWidth < canvas.width || document.body.offsetHeight < canvas.height){
      var ratioX = document.body.offsetWidth / canvas.width,
        ratioY = document.body.offsetHeight / canvas.height;

      var scale = Math.min(ratioX, ratioY);

      stage.stage.scaleX = stage.stage.scaleY = scale;
    }

    bootstrap = new nsn.Bootstrap();
    bootstrap.init();

  }

  function addEventListeners(){

    nsn.listen(nsn.events.GAME_STARTED, onGameStarted);

  }

  var onGameStarted = function(){

    // nsn.Engine.gameSound.playSound(this.id, false);

    nsn.Engine.buildScenes();

    nsn.Engine.setSceneAsCurrent("Apartamento");

    createObjectHandler();
    createObjectCombiner();

    createInventory();

    nsn.Engine.script = new nsn.ScriptMachine();

    // Descomentar para rodar a música do jogo
    // -1 quer dizer que o áudio fica em loop
    // nsn.Engine.gameSound.playSound("mainGameMusicShort", -1);

  };

  // function createCharacter(source, self){

  //  // character = new self.nsn.Player(source, 200, 200);
  //  character = new nsn.Player(source);

  //  nsn.Engine.player = character;

  //  comadre = new nsn.Character(nsn.Engine.assets["characters.json"][1]);

  // }

  function createObjectHandler(){
    nsn.Engine.objectHandler = new nsn.ObjectHandler();
  }

  function createObjectCombiner(){
    nsn.Engine.objectCombiner = new nsn.ObjectCombiner();
  }

  function createInventory(){
    nsn.Engine.inventory = new nsn.Inventory();
  }

  window.onload = initGame;

})();
