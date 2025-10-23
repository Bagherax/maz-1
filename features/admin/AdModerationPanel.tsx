import React, { useState } from 'react';
import { Ad } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLocalization } from '../../hooks/useLocalization';
import Icon from '../../components/Icon';

interface AdModerationPanelProps {
  ad: Ad;
}

const AdModerationPanel: React.FC<AdModerationPanelProps> = ({ ad }) => {
  const [reason, setReason] = useState('');
  const { removeAd } = useMarketplace();
  const { t } = useLocalization();

  const handleRemoveAd = () => {
    if (window.confirm(t('moderation.remove_ad_confirm'))) {
      removeAd(ad.id, reason || t('moderation.no_reason_provided'));
      setReason('');
    }
  };
  
  if (ad.status === 'banned') return null;

  return (
    <div className="border-2 border-red-500 rounded-lg p-4 my-6 bg-red-50 dark:bg-gray-800">
      <h3 className="text-lg font-bold text-red-700 dark:text-red-400 flex items-center">
        <Icon name="shield-exclamation" className="w-6 h-6 me-2" />
        {t('moderation.ad_panel_title')}
      </h3>
      <div className="mt-4 space-y-4">
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t('moderation.reason_placeholder')}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-red-500 focus:border-red-500"
        />
        <button
          onClick={handleRemoveAd}
          className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          {t('moderation.remove_ad')}
        </button>
      </div>
    </div>
  );
};

export default AdModerationPanel;