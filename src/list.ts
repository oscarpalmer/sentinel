import {emitValue, getValue, setProxyValue} from './helpers';
import {ReactiveObject} from './reactive';
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
export class List<Value> extends ReactiveObject<Value[]> {
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
	get value(): Value[] {
		return getValue(this as never) as Value[];
	}

	/**
	 * Sets the length of the list
	 */
	set length(value: number) {
		this._value.length = value < 0 ? 0 : value;
	}

	constructor(value: Value[]) {
		super(
			'list',
			new Proxy(value, {
				get: (target, property) => {
					return operations.has(property as never)
						? operation(this as never, this._length, target, property as never)
						: Reflect.get(target, property);
				},
				set: (target, property, value) =>
					setProxyValue(this as never, target, this._length, property, value),
			}),
		);

		this._length.value = value.length;
	}

	/**
	 * Gets the value at the specified index
	 */
	at(index: number): Value | undefined {
		return this._value.at(index);
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

		emitValue(list as never);

		length.set(array.length);

		return result;
	};
}
