import {isPlainObject} from '@oscarpalmer/atoms/is';
import {isReactive} from '../helpers/is';
import type {Computed, List, Signal} from '../models';
import {computed} from './computed';
import {list} from './list';
import {signal} from './signal';

const primitives = new Set(['boolean', 'number', 'string']);

/**
 * Creates a reactive list
 */
export function reactive<Model extends unknown[]>(value: Model): List<Model>;

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
			return list(value);

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
