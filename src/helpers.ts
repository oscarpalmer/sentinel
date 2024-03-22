import type {ArrayOrPlainObject} from '@oscarpalmer/atoms/is';
import {queue} from '@oscarpalmer/atoms/queue';
import type {InternalReactive} from './models';
import type {Signal} from './signal';

export function emitValue(reactive: InternalReactive): void {
	if (reactive.active) {
		for (const effect of reactive.effects) {
			queue(effect.callback);
		}
	}
}

export function getValue(reactive: InternalReactive): unknown {
	const effect = globalThis._sentinels[globalThis._sentinels.length - 1];

	if (effect != null) {
		reactive.effects.add(effect);
		effect.values.add(reactive);
	}

	return reactive._value;
}

function setAndEmit(
	reactive: InternalReactive,
	key: '_value' | 'active',
	value: unknown,
): void {
	reactive[key] = value as never;

	emitValue(reactive);
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
		emitValue(reactive as InternalReactive);

		if (Array.isArray(target)) {
			length?.set(target.length);
		}
	}

	return result;
}

export function setValue(reactive: InternalReactive, value: unknown): void {
	if (!Object.is(reactive._value, value)) {
		setAndEmit(reactive, '_value', value);
	}
}

export function startReactivity(reactive: InternalReactive): void {
	if (!reactive.active) {
		setAndEmit(reactive, 'active', true);
	}
}

export function stopReactivity(reactive: InternalReactive): void {
	if (!reactive.active) {
		return;
	}

	reactive.active = false;

	for (const effect of reactive.effects) {
		effect.values.delete(reactive);
	}
}
