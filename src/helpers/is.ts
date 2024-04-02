import type {PlainObject} from '@oscarpalmer/atoms/models';
import type {Computed, Effect, List, Signal, Store} from '../models';

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
 * Is the value a reactive list?
 */
export function isList(value: unknown): value is List<unknown> {
	return isSentinel(value, /^list$/i);
}

/**
 * Is the value a reactive value?
 */
export function isReactive(
	value: unknown,
): value is
	| Computed<unknown>
	| List<unknown>
	| Signal<unknown>
	| Store<PlainObject> {
	return isSentinel(value, /^computed|list|signal|store$/i);
}

function isSentinel(value: unknown, expression: RegExp): boolean {
	return expression.test((value as any)?.$sentinel ?? '');
}

/**
 * Is the value a reactive value?
 */
export function isSignal(value: unknown): value is Signal<unknown> {
	return isSentinel(value, /^signal$/i);
}

/**
 * Is the value a reactive store?
 */
export function isStore(value: unknown): value is Store<PlainObject> {
	return isSentinel(value, /^store$/i);
}
