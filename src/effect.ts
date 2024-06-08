import type {Key} from '@oscarpalmer/atoms/models';
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
					reactive.callbacks.any.delete(state);

					for (const [, keyed] of reactive.callbacks.values) {
						keyed.delete(state);
					}
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

export function watch<Value>(reactive: ReactiveState<Value>, key?: Key): void {
	const effect = globalThis._sentinels[
		globalThis._sentinels.length - 1
	] as EffectState;

	if (effect != null) {
		if (key == null) {
			reactive.callbacks.any.add(effect);
		} else {
			if (!reactive.callbacks.keys.has(key)) {
				reactive.callbacks.keys.add(key);
				reactive.callbacks.values.set(key, new Set());
			}

			reactive.callbacks.values.get(key)?.add(effect);
		}

		effect.reactives.add(reactive as never);
	}
}
