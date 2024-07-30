import type {ArrayOrPlainObject} from '@oscarpalmer/atoms/models';
import {getProxyValue, setProxyValue} from '../helpers/proxy';
import {ReactiveInstance} from './instance';
import type {Signal} from './signal';

export abstract class ReactiveObject<
	Value extends ArrayOrPlainObject,
> extends ReactiveInstance<Value> {
	constructor(type: string, value: Value, length?: Signal<number>) {
		super(type, value);

		this.state.value = new Proxy(value, {
			get: (target, key) =>
				getProxyValue(this.state as never, target, key, length),
			set: (target, key, value) => {
				return setProxyValue(this.state as never, target, key, value, length);
			},
		});
	}
}
