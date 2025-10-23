import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useMarketplace } from '../../context/MarketplaceContext';

const ModerationQueue: React.FC = () => {
  const { t } = useLocalization();
  const { moderationQueue, ads, removeAd, approveAd } = useMarketplace();

  const getAdFromQueueItem = (targetId: string) => ads.find(ad => ad.id === targetId);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('admin.moderation_queue')}</h3>
      
      {moderationQueue.length === 0 ? (
        <p className="text-gray-500">The moderation queue is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.ad_title')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.reports')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.reason')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {moderationQueue.map(item => {
                const ad = getAdFromQueueItem(item.targetId);
                if (!ad) return null;
                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{ad.title}</div>
                      <div className="text-sm text-gray-500">by {ad.seller.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reportCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => approveAd(ad.id)} className="text-green-600 hover:text-green-900 ripple rounded px-1">{t('admin.approve')}</button>
                      <button onClick={() => removeAd(ad.id, 'Removed after review.')} className="text-red-600 hover:text-red-900 ripple rounded px-1">{t('admin.remove')}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ModerationQueue;