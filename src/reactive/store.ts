import type {PlainObject} from '@oscarpalmer/atoms/models';
import {reactiveObject} from './object';
import type {Store} from '../models';

export function store<Value extends PlainObject>(value: Value): Store<Value> {
	const original = reactiveObject(value);

	const instance = Object.create({
		...original.callbacks,
	});

	Object.defineProperty(instance, '$sentinel', {
		value: 'store',
	});

	return instance;
}