$(function(){

  var canvas,
    stage,
    scene,
    background,
    startButton;

  function initGame(){

    Engine.gameSound = new GameSound();

    var canvas = $("#canvas")[0];
    canvas.width = 997;
    canvas.height = 600;

    Engine.canvas = canvas;

    startButton = $('#startGameButton');

    Engine.stage = stage = new nsn.Stage();

    addEventListeners();

    loadManifest();


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
    startButton.click(
        function(){

          menuScreen.fadeOut();

          // Engine.gameSound.playSound(this.id, false);

          Engine.buildScenes();

          Engine.setSceneAsCurrent("Apartamento");
          // Engine.setSceneAsCurrent("Sacada");

          // Engine.stage.stage.update();

          // initStage();

          // stage.update();

          createObjectHandler();
          createObjectCombiner();

          createInventory();

          Engine.script = new nsn.ScriptMachine();

          // Descomentar para rodar a música do jogo
          // -1 quer dizer que o áudio fica em loop
          // Engine.gameSound.playSound("mainGameMusicShort", -1);

        }
      );

    startButton.css('display', 'none');

  }

  /*  Colocar na engine */
  // function buildScenes(scenes){
  //  // Engine.scenes = {};
  //  $.each(scenes, function(name, config){
  //    // Engine.scenes[name] = Engine.sceneFromJSON(config);
  //    Engine.sceneFromJSON(config);
  //  });

  //  /*  Deixar configuravel depois  */
  //  Engine.currentScene = Engine.scenes.Apartamento;
  //  Engine.stage.addChild(Engine.currentScene.container);
  // }

  // function initScene(json){

  //  // var scene = Engine.sceneFromJSON('./assets/json/scene1.json');
  //  var scene = Engine.sceneFromJSON(json);
  //  Engine.stage.addChild(scene.container);

  // }

  function loadManifest(){
    var scene1_manifest = [
      {id: "characters.json", src:"./json/characters.json"},
      {id: "scenes.json", src:"./json/scenes.json"},
      {id: "apartamento.json", src:"./json/apartamento.json"},
      {id: "sacada.json", src:"./json/sacada.json"},
      {id: "props.json", src:"./json/props.json"},
      {id: "empty.json", src:"./json/empty.json"},
      {id: "props_sacada.json", src:"./json/props_sacada.json"},
      {id: "player_sprite", src:"./img/character/player_sprite.png"},
      {id: "Dona", src:"./img/character/Dona.png"},
      {id: "scene2_2", src:"./img/background/scene2_2.jpg"},
      {id: "balcony", src:"./img/background/balcony.jpg"},
      {id: "entradaSacada", src:"./img/props/entradaSacada.png"},
      {id: "saidaSacada", src:"./img/props/saidaSacada.png"},
      {id: "objHandlerSee", src:"./img/hud/olhos.png"},
      // {id:"objHandlerPick", src:"./img/hud/pegar.png"},
      {id: "objHandlerUse", src:"./img/hud/mao.png"},
      {id: "objHandlerMouth", src:"./img/hud/boca.png"},
      {id: "inventoryBackground", src:"./img/hud/inventario_s.png"},
      {id: "openInventory", src:"./img/hud/icone_inventario.png"},
      {id: "closeInventory", src:"./img/hud/fechar_inventario.png"},
      {id: "slotInventory", src:"./img/hud/slot_inventario_2.png"},
      {id: "pinguim_s", src:"./img/props/pinguim_s.png"},
      {id: "jackers_s", src:"./img/props/jackers_s.png"},
      {id: "faca_s", src:"./img/props/faca_s.png"},
      {id: "sofa_s", src:"./img/props/sofa_s.png"},
      {id: "almofada_s", src:"./img/props/almofada_s.png"},
      {id: "revista_s", src:"./img/props/revista_s.png"},
      {id: "oculos_s", src:"./img/props/oculos_s.png"},
      {id: "tesoura_s", src:"./img/props/tesoura_s.png"},
      {id: "mesacentro", src:"./img/props/mesacentro.png"},
      {id: "tv", src:"./img/props/tv.png"},
      {id: "mesinha", src:"./img/props/mesinha.png"},
      {id: "relogio", src:"./img/props/relogio.png"},
      {id: "cavalo", src:"./img/props/cavalo.png"}
    ];

    Engine.loadManifest(scene1_manifest,
      function handleComplete() {
        startButton.css('display', 'block');
      }
    );
  }

  // function createCharacter(source, self){

  //  // character = new self.nsn.Player(source, 200, 200);
  //  character = new nsn.Player(source);

  //  Engine.player = character;

  //  comadre = new nsn.Character(Engine.assets["characters.json"][1]);

  // }

  function createObjectHandler(){
    Engine.objectHandler = new ObjectHandler();
  }

  function createObjectManager(){
    //TODO: Ele está sendo criado em outro lugar, pois está no nsn. Pode deletar isso aqui?
  }

  function createObjectCombiner(){
    Engine.objectCombiner = new ObjectCombiner();
  }

  function createInventory(){
    Engine.inventory = new Inventory();
  }

  window.onload = initGame;

});
