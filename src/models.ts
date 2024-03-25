declare global {
	var _sentinels: InternalEffect[];
}

if (globalThis._sentinels === undefined) {
	const effects: InternalEffect[] = [];

	Object.defineProperty(globalThis, '_sentinels', {
		get() {
			return effects;
		},
	});
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
	type: SentinelType;
};

export abstract class Sentinel {
	constructor(
		protected readonly type: SentinelType,
		protected active: boolean,
	) {}
}

export type SentinelType = 'computed' | 'effect' | 'item' | 'list' | 'signal';
