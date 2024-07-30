import {subscribe} from '../helpers/subscription';
import type {Subscriber, Unsubscriber} from '../models';
import {ReactiveInstance} from './instance';

export class ReactiveValue<Value> extends ReactiveInstance<Value> {
	/**
	 * - Subscribes to changes for the value
	 * - Returns a function to allow for unsubscribing
	 */
	subscribe(subscriber: Subscriber<Value>): Unsubscriber {
		return subscribe(this.state, subscriber);
	}

	/**
	 * Unsubscribes from changes for the value _(and optionally a specific subscriber)_
	 */
	unsubscribe(subscriber?: Subscriber<Value>): void {
		if (subscriber == null) {
			this.state.callbacks.any.clear();
		} else {
			this.state.callbacks.any.delete(subscriber);
		}
	}
}
