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
			return getValue(original.state).at(index);
		},
		filter(
			callbackFn: (value: Value, index: number, array: Value[]) => boolean,
		) {
			return computed(() => getValue(original.state).filter(callbackFn));
		},
		find(callbackFn: (value: Value, index: number, array: Value[]) => boolean) {
			return getValue(original.state).find(callbackFn);
		},
		findIndex(
			callbackFn: (value: Value, index: number, array: Value[]) => boolean,
		) {
			return getValue(original.state).findIndex(callbackFn);
		},
		get(property: unknown) {
			return property == null
				? getValue(original.state)
				: original.state.value[property as never];
		},
		includes(searchElement: Value, fromIndex?: number) {
			return getValue(original.state).includes(searchElement, fromIndex);
		},
		indexOf(searchElement: Value, fromIndex?: number) {
			return getValue(original.state).indexOf(searchElement, fromIndex);
		},
		insert(index: number, ...value: Value[]) {
			original.state.value.splice(index, 0, ...value);

			return length.peek();
		},
		map<Next>(
			callbackfn: (value: Value, index: number, array: Value[]) => Next,
		): Computed<Next[]> {
			return computed(() => getValue(original.state).map(callbackfn));
		},
		peek(property: unknown) {
			return property == null
				? original.state.value
				: original.state.value[property as never];
		},
		pop() {
			return original.state.value.pop();
		},
		push(...values: Value[]): number {
			return original.state.value.push(...values);
		},
		set(first: unknown, second: unknown) {
			const isArray = Array.isArray(first);

			original.state.value.splice(
				isArray ? 0 : (first as never),
				isArray ? original.state.value.length : 1,
				...(isArray ? first : [second]),
			);
		},
		shift() {
			return original.state.value.shift();
		},
		splice(start: number, deleteCount?: number, ...values: Value[]): Value[] {
			return original.state.value.splice(start, deleteCount ?? 0, ...values);
		},
		unshift(...values: Value[]): number {
			return original.state.value.unshift(...values);
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
