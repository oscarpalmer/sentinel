import type { Computed } from './computed';
import type { Signal } from './signal';
import type { Watcher } from './watcher';
/**
 * Is the value a computed, reactive value?
 */
export declare function isComputed(value: unknown): value is Computed<unknown>;
/**
 * Is the value a reactive value?
 */
export declare function isReactive(value: unknown): value is Computed<unknown> | Signal<unknown>;
/**
 * Is the value a reactive value?
 */
export declare function isSignal(value: unknown): value is Signal<unknown>;
/**
 * Is the value a watcher?
 */
export declare function isWatcher(value: unknown): value is Watcher;
