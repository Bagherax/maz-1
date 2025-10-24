import React from 'react';
import CategoryManager from './CategoryManager';
import { useMarketplaceUI } from '../../../../context/MarketplaceUIContext';
import { useAuth } from '../../../../hooks/useAuth';
import { useLocalization } from '../../../../hooks/useLocalization';
import SortDropdown from './SortDropdown';
import DisplayModeSelector from './DisplayModeSelector';
import Icon from '../../../../components/Icon';
import { useView } from '../../../../App';
import LocationDisplay from '../../../../components/LocationDisplay';
import ThemeSwitcher from '../../../../components/ThemeSwitcher';
import LanguageSwitcher from '../../../../components/LanguageSwitcher';
import CloseButton from '../../../../components/CloseButton';

interface SearchExpansionPanelProps {
  isExpanded: boolean;
  recentSearches: string[];
  onRecentSearchSelect: (query: string) => void;
  onOpenAdminDashboard: () => void;
  onClose: () => void;
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

const ToolbarButton: React.FC<{ icon: React.ComponentProps<typeof Icon>['name'], onClick: () => void, title: string, colorClass: string }> = ({ icon, onClick, title, colorClass }) => (
    <button
      className={`p-3 rounded-xl text-white hover:opacity-80 transition-colors flex-shrink-0 ${colorClass}`}
      onClick={onClick}
      title={title}
    >
      <Icon name={icon} className="w-6 h-6" />
    </button>
);


const SearchExpansionPanel: React.FC<SearchExpansionPanelProps> = ({ isExpanded, recentSearches, onRecentSearchSelect, onOpenAdminDashboard, onClose }) => {
  const { 
    filters, 
    onFilterChange,
    displayMode,
    onDisplayModeChange,
    sortBy,
    onSortChange,
    isModeratorView,
    toggleModeratorView,
  } = useMarketplaceUI();
  const { user, isAuthenticated, isGuest, promptLoginIfGuest } = useAuth();
  const { t } = useLocalization();
  const { setView } = useView();

  const handleCategorySelect = (categoryName: string) => {
    onFilterChange({
      categories: filters.categories.includes(categoryName) ? [] : [categoryName],
    });
  };

  const handleCreateAdClick = () => {
    if (promptLoginIfGuest({ type: 'create' })) {
        return;
    }
    setView({ type: 'create' });
  };

  return (
    <div className={`
      overflow-hidden transition-all duration-500 ease-in-out
      ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
    `}>
      <div className="relative py-4 animate-slide-down-fast">
        <CloseButton
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-[6px]"
        />
        
        {/* NEW TOOLBAR */}
        <div className="flex items-center justify-center flex-wrap gap-3 mb-6 px-4">
            <ToolbarButton 
              icon="users"
              onClick={() => alert('P2P Identity Management feature coming soon!')}
              title="P2P Identity Management"
              colorClass="bg-slate-500"
            />
            <ToolbarButton 
              icon="shield-check"
              onClick={() => alert('P2P Identity Management feature coming soon!')}
              title="P2P Identity Management"
              colorClass="bg-purple-600"
            />
            <ToolbarButton 
              icon="moderator-view"
              onClick={() => alert('Feature coming soon!')}
              title="Coming Soon"
              colorClass="bg-slate-500"
            />
             <ToolbarButton 
              icon="shield-check"
              onClick={() => alert('Local Storage Encryption feature coming soon!')}
              title="Local Storage Encryption"
              colorClass="bg-blue-600"
            />

            <LanguageSwitcher />
            <ThemeSwitcher />

            {user?.isAdmin && (
                <>
                    <ToolbarButton 
                        icon="moderator-view"
                        onClick={toggleModeratorView}
                        title={t('aria.toggle_moderator_view')}
                        colorClass={isModeratorView ? 'bg-indigo-600' : 'bg-gray-600'}
                    />
                    <ToolbarButton 
                        icon="shield-check"
                        onClick={onOpenAdminDashboard}
                        title={t('aria.open_marketplace_admin_panel')}
                        colorClass="bg-green-500"
                    />
                </>
            )}
        </div>

        {/* NEW: Category List Section */}
        <div className="mt-6 border-b dark:border-gray-700 pb-6 mb-6">
          <CategoryManager 
              displayType="list"
              selectedCategory={filters.categories.length > 0 ? filters.categories[0] : undefined}
              onSelectCategory={handleCategorySelect}
              isAdmin={!!user?.isAdmin}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
          {/* Section 1: Actions */}
          <div className="md:col-span-1 space-y-6">
              <Section title={t('smart_search.quick_actions')}>
                  <ActionButton icon="plus" label={t('smart_search.add_new_ad')} onClick={handleCreateAdClick} />
                  <ActionButton icon="rocket-launch" label={t('controls.add_paid_ad')} onClick={() => alert('Paid Ads feature coming soon!')} />
                  <ActionButton icon="share" label={t('controls.social_booster')} onClick={() => alert('Social Booster feature coming soon!')} />
                  <ActionButton icon="video" label={t('social_commerce.liveSelling')} onClick={() => alert(t('social_commerce.liveSelling') + ' feature coming soon!')} iconColor="text-red-500" />
                  <ActionButton icon="users" label={t('smart_search.interest_groups')} onClick={() => alert(t('social_commerce.interestGroups') + ' feature coming soon!')} iconColor="text-teal-500" />
                  <ActionButton icon="share-network" label={t('smart_search.affiliate_program')} onClick={() => alert(t('social_commerce.affiliateProgram') + ' feature coming soon!')} iconColor="text-green-500" />
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

          {/* Section 2: View Options */}
          <div className="md:col-span-1 space-y-6">
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
                  <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Location</label>
                      <div className="mt-1">
                          <LocationDisplay />
                      </div>
                  </div>
              </Section>
          </div>

          {/* Section 3: Navigation */}
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
    </div>
  );
};

export default SearchExpansionPanel;