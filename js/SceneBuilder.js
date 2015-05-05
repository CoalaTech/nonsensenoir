/* global nsn: true, createjs: true */

/**
* @copyright    2014 CoalaTech.
*/
(function(){

  var scenes = {};

  nsn.SceneBuilder = {

    getScene: function(name){

      var scene = scenes[name];

      if(scene){

        /* The whole point of calling getScene is to get a loaded scene
           with characters, objects and exits instantiated and in place. */
        this.initScene(scene);

        return scene;

      }

      throw new Error('No scene called ' + name + ' found');

    },

    buildScenes: function(scenesConfiguration){

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

      scenes[config.description] = scene;

    },

    initScene: function(scene){

      /* The scene hasn't been built yet */
      if(!scene.loaded){

        var config = scene.config,
          characterConfig,
          character,
          background,
          exit;

        nsn.each(config.Characters, function(conf, index){

            character = nsn.Engine.getCharacter(conf.name);

            character.image.x = conf.startingX;
            character.image.y = conf.startingY;

            scene.addCharacter(character);

          }
        );

        background = nsn.Engine.getBackground(config.Background.name);

        scene.addBackground(background);

        /* TODO Refactor me!!! Lets use the objectManager wisely (and Engine.assets, as well) */
        if(config.Objects){
          var objectsConfig = nsn.Engine.assets[config.Objects.source];
          var objects = nsn.Engine.objectManager.createObjects(objectsConfig);
          scene.addObjects(objects);
        }

        if(config.Exits){
          nsn.each(config.Exits, function(conf, index){
            exit = nsn.Engine.buildExit(conf);
            scene.addExit(exit);
          });
        }

        scene.loaded = true;

      }

    }

  };

  nsn.listen(nsn.events.ASSETS_LOADED, function(){

    nsn.SceneBuilder.buildScenes(nsn.Engine.assets["scenes.json"]);

    this.setSceneAsCurrent("Apartamento");

  }, this, true);

})();
