describe('Engine', function(){

  describe('prototype', function(){
    describe('init()', function(){

      it('creates GameSound', function(){
        expect(nsn.Engine.init).to.change(nsn.Engine, 'gameSound');
      });

      it('sets up the canvas element');
    });
  })

});
