import type {PlainObject} from '@oscarpalmer/atoms/is';
import type {Computed} from '../reactive/computed';
import type {Effect} from '../effect';
import type {List} from '../reactive/list';
import type {InternalSentinel} from '../models';
import type {Signal} from '../reactive/signal';
import type {Store} from '../reactive/store';

/**
 * Is the value a computed, reactive value?
 */
export function isComputed(value: unknown): value is Computed<unknown> {
	return (value as InternalSentinel)?.type === 'computed';
}

/**
 * Is the value a reactive effect?
 */
export function isEffect(value: unknown): value is Effect {
	return (value as InternalSentinel)?.type === 'effect';
}

/**
 * Is the value a reactive list?
 */
export function isList(value: unknown): value is List<unknown> {
	return (value as InternalSentinel)?.type === 'list';
}

/**
 * Is the value a reactive value?
 */
export function isReactive(
	value: unknown,
): value is Computed<unknown> | List<unknown> | Signal<unknown> {
	return ['computed', 'list', 'signal', 'store'].includes(
		(value as InternalSentinel)?.type,
	);
}

/**
 * Is the value a reactive value?
 */
export function isSignal(value: unknown): value is Signal<unknown> {
	return (value as InternalSentinel)?.type === 'signal';
}

/**
 * Is the value a reactive store?
 */
export function isStore(value: unknown): value is Store<PlainObject> {
	return (value as InternalSentinel)?.type === 'store';
}
