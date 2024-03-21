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
	sentinel: boolean;
};

export abstract class Sentinel {
	protected readonly sentinel = true;

	constructor(protected active: boolean) {}
}
