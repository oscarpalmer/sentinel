import type {Key} from '@oscarpalmer/atoms/models';
import type {EffectState, ReactiveState} from './models';

/**
 * A reactive effect for changes in a value
 */
export class Effect {
	private readonly $sentinel = 'effect';
	private readonly state: EffectState;

	constructor(callback: () => void) {
		this.state = {
			callback,
			active: false,
			reactives: new Set(),
		};

		this.start();
	}

	/**
	 * Starts reacting to changes
	 */
	start(): void {
		if (!this.state.active) {
			this.state.active = true;

			const index = globalThis._sentinels.push(this.state) - 1;

			this.state.callback();

			globalThis._sentinels.splice(index, 1);
		}
	}

	/**
	 * Stops reacting to changes
	 */
	stop(): void {
		if (this.state.active) {
			this.state.active = false;

			for (const reactive of this.state.reactives) {
				reactive.callbacks.any.delete(this.state);

				for (const [key, keyed] of reactive.callbacks.values) {
					keyed.delete(this.state);

					if (keyed.size === 0) {
						reactive.callbacks.keys.delete(key);
					}
				}
			}

			this.state.reactives.clear();
		}
	}
}

/**
 * Creates a reactive effect
 */
export function effect(callback: () => void): Effect {
	return new Effect(callback);
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
