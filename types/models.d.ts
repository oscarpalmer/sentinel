/**
 * A computed, reactive value
 */
export type Computed<Value> = ReactiveValue<Value>;
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
     * Calls a callback function on each value in the list, and returns a computed, reactive value that contains the results
     */
    filter(callbackFn: (value: Value, index: number, array: Value[]) => boolean): Computed<Value[]>;
    /**
     * Finds a value in the list, and returns it _(or `undefined` if not found)_
     */
    find(callbackFn: (value: Value, index: number, array: Value[]) => boolean): Value | undefined;
    /**
     * Finds the index of a value in the list, and returns it _(or `-1` if not found)_
     */
    findIndex(callbackFn: (value: Value, index: number, array: Value[]) => boolean): number;
    /**
     * Gets the value
     */
    get(): Value[];
    /**
     * Gets the value for an index
     */
    get<Index extends keyof Value[]>(index: Index): Value[][Index];
    /**
     * Determines whether a value is included in the list
     */
    includes(searchElement: Value, fromIndex?: number): boolean;
    /**
     * Finds the index of a value in the list, and returns it _(or `-1` if not found)_
     */
    indexOf(searchElement: Value, fromIndex?: number): number;
    /**
     * Inserts values at a specific index, and returns the new length of the list
     */
    insert(index: number, ...value: Value[]): number;
    /**
     * Calls a callback function on each value in the list, and returns a computed, reactive value that contains the results
     */
    map<Next>(callbackfn: (value: Value, index: number, array: Value[]) => Next): Computed<Next[]>;
    /**
     * Gets the value without triggering reactivity
     */
    peek(): Value[];
    /**
     * Gets the value for an index without triggering reactivity
     */
    peek<Index extends keyof Value[]>(index: Index): Value[][Index];
    /**
     * Removes the last value from the list, and returns it
     */
    pop(): Value | undefined;
    /**
     * Appends new values to the end of the list, and returns the new length of the list
     */
    push(...values: Value[]): number;
    /**
     * Sets the value
     */
    set(value: Value[]): void;
    /**
     * Sets the value for an index
     */
    set<Index extends keyof Value[]>(index: Index, value: Value[][Index]): void;
    /**
     * Removes the first value from the list, and returns it
     */
    shift(): Value | undefined;
    /**
     * Removes values from the list and, if necessary, inserts new values in their place, returning the deleted values
     */
    splice(start: number, deleteCount?: number, ...values: Value[]): Value[];
    /**
     * Adds new values to the beginning of the list, and returns the new length of the list
     */
    unshift(...values: Value[]): number;
} & ReactiveValue<Value[]>;
export type Reactive = ReactiveValue<unknown>;
export type ReactiveState<Value> = {
    active: boolean;
    effects: Set<EffectState>;
    subscribers: Map<Subscriber<Value>, () => void>;
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
     * Unsubscribes from changes for the value
     */
    unsubscribe(subscriber: Subscriber<Value>): void;
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
