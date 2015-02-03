nsn.Background = function(){

  var self = {};

  var image, matrix,
    cellSize, grid, finder;

  self.init = function(imageSrc){
    if(imageSrc){
      buildBackground(imageSrc);

      addEventListeners();
    }
  };

  function buildBackground(imageSrc){

    self.component = new createjs.Container();

    image = new createjs.Bitmap(imageSrc);
    // image = new createjs.Bitmap(Engine.assets[imageSrc]);

    // image.cursor = "url(/nsn/assets/props/cursor.png), auto";

    matrix = self.properties.matrix;

    // cellSize = 1000 / matrix[0].length;
    // cellSize = parseInt(1000 / matrix[0].length * Engine.stage.stage.scaleX, 10);
    cellSize = 1000 / matrix[0].length * Engine.stage.stage.scaleX;
    Engine.cellSize = cellSize;
    grid = new PF.Grid(matrix[0].length, matrix.length, matrix);
    finder = new PF.AStarFinder({allowDiagonal: true, dontCrossCorners: true});
    // finder = new PF.BestFirstFinder({allowDiagonal: true, dontCrossCorners: true});

    // showWalkableAreas();

    self.component.addChildAt(image, 0);
    // self.component.addChildAt(image);

  }

  function addEventListeners(){

    // this.shape.addEventListener('click',
    image.addEventListener('click',
      function(evt){

        if (Engine.inventory.itemSelected){

          Engine.inventory.cancelUseItem();

        }else{

          // nsn.fire(nsn.events.BACKGROUND_CLICKED, {event: evt});
          nsn.fire(nsn.events.BACKGROUND_CLICKED, evt);

          // var pathObject = self.findPath(evt.stageX, evt.stageY);

          // nsn.fire(nsn.events.PATH_FOUND, pathObject);

          //Esse código apenas desloca a imagem do personagem sem animação
          //e desenha no chão os quadradinhos que ele está passando.
          //TODO: Apagar assim que não precisar testar mais.
          // pathGraphics.endFill();
          // pathGraphics.beginFill("rgba(256, 0, 0, 0.2)");
          // var currentNode = 1;
          // var walkInterval = window.setInterval(
          //  function(){
          //    Engine.player.image.x = path[currentNode][0] * cellSize + (cellSize / 2);
          //    Engine.player.image.y = path[currentNode][1] * cellSize + (cellSize / 2);

          //    pathGraphics.drawRect(path[currentNode][0] * cellSize,
          //                path[currentNode][1] * cellSize,
          //                cellSize,
          //                cellSize);

          //    currentNode++;
          //    if(currentNode == path.length){
          //      window.clearTimeout(walkInterval);
          //    }
          //  }.bind(this), 100
          // );

        }
      }
    );

  }

  self.findPath = function(x, y){

    var playerPos = Engine.player.position(),
      targetPos = [parseInt(x / cellSize, 10), parseInt(y / cellSize, 10)];

    console.log(targetPos);
    if(matrix[targetPos[1]][targetPos[0]] === 1){
      return;
    }

    if(matrix[playerPos[1]][playerPos[0]] === 1){
      return;
    }

    var path = finder.findPath(playerPos[0], playerPos[1],
                  targetPos[0], targetPos[1],
                  // grid.clone()
                  getUpdatedGrid()
                  );

    console.log(grid.clone());


    // if(path.length <= 2){
    if(path.length < 2){
      return;
    }

    var pathSmooth = PF.Util.smoothenPath(grid, path);

    // return pathSmooth;
    return {path: pathSmooth, cellSize: cellSize};

  };

  // self.simulateWalkTo = function(x, y){
  //  var evt = new createjs.Event('click', false, true);
  //  evt.stageX = x;
  //  evt.stageY = y;
  //  image.dispatchEvent(evt);
  // };

  function showWalkableAreas(){

    var graphics = new createjs.Graphics();
    var shape = new createjs.Shape(graphics);

    for (var x = 0; x < matrix[0].length; x++) {
      for (var y = 0; y < matrix.length; y++) {
        if(matrix[y][x] === 1){
          graphics.beginFill("rgba(255,0,0,0.5)");
        }else{
          graphics.beginFill("rgba(255,255,255,0.1)");
        }
        graphics.drawRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    self.component.addChild(shape);

    var pathGraphics = new createjs.Graphics().beginFill("#ff0000");
    var pathShape = new createjs.Shape(pathGraphics);
    self.component.addChild(pathShape);

  }

  /*
    Atualiza o grid com a posicao dos NPCs para que o personagem nao possa
    passar pro dentro de ninguem.
    TODO: Atualizar o grid apenas quando um NPC se mover
  */
  function getUpdatedGrid(){

    var updatedGrid = grid.clone(),
      position;

    $.each(Engine.characters,
      function(name, character){

        if(name != "Detetive"){

          position = character.position();

          for (var x = position[0] - 2; x < position[0] + 2; x++) {
            for (var y = position[1] - 2; y < position[1] + 2; y++) {
              if(x > 0 && y > 0){
                updatedGrid.setWalkableAt(x, y, false);
              }
            }
          }

        }

      }
    );

    return updatedGrid;

  }

  return self;

};
