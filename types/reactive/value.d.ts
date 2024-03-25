import { type InternalEffect, Sentinel, type SentinelType } from '../models';
/**
 * Base class for a reactive value
 */
export declare abstract class ReactiveValue<Value> extends Sentinel {
    protected _value: Value;
    /**
     * Effects that have accessed the value
     */
    protected readonly effects: Set<InternalEffect>;
    /**
     * The current value
     */
    abstract readonly value: Value;
    constructor(type: SentinelType, _value: Value);
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
     * Get the JSON representation of the value
     */
    toJSON(): Value;
    /**
     * Get the string representation of the value
     */
    toString(): string;
}
