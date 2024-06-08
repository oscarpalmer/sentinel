import type {Key} from '@oscarpalmer/atoms/models';
import {queue} from '@oscarpalmer/atoms/queue';
import type {ReactiveState} from '../models';

export function disable<Value>(state: ReactiveState<Value>): void {
	if (state.active) {
		state.active = false;

		for (const callback of state.callbacks.any) {
			if (typeof callback !== 'function') {
				callback.reactives.delete(state as never);
			}
		}

		for (const [, callback] of state.callbacks.values) {
			for (const value of callback) {
				if (typeof value !== 'function') {
					value.reactives.delete(state as never);
				}
			}
		}
	}
}

export function emit<Value>(state: ReactiveState<Value>, keys?: Key[]): void {
	if (state.active) {
		const keyed = [];

		for (const [key, value] of state.callbacks.values) {
			if (keys == null || keys.includes(key)) {
				keyed.push(...value);
			}
		}

		const callbacks = [...state.callbacks.any, ...keyed].map(value =>
			typeof value === 'function' ? value : value.callback,
		);

		for (const callback of callbacks) {
			if (typeof callback === 'function') {
				queue(() => {
					callback(state.value);
				});
			} else {
				queue(callback);
			}
		}
	}
}

export function enable<Value>(state: ReactiveState<Value>): void {
	if (!state.active) {
		state.active = true;

		emit(state);
	}
}
