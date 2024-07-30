import type {PlainObject} from '@oscarpalmer/atoms/models';
import {subscribeOrUnsubscribe} from '../helpers/subscription';
import type {Subscriber, Unsubscriber} from '../models';
import {ReactiveObject} from './object';

export class Store<Value extends PlainObject> extends ReactiveObject<Value> {
	constructor(value: Value) {
		super('store', value);
	}

	/**
	 * Gets the store without triggering reactivity
	 */
	peek(): Value;

	/**
	 * Gets the value for a path without triggering reactivity
	 */
	peek<Key extends keyof Value>(key: Key): Value[Key];

	peek(key?: unknown): unknown {
		return key == null ? {...this.state.value} : this.state.value[key as never];
	}

	/**
	 * Sets the value for a key
	 */
	set<Key extends keyof Value>(key: Key, value: unknown): void;

	set(first: unknown, second?: unknown): void {
		if (typeof first !== 'object' && first !== null) {
			(this.state.value as PlainObject)[first as never] = second as never;
		}
	}

	/**
	 * - Subscribes to changes for a specific key in the store
	 * - Returns a function to allow for unsubscribing
	 */
	subscribe<Key extends keyof Value>(
		key: Key,
		subscriber: Subscriber<Value[Key]>,
	): Unsubscriber;

	/**
	 * - Subscribes to changes for the store
	 * - Returns a function to allow for unsubscribing
	 */
	subscribe(subscriber: Subscriber<unknown>): Unsubscriber;

	subscribe(first: unknown, second?: unknown): Unsubscriber {
		return subscribeOrUnsubscribe(
			'subscribe',
			this.state as never,
			first,
			second,
		) as Unsubscriber;
	}

	/**
	 * Unsubscribes from changes for a specific key in the store _(and optionally a specific subscriber)_
	 */
	unsubscribe<Key extends keyof Value>(
		key: Key,
		subscriber?: Subscriber<Value[Key]>,
	): void;

	/**
	 * Unsubscribes from changes for the store _(and optionally a specific subscriber)_
	 */
	unsubscribe(subscriber?: Subscriber<unknown>): void;

	unsubscribe(first: unknown, second?: unknown) {
		subscribeOrUnsubscribe('unsubscribe', this.state as never, first, second);
	}
}

export function store<Value extends PlainObject>(value: Value): Store<Value> {
	return new Store(value);
}
