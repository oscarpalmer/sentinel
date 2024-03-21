import {getValue, startReactivity, stopReactivity} from './helpers';
import {type InternalEffect, Sentinel} from './models';

/**
 * Base class for a reactive value
 */
export abstract class Reactive<T> extends Sentinel {
	/**
	 * Effects that have accessed the value
	 */
	protected readonly effects = new Set<InternalEffect>();

	/**
	 * The current value
	 */
	abstract readonly value: T;

	constructor(protected _value: T) {
		super(true);
	}

	/**
	 * The current value
	 */
	get(): T {
		return this.value;
	}

	/**
	 * Gets the current value, without reaction
	 */
	peek(): T {
		return this._value;
	}

	/**
	 * Enables reactivity for the value, if it was stopped
	 */
	run(): void {
		startReactivity(this as never);
	}

	/**
	 * Disables reactivity for the value, if it's running
	 */
	stop(): void {
		stopReactivity(this as never);
	}

	/**
	 * Get the JSON representation of the value
	 */
	toJSON(): T {
		return this.value;
	}

	/**
	 * Get the string representation of the value
	 */
	toString(): string {
		return String(this.value);
	}
}
