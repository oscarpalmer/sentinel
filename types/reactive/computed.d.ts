import { Effect } from '../effect';
import type { ReactiveState } from '../models';
import { ReactiveValue } from './value';
type ComputedState<Value> = {
    effect: Effect;
} & ReactiveState<Value>;
/**
 * A computed, reactive value
 */
export declare class Computed<Value> extends ReactiveValue<Value> {
    protected readonly state: ComputedState<Value>;
    /**
     * @inheritdoc
     */
    get value(): Value;
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
export {};
