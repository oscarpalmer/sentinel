import {expect, test} from 'bun:test';
import {isComputed, isList, isSignal, isStore, reactive} from '../src';

test('reactive', () => {
	const arr = reactive([]);
	const obj = reactive({});
	const sig = reactive(0);
	const com = reactive(() => sig.get() ** 2);

	expect(isList(arr)).toBe(true);
	expect(isStore(obj)).toBe(true);
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
	expect(nil).toBe(null);
	expect(und).toBe(undefined);
});
