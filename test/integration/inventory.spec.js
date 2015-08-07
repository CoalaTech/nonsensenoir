/* This should be a unit test.
 * The reason it's running as an integration test it's because
 * it depends on items being loaded. We should mock the items
 * and make it independent.
 */
describe('Inventory', function(){
  var subject, items,
      itemPinguim,
      itemFaca,
      itemJackers,
      addItemPinguim;

  before(function(){
    subject = nsn.Inventory;
    items = nsn.Engine.getCurrentScene().objects;

    itemPinguim = items.pinguim;
    itemFaca = items.faca;
    itemJackers = items.jackers;
  });

  describe('addItem', function(){
    before(function(){
      addItemPinguim = function(){
        subject.addItem(itemPinguim);
      }
    });

    afterEach(function(){
      subject.removeItem(subject._itemWithGroupMap.pinguim);
    });

    it('updates inventory items property', function(){
      expect(subject.items.pinguim).to.be.undefined
      addItemPinguim();
      expect(subject.items.pinguim).to.equal(itemPinguim);
    });

    it('adds an item to the inventory', function(){
      expect(addItemPinguim).to.increase(subject.itemsGroup.children, 'length');
      expect(subject.itemsGroup.children.length).to.equal(1);
    });

    it('updates the numItems property value by one', function(){
      expect(addItemPinguim).to.increase(subject, 'numItems');
      expect(subject.numItems).to.equal(1);
    });
  });

  describe('reorganizeItems', function(){
    var pinguimAddOrder = 0,
        facaAddOrder = 1,
        jackersAddOrder = 2;

    before(function(){
      subject.addItem(itemPinguim);
      subject.addItem(itemFaca);
      subject.addItem(itemJackers);
    });

    after(function(){
      subject.removeItem(subject._itemWithGroupMap.pinguim);
      subject.removeItem(subject._itemWithGroupMap.faca);
      subject.removeItem(subject._itemWithGroupMap.jackers);
    });

    context('when it is called with no changes in the items in inventory', function(){
      it('resets the items positions in inventory', function(){
        subject.reorganizeItems();
        checkIfItemsWereReorganized();
      });
    });

    context('after an item combination', function(){
      it('reorganizes items in inventory');
    });

    var checkIfItemsWereReorganized = function(){
      var pinguimGroupPosition = subject._calculateGroupPositionCoordinates(pinguimAddOrder);
      var facaGroupPosition = subject._calculateGroupPositionCoordinates(facaAddOrder);
      var jackersGroupPosition = subject._calculateGroupPositionCoordinates(jackersAddOrder);

      var pinguimGroup = subject._itemWithGroupMap[itemPinguim.name].group;
      var facaGroup = subject._itemWithGroupMap[itemFaca.name].group;
      var jackersGroup = subject._itemWithGroupMap[itemJackers.name].group;

      expect(pinguimGroup.x).to.equal(pinguimGroupPosition.x);
      expect(pinguimGroup.y).to.equal(pinguimGroupPosition.y);
      expect(facaGroup.x).to.equal(facaGroupPosition.x);
      expect(facaGroup.y).to.equal(facaGroupPosition.y);
      expect(jackersGroup.x).to.equal(jackersGroupPosition.x);
      expect(jackersGroup.y).to.equal(jackersGroupPosition.y);
    };
  });
});
