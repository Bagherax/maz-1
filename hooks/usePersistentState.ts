import { useState, Dispatch, SetStateAction } from 'react';

/**
 * A custom hook that persists state in localStorage.
 * It has the same API as React's useState.
 * @param key The key to use in localStorage.
 * @param defaultValue The default value or a lazy initializer function.
 * @returns A stateful value, and a function to update it.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] {
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

  const setPersistentState: Dispatch<SetStateAction<T>> = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      if (valueToStore === undefined || valueToStore === null) {
          localStorage.removeItem(key);
      } else {
          localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [state, setPersistentState];
}
