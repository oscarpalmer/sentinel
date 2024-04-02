import '@oscarpalmer/atoms/queue';
import type {EffectState} from './models';

declare global {
	var _sentinels: EffectState[];
}

if (globalThis._sentinels == null) {
	const effects: EffectState[] = [];

	Object.defineProperty(globalThis, '_sentinels', {
		get() {
			return effects;
		},
	});
}
