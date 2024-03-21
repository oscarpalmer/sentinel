import { type InternalEffect, Sentinel } from './models';
/**
 * Base class for a reactive value
 */
export declare abstract class Reactive<T> extends Sentinel {
    protected _value: T;
    /**
     * Effects that have accessed the value
     */
    protected readonly effects: Set<InternalEffect>;
    /**
     * The current value
     */
    abstract readonly value: T;
    constructor(_value: T);
    /**
     * The current value
     */
    get(): T;
    /**
     * Gets the current value, without reaction
     */
    peek(): T;
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
    toJSON(): T;
    /**
     * Get the string representation of the value
     */
    toString(): string;
}
