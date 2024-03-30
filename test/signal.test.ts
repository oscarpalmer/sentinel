import {expect, test} from 'bun:test';
import {wait} from '@oscarpalmer/atoms/timer';
import {effect, signal} from '../src';

test('signal', done => {
	function subscriber(value: string): void {
		valueFromSubscriber = value;
	}

	const sig = signal('signal');

	expect(sig.get()).toBe('signal');
	expect(sig.peek()).toBe('signal');
	expect(sig.toJSON()).toBe('signal');
	expect(sig.toString()).toBe('signal');

	let valueFromEffect: unknown = undefined;
	let valueFromSubscriber: unknown = undefined;

	effect(() => {
		valueFromEffect = sig.get();
	});

	const unsub = sig.subscribe(subscriber);

	expect(valueFromEffect).toBe('signal');
	expect(valueFromSubscriber).toBe(valueFromEffect);

	sig.stop();
	sig.stop();

	unsub();

	sig.unsubscribe(subscriber);

	sig.set(`${sig}!`);
	sig.set(sig.peek());

	wait(() => {
		expect(valueFromEffect).toBe('signal');
		expect(valueFromSubscriber).toBe(valueFromEffect);

		sig.run();
		sig.run();

		sig.subscribe(subscriber);
		sig.subscribe(subscriber);

		wait(() => {
			expect(valueFromEffect).toBe('signal!');
			expect(valueFromSubscriber).toBe(valueFromEffect);

			done();
		});
	});
});
