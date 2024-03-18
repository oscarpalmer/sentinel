import {queue} from '@oscarpalmer/atoms/queue';
import type {InternalReactive} from './models';

export function emitValue(reactive: InternalReactive): void {
	if (reactive.active) {
		for (const watcher of reactive.watchers) {
			queue(watcher.callback);
		}
	}
}

export function getValue(reactive: InternalReactive): unknown {
	const watcher =
		globalThis._sentinels[globalThis._sentinels.length - 1];

	if (watcher != null) {
		reactive.watchers.add(watcher);
		watcher.values.add(reactive);
	}

	return reactive._value;
}

export function setValue(reactive: InternalReactive, value: unknown): void {
	if (Object.is(reactive._value, value)) {
		return;
	}

	reactive._value = value;

	emitValue(reactive);
}

export function startReactivity(reactive: InternalReactive): void {
	if (reactive.active) {
		return;
	}

	reactive.active = true;

	emitValue(reactive);
}

export function stopReactivity(reactive: InternalReactive): void {
	if (!reactive.active) {
		return;
	}

	reactive.active = false;

	for (const watcher of reactive.watchers) {
		watcher.values.delete(reactive);
	}
}
