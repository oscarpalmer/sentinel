import {getValue} from '../helpers/value';
import type {Computed, ReactiveArray} from '../models';
import {computed} from './computed';
import {reactiveObject} from './object';

export function array<Value>(value: Value[]): ReactiveArray<Value> {
	const original = reactiveObject(value);

	const instance = Object.create({
		...original.callbacks,
		filter(
			callbackFn: (value: Value, index: number, array: Value[]) => boolean,
		) {
			return computed(() => getValue(original.state).filter(callbackFn));
		},
		insert(index: number, ...value: Value[]) {
			original.state.value.splice(index, 0, ...value);

			return original.length?.peek();
		},
		map<Next>(
			callbackfn: (value: Value, index: number, array: Value[]) => Next,
		): Computed<Next[]> {
			return computed(() => getValue(original.state).map(callbackfn));
		},
		push(...values: Value[]): number {
			return original.state.value.push(...values);
		},
		splice(start: number, deleteCount?: number, ...values: Value[]): Value[] {
			return original.state.value.splice(start, deleteCount ?? 0, ...values);
		},
		toArray() {
			return original.state.value.slice();
		},
	});

	Object.defineProperties(instance, {
		$sentinel: {
			value: 'array',
		},
		length: {
			get() {
				return original.length?.get();
			},
			set(value) {
				original.state.value.length = value < 0 ? 0 : value;
			},
		},
	});

	return instance;
}
