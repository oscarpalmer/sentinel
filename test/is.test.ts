import {expect, test} from 'bun:test';
import {
	computed,
	effect,
	isComputed,
	isEffect,
	isReactive,
	isSignal,
	signal,
} from '../src';

test('is', () => {
	let value = '';

	const sig = signal('isSignal');
	const com = computed(() => `iScomputed: ${sig.value}!!!`);

	const fx = effect(() => {
		value += com.value;
	});

	expect(isComputed(com)).toBe(true);
	expect(isEffect(fx)).toBe(true);
	expect(isSignal(sig)).toBe(true);

	expect(isReactive(com)).toBe(true);
	expect(isReactive(sig)).toBe(true);
	expect(isReactive(fx)).toBe(false);

	expect(isComputed(sig)).toBe(false);
	expect(isEffect(com)).toBe(false);
	expect(isSignal(fx)).toBe(false);
});
