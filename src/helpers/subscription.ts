import type {
	EffectState,
	ReactiveState,
	Subscriber,
	Unsubscriber,
} from '../models';

export function subscribe<Value>(
	state: ReactiveState<Value>,
	subscriber: Subscriber<Value>,
	index?: number,
): Unsubscriber {
	let set: Set<EffectState | Subscriber<Value>> | undefined;

	if (typeof index === 'number') {
		if (state.callbacks.keys.has(index)) {
			set = state.callbacks.values.get(index);
		} else {
			set = new Set();

			state.callbacks.keys.add(index);
			state.callbacks.values.set(index, set);
		}
	} else {
		set = state.callbacks.any;
	}

	if (set == null || set.has(subscriber)) {
		return () => {};
	}

	set.add(subscriber);

	subscriber(state.value);

	return () => {
		unsubscribe(state, subscriber, index);
	};
}

export function unsubscribe<Value>(
	state: ReactiveState<Value>,
	subscriber?: Subscriber<Value> | undefined,
	index?: number,
): void {
	if (typeof index === 'number') {
		const set = state.callbacks.values.get(index);

		if (set != null) {
			if (subscriber == null) {
				set.clear();
			} else {
				set.delete(subscriber);
			}

			if (set.size === 0) {
				state.callbacks.keys.delete(index);
				state.callbacks.values.delete(index);
			}
		}
	} else if (subscriber != null) {
		state.callbacks.any.delete(subscriber);
	}
}
