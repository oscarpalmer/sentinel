import type { PlainObject } from '@oscarpalmer/atoms/models';
import type { Store } from '../models';
export declare function store<Value extends PlainObject>(value: Value): Store<Value>;
