$(function(){

	var	canvas,
		stage,
		scene,
		background,
		startButton;

	function initGame(){

		Engine.gameSound = new GameSound();

		var canvas = $("#canvas")[0];
		canvas.width = 997;
		canvas.height = 600;

		Engine.canvas = canvas;

		startButton = $('#startGameButton');

		Engine.stage = stage = new nsn.Stage();

		addEventListeners();

		loadManifest();


		/*	Tentativa de redimensionar a tela	*/
		if(document.body.offsetWidth < canvas.width || document.body.offsetHeight < canvas.height){
			var ratioX = document.body.offsetWidth / canvas.width,
				ratioY = document.body.offsetHeight / canvas.height;

			var scale = Math.min(ratioX, ratioY);

			stage.stage.scaleX = stage.stage.scaleY = scale;
		}

	}

	function addEventListeners(){
		var menuScreen = $('#mainMenu');
		// var self = this;
		startButton.click(
				function(){

					menuScreen.fadeOut();

					// Engine.gameSound.playSound(this.id, false);

					Engine.buildScenes();

					Engine.setSceneAsCurrent("Apartamento");
					// Engine.setSceneAsCurrent("Sacada");

					// Engine.stage.stage.update();

					// initStage();

					// stage.update();

					createObjectHandler();
					createObjectCombiner();

					createInventory();

					Engine.script = new nsn.ScriptMachine();

					// Descomentar para rodar a música do jogo
					// -1 quer dizer que o áudio fica em loop
					// Engine.gameSound.playSound("mainGameMusicShort", -1);

				}
			);

		startButton.css('display', 'none');

	}

	/*	Colocar na engine	*/
	// function buildScenes(scenes){
	// 	// Engine.scenes = {};
	// 	$.each(scenes, function(name, config){
	// 		// Engine.scenes[name] = Engine.sceneFromJSON(config);
	// 		Engine.sceneFromJSON(config);
	// 	});

	// 	/*	Deixar configuravel depois	*/
	// 	Engine.currentScene = Engine.scenes.Apartamento;
	// 	Engine.stage.addChild(Engine.currentScene.container);
	// }

	// function initScene(json){

	// 	// var scene = Engine.sceneFromJSON('./assets/json/scene1.json');
	// 	var scene = Engine.sceneFromJSON(json);
	// 	Engine.stage.addChild(scene.container);

	// }

	function loadManifest(){
		var scene1_manifest = [
			{id: "characters.json", src:"./assets/json/characters.json"},
			{id: "scenes.json", src:"./assets/json/scenes.json"},
			{id: "apartamento.json", src:"./assets/json/apartamento.json"},
			{id: "sacada.json", src:"./assets/json/sacada.json"},
			{id: "props.json", src:"./assets/json/props.json"},
			{id: "empty.json", src:"./assets/json/empty.json"},
			{id: "props_sacada.json", src:"./assets/json/props_sacada.json"},
			{id: "player_sprite", src:"./assets/character/player_sprite.png"},
			{id: "Dona", src:"./assets/character/Dona.png"},
			{id: "scene2_2", src:"./assets/background/scene2_2.jpg"},
			{id: "balcony", src:"./assets/background/balcony.jpg"},
			{id: "entradaSacada", src:"./assets/props/entradaSacada.png"},
			{id: "saidaSacada", src:"./assets/props/saidaSacada.png"},
			{id: "objHandlerSee", src:"./assets/hud/olhos.png"},
			// {id:"objHandlerPick", src:"./assets/hud/pegar.png"},
			{id: "objHandlerUse", src:"./assets/hud/mao.png"},
			{id: "objHandlerMouth", src:"./assets/hud/boca.png"},
			{id: "inventoryBackground", src:"./assets/hud/inventario_s.png"},
			{id: "openInventory", src:"./assets/hud/icone_inventario.png"},
			{id: "closeInventory", src:"./assets/hud/fechar_inventario.png"},
			{id: "slotInventory", src:"./assets/hud/slot_inventario_2.png"},
			{id: "pinguim_s", src:"./assets/props/pinguim_s.png"},
			{id: "jackers_s", src:"./assets/props/jackers_s.png"},
			{id: "faca_s", src:"./assets/props/faca_s.png"},
			{id: "sofa_s", src:"./assets/props/sofa_s.png"},
			{id: "almofada_s", src:"./assets/props/almofada_s.png"},
			{id: "revista_s", src:"./assets/props/revista_s.png"},
			{id: "oculos_s", src:"./assets/props/oculos_s.png"},
			{id: "tesoura_s", src:"./assets/props/tesoura_s.png"},
			{id: "mesacentro", src:"./assets/props/mesacentro.png"},
			{id: "tv", src:"./assets/props/tv.png"},
			{id: "mesinha", src:"./assets/props/mesinha.png"},
			{id: "relogio", src:"./assets/props/relogio.png"},
			{id: "cavalo", src:"./assets/props/cavalo.png"}
		];

		Engine.loadManifest(scene1_manifest,
			function handleComplete() {
				startButton.css('display', 'block');
			}
		);
	}

	// function createCharacter(source, self){

	// 	// character = new self.nsn.Player(source, 200, 200);
	// 	character = new nsn.Player(source);

	// 	Engine.player = character;

	// 	comadre = new nsn.Character(Engine.assets["characters.json"][1]);

	// }

	function createObjectHandler(){
		Engine.objectHandler = new ObjectHandler();
	}

	function createObjectManager(){
		//TODO: Ele está sendo criado em outro lugar, pois está no nsn. Pode deletar isso aqui?
	}

	function createObjectCombiner(){
		Engine.objectCombiner = new ObjectCombiner();
	}

	function createInventory(){
		Engine.inventory = new Inventory();
	}



	function onDeviceReady() {
		//use AppMobi viewport to handle device resolution differences if you want
		//AppMobi.display.useViewport(768,1024);

		//hide splash screen now that our app is ready to run
		AppMobi.device.hideSplashScreen();

		initGame();
	}

	if(window.AppMobi !== undefined){
		//initial event handler to detect when appMobi is ready to roll
		document.addEventListener("appMobi.device.ready", onDeviceReady, false);
	}else{
		initGame();
	}

});