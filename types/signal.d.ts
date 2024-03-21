import { ReactiveValue } from './reactive';
/**
 * A reactive value
 */
export declare class Signal<T = unknown> extends ReactiveValue<T> {
    /**
     * @inheritdoc
     */
    get value(): T;
    /**
     * @inheritdoc
     */
    set value(value: T);
    /**
     * @inheritdoc
     */
    run(): void;
    /**
     * Sets the value
     */
    set(value: T): void;
    /**
     * @inheritdoc
     */
    stop(): void;
}
/**
 * Creates a reactive value
 */
export declare function signal<T = unknown>(value: T): Signal<T>;
