import {queue} from '@oscarpalmer/atoms/queue';
import type {ReactiveState} from '../models';

export function disable<Value>(state: ReactiveState<Value>): void {
	if (state.active) {
		state.active = false;

		for (const effect of state.effects) {
			effect.reactives.delete(state as never);
		}
	}
}

export function emit<Value>(state: ReactiveState<Value>): void {
	if (state.active) {
		const {effects, subscribers} = state;

		const callbacks = [...effects, ...subscribers.values()].map(value =>
			typeof value === 'function' ? value : value.callback,
		);

		for (const callback of callbacks) {
			queue(callback);
		}
	}
}

export function enable<Value>(state: ReactiveState<Value>): void {
	if (!state.active) {
		state.active = true;

		emit(state);
	}
}
