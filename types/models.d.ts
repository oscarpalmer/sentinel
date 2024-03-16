declare global {
    var _sentinels: InternalEffect[];
}
export type InternalEffect = {
    active: boolean;
    callback: () => void;
    values: Set<InternalReactiveValue>;
};
export type InternalReactiveValue = {
    _value: unknown;
    active: boolean;
    effects: Set<InternalEffect>;
};
export type InternalSentinel = {
    sentinel: boolean;
};
export declare abstract class Sentinel {
    protected active: boolean;
    protected readonly sentinel = true;
    constructor(active: boolean);
}
