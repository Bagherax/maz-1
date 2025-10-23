import React from 'react';
import { Ad } from '../../../../types';
import { useMarketplace } from '../../../../context/MarketplaceContext';
import { useLocalization } from '../../../../hooks/useLocalization';
import Icon from '../../../../components/Icon';
import { useAuth } from '../../../../hooks/useAuth';

interface AdActionsProps {
  ad: Ad;
}

const AdActions: React.FC<AdActionsProps> = ({ ad }) => {
  const { t } = useLocalization();
  const { toggleLike, isLiked, toggleFavorite, isFavorite, shareAd } = useMarketplace();
  const { promptLoginIfGuest } = useAuth();

  const baseButtonClass = "flex-1 flex items-center justify-center space-x-2 rtl:space-x-reverse py-3 px-2 border rounded-md font-semibold transition-colors duration-200 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 ripple";
  
  const handleAction = (action: () => void) => {
    if (promptLoginIfGuest({ type: 'ad', id: ad.id })) return;
    action();
  };

  return (
    <div className="mt-6 flex items-center space-x-2 rtl:space-x-reverse">
      <button
        onClick={() => handleAction(() => toggleLike(ad.id))}
        className={`${baseButtonClass}`}
        aria-pressed={isLiked(ad.id)}
      >
        <Icon name="heart" className={`w-5 h-5 ${isLiked(ad.id) ? 'text-red-500 fill-current' : ''}`} />
        <span className="text-sm">{t('social.like')} ({ad.stats.likes})</span>
      </button>
       <button
        onClick={() => handleAction(() => toggleFavorite(ad.id))}
        className={`${baseButtonClass}`}
        aria-pressed={isFavorite(ad.id)}
      >
        <Icon name="bookmark" className={`w-5 h-5 ${isFavorite(ad.id) ? 'text-indigo-500 fill-current' : ''}`} />
        <span className="text-sm">{t('social.save')}</span>
      </button>
       <button
        onClick={() => handleAction(() => shareAd(ad.id))}
        className={`${baseButtonClass}`}
      >
        <Icon name="share" className="w-5 h-5" />
        <span className="text-sm">{t('social.share')}</span>
      </button>
    </div>
  );
};
export default AdActions;