import {isArrayOrPlainObject} from '@oscarpalmer/atoms/is';
import type {ArrayOrPlainObject} from '@oscarpalmer/atoms/models';
import type {InternalReactive} from '../models';
import type {ReactiveObject} from '../reactive/object';
import type {Signal} from '../reactive/signal';
import {watch} from './effect';
import {emit} from './event';

const operations = new Set([
	'copyWithin',
	'fill',
	'pop',
	'push',
	'reverse',
	'shift',
	'sort',
	'splice',
	'unshift',
]);

export function getProxyValue(
	obj: ReactiveObject<never>,
	target: ArrayOrPlainObject,
	property: PropertyKey,
	isArray: boolean,
): unknown {
	return isArray && operations.has(property as never)
		? updateArray(obj, target as never, property as never)
		: Reflect.get(target, property);
}

export function getValue(reactive: InternalReactive): unknown {
	watch(reactive);

	return reactive.state.value;
}

export function setProxyValue(
	obj: ReactiveObject<never>,
	target: ArrayOrPlainObject,
	property: PropertyKey,
	value: unknown,
	length?: Signal<number>,
	wrapper?: (store: ReactiveObject<never>, value: unknown) => unknown,
): boolean {
	const previous = Reflect.get(target, property);

	if (Object.is(previous, value)) {
		return true;
	}

	const next =
		typeof wrapper === 'function' && isArrayOrPlainObject(value)
			? wrapper(obj, value)
			: value;

	const result = Reflect.set(target, property, next);

	if (result) {
		emit(obj as never);

		length?.set((target as unknown[]).length);
	}

	return result;
}

export function setValue(reactive: InternalReactive, value: unknown): void {
	if (!Object.is(reactive.state.value, value)) {
		reactive.state.value = value;

		emit(reactive);
	}
}

export function updateArray(
	obj: ReactiveObject<never>,
	array: unknown[],
	operation: string,
	length?: Signal<number>,
): (...args: unknown[]) => unknown {
	return (...args: unknown[]): unknown => {
		const result = (
			array[operation as never] as (...args: unknown[]) => unknown
		)(...args);

		emit(obj as never);

		length?.set(array.length);

		return result;
	};
}
