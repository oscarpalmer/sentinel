import {setValue} from '../helpers/value';
import {ReactiveValue} from './value';

/**
 * A reactive value
 */
export class Signal<Value> extends ReactiveValue<Value> {
	/**
	 * Sets the value
	 */
	set(value: Value): void {
		setValue(this as never, value);
	}

	/**
	 * Updates the value
	 */
	update(updater: (current: Value) => Value): void {
		this.set(updater(this.get()));
	}
}

/**
 * Creates a reactive value
 */
export function signal<Value>(value: Value): Signal<Value> {
	return new Signal(value);
}
