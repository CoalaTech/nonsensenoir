/* global nsn: true, createjs: true */

/**
* @copyright    2014 CoalaTech.
*/
(nsn.SceneBuilder = {

  buildScenes: function(scenesConfiguration){
    // this.objectManager = new nsn.ObjectManager();

    // var scenes = this.assets["scenes.json"];
    var scenes = scenesConfiguration;

    nsn.each(scenes, function(name, config){
      this.buildScene(config);
    }.bind(this));

  },

  buildScene: function(config){

    var scene = new nsn.Scene();

    scene.config = config;

    scene.name = config.description;
    scene.showEffect = config.showEffect;
    scene.hideEffect = config.hideEffect;

    this.scenes[config.description] = scene;

  },

  initScene: function(scene){

    /*  A cena ainda nao foi construida  */
    if(!scene.loaded){

      var config = scene.config,
        characterConfig,
        character,
        background,
        exit;

      nsn.each(config.Characters, function(conf, index){

          character = Engine.getCharacter(conf.name);

          // Will it be necessary to reset the characters' properties each time?

          character.image.x = conf.startingX;
          character.image.y = conf.startingY;

          scene.addCharacter(character);

        }.bind(this)
      );

      background = Engine.getBackground(config.Background.name);

      scene.addBackground(background);

      if(config.Objects){
        var objectsConfig = this.assets[config.Objects.source];
        var objects = this.objectManager.createObjects(objectsConfig);
        scene.addObjects(objects);
      }

      if(config.Exits){
        nsn.each(config.Exits, function(conf, index){
          exit = Engine.buildExit(conf);
          scene.addExit(exit);
        });
      }

      scene.loaded = true;

    }

  }

})();