import type { ReactiveState } from '../models';
import type { Signal } from '../reactive/signal';
export declare const arrayOperations: Set<string>;
export declare function getValue<Value>(reactive: ReactiveState<Value>, key?: PropertyKey): Value;
export declare function setValue<Value>(reactive: ReactiveState<Value>, value: Value): void;
export declare function updateArray<Value>(reactive: ReactiveState<Value[]>, array: Value[], operation: string, length?: Signal<number>): (...args: unknown[]) => unknown;
