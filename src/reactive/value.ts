import {disable, enable} from '../helpers/event';
import {getValue} from '../helpers/value';
import type {ReactiveState, Subscriber, Unsubscriber} from '../models';

export function reactiveValue<Value>(value: Value) {
	const state: ReactiveState<Value> = {
		value,
		active: true,
		effects: new Set(),
		subscribers: new Map(),
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
			const {subscribers, value} = state;

			if (subscribers.has(subscriber)) {
				return () => {};
			}

			subscribers.set(subscriber, () => subscriber(value));

			subscriber(value);

			return () => {
				state.subscribers.delete(subscriber);
			};
		},

		unsubscribe(subscriber: Subscriber<Value>): void {
			state.subscribers.delete(subscriber);
		},
	};

	return {
		callbacks,
		state,
	};
}
