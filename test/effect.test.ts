import {expect, test} from 'bun:test';
import {wait} from '@oscarpalmer/atoms/timer';
import {effect, signal} from '../src';

test('effect', done => {
	let value: unknown = undefined;

	const sig = signal('effect');

	const fx = effect(() => {
		value = sig.value;
	});

	expect(value).toBe('effect');

	sig.value += '!';

	wait(() => {
		expect(value).toBe('effect!');

		fx.stop();
		fx.stop();

		sig.value += '!';

		wait(() => {
			expect(value).toBe('effect!');

			fx.start();
			fx.start();

			wait(() => {
				expect(value).toBe('effect!!');

				done();
			});
		});
	});
});
