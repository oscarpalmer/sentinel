import { ReactiveObject } from './object';
/**
 * A reactive list
 */
export declare class List<Value> extends ReactiveObject<Value[]> {
    private readonly _length;
    /**
     * The length of the list
     */
    get length(): number;
    /**
     * @inheritdoc
     */
    get value(): Value[];
    /**
     * Sets the length of the list
     */
    set length(value: number);
    constructor(value: Value[]);
    /**
     * Gets the value at the specified index
     */
    at(index: number): Value | undefined;
}
/**
 * Creates a reactive list
 */
export declare function list<Value>(value: Value[]): List<Value>;
