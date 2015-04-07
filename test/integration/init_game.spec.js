/* global nsn: true, expect: true */

describe('main', function(){

  describe('initGame()', function(){
    it('creates nsn.Engine', function(){
      expect(nsn.Engine).not.to.be.null;
    });

    it('creates nsn.Stage', function(){
      expect(nsn.Engine.stage).not.to.be.null;
    });

    it('resizes screen');

    it('runs Bootstrap init');
  });

});
