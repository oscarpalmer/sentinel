import type { InternalReactive } from './models';
export declare function getValue(reactive: InternalReactive): unknown;
export declare function setValue(reactive: InternalReactive, value: unknown, run: boolean): void;
