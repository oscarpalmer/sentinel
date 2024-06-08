import {isPlainObject} from '@oscarpalmer/atoms/is';
import {isReactive} from '../helpers/is';
import type {Computed, ReactiveArray, Signal} from '../models';
import {array} from './array';
import {computed} from './computed';
import {signal} from './signal';

const primitives = new Set(['boolean', 'number', 'string']);

/**
 * Creates a reactive array
 */
export function reactive<Model extends unknown[]>(
	value: Model,
): ReactiveArray<Model>;

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

		case typeof value === 'function':
			return computed(value as never);

		case value == null:
		case isPlainObject(value):
		case primitives.has(typeof value):
			return signal(value);

		default:
			return value;
	}
}
