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

export abstract class Sentinel {
	protected readonly sentinel = true;

	constructor(protected active: boolean) {}
}
