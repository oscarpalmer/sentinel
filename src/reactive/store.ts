import type {PlainObject} from '@oscarpalmer/atoms/models';
import {reactiveObject} from './object';
import type {ReactiveStore} from '../models';

export function store<Value extends PlainObject>(
	value: Value,
): ReactiveStore<Value> {
	const original = reactiveObject(value);

	const instance = Object.create({
		...original.callbacks,
	});

	Object.defineProperty(instance, '$sentinel', {
		get() {
			return 'store';
		},
	});

	return instance;
}