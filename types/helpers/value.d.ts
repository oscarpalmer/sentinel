import type { ArrayOrPlainObject } from '@oscarpalmer/atoms/models';
import type { InternalReactive } from '../models';
import type { ReactiveObject } from '../reactive/object';
import type { Signal } from '../reactive/signal';
export declare function getProxyValue(obj: ReactiveObject<never>, target: ArrayOrPlainObject, property: PropertyKey, isArray: boolean): unknown;
export declare function getValue(reactive: InternalReactive): unknown;
export declare function setProxyValue(obj: ReactiveObject<never>, target: ArrayOrPlainObject, property: PropertyKey, value: unknown, length?: Signal<number>, wrapper?: (store: ReactiveObject<never>, value: unknown) => unknown): boolean;
export declare function setValue(reactive: InternalReactive, value: unknown): void;
export declare function updateArray(obj: ReactiveObject<never>, array: unknown[], operation: string, length?: Signal<number>): (...args: unknown[]) => unknown;
