import { useState, Dispatch, SetStateAction, useEffect, useCallback } from 'react';

/**
 * A custom hook that persists state in localStorage.
 * This version uses a standard `useEffect` to asynchronously persist state changes,
 * preventing UI blocking and ensuring a responsive user experience.
 * @param key The key to use in localStorage.
 * @param defaultValue The default value or a lazy initializer function.
 * @returns A stateful value, a function to update it, and a function to synchronously clear it from storage.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T | (() => T)
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue);
      }
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
    }
    // Support lazy initialization, same as useState
    return defaultValue instanceof Function ? defaultValue() : defaultValue;
  });

  // Use useEffect to persist the state to localStorage after the state has been updated.
  // This is asynchronous and won't block the UI rendering.
  useEffect(() => {
    try {
      if (state === undefined || state === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  return [state, setState, clear];
}