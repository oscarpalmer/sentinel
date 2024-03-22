import type { PlainObject } from '@oscarpalmer/atoms/is';
import { ReactiveObject } from './reactive';
/**
 * A reactive item
 */
export declare class Item<Model extends PlainObject> extends ReactiveObject<Model> {
    constructor(value: Model);
}
/**
 * Creates a reactive item
 */
export declare function item<Model extends PlainObject>(value: Model): Item<Model>;
