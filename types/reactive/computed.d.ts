import { ReactiveValue } from './value';
/**
 * A computed, reactive value
 */
export declare class Computed<Value> extends ReactiveValue<Value> {
    /**
     * @inheritdoc
     */
    get value(): Value;
    /**
     * Effect for computing the value
     */
    private readonly effect;
    constructor(callback: () => Value);
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
export declare function computed<Value>(callback: () => Value): Computed<Value>;
