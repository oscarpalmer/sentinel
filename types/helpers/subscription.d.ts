import type { Key } from '@oscarpalmer/atoms/models';
import type { ReactiveState, Subscriber, Unsubscriber } from '../models';
export declare function subscribe<Value>(state: ReactiveState<Value>, subscriber: Subscriber<Value>, key?: Key): Unsubscriber;
export declare function unsubscribe<Value>(state: ReactiveState<Value>, subscriber?: Subscriber<Value> | undefined, key?: Key): void;
