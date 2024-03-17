declare global {
    var _sentinels: InternalWatcher[];
}
export type InternalReactive = {
    _value: unknown;
    active: boolean;
    watchers: Set<InternalWatcher>;
};
export type InternalSentinel = {
    sentinel: boolean;
};
export type InternalWatcher = {
    active: boolean;
    callback: () => void;
    values: Set<InternalReactive>;
};
export declare abstract class Sentinel {
    protected active: boolean;
    protected readonly sentinel = true;
    constructor(active: boolean);
}
