import {Sentinel, type InternalReactiveValue} from './models';

/**
 * A reactive effect
 */
export class Effect extends Sentinel {
	/**
	 * Values accessed by the effect
	 */
	private values = new Set<InternalReactiveValue>();

	constructor(private readonly callback: () => void) {
		super(false);

		this.run();
	}

	/**
	 * Enables reactivity for the effect, if it was stopped
	 */
	run(): void {
		if (this.active) {
			return;
		}

		this.active = true;

		const index = globalThis._sentinels.push(this as never) - 1;

		this.callback();

		globalThis._sentinels.splice(index, 1);
	}

	/**
	 * Disables reactivity for the effect, if it's running
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
