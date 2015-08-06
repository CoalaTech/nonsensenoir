/* global nsn: true, createjs: true */

nsn.Item = (function(){

  /*  Não está sendo usado no momento */

  function Item(imagePath, x, y, options){

    this.name = options.name || "Item";     /*  Nome de exibição  */
    this.pickable = options.pickable || false;  /*  Pode ser pego?  */
    this.dialogs = options.dialogs || {};   /*  Diálogos de interação */

    this.foreground = options.foreground || false; /*  Item sempre à frente da tela  */

    this.graphics = graphics;
    this.graphics.setPosition(x, y);
  }

  Item.prototype.click = function(listener){
    this.graphics.click(listener);
  };

  Item.prototype.width = function() {
    return this.bitmap.image.width;
  };

  Item.prototype.height = function() {
    return this.bitmap.image.height;
  };

  Item.prototype.position = function() {
    return {
          x: this.bitmap.image.x,
          y: this.bitmap.image.y
        };
  };

  Item.prototype.center = function() {
    return {
          x: this.bitmap.image.x + this.bitmap.image.width / 2,
          y: this.bitmap.image.y + this.bitmap.image.height / 2
        };
  };

  Item.prototype.clone = function() {
    /*  TODO  */
  };

  var defaultDialogs = {
    use: "Não sei como usar isso.",
    mouth: "Agora não, obrigado.",
    see: "Não sei o que é isso.",
    description: "Um item qualquer"
  };

  return Item;

})();
