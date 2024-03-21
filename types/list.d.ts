import { Reactive } from './reactive';
/**
 * A reactive list
 */
export declare class List<T> extends Reactive<T[]> {
    private readonly _length;
    /**
     * The length of the list
     */
    get length(): number;
    /**
     * @inheritdoc
     */
    get value(): T[];
    /**
     * Sets the length of the list
     */
    set length(value: number);
    constructor(value: T[]);
}
/**
 * Creates a reactive list
 */
export declare function list<T>(value: T[]): List<T>;
