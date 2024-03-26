export type EffectState = {
	callback: () => void;
	values: Set<InternalReactive>;
} & SentinelState;

export type InternalEffect = {
	state: EffectState;
} & InternalSentinel;

export type InternalReactive = {
	readonly active: boolean;
	state: ReactiveState<unknown>;
} & InternalSentinel;

export type InternalSentinel = {
	state: SentinelState;
};

export type ReactiveState<Value> = {
	effects: Set<InternalEffect>;
	subscribers: Map<Subscriber<Value>, () => void>;
	value: Value;
} & SentinelState;

export class Sentinel {
	protected declare readonly state: SentinelState;

	/**
	 * Is the sentinel active?
	 */
	get active(): boolean {
		return this.state.active;
	}

	constructor(type: SentinelType, active: boolean) {
		this.state = {active, type};
	}
}

export type SentinelState = {
	active: boolean;
	type: SentinelType;
};

export type SentinelType = 'computed' | 'effect' | 'list' | 'signal' | 'store';

/**
 * A subscriber for a reactive value, called when the value changes
 */
export type Subscriber<Value> = (value: Value) => void;
