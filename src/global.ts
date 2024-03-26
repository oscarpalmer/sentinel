import '@oscarpalmer/atoms/queue';
import type {InternalEffect} from './models';

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
