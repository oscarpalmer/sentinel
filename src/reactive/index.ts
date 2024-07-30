import type {PlainObject} from '@oscarpalmer/atoms';
import {isPlainObject} from '@oscarpalmer/atoms/is';
import {isReactive} from '../helpers/is';
import {type ReactiveArray, array} from './array';
import {type Computed, computed} from './computed';
import {type Signal, signal} from './signal';
import {type Store, store} from './store';

const primitives = new Set(['boolean', 'number', 'string']);

/**
 * Creates a reactive array
 */
export function reactive<Value extends unknown[]>(
	value: Value,
): ReactiveArray<Value>;

/**
 * Creates a reactive store
 */
export function reactive<Value extends PlainObject>(value: Value): Store<Value>;

/**
 * Creates a computed, reactive value
 */
export function reactive<Value>(callback: () => Value): Computed<Value>;

/**
 * Creates a reactive value
 */
export function reactive<Value>(value: Value): Signal<Value>;

export function reactive(value: unknown): unknown {
	if (isReactive(value)) {
		return value;
	}

	switch (true) {
		case Array.isArray(value):
			return array(value);

		case isPlainObject(value):
			return store(value);

		case typeof value === 'function':
			return computed(value as never);

		case value == null:
		case primitives.has(typeof value):
			return signal(value);

		default:
			return value;
	}
}
