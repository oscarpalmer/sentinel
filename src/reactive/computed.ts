import {effect} from '../effect';
import {setValue} from '../helpers/value';
import type {Computed} from '../models';
import {reactiveValue} from './value';

/**
 * Creates a computed, reactive value
 */
export function computed<Value>(value: () => Value): Computed<Value> {
	const original = reactiveValue<Value>(undefined as never);

	const fx = effect(() => setValue(original.state, value()));

	const instance = Object.create({
		...original.callbacks,
		run(): void {
			fx.start();
		},
		stop(): void {
			fx.stop();
		},
	});

	Object.defineProperty(instance, '$sentinel', {
		value: 'computed',
	});

	return instance;
}
