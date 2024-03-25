import type { ArrayOrPlainObject } from '@oscarpalmer/atoms/is';
import type { InternalReactive } from '../models';
import type { Signal } from '../reactive/signal';
export declare function emitValue(reactive: InternalReactive): void;
export declare function getValue(reactive: InternalReactive): unknown;
export declare function setProxyValue(reactive: InternalReactive, target: ArrayOrPlainObject, length: Signal<number> | undefined, property: PropertyKey, value: unknown): boolean;
export declare function setValue(reactive: InternalReactive, value: unknown): void;
export declare function startReactivity(reactive: InternalReactive): void;
export declare function stopReactivity(reactive: InternalReactive): void;
