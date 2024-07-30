import { ReactiveValue } from './value';
/**
 * A computed, reactive value
 */
export declare class Computed<Value> extends ReactiveValue<Value> {
    private readonly fx;
    constructor(value: () => Value);
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
 * Creates a computed, reactive value
 */
export declare function computed<Value>(value: () => Value): Computed<Value>;
