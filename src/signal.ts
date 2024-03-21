import {getValue, setValue} from './helpers';
import {Reactive} from './reactive';

/**
 * A reactive value
 */
export class Signal<T> extends Reactive<T> {
	/**
	 * @inheritdoc
	 */
	get value(): T {
		return getValue(this as never) as T;
	}

	/**
	 * @inheritdoc
	 */
	set value(value: T) {
		setValue(this as never, value);
	}

	/**
	 * Sets the value
	 */
	set(value: T): void {
		setValue(this as never, value);
	}
}

/**
 * Creates a reactive value
 */
export function signal<T>(value: T): Signal<T> {
	return new Signal(value);
}
