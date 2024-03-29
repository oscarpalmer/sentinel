import type {ArrayOrPlainObject} from '@oscarpalmer/atoms/models';
import {getValue} from '../helpers/value';
import {ReactiveValue} from './value';

export class ReactiveObject<
	Model extends ArrayOrPlainObject,
> extends ReactiveValue<Model> {
	/**
	 * The current value
	 */
	get value(): Model {
		return getValue(this as never) as Model;
	}

	/**
	 * Gets value for a property
	 */
	get<Property extends keyof Model>(property: Property): Model[Property];

	/**
	 * Gets the value
	 */
	get(): Model;

	get<Property extends keyof Model>(
		property?: Property,
	): Model[Property] | Model {
		return property == null
			? (getValue(this as never) as Model)
			: this.value[property as never];
	}

	/**
	 * Gets value for a property without triggering reactivity
	 */
	peek<Property extends keyof Model>(property: Property): Model[Property];

	/**
	 * Gets the value without triggering reactivity
	 */
	peek(): Model;

	peek<Property extends keyof Model>(
		property?: Property,
	): Model[Property] | Model {
		return property == null ? this.state.value : this.state.value[property];
	}

	/**
	 * Sets the value for a property
	 */
	set<Property extends keyof Model>(
		property: Property,
		value: Model[Property],
	): void {
		this.state.value[property] = value;
	}
}
