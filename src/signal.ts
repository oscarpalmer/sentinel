import {getValue, setValue, startReactivity, stopReactivity} from './helpers';
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
		setValue(this as never, value);
	}

	/**
	 * @inheritdoc
	 */
	run(): void {
		startReactivity(this as never);
	}

	/**
	 * Sets the value
	 */
	set(value: T): void {
		setValue(this as never, value);
	}

	/**
	 * @inheritdoc
	 */
	stop(): void {
		stopReactivity(this as never);
	}
}

/**
 * Creates a reactive value
 */
export function signal<T = unknown>(value: T): Signal<T> {
	return new Signal(value);
}
