import type {ArrayOrPlainObject} from '@oscarpalmer/atoms/is';
import {getValue, startReactivity, stopReactivity} from './helpers';
import {type InternalEffect, Sentinel, type SentinelType} from './models';

/**
 * Base class for a reactive value
 */
export abstract class ReactiveValue<Value> extends Sentinel {
	/**
	 * Effects that have accessed the value
	 */
	protected readonly effects = new Set<InternalEffect>();

	/**
	 * The current value
	 */
	abstract readonly value: Value;

	constructor(
		type: SentinelType,
		protected _value: Value,
	) {
		super(type, true);
	}

	/**
	 * The current value
	 */
	get(): Value {
		return this.value;
	}

	/**
	 * Gets the current value, without reaction
	 */
	peek(): Value {
		return this._value;
	}

	/**
	 * Enables reactivity for the value, if it was stopped
	 */
	run(): void {
		startReactivity(this as never);
	}

	/**
	 * Disables reactivity for the value, if it's running
	 */
	stop(): void {
		stopReactivity(this as never);
	}

	/**
	 * Get the JSON representation of the value
	 */
	toJSON(): Value {
		return this.value;
	}

	/**
	 * Get the string representation of the value
	 */
	toString(): string {
		return String(this.value);
	}
}

export class ReactiveObject<
	Model extends ArrayOrPlainObject,
> extends ReactiveValue<Model> {
	protected declare readonly id: string;

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
		return property == null ? this._value : this._value[property];
	}

	/**
	 * Sets the value for a property
	 */
	set<Property extends keyof Model>(
		property: Property,
		value: Model[Property],
	): void {
		this._value[property] = value;
	}
}
