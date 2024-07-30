import {type Effect, effect} from '../effect';
import {setValue} from '../helpers/value';
import {ReactiveValue} from './value';

/**
 * A computed, reactive value
 */
export class Computed<Value> extends ReactiveValue<Value> {
	private readonly fx: Effect;

	constructor(value: () => Value) {
		super('computed', undefined as never);

		this.fx = effect(() => setValue(this.state, value()));
	}

	/**
	 * @inheritdoc
	 */
	run(): void {
		this.fx.start();
	}

	/**
	 * @inheritdoc
	 */
	stop(): void {
		this.fx.stop();
	}
}

/**
 * Creates a computed, reactive value
 */
export function computed<Value>(value: () => Value): Computed<Value> {
	return new Computed(value);
}
