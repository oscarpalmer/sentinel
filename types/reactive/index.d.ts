import type { Computed, List, Signal } from '../models';
/**
 * Creates a reactive list
 */
export declare function reactive<Model extends unknown[]>(value: Model): List<Model>;
/**
 * Creates a computed, reactive value
 */
export declare function reactive<Value>(callback: () => Value): Computed<Value>;
/**
 * Creates a reactive value
 */
export declare function reactive<Value>(value: Value): Signal<Value>;
