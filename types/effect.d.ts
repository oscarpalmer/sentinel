import type { Effect, ReactiveState } from './models';
/**
 * Creates a reactive effect
 */
export declare function effect(callback: () => void): Effect;
export declare function watch<Value>(reactive: ReactiveState<Value>): void;
