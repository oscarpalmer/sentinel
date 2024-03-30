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

	constructor(active: boolean) {
		this.state = {active};
	}
}

export type SentinelState = {
	active: boolean;
};

/**
 * A subscriber for a reactive value, called when the value changes
 */
export type Subscriber<Value> = (value: Value) => void;

/**
 * - A function that unsubscribes a subscriber from a reactive value
 * - Receieved when subscribing to a reactive value
 */
export type Unsubscriber = () => void;
