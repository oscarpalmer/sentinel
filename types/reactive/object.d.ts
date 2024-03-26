import type { ArrayOrPlainObject } from '@oscarpalmer/atoms/models';
import { ReactiveValue } from './value';
export declare class ReactiveObject<Model extends ArrayOrPlainObject> extends ReactiveValue<Model> {
    /**
     * The current value
     */
    get value(): Model;
    /**
     * Gets value for a property
     */
    get<Property extends keyof Model>(property: Property): Model[Property];
    /**
     * Gets the value
     */
    get(): Model;
    /**
     * Gets value for a property without triggering reactivity
     */
    peek<Property extends keyof Model>(property: Property): Model[Property];
    /**
     * Gets the value without triggering reactivity
     */
    peek(): Model;
    /**
     * Sets the value for a property
     */
    set<Property extends keyof Model>(property: Property, value: Model[Property]): void;
}
