import type { ArrayOrPlainObject } from '@oscarpalmer/atoms/models';
import type { ReactiveState, Signal } from '../models';
export declare function createProxy(reactive: ReactiveState<ArrayOrPlainObject>, value: ArrayOrPlainObject, length?: Signal<number>): ArrayOrPlainObject;
export declare function getProxyValue(reactive: ReactiveState<ArrayOrPlainObject>, target: ArrayOrPlainObject, property: PropertyKey, isArray: boolean, length?: Signal<number>): unknown;
export declare function setProxyValue(reactive: ReactiveState<ArrayOrPlainObject>, target: ArrayOrPlainObject, property: PropertyKey, value: unknown, length?: Signal<number>): boolean;
