import type {PlainObject} from '@oscarpalmer/atoms/is';
import type {Computed} from './computed';
import type {Effect} from './effect';
import type {Item} from './item';
import type {List} from './list';
import type {InternalSentinel} from './models';
import type {Signal} from './signal';

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

export function isItem(value: unknown): value is Item<PlainObject> {
	return (value as InternalSentinel)?.type === 'item';
}

export function isList(value: unknown): value is List<unknown> {
	return (value as InternalSentinel)?.type === 'list';
}

/**
 * Is the value a reactive value?
 */
export function isReactive(
	value: unknown,
): value is Computed<unknown> | List<unknown> | Signal<unknown> {
	return ['computed', 'item', 'list', 'signal'].includes(
		(value as InternalSentinel)?.type,
	);
}

/**
 * Is the value a reactive value?
 */
export function isSignal(value: unknown): value is Signal<unknown> {
	return (value as InternalSentinel)?.type === 'signal';
}
