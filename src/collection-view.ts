import {DataView,DataViewOptions} from './data-view'
import {IDataView, IModel,ICollection} from './types'
import {utils,extend} from './utils'

export interface CollectionViewOptions extends DataViewOptions {
	childView?: IDataView
	childViewContainer?: string
  childViewOptions?: DataViewOptions
}

class Buffer {
	children: IDataView[] = []
	buffer: DocumentFragment = document.createDocumentFragment()
	append(view:IDataView) {
		this.children.push(view)
		this.buffer.appendChild(view.el)
	}
}

export class CollectionView<T extends HTMLElement> extends DataView<T> {

	public childView: IDataView

	private _container: HTMLElement
	private _buffer: Buffer
	//private _options: CollectionViewOptions


  /** Child views associated with the view
   * @property {Array<IDataView>} children
   */
	public children: IDataView[]

  /** Whether the collection sould be sorted
   * @property {boolean} sort
   */
	public sort: boolean

	/** CollectionView
   * @extends DataView
   * @param {DataViewOptions} options
   */
	constructor (options?:CollectionViewOptions) {
    //this._options = options||{}
    this.children = []

    super(options)
	}

	/**
   * Render the collection view and alle of the children
   * @return {CollectionView}
   *
   */
	render (options?:any): any {

		this.destroyChildren()
		this._destroyContainer()

		super.render(options)

		this._initContainer()

		if (this.collection && this.collection.length) {

			this.renderCollection()
		}


		return this
	}

  /**
   * @protected
   */
	setCollection (collection) {
    super.setCollection(collection)
		this._delegateCollectionEvents()
	}


	renderCollection () {
		this.destroyChildren()
		if (this.collection.length != 0) {
			this.hideEmptyView()
			this._startBuffering()
			this._renderCollection()
			this._stopBuffering()

		} else {
			this.showEmptyView()
		}
	}

	/**
   * Returns a new instance of this.childView with attached model.
   *
   * @param {IModel} model
   * @protected
   */
	getChildView(model:IModel):IDataView {
		let View = this.getOption('childView') || DataView,
      options = this.getOption('childViewOptions') || {};

    return new View(utils.extend({
      model: model
    }, options));

	}

	renderChildView(view, index) {
		this.triggerMethod('before:render:child', view);

    view.render();

    this._attachHTML(view, index);

    this.triggerMethod('render:child', view);
	}

	showEmptyView () {

	}

	hideEmptyView () {

	}

	destroyChildren () {
		if (this._container) {
      this._container.innerHTML = '';

    }
    if (this.children.length === 0) return;

    this.children.forEach(this.removeChildView, this);
    this.children = []
	}

	removeChildView (view: IDataView) {
		if (!view) return;

    if (typeof view.destroy === 'function') {
      view.destroy();

    }
    if (typeof view.remove === 'function') {
      view.remove();
    }

    this.stopListening(view);
    //this.children.delete(view);
		this.children.splice(this.children.indexOf(view), 1)
    if (this.children.length === 0) {
      this.showEmptyView();
    }

    this._updateIndexes(view, false)
	}

	/**
   * Destroy the collection view and all of it's children
   * @see JaffaMVC.View
   * @return {JaffaMVC.View}
   */
  destroy () {
    this.triggerMethod('before:destroy:children');
    this.destroyChildren();
    this.triggerMethod('destroy:children');
    this.hideEmptyView()
		//if (this._emptyView) this.hideEmptyView();
    return super.destroy();

  }

	private _renderCollection () {
		this.triggerMethod('before:render:collection')
		this.collection.forEach((model) => {

			let view = this.getChildView(model)

			this._appendChild(view)
		})
		this.triggerMethod('render:collection')
	}

	/**
   * Append childview to the container
   * @private
   * @param {IDataView} view
   * @param {Number} index
   */
	private _appendChild (view: IDataView, index?: number) {
		this._updateIndexes(view, true, index);

    this._proxyChildViewEvents(view);

    this.children.push(view);

    this.hideEmptyView();

    this.renderChildView(view, index);

    this.triggerMethod('add:child', view);
	}

	/**
   * Attach the childview's element to the CollectionView.
   * When in buffer mode, the view is added to a documentfragment to optimize performance
   * @param {View} view  A view
   * @param {Number} index The index in which to insert the view
   * @private
   */
	private _attachHTML (view:IDataView, index: number) {
		if (this._buffer) {
      this._buffer.append(view)
    } else {
      //if (this._isShown) {
      //  utils.triggerMethodOn(view, 'before:show');
      //}


      if (!this._insertBefore(view, index)){
        this._insertAfter(view);
      }
      //if (this._isShown)
      //  utils.triggerMethodOn(view, 'show')
    }
	}

	/**
   * Proxy event froms childview to the collectionview
   * @param {IView} view
   * @private
   */
  private _proxyChildViewEvents (view) {
    let prefix = this.getOption('prefix') || 'childview';

    this.listenTo(view, 'all', function() {
      let args = utils.slice(arguments);

      args[0] = prefix + ':' + args[0];
      args.splice(1, 0, view);

      utils.call(this.triggerMethod, this, args);
    });

  }

	private _updateIndexes (view:IDataView, increment:boolean, index?:number) {
    if (!this.sort)
      return;
		this.children.forEach(function(lView) {
			if ((<any>lView)._index >= (<any>view)._index) {
				increment ? (<any>lView)._index++ : (<any>lView)._index--;
			}
		});
  }

	private _startBuffering () {
		this._buffer = new Buffer()
	}

	private _stopBuffering () {
		this._container.appendChild(this._buffer.buffer)
		delete this._buffer
	}

	private _initContainer () {
		var container = this.getOption('childViewContainer');
    if (container) {
      container = this.$(container)[0];
    } else {
      container = this.el;
    }
    this._container = container;
	}

	private _destroyContainer () {
    if (this._container)
      delete this._container;
	}

	/**
	 * Internal method. Check whether we need to insert the view into
   * the correct position.
	 * @param  {IView} childView [description]
	 * @param  {number} index     [description]
	 * @return {boolean}           [description]
	 */
  _insertBefore (childView:IDataView, index:number): boolean {
    let currentView;

    let findPosition = this.sort && (index < this.children.length - 1);
    if (findPosition) {
      // Find the view after this one
      currentView = utils.find(this.children, (view) => {
				return (<any>view)._index === index + 1;
			})
    }

    if (currentView) {
      this._container.insertBefore(childView.el, currentView.el);
      return true;
    }

    return false;
  }

	/**
	 * Internal method. Append a view to the end of the $el
	 * @private
	 */
  _insertAfter (childView: IDataView) {
    this._container.appendChild(childView.el);
  }

	/**
	 * Delegate collection events
	 * @private
	 */
	private _delegateCollectionEvents () {
		if (this.collection) {

      this.listenTo(this.collection, 'add', this._onCollectionAdd);
      this.listenTo(this.collection, 'remove', this._onCollectionRemove);
      this.listenTo(this.collection, 'reset', this.render);

      if (this.sort)
        this.listenTo(this.collection, 'sort', this._onCollectionSort);
    }
	}

  // Event handlers

  /**
   * Called when a model is add to the collection
   * @param {JaffaMVC.Model|Backbone.model} model Model
   * @private
   */
  private _onCollectionAdd (model) {
    let view = this.getChildView(model)
    let index = this.collection.indexOf(model);
    this._appendChild(view, index)
  }

  /**
   * Called when a model is removed from the collection
   * @param {JaffaMVC.Model|Backbone.model} model Model
   * @private
   */
  private _onCollectionRemove (model) {
    let view = utils.find(this.children, function(view) {
      return view.model === model;
    });

    this.removeChildView(view);
  }

	/**
	 * Called when the collection is sorted
	 * @private
	 */
	private _onCollectionSort () {

	}

}