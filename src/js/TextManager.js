nsn.TextManager = function(){

  var self = {};

  self.textObject = null;
  var canvasContext = null;
  var timeout = 7000;

  var nextLineOfText = "";

  var currentDeferred;

  self.isShowingDialog = false;

  function init(){

    setSkipTextOnKeypress();

    var font = "35px Mouse Memoirs";
    self.textObject = new createjs.Text("", font, "#FFFFFF");
    self.textObject.x = 100;
    self.textObject.y = 545;
    self.textObject.textBaseline = "alphabetic";
    self.textObject.lineHeight = 30;
    self.textObject.shadow = new createjs.Shadow("#000000", 2, 2, 0);

    self.textLayer = new createjs.Container();

    var graphics = new createjs.Graphics();
    var shape = new createjs.Shape(graphics);
    graphics.beginFill("rgba(255,255,255,0.01)");
    // graphics.beginFill("rgba(0,0,255,0.5)");
    graphics.drawRect(0, 0, Engine.canvas.width, Engine.canvas.height);

    self.textLayer.addChild(shape);

    self.textLayer.alpha = 1;

    self.textContainer = new createjs.Container();
    self.textContainer.addChild(self.textLayer);
    self.textContainer.addChild(self.textObject);

    canvasContext = Engine.canvas.getContext("2d");
    canvasContext.font = font;

    self.textLayer.addEventListener('click', self.clearText);

    nsn.listen(nsn.events.SCENE_CHANGED, self.hideText);
  }

  function setSkipTextOnKeypress(){
    $(document).keypress(function(event){
      var keyCode = (event.keyCode ? event.keyCode : event.which);
      console.log(keyCode);

      /* KeyCodes
       *
       * spacebar = 32
       * period = 46
       *
       */
      if (keyCode == 32 || keyCode == 46){
        // self.hideText();
        self.clearText();
      }
    });
  }

  self.showText = function(text, customTimeout){
    var textBrokenInLines = splitTextInLines(text);
    var textWithLineBreaks = "";
    var textTimeout = customTimeout || timeout;

    if(currentDeferred && currentDeferred.promise().state() != "resolved"){
      currentDeferred.resolve();
    }
    currentDeferred = new $.Deferred();

    self.stopAllTexts();

    if(textBrokenInLines.length > 2){

      linesCounter = 0;

      //Obs: Esses loops devem pesar, não? Tem um igual no cara andando...
      (function loopToShowBigTexts () {
         self.showTextTimeout = setTimeout(function () {

          if(!self.isShowingText()){

            textWithLineBreaks = getTwoLinesOfText(textBrokenInLines, linesCounter);

            nextLineOfText = textWithLineBreaks;

            self.isShowingDialog = true;

            renderText(textWithLineBreaks, textTimeout);
            linesCounter += 2;

            if (linesCounter < textBrokenInLines.length){
              loopToShowBigTexts();
            }else{
              nextLineOfText = "";
            }

          }else{
            loopToShowBigTexts();
          }

         }, 100);
      })();

    }else{
      nextLineOfText = "";
      textWithLineBreaks = getTwoLinesOfText(textBrokenInLines, 0);
      self.isShowingDialog = true;
      renderText(textWithLineBreaks, textTimeout);
    }

    return currentDeferred.promise();

  };

  self.showTextWithoutTimeout = function(text){
    self.hideText();
    // self.clearText();
    renderText(text, 0);
    self.isShowingDialog = false;
  };

  var getTwoLinesOfText = function(textBrokenInLines, indexToStart){
    var textWithLineBreaks = "";

    var twoLinesCounter = 0;

    for (var i = indexToStart; twoLinesCounter < 2; i++) {

      phrase = textBrokenInLines[i];

      if (phrase !== undefined){
        textWithLineBreaks += phrase + "\n";
        twoLinesCounter++;
      }else{
        break;
      }

    }

    return textWithLineBreaks;
  };

  var renderText = function(text, timeout){
    if(self.isShowingDialog){
      self.textLayer.alpha = 1;
    }
    self.textObject.text = text;
    self.isShowingDialog = true;

    if(self.textTimeoutId){
      clearTimeout(self.textTimeoutId);
    }
    if(timeout && (timeout > 0)){
      // self.textTimeoutId = setTimeout(self.hideText.bind(this), timeout);
      self.textTimeoutId = setTimeout(self.clearText, timeout);
    }

  };

  self.clearText = function(){

    self.hideText();

    if(nextLineOfText === ""){
      console.log("Fim do texto.");
      nsn.fire(nsn.events.TEXT_END);
      currentDeferred.resolve();
    }

  };

  self.hideText = function(){
    self.textObject.text = "";
    self.isShowingDialog = false;
    self.textLayer.alpha = 0;
  };

  self.isShowingText = function(){
    if(self.textObject.text === ""){
      return false;
    }else{
      return true;
    }
  };

  self.stopAllTexts = function() {
    clearTimeout(self.showTextTimeout);
    self.hideText();
  };

  var splitTextInLines = function(text){
    var canvasWidth = Engine.canvas.width;
    var marginSpace = 2*self.textObject.x;
    var textAllowedSpace = canvasWidth - marginSpace;

    var textWords = text.split(" ");
    var textBrokenInLines = [];
    var line = "";
    var word = "";

    for (var i = 0; i < textWords.length; i++) {

      word = textWords[i];
      possiblePhrase = line + word + " ";

      if(canvasContext.measureText(possiblePhrase).width < textAllowedSpace){
        line += word + " ";
      }else{
        //Decrease index because the word of this iteration wasn't added to this line
        i--;
        textBrokenInLines.push(line);
        line = "";
      }

    }

    textBrokenInLines.push(line);

    return textBrokenInLines;
  };

  init();

  return self;

};
