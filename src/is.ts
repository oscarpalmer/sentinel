import type {Computed} from './computed';
import type {Effect} from './effect';
import type {List} from './list';
import type {InternalSentinel} from './models';
import type {Signal} from './signal';

/**
 * Is the value a computed, reactive value?
 */
export function isComputed(value: unknown): value is Computed<unknown> {
	return isInstance(/^computed$/i, value);
}

/**
 * Is the value a reactive effect?
 */
export function isEffect(value: unknown): value is Effect {
	return isInstance(/^effect$/i, value);
}

function isInstance(expression: RegExp, value: unknown): boolean {
	return (
		expression.test((value as Record<string, unknown>)?.constructor?.name) &&
		(value as InternalSentinel).sentinel === true
	);
}

export function isList(value: unknown): value is List<unknown> {
	return isInstance(/^list$/i, value);
}

/**
 * Is the value a reactive value?
 */
export function isReactive(
	value: unknown,
): value is Computed<unknown> | List<unknown> | Signal<unknown> {
	return isInstance(/^computed|list|signal$/i, value);
}

/**
 * Is the value a reactive value?
 */
export function isSignal(value: unknown): value is Signal<unknown> {
	return isInstance(/^signal$/i, value);
}