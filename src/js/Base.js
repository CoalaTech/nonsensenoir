(function(){

  var listeners = {};

  nsn.events = {
    BACKGROUND_CLICKED: "background_clicked",
    PATH_FOUND: "path_found",
    SCENE_CHANGED: "scene_changed",
    INVENTORY_OPENED: "inventory_opened",
    INVENTORY_CLOSED: "inventory_closed",
    TEXT_END: "text_end",
    STOP_EVERYTHING: "stop_everything",

    ON_ACTION: "on_action",

    ON_MOUSE_OVER_HIGHLIGHT: "on_mouse_over_highlight",
    ON_MOUSE_OUT_HIGHLIGHT: "on_mouse_out_highlight",
    ON_COMBINE: "on_combine",
    ITEM_PICKED: "item_picked",
    USE_ITEM_START: "use_item_start",
    PLAYER_TALKING: "player_talking",
    PLAYER_SPEECH_TEXT_ENDED: "player_speech_text_ended"
  };

  nsn.cursors = {
    "default": "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAgCAYAAAD5VeO1AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAANPSURBVHjaYmZgYLgLxF+A+DwDlQFAAIHQNyD+D8TZ1DYYIICQDf8KxI7UNBgggJANB+F7QBxLLYMBAgjd8P+MjIyPgbQwNQwGCCCw4UAD/0tJSf1nZWWFWTIdKsdIicEAAcQEIlhYWBjk5OQYpKWlYeIZQLwYiO0oMRwggFhAxL9///7//v2bQVxcnPHdu3cMnz59AgnHADEfED8A4ofkGA4QQExQwxn//wcFNyODqqoqAx8fHwMTE1jKD4hLyXU5QACBTQAaDMfAcGfQ0dFhEBISgqkBpf9J5BgOEEBMMAbI1VBfgLGysjLYB1CQC8TzgViRFMMBAghuOMhAkAUgDPIBiNbQ0GDg5uaGKUkA4i3IeggBgADCcDkMgCxgZmYGpyIkC7SA+CwQexBjOEAAgQz/ATMMmYb5RkBAgEFbWxs5iAyAeA0Q6xAyHCCAQIazIwvAggXZAlDKUVNTY+Di4oJJgLxyGYhb8BkOEEDwYAEZADMUWxCBMhrIApBPkEA1EHfjMhwggJiQDcAHQPKcnJyMoEgWFRVFlioB4lVAzIyuByCAmGDlByylYLMIxkdOpvLy8uAIh4JQIG5ENxwggFCSInrKQQ4mWCaDsWVkZBgkJSXRg2gtsg8AAgg5WP6TkkH+/PnDICsryyAhIYEsHATEB2AFHkAAwQ0HepER5jqYq9EjFltKUlJSAgcTklobIO4AYnGAAEKJUORwx2YwMg0KbxD779+/2DxmCcTFAAHEgqQZFDKMuFwNEwMlWRANKpafP3/O8PbtW2RlT4D4GLQc2gEQQCzommFlDLI4yECYoa9fv2Z4+fIlw5cvX5ATwR8g3g3EiUD8EiYIEEAsuLwNVwDMPKDI+/jxI9iVb968QQ+CG0CcDzUcJVEABBALcrAiJz1YeD558gRs6NevX9Hj4AZQfSWQeQFaW2EAgABiQY80UET9+vUL7P3Hjx9ji7DdUJdeJ5RcAQIIZDg44EAGsrGxMdy7d4/hw4cPDN+/f0dW9xtaEs6DFlgvickLAAEEb7eAUgsw0v4jtWE+AvFJaMwbo2tCjxtsACCAMBpFUFcugpbXIrg0EWM4QAAhGw5q5W4EYjliNBFjOEAAwRpAU4CYn5SyhRjDAQIMAAvpMd3fLrDnAAAAAElFTkSuQmCC'), auto",
    "default_highlight": "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAgCAYAAAD5VeO1AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAOMSURBVHjaYmZgYLgLxF+A+DwDlQFAAIHQNyD+D8TZ1DYYIICQDf8KxI7UNBgggJANB+F7QBxLLYMBAgjd8P+MjIyPgbQwNQwGCCCw4czMzP+9vb3/s7CwwCyZDpVjpMRggABiApvAyMjg7+/P4ObmBhPPAOLFQGxHieEAAQQ2/N+/f/8/ffr038nJiUFCQgImFwPERUAsT67hAAEEM5zxz58/jMLCwgwlJSUMkpKSMHk/IC4l13CAAGJC5vz8+ZNBQECAoaamhkFVVRUmDEr/k8gxHCCAUAwHhf2vX78Y2NjYGAoLCxmUlZVhUrlAPB+IFUkxHCCAmNAFQBYAg4iBlZUVHERKSkowqQQg3oJNDy4AEEA4FYIs4OTkZHB0dGSQk5ODCWsB8Vkg9iDGcIAAAhn+A9nV////R2SAb98YbGxsGGpraxm0tLRgwgZAvAaIdQgZDhBAIMPZ0YMFZgGI/ePHDwZg5mLw8vICBRXMZm4gvgzELfgMBwggZiCuBmJWFxcXBg4ODrDBIEORwe/fv8HJU0dHB2QZ49OnT2FSoEzGA8S7sRkOEEBERQ7IMlAyVVRUZMzMzATHAxIoAeJVUIeiAIAAYoKVHyADYC5GDndkPsiC79+/M8TFxYGDCQmEAnEjuuEAAQR3OTCXorgU2VBYPMCCDGRJZGQkg5+fH7JZoOBdi+wDgABiQnXgf6LSL0jdly9fGIKDgxl8fX2RpYKA+ACswAMIICYk1zIiuxZbxKInVVAQhYSEMCQlJTEwMcGNsgHiDiAWBwggrDkUmcYlDkpZIABKquhqgcASiIsBAogFSfN/WORiczXMxaByB1i5MFy+fJlh+/btDNevX0f20RMgPgYth3YABBALsmaYImSDQXyQl2F54OTJkwz79u1juH37NrKaP9C0ngjEL2HiAAHEgi84QIZxcXGBi4HTp08zbNu2jeHBgwfoQXADiPOhhqOkCIAAYkEOVlhyA2V3EAYVXiADT5w4wfDo0SP0OLgBVFsJZF4A4gfYUhVAALGgC/Dx8TG8fPmS4cKFCwyrVq0Cp2k0sBvq0uuEkixAAIEM/wcrP0BBsnDhQnBkvXjxAqV4gZaE86AF1kti8gNAAMHbLaDmBVLTAoQ/AvFJaMwb40qy+ABAAGE0iqCuXAQtr0XwFWaEAEAAIRsOauVuBGI5YktKQgAggGANoClAzE9K5UuM4QABBgCvAjAb5bcwiAAAAABJRU5ErkJggg=='), auto",
    "exit": "url('data:image/png;base64,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'), auto"
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

  Function.prototype.implement = function(base){
    for(var func in base.prototype){
      this.prototype[func] = base.prototype[func];
    }
  };

  /** Adapted from underscore.js - http://underscorejs.org/underscore.js */
  nsn.each = function(obj, func, context){

    if (!obj) return obj;

    var i, length = obj.length;

    if (length === +length) {  /* It's an array */
      for (i = 0; i < length; i++) {
        func.call(context, obj[i], i, obj);
      }
    } else {  /* It's an object */
      var keys = Object.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        func.call(context, keys[i], obj[keys[i]], obj);
      }
    }
    return obj;

  };

  /* Based on John Resig's implementation at:
     http://ejohn.org/blog/flexible-javascript-events/
  */
  nsn.DOMEvent = {
    on: function( obj, type, fn ) {
      if ( obj.attachEvent ) {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function(){
          obj['e'+type+fn]( window.event );
        };
        obj.attachEvent( 'on'+type, obj[type+fn] );
      } else
        obj.addEventListener( type, fn, false );
    },
    off: function( obj, type, fn ) {
      if ( obj.detachEvent ) {
        obj.detachEvent( 'on'+type, obj[type+fn] );
        obj[type+fn] = null;
      } else
        obj.removeEventListener( type, fn, false );
    }
  };

  /* Facade for RSVP Promises */

  nsn.Promise = RSVP.Promise;
  nsn.Deferred = RSVP.defer;
  nsn.PromiseState = {
    PENDING: 0,
    RESOLVED: 1,
    REJECTED: 2
  };


})();
