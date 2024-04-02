import type {PlainObject} from '@oscarpalmer/atoms/models';
import type {Store} from '../models';
import {reactiveObject} from './object';

export function store<Model extends PlainObject>(value: Model): Store<Model> {
	const instance = Object.create(reactiveObject(value).callbacks);

	Object.defineProperty(instance, '$sentinel', {
		value: 'store',
	});

	return instance;
}
