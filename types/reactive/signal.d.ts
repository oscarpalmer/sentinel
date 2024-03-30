import { ReactiveValue } from './value';
/**
 * A reactive value
 */
export declare class Signal<Value> extends ReactiveValue<Value> {
    /**
     * Sets the value
     */
    set(value: Value): void;
    /**
     * Updates the value
     */
    update(updater: (current: Value) => Value): void;
}
/**
 * Creates a reactive value
 */
export declare function signal<Value>(value: Value): Signal<Value>;
