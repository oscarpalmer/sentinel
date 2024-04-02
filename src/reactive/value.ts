import {disable, enable} from '../helpers/event';
import {getValue} from '../helpers/value';
import {
	type ReactiveState,
	Sentinel,
	type Subscriber,
	type Unsubscriber,
} from '../models';

/**
 * Base class for a reactive value
 */
export class ReactiveValue<Value> extends Sentinel {
	protected declare readonly state: ReactiveState<Value>;

	constructor(value: Value) {
		super(true);

		this.state.effects = new Set();
		this.state.subscribers = new Map();
		this.state.value = value;
	}

	/**
	 * The current value
	 */
	get(): Value {
		return getValue(this as never) as Value;
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
	subscribe(subscriber: Subscriber<Value>): Unsubscriber {
		const {subscribers, value} = this.state;

		if (subscribers.has(subscriber)) {
			return () => {};
		}

		subscribers.set(subscriber, () => subscriber(value));

		subscriber(value);

		return () => {
			this.state.subscribers.delete(subscriber);
		};
	}

	/**
	 * Get the JSON representation of the value
	 */
	toJSON(): Value {
		return this.get();
	}

	/**
	 * Get the string representation of the value
	 */
	toString(): string {
		return String(this.get());
	}

	/**
	 * Removes a subscriber from the value
	 */
	unsubscribe(subscriber: Subscriber<Value>): void {
		this.state.subscribers.delete(subscriber);
	}
}
