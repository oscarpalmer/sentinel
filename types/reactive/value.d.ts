import type { Subscriber, Unsubscriber } from '../models';
import { ReactiveInstance } from './instance';
export declare class ReactiveValue<Value> extends ReactiveInstance<Value> {
    /**
     * - Subscribes to changes for the value
     * - Returns a function to allow for unsubscribing
     */
    subscribe(subscriber: Subscriber<Value>): Unsubscriber;
    /**
     * Unsubscribes from changes for the value _(and optionally a specific subscriber)_
     */
    unsubscribe(subscriber?: Subscriber<Value>): void;
}
