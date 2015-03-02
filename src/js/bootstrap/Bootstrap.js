nsn.Bootstrap = function(){

  // TODO: Load from a JSON file
  this.manifest = [
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
    // {id: "maskAP", src:"./img/background/maskAP.png"},
    {id: "maskAP", src:"./img/background/maskAP.jpg"},
    // {id: "maskAP", src:"./img/background/mask2.jpg"},
    {id: "mask", src:"./img/background/mask.jpg"},
    {id: "balcony", src:"./img/background/balcony.jpg"},
    {id: "entradaSacada", src:"./img/props/entradaSacada.png"},
    {id: "saidaSacada", src:"./img/props/saidaSacada.png"},
    {id: "objHandlerSee", src:"./img/hud/olhos.png"},
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

  this.startingScreen = new nsn.StartingScreen();

};


nsn.Bootstrap.prototype.init = function(){

  var queue = new createjs.LoadQueue();

  queue.addEventListener("complete",

    function handleComplete() {

      var asset;
      for(var index in this.manifest){
        asset = this.manifest[index];
        Engine.assets[asset.id] = queue.getResult(asset.id);
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

}
