import {disable, enable} from '../helpers/event';
import {getValue} from '../helpers/value';
import type {ReactiveState} from '../models';

export abstract class ReactiveInstance<Value = unknown> {
	private declare readonly $sentinel: string;
	protected readonly state: ReactiveState<Value>;

	constructor(type: string, value: Value) {
		this.$sentinel = type;

		this.state = {
			value,
			active: true,
			callbacks: {
				any: new Set(),
				keys: new Set(),
				values: new Map(),
			},
		};
	}

	/**
	 * Gets the value
	 */
	get(): Value {
		return getValue(this.state);
	}

	/**
	 * Gets the value without triggering reactivity
	 */
	peek(): Value {
		return this.state.value;
	}

	/**
	 * Starts reactivity for the value, if it was stopped
	 */
	run(): void {
		enable(this.state);
	}

	/**
	 * Stops reactivity for the value, if it was started
	 */
	stop(): void {
		disable(this.state);
	}

	/**
	 * Gets the JSON representation of the value
	 */
	toJSON(): Value {
		return getValue(this.state);
	}

	/**
	 * Gets the string representation of the value
	 */
	toString(): string {
		return String(getValue(this.state));
	}
}

export type Reactive = ReactiveInstance;
