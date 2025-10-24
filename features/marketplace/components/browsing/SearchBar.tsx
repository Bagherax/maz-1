import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../../components/Icon';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useDebounce } from '../../../../hooks/useDebounce';
import { useMarketplaceUI } from '../../../../context/MarketplaceUIContext';
import SearchExpansionPanel from './SearchExpansionPanel';
import { useLocalStorage } from '../../../../hooks/usePersistentState';

interface SearchBarProps {
  onOpenAdminDashboard: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onOpenAdminDashboard }) => {
  const {
    filters,
    onFilterChange,
  } = useMarketplaceUI();

  const { t } = useLocalization();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [localQuery, setLocalQuery] = useState(filters.query);
  const debouncedQuery = useDebounce(localQuery, 300);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recentSearches', []);


  useEffect(() => {
    // This effect syncs the debounced search input to the global filters context.
    // It runs ONLY when the debounced query changes.
    if (filters.query !== debouncedQuery) {
        onFilterChange({ query: debouncedQuery });
    }
  }, [debouncedQuery, onFilterChange, filters.query]);

  useEffect(() => {
    // This effect manages the recent searches list.
    // It runs ONLY when a meaningful debounced query is produced.
    if (debouncedQuery.trim()) {
        setRecentSearches(prev => {
            const newSearches = [debouncedQuery.trim(), ...prev.filter(s => s.toLowerCase() !== debouncedQuery.trim().toLowerCase())];
            return newSearches.slice(0, 5); // Keep last 5
        });
    }
  }, [debouncedQuery, setRecentSearches]);


  useEffect(() => {
    // Sync local query if filters are reset externally
    if (filters.query !== localQuery) {
        setLocalQuery(filters.query);
    }
  }, [filters.query, localQuery]);
  
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const newSearchBarStyles = `
    .input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-search {
      width: 45px;
      height: 45px;
      border-radius: 22.5px;
      border: none;
      outline: none;
      padding: 18px 16px;
      background-color: transparent;
      cursor: pointer;
      transition: all .5s ease-in-out;
      color: #1f2937; /* Tailwind gray-800 */
    }

    .input-search::placeholder {
      color: transparent;
    }

    .input-search:focus::placeholder {
      color: #6b7280; /* Tailwind gray-500 */
    }
    
    .dark .input-search:focus::placeholder {
      color: #9ca3af; /* Tailwind gray-400 */
    }

    .input-search:focus,
    .input-search:not(:placeholder-shown) {
      background-color: #fff;
      border: 1px solid #3b82f6; /* Tailwind blue-500 */
      width: 290px;
      cursor: text;
      padding: 18px 16px 18px 45px;
    }
    
    .dark .input-search:focus,
    .dark .input-search:not(:placeholder-shown) {
        background-color: #1f2937; /* Tailwind gray-800 */
        border-color: #60a5fa; /* Tailwind blue-400 */
        color: #f3f4f6; /* Tailwind gray-100 */
    }

    .search-icon {
      position: absolute;
      left: 0;
      height: 45px;
      width: 45px;
      background-color: #fff;
      border-radius: 99px;
      z-index: -1;
      fill: #3b82f6; /* Tailwind blue-500 */
      border: 1px solid #3b82f6;
    }
    
    .dark .search-icon {
        background-color: #1f2937;
        border-color: #60a5fa;
        fill: #60a5fa;
    }

    .input-search:focus + .search-icon,
    .input-search:not(:placeholder-shown) + .search-icon {
      z-index: 0;
      background-color: transparent;
      border: none;
    }
  `;

  return (
    <>
      <style>{newSearchBarStyles}</style>
      <div 
        ref={searchBarRef} 
        className="fixed top-0 left-0 right-0 z-40"
      >
        <div className={`
          backdrop-blur-lg transition-all duration-300
          bg-transparent ${isExpanded ? 'shadow-lg' : ''}
        `}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center pt-4 pb-2">
                {/* MAZ Logo */}
                 <h1 className="text-4xl font-black text-gray-800 dark:text-white tracking-tighter">MAZ</h1>
                
                <div className="flex items-center gap-3 w-full justify-center mt-2">
                    {/* New Animated Search Bar */}
                    <div className="input-container">
                        <input 
                            id="main-search"
                            type="text"
                            name="text"
                            className="input-search"
                            placeholder={t('marketplace.search_placeholder')}
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            onFocus={() => setIsExpanded(true)}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24" className="search-icon"><g strokeWidth="0" id="SVGRepo_bgCarrier"></g><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <rect fill="transparent" height="24" width="24"></rect> <path fill="" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM9 11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5ZM11.5 7C9.01472 7 7 9.01472 7 11.5C7 13.9853 9.01472 16 11.5 16C12.3805 16 13.202 15.7471 13.8957 15.31L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L15.31 13.8957C15.7471 13.202 16 12.3805 16 11.5C16 9.01472 13.9853 7 11.5 7Z" clipRule="evenodd" fillRule="evenodd"></path> </g></svg>
                    </div>
                </div>
            </div>

            {/* Expanding Panel */}
            <SearchExpansionPanel 
              isExpanded={isExpanded}
              recentSearches={recentSearches}
              onRecentSearchSelect={(query) => {
                setLocalQuery(query);
                setIsExpanded(false);
              }}
              onOpenAdminDashboard={onOpenAdminDashboard}
              onClose={() => setIsExpanded(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;