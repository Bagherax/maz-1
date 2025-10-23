import { useContext } from 'react';
import { AuthConfigContext } from '../context/AuthConfigContext';
import { AuthConfigContextType } from '../types';

export const useAuthConfig = (): AuthConfigContextType => {
  const context = useContext(AuthConfigContext);
  if (!context) {
    throw new Error('useAuthConfig must be used within an AuthConfigProvider');
  }
  return context;
};
