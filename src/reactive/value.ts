import {disable, enable} from '../helpers/event';
import {Sentinel, type InternalEffect, type SentinelType} from '../models';

/**
 * Base class for a reactive value
 */
export abstract class ReactiveValue<Value> extends Sentinel {
	/**
	 * Effects that have accessed the value
	 */
	protected readonly effects = new Set<InternalEffect>();

	/**
	 * The current value
	 */
	abstract readonly value: Value;

	constructor(
		type: SentinelType,
		protected _value: Value,
	) {
		super(type, true);
	}

	/**
	 * The current value
	 */
	get(): Value {
		return this.value;
	}

	/**
	 * Gets the current value, without reaction
	 */
	peek(): Value {
		return this._value;
	}

	/**
	 * Enables reactivity for the value, if it was stopped
	 */
	run(): void {
		enable(this as never);
	}

	/**
	 * Disables reactivity for the value, if it's running
	 */
	stop(): void {
		disable(this as never);
	}

	/**
	 * Get the JSON representation of the value
	 */
	toJSON(): Value {
		return this.value;
	}

	/**
	 * Get the string representation of the value
	 */
	toString(): string {
		return String(this.value);
	}
}
