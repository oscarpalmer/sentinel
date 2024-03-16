import type { InternalReactiveValue } from './models';
export declare function getValue(value: InternalReactiveValue): unknown;
export declare function setValue(reactive: InternalReactiveValue, value: unknown, run: boolean): void;
