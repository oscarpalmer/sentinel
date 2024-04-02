import type { Computed } from '../models';
/**
 * Creates a computed, reactive value
 */
export declare function computed<Value>(value: () => Value): Computed<Value>;
