(function(){

  window.nsn = window.nsn || {};

  var canvas,
    stage,
    scene,
    background,
    startButton,
    bootstrap;

  function initGame(){

    bootstrap = new nsn.Bootstrap();

    Engine.gameSound = new nsn.GameSound();

    var canvas = $("#canvas")[0];
    canvas.width = 997;
    canvas.height = 600;

    Engine.canvas = canvas;

    startButton = $('#startGameButton');

    Engine.stage = stage = new nsn.Stage();

    addEventListeners();

    bootstrap.init();


    /*  Tentativa de redimensionar a tela */
    if(document.body.offsetWidth < canvas.width || document.body.offsetHeight < canvas.height){
      var ratioX = document.body.offsetWidth / canvas.width,
        ratioY = document.body.offsetHeight / canvas.height;

      var scale = Math.min(ratioX, ratioY);

      stage.stage.scaleX = stage.stage.scaleY = scale;
    }

  }

  function addEventListeners(){

    var menuScreen = $('#mainMenu');
    // var self = this;
    startButton.click(onButtonClicked);

    startButton.css('display', 'none');

    nsn.listen(nsn.events.ASSETS_LOADED, function(){
      startButton.css('display', 'block');
    })

  }

  var onButtonClicked = function(){

    $('#mainMenu').fadeOut();

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
