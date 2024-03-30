import type { PlainObject } from '@oscarpalmer/atoms';
import { Computed } from './computed';
import { List } from './list';
import { Signal } from './signal';
import { Store } from './store';
type Primitive = boolean | number | string;
/**
 * Creates a reactive list
 */
export declare function reactive<Model extends unknown[]>(value: Model): List<Model>;
/**
 * Creates a reactive store
 */
export declare function reactive<Model extends PlainObject>(value: Model): Store<Model>;
/**
 * Creates a computed, reactive value
 */
export declare function reactive<Value>(callback: () => Value): Computed<Value>;
/**
 * Creates a reactive value
 */
export declare function reactive<Value extends Primitive>(value: Value): Signal<Value>;
export declare function reactive<Value>(value: Value): Value;
export {};
