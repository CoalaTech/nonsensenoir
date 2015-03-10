nsn.GameEngine = function(){

  this.scenes = {};

  this.characters = {};

  this.backgrounds = {};

  this.assets = {};

  this.frameRate = 12;

  this.objectManager;

  this.init();

};

nsn.GameEngine.prototype = {

  init: function(){
    nsn.listen(nsn.events.STOP_EVERYTHING, this.stopEverything, this);
  },

  buildScenes: function(){
    this.objectManager = new nsn.ObjectManager();

    var scenes = this.assets["scenes.json"];
    nsn.each(scenes, function(name, config){
      this.buildScene(config);
    }.bind(this));
  },

  buildScene: function(config){
    var scene = new nsn.Scene();
    scene.jsonContent = config;

    scene.name = config.description;
    scene.showEffect = config.showEffect;
    scene.hideEffect = config.hideEffect;

    this.scenes[config.description] = scene;
  },

  buildCharacter: function(config){

    if(this.characters[config.name]){
      return this.characters[config.name];
    }

    var character;

    if(config.isPlayer){
      character = new nsn.Player(config);
      this.player = character;
    }else{
      character = new nsn.Character(config);
    }

    this.characters[config.name] = character;

    return character;
  },

  buildBackground: function(config){

    if(this.backgrounds[config.name]){
      return this.backgrounds[config.name];
    }

    var imageSrc = this.assets[config.source],
        image = new createjs.Bitmap(imageSrc);

    var background = new nsn.Background(config.name, image, config.matrix);

    this.backgrounds[config.name] = background;

    return background;

  },

  buildExit: function(config){
    var exit = new nsn.Exit(config);
  },

  setSceneAsCurrent: function(sceneName, exitObject){
    var scene = this.scenes[sceneName];

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
          characterConfig = this.assets['characters.json'][conf.name];
          character = this.buildCharacter(characterConfig);
          character.image.x = conf.startingX;
          character.image.y = conf.startingY;

          scene.addCharacter(character);
        }.bind(this)
      );

      var backgroundConfig = this.assets[config.Background.source];
      background = this.buildBackground(backgroundConfig);
      scene.addBackground(background);

      if(config.Objects){
        var objectsConfig = this.assets[config.Objects.source];
        var objects = this.objectManager.createObjects(objectsConfig);
        scene.addObjects(objects);
      }

      if(config.Exits){
        nsn.each(config.Exits, function(conf, index){
          exit = new nsn.Exit(conf);
          scene.addExit(exit);
        }.bind(this));
      }

      scene.loaded = true;
    }

    /*  O jogador está vindo de outra cena  */
    if(exitObject){
      var targetScene = scene.exits[exitObject.config.targetExit];

      this.player.image.x = targetScene.config.playerX;
      this.player.image.y = targetScene.config.playerY;
      // this.player.facing = exitObject.config.facingOnEnter;

      this.player.stop();
      scene.addCharacter(this.player);
    }

    nsn.fire(nsn.events.SCENE_CHANGED, {"from": this.currentScene ? this.currentScene.name : undefined, "to": sceneName});

    this.currentScene = scene;
    this.stage.setScene(scene);

    nsn.fire(nsn.events.ON_ACTION, {"type": "enter_scene", "target": sceneName});
  },

  widescreen: function(value){
    return this.currentScene.widescreen(value);
  },

  stopEverything: function() {
    this.player.resetAnimation();
    this.objectHandler.hideHUD();
  }

};

nsn.GameEngine.prototype.constructor = nsn.GameEngine;
