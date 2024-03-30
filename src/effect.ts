import {type EffectState, Sentinel} from './models';

/**
 * A reactive effect for changes in values
 */
export class Effect extends Sentinel {
	protected declare readonly state: EffectState;

	constructor(callback: () => void) {
		super(false);

		this.state.callback = callback;
		this.state.values = new Set();

		this.start();
	}

	/**
	 * Starts reacting to changes
	 */
	start(): void {
		if (this.active) {
			return;
		}

		this.state.active = true;

		const index = globalThis._sentinels.push(this as never) - 1;

		this.state.callback();

		globalThis._sentinels.splice(index, 1);
	}

	/**
	 * Stops reacting to changes
	 */
	stop(): void {
		if (!this.active) {
			return;
		}

		this.state.active = false;

		for (const value of this.state.values) {
			value.state.effects.delete(this as never);
		}

		this.state.values.clear();
	}
}

/**
 * Creates a reactive effect
 */
export function effect(callback: () => void): Effect {
	return new Effect(callback);
}
