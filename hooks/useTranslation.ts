import { useContext } from 'react';
import { TranslationContext } from '../context/TranslationContext';
import { TranslationContextType } from '../types';

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};