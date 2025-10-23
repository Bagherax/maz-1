
import { useContext } from 'react';
import { LocalizationContext } from '../context/LocalizationContext';
import { LocalizationContextType } from '../types';

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
