import type { ReactiveState, Subscriber, Unsubscriber } from '../models';
export declare function subscribe<Value>(state: ReactiveState<Value>, subscriber: Subscriber<Value>, index?: number): Unsubscriber;
export declare function unsubscribe<Value>(state: ReactiveState<Value>, subscriber?: Subscriber<Value> | undefined, index?: number): void;
