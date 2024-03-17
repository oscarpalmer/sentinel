import {expect, test} from 'bun:test';
import {
	computed,
	isComputed,
	isReactive,
	isSignal,
	isWatcher,
	signal,
	watch,
} from '../src';

test('is', () => {
	let value = '';

	const sig = signal('isSignal');
	const com = computed(() => `iScomputed: ${sig.value}!!!`);

	const w = watch(() => {
		value += com.value;
	});

	expect(isComputed(com)).toBe(true);
	expect(isWatcher(w)).toBe(true);
	expect(isSignal(sig)).toBe(true);

	expect(isReactive(com)).toBe(true);
	expect(isReactive(sig)).toBe(true);
	expect(isReactive(w)).toBe(false);

	expect(isComputed(sig)).toBe(false);
	expect(isWatcher(com)).toBe(false);
	expect(isSignal(w)).toBe(false);
});
