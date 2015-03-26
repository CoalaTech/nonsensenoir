describe('Engine', function(){

  before(function(){
    nsn.GameSound = sinon.stub();
    nsn.Engine = new nsn.GameEngine();
  });

  describe('properties', function(){
    it('has frameRate', function(){
      expect(nsn.Engine).to.have.property('frameRate');
    });

    it('has scenes', function(){
      expect(nsn.Engine).to.have.property('scenes');
    });

    it('has characters', function(){
      expect(nsn.Engine).to.have.property('characters');
    });

    it('has backgrounds', function(){
      expect(nsn.Engine).to.have.property('backgrounds');
    });

    it('has assets', function(){
      expect(nsn.Engine).to.have.property('assets');
    });
  });



  describe('prototype', function(){
    it('has init()', function(){
      expect(nsn.Engine).to.respondTo('init');
    });
  });



  describe('initialization', function(){

    it('sets up the canvas', function(){

      expect(nsn.Engine).to.have.property('canvas');

      expect(nsn.Engine.canvas).to.be.an.instanceOf(Element);

      expect(nsn.Engine.canvas).to.have.property('width');
      expect(nsn.Engine.canvas).to.have.property('height');

    });

    it.skip('listens to nsn.events.GAME_STARTED', function(){

      nsn.fire(nsn.events.GAME_STARTED);

      expect(nsn.Engine).to.have.property('inventory');

    });

    it('listens to nsn.events.STOP_EVERYTHING', function(){

      expect(function(){
        nsn.fire(nsn.events.STOP_EVERYTHING)
      }).not.to.throw();

    });

  });

});
