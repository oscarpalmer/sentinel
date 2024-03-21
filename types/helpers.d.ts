import type { InternalReactive } from './models';
export declare function emitValue(reactive: InternalReactive): void;
export declare function getValue(reactive: InternalReactive): unknown;
export declare function setValue(reactive: InternalReactive, value: unknown): void;
export declare function startReactivity(reactive: InternalReactive): void;
export declare function stopReactivity(reactive: InternalReactive): void;
