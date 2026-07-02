import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export function useLocalStorage<T>(key: string, initialValue: T, ): Writable<T> {
  
  const value: T = browser 
    ? localStorage?.getItem(key)
      ? JSON.parse(localStorage?.getItem(key) as string)
      : initialValue
    : initialValue;
  
  const store = writable<T>(value);

  store.subscribe((value) =>  {
    if(browser) return localStorage?.setItem(key, JSON.stringify(value));
  });

  return store;
  
}