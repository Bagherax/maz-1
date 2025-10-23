import React, { createContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { TranslationContextType, TranslationConfig, SupportedLanguage } from '../types';
import { translateContent } from '../utils/translate';
import { useLocalization } from '../hooks/useLocalization';
import { useLocalStorage } from '../hooks/usePersistentState';
import { useCacheManager } from '../hooks/useCacheManager';

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language: uiLanguage } = useLocalization();
  const [config, setConfig] = useLocalStorage<TranslationConfig>('translationConfig', {
    targetLanguage: uiLanguage === 'ar' ? 'en' : 'ar',
    showOriginal: false,
  });
  const [translatingKeys, setTranslatingKeys] = useState<Set<string>>(new Set());

  const { get: getFromCache, set: setInCache, clear: clearCache } = useCacheManager<string, Record<SupportedLanguage, string>>();
  
  // Refs for batching mechanism
  const translationQueue = useRef<Map<string, (translatedText: string) => void>>(new Map());
  const batchTimeout = useRef<number | null>(null);

  // When language changes, clear loading states and the cache
  useEffect(() => {
    setTranslatingKeys(new Set());
    clearCache();
  }, [config.targetLanguage, clearCache]);


  const processBatch = useCallback(async () => {
    if (translationQueue.current.size === 0) return;

    // FIX: Explicitly type `textsToTranslate` to prevent type inference issues.
    const textsToTranslate: string[] = Array.from(translationQueue.current.keys());
    const callbacks = new Map(translationQueue.current);
    
    // Clear the queue for the next batch
    translationQueue.current.clear();
    
    try {
        const translatedTexts = await translateContent(textsToTranslate, config.targetLanguage);
        
        translatedTexts.forEach((translatedText, index) => {
            const originalText = textsToTranslate[index];
            const callback = callbacks.get(originalText);
            
            // Update cache
            const cacheKey = originalText;
            const currentEntry = getFromCache(cacheKey) || {} as Record<SupportedLanguage, string>;
            currentEntry[config.targetLanguage] = translatedText;
            setInCache(cacheKey, currentEntry);
            
            // Resolve the promise for the individual translate call
            // FIX: Use a `typeof` check as a more robust type guard.
            if (typeof callback === 'function') {
                callback(translatedText);
            }
        });
    } catch (error) {
        console.error("Translation batch processing failed", error);
        // On failure, resolve all with original text
        textsToTranslate.forEach((originalText) => {
            const callback = callbacks.get(originalText);
            // FIX: Use a `typeof` check as a more robust type guard.
            if (typeof callback === 'function') {
                callback(originalText);
            }
        });
    } finally {
        // Clear loading states
        setTranslatingKeys(prev => {
            const newSet = new Set(prev);
            textsToTranslate.forEach(text => newSet.delete(`${text}-${config.targetLanguage}`));
            return newSet;
        });
    }

  }, [config.targetLanguage, getFromCache, setInCache]);

  const translate = useCallback((text: string): Promise<string> => {
    const { targetLanguage } = config;
    if (!text || targetLanguage === 'en') {
        return Promise.resolve(text);
    }

    const cachedEntry = getFromCache(text);
    if (cachedEntry && cachedEntry[targetLanguage]) {
        return Promise.resolve(cachedEntry[targetLanguage]);
    }

    // Add to loading state immediately
    setTranslatingKeys(prev => new Set(prev).add(`${text}-${targetLanguage}`));

    // Debounce the batch processing
    if (batchTimeout.current) {
        clearTimeout(batchTimeout.current);
    }
    batchTimeout.current = window.setTimeout(processBatch, 50); // Batch requests within 50ms

    // Return a promise that will be resolved when the batch is processed
    return new Promise(resolve => {
        translationQueue.current.set(text, resolve);
    });
  }, [config.targetLanguage, getFromCache, processBatch]);


  const isTranslating = (text: string): boolean => {
    return translatingKeys.has(`${text}-${config.targetLanguage}`);
  };

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
        if (batchTimeout.current) {
            clearTimeout(batchTimeout.current);
        }
    };
  }, []);

  const value = {
    config,
    setConfig,
    translate,
    isTranslating
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
