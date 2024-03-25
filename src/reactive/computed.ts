import {Effect} from '../effect';
import {getValue, setValue} from '../helpers';
import {ReactiveValue} from '.';

/**
 * A computed, reactive value
 */
export class Computed<Value> extends ReactiveValue<Value> {
	/**
	 * @inheritdoc
	 */
	get value(): Value {
		return getValue(this as never) as Value;
	}

	/**
	 * Effect for computing the value
	 */
	private readonly effect: Effect;

	constructor(callback: () => Value) {
		super('computed', undefined as never);

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
export function computed<Value>(callback: () => Value): Computed<Value> {
	return new Computed(callback);
}
