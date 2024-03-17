import {expect, test} from 'bun:test';
import {wait} from '@oscarpalmer/atoms/timer';
import {signal, watch} from '../src';

test('effect', done => {
	let value: unknown = undefined;

	const sig = signal('effect');

	const w = watch(() => {
		value = sig.value;
	});

	expect(value).toBe('effect');

	sig.value += '!';

	wait(() => {
		expect(value).toBe('effect!');

		w.stop();

		sig.value += '!';

		wait(() => {
			expect(value).toBe('effect!');

			w.start();

			wait(() => {
				expect(value).toBe('effect!!');

				done();
			});
		});
	});
});
