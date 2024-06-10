import {expect, test} from 'bun:test';
import {effect, store} from '../src';
import {wait} from '@oscarpalmer/atoms';

test('store', done => {
	const stored = store({key: 'value'});

	let emitted = 0;

	effect(() => {
		stored.get('key');

		emitted += 1;
	});

	expect(emitted).toBe(1);
	expect(stored.peek()).toEqual({key: 'value'});
	expect(stored.peek('key')).toBe('value');

	stored.set('key', 'newValue');

	wait(() => {
		expect(emitted).toBe(2);

		stored.set('key', 'newValue');

		wait(() => {
			expect(emitted).toBe(2);

			done();
		});
	});
});