import { type EffectState, Sentinel } from './models';
/**
 * A reactive effect for changes in values
 */
export declare class Effect extends Sentinel {
    protected readonly state: EffectState;
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
