import React from 'react';
import CategoryManager from './CategoryManager';
import { useMarketplaceUI } from '../../../../context/MarketplaceUIContext';
import { useAuth } from '../../../../hooks/useAuth';
import { useLocalization } from '../../../../hooks/useLocalization';
import SortDropdown from './SortDropdown';
import DisplayModeSelector from './DisplayModeSelector';
import Icon from '../../../../components/Icon';
import { Filters, UserTier } from '../../../../types';
import { useView } from '../../../../App';
import { useTheme } from '../../../../hooks/useTheme';

interface SearchExpansionPanelProps {
  isExpanded: boolean;
  recentSearches: string[];
  onRecentSearchSelect: (query: string) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode, className?: string }> = ({ title, children, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">{title}</h3>
    {children}
  </div>
);

const ActionButton: React.FC<{ icon: React.ComponentProps<typeof Icon>['name'], label: string, onClick: () => void, iconColor?: string }> = ({ icon, label, onClick, iconColor = 'text-indigo-500' }) => (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-2 rounded-lg text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
        <Icon name={icon} className={`w-5 h-5 ${iconColor}`} />
        <span>{label}</span>
    </button>
);


const SearchExpansionPanel: React.FC<SearchExpansionPanelProps> = ({ isExpanded, recentSearches, onRecentSearchSelect }) => {
  const { 
    filters, 
    onFilterChange,
    displayMode,
    onDisplayModeChange,
    sortBy,
    onSortChange
  } = useMarketplaceUI();
  const { user, isAuthenticated, isGuest } = useAuth();
  const { t } = useLocalization();
  const { setView } = useView();
  const { theme, toggleTheme } = useTheme();

  const handleCategorySelect = (categoryName: string) => {
    onFilterChange({
      categories: filters.categories.includes(categoryName) ? [] : [categoryName],
    });
  };

  return (
    <div className={`
      overflow-hidden transition-all duration-500 ease-in-out
      ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
    `}>
      <div className="py-4 grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-6 animate-slide-down-fast">
        {/* Section 1 & 2 */}
        <div className="md:col-span-1 space-y-6">
            <Section title={t('smart_search.quick_actions')}>
                <ActionButton icon="plus" label={t('smart_search.add_new_ad')} onClick={() => setView({type: 'create'})} />
                <ActionButton icon="rocket-launch" label={t('controls.add_paid_ad')} onClick={() => alert('Paid Ads feature coming soon!')} />
                <ActionButton icon="share" label={t('controls.social_booster')} onClick={() => alert('Social Booster feature coming soon!')} />
                <ActionButton icon="video" label={t('social_commerce.liveSelling')} onClick={() => alert(t('social_commerce.liveSelling') + ' feature coming soon!')} iconColor="text-red-500" />
                <ActionButton icon="users" label={t('smart_search.interest_groups')} onClick={() => alert(t('social_commerce.interestGroups') + ' feature coming soon!')} iconColor="text-teal-500" />
                <ActionButton icon="share-network" label={t('smart_search.affiliate_program')} onClick={() => alert(t('social_commerce.affiliateProgram') + ' feature coming soon!')} iconColor="text-green-500" />
                <ActionButton icon={theme === 'dark' ? 'sun' : 'moon'} label={t('smart_search.day_night_switch')} onClick={toggleTheme} />
            </Section>
            
            {isAuthenticated && !isGuest && user && (
                 <Section title={t('smart_search.user_controls')}>
                    <ActionButton icon="user-circle" label={t('smart_search.user_profile')} onClick={() => setView({type: 'profile', id: user.id})} />
                    <ActionButton icon="wallet" label={t('smart_search.wallet')} onClick={() => alert(t('feature.wallet_transactions.title') + ' feature coming soon!')} />
                    <ActionButton icon="heart" label={t('smart_search.favorites')} onClick={() => alert('Favorites page coming soon!')} />
                    <ActionButton icon="queue-list" label={t('smart_search.my_ads')} onClick={() => setView({type: 'profile', id: user.id})} />
                    <ActionButton icon="chat-bubble-left-right" label={t('smart_search.messages')} onClick={() => setView({type: 'chat'})} />
                </Section>
            )}
        </div>

        {/* Section 3 */}
        <div className="md:col-span-2 space-y-6">
            <Section title={t('smart_search.view_options')}>
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t('controls.display')}</label>
                    <div className="mt-1">
                        <DisplayModeSelector selected={displayMode} onSelect={onDisplayModeChange} />
                    </div>
                </div>
                 <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <label htmlFor="sort-by" className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t('controls.sort_by')}</label>
                    <div className="mt-1">
                        <SortDropdown selected={sortBy} onSelect={onSortChange} />
                    </div>
                </div>
            </Section>
             <Section title={t('controls.categories')}>
                 <CategoryManager 
                    selectedCategory={filters.categories.length > 0 ? filters.categories[0] : undefined}
                    onSelectCategory={handleCategorySelect}
                    isAdmin={!!user?.isAdmin}
                />
            </Section>
        </div>

        {/* Section 4 */}
        <div className="md:col-span-1 space-y-6">
            <Section title={t('smart_search.quick_navigation')}>
                <div>
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">{t('smart_search.recent_searches')}</h4>
                    {recentSearches.length > 0 ? (
                        <div className="space-y-1">
                            {recentSearches.map(term => (
                                <button key={term} onClick={() => onRecentSearchSelect(term)} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2">
                                    <Icon name="arrow-path" className="w-4 h-4 text-gray-400" />
                                    <span>{term}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500">{t('smart_search.no_recent_searches')}</p>
                    )}
                </div>
            </Section>
        </div>

      </div>
    </div>
  );
};

export default SearchExpansionPanel;