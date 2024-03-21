import { Reactive } from './reactive';
/**
 * A computed, reactive value
 */
export declare class Computed<T> extends Reactive<T> {
    /**
     * @inheritdoc
     */
    get value(): T;
    /**
     * Effect for computing the value
     */
    private readonly effect;
    constructor(callback: () => T);
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
export declare function computed<T>(callback: () => T): Computed<T>;
