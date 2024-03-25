import type {ArrayOrPlainObject} from '@oscarpalmer/atoms/is';
import type {InternalReactive} from '../models';
import type {Signal} from '../reactive/signal';
import {watch} from './effect';
import {emit} from './event';

export function getValue(reactive: InternalReactive): unknown {
	watch(reactive);

	return reactive._value;
}

export function setProxyValue(
	reactive: InternalReactive,
	target: ArrayOrPlainObject,
	length: Signal<number> | undefined,
	property: PropertyKey,
	value: unknown,
): boolean {
	const previous = Reflect.get(target, property);

	if (Object.is(previous, value)) {
		return true;
	}

	const result = Reflect.set(target, property, value);

	if (result) {
		emit(reactive as InternalReactive);

		if (Array.isArray(target)) {
			length?.set(target.length);
		}
	}

	return result;
}

export function setValue(reactive: InternalReactive, value: unknown): void {
	if (!Object.is(reactive._value, value)) {
		reactive._value = value;

		emit(reactive);
	}
}
