(function(){

  window.nsn = {};

  var listeners = {};

  nsn.events = {
    BACKGROUND_CLICKED: "background_clicked",
    PATH_FOUND: "path_found",
    SCENE_CHANGED: "scene_changed",
    INVENTORY_OPENED: "inventory_opened",
    INVENTORY_CLOSED: "inventory_closed",
    TEXT_END: "text_end",
    STOP_EVERYTHING: "stop_everything",

    ON_ACTION: "on_action"
  };

  nsn.cursors = {
    "default": "url(../build/img/props/cursor.png), auto",
    "default_highlight": "url(../build/img/props/cursor_highlight.png), auto",
    "exit": "url(../build/img/props/cursor_exit.png), auto"
  };

  nsn.listen = function(eventName, callback, scope){
    if(!listeners[eventName]){
      listeners[eventName] = [];
    }
    listeners[eventName].push({callback: callback, scope: scope});
  };

  nsn.fire = function(eventName, eventObject){
    if(!listeners[eventName]){ return; }

    var callback;
    for (var i = listeners[eventName].length - 1; i >= 0; i--) {
      callback = listeners[eventName][i];
      callback.callback.call(callback.scope || this, eventObject);
    }
  };

  Function.prototype.extend = function(base, escope, args){
    escope.parent = base;
    base.apply(escope, args);
    // this.prototype = base.protoype;
    for(var func in base.prototype){
      this.prototype[func] = base.prototype[func];
    }
  };

})();
