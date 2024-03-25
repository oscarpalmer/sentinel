import type { PlainObject } from '@oscarpalmer/atoms/is';
import type { Computed } from '../reactive/computed';
import type { Effect } from '../effect';
import type { Item } from '../reactive/item';
import type { List } from '../reactive/list';
import type { Signal } from '../reactive/signal';
/**
 * Is the value a computed, reactive value?
 */
export declare function isComputed(value: unknown): value is Computed<unknown>;
/**
 * Is the value a reactive effect?
 */
export declare function isEffect(value: unknown): value is Effect;
export declare function isItem(value: unknown): value is Item<PlainObject>;
export declare function isList(value: unknown): value is List<unknown>;
/**
 * Is the value a reactive value?
 */
export declare function isReactive(value: unknown): value is Computed<unknown> | List<unknown> | Signal<unknown>;
/**
 * Is the value a reactive value?
 */
export declare function isSignal(value: unknown): value is Signal<unknown>;
