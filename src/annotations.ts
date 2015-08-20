import {utils} from './utils'
import {RegionMap} from './region-manager'

export function attributes(attrs:Object): ClassDecorator {
	return function <T extends Function>(target:T) {
		utils.extend(target.prototype, attrs)
	}
}
export function events(events:{[key:string]: string}): ClassDecorator {
	return function <T extends Function>(target:T) {
		target.prototype.events = events
	}
}

