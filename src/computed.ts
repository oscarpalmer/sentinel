import {Effect} from './effect';
import {getValue, setValue} from './helpers';
import {Reactive} from './reactive';

/**
 * A computed, reactive value
 */
export class Computed<T> extends Reactive<T> {
	/**
	 * @inheritdoc
	 */
	get value(): T {
		return getValue(this as never) as T;
	}

	/**
	 * Effect for computing the value
	 */
	private readonly effect: Effect;

	constructor(callback: () => T) {
		super(undefined as never);

		this.effect = new Effect(() => setValue(this as never, callback()));
	}

	/**
	 * @inheritdoc
	 */
	run(): void {
		this.effect.start();
	}

	/**
	 * @inheritdoc
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
