import {emitValue, getValue, setProxyValue} from './helpers';
import {Reactive} from './reactive';
import {Signal} from './signal';

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
export class List<T> extends Reactive<T[]> {
	private readonly _length = new Signal(0);

	/**
	 * The length of the list
	 */
	get length(): number {
		return this._length.value;
	}

	/**
	 * @inheritdoc
	 */
	get value(): T[] {
		return getValue(this as never) as T[];
	}

	/**
	 * Sets the length of the list
	 */
	set length(value: number) {
		this._value.length = value < 0 ? 0 : value;
	}

	constructor(value: T[]) {
		super(
			new Proxy(value, {
				get: (target, property) => {
					return operations.has(property as never)
						? operation(this as never, this._length, target, property as never)
						: Reflect.get(target, property);
				},
				set: (target, property, value) =>
					setProxyValue(this as never, target, property, value),
			}),
		);

		this._length.value = value.length;
	}
}

/**
 * Creates a reactive list
 */
export function list<T>(value: T[]) {
	return new List<T>(value);
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

		emitValue(list as never);

		length.set(array.length);

		return result;
	};
}
