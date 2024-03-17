import { ReactiveValue } from './reactive';
/**
 * A computed, reactive value
 */
export declare class Computed<T = unknown> extends ReactiveValue<T> {
    /**
     * Watcher for computing the value
     */
    private readonly watcher;
    /**
     * @inheritdoc
     */
    get value(): T;
    constructor(callback: () => T);
    /**
     * Enables reactivity, if it was stopped
     */
    run(): void;
    /**
     * Disables reactivity, if it's running
     */
    stop(): void;
}
/**
 * Creates a computed, reactive value
 */
export declare function computed<T>(callback: () => T): Computed<T>;
