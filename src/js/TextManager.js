nsn.TextManager = function(){

  this._font = "35px Mouse Memoirs";

  this._textObject = this._createTextObject();

  this._isShowingDialog = false;

  this._nextLineOfText = "";

  this.canvasContext = Engine.canvas.getContext("2d");

  this._defaultTimeout = 7000;

  this._textLayer = new createjs.Container();

  this.textContainer = new createjs.Container();

  this.currentDeferred;

  this.init();

};

nsn.TextManager.prototype = {

  init: function(){

    this._setSkipTextOnKeypress();

    var graphics = new createjs.Graphics();
    var shape = new createjs.Shape(graphics);
    graphics.beginFill("rgba(255,255,255,0.01)");
    graphics.drawRect(0, 0, Engine.canvas.width, Engine.canvas.height);

    this._textLayer.addChild(shape);

    this._textLayer.alpha = 1;

    this.textContainer.addChild(this._textLayer);
    this.textContainer.addChild(this._textObject);

    this.canvasContext.font = this._font;

    this._textLayer.addEventListener('click', this.clearText);

    nsn.listen(nsn.events.SCENE_CHANGED, this.hideText);
  },

  _setSkipTextOnKeypress: function (){
    $(document).keypress(function(event){
      var keyCode = (event.keyCode ? event.keyCode : event.which);

      /* KeyCodes
       *
       * spacebar = 32
       * period = 46
       *
       */
      if (keyCode == 32 || keyCode == 46){
        this.clearText();
      }
    });
  },

  clearText: function(){

    this.hideText();

    if(this._nextLineOfText === ""){
      nsn.fire(nsn.events.TEXT_END);
      this.currentDeferred.resolve();
    }

  },

  hideText: function(){
    this._textObject.text = "";
    this._isShowingDialog = false;
    this._textLayer.alpha = 0;
  },

  showText: function(text, customTimeout){
    var textBrokenInLines = this._splitTextInLines(text);
    var textWithLineBreaks = "";
    var textTimeout = customTimeout || _defaultTimeout;

    if(this.currentDeferred && this.currentDeferred.promise().state() != "resolved"){
      this.currentDeferred.resolve();
    }
    this.currentDeferred = new $.Deferred();

    this.stopAllTexts();

    if(textBrokenInLines.length > 2){

      linesCounter = 0;

      //Obs: Esses loops devem pesar, não? Tem um igual no cara andando...
      (function loopToShowBigTexts () {
         this.showTextTimeout = setTimeout(function () {

          if(!this.isShowingText()){

            textWithLineBreaks = this._getTwoLinesOfText(textBrokenInLines, linesCounter);

            this._nextLineOfText = textWithLineBreaks;

            this._isShowingDialog = true;

            this._renderText(textWithLineBreaks, textTimeout);
            linesCounter += 2;

            if (linesCounter < textBrokenInLines.length){
              loopToShowBigTexts();
            }else{
              this._nextLineOfText = "";
            }

          }else{
            loopToShowBigTexts();
          }

         }, 100);
      })(this);

    }else{
      this._nextLineOfText = "";
      textWithLineBreaks = this._getTwoLinesOfText(textBrokenInLines, 0);
      this._isShowingDialog = true;
      this._renderText(textWithLineBreaks, textTimeout);
    }

    return this.currentDeferred.promise();

  },

  showTextWithoutTimeout: function(text){
    this.hideText();
    this._renderText(text, 0);
    this._isShowingDialog = false;
  },

  _renderText: function(text, timeout){
    if(this._isShowingDialog){
      this._textLayer.alpha = 1;
    }
    this._textObject.text = text;
    this._isShowingDialog = true;

    if(textTimeoutId){
      clearTimeout(textTimeoutId);
    }

    if(timeout && (timeout > 0)){
      var textTimeoutId = setTimeout(this.clearText, timeout);
    }

  },

  stopAllTexts: function() {
    clearTimeout(this.showTextTimeout);
    this.hideText();
  },

  _getTwoLinesOfText: function(textBrokenInLines, indexToStart){
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
  },

  isShowingText: function(){
    if(this._textObject.text === ""){
      return false;
    }else{
      return true;
    }
  },

  _splitTextInLines: function(text){
    var canvasWidth = Engine.canvas.width;
    var marginSpace = 2 * this._textObject.x;
    var textAllowedSpace = canvasWidth - marginSpace;

    var textWords = text.split(" ");
    var textBrokenInLines = [];
    var line = "";
    var word = "";

    for (var i = 0; i < textWords.length; i++) {

      word = textWords[i];
      possiblePhrase = line + word + " ";

      if(this.canvasContext.measureText(possiblePhrase).width < textAllowedSpace){
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
  },

  _createTextObject: function(){
    var _textObject = new createjs.Text("", this._font, "#FFFFFF");
    _textObject.x = 100;
    _textObject.y = 545;
    _textObject.textBaseline = "alphabetic";
    _textObject.lineHeight = 30;
    _textObject.shadow = new createjs.Shadow("#000000", 2, 2, 0);

    return _textObject;
  }
};

nsn.TextManager.prototype.constructor = nsn.TextManager;
