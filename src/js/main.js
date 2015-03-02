(function(){

  window.nsn = window.nsn || {};

  var canvas,
    stage,
    scene,
    background,
    startButton,
    bootstrap;

  function initGame(){

    Engine.gameSound = new nsn.GameSound();

    var canvas = document.getElementById("canvas");
    canvas.width = 997;
    canvas.height = 600;

    Engine.canvas = canvas;

    Engine.stage = stage = new nsn.Stage();

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

    // Engine.gameSound.playSound(this.id, false);

    Engine.buildScenes();

    Engine.setSceneAsCurrent("Apartamento");

    createObjectHandler();
    createObjectCombiner();

    createInventory();

    Engine.script = new nsn.ScriptMachine();

    // Descomentar para rodar a música do jogo
    // -1 quer dizer que o áudio fica em loop
    // Engine.gameSound.playSound("mainGameMusicShort", -1);

  };

  // function createCharacter(source, self){

  //  // character = new self.nsn.Player(source, 200, 200);
  //  character = new nsn.Player(source);

  //  Engine.player = character;

  //  comadre = new nsn.Character(Engine.assets["characters.json"][1]);

  // }

  function createObjectHandler(){
    Engine.objectHandler = new nsn.ObjectHandler();
  }

  function createObjectCombiner(){
    Engine.objectCombiner = new nsn.ObjectCombiner();
  }

  function createInventory(){
    Engine.inventory = new nsn.Inventory();
  }

  window.onload = initGame;

})();
