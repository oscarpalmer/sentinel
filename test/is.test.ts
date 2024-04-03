import {expect, test} from 'bun:test';
import {
	computed,
	effect,
	isComputed,
	isEffect,
	isList,
	isReactive,
	isSignal,
	list,
	signal,
} from '../src';

test('is', () => {
	let value = '';

	const sig = signal('isSignal');
	const com = computed(() => `isComputed: ${sig}!!!`);
	const arr = list([1, 2, 3]);

	const fx = effect(() => {
		value += com.get();
	});

	expect(isComputed(com)).toBe(true);
	expect(isEffect(fx)).toBe(true);
	expect(isList(arr)).toBe(true);
	expect(isSignal(sig)).toBe(true);

	expect(isReactive(com)).toBe(true);
	expect(isReactive(sig)).toBe(true);
	expect(isReactive(arr)).toBe(true);
	expect(isReactive(fx)).toBe(false);

	expect(isComputed(sig)).toBe(false);
	expect(isEffect(com)).toBe(false);
	expect(isSignal(fx)).toBe(false);
});
