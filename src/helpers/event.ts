import {queue} from '@oscarpalmer/atoms/queue';
import type {InternalReactive} from '../models';

export function disable(reactive: InternalReactive): void {
	if (reactive.active) {
		reactive.state.active = false;

		for (const effect of reactive.state.effects) {
			effect.state.values.delete(reactive);
		}
	}
}

export function emit(reactive: InternalReactive): void {
	if (reactive.active) {
		const {effects, subscribers} = reactive.state;

		const callbacks = [...effects, ...subscribers.values()].map(value =>
			typeof value === 'function' ? value : value.state.callback,
		);

		for (const callback of callbacks) {
			queue(callback);
		}
	}
}

export function enable(reactive: InternalReactive): void {
	if (!reactive.active) {
		reactive.state.active = true;

		emit(reactive);
	}
}
