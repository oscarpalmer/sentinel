import {watch} from '../effect';
import type {ReactiveState, Signal} from '../models';
import {emit} from './event';

export const arrayOperations = new Set([
	'copyWithin',
	'fill',
	'pop',
	'push',
	'reverse',
	'shift',
	'sort',
	'splice',
	'unshift',
]);

export function getValue<Value>(
	reactive: ReactiveState<Value>,
	key?: PropertyKey,
): Value {
	watch(reactive, typeof key === 'symbol' ? undefined : key);

	return key == null
		? reactive.value
		: Array.isArray(reactive.value)
			? reactive.value.at(key as number)
			: reactive.value[key as never];
}

export function setValue<Value>(
	reactive: ReactiveState<Value>,
	value: Value,
): void {
	if (!Object.is(reactive.value, value)) {
		reactive.value = value;

		emit(reactive);
	}
}

export function updateArray<Value>(
	reactive: ReactiveState<Value[]>,
	array: Value[],
	operation: string,
	length?: Signal<number>,
): (...args: unknown[]) => unknown {
	const previous = array.slice();

	return (...args: unknown[]): unknown => {
		const result = (
			array[operation as never] as (...args: unknown[]) => unknown
		)(...args);

		let changed: number[] | undefined;

		if (reactive.callbacks.keys.size > 0) {
			changed = [];

			for (const key of reactive.callbacks.keys) {
				if (
					typeof key === 'number' &&
					!Object.is(previous.at(key), array.at(key))
				) {
					changed.push(key);
				}
			}
		}

		emit(reactive, changed);

		length?.set(array.length);

		return result;
	};
}
