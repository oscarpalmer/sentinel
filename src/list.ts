import {emitValue, getValue, startReactivity, stopReactivity} from './helpers';
import {ReactiveValue} from './reactive';

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
class List<T> extends ReactiveValue<T[]> {
	/**
	 * @inheritdoc
	 */
	get value(): T[] {
		return getValue(this as never) as T[];
	}

	constructor(value: T[]) {
		super(
			new Proxy(value, {
				get: (target, property) => {
					return operations.has(property as never)
						? operation(this as never, target, property as never)
						: Reflect.get(target, property);
				},
				set: (target, property, value) => {
					const result = Reflect.set(target, property, value);

					if (result) {
						emitValue(this as never);
					}

					return result;
				},
			}),
		);
	}

	/**
	 * @inheritdoc
	 */
	run(): void {
		startReactivity(this as never);
	}

	/**
	 * @inheritdoc
	 */
	stop(): void {
		stopReactivity(this as never);
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
	array: unknown[],
	operation: string,
): unknown {
	return (...args: unknown[]): unknown => {
		const result = (
			array[operation as never] as (...args: unknown[]) => unknown
		)(...args);

		emitValue(list as never);

		return result;
	};
}

export type {List};
