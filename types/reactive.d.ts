import type { ArrayOrPlainObject } from '@oscarpalmer/atoms/is';
import { type InternalEffect, Sentinel, type SentinelType } from './models';
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
export declare class ReactiveObject<Model extends ArrayOrPlainObject> extends ReactiveValue<Model> {
    protected readonly id: string;
    /**
     * The current value
     */
    get value(): Model;
    /**
     * Gets value for a property
     */
    get<Property extends keyof Model>(property: Property): Model[Property];
    /**
     * Gets the value
     */
    get(): Model;
    /**
     * Gets value for a property without triggering reactivity
     */
    peek<Property extends keyof Model>(property: Property): Model[Property];
    /**
     * Gets the value without triggering reactivity
     */
    peek(): Model;
    /**
     * Sets the value for a property
     */
    set<Property extends keyof Model>(property: Property, value: Model[Property]): void;
}
