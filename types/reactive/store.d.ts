import type { PlainObject } from '@oscarpalmer/atoms/models';
import type { Subscriber, Unsubscriber } from '../models';
import { ReactiveObject } from './object';
export declare class Store<Value extends PlainObject> extends ReactiveObject<Value> {
    constructor(value: Value);
    /**
     * Gets the store without triggering reactivity
     */
    peek(): Value;
    /**
     * Gets the value for a path without triggering reactivity
     */
    peek<Key extends keyof Value>(key: Key): Value[Key];
    /**
     * Sets the value for a key
     */
    set<Key extends keyof Value>(key: Key, value: unknown): void;
    /**
     * - Subscribes to changes for a specific key in the store
     * - Returns a function to allow for unsubscribing
     */
    subscribe<Key extends keyof Value>(key: Key, subscriber: Subscriber<Value[Key]>): Unsubscriber;
    /**
     * - Subscribes to changes for the store
     * - Returns a function to allow for unsubscribing
     */
    subscribe(subscriber: Subscriber<unknown>): Unsubscriber;
    /**
     * Unsubscribes from changes for a specific key in the store _(and optionally a specific subscriber)_
     */
    unsubscribe<Key extends keyof Value>(key: Key, subscriber?: Subscriber<Value[Key]>): void;
    /**
     * Unsubscribes from changes for the store _(and optionally a specific subscriber)_
     */
    unsubscribe(subscriber?: Subscriber<unknown>): void;
}
export declare function store<Value extends PlainObject>(value: Value): Store<Value>;
