import { useRef, useCallback } from 'react';

// This is a SIMULATED IndexedDB hook using an in-memory Map for demonstration.
// It no longer uses localStorage to avoid "quota exceeded" errors with large state objects.
// The data will reset on page refresh, which is the expected behavior for this simulation.
const dbs = new Map<string, Map<string, any>>();

export const useIndexedDB = (dbName: string) => {
  const db = useRef<Map<string, any>>();

  if (!dbs.has(dbName)) {
    dbs.set(dbName, new Map<string, any>());
  }
  // FIX: The Map.get() method requires one argument. Passing `dbName` to retrieve the correct database map.
  db.current = dbs.get(dbName);


  const setItem = useCallback(async <T>(key: string, value: T): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate async latency
      setTimeout(() => {
        db.current?.set(key, value);
        resolve();
      }, 50);
    });
  }, []);

  const getItem = useCallback(async <T>(key: string): Promise<T | null> => {
    return new Promise((resolve) => {
      // Simulate async latency
      setTimeout(() => {
        const item = db.current?.get(key);
        resolve(item || null);
      }, 50);
    });
  }, []);

  const removeItem = useCallback(async (key: string): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            db.current?.delete(key);
            resolve();
        }, 10)
    });
  }, []);

  return { setItem, getItem, removeItem };
};