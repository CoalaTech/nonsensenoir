var Engine = function(){

  var self = {};

  self.scenes = {};

  self.characters = {};

  self.backgrounds = {};

  self.assets = {};

  self.frameRate = 12;

  function init () {
    nsn.listen(nsn.events.STOP_EVERYTHING, self.stopEverything);
  }

  self.buildScenes = function(){
    self.objectManager = new nsn.ObjectManager();

    var scenes = Engine.assets["scenes.json"];
    nsn.each(scenes, function(name, config){
      self.buildScene(config);
    });

    /*  Deixar configuravel depois  */
    // self.currentScene = self.scenes.Apartamento;
    // self.currentScene = self.scenes.Sacada;
    // self.stage.addChild(self.currentScene.container);
  };

  self.buildScene = function(config){
    var scene = new nsn.Scene();
    scene.jsonContent = config;

    scene.name = config.description;
    scene.showEffect = config.showEffect;
    scene.hideEffect = config.hideEffect;

    self.scenes[config.description] = scene;
  };

  self.buildCharacter = function(config){

    if(self.characters[config.name]){
      return self.characters[config.name];
    }

    var character;

    if(config.isPlayer){
      character = new nsn.Player(config);
      self.player = character;
    }else{
      character = new nsn.Character(config);
    }

    self.characters[config.name] = character;

    return character;

  };

  self.buildBackground = function(config){

    if(self.backgrounds[config.name]){
      return self.backgrounds[config.name];
    }

    var imageSrc = Engine.assets[config.source],
        image = new createjs.Bitmap(imageSrc);

    var background = new nsn.Background(config.name, image, config.matrix);


    self.backgrounds[config.name] = background;

    return background;

  };

  self.buildExit = function(config){
    var exit = new nsn.Exit(config);
  };

  self.setSceneAsCurrent = function(sceneName, exitObject){
    var scene = self.scenes[sceneName];

    if(!scene){
      return;
    }

    /*  A cena ainda nao foi construida  */
    if(!scene.loaded){

      var config = scene.jsonContent,
        characterConfig,
        character,
        background,
        exit;

      nsn.each(config.Characters, function(conf, index){
          characterConfig = self.assets['characters.json'][conf.name];
          character = self.buildCharacter(characterConfig);
          character.image.x = conf.startingX;
          character.image.y = conf.startingY;

          scene.addCharacter(character);
        }.bind(this)
      );

      var backgroundConfig = self.assets[config.Background.source];
      background = self.buildBackground(backgroundConfig);
      scene.addBackground(background);

      if(config.Objects){
        var objectsConfig = self.assets[config.Objects.source];
        var objects = self.objectManager.createObjects(objectsConfig);
        scene.addObjects(objects);
      }

      if(config.Exits){
        nsn.each(config.Exits, function(conf, index){
          exit = new nsn.Exit(conf);
          scene.addExit(exit);
        });
      }

      scene.loaded = true;
      
    }

    /*  O jogador está vindo de outra cena  */
    if(exitObject){
      var targetScene = scene.exits[exitObject.config.targetExit];

      Engine.player.image.x = targetScene.config.playerX;
      Engine.player.image.y = targetScene.config.playerY;
      // Engine.player.facing = exitObject.config.facingOnEnter;

      Engine.player.stop();
      scene.addCharacter(Engine.player);
    }

    nsn.fire(nsn.events.SCENE_CHANGED, {"from": self.currentScene ? self.currentScene.name : undefined, "to": sceneName});

    self.currentScene = scene;
    self.stage.setScene(scene);

    nsn.fire(nsn.events.ON_ACTION, {"type": "enter_scene", "target": sceneName});
  };

  self.widescreen = function(value){
    return Engine.currentScene.widescreen(value);
  };

  self.stopEverything = function() {
    Engine.player.resetAnimation();
    Engine.objectHandler.hideHUD();
  };

  init();

  return self;

}();
