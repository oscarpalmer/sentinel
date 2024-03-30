import type {ArrayOrPlainObject, PlainObject} from '@oscarpalmer/atoms/models';
import {ReactiveObject} from './object';
import {getProxyValue, setProxyValue} from '../helpers/value';

function proxy<Model extends ArrayOrPlainObject>(
	store: Store<PlainObject>,
	value: Model,
): Model {
	const isArray = Array.isArray(value);

	const proxied = new Proxy(isArray ? [] : {}, {
		get: (target, property) =>
			getProxyValue(store as never, target, property, isArray),
		set: (target, property, value) =>
			setProxyValue(
				store as never,
				target,
				property,
				value,
				undefined,
				proxy as never,
			),
	}) as Model;

	const keys = Object.keys(value);
	const {length} = keys;

	let index = 0;

	for (; index < length; index += 1) {
		const key = keys[index];

		proxied[key as never] = value[key as never];
	}

	return proxied;
}

/**
 * A reactive store
 */
export class Store<Model extends PlainObject> extends ReactiveObject<Model> {
	constructor(value: Model) {
		super({} as never);

		this.state.value = proxy(this as never, value);
	}
}

/**
 * Creates a reactive store
 */
export function store<Model extends PlainObject>(value: Model): Store<Model> {
	return new Store(value);
}
