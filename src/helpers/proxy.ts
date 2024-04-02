import {isArrayOrPlainObject} from '@oscarpalmer/atoms/is';
import type {ArrayOrPlainObject, PlainObject} from '@oscarpalmer/atoms/models';
import type {ReactiveState, Signal} from '../models';
import {emit} from './event';
import {arrayOperations, updateArray} from './value';

export function createProxy(
	reactive: ReactiveState<ArrayOrPlainObject>,
	value: ArrayOrPlainObject,
	length?: Signal<number>,
): ArrayOrPlainObject {
	const isArray = Array.isArray(value);

	const proxied = new Proxy(isArray ? value : {}, {
		get: (target, property) =>
			getProxyValue(reactive, target, property, isArray),
		set: (target, property, value) =>
			setProxyValue(reactive, target, property, value, length),
	}) as PlainObject;

	if (!isArray) {
		const keys = Object.keys(value);
		const size = keys.length;

		let index = 0;

		for (; index < size; index += 1) {
			const key = keys[index];

			proxied[key as never] = value[key as never];
		}
	}

	return proxied;
}

export function getProxyValue(
	reactive: ReactiveState<ArrayOrPlainObject>,
	target: ArrayOrPlainObject,
	property: PropertyKey,
	isArray: boolean,
	length?: Signal<number>,
): unknown {
	return isArray && arrayOperations.has(property as never)
		? updateArray(
				reactive as ReactiveState<unknown[]>,
				target as unknown[],
				property as string,
				length,
			)
		: Reflect.get(target, property);
}

export function setProxyValue(
	reactive: ReactiveState<ArrayOrPlainObject>,
	target: ArrayOrPlainObject,
	property: PropertyKey,
	value: unknown,
	length?: Signal<number>,
): boolean {
	const previous = Reflect.get(target, property);

	if (Object.is(previous, value)) {
		return true;
	}

	const next =
		length != null && isArrayOrPlainObject(value)
			? createProxy(reactive, value)
			: value;

	const result = Reflect.set(target, property, next);

	if (result) {
		emit(reactive);

		length?.set((target as unknown[]).length);
	}

	return result;
}
