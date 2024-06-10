import type { PlainObject } from '@oscarpalmer/atoms/models';
import type { ReactiveStore } from '../models';
export declare function store<Value extends PlainObject>(value: Value): ReactiveStore<Value>;
