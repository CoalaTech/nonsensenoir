nsn.ScriptMachine = function(){

	var self = {};

	var map = {
		widescreen: Engine.widescreen,
		walk: Engine.player.walk,
		say: Engine.player.say,
		wait: wait,
		playSound: playSound
	};

	var script = {
		see: {
			"sofa": [
				{
					calls: "widescreen",
					params: [true]
				}
			]
		},
		enter_scene: {
			"Sacada": [
				{
					calls: "widescreen",
					params: [true]
				},
				{
					calls: "playSound",
					waitForMe: false
				},
				{
					/*	Isso vai falhar se o stage.scale for diferente de 1	*/
					calls: "walk",
					params: [404, 557],
					scope: Engine.player
				},
				{
					calls: "wait",
					params: [1000]
				},
				{
					calls: "say",
					params: ["Oi, tia. O que é a merenda hoje?", 4000],
					scope: Engine.player
				},
				{
					calls: "widescreen",
					params: [false],
					/*	Se nao for especificado, a acao seguinte espera essa terminar	*/
					waitForMe: false
				}
			]
		}
	};

	function init(){
		nsn.listen(nsn.events.ON_ACTION, executeAction, this);
	}

	function executeAction(event){
		if(!script[event.type] || !script[event.type][event.target]){ return; }

		Engine.stage.disableInteraction();

		var actions = script[event.type][event.target];

		var currentAction = 0;

		var action = actions[currentAction];

		var nextAction = function(){
			currentAction++;
			action = actions[currentAction];
			if(action){
				promise = map[action.calls].apply(action.scope, action.params);
				if(action.waitForMe === false){
					nextAction();
				}else{
					promise.then(nextAction);
				}
			}else{
				Engine.stage.enableInteraction();
			}
		};

		var promise = map[action.calls].apply(action.scope, action.params);
		promise.then(nextAction);
	}

	function logAction(){
		console.log("Dentro de logAction");
	}

	function playSound(){
		var deferred = new $.Deferred();
		var timesPlayed = 0;

		var interval = setInterval(function(){
			console.log("La la la laaa laalala la la...");
			timesPlayed++;
			if(timesPlayed == 3){
				clearInterval(interval);
				deferred.resolve();
			}
		}, 200);

		return deferred.promise();
	}

	function wait(timeout){
		timeout = timeout || 500;
		var deferred = new $.Deferred();

		setTimeout(function(){
			deferred.resolve();
		}, timeout);

		return deferred.promise();
	}

	init();

	return self;

};