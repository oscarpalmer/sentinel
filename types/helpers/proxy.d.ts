import type { ArrayOrPlainObject } from '@oscarpalmer/atoms/models';
import type { ReactiveObject } from '../reactive/object';
import type { Signal } from '../reactive/signal';
export declare function createProxy<Model extends ArrayOrPlainObject>(store: ReactiveObject<Model>, value: Model, length?: Signal<number>): Model;
export declare function getProxyValue(obj: ReactiveObject<never>, target: ArrayOrPlainObject, property: PropertyKey, isArray: boolean, length?: Signal<number>): unknown;
export declare function setProxyValue(obj: ReactiveObject<never>, target: ArrayOrPlainObject, property: PropertyKey, value: unknown, length?: Signal<number>): boolean;
