import {queue} from '@oscarpalmer/atoms/queue';
import type {InternalReactive} from './models';

export function getValue(reactive: InternalReactive): unknown {
	const watcher = globalThis._sentinels[globalThis._sentinels.length - 1];

	if (watcher != null) {
		reactive.watchers.add(watcher);
		watcher.values.add(reactive);
	}

	return reactive._value;
}

export function setValue(
	reactive: InternalReactive,
	value: unknown,
	run: boolean,
): void {
	if (!run && Object.is(reactive._value, value)) {
		return;
	}

	reactive._value = value;

	if (reactive.active) {
		for (const watcher of reactive.watchers) {
			queue(watcher.callback);
		}
	}
}
