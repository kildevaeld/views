/*global View, RegionManager, Region*/
import {TemplateView} from './templateview'
import {RegionManager, RegionMap} from './region-manager'
import {utils} from './utils'
import {Region} from './region'

class LayoutView<T extends HTMLElement> extends TemplateView<T> {
  
	private _regionManager: RegionManager
	
	public get regions (): RegionMap {
		return this._regionManager.regions
	}
	
	/**
	 * LayoutView
	 * @param {Object} options options
	 * @constructor LayoutView
	 * @memberof JaffaMVC
	 * @augments JaffaMVC.View
	 */
	constructor (options) {
		//this.options = options || {};
		let regions = this.getOption('regions');

		// Set region manager
		this._regionManager = new RegionManager();
		utils.proxy(this, this._regionManager, ['removeRegion', 'removeRegions']);
		

		//this.options = options || {};

		this.listenTo(this, 'render', function() {
			this.addRegions(regions);
		});

		super(options);

	}

  addRegion (name, def) {
		if (typeof def === 'string') {
			let elm = this.$(def);
			if (!elm)
				throw new Error('element must exists in dom');

			def = new Region({
				el: elm[0]
			});

	  }
		this._regionManager.addRegion(name, def);

	}

	addRegions (regions) {
			for (var k in regions) {
				this.addRegion(k, regions[k]);
			}
	}

  destroy () {
		super.destroy();
		this._regionManager.destroy();
	}



}
