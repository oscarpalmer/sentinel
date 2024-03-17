import {Sentinel, type InternalReactive} from './models';

/**
 * Watches for changes in reactive values
 */
export class Watcher extends Sentinel {
	/**
	 * Values accessed by the watcher
	 */
	private values = new Set<InternalReactive>();

	constructor(private readonly callback: () => void) {
		super(false);

		this.start();
	}

	/**
	 * Starts watching for changes
	 */
	start(): void {
		if (this.active) {
			return;
		}

		this.active = true;

		const index = globalThis._sentinels.push(this as never) - 1;

		this.callback();

		globalThis._sentinels.splice(index, 1);
	}

	/**
	 * Stops watching for changes
	 */
	stop(): void {
		if (!this.active) {
			return;
		}

		this.active = false;

		for (const value of this.values) {
			value.watchers.delete(this as never);
		}

		this.values.clear();
	}
}

/**
 * Creates a watcher
 */
export function watch(callback: () => void): Watcher {
	return new Watcher(callback);
}
