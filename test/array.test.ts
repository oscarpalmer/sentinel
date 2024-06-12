import {expect, test} from 'bun:test';
import {wait} from '@oscarpalmer/atoms/timer';
import {array} from '../src';

test('value', () => {
	const arr = array([1, 2, 3]);

	expect(JSON.stringify(arr.get())).toBe('[1,2,3]');
	expect(JSON.stringify(arr.peek())).toBe('[1,2,3]');
	expect(JSON.stringify(arr.toJSON())).toBe('[1,2,3]');
	expect(arr.toString()).toBe('1,2,3');
});

test('keyed', () => {
	const arr = array([1, 2, 3]);

	expect(arr.get(0)).toBe(1);
	expect(arr.get(-1)).toBe(3);
	expect(arr.get(3)).toBe(undefined as never);
});

test('filter', done => {
	const arr = array([1, 2, 3]);

	const filtered = arr.filter(value => value > 1);

	expect(JSON.stringify(filtered.get())).toBe('[2,3]');

	arr.splice(0, 3);

	wait(() => {
		expect(JSON.stringify(filtered.get())).toBe('[]');

		done();
	});
});

test('insert', done => {
	const arr = array([1, 2, 3]);

	expect(arr.insert(0, 0)).toBe(4);
	expect(arr.insert(2, 1.5)).toBe(5);
	expect(arr.insert(5, 5)).toBe(6);

	wait(() => {
		expect(JSON.stringify(arr.get())).toBe('[0,1,1.5,2,3,5]');

		done();
	});
});

test('length', done => {
	const arr = array([1, 2, 3]);

	expect(arr.length).toBe(3);

	arr.length = 0;

	wait(() => {
		expect(arr.length).toBe(0);
		expect(JSON.stringify(arr.get())).toBe('[]');

		done();
	});
});

test('map', done => {
	const arr = array([1, 2, 3]);
	const mapped = arr.map(value => value * 2);

	wait(() => {
		expect(mapped.get()).toEqual([2, 4, 6]);

		arr.splice(0, 3);

		wait(() => {
			expect(mapped.get()).toEqual([]);

			done();
		});
	});
});

test('push', done => {
	const arr = array([1, 2, 3]);

	expect(arr.push(4, 5, 6)).toBe(6);

	wait(() => {
		expect(JSON.stringify(arr.get())).toBe('[1,2,3,4,5,6]');

		done();
	});
});

test('set', done => {
	const arr = array([1, 2, 3]);

	arr.set(1, 1.5);

	wait(() => {
		expect(JSON.stringify(arr.get())).toBe('[1,1.5,3]');

		arr.set([]);

		wait(() => {
			expect(JSON.stringify(arr.get())).toBe('[]');

			done();
		});
	});
});

test('subscriptions', done => {
	const arr = array([1, 2, 3]);

	let anySubscribed = 0;
	let negativeSubscribed = 0;
	let positiveSubscribed = 0;

	const negativeSubscriber = (value: number) => {
		anySubscribed += 1;
		negativeSubscribed += 1;
	};

	const positiveSubscriberOne = (value: number) => {
		anySubscribed += 1;
		positiveSubscribed += 1;
	};

	const positiveSubscriberTwo = (value: number) => {
		anySubscribed += 1;
		positiveSubscribed += 1;
	};

	const negativeUnsubscriber = arr.subscribe(-1, negativeSubscriber);
	arr.subscribe(1, positiveSubscriberOne);
	arr.subscribe(1, positiveSubscriberTwo);

	expect(anySubscribed).toBe(3);
	expect(negativeSubscribed).toBe(1);
	expect(positiveSubscribed).toBe(2);

	arr.push(4);
	arr.set(1, 99);

	wait(() => {
		expect(anySubscribed).toBe(6);
		expect(negativeSubscribed).toBe(2);
		expect(positiveSubscribed).toBe(4);

		negativeUnsubscriber();
		arr.unsubscribe(1);

		arr.push(5);
		arr.set(1, 100);

		wait(() => {
			expect(anySubscribed).toBe(6);
			expect(negativeSubscribed).toBe(2);
			expect(positiveSubscribed).toBe(4);

			done();
		});
	});
});

test('toArray', () => {
	const arr = array([1, 2, 3]);
	const copy = arr.toArray();

	expect(arr.peek()).toEqual(copy);
	expect(Array.isArray(copy)).toBe(true);
});
