import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLocalization } from '../../hooks/useLocalization';
import { Ad } from '../../types';

const AdManagement: React.FC = () => {
  const { ads, removeAd } = useMarketplace();
  const { t } = useLocalization();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdIds, setSelectedAdIds] = useState<Set<string>>(new Set());

  const handleRemove = (adId: string, title: string) => {
    const reason = prompt(t('admin.remove_ad_prompt', { title }));
    if (reason !== null) {
      removeAd(adId, reason || t('moderation.no_reason_provided'));
    }
  };

  const filteredAds = useMemo(() => ads.filter(ad =>
    ad.title.toLowerCase().includes(searchTerm.toLowerCase())
  ), [ads, searchTerm]);
  
  const handleSelectAd = (adId: string) => {
      setSelectedAdIds(prev => {
          const newSet = new Set(prev);
          newSet.has(adId) ? newSet.delete(adId) : newSet.add(adId);
          return newSet;
      });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          setSelectedAdIds(new Set(filteredAds.map(ad => ad.id)));
      } else {
          setSelectedAdIds(new Set());
      }
  };

  const handleBulkRemove = () => {
      const reason = prompt(t('admin.bulk_remove_ad_prompt'));
      if (reason !== null) {
          selectedAdIds.forEach(adId => removeAd(adId, reason || t('moderation.bulk_action_reason')));
          setSelectedAdIds(new Set());
      }
  };

  const isAllSelected = selectedAdIds.size > 0 && selectedAdIds.size === filteredAds.length;

  return (
    <div className="space-y-4">
      <div className="sm:flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('admin.ad_management')}</h3>
         {selectedAdIds.size > 0 && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2 sm:mt-0">
                <span className="text-sm">{selectedAdIds.size} selected</span>
                <button onClick={handleBulkRemove} className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 ripple">{t('admin.remove_selected')}</button>
            </div>
        )}
      </div>
      <input
        type="text"
        placeholder={t('admin.search_ads')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="p-4">
                  <input type="checkbox" className="rounded" checked={isAllSelected} onChange={handleSelectAll} />
              </th>
              <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.ad_title')}</th>
              <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.seller')}</th>
              <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.status')}</th>
              <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAds.map((ad: Ad) => (
              <tr key={ad.id} className={selectedAdIds.has(ad.id) ? 'bg-indigo-50 dark:bg-gray-900' : ''}>
                 <td className="p-4">
                    <input type="checkbox" className="rounded" checked={selectedAdIds.has(ad.id)} onChange={() => handleSelectAd(ad.id)} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{ad.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm text-gray-500">{ad.seller.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ad.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                     {t(`status.${ad.status}`)}
                   </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                   {ad.status !== 'banned' && (
                    <button onClick={() => handleRemove(ad.id, ad.title)} className="text-red-600 hover:text-red-900 ripple rounded px-1">{t('moderation.remove_ad')}</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdManagement;