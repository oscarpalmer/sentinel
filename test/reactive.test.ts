import {expect, test} from 'bun:test';
import {isArray, isComputed, isReactive, isSignal, reactive} from '../src';

test('reactive', () => {
	const arr = reactive([]);
	const obj = reactive({});
	const sig = reactive(0);
	const com = reactive(() => sig.get() ** 2);

	expect(isArray(arr)).toBe(true);
	expect(isSignal(obj)).toBe(true);
	expect(isSignal(sig)).toBe(true);
	expect(isComputed(com)).toBe(true);

	const date = reactive(new Date());
	const sym = reactive(Symbol('test'));
	const map = reactive(new Map());
	const nil = reactive(null);
	const und = reactive(undefined);

	expect(date).toBe(date);
	expect(sym).toBe(sym);
	expect(map).toBe(map);

	expect(isReactive(nil)).toBe(true);
	expect(isReactive(und)).toBe(true);
});
