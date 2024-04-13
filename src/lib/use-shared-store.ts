import { browser } from '$app/environment';
import { getContext, hasContext, setContext } from 'svelte';
import { readable, writable } from 'svelte/store';

// context for any type of store
export const useSharedStore = <T, A>(name: string, fn: (value?: A) => T, defaultValue?: A) => {
	if (hasContext(name)) {
		return getContext<T>(name);
	}
	const _value = fn(defaultValue);
	setContext(name, _value);
	return _value;
};

// writable store context
export const useWritable = <T>(name: string, value: T) => useSharedStore(name, writable, value);

// readable store context
export const useReadable = <T>(name: string, value: T) => useSharedStore(name, readable, value);

export const useStorage = <T>(key: string, initialValue: T) => {
	let serialize = JSON.stringify;
	let deserialize = JSON.parse;

	//@ts-ignore
	let storedValue: T = browser ? deserialize(localStorage.getItem(key)) : null;
	let store = useWritable<T>('AutoMode', typeof storedValue !== null ? storedValue : initialValue);
	if (browser) store.subscribe((value) => localStorage.setItem(key, serialize(value)));

	return store;
};
