/*var collection = new .Collection([{
  title: 'title 1'
}, {
  title: 'title 2'
}, {
  title: 'title 3'
}]);*/

var collection = [{
  title: 'title 1'
}, {
    title: 'title 2'
  }, {
    title: 'title 3'
  }];

var Region = views.region,
  CollectionView = views.CollectionView,
  TemplateView = views.TemplateView;


describe('Collection View', function () {
  var region;

  beforeEach(function () {
    if (region) region.destroy();
    body = document.getElementsByTagName('body')[0];
    region = Region.buildRegion('body');
  });

  afterEach(function () {
    if (region) region.destroy();
  })

  describe('Rendering', function () {
    it('should render collection', function (done) {

      var view = new CollectionView({
        collection: collection
      });

     

      view.on('render:collection', function () {

        expect(view.children.length).toEqual(3, 'list length');
        // Wait for children to render
        setTimeout(function () {
          expect(view.el.children.length).toEqual(3, 'list size');
          
          done()  
        })
        
      });
      
       view.render();

    });

    it('should render childView', function (done) {
      var view = new CollectionView({
        collection: collection,
        childView: TemplateView.extend({
          template: function (data) {
            return data.title;
          }
        })
      });

      view.on('render:collection', function () {

        expect(view.children.length).toBe(3)

        for (var i = 0; i < view.el.children.length; i++) {
          var elm = view.el.children[i];
          expect(elm.innerText).toEqual("title " + (i + 1));
        }
        done()
      });

      view.render();

    });

    it('should pass options to childView', function (done) {
      var view = new CollectionView({
        collection: collection,
        childViewOptions: {
          template: function (data) {
            return data.title;
          }
        }
      });


      view.on('render:collection', function () {

        setTimeout(function () {
          for (var i = 0; i < view.el.children.length; i++) {
            var elm = view.el.children[i];
            expect(elm.innerText).toEqual("title " + (i + 1));
          }
          done()
        })

      });

      view.render();
    });

    xit('should trigger show event on childviews', function (done) {
      var beforeSpy = jasmine.createSpy('onBeforeShow');
      var showSpy = jasmine.createSpy('beforeShow');
      var view = new CollectionView({
        collection: collection,
        childView: TemplateView.extend({
          template: function (data) {
            return data.title;
          },
          onShow: showSpy,
          onBeforeShow: beforeSpy
        })

      });


      view.on('render:children', function () {

        setTimeout(function () {
          expect(showSpy.calls.count()).toEqual(view.collection.length, "show");
          expect(beforeSpy.calls.count()).toEqual(view.collection.length, "before:show");
          done()
        }, 200)

      });

      region.show(view);
    });
  });

  describe('events', function () {
    xit('should proxy childview events', function (done) {
      var view = new CollectionView({
        collection: collection,
        childView: TemplateView.extend({
          template: function (data) {
            return data.title;
          },
          triggers: {
            'click': 'click'
          }
        })

      });

      view.on('render:collection', function () {
        var spy = jasmine.createSpy('trigger');
        view.on('childview:click', spy)

        setTimeout(function () {

          view.children.forEach(function (item) {
            $(item.el).click();

          })

          expect(spy.calls.count()).toEqual(view.collection.length);
          done();

        });

      });
      region.show(view);
    });
  });

});
