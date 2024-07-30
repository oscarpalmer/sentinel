import type { Subscriber, Unsubscriber } from '../models';
import { type Computed } from './computed';
import { ReactiveObject } from './object';
import { type Signal } from './signal';
export declare class ReactiveArray<Value> extends ReactiveObject<Value[]> {
    private readonly arrayLength;
    /**
     * Get the length of the array
     */
    get length(): number;
    /**
     * Set the length of the array
     */
    set length(value: number);
    constructor(value: Value[], arrayLength: Signal<number>);
    /**
     * Calls a callback function on each value in the array, and returns a computed, reactive value that contains the results
     */
    filter(callbackFn: (value: Value, index: number, array: Value[]) => boolean): Computed<Value[]>;
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
     * Appends new values to the end of the array, and returns the new length of the array
     */
    push(...values: Value[]): number;
    /**
     * Sets the value _(and returns the previous value)_
     */
    set(value: Value[]): void;
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
    subscribe<Index extends keyof Value[]>(index: Index, subscriber: Subscriber<Value[][Index]>): Unsubscriber;
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
    unsubscribe<Index extends keyof Value[]>(index: Index, subscriber?: Subscriber<Value[][Index]>): void;
    /**
     * Unsubscribes from changes for the array _(and optionally a specific subscriber)_
     */
    unsubscribe(subscriber?: Subscriber<unknown>): void;
}
export declare function array<Value>(value: Value[]): ReactiveArray<Value>;
