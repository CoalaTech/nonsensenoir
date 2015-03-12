describe('Engine', function(){

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
  })

});
