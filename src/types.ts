import {IEventEmitter} from './events'

export interface IModel extends IEventEmitter {
	get(key: string, value: any)
	set(key: string): any
	toJSON(): any
}

export interface ICollection extends IEventEmitter {
	length: number
}