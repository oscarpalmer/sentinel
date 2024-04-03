import type { ReactiveState, Signal } from '../models';
export declare function getProxyValue(reactive: ReactiveState<unknown[]>, target: unknown[], property: PropertyKey, length: Signal<number>): unknown;
export declare function setProxyValue(reactive: ReactiveState<unknown[]>, target: unknown[], property: PropertyKey, value: unknown, length?: Signal<number>): boolean;
