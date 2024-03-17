declare global {
	var _sentinels: InternalWatcher[];
}

if (globalThis._sentinels === undefined) {
	const watchers: InternalWatcher[] = [];

	Object.defineProperty(globalThis, '_sentinels', {
		get() {
			return watchers;
		},
	});
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

export abstract class Sentinel {
	protected readonly sentinel = true;

	constructor(protected active: boolean) {}
}
