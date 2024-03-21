import type { PlainObject } from '@oscarpalmer/atoms/is';
import { Reactive } from './reactive';
/**
 * A reactive item
 */
export declare class Item<T extends PlainObject> extends Reactive<T> {
    /**
     * @inheritdoc
     */
    get value(): T;
    constructor(value: T);
    /**
     * Gets value for a property
     */
    get(property: keyof T): T[keyof T];
    /**
     * Gets the value
     */
    get(): T;
    /**
     * Gets value for a property without triggering reactivity
     */
    peek(property: keyof T): T[keyof T];
    /**
     * Gets the value without triggering reactivity
     */
    peek(): T;
    /**
     * Sets the value for a property
     */
    set(property: keyof T, value: T[keyof T]): void;
}
/**
 * Creates a reactive item
 */
export declare function item<T extends PlainObject>(value: T): Item<T>;
