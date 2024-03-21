import { Reactive } from './reactive';
/**
 * A reactive value
 */
export declare class Signal<T> extends Reactive<T> {
    /**
     * @inheritdoc
     */
    get value(): T;
    /**
     * @inheritdoc
     */
    set value(value: T);
    /**
     * Sets the value
     */
    set(value: T): void;
}
/**
 * Creates a reactive value
 */
export declare function signal<T>(value: T): Signal<T>;
