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
     * Enables reactivity for the value, if it was stopped
     */
    run(): void;
    /**
     * Sets the value
     */
    set(value: T): void;
    /**
     * Disables reactivity for the value, if it's running
     */
    stop(): void;
}
/**
 * Creates a reactive value
 */
export declare function signal<T = unknown>(value: T): Signal<T>;
