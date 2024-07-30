import type { Key } from '@oscarpalmer/atoms/models';
import type { ReactiveState } from './models';
/**
 * A reactive effect for changes in a value
 */
export declare class Effect {
    private readonly $sentinel;
    private readonly state;
    constructor(callback: () => void);
    /**
     * Starts reacting to changes
     */
    start(): void;
    /**
     * Stops reacting to changes
     */
    stop(): void;
}
/**
 * Creates a reactive effect
 */
export declare function effect(callback: () => void): Effect;
export declare function watch<Value>(reactive: ReactiveState<Value>, key?: Key): void;
