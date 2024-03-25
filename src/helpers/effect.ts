import type {InternalEffect, InternalReactive} from '../models';

export function watch(reactive: InternalReactive): void {
	const effect = globalThis._sentinels[
		globalThis._sentinels.length - 1
	] as InternalEffect;

	if (effect == null) {
		return;
	}

	reactive.effects.add(effect);
	effect.values.add(reactive);
}
