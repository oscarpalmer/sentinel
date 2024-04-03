import type {ArrayOrPlainObject} from '@oscarpalmer/atoms/models';
import type {ReactiveState, Signal} from '../models';
import {emit} from './event';
import {isReactive} from './is';
import {arrayOperations, updateArray} from './value';

export function getProxyValue(
	reactive: ReactiveState<ArrayOrPlainObject>,
	target: ArrayOrPlainObject,
	property: PropertyKey,
	isArray: boolean,
	length?: Signal<number>,
): unknown {
	if (isArray && arrayOperations.has(property as never)) {
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
	reactive: ReactiveState<ArrayOrPlainObject>,
	target: ArrayOrPlainObject,
	property: PropertyKey,
	value: unknown,
	length?: Signal<number>,
): boolean {
	if (Object.is(Reflect.get(target, property), value)) {
		return true;
	}

	const result = Reflect.set(target, property, value);

	if (result) {
		emit(reactive);

		length?.set((target as unknown[]).length);
	}

	return result;
}
