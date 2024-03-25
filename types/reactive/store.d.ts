import type { PlainObject } from '@oscarpalmer/atoms/is';
import { ReactiveObject } from './object';
/**
 * A reactive store
 */
export declare class Store<Model extends PlainObject> extends ReactiveObject<Model> {
    constructor(value: Model);
}
/**
 * Creates a reactive store
 */
export declare function store<Model extends PlainObject>(value: Model): Store<Model>;
