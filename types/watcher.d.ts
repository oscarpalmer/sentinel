import { Sentinel } from './models';
/**
 * Watches for changes in reactive values
 */
export declare class Watcher extends Sentinel {
    private readonly callback;
    /**
     * Values accessed by the watcher
     */
    private values;
    constructor(callback: () => void);
    /**
     * Starts watching for changes
     */
    start(): void;
    /**
     * Stops watching for changes
     */
    stop(): void;
}
/**
 * Creates a watcher
 */
export declare function watch(callback: () => void): Watcher;
