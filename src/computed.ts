import {Effect} from './effect';
import {getValue, setValue} from './helpers';
import {ReactiveValue} from './reactive';

/**
 * A computed, reactive value
 */
export class Computed<T = unknown> extends ReactiveValue<T> {
	/**
	 * Watcher for computing the value
	 */
	private readonly effect: Effect;

	/**
	 * @inheritdoc
	 */
	get value(): T {
		return getValue(this as never) as T;
	}

	constructor(callback: () => T) {
		super(undefined as never);

		this.effect = new Effect(() =>
			setValue(this as never, callback()),
		);
	}

	/**
	 * Enables reactivity, if it was stopped
	 */
	run(): void {
		this.effect.start();
	}

	/**
	 * Disables reactivity, if it's running
	 */
	stop(): void {
		this.effect.stop();
	}
}

/**
 * Creates a computed, reactive value
 */
export function computed<T>(callback: () => T): Computed<T> {
	return new Computed(callback);
}
