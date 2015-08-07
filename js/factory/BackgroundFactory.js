import Background from 'Background';

var _backgrounds = {};

export default class BackgroundFactory {

  static build(name, config) {

    if(_backgrounds[name]){
      return _backgrounds[name];
    }

    var imageSrc = nsn.Engine.assets[config.source],
        image = new createjs.Bitmap(imageSrc);

    var background = new Background(config.name, image, config.matrix);

    _backgrounds[name] = background;

  }

  static getBackground(name) {

    if(!_backgrounds[name]){
      var config = nsn.Engine.assets[`${name}.json`];
      BackgroundFactory.build(name, config);
    }

    return _backgrounds[name];

  }

}
