import type {PlainObject} from '@oscarpalmer/atoms';
import {isPlainObject} from '@oscarpalmer/atoms/is';
import {isReactive} from '../helpers/is';
import {Computed} from './computed';
import {List} from './list';
import {Signal} from './signal';
import {Store} from './store';

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
			return new List(value);

		case isPlainObject(value):
			return new Store(value);

		case typeof value === 'function':
			return new Computed(value as never);

		case ['boolean', 'number', 'string'].includes(typeof value):
			return new Signal(value);

		default:
			return value;
	}
}
