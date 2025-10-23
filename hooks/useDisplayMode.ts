import { useMemo } from 'react';
import { useLocalStorage } from './usePersistentState';
import { DisplayMode } from '../types';

export interface DisplayConfig {
  gridClass: string;
}

const displayModeConfig: Record<DisplayMode, DisplayConfig> = {
  compact: {
    gridClass: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6',
  },
  standard: {
    gridClass: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
  },
  detailed: {
    gridClass: 'grid-cols-1 md:grid-cols-2',
  },
  list: {
    gridClass: 'grid-cols-1',
  },
};

export const useDisplayMode = () => {
  const [displayMode, setDisplayMode] = useLocalStorage<DisplayMode>('marketplaceDisplayMode', 'standard');
  
  const currentDisplayConfig = useMemo(() => displayModeConfig[displayMode], [displayMode]);

  return {
    displayMode,
    setDisplayMode,
    currentDisplayConfig,
  };
};