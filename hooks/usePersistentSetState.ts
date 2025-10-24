import { useState, Dispatch, SetStateAction, useEffect, useCallback } from 'react';

/**
 * A custom hook that persists a Set in localStorage.
 * It uses an asynchronous `useEffect` to prevent UI blocking during persistence.
 * @param key The key to use in localStorage.
 * @returns A stateful Set, a function to update it, and a function to synchronously clear it from storage.
 */
export function usePersistentSet<T>(
  key: string
): [Set<T>, Dispatch<SetStateAction<Set<T>>>, () => void] {
  const [state, setState] = useState<Set<T>>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        // Rehydrate the Set from the stored array
        return new Set(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
    }
    return new Set<T>();
  });

  useEffect(() => {
    try {
      // Convert the Set to an array for JSON serialization.
      localStorage.setItem(key, JSON.stringify(Array.from(state)));
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