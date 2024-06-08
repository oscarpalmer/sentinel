import {expect, test} from 'bun:test';
import {wait} from '@oscarpalmer/atoms/timer';
import {array, effect, signal} from '../src';

test('effect', done => {
	let value: unknown = undefined;

	const sig = signal('effect');

	const fx = effect(() => {
		value = sig.get();
	});

	expect(value).toBe('effect');

	sig.set(`${sig}!`);

	wait(() => {
		expect(value).toBe('effect!');

		fx.stop();
		fx.stop();

		sig.set(`${sig}!`);

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

test('keyed', done => {
	const arr = array([1, 2, 3]);

	let anyEffects = 0;
	let negativeEffects = 0;
	let positiveEffects = 0;

	effect(() => {
		arr.get(-1);

		anyEffects += 1;
		negativeEffects += 1;
	});

	effect(() => {
		arr.get(1);

		anyEffects += 1;
		positiveEffects += 1;
	});

	expect(anyEffects).toBe(2);
	expect(negativeEffects).toBe(1);
	expect(positiveEffects).toBe(1);

	arr.push(4);
	arr.set(1, 99);

	wait(() => {
		expect(anyEffects).toBe(4);
		expect(negativeEffects).toBe(2);
		expect(positiveEffects).toBe(2);

		arr.stop();

		wait(() => {
			arr.push(5);
			arr.set(1, 100);

			wait(() => {
				expect(anyEffects).toBe(4);
				expect(negativeEffects).toBe(2);
				expect(positiveEffects).toBe(2);

				done();
			});
		});
	});
});
