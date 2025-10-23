import { useState, Dispatch, SetStateAction, useEffect } from 'react';

/**
 * A custom hook that persists a Set in localStorage.
 * It handles the conversion to/from an Array for JSON serialization.
 * @param key The key to use in localStorage.
 * @returns A stateful Set, and a function to update it.
 */
export function usePersistentSet<T>(
  key: string
): [Set<T>, Dispatch<SetStateAction<Set<T>>>] {
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
      // Convert the Set to an array for storage
      localStorage.setItem(key, JSON.stringify(Array.from(state)));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}