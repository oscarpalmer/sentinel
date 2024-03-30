import type { ReactiveState } from '../models';
import { Computed } from './computed';
import { ReactiveObject } from './object';
import { Signal } from './signal';
type ListState<Value> = {
    length: Signal<number>;
} & ReactiveState<Value[]>;
/**
 * A reactive list
 */
export declare class List<Value> extends ReactiveObject<Value[]> {
    protected readonly state: ListState<Value>;
    /**
     * The length of the list
     */
    get length(): number;
    /**
     * Sets the length of the list
     */
    set length(value: number);
    constructor(value: Value[]);
    /**
     * Gets the value at the specified index
     */
    at(index: number): Value | undefined;
    /**
     * Calls a defined callback function on each value in the list, and returns a computed value that contains the results
     */
    map<Next>(callbackfn: (value: Value, index: number, array: Value[]) => Next): Computed<Next[]>;
    /**
     * Appends new values to the end of the list, and returns the new length of the list
     */
    push(...values: Value[]): number;
    /**
     * Removes values from the list and, if necessary, inserts new values in their place, returning the deleted values
     */
    splice(start: number, deleteCount?: number, ...values: Value[]): Value[];
}
/**
 * Creates a reactive list
 */
export declare function list<Value>(value: Value[]): List<Value>;
export {};
