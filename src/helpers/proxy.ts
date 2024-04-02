import {isArrayOrPlainObject} from '@oscarpalmer/atoms/is';
import type {ArrayOrPlainObject, PlainObject} from '@oscarpalmer/atoms/models';
import type {ReactiveObject} from '../reactive/object';
import type {Signal} from '../reactive/signal';
import {emit} from './event';
import {arrayOperations, updateArray} from './value';

export function createProxy<Model extends ArrayOrPlainObject>(
	store: ReactiveObject<Model>,
	value: Model,
	length?: Signal<number>,
): Model {
	const isArray = Array.isArray(value);

	const proxied = new Proxy(isArray ? value : {}, {
		get: (target, property) =>
			getProxyValue(store as never, target, property, isArray),
		set: (target, property, value) =>
			setProxyValue(store as never, target, property, value, length),
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

	return proxied as Model;
}

export function getProxyValue(
	obj: ReactiveObject<never>,
	target: ArrayOrPlainObject,
	property: PropertyKey,
	isArray: boolean,
	length?: Signal<number>,
): unknown {
	return isArray && arrayOperations.has(property as never)
		? updateArray(obj, target as never, property as never, length)
		: Reflect.get(target, property);
}

export function setProxyValue(
	obj: ReactiveObject<never>,
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
			? createProxy(obj as never, value)
			: value;

	const result = Reflect.set(target, property, next);

	if (result) {
		emit(obj as never);

		length?.set((target as unknown[]).length);
	}

	return result;
}
