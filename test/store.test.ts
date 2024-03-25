import {expect, test} from 'bun:test';
import {wait} from '@oscarpalmer/atoms/timer';
import {effect, store} from '../src';

type Data = {
	key: string;
};

test('store', done => {
	const obj = store<Data>({key: 'value'});

	let keyValue = '?';

	effect(() => {
		keyValue = obj.value.key;
	});

	expect(obj.value).toEqual(obj.get());
	expect(obj.value).toEqual(obj.peek());

	expect(obj.value.key).toBe(keyValue);

	obj.stop();

	obj.set('key', 'xyz');

	wait(() => {
		expect(obj.get('key')).toBe('xyz');
		expect(keyValue).toBe('value');

		obj.run();

		wait(() => {
			expect(obj.peek('key')).toBe(keyValue);
			expect(keyValue).toBe('xyz');

			done();
		});
	});
});
