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
    type: SentinelType;
};
export declare abstract class Sentinel {
    protected readonly type: SentinelType;
    protected active: boolean;
    constructor(type: SentinelType, active: boolean);
}
export type SentinelType = 'computed' | 'effect' | 'list' | 'signal' | 'store';
