import type { PlainObject } from '@oscarpalmer/atoms/models';
import type { Store } from '../models';
export declare function store<Model extends PlainObject>(value: Model): Store<Model>;
