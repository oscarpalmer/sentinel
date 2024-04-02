import {isPlainObject} from '@oscarpalmer/atoms/is';
import type {PlainObject} from '@oscarpalmer/atoms/models';
import {isReactive} from '../helpers/is';
import type {Computed, List, Signal, Store} from '../models';
import {computed} from './computed';
import {list} from './list';
import {signal} from './signal';
import {store} from './store';

type Primitive = boolean | number | string;

/**
 * Creates a reactive list
 */
export function reactive<Model extends unknown[]>(value: Model): List<Model>;

/**
 * Creates a reactive store
 */
export function reactive<Model extends PlainObject>(value: Model): Store<Model>;

/**
 * Creates a computed, reactive value
 */
export function reactive<Value>(callback: () => Value): Computed<Value>;

/**
 * Creates a reactive value
 */
export function reactive<Value extends Primitive>(value: Value): Signal<Value>;

export function reactive<Value>(value: Value): Value;

export function reactive(value: unknown): unknown {
	if (value == null || isReactive(value)) {
		return value;
	}

	switch (true) {
		case Array.isArray(value):
			return list(value);

		case isPlainObject(value):
			return store(value);

		case typeof value === 'function':
			return computed(value as never);

		case ['boolean', 'number', 'string'].includes(typeof value):
			return signal(value);

		default:
			return value;
	}
}
