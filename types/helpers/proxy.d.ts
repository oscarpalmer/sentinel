import type { ReactiveState } from '../models';
import type { Signal } from '../reactive/signal';
export declare function getProxyValue(reactive: ReactiveState<object>, target: object, property: PropertyKey, length?: Signal<number>): unknown;
export declare function setProxyValue(reactive: ReactiveState<object>, target: object, property: PropertyKey, value: unknown, length?: Signal<number>): boolean;
