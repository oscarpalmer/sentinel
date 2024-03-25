import {queue} from '@oscarpalmer/atoms/queue';
import type {InternalReactive} from '../models';

export function disable(reactive: InternalReactive): void {
	if (!reactive.active) {
		return;
	}

	reactive.active = false;

	for (const effect of reactive.effects) {
		effect.values.delete(reactive);
	}
}

export function emit(reactive: InternalReactive): void {
	if (reactive.active) {
		for (const effect of reactive.effects) {
			queue(effect.callback);
		}
	}
}

export function enable(reactive: InternalReactive): void {
	if (!reactive.active) {
		reactive.active = true;

		emit(reactive);
	}
}
