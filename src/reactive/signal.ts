import {getValue, setValue} from '../helpers';
import {ReactiveValue} from '.';

/**
 * A reactive value
 */
export class Signal<Value> extends ReactiveValue<Value> {
	/**
	 * @inheritdoc
	 */
	get value(): Value {
		return getValue(this as never) as Value;
	}

	/**
	 * @inheritdoc
	 */
	set value(value: Value) {
		setValue(this as never, value);
	}

	constructor(value: Value) {
		super('signal', value);
	}

	/**
	 * Sets the value
	 */
	set(value: Value): void {
		setValue(this as never, value);
	}
}

/**
 * Creates a reactive value
 */
export function signal<Value>(value: Value): Signal<Value> {
	return new Signal(value);
}
