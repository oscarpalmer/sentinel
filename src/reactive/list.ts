import {emit} from '../helpers/event';
import {setProxyValue} from '../helpers/value';
import type {ReactiveState} from '../models';
import {ReactiveObject} from './object';
import {Signal} from './signal';

type ListState<Value> = {
	length: Signal<number>;
} & ReactiveState<Value[]>;

/**
 * Array operations that should trigger reactivity
 */
const operations = new Set([
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

/**
 * A reactive list
 */
export class List<Value> extends ReactiveObject<Value[]> {
	protected declare readonly state: ListState<Value>;

	/**
	 * The length of the list
	 */
	get length(): number {
		return this.state.length.value;
	}

	/**
	 * Sets the length of the list
	 */
	set length(value: number) {
		this.state.value.length = value < 0 ? 0 : value;
	}

	constructor(value: Value[]) {
		super(
			'list',
			new Proxy(value, {
				get: (target, property) => {
					return operations.has(property as never)
						? operation(
								this as never,
								this.state.length,
								target,
								property as never,
						  )
						: Reflect.get(target, property);
				},
				set: (target, property, value) =>
					setProxyValue(
						this as never,
						target,
						this.state.length,
						property,
						value,
					),
			}),
		);

		this.state.length = new Signal(value.length);
	}

	/**
	 * Gets the value at the specified index
	 */
	at(index: number): Value | undefined {
		return this.state.value.at(index);
	}
}

/**
 * Creates a reactive list
 */
export function list<Value>(value: Value[]) {
	return new List<Value>(value);
}

function operation(
	list: List<unknown>,
	length: Signal<number>,
	array: unknown[],
	operation: string,
): unknown {
	return (...args: unknown[]): unknown => {
		const result = (
			array[operation as never] as (...args: unknown[]) => unknown
		)(...args);

		emit(list as never);

		length.set(array.length);

		return result;
	};
}
