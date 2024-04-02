import type { ReactiveState } from '../models';
export declare function disable<Value>(state: ReactiveState<Value>): void;
export declare function emit<Value>(state: ReactiveState<Value>): void;
export declare function enable<Value>(state: ReactiveState<Value>): void;
