import type {PlainObject} from '@oscarpalmer/atoms/models';
import {setProxyValue} from '../helpers/value';
import {ReactiveObject} from './object';

/**
 * A reactive store
 */
export class Store<Model extends PlainObject> extends ReactiveObject<Model> {
	constructor(value: Model) {
		super(
			'store',
			new Proxy(value, {
				set: (target, property, value) =>
					setProxyValue(this as never, target, undefined, property, value),
			}),
		);
	}
}

/**
 * Creates a reactive store
 */
export function store<Model extends PlainObject>(value: Model): Store<Model> {
	return new Store(value);
}
