import {subscribeOrUnsubscribe} from '../helpers/subscription';
import {getValue} from '../helpers/value';
import type {Subscriber, Unsubscriber} from '../models';
import {type Computed, computed} from './computed';
import {ReactiveObject} from './object';
import {type Signal, signal} from './signal';

export class ReactiveArray<Value> extends ReactiveObject<Value[]> {
	/**
	 * Get the length of the array
	 */
	get length() {
		return this.arrayLength.get();
	}

	/**
	 * Set the length of the array
	 */
	set length(value) {
		this.state.value.length = value < 0 ? 0 : value;
	}

	constructor(
		value: Value[],
		private readonly arrayLength: Signal<number>,
	) {
		super('array', value, arrayLength);
	}

	/**
	 * Calls a callback function on each value in the array, and returns a computed, reactive value that contains the results
	 */
	filter(
		callbackFn: (value: Value, index: number, array: Value[]) => boolean,
	): Computed<Value[]> {
		return computed(() => getValue(this.state).filter(callbackFn));
	}

	/**
	 * Gets the array
	 */
	get(): Value[];

	/**
	 * Gets the value for an index
	 */
	get<Index extends keyof Value[]>(index: Index): Value[][Index];

	get(index?: number): Value | Value[] {
		return getValue(this.state, index as never);
	}

	/**
	 * Inserts values at a specific index, and returns the new length of the array
	 */
	insert(index: number, ...value: Value[]): number {
		this.state.value.splice(index, 0, ...value);

		return this.arrayLength?.peek();
	}

	/**
	 * Calls a callback function on each value in the array, and returns a computed, reactive value that contains the results
	 */
	map<Next>(
		callbackfn: (value: Value, index: number, array: Value[]) => Next,
	): Computed<Next[]> {
		return computed(() => getValue(this.state).map(callbackfn));
	}

	/**
	 * Gets the value without triggering reactivity
	 */
	peek(): Value[];

	/**
	 * Gets the value for an index without triggering reactivity
	 */
	peek<Index extends keyof Value[]>(index: Index): Value[][Index];

	peek(index?: number): Value | Value[] {
		return index == null
			? [...this.state.value]
			: (this.state.value.at(index) as Value);
	}

	/**
	 * Appends new values to the end of the array, and returns the new length of the array
	 */
	push(...values: Value[]): number {
		return this.state.value.push(...values);
	}

	/**
	 * Sets the value _(and returns the previous value)_
	 */
	set(value: Value[]): void;

	/**
	 * Sets the value for an index
	 */
	set<Index extends keyof Value[]>(index: Index, value: Value[][Index]): void;

	set(first: unknown, second?: unknown): unknown {
		if (Array.isArray(first)) {
			return this.state.value.splice(0, this.state.value.length, ...first);
		}

		this.state.value[first as never] = second as never;
	}

	/**
	 * Removes values from the array and, if necessary, inserts new values in their place, returning the deleted values
	 */
	splice(start: number, deleteCount?: number, ...values: Value[]): Value[] {
		return this.state.value.splice(start, deleteCount ?? 0, ...values);
	}

	/**
	 * - Subscribes to changes for a specific index in the array
	 * - Returns a function to allow for unsubscribing
	 */
	subscribe<Index extends keyof Value[]>(
		index: Index,
		subscriber: Subscriber<Value[][Index]>,
	): Unsubscriber;

	/**
	 * - Subscribes to changes for the array
	 * - Returns a function to allow for unsubscribing
	 */
	subscribe(subscriber: Subscriber<Value[]>): Unsubscriber;

	subscribe(first: unknown, second?: unknown): Unsubscriber {
		return subscribeOrUnsubscribe(
			'subscribe',
			this.state as never,
			first,
			second,
		) as Unsubscriber;
	}

	/**
	 * Gets a shallow copy of the array
	 */
	toArray(): Value[] {
		return [...this.state.value];
	}

	/**
	 * Unsubscribes from changes for a specific index in the array _(and optionally a specific subscriber)_
	 */
	unsubscribe<Index extends keyof Value[]>(
		index: Index,
		subscriber?: Subscriber<Value[][Index]>,
	): void;

	/**
	 * Unsubscribes from changes for the array _(and optionally a specific subscriber)_
	 */
	unsubscribe(subscriber?: Subscriber<unknown>): void;

	unsubscribe(first?: unknown, second?: unknown): void {
		subscribeOrUnsubscribe('unsubscribe', this.state as never, first, second);
	}
}

export function array<Value>(value: Value[]): ReactiveArray<Value> {
	return new ReactiveArray(value, signal(value.length));
}
