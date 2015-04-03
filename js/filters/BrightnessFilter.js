/* global nsn: true, createjs: true */

/*
* BrightnessFilter
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Adapted from http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
* by Claudio Vinicius de Carvalho - 2013
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * @module EaselJS
 */

// namespace:
this.createjs = this.createjs||{};

(function() {
  "use strict";

var BrightnessFilter = function( adjustment ){
  this.initialize(adjustment);
};
var p = BrightnessFilter.prototype = new createjs.Filter();

// constructor:
  /** @ignore */
  p.initialize = function( adjustment ) {
    if( isNaN(adjustment) || adjustment < 0 ) adjustment = 100;
    this.adjustment = adjustment;
  };

// public properties:

  p.adjustment = 100;

// public methods:

  p.applyFilter = function(ctx, x, y, width, height, targetCtx, targetX, targetY) {
    targetCtx = targetCtx || ctx;
    if (!targetX) { targetX = x; }
    if (!targetY) { targetY = y; }
    var imageData, data, l,
      r, g, b, v;
    try {
      imageData = ctx.getImageData(x, y, width, height);
    } catch(e) {
      return false;
    }

    data = imageData.data;
    l = data.length;
    for (var i=0; i<l; i+=4) {
      data[i] += this.adjustment;
      data[i+1] += this.adjustment;
      data[i+2] += this.adjustment;
    }

    targetCtx.putImageData(imageData, targetX, targetY);
    return true;
  };

  /**
   * Returns a clone of this object.
   * @return {BrightnessFilter}
   **/
  p.clone = function() {
    return new BrightnessFilter(this.adjustment);
  };

  p.toString = function() {
    return "[BrightnessFilter]";
  };

  createjs.BrightnessFilter = BrightnessFilter;

}());
