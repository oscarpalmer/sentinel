import type {ArrayOrPlainObject} from '@oscarpalmer/atoms/models';
import {getProxyValue, setProxyValue} from '../helpers/proxy';
import {getValue} from '../helpers/value';
import type {ReactiveObject, ReactiveState, Signal} from '../models';
import {reactiveValue} from './value';

type ReturnValue<Model extends ArrayOrPlainObject> = {
	callbacks: ReactiveObject<Model>;
	state: ReactiveState<Model>;
};

export function reactiveObject<Model extends ArrayOrPlainObject>(
	value: Model,
	length?: Signal<number>,
): ReturnValue<Model> {
	const original = reactiveValue<ArrayOrPlainObject>(
		(Array.isArray(value) ? [] : {}) as Model,
	);

	original.state.value = new Proxy(value, {
		get(target, property) {
			return getProxyValue(
				original.state,
				target,
				property,
				Array.isArray(target),
				length,
			);
		},
		set(target, property, value) {
			return setProxyValue(original.state, target, property, value, length);
		},
	});

	function get(property: unknown) {
		return property == null
			? (getValue(original.state) as Model)
			: (original.state.value as Model)[property as never];
	}

	function peek(property: unknown) {
		return property == null
			? (original.state.value as Model)
			: (original.state.value as Model)[property as never];
	}

	function set(property: unknown, value: unknown) {
		(original.state.value as Model)[property as never] = value as never;
	}

	return {
		callbacks: {...original.callbacks, get, peek, set},
		state: original.state,
	} as ReturnValue<Model>;
}
