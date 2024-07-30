import type { Key } from '@oscarpalmer/atoms/models';
export type EffectState = {
    active: boolean;
    callback: () => void;
    reactives: Set<ReactiveState<unknown>>;
};
type ReactiveCallbacks<Value> = {
    any: Set<EffectState | Subscriber<Value>>;
    keys: Set<Key>;
    values: Map<Key, Set<EffectState | Subscriber<Value>>>;
};
export type ReactiveState<Value> = {
    active: boolean;
    callbacks: ReactiveCallbacks<Value>;
    value: Value;
};
/**
 * A subscriber for a reactive value, called when the value changes
 */
export type Subscriber<Value> = (value: Value) => void;
/**
 * - A function that unsubscribes a subscriber from a reactive value
 * - Receieved when subscribing to a reactive value
 */
export type Unsubscriber = () => void;
export {};
