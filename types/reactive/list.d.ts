import type { ReactiveState } from '../models';
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
}
/**
 * Creates a reactive list
 */
export declare function list<Value>(value: Value[]): List<Value>;
export {};
