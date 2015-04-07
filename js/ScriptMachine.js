/* global nsn: true */

nsn.ScriptMachine = function(){

  this.map = {
    widescreen: nsn.Engine.widescreen,
    walk: nsn.Engine.player.walk,
    say: nsn.Engine.player.say,
    wait: this._wait,
    playSound: this._playSound
  };

  this.script = {
    see: {
      "sofa": [
        {
          calls: "widescreen",
          params: [true],
          scope: nsn.Engine
        }
      ]
    },
    enter_scene: {
      "Sacada": [
        {
          calls: "widescreen",
          params: [true],
          scope: nsn.Engine
        },
        {
          calls: "playSound",
          waitForMe: false
        },
        {
          /*  Isso vai falhar se o stage.scale for diferente de 1  */
          calls: "walk",
          params: [404, 557],
          scope: nsn.Engine.player
        },
        {
          calls: "wait",
          params: [1000]
        },
        {
          calls: "say",
          params: ["Oi, tia. O que é a merenda hoje?", 4000],
          scope: nsn.Engine.player
        },
        {
          calls: "widescreen",
          params: [false],
          /*  Se nao for especificado, a acao seguinte espera essa terminar  */
          waitForMe: false,
          scope: nsn.Engine
        }
      ]
    }
  };

  this.init();

};

nsn.ScriptMachine.prototype = {

  init: function(){
    nsn.listen(nsn.events.ON_ACTION, this._executeAction, this);
  },

  _executeAction: function(event){
    if(!this.script[event.type] || !this.script[event.type][event.target]){ return; }

    nsn.Engine.stage.disableInteraction();

    var actions = this.script[event.type][event.target];

    var currentAction = 0;

    var action = actions[currentAction];

    var nextAction = function(){
      currentAction++;
      action = actions[currentAction];
      if(action){
        promise = this.map[action.calls].apply(action.scope, action.params);
        if(action.waitForMe === false){
          nextAction();
        }else{
          promise.then(nextAction);
        }
      }else{
        nsn.Engine.stage.enableInteraction();
      }
    }.bind(this);

    var promise = this.map[action.calls].apply(action.scope, action.params);
    promise.then(nextAction);
  },

  _playSound: function(){
    var deferred = new nsn.Deferred();
    var timesPlayed = 0;

    var interval = setInterval(function(){
      timesPlayed++;
      if(timesPlayed === 3){
        clearInterval(interval);
        deferred.resolve();
      }
    }, 200);

    return deferred.promise;
  },

  _wait: function(timeout){
    timeout = timeout || 500;
    var deferred = new nsn.Deferred();

    setTimeout(function(){
      deferred.resolve();
    }, timeout);

    return deferred.promise;
  }

};

nsn.ScriptMachine.prototype.constructor = nsn.ScriptMachine;
