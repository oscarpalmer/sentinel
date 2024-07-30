import type { ReactiveState } from '../models';
export declare abstract class ReactiveInstance<Value = unknown> {
    private readonly $sentinel;
    protected readonly state: ReactiveState<Value>;
    constructor(type: string, value: Value);
    /**
     * Gets the value
     */
    get(): Value;
    /**
     * Gets the value without triggering reactivity
     */
    peek(): Value;
    /**
     * Starts reactivity for the value, if it was stopped
     */
    run(): void;
    /**
     * Stops reactivity for the value, if it was started
     */
    stop(): void;
    /**
     * Gets the JSON representation of the value
     */
    toJSON(): Value;
    /**
     * Gets the string representation of the value
     */
    toString(): string;
}
export type Reactive = ReactiveInstance;
