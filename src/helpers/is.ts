import type {PlainObject} from '@oscarpalmer/atoms';
import type {Effect} from '../effect';
import type {ReactiveArray} from '../reactive/array';
import type {Computed} from '../reactive/computed';
import type {Reactive} from '../reactive/instance';
import type {Signal} from '../reactive/signal';
import type {Store} from '../reactive/store';

/**
 * Is the value a reactive array?
 */
export function isArray(value: unknown): value is ReactiveArray<unknown> {
	return isSentinel(value, /^array$/i);
}

/**
 * Is the value a computed, reactive value?
 */
export function isComputed(value: unknown): value is Computed<unknown> {
	return isSentinel(value, /^computed$/i);
}

/**
 * Is the value a reactive effect?
 */
export function isEffect(value: unknown): value is Effect {
	return isSentinel(value, /^effect$/i);
}

/**
 * Is the value a reactive value?
 */
export function isReactive(value: unknown): value is Reactive {
	return isSentinel(value, /^array|computed|signal|store$/i);
}

function isSentinel(value: unknown, expression: RegExp): boolean {
	return expression.test(
		(value as unknown as {$sentinel: string})?.$sentinel ?? '',
	);
}

/**
 * Is the value a reactive store?
 */
export function isStore(value: unknown): value is Store<PlainObject> {
	return isSentinel(value, /^store$/i);
}

/**
 * Is the value a reactive value?
 */
export function isSignal(value: unknown): value is Signal<unknown> {
	return isSentinel(value, /^signal$/i);
}
