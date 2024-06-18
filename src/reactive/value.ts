import {disable, enable} from '../helpers/event';
import {subscribe} from '../helpers/subscription';
import {getValue} from '../helpers/value';
import type {ReactiveState, Subscriber, Unsubscriber} from '../models';

export function reactiveValue<Value>(value: Value) {
	const state: ReactiveState<Value> = {
		value,
		active: true,
		callbacks: {
			any: new Set(),
			keys: new Set(),
			values: new Map(),
		},
	};

	const callbacks = {
		get(): Value {
			return getValue(state);
		},
		peek(): Value {
			return state.value;
		},
		toJSON(): Value {
			return getValue(state);
		},
		toString(): string {
			return String(getValue(state));
		},
		run(): void {
			enable(state);
		},
		stop(): void {
			disable(state);
		},
		subscribe(subscriber: Subscriber<Value>): Unsubscriber {
			return subscribe(state, subscriber);
		},
		unsubscribe(subscriber?: Subscriber<Value>): void {
			if (subscriber == null) {
				state.callbacks.any.clear();
			} else {
				state.callbacks.any.delete(subscriber);
			}
		},
	};

	return {
		callbacks,
		state,
	};
}
