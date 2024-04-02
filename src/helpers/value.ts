import type {InternalReactive} from '../models';
import type {ReactiveObject} from '../reactive/object';
import type {Signal} from '../reactive/signal';
import {watch} from './effect';
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

export function getValue(reactive: InternalReactive): unknown {
	watch(reactive);

	return reactive.state.value;
}

export function setValue(reactive: InternalReactive, value: unknown): void {
	if (!Object.is(reactive.state.value, value)) {
		reactive.state.value = value;

		emit(reactive);
	}
}

export function updateArray(
	obj: ReactiveObject<never>,
	array: unknown[],
	operation: string,
	length?: Signal<number>,
): (...args: unknown[]) => unknown {
	return (...args: unknown[]): unknown => {
		const result = (
			array[operation as never] as (...args: unknown[]) => unknown
		)(...args);

		emit(obj as never);

		length?.set(array.length);

		return result;
	};
}
