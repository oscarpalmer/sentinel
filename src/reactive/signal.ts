import {setValue} from '../helpers/value';
import {ReactiveValue} from './value';

export class Signal<Value> extends ReactiveValue<Value> {
	constructor(value: Value) {
		super('signal', value);
	}

	/**
	 * Sets the value
	 */
	set(value: Value): void {
		setValue(this.state, value);
	}

	/**
	 * Updates the value
	 */
	update(updater: (current: Value) => Value): void {
		setValue(this.state, updater(this.state.value as never));
	}
}

/**
 * Creates a reactive value
 */
export function signal<Value>(value: Value): Signal<Value> {
	return new Signal(value);
}
