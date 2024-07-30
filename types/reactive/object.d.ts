import type { ArrayOrPlainObject } from '@oscarpalmer/atoms/models';
import { ReactiveInstance } from './instance';
import type { Signal } from './signal';
export declare abstract class ReactiveObject<Value extends ArrayOrPlainObject> extends ReactiveInstance<Value> {
    constructor(type: string, value: Value, length?: Signal<number>);
}
