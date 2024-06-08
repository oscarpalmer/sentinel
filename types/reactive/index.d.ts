import type { Computed, ReactiveArray, Signal } from '../models';
/**
 * Creates a reactive array
 */
export declare function reactive<Model extends unknown[]>(value: Model): ReactiveArray<Model>;
/**
 * Creates a computed, reactive value
 */
export declare function reactive<Value>(callback: () => Value): Computed<Value>;
/**
 * Creates a reactive value
 */
export declare function reactive<Value>(value: Value): Signal<Value>;
