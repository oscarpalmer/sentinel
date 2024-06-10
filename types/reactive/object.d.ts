import type { ArrayOrPlainObject } from '@oscarpalmer/atoms/models';
import type { ReactiveState, Signal } from '../models';
type ReactiveObject<Value> = {
    callbacks: Record<string, unknown>;
    length?: Signal<number>;
    state: ReactiveState<Value>;
};
export declare function reactiveObject<Value extends ArrayOrPlainObject>(value: Value): ReactiveObject<Value>;
export {};
