import React, { createContext, ReactNode } from 'react';
import { AuthConfig, AuthConfigContextType } from '../types';
import { useLocalStorage } from '../hooks/usePersistentState';

export const AuthConfigContext = createContext<AuthConfigContextType | undefined>(undefined);

const defaultConfig: AuthConfig = {
  enabledMethods: ['email', 'google', 'facebook', 'twitter', 'apple', 'github', 'phone'],
  visibleElements: ['rememberMe', 'forgotPassword', 'socialDivider', 'termsCheckbox', 'countrySelector'],
  colorScheme: {
    primary: '#4F46E5', // indigo-600
    background: '#F9FAFB', // gray-50
    text: '#1F2937', // gray-800
    button: '#4F46E5', // indigo-600
    buttonText: '#FFFFFF', // white
    border: '#D1D5DB', // gray-300
  },
  layout: {
    position: 'center',
    gridCols: 2,
  },
  customCSS: '',
  languageSettings: {
    defaultLanguage: 'en',
    enabledLanguages: ['en', 'ar'],
  },
};


export const AuthConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authConfig, setAuthConfig] = useLocalStorage<AuthConfig>('authConfig', defaultConfig);

  return (
    <AuthConfigContext.Provider value={{ authConfig, setAuthConfig }}>
      {children}
    </AuthConfigContext.Provider>
  );
};