import type { PlainObject } from '@oscarpalmer/atoms';
import type { Computed, ReactiveArray, Signal, Store } from '../models';
/**
 * Creates a reactive array
 */
export declare function reactive<Value extends unknown[]>(value: Value): ReactiveArray<Value>;
/**
 * Creates a reactive store
 */
export declare function reactive<Value extends PlainObject>(value: Value): Store<Value>;
/**
 * Creates a computed, reactive value
 */
export declare function reactive<Value>(callback: () => Value): Computed<Value>;
/**
 * Creates a reactive value
 */
export declare function reactive<Value>(value: Value): Signal<Value>;
