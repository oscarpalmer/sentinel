import { type InternalEffect, Sentinel } from './models';
/**
 * Base class for a reactive value
 */
export declare abstract class ReactiveValue<T = unknown> extends Sentinel {
    protected _value: T;
    /**
     * Effects that have accessed the value
     */
    protected readonly effects: Set<InternalEffect>;
    /**
     * Current value
     */
    abstract readonly value: T;
    constructor(_value: T);
    /**
     * Gets the current value, without reaction
     */
    peek(): T;
    /**
     * Enables reactivity for the value, if it was stopped
     */
    abstract run(): void;
    /**
     * Disables reactivity for the value, if it's running
     */
    abstract stop(): void;
    /**
     * Get the JSON representation of the value
     */
    toJSON(): T;
    /**
     * Get the string representation of the value
     */
    toString(): string;
}
