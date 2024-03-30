import type {PlainObject} from '@oscarpalmer/atoms/models';
import type {Effect} from '../effect';
import type {Computed} from '../reactive/computed';
import type {List} from '../reactive/list';
import type {Signal} from '../reactive/signal';
import type {Store} from '../reactive/store';

export type Reactive =
	| Computed<unknown>
	| List<unknown>
	| Signal<unknown>
	| Store<PlainObject>;

/**
 * Is the value a computed, reactive value?
 */
export function isComputed(value: unknown): value is Computed<unknown> {
	return isInstance(value, /^computed$/i);
}

/**
 * Is the value a reactive effect?
 */
export function isEffect(value: unknown): value is Effect {
	return isInstance(value, /^effect$/i);
}

function isInstance(value: unknown, expression: RegExp): boolean {
	return expression.test(value?.constructor?.name ?? '');
}

/**
 * Is the value a reactive list?
 */
export function isList(value: unknown): value is List<unknown> {
	return isInstance(value, /^list$/i);
}

/**
 * Is the value a reactive value?
 */
export function isReactive(value: unknown): value is Reactive {
	return isInstance(value, /^computed|list|signal|store$/i);
}

/**
 * Is the value a reactive value?
 */
export function isSignal(value: unknown): value is Signal<unknown> {
	return isInstance(value, /^signal$/i);
}

/**
 * Is the value a reactive store?
 */
export function isStore(value: unknown): value is Store<PlainObject> {
	return isInstance(value, /^store$/i);
}
