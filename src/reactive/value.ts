import {disable, enable} from '../helpers/event';
import {
	Sentinel,
	type SentinelType,
	type Subscriber,
	type ReactiveState,
} from '../models';

/**
 * Base class for a reactive value
 */
export abstract class ReactiveValue<Value> extends Sentinel {
	protected declare readonly state: ReactiveState<Value>;

	/**
	 * The current value
	 */
	abstract readonly value: Value;

	constructor(type: SentinelType, value: Value) {
		super(type, true);

		this.state.effects = new Set();
		this.state.subscribers = new Map();
		this.state.value = value;
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
		return this.state.value;
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
	 * Adds a subscriber to the value
	 */
	subscribe(subscriber: Subscriber<Value>): void {
		const {subscribers, value} = this.state;

		if (subscribers.has(subscriber)) {
			return;
		}

		subscribers.set(subscriber, () => subscriber(value));

		subscriber(value);
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

	/**
	 * Removes a subscriber from the value
	 */
	unsubscribe(subscriber: Subscriber<Value>): void {
		this.state.subscribers.delete(subscriber);
	}
}
