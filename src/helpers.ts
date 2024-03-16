import {queue} from '@oscarpalmer/atoms/queue';
import type {InternalReactiveValue} from './models';

export function getValue(value: InternalReactiveValue): unknown {
	const effect = globalThis._sentinels[globalThis._sentinels.length - 1];

	if (effect != null) {
		value.effects.add(effect);
		effect.values.add(value);
	}

	return value._value;
}

export function setValue(
	reactive: InternalReactiveValue,
	value: unknown,
	run: boolean,
): void {
	if (!run && Object.is(reactive._value, value)) {
		return;
	}

	reactive._value = value;

	if (reactive.active) {
		for (const effect of reactive.effects) {
			queue(effect.callback);
		}
	}
}
