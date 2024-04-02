import type { ArrayOrPlainObject } from '@oscarpalmer/atoms/models';
import type { ReactiveObject, ReactiveState, Signal } from '../models';
type ReturnValue<Model extends ArrayOrPlainObject> = {
    callbacks: ReactiveObject<Model>;
    state: ReactiveState<Model>;
};
export declare function reactiveObject<Model extends ArrayOrPlainObject>(value: Model, length?: Signal<number>): ReturnValue<Model>;
export {};
