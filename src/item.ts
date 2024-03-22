import type {PlainObject} from '@oscarpalmer/atoms/is';
import {setProxyValue} from './helpers';
import {ReactiveObject} from './reactive';

/**
 * A reactive item
 */
export class Item<Model extends PlainObject> extends ReactiveObject<Model> {
	constructor(value: Model) {
		super(
			new Proxy(value, {
				set: (target, property, value) =>
					setProxyValue(this as never, target, undefined, property, value),
			}),
		);
	}
}

/**
 * Creates a reactive item
 */
export function item<Model extends PlainObject>(value: Model): Item<Model> {
	return new Item(value);
}
