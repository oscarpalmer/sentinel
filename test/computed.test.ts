import {expect, test} from 'bun:test';
import {wait} from '@oscarpalmer/atoms/timer';
import {computed, signal} from '../src';

test('computed', done => {
	const first = signal('comp');
	const second = signal('uted');
	const third = computed(() => first.value + second.value);

	expect(third.get()).toBe('computed');
	expect(third.peek()).toBe('computed');

	first.value += '!!!';

	wait(() => {
		expect(third.value).toBe('comp!!!uted');

		wait(() => {
			third.stop();

			second.value += '!!!';

			wait(() => {
				expect(third.value).toBe('comp!!!uted');

				third.run();

				wait(() => {
					expect(third.value).toBe('comp!!!uted!!!');

					done();
				});
			});
		});
	});
});
