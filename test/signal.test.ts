import {expect, test} from 'bun:test';
import {wait} from '@oscarpalmer/atoms/timer';
import {signal, watch} from '../src';

test('signal', done => {
	const sig = signal('signal');

	expect(sig.value).toBe('signal');
	expect(sig.get()).toBe('signal');
	expect(sig.peek()).toBe('signal');
	expect(sig.toJSON()).toBe('signal');
	expect(sig.toString()).toBe('signal');

	let value: unknown = undefined;

	watch(() => {
		value = sig.value;
	});

	expect(value).toBe('signal');

	sig.stop();
	sig.stop();

	sig.set(`${sig.value}!`);

	sig.value = sig.peek();

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
