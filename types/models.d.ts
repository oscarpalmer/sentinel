declare global {
    var _sentinels: InternalEffect[];
}
export type InternalEffect = {
    callback: () => void;
    values: Set<InternalReactive>;
} & InternalSentinel;
export type InternalReactive = {
    _value: unknown;
    effects: Set<InternalEffect>;
} & InternalSentinel;
export type InternalSentinel = {
    active: boolean;
    sentinel: boolean;
};
export declare abstract class Sentinel {
    protected active: boolean;
    protected readonly sentinel = true;
    constructor(active: boolean);
}
