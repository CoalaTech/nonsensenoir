/*
  Ao combinar dois itens:
  - Pode surgir um novo item
    - No inventário
    - Na tela
  - Pode tocar uma cutscene (disparar um sequencia de scripts)
  - Pode acontecer algo como sumir um item da tela sem gerar um novo
*/

var combinations = {
  "pinguim_jackers":{
    "combinable?" : true,
    "generates_another_item?" : true,
    "message": "Hum... é estranho mas pode funcionar!",
    "item" : {
        "name":"pinguim_jackers",
        "path":"pinguim_s",
        "x": 450,
        "y": 54,
        "pickable": true,
        "dialogs": {
          "use": "Tá na mão.",
          "mouth": "Sabe lá o que rola em cima dessa geladeira. Não vou por a boca nesse bicho.",
          "see": "Um pinguim vestido a caracter para uma festa em cima do refrigerador que nunca acontecerá. Que deprimente...",
          "description": "Um belo pinguim"
        },
        "inventory_dialogs" : {
          "see": "Minha grande combinação!",
        },
    },
    "target": {
        "name": "inventory",
        "parameters": {
        }
    }
  },
  "jackers_almofada":{
    "combinable?" : true,
    "generates_another_item?" : false,
    "message": "Já ouvi dizer que o Jackers tem poder corrosivo em almofadas. Vamos ver!",
    "target": {
      "name": "none",
    }
  },
  "jackers_faca":{
    "combinable?" : true,
    "generates_another_item?" : true,
    "message": "Já ouvi dizer que o Jackers jogado na faca gera um novo Jackers em seu local de origem. Vamos ver!",
    "item" : {
                "name":"jackers_faca",
                "path":"jackers_s",
                "x": 596,
                "y": 119,
                "pickable": true,
                "dialogs": {
                  "use": "Pegar um Jacker's eu vou.",
                  "mouth": "Só se for agora!",
                  "see": "Um jackers saboroso, apetitoso, lindo...",
                  "description": "Um pote de Jackers intacto"
                },
                "inventory_dialogs" : {
                  "see": "Item gerado maluco!",
                },
                "depth": 1
    },
    "target": {
        "name": "scene",
        "parameters": {
        }
    }
  },
  "pinguim_tv":{
    "combinable?" : false,
    "message": "Colocar o pinguim em cima da tv pra que? Pra ficar bonito? Eu lá tenho cara de decorador?"
  },
  "pinguim_tesoura":{
    "combinable?" : true,
    "generates_another_item?" : false,
    "run_script?" : true,
    "script_params" : {"type": "enter_scene", "target": "Sacada"},
    "message": "Não sou nenhum assassino de pinguins. Nem de brincadeira.",
    "target": {
      "name": "none",
    }
  }
};

nsn.ObjectCombiner = function(){

  var self = {};

  function init(){
    nsn.listen(nsn.events.FINISHED_USING_ITEM_IN_SCENE, hideObjectAfterUse, this);
    nsn.listen(nsn.events.FINISHED_COMBINE_ITEMS_FROM_INVENTORY, finishObjectCombination, this);
  }

  self.combine = function(source, target){
    nsn.fire(nsn.events.ON_COMBINE, {source: source, target: target});

    var combinationConfig = findCombinationConfig(source, target);
    var itemsWereCombined = combineItemsAccordingTo(combinationConfig, source, target);

    if(!itemsWereCombined){
      //TODO Shouldn't be handling inventory close
      closeInventory();
    }

    /* TODO Decide if we are going to dispatch this event here.
     * Here, the combination action didn't really finish yet. It only dispatched other
     * events to perform the combination.
     * If we really want to wait for the combination to finish, we need to move this
     * to function 'finishObjectCombination'.
     * It's here now because it's handling only the text show and it makes sense to
     * show the combination message concurrently with the combination action being performed.
     * Another option is to create another event only to handle the combination message, in case
     * we really need an event that guarantees the combination action has ended.
     */
    nsn.fire(nsn.events.FINISHED_ON_COMBINE, {combinationConfig: combinationConfig});
  };

  var findCombinationConfig = function(source, target){
    var combinationName = source.name + "_" + target.name;
    if(combinations[combinationName]){
      return combinations[combinationName];
    }else{
      combinationName = target.name + "_" + source.name;
      if(combinations[combinationName]){
        return combinations[combinationName];
      }
    }

    return null;
  };

  function combineItemsAccordingTo(combinationConfig, source, target){
    if(combinationConfig && combinationConfig["combinable?"]){
      /*
       * BUG1: como que faz quando se quer combinar um item que era pra ser combinado no inventory
       * na tela? Tipo usar o pinguim no Jackers no cenário mesmo. Vai gerar um item no inventario
       * do cara do nada. E do jeito que o código tá embaixo vai dar pau. Dá pra arrumar tranquilo,
       * mas enfim, acho que temos que organizar melhor.
       */

      var newItemAfterCombination;

      if(combinationConfig["generates_another_item?"]){
        newItemAfterCombination = generateCombinedItem(combinationConfig);
      }

      if (combinationConfig["target"]["name"] === "inventory") {
        // TODO We need to review these fadeouts
        createjs.Tween.get(source.group).to({alpha: 0}, 500);
        createjs.Tween.get(target.group).to({alpha: 0}, 500).call(function() {
          nsn.fire(nsn.events.COMBINING_ITEMS_FROM_INVENTORY, {source: source,
                                                               target: target,
                                                               newItem: newItemAfterCombination,
                                                               combinationConfig: combinationConfig});
        });
      }else{
        // TODO We need to review these fadeouts
        createjs.Tween.get(source.group).to({alpha: 0}, 300).call(function(){
          nsn.fire(nsn.events.USING_ITEM_IN_SCENE, {source: source,
                                                    target: target,
                                                    newItem: newItemAfterCombination,
                                                    combinationConfig: combinationConfig});
        });
      }

      return true;
    }

    return false;
  }

  var generateCombinedItem = function(combinationConfig){
    var newItemConfig = combinationConfig["item"];

    return Engine.objectManager.createObject(newItemConfig);
  };

  // TODO We need to review these fadeouts
  var hideObjectAfterUse = function(params){
    createjs.Tween.get(params.target).to({alpha: 0}, 500).call(function(){
      finishObjectCombination(params);
    });
  };

  var finishObjectCombination = function(params){
    if(params.combinationConfig["run_script?"]){
      runScript(params.combinationConfig);
    }
  }

  function runScript(combinationConfig) {
    var script_params = combinationConfig["script_params"];
    nsn.fire(nsn.events.ON_ACTION, script_params);
  }

  function closeInventory () {
    Engine.inventory.hideInventory(true);
    /*
     *TODO: poderíamos usar o promise pra esperar tocar a animação de fechar para ele falar depois, mas talvez o jogador
     *se irrite na hora que estiver agarrado e precisar ficar esperando esses segundinhos pra tentar
     *um tanto de combinação. Hehe. Ou não.
     */
  }

  init();

  return self;

};
