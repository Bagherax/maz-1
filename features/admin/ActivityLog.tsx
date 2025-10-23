import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useMarketplace } from '../../context/MarketplaceContext';

const ActivityLog: React.FC = () => {
  const { t } = useLocalization();
  // In a real app, this data would come from a server via WebSocket or polling.
  // Here, we'll generate some mock static data for demonstration.
  const { ads, getUserById } = useMarketplace();
  
  const mockActivities = [
    ...ads.slice(0, 3).map(ad => ({
      event: t('admin.log.ad_posted'),
      details: `"${ad.title}" by ${ad.seller.name}`,
      timestamp: ad.stats.createdAt,
    })),
    ...ads.slice(3, 5).map(ad => ({
        event: t('admin.log.user_login'),
        details: `User ${ad.seller.name} logged in.`,
        timestamp: new Date(new Date(ad.stats.createdAt).getTime() - 3600000).toISOString(),
    })),
     {
      event: t('admin.log.user_registered'),
      details: `New user: ${getUserById('seller-7')?.name}`,
      timestamp: getUserById('seller-7')?.createdAt,
    }
  ].sort((a,b) => new Date(b.timestamp as string).getTime() - new Date(a.timestamp as string).getTime());

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('admin.activity_log')}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.log_event')}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.log_details')}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.log_timestamp')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {mockActivities.map((activity, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{activity.event}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.details}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(activity.timestamp as string).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLog;