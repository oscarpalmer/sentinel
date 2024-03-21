import type {PlainObject} from '@oscarpalmer/atoms/is';
import {getValue, setProxyValue} from './helpers';
import {Reactive} from './reactive';

/**
 * A reactive item
 */
export class Item<T extends PlainObject> extends Reactive<T> {
	/**
	 * @inheritdoc
	 */
	get value(): T {
		return getValue(this as never) as T;
	}

	constructor(value: T) {
		super(
			new Proxy(value, {
				set: (target, property, value) =>
					setProxyValue(this as never, target, property, value),
			}),
		);
	}

	/**
	 * Gets value for a property
	 */
	get(property: keyof T): T[keyof T];

	/**
	 * Gets the value
	 */
	get(): T;

	get(property?: keyof T): T[keyof T] | T {
		return property == null
			? (getValue(this as never) as T)
			: this.value[property];
	}

	/**
	 * Gets value for a property without triggering reactivity
	 */
	peek(property: keyof T): T[keyof T];

	/**
	 * Gets the value without triggering reactivity
	 */
	peek(): T;

	peek(property?: keyof T): T[keyof T] | T {
		return property == null ? this._value : this._value[property];
	}

	/**
	 * Sets the value for a property
	 */
	set(property: keyof T, value: T[keyof T]): void {
		this._value[property] = value;
	}
}

/**
 * Creates a reactive item
 */
export function item<T extends PlainObject>(value: T): Item<T> {
	return new Item(value);
}
