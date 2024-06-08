import type {Key} from '@oscarpalmer/atoms/models';

/**
 * A computed, reactive value
 */
export type Computed<Value> = ReactiveValue<Value>;

/**
 * A reactive effect for changes in a value
 */
export type Effect = {
	/**
	 * Starts reacting to changes
	 */
	start(): void;
	/**
	 * Stops reacting to changes
	 */
	stop(): void;
};

export type EffectState = {
	active: boolean;
	callback: () => void;
	reactives: Set<ReactiveState<unknown>>;
};

export type Reactive = ReactiveValue<unknown>;

export type ReactiveArray<Value> = {
	/**
	 * Get the length of the array
	 */
	get length(): number;
	/**
	 * Set the length of the array
	 */
	set length(value: number);
	/**
	 * Calls a callback function on each value in the array, and returns a computed, reactive value that contains the results
	 */
	filter(
		callbackFn: (value: Value, index: number, array: Value[]) => boolean,
	): Computed<Value[]>;
	/**
	 * Gets the array
	 */
	get(): Value[];
	/**
	 * Gets the value for an index
	 */
	get<Index extends keyof Value[]>(index: Index): Value[][Index];
	/**
	 * Inserts values at a specific index, and returns the new length of the array
	 */
	insert(index: number, ...value: Value[]): number;
	/**
	 * Calls a callback function on each value in the array, and returns a computed, reactive value that contains the results
	 */
	map<Next>(
		callbackfn: (value: Value, index: number, array: Value[]) => Next,
	): Computed<Next[]>;
	/**
	 * Gets the value without triggering reactivity
	 */
	peek(): Value[];
	/**
	 * Gets the value for an index without triggering reactivity
	 */
	peek<Index extends keyof Value[]>(index: Index): Value[][Index];
	/**
	 * Appends new values to the end of the array, and returns the new length of the array
	 */
	push(...values: Value[]): number;
	/**
	 * Sets the value _(and returns the previous value)_
	 */
	set(value: Value[]): Value[];
	/**
	 * Sets the value for an index
	 */
	set<Index extends keyof Value[]>(index: Index, value: Value[][Index]): void;
	/**
	 * Removes values from the array and, if necessary, inserts new values in their place, returning the deleted values
	 */
	splice(start: number, deleteCount?: number, ...values: Value[]): Value[];
	/**
	 * - Subscribes to changes for a specific index in the array
	 * - Returns a function to allow for unsubscribing
	 */
	subscribe(index: number, subscriber: Subscriber<Value>): Unsubscriber;
	/**
	 * - Subscribes to changes for the array
	 * - Returns a function to allow for unsubscribing
	 */
	subscribe(subscriber: Subscriber<Value[]>): Unsubscriber;
	/**
	 * Gets a shallow copy of the array
	 */
	toArray(): Value[];
	/**
	 * Unsubscribes from changes for a specific index in the array _(and optionally a specific subscriber)_
	 */
	unsubscribe(index: number, subscriber?: Subscriber<Value>): void;
	/**
	 * Unsubscribes from changes for the array _(and optionally a specific subscriber)_
	 */
	unsubscribe(subscriber?: Subscriber<Value[]>): void;
} & ReactiveValue<Value[]>;

type ReactiveCallbacks<Value> = {
	any: Set<EffectState | Subscriber<Value>>;
	keys: Set<Key>;
	values: Map<Key, Set<EffectState | Subscriber<Value>>>;
};

export type ReactiveState<Value> = {
	active: boolean;
	callbacks: ReactiveCallbacks<Value>;
	value: Value;
};

export type ReactiveValue<Value> = {
	/**
	 * Gets the value
	 */
	get(): Value;
	/**
	 * Gets the value without triggering reactivity
	 */
	peek(): Value;
	/**
	 * Starts reactivity for the value, if it was stopped
	 */
	run(): void;
	/**
	 * Stops reactivity for the value, if it was started
	 */
	stop(): void;
	/**
	 * - Subscribes to changes for the value
	 * - Returns a function to allow for unsubscribing
	 */
	subscribe(subscriber: Subscriber<Value>): Unsubscriber;
	/**
	 * Gets the JSON representation of the value
	 */
	toJSON(): Value;
	/**
	 * Gets the string representation of the value
	 */
	toString(): string;
	/**
	 * Unsubscribes from changes for the value _(and optionally a specific subscriber)_
	 */
	unsubscribe(subscriber?: Subscriber<Value>): void;
};

export type Signal<Value> = {
	/**
	 * Sets the value
	 */
	set(value: Value): void;
	/**
	 * Updates the value
	 */
	update(updater: (value: Value) => Value): void;
} & ReactiveValue<Value>;

/**
 * A subscriber for a reactive value, called when the value changes
 */
export type Subscriber<Value> = (value: Value) => void;

/**
 * - A function that unsubscribes a subscriber from a reactive value
 * - Receieved when subscribing to a reactive value
 */
export type Unsubscriber = () => void;
