import { Sentinel } from './models';
/**
 * A reactive effect for changes in values
 */
export declare class Effect extends Sentinel {
    private readonly callback;
    /**
     * Values accessed by the effect
     */
    private values;
    constructor(callback: () => void);
    /**
     * Starts reacting for changes
     */
    start(): void;
    /**
     * Stops reacting for changes
     */
    stop(): void;
}
/**
 * Creates a reactive effect
 */
export declare function effect(callback: () => void): Effect;
