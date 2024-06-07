import {expect, test} from 'bun:test';
import {wait} from '@oscarpalmer/atoms/timer';
import {list} from '../src';

test('value', () => {
	const array = list([1, 2, 3]);

	expect(JSON.stringify(array.get())).toBe('[1,2,3]');
	expect(JSON.stringify(array.peek())).toBe('[1,2,3]');
	expect(JSON.stringify(array.toJSON())).toBe('[1,2,3]');
	expect(array.toString()).toBe('1,2,3');

	expect(array.at(0)).toBe(1);
	expect(array.at(-1)).toBe(3);
	expect(array.at(3)).toBe(undefined as never);

	expect(array.includes(2)).toBe(true);
	expect(array.includes(4)).toBe(false);

	expect(array.indexOf(2)).toBe(1);
	expect(array.indexOf(4)).toBe(-1);
});

test('filter', done => {
	const array = list([1, 2, 3]);

	const filtered = array.filter(value => value > 1);

	expect(JSON.stringify(filtered.get())).toBe('[2,3]');

	array.splice(0, 3);

	wait(() => {
		expect(JSON.stringify(filtered.get())).toBe('[]');

		done();
	});
});

test('find & findIndex', () => {
	const array = list([1, 2, 3]);

	expect(array.find(value => value === 2)).toBe(2);
	expect(array.find(value => value === 4)).toBe(undefined as never);

	expect(array.findIndex(value => value === 2)).toBe(1);
	expect(array.findIndex(value => value === 4)).toBe(-1);
});

test('insert', done => {
	const array = list([1, 2, 3]);

	expect(array.insert(0, 0)).toBe(4);
	expect(array.insert(2, 1.5)).toBe(5);
	expect(array.insert(5, 5)).toBe(6);

	wait(() => {
		expect(JSON.stringify(array.get())).toBe('[0,1,1.5,2,3,5]');

		done();
	});
});

test('length', done => {
	const array = list([1, 2, 3]);

	array.length = 0;

	wait(() => {
		expect(JSON.stringify(array.get())).toBe('[]');

		done();
	});
});

test('map', done => {
	const array = list([1, 2, 3]);
	const mapped = array.map(value => value * 2);

	wait(() => {
		expect(mapped.get()).toEqual([2, 4, 6]);

		array.splice(0, 3);

		wait(() => {
			expect(mapped.get()).toEqual([]);

			done();
		});
	});
});

test('pop & shift', done => {
	const array = list([1, 2, 3]);

	expect(array.pop()).toBe(3);
	expect(array.shift()).toBe(1);

	wait(() => {
		expect(JSON.stringify(array.get())).toBe('[2]');

		done();
	});
});

test('push & unshift', done => {
	const array = list([1, 2, 3]);

	expect(array.push(4, 5, 6)).toBe(6);
	expect(array.unshift(0)).toBe(7);

	wait(() => {
		expect(JSON.stringify(array.get())).toBe('[0,1,2,3,4,5,6]');

		done();
	});
});

test('set', done => {
	const array = list([1, 2, 3]);

	array.set(1, 1.5);

	wait(() => {
		expect(JSON.stringify(array.get())).toBe('[1,1.5,3]');

		array.set([]);

		wait(() => {
			expect(JSON.stringify(array.get())).toBe('[]');

			done();
		});
	});
});
