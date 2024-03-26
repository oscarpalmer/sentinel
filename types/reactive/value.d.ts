import { Sentinel, type SentinelType, type Subscriber, type ReactiveState } from '../models';
/**
 * Base class for a reactive value
 */
export declare abstract class ReactiveValue<Value> extends Sentinel {
    protected readonly state: ReactiveState<Value>;
    /**
     * The current value
     */
    abstract readonly value: Value;
    constructor(type: SentinelType, value: Value);
    /**
     * The current value
     */
    get(): Value;
    /**
     * Gets the current value, without reaction
     */
    peek(): Value;
    /**
     * Enables reactivity for the value, if it was stopped
     */
    run(): void;
    /**
     * Disables reactivity for the value, if it's running
     */
    stop(): void;
    /**
     * Adds a subscriber to the value
     */
    subscribe(subscriber: Subscriber<Value>): void;
    /**
     * Get the JSON representation of the value
     */
    toJSON(): Value;
    /**
     * Get the string representation of the value
     */
    toString(): string;
    /**
     * Removes a subscriber from the value
     */
    unsubscribe(subscriber: Subscriber<Value>): void;
}
