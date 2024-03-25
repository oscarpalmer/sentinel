import type { PlainObject } from '@oscarpalmer/atoms/is';
import type { Effect } from '../effect';
import type { Computed } from '../reactive/computed';
import type { List } from '../reactive/list';
import type { Signal } from '../reactive/signal';
import type { Store } from '../reactive/store';
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
export declare function isReactive(value: unknown): value is Computed<unknown> | List<unknown> | Signal<unknown>;
/**
 * Is the value a reactive value?
 */
export declare function isSignal(value: unknown): value is Signal<unknown>;
/**
 * Is the value a reactive store?
 */
export declare function isStore(value: unknown): value is Store<PlainObject>;
