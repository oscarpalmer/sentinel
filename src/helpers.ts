import {queue} from '@oscarpalmer/atoms/queue';
import type {InternalReactive} from './models';

export function emitValue(reactive: InternalReactive): void {
	if (reactive.active) {
		for (const effect of reactive.effects) {
			queue(effect.callback);
		}
	}
}

export function getValue(reactive: InternalReactive): unknown {
	const effect =
		globalThis._sentinels[globalThis._sentinels.length - 1];

	if (effect != null) {
		reactive.effects.add(effect);
		effect.values.add(reactive);
	}

	return reactive._value;
}

export function setValue(reactive: InternalReactive, value: unknown): void {
	if (Object.is(reactive._value, value)) {
		return;
	}

	reactive._value = value;

	emitValue(reactive);
}

export function startReactivity(reactive: InternalReactive): void {
	if (reactive.active) {
		return;
	}

	reactive.active = true;

	emitValue(reactive);
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
