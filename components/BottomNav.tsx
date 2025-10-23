import React from 'react';
import Icon from './Icon';
import { useView } from '../App';
import { useAuth } from '../hooks/useAuth';
// FIX: Imported the `View` type to resolve TypeScript errors.
import { View } from '../types';
import { useLocalization } from '../hooks/useLocalization';

const BottomNav: React.FC = () => {
  const { view, setView } = useView();
  const { user, promptLoginIfGuest, isGuest } = useAuth();
  const { t } = useLocalization();

  const handleCreateClick = () => {
    if (promptLoginIfGuest({ type: 'create' })) {
      return;
    }
    setView({ type: 'create' });
  };

  const handleMessagesClick = () => {
    if (promptLoginIfGuest({ type: 'chat' })) {
        return;
    }
    setView({ type: 'chat' });
  };

  const NavButton: React.FC<{
    label: string;
    icon: React.ComponentProps<typeof Icon>['name'];
    targetView?: View;
    onClick?: () => void;
    currentView: View;
    isActiveOverride?: boolean;
  }> = ({ label, icon, targetView, onClick, currentView, isActiveOverride }) => {
    const isActive = isActiveOverride !== undefined ? isActiveOverride : (() => {
      if (!targetView) return false;
      // Special case for Explore tab to be active during 'ad' view
      if (targetView.type === 'marketplace' && (currentView.type === 'marketplace' || currentView.type === 'ad')) {
        return true;
      }
      
      if (targetView.type !== currentView.type) {
        return false;
      }
      
      // For views with IDs (like profile), check if IDs match too
      if (targetView.type === 'profile' && currentView.type === 'profile') {
        return targetView.id === currentView.id;
      }

      // For simple views without IDs, checking the type is enough
      return true;
    })();

    return (
      <button
        onClick={onClick || (() => setView(targetView!))}
        className={`flex flex-col items-center justify-center w-full transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-indigo-500'}`}
      >
        <Icon name={icon} className="w-6 h-6 mb-1" />
        <span className="text-xs">{label}</span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex md:hidden items-center justify-around z-30">
      <NavButton label={t('bottom_nav.explore')} icon="storefront" targetView={{ type: 'marketplace' }} currentView={view} />
      <NavButton label={t('bottom_nav.favorites')} icon="heart" targetView={{ type: 'marketplace' }} currentView={{type: 'marketplace'}} /> {/* Placeholder */}

      <button onClick={handleCreateClick} className="flex flex-col items-center justify-center -mt-6">
        <div className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors">
          <Icon name="plus" className="w-8 h-8" />
        </div>
      </button>

      <NavButton 
        label={t('bottom_nav.messages')} 
        icon="chat-bubble-left-right" 
        onClick={handleMessagesClick}
        currentView={view}
        isActiveOverride={view.type === 'chat'}
      />
      {user && !isGuest && <NavButton label={t('bottom_nav.profile')} icon="user-circle" targetView={{ type: 'profile', id: user.id }} currentView={view} />}
    </div>
  );
};

export default BottomNav;