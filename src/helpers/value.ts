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

export function getValue<Value>(reactive: ReactiveState<Value>): Value {
	watch(reactive);

	return reactive.value;
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
	return (...args: unknown[]): unknown => {
		const result = (
			array[operation as never] as (...args: unknown[]) => unknown
		)(...args);

		emit(reactive);

		length?.set(array.length);

		return result;
	};
}
