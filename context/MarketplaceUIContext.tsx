import React, { createContext, useContext, useMemo, ReactNode, useState } from 'react';
// FIX: Imported UserTier and defined the Filters interface locally,
// as the original import source is now obsolete and was causing a module resolution error.
import { Ad, DisplayMode, SortOption, UserTier, Filters } from '../types';
import { useLocalStorage } from '../hooks/usePersistentState';
import { useMarketplace } from './MarketplaceContext';

interface MarketplaceUIContextType {
    filters: Filters;
    onFilterChange: (newFilters: Partial<Filters>) => void;
    displayMode: DisplayMode;
    onDisplayModeChange: (mode: DisplayMode) => void;
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
    onReset: () => void;
    filteredAds: Ad[];
    resultsCount: number;
    isModeratorView: boolean;
    toggleModeratorView: () => void;
}

const MarketplaceUIContext = createContext<MarketplaceUIContextType | undefined>(undefined);

const initialFilters: Filters = {
    query: '',
    categories: [],
    condition: 'all',
    priceRange: [0, 5000000],
    sellerTiers: [],
};

export const MarketplaceUIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { ads, users } = useMarketplace();

    const [filters, setFilters] = useLocalStorage<Filters>('marketplaceFilters', initialFilters);
    const [displayMode, setDisplayMode] = useLocalStorage<DisplayMode>('marketplaceDisplayMode', 'standard');
    // FIX: Using a value as a key for localStorage can lead to conflicts. Changed to a unique key 'marketplaceSortBy'.
    const [sortBy, setSortBy] = useLocalStorage<SortOption>('marketplaceSortBy', 'date-new-old');
    const [isModeratorView, setIsModeratorView] = useState(false);

    const filteredAds = useMemo(() => {
        return ads.filter(ad => {
            const { query, categories, condition, priceRange, sellerTiers } = filters;
            const seller = users.find(u => u.id === ad.seller.id);

            if (ad.status !== 'active') return false;
            if (query && !ad.title.toLowerCase().includes(query.toLowerCase()) && !ad.description.toLowerCase().includes(query.toLowerCase())) return false;
            if (categories.length > 0 && !categories.includes(ad.category)) return false;
            if (condition !== 'all' && ad.condition !== condition) return false;
            if (ad.price < priceRange[0] || ad.price > priceRange[1]) return false;
            if (sellerTiers.length > 0 && (!seller || !sellerTiers.includes(seller.tier))) return false;
            
            return true;
        });
    }, [ads, filters, users]);

    const handleFilterChange = (newFilters: Partial<Filters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };
    
    const handleResetFilters = () => {
        setSortBy('date-new-old');
        setFilters(prev => ({
            ...initialFilters,
            query: prev.query // Keep the search query
        }));
    };
    
    const toggleModeratorView = () => setIsModeratorView(prev => !prev);


    const value = {
        filters,
        onFilterChange: handleFilterChange,
        displayMode,
        onDisplayModeChange: setDisplayMode,
        sortBy,
        onSortChange: setSortBy,
        onReset: handleResetFilters,
        filteredAds,
        resultsCount: filteredAds.length,
        isModeratorView,
        toggleModeratorView,
    };

    return (
        <MarketplaceUIContext.Provider value={value}>
            {children}
        </MarketplaceUIContext.Provider>
    );
};

export const useMarketplaceUI = (): MarketplaceUIContextType => {
    const context = useContext(MarketplaceUIContext);
    if (!context) {
        throw new Error('useMarketplaceUI must be used within a MarketplaceUIProvider');
    }
    return context;
};