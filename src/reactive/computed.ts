import {Effect} from '../effect';
import {getValue, setValue} from '../helpers/value';
import type {ReactiveState} from '../models';
import {ReactiveValue} from './value';

type ComputedState<Value> = {
	effect: Effect;
} & ReactiveState<Value>;

/**
 * A computed, reactive value
 */
export class Computed<Value> extends ReactiveValue<Value> {
	protected declare readonly state: ComputedState<Value>;

	/**
	 * @inheritdoc
	 */
	get value(): Value {
		return getValue(this as never) as Value;
	}

	constructor(callback: () => Value) {
		super('computed', undefined as never);

		this.state.effect = new Effect(() => setValue(this as never, callback()));
	}

	/**
	 * @inheritdoc
	 */
	run(): void {
		this.state.effect.start();
	}

	/**
	 * @inheritdoc
	 */
	stop(): void {
		this.state.effect.stop();
	}
}

/**
 * Creates a computed, reactive value
 */
export function computed<Value>(callback: () => Value): Computed<Value> {
	return new Computed(callback);
}
