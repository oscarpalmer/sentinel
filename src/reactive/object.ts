import type {ArrayOrPlainObject, PlainObject} from '@oscarpalmer/atoms/models';
import {getProxyValue, setProxyValue} from '../helpers/proxy';
import {subscribe, unsubscribe} from '../helpers/subscription';
import {getValue} from '../helpers/value';
import type {ReactiveState, Signal} from '../models';
import {signal} from './signal';
import {reactiveValue} from './value';

type ReactiveObject<Value> = {
	callbacks: Record<string, unknown>;
	length?: Signal<number>;
	state: ReactiveState<Value>;
};

function setArrayValue(
	state: ReactiveState<unknown[]>,
	first: unknown,
	second: unknown,
): unknown {
	if (Array.isArray(first)) {
		return state.value.splice(0, state.value.length, ...first);
	}

	state.value[first as never] = second as never;
}

function setStoreValue(
	state: ReactiveState<PlainObject>,
	first: unknown,
	second: unknown,
): void {
	if (typeof first !== 'object' && first !== null) {
		state.value[first as never] = second as never;
	}
}

export function reactiveObject<Value extends ArrayOrPlainObject>(
	value: Value,
): ReactiveObject<Value> {
	const isArray = Array.isArray(value);
	const length = isArray ? signal(0) : undefined;
	const original = reactiveValue(isArray ? [] : {});

	original.state.value = new Proxy(value, {
		get: (target, key) => getProxyValue(original.state, target, key, length),
		set: (target, key, value) => {
			return setProxyValue(original.state, target, key, value, length);
		},
	});

	const callbacks = {
		...original.callbacks,
		get(property: unknown) {
			return getValue(original.state, property as never);
		},
		peek(property: unknown) {
			if (property == null) {
				return isArray
					? [...(original.state.value as unknown[])]
					: {...original.state.value};
			}

			return isArray
				? (original.state.value as unknown[]).at(property as never)
				: (original.state.value as PlainObject)[property as never];
		},
		set(first: unknown, second: unknown) {
			if (isArray) {
				return setArrayValue(original.state as never, first, second);
			}

			setStoreValue(original.state as never, first, second);
		},
		subscribe(first: unknown, second: unknown) {
			const firstIsSubscriber = typeof first === 'function';

			return subscribe(
				original.state,
				(firstIsSubscriber ? first : second) as never,
				(firstIsSubscriber ? undefined : first) as never,
			);
		},
		unsubscribe(first: unknown, second: unknown) {
			const firstIsSubscriber = typeof first === 'function';

			return unsubscribe(
				original.state,
				(firstIsSubscriber ? first : second) as never,
				(firstIsSubscriber ? undefined : first) as never,
			);
		},
	};

	return {
		callbacks,
		length,
		state: original.state as never,
	};
}
