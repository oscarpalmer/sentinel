import type { Computed, Effect, Reactive, ReactiveArray, Signal } from '../models';
/**
 * Is the value a reactive array?
 */
export declare function isArray(value: unknown): value is ReactiveArray<unknown>;
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
export declare function isReactive(value: unknown): value is Reactive;
/**
 * Is the value a reactive value?
 */
export declare function isSignal(value: unknown): value is Signal<unknown>;
