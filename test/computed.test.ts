import {expect, test} from 'bun:test';
import {wait} from '@oscarpalmer/atoms/timer';
import {computed, signal} from '../src';

test('computed', done => {
	const first = signal('comp');
	const second = signal('uted');
	const third = computed(() => first.get() + second.get());

	expect(third.get()).toBe('computed');
	expect(third.peek()).toBe('computed');

	first.update(current => `${current}!!!`);

	wait(() => {
		expect(third.get()).toBe('comp!!!uted');

		wait(() => {
			third.stop();

			second.update(current => `${current}!!!`);

			wait(() => {
				expect(third.get()).toBe('comp!!!uted');

				third.run();

				wait(() => {
					expect(third.get()).toBe('comp!!!uted!!!');

					done();
				});
			});
		});
	});
});
