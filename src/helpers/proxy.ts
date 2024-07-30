import type {ReactiveState} from '../models';
import type {Signal} from '../reactive/signal';
import {emit} from './event';
import {isReactive} from './is';
import {arrayOperations, updateArray} from './value';

export function getProxyValue(
	reactive: ReactiveState<object>,
	target: object,
	property: PropertyKey,
	length?: Signal<number>,
): unknown {
	if (length != null && arrayOperations.has(property as never)) {
		return updateArray(
			reactive as ReactiveState<unknown[]>,
			target as unknown[],
			property as string,
			length,
		);
	}

	const value = Reflect.get(target, property);

	return isReactive(value) ? value.get() : value;
}

export function setProxyValue(
	reactive: ReactiveState<object>,
	target: object,
	property: PropertyKey,
	value: unknown,
	length?: Signal<number>,
): boolean {
	if (Object.is(Reflect.get(target, property), value)) {
		return true;
	}

	const result = Reflect.set(target, property, value);

	if (result) {
		emit(
			reactive,
			typeof property === 'string'
				? length == null
					? [property]
					: /^\d+$/.test(property)
						? [Number.parseInt(property, 10)]
						: undefined
				: undefined,
		);

		length?.set((target as unknown[]).length);
	}

	return result;
}
