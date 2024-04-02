import type {ArrayOrPlainObject} from '@oscarpalmer/atoms';

/**
 * A computed, reactive value
 */
export type Computed<Value> = {
	/**
	 * Gets the value
	 */
	get(): Value;
	/**
	 * Gets the value without triggering reactivity
	 */
	peek(): Value;
} & ReactiveValue<Value>;

/**
 * A reactive effect for changes in values
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

export type List<Value> = {
	/**
	 * Get the length of the list
	 */
	get length(): number;
	/**
	 * Set the length of the list
	 */
	set length(value: number);
	/**
	 * Gets the value at a specific index
	 */
	at(index: number): Value | undefined;
	/**
	 * Calls a defined callback function on each value in the list, and returns a computed, reactive value that contains the results
	 */
	map<Next>(
		callbackfn: (value: Value, index: number, array: Value[]) => Next,
	): Computed<Next[]>;
	/**
	 * Appends new values to the end of the list, and returns the new length of the list
	 */
	push(...values: Value[]): number;
	/**
	 * Removes values from the list and, if necessary, inserts new values in their place, returning the deleted values
	 */
	splice(start: number, deleteCount?: number, ...values: Value[]): Value[];
} & ReactiveObject<Value[]>;

export type ReactiveObject<Model extends ArrayOrPlainObject> = {
	/**
	 * Gets the value
	 */
	get(): Model;
	/**
	 * Gets the value for a key
	 */
	get<Key extends keyof Model>(key: Key): Model[Key];
	get<Key extends keyof Model>(key?: Key): Model | Model[Key];
	/**
	 * Gets the value without triggering reactivity
	 */
	peek(): Model;
	/**
	 * Gets the value for a key without triggering reactivity
	 */
	peek<Key extends keyof Model>(key: Key): Model[Key];
	peek<Key extends keyof Model>(key?: Key): Model | Model[Key];
	/**
	 * Sets the value for a key
	 */
	set<Key extends keyof Model>(key: Key, value: Model[Key]): void;
} & ReactiveValue<Model>;

export type ReactiveState<Value> = {
	active: boolean;
	effects: Set<EffectState>;
	subscribers: Map<Subscriber<Value>, () => void>;
	value: Value;
};

export type ReactiveValue<Value> = {
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
	 * Unsubscribes from changes for the value
	 */
	unsubscribe(subscriber: Subscriber<Value>): void;
};

export type Signal<Value> = {
	/**
	 * Gets the value
	 */
	get(): Value;
	/**
	 * Gets the value without triggering reactivity
	 */
	peek(): Value;
	/**
	 * Sets the value
	 */
	set(value: Value): void;
	/**
	 * Updates the value
	 */
	update(updater: (value: Value) => Value): void;
} & ReactiveValue<Value>;

export type Store<Model extends ArrayOrPlainObject> = ReactiveObject<Model>;

/**
 * A subscriber for a reactive value, called when the value changes
 */
export type Subscriber<Value> = (value: Value) => void;

/**
 * - A function that unsubscribes a subscriber from a reactive value
 * - Receieved when subscribing to a reactive value
 */
export type Unsubscriber = () => void;
