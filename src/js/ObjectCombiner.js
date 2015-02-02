/*
	Ao combinar dois itens:
	- Pode surgir um novo item
		- No inventário
		- Na tela
	- Pode tocar uma cutscene (disparar um sequencia de scripts)
	- Pode acontecer algo como sumir um item da tela sem gerar um novo
*/

var DEFAULT_COMBINATION_MESSAGE = "Porque eu faria algo tão non sense?";

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
		"message": "Já ouvi dizer que o Jackers jogado no faca gera um novo Jackers em seu local de origem. Vamos ver!",
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

var ObjectCombiner = function(){

	var self = {};

	function init(){

	}

	self.combine = function(source, target){
		Engine.textManager.hideText();
		Engine.inventory.itemSelected = null;

		var combinationConfig = findCombinationConfig(source, target);
		if(combinationConfig){
			combineItemsAccordingTo(combinationConfig, source, target);
		}else{
			closeInventory();
			showCombinationMessage(DEFAULT_COMBINATION_MESSAGE);
		}
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
		if(combinationConfig["combinable?"]){
			var removedItemsPromise = removeCombinedItems(combinationConfig, source, target)
																	.then(Engine.inventory.reorganizeItems);

			if(combinationConfig["generates_another_item?"]){
				removedItemsPromise.then(generateAnotherItem.bind(combinationConfig));
			}else if(combinationConfig["run_script?"]){
				removedItemsPromise.then(runScript.bind(combinationConfig));
			}
		}else{
			closeInventory();
		}
		showCombinationMessage(combinationConfig["message"]);
	}

	function removeCombinedItems(combinationConfig, source, target) {
		var deferred = new $.Deferred();

		/*
		 *BUG1: como que faz quando se quer combinar um item que era pra ser combinado no inventory
		 *na tela? Tipo usar o pinguim no Jackers no cenário mesmo. Vai gerar um item no inventario 
		 *do cara do nada. E do jeito que o código tá embaixo vai dar pau. Dá pra arrumar tranquilo, 
		 *mas enfim, acho que temos que organizar melhor.
		*/

		if (combinationConfig["target"]["name"] === "inventory") {
			createjs.Tween.get(source.group).to({alpha: 0}, 500);
			createjs.Tween.get(target.group).to({alpha: 0}, 500).call(function() {
				Engine.inventory.removeItem(source);
				Engine.inventory.removeItem(target);
				deferred.resolve();
			});
		}else{
			createjs.Tween.get(source.group).to({alpha: 0}, 300).call(function(){
				Engine.inventory.hideInventory();
				Engine.currentScene.player.useItem(target)
							.then(function(){
								createjs.Tween.get(target).to({alpha: 0}, 500).call(function() {
									Engine.inventory.removeItem(source);
									Engine.currentScene.removeObject(target);
									deferred.resolve();
								});
							});
			});
		}

		return deferred.promise();
	}

	var generateAnotherItem = function(){
		var combinationConfig = this;	/*	Foi chamado com um bind	*/
		var newItemConfig = combinationConfig["item"];
		var object = Engine.objectManager.createObject(newItemConfig);
		
		if (combinationConfig["target"]["name"] === "inventory") {
			Engine.inventory.addItem(object);
		}else{
			Engine.currentScene.addObject(object, newItemConfig.depth);
		}
	};

	var showCombinationMessage = function(message){
		Engine.player.say(message);
	};

	function runScript () {
		var combinationConfig = this; /*	Foi chamado com um bind	*/
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