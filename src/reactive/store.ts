import type {PlainObject} from '@oscarpalmer/atoms/models';
import {createProxy} from '../helpers/proxy';
import {ReactiveObject} from './object';

/**
 * A reactive store
 */
export class Store<Model extends PlainObject> extends ReactiveObject<Model> {
	constructor(value: Model) {
		super({} as never, false);

		this.state.value = createProxy(this as never, value);
	}
}

/**
 * Creates a reactive store
 */
export function store<Model extends PlainObject>(value: Model): Store<Model> {
	return new Store(value);
}
