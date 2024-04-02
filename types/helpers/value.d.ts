import type { InternalReactive } from '../models';
import type { ReactiveObject } from '../reactive/object';
import type { Signal } from '../reactive/signal';
export declare const arrayOperations: Set<string>;
export declare function getValue(reactive: InternalReactive): unknown;
export declare function setValue(reactive: InternalReactive, value: unknown): void;
export declare function updateArray(obj: ReactiveObject<never>, array: unknown[], operation: string, length?: Signal<number>): (...args: unknown[]) => unknown;
