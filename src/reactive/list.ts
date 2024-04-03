import {getProxyValue, setProxyValue} from '../helpers/proxy';
import {getValue} from '../helpers/value';
import type {Computed, List} from '../models';
import {computed} from './computed';
import {signal} from './signal';
import {reactiveValue} from './value';

export function list<Value>(value: Value[]): List<Value> {
	const length = signal(value.length);
	const original = reactiveValue([] as Value[]);

	original.state.value = new Proxy(value, {
		get(target, property) {
			return getProxyValue(original.state as never, target, property, length);
		},
		set(target, property, value) {
			return setProxyValue(
				original.state as never,
				target,
				property,
				value,
				length,
			);
		},
	});

	const instance = Object.create({
		...original.callbacks,
		at(index: number): Value | undefined {
			return original.state.value.at(index);
		},
		get(property: unknown) {
			return property == null
				? getValue(original.state)
				: original.state.value[property as never];
		},
		map<Next>(
			callbackfn: (value: Value, index: number, array: Value[]) => Next,
		): Computed<Next[]> {
			return computed(() => original.state.value.map(callbackfn));
		},
		peek(property: unknown) {
			return property == null
				? original.state.value
				: original.state.value[property as never];
		},
		push(...values: Value[]): number {
			return original.state.value.push(...values);
		},
		set(property: unknown, value: unknown) {
			original.state.value[property as never] = value as never;
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
