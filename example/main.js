/* global views */
'use strict';
views.debug(true)
let Collection = window.collection.Collection.extend({
	comparator: 'title'
})
let collection = new Collection([{title:'title9', id:1},{title:'title2', id:2}]);

let view = new views.CollectionView({
	sort: true,
	collection: collection,
	childViewOptions: {
		template: function (data) {
			return data.title + " - id:" + data.id
		},
		triggers: {
			'click': 'click'
		}
	}
});

var count = 2
function add (collection,index) {
    
	collection.add({title: 'title' + (++count), id: count}, {at:index})
	//console.log(collection.toJSON())
}

function remove (collection,model) {
	collection.remove(model)
	//console.log(collection.toJSON())
}

var header = new views.View({
    template: function (data) {
        return '<h1>' + data.title + '</h1>';
    },
    model: {title: 'hello'},
    events: {
        'click': function () {
            this.el.style.backgroundColor = 'red';
        }   
    }
})

header.render().appendTo('body');

view.render().appendTo('body')

setTimeout(function () {
	add(collection)
	
}, 1000);

setTimeout(function () {
	remove(collection, collection.models[1])
	
}, 1500);

setTimeout(function () {
	add(collection, 0)
    
    collection.sort();
	
}, 2000);

view.on('childview:click', function () {
	console.log('I DID click', arguments[0])
});





document.querySelector('#add-btn').addEventListener('click', function () {
    view.collection.add({title: 'Hello title', id: ++count})
});

document.querySelector('#remove-btn').addEventListener('click', function () {
    var len = view.collection.length;
    var rnd = Math.floor(Math.random() * (len - 0)) 
    var model = view.collection.models[rnd ];
    view.collection.remove(model);
    
})