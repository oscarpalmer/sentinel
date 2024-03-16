import { Sentinel } from './models';
/**
 * A reactive effect
 */
export declare class Effect extends Sentinel {
    private readonly callback;
    /**
     * Values accessed by the effect
     */
    private values;
    constructor(callback: () => void);
    /**
     * Enables reactivity for the effect, if it was stopped
     */
    run(): void;
    /**
     * Disables reactivity for the effect, if it's running
     */
    stop(): void;
}
/**
 * Creates a reactive effect
 */
export declare function effect(callback: () => void): Effect;
