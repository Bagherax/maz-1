import { useRef, useCallback } from 'react';

/**
 * A hook to manage a simple in-memory cache using a Map.
 * The cache persists for the lifetime of the component.
 */
export const useCacheManager = <K, V>() => {
  const cache = useRef<Map<K, V>>(new Map());
  
  const get = useCallback((key: K): V | undefined => {
    return cache.current.get(key);
  }, []);
  
  const set = useCallback((key: K, value: V): void => {
    // Optional: Add cache invalidation logic here (e.g., size limit)
    cache.current.set(key, value);
  }, []);

  const has = useCallback((key: K): boolean => {
    return cache.current.has(key);
  }, []);
  
  const clear = useCallback(() => {
    cache.current.clear();
  }, []);
  
  return { get, set, has, clear };
};