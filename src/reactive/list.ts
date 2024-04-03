import type {Computed, List} from '../models';
import {computed} from './computed';
import {reactiveObject} from './object';
import {signal} from './signal';

export function list<Value>(value: Value[]): List<Value> {
	const length = signal(value.length);
	const original = reactiveObject(value, length);

	const instance = Object.create({
		...original.callbacks,
		at(index: number): Value | undefined {
			return original.state.value.at(index);
		},
		map<Next>(
			callbackfn: (value: Value, index: number, array: Value[]) => Next,
		): Computed<Next[]> {
			return computed(() => original.state.value.map(callbackfn));
		},
		push(...values: Value[]): number {
			return original.state.value.push(...values);
		},
		splice(start: number, deleteCount?: number, ...values: Value[]): Value[] {
			return original.state.value.splice(start, deleteCount ?? 0, ...values);
		},
	});

	Object.defineProperties(instance, {
		$sentinel: {
			value: 'list',
		},
		length: {
			get() {
				return length.get();
			},
			set(value) {
				original.state.value.length = value < 0 ? 0 : value;
			},
		},
	});

	return instance;
}
