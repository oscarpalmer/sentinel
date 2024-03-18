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
	watchers: Set<InternalWatcher>;
} & InternalSentinel;

export type InternalSentinel = {
	active: boolean;
	sentinel: boolean;
};

export type InternalWatcher = {
	callback: () => void;
	values: Set<InternalReactive>;
} & InternalSentinel;

export abstract class Sentinel {
	protected readonly sentinel = true;

	constructor(protected active: boolean) {}
}
