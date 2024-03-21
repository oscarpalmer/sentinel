import { ReactiveValue } from './reactive';
/**
 * A reactive list
 */
declare class List<T> extends ReactiveValue<T[]> {
    private readonly _length;
    /**
     * The length of the list
     */
    get length(): number;
    /**
     * Sets the length of the list
     */
    set length(value: number);
    /**
     * @inheritdoc
     */
    get value(): T[];
    constructor(value: T[]);
    /**
     * @inheritdoc
     */
    run(): void;
    /**
     * @inheritdoc
     */
    stop(): void;
}
/**
 * Creates a reactive list
 */
export declare function list<T>(value: T[]): List<T>;
export type { List };
