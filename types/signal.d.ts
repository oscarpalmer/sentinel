import { ReactiveValue } from './reactive';
/**
 * A reactive value
 */
export declare class Signal<Value> extends ReactiveValue<Value> {
    /**
     * @inheritdoc
     */
    get value(): Value;
    /**
     * @inheritdoc
     */
    set value(value: Value);
    constructor(value: Value);
    /**
     * Sets the value
     */
    set(value: Value): void;
}
/**
 * Creates a reactive value
 */
export declare function signal<Value>(value: Value): Signal<Value>;
