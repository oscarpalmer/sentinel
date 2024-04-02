import {setValue} from '../helpers/value';
import type {Signal} from '../models';
import {reactiveValue} from './value';

/**
 * Creates a reactive value
 */
export function signal<Value>(value: Value): Signal<Value> {
	const original = reactiveValue(value);

	function set(value: Value): void {
		setValue(original.state, value);
	}

	function update(updater: (current: Value) => Value): void {
		setValue(original.state, updater(original.state.value as never));
	}

	const instance = Object.create({
		...original.callbacks,
		set,
		update,
	});

	Object.defineProperty(instance, '$sentinel', {
		value: 'signal',
	});

	return instance;
}
