import {noop} from '@oscarpalmer/atoms/function';
import type {Key} from '@oscarpalmer/atoms/models';
import type {
	EffectState,
	ReactiveState,
	Subscriber,
	Unsubscriber,
} from '../models';

export function subscribe<Value>(
	state: ReactiveState<Value>,
	subscriber: Subscriber<Value>,
	key?: Key,
): Unsubscriber {
	let set: Set<EffectState | Subscriber<Value>> | undefined;

	if (key != null) {
		if (state.callbacks.keys.has(key)) {
			set = state.callbacks.values.get(key);
		} else {
			set = new Set();

			state.callbacks.keys.add(key);
			state.callbacks.values.set(key, set);
		}
	} else {
		set = state.callbacks.any;
	}

	if (set == null || set.has(subscriber)) {
		return noop;
	}

	set.add(subscriber);

	subscriber(state.value);

	return () => {
		unsubscribe(state, subscriber, key);
	};
}

export function subscribeOrUnsubscribe(
	type: 'subscribe' | 'unsubscribe',
	state: ReactiveState<unknown>,
	first: unknown,
	second: unknown,
): unknown {
	const firstIsSubscriber = typeof first === 'function';

	return (type === 'subscribe' ? subscribe : unsubscribe)(
		state,
		(firstIsSubscriber ? first : second) as never,
		(firstIsSubscriber ? undefined : first) as never,
	);
}

export function unsubscribe<Value>(
	state: ReactiveState<Value>,
	subscriber?: Subscriber<Value> | undefined,
	key?: Key,
): void {
	if (key != null) {
		const set = state.callbacks.values.get(key);

		if (set != null) {
			if (subscriber == null) {
				set.clear();
			} else {
				set.delete(subscriber);
			}

			if (set.size === 0) {
				state.callbacks.keys.delete(key);
				state.callbacks.values.delete(key);
			}
		}
	} else if (subscriber != null) {
		state.callbacks.any.delete(subscriber);
	}
}
