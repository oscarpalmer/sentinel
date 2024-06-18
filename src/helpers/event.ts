import type {Key} from '@oscarpalmer/atoms/models';
import {queue} from '@oscarpalmer/atoms/queue';
import type {ReactiveState} from '../models';

export function disable<Value>(state: ReactiveState<Value>): void {
	if (state.active) {
		state.active = false;

		const effects = [...state.callbacks.any, ...state.callbacks.values.values()]
			.flatMap(value => (value instanceof Set ? [...value.values()] : value))
			.filter(value => typeof value !== 'function');

		for (const fx of effects) {
			if (typeof fx !== 'function') {
				fx.reactives.delete(state as never);
			}
		}
	}
}

export function emit<Value>(state: ReactiveState<Value>, keys?: Key[]): void {
	if (state.active) {
		const subscribers = [
			...state.callbacks.any,
			...[...state.callbacks.values.entries()]
				.filter(([key]) => keys == null || keys.includes(key))
				.map(([, value]) => value),
		]
			.flatMap(value => (value instanceof Set ? [...value.values()] : value))
			.map(value => (typeof value === 'function' ? value : value.callback));

		for (const subsriber of subscribers) {
			if (typeof subsriber === 'function') {
				queue(() => {
					subsriber(state.value);
				});
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
