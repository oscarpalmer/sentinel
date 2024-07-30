import {expect, test} from 'bun:test';
import {wait} from '@oscarpalmer/atoms/timer';
import {effect, signal} from '../src';

test('value', () => {
	const sig = signal('signal');

	expect(sig.get()).toBe('signal');
	expect(sig.peek()).toBe('signal');
	expect(sig.toJSON()).toBe('signal');
	expect(sig.toString()).toBe('signal');

	sig.set('signal!');

	expect(sig.get()).toBe('signal!');
	expect(sig.peek()).toBe('signal!');
	expect(sig.toJSON()).toBe('signal!');
	expect(sig.toString()).toBe('signal!');

	sig.update(value => `${value}!!`);

	expect(sig.get()).toBe('signal!!!');
	expect(sig.peek()).toBe('signal!!!');
	expect(sig.toJSON()).toBe('signal!!!');
	expect(sig.toString()).toBe('signal!!!');
});

test('effected', done => {
	const sig = signal('signal');

	let value: unknown = undefined;

	effect(() => {
		value = sig.get();
	});

	expect(value).toBe('signal');

	sig.stop();
	sig.stop();

	sig.set(`${sig}!`);
	sig.set(sig.peek());

	wait(() => {
		expect(value).toBe('signal');

		sig.run();
		sig.run();

		wait(() => {
			expect(value).toBe('signal!');

			done();
		});
	});
});

test('subscribed', done => {
	function subscriber(v: unknown) {
		value = v;
	}

	const sig = signal('signal');

	let value: unknown = undefined;

	const unsub = sig.subscribe(subscriber);
	const noop = sig.subscribe(subscriber);

	expect(value).toBe('signal');

	expect(noop.toString()).toBe('function noop() {\n}');

	sig.stop();
	sig.stop();

	unsub();
	sig.unsubscribe(subscriber);

	sig.set('signal!');

	wait(() => {
		expect(value).toBe('signal');

		sig.subscribe(subscriber);

		wait(() => {
			expect(value).toBe('signal!');

			done();
		});
	});
});
