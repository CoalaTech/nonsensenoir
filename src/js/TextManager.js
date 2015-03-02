nsn.TextManager = function(){

  this._font = "35px Mouse Memoirs";

  this._textObject = this._createTextObject();

  this._isShowingDialog = false;

  this._nextLineOfText = "";

  this._linesCounter = 0;

  this.canvasContext = Engine.canvas.getContext("2d");

  this._defaultTimeout = 7000;

  this._currentTextTimeoutId = undefined;

  this._textLayer = new createjs.Container();

  this.textContainer = new createjs.Container();

  this.currentDeferred = undefined;

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

    this._textLayer.addEventListener('click', this.clearText.bind(this));

    nsn.listen(nsn.events.SCENE_CHANGED, this.hideText, this);
    nsn.listen(nsn.events.ON_MOUSE_OVER_HIGHLIGHT, this._onMouseOverHighlight, this);
    nsn.listen(nsn.events.ON_MOUSE_OUT_HIGHLIGHT, this._onMouseOutHighlight, this);
    nsn.listen(nsn.events.STOP_EVERYTHING, this.stopAllTexts, this);
    nsn.listen(nsn.events.ON_COMBINE, this.hideText, this);
    nsn.listen(nsn.events.ITEM_PICKED, this._handleItemPicked, this);
    nsn.listen(nsn.events.USE_ITEM_START, this._handleUseItemStart, this);
    nsn.listen(nsn.events.PLAYER_TALKING, this._handlePlayerTalk, this);
  },

  _setSkipTextOnKeypress: function (){

    nsn.DOMEvent.on(document, 'keypress', function(event){

      var keyCode = (event.keyCode ? event.keyCode : event.which);

      /* KeyCodes
       * spacebar = 32
       * period = 46
       */
      if (keyCode == 32 || keyCode == 46){
        this.clearText();
      }

    }.bind(this));

  },

  clearText: function(){

    this.hideText();

    if(this._nextLineOfText === ""){
      nsn.fire(nsn.events.TEXT_END);
      this.currentDeferred.resolve();
    }

  },

  hideText: function(){
    this._clearCurrentTextTimeout();
    this._textObject.text = "";
    this._isShowingDialog = false;
    this._textLayer.alpha = 0;
  },

  showText: function(text, customTimeout){

    var textBrokenInLines = this._splitTextInLines(text);
    var textWithLineBreaks = "";
    var textTimeout = customTimeout || this._defaultTimeout;

    if(this.currentDeferred && this.currentDeferred.promise._state != nsn.PromiseState.RESOLVED){
      this.currentDeferred.resolve();
    }
    this.currentDeferred = new nsn.Deferred();

    this.stopAllTexts();

    if(textBrokenInLines.length > 2){
      this._linesCounter = 0;
      this.loopToShowBigTexts(textBrokenInLines, textWithLineBreaks, textTimeout);
    }else{
      this._nextLineOfText = "";
      textWithLineBreaks = this._getTwoLinesOfText(textBrokenInLines, 0);
      this._isShowingDialog = true;
      this._renderText(textWithLineBreaks, textTimeout);
    }

    return this.currentDeferred.promise;

  },

  loopToShowBigTexts: function(textBrokenInLines, textWithLineBreaks, textTimeout){
    this.showTextTimeout = setTimeout(function () {

      if(!this.isShowingText()){

        textWithLineBreaks = this._getTwoLinesOfText(textBrokenInLines, this._linesCounter);

        this._nextLineOfText = textWithLineBreaks;

        this._isShowingDialog = true;

        this._renderText(textWithLineBreaks, textTimeout);
        this._linesCounter += 2;

        if (this._linesCounter < textBrokenInLines.length){
          this.loopToShowBigTexts(textBrokenInLines, textWithLineBreaks, textTimeout);
        }else{
          this._nextLineOfText = "";
        }

      }else{
        this.loopToShowBigTexts(textBrokenInLines, textWithLineBreaks, textTimeout);
      }

     }.bind(this), 100);
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

    this._clearCurrentTextTimeout();

    if(timeout && (timeout > 0)){
      this._currentTextTimeoutId = setTimeout(this.clearText.bind(this), timeout);
    }

  },

  _clearCurrentTextTimeout: function(){
    if(this._currentTextTimeoutId){
      clearTimeout(this._currentTextTimeoutId);
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
  },

  _onMouseOverHighlight: function(params){
    if(!this._isShowingDialog){
      this.showTextWithoutTimeout(params.text);
    }
  },

  _onMouseOutHighlight: function(params){
    if (!this._isShowingDialog){
      this.hideText();
    }

    if(params.text){
      this.showTextWithoutTimeout(params.text);
    }
  },

  _handleItemPicked: function(params){
    this.showText(params.text);
  },

  _handleUseItemStart: function(params){
    this.showTextWithoutTimeout(params.text);
  },

  _handlePlayerTalk: function(params){
    this.showText(params.text);
    this.currentDeferred.promise.then(function(){
      nsn.fire(nsn.events.PLAYER_SPEECH_TEXT_ENDED);
    });
  }

};

nsn.TextManager.prototype.constructor = nsn.TextManager;
