

import React from 'react';
import { Ad } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import UserTierBadge from '../users/UserTierBadge';
import Icon from '../../../../components/Icon';
import SeeMoreButton from '../../../../components/SeeMoreButton';

interface ListViewItemProps {
  ad: Ad;
  onExpandClick: () => void;
}

const ListViewItem: React.FC<ListViewItemProps> = ({ ad, onExpandClick }) => {
  const { t, language } = useLocalization();

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer group transform transition-shadow duration-300 hover:shadow-xl flex flex-col"
    >
        <div className="flex" onClick={onExpandClick}>
            <img src={ad.images[0]} alt={ad.title} className="h-full w-32 md:w-48 object-cover flex-shrink-0" />
            <div className="p-4 flex-grow flex flex-col justify-between relative min-w-0">
                <div>
                    <div className="flex justify-between items-start">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">{ad.category}</p>
                        <UserTierBadge tier={ad.seller.tier} />
                    </div>
                    <h3 className="font-semibold text-lg truncate text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-1">{ad.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {ad.location.city}, {ad.location.country}
                    </p>
                </div>

                <div className="flex justify-between items-end mt-4">
                <p className="text-indigo-500 dark:text-indigo-400 font-bold text-xl">
                    {new Intl.NumberFormat(language, { style: 'currency', currency: ad.currency }).format(ad.price)}
                </p>
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                        <Icon name="heart" className="w-4 h-4 text-red-500" />
                        <span>{ad.stats.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Icon name="eye" className="w-4 h-4" />
                        <span>{ad.stats.views}</span>
                    </div>
                </div>
                </div>
                 <SeeMoreButton onClick={onExpandClick} />
            </div>
        </div>
    </div>
  );
};

export default ListViewItem;