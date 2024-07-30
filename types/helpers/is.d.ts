import type { PlainObject } from '@oscarpalmer/atoms';
import type { Effect } from '../effect';
import type { ReactiveArray } from '../reactive/array';
import type { Computed } from '../reactive/computed';
import type { Reactive } from '../reactive/instance';
import type { Signal } from '../reactive/signal';
import type { Store } from '../reactive/store';
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
 * Is the value a reactive store?
 */
export declare function isStore(value: unknown): value is Store<PlainObject>;
/**
 * Is the value a reactive value?
 */
export declare function isSignal(value: unknown): value is Signal<unknown>;
