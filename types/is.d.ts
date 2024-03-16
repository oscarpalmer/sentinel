import type { Computed } from './computed';
import type { Effect } from './effect';
import type { Signal } from './signal';
/**
 * Is the value a computed, reactive value?
 */
export declare function isComputed(value: unknown): value is Computed<unknown>;
/**
 * Is the value a reactive effect?
 */
export declare function isEffect(value: unknown): value is Effect;
/**
 * Is the value a reactive value?
 */
export declare function isReactive(value: unknown): value is Computed<unknown> | Signal<unknown>;
/**
 * Is the value a reactive value?
 */
export declare function isSignal(value: unknown): value is Signal<unknown>;
