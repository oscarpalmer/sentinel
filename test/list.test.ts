import {expect, test} from 'bun:test';
import {wait} from '@oscarpalmer/atoms/timer';
import {effect, list} from '../src';

test('list', done => {
	const arr = list([1, 2, 3]);

	expect(JSON.stringify(arr.value)).toBe('[1,2,3]');
	expect(JSON.stringify(arr.get())).toBe('[1,2,3]');
	expect(JSON.stringify(arr.peek())).toBe('[1,2,3]');
	expect(JSON.stringify(arr.toJSON())).toBe('[1,2,3]');
	expect(arr.toString()).toBe('1,2,3');

	let value: unknown = undefined;

	effect(() => {
		value = JSON.stringify(arr.value);
	});

	expect(value).toBe('[1,2,3]');

	arr.stop();

	arr.value.push(4);

	wait(() => {
		expect(value).toBe('[1,2,3]');

		arr.run();

		wait(() => {
			expect(value).toBe('[1,2,3,4]');

			arr.length = arr.length + 1;

			wait(() => {
				expect(value).toBe('[1,2,3,4,null]');

				arr.length = -99;

				wait(() => {
					expect(value).toBe('[]');

					done();
				});
			});
		});
	});
});
