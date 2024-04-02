import type {Effect, EffectState, ReactiveState} from './models';

/**
 * Creates a reactive effect
 */
export function effect(callback: () => void): Effect {
	const state: EffectState = {
		callback,
		active: false,
		reactives: new Set(),
	};

	const instance = Object.create({
		start(): void {
			if (!state.active) {
				state.active = true;

				const index = globalThis._sentinels.push(state) - 1;

				state.callback();

				globalThis._sentinels.splice(index, 1);
			}
		},

		stop(): void {
			if (state.active) {
				state.active = false;

				for (const reactive of state.reactives) {
					reactive.effects.delete(state);
				}

				state.reactives.clear();
			}
		},
	});

	Object.defineProperty(instance, '$sentinel', {
		value: 'effect',
	});

	instance.start();

	return instance;
}

export function watch<Value>(reactive: ReactiveState<Value>): void {
	const effect = globalThis._sentinels[
		globalThis._sentinels.length - 1
	] as EffectState;

	if (effect != null) {
		reactive.effects.add(effect);
		effect.reactives.add(reactive as never);
	}
}
