/* global nsn: true, createjs: true */

nsn.Bootstrap = function(){

  // TODO: Load from a JSON file
  this.manifest = [
    {id: "characters.json", src: nsn.ASSETS_PATH + "json/characters.json"},
    {id: "scenes.json", src: nsn.ASSETS_PATH + "json/scenes.json"},
    {id: "apartamento.json", src: nsn.ASSETS_PATH + "json/apartamento.json"},
    {id: "sacada.json", src: nsn.ASSETS_PATH + "json/sacada.json"},
    {id: "props.json", src: nsn.ASSETS_PATH + "json/props.json"},
    {id: "empty.json", src: nsn.ASSETS_PATH + "json/empty.json"},
    {id: "props_sacada.json", src: nsn.ASSETS_PATH + "json/props_sacada.json"},
    {id: "objectCombinations.json", src: nsn.ASSETS_PATH + "json/objectCombinations.json"},
    {id: "player_sprite", src: nsn.ASSETS_PATH + "img/character/player_sprite.png"},
    {id: "Dona", src: nsn.ASSETS_PATH + "img/character/Dona.png"},
    {id: "scene2_2", src: nsn.ASSETS_PATH + "img/background/scene2_2.jpg"},
    {id: "balcony", src: nsn.ASSETS_PATH + "img/background/balcony.jpg"},
    {id: "entradaSacada", src: nsn.ASSETS_PATH + "img/props/entradaSacada.png"},
    {id: "saidaSacada", src: nsn.ASSETS_PATH + "img/props/saidaSacada.png"},
    {id: "objHandlerSee", src: nsn.ASSETS_PATH + "img/hud/olhos.png"},
    {id: "objHandlerUse", src: nsn.ASSETS_PATH + "img/hud/mao.png"},
    {id: "objHandlerMouth", src: nsn.ASSETS_PATH + "img/hud/boca.png"},
    {id: "inventoryBackground", src: nsn.ASSETS_PATH + "img/hud/inventario_s.png"},
    {id: "openInventory", src: nsn.ASSETS_PATH + "img/hud/icone_inventario.png"},
    {id: "closeInventory", src: nsn.ASSETS_PATH + "img/hud/fechar_inventario.png"},
    {id: "slotInventory", src: nsn.ASSETS_PATH + "img/hud/slot_inventario_2.png"},
    {id: "pinguim_s", src: nsn.ASSETS_PATH + "img/props/pinguim_s.png"},
    {id: "jackers_s", src: nsn.ASSETS_PATH + "img/props/jackers_s.png"},
    {id: "faca_s", src: nsn.ASSETS_PATH + "img/props/faca_s.png"},
    {id: "sofa_s", src: nsn.ASSETS_PATH + "img/props/sofa_s.png"},
    {id: "almofada_s", src: nsn.ASSETS_PATH + "img/props/almofada_s.png"},
    {id: "revista_s", src: nsn.ASSETS_PATH + "img/props/revista_s.png"},
    {id: "oculos_s", src: nsn.ASSETS_PATH + "img/props/oculos_s.png"},
    {id: "tesoura_s", src: nsn.ASSETS_PATH + "img/props/tesoura_s.png"},
    {id: "mesacentro", src: nsn.ASSETS_PATH + "img/props/mesacentro.png"},
    {id: "tv", src: nsn.ASSETS_PATH + "img/props/tv.png"},
    {id: "mesinha", src: nsn.ASSETS_PATH + "img/props/mesinha.png"},
    {id: "relogio", src: nsn.ASSETS_PATH + "img/props/relogio.png"},
    {id: "cavalo", src: nsn.ASSETS_PATH + "img/props/cavalo.png"}
  ];

  this.startingScreen = new nsn.StartingScreen();

};


nsn.Bootstrap.prototype.init = function(){

  var queue = new createjs.LoadQueue();

  queue.addEventListener("complete",

    function handleComplete() {

      var asset;
      for(var index in this.manifest){
        asset = this.manifest[index];
        nsn.Engine.assets[asset.id] = queue.getResult(asset.id);
      }

      nsn.fire(nsn.events.ASSETS_LOADED);

    }.bind(this)

  );

  queue.addEventListener("progress",

    function(e){

      this.startingScreen.step(e.loaded);

    }.bind(this)

  );

  queue.loadManifest(this.manifest);

};
