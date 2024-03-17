import {getValue, setValue} from './helpers';
import {ReactiveValue} from './reactive';

/**
 * A reactive value
 */
export class Signal<T = unknown> extends ReactiveValue<T> {
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
		setValue(this as never, value, false);
	}

	/**
	 * Enables reactivity for the value, if it was stopped
	 */
	run(): void {
		if (this.active) {
			return;
		}

		this.active = true;

		setValue(this as never, this._value, true);
	}

	/**
	 * Sets the value
	 */
	set(value: T): void {
		setValue(this as never, value, true);
	}

	/**
	 * Disables reactivity for the value, if it's running
	 */
	stop(): void {
		this.active = false;
	}
}

/**
 * Creates a reactive value
 */
export function signal<T = unknown>(value: T): Signal<T> {
	return new Signal(value);
}
