import type {ReactiveState} from '../models';
import {Computed} from './computed';
import {ReactiveObject} from './object';
import {Signal} from './signal';

type ListState<Value> = {
	length: Signal<number>;
} & ReactiveState<Value[]>;

/**
 * A reactive list
 */
export class List<Value> extends ReactiveObject<Value[]> {
	protected declare readonly state: ListState<Value>;

	/**
	 * The length of the list
	 */
	get length(): number {
		return this.state.length.get();
	}

	/**
	 * Sets the length of the list
	 */
	set length(value: number) {
		this.state.value.length = value < 0 ? 0 : value;
	}

	constructor(value: Value[]) {
		const length = new Signal(value.length);

		super(value, true, length);

		this.state.length = length;
	}

	/**
	 * Gets the value at the specified index
	 */
	at(index: number): Value | undefined {
		return this.state.value.at(index);
	}

	/**
	 * Calls a defined callback function on each value in the list, and returns a computed value that contains the results
	 */
	map<Next>(
		callbackfn: (value: Value, index: number, array: Value[]) => Next,
	): Computed<Next[]> {
		return new Computed(() => this.state.value.map(callbackfn));
	}

	/**
	 * Appends new values to the end of the list, and returns the new length of the list
	 */
	push(...values: Value[]): number {
		return this.state.value.push(...values);
	}

	/**
	 * Removes values from the list and, if necessary, inserts new values in their place, returning the deleted values
	 */
	splice(start: number, deleteCount?: number, ...values: Value[]): Value[] {
		return this.state.value.splice(start, deleteCount ?? 0, ...values);
	}
}

/**
 * Creates a reactive list
 */
export function list<Value>(value: Value[]) {
	return new List<Value>(value);
}
