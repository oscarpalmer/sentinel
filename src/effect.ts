import {Sentinel, type InternalReactive} from './models';

/**
 * A reactive effect for changes in values
 */
export class Effect extends Sentinel {
	/**
	 * Values accessed by the effect
	 */
	private values = new Set<InternalReactive>();

	constructor(private readonly callback: () => void) {
		super('effect', false);

		this.start();
	}

	/**
	 * Starts reacting to changes
	 */
	start(): void {
		if (this.active) {
			return;
		}

		this.active = true;

		const index = globalThis._sentinels.push(this as never) - 1;

		this.callback();

		globalThis._sentinels.splice(index, 1);
	}

	/**
	 * Stops reacting to changes
	 */
	stop(): void {
		if (!this.active) {
			return;
		}

		this.active = false;

		for (const value of this.values) {
			value.effects.delete(this as never);
		}

		this.values.clear();
	}
}

/**
 * Creates a reactive effect
 */
export function effect(callback: () => void): Effect {
	return new Effect(callback);
}
