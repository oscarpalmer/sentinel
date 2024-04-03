import type { Computed, Effect, List, ReactiveValue, Signal } from '../models';
/**
 * Is the value a computed, reactive value?
 */
export declare function isComputed(value: unknown): value is Computed<unknown>;
/**
 * Is the value a reactive effect?
 */
export declare function isEffect(value: unknown): value is Effect;
/**
 * Is the value a reactive list?
 */
export declare function isList(value: unknown): value is List<unknown>;
/**
 * Is the value a reactive value?
 */
export declare function isReactive(value: unknown): value is ReactiveValue<unknown>;
/**
 * Is the value a reactive value?
 */
export declare function isSignal(value: unknown): value is Signal<unknown>;
