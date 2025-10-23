import React, { createContext, useEffect, ReactNode } from 'react';
import { Theme, ThemeContextType } from '../types';
import { useLocalStorage } from '../hooks/usePersistentState';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use the persistent state hook with a lazy initializer for the default value.
  const [theme, setTheme] = useLocalStorage<Theme>('theme', () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // This useEffect is still needed to update the DOM.
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};