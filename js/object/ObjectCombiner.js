/* global nsn: true, createjs: true */

/*
  Ao combinar dois itens:
  - Pode surgir um novo item
    - No inventário
    - Na tela
  - Pode tocar uma cutscene (disparar um sequencia de scripts)
  - Pode acontecer algo como sumir um item da tela sem gerar um novo
*/

nsn.ObjectCombiner = function(){

  this.combinations = this._setupCombinations();

  this.init();
};

nsn.ObjectCombiner.prototype = {

  init: function(){
    nsn.listen(nsn.events.FINISHED_USING_ITEM_IN_SCENE, this._hideObjectAfterUse, this);
    nsn.listen(nsn.events.FINISHED_COMBINE_ITEMS_FROM_INVENTORY, this._finishObjectCombination, this);
  },

  _setupCombinations: function(){
    return nsn.Engine.assets["objectCombinations.json"];
  },

  combine: function(source, target){
    nsn.fire(nsn.events.ON_COMBINE, {source: source, target: target});

    var combinationConfig = this._findCombinationConfig(source, target);
    var itemsWereCombined = this._combineItemsAccordingTo(combinationConfig, source, target);

    /* TODO Decide if we are going to dispatch this event here.
     * Here, the combination action didn't really finish yet. It only dispatched other
     * events to perform the combination.
     * If we really want to wait for the combination to finish, we need to move this
     * to function 'this._finishObjectCombination'.
     * It's here now because it's handling only the text show and it makes sense to
     * show the combination message concurrently with the combination action being performed.
     * Another option is to create another event only to handle the combination message, in case
     * we really need an event that guarantees the combination action has ended.
     */
    nsn.fire(nsn.events.FINISHED_ON_COMBINE, {combinationConfig: combinationConfig,
                                              itemsWereCombined: itemsWereCombined});
  },

  _findCombinationConfig: function(source, target){
    var combinationName = source.name + "_" + target.name;
    if(this.combinations[combinationName]){
      return this.combinations[combinationName];
    }else{
      combinationName = target.name + "_" + source.name;
      if(this.combinations[combinationName]){
        return this.combinations[combinationName];
      }
    }

    return null;
  },

  _combineItemsAccordingTo: function(combinationConfig, source, target){
    if(combinationConfig && combinationConfig["combinable?"]){
      /*
       * BUG1: como que faz quando se quer combinar um item que era pra ser combinado no inventory
       * na tela? Tipo usar o pinguim no Jackers no cenário mesmo. Vai gerar um item no inventario
       * do cara do nada. E do jeito que o código tá embaixo vai dar pau. Dá pra arrumar tranquilo,
       * mas enfim, acho que temos que organizar melhor.
       */

      var newItemAfterCombination;

      if(combinationConfig["generates_another_item?"]){
        newItemAfterCombination = this._generateCombinedItem(combinationConfig);
      }

      if (combinationConfig.target.name === "inventory") {
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
  },

  _generateCombinedItem: function(combinationConfig){
    var newItemConfig = combinationConfig.item;

    return nsn.Engine.objectManager.createObject(newItemConfig);
  },

  // TODO We need to review these fadeouts
  _hideObjectAfterUse: function(params){
    createjs.Tween.get(params.target).to({alpha: 0}, 500)
      .call(this._finishObjectCombination, [params], this);
  },

  _finishObjectCombination: function(params){
    if(params.combinationConfig["run_script?"]){
      this._runScript(params.combinationConfig);
    }
  },

  _runScript: function(combinationConfig) {
    var script_params = combinationConfig.script_params;
    nsn.fire(nsn.events.ON_ACTION, script_params);
  }

};

nsn.ObjectCombiner.prototype.constructor = nsn.ObjectCombiner;
