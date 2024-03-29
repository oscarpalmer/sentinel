import type {InternalEffect, InternalReactive} from '../models';

export function watch(reactive: InternalReactive): void {
	const effect = globalThis._sentinels[
		globalThis._sentinels.length - 1
	] as InternalEffect;

	if (effect == null) {
		return;
	}

	reactive.state.effects.add(effect);
	effect.state.values.add(reactive);
}
