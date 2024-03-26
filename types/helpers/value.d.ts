import type { ArrayOrPlainObject } from '@oscarpalmer/atoms/models';
import type { InternalReactive } from '../models';
import type { Signal } from '../reactive/signal';
export declare function getValue(reactive: InternalReactive): unknown;
export declare function setProxyValue(reactive: InternalReactive, target: ArrayOrPlainObject, length: Signal<number> | undefined, property: PropertyKey, value: unknown): boolean;
export declare function setValue(reactive: InternalReactive, value: unknown): void;
