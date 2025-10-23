import React from 'react';
import { User } from '../../../../types';
import Icon from '../../../../components/Icon';
import { useLocalization } from '../../../../hooks/useLocalization';

interface SellerInfoCardProps {
  seller: User;
}

const SellerInfoCard: React.FC<SellerInfoCardProps> = ({ seller }) => {
  const { t } = useLocalization();
  return (
    <div 
      className="w-full max-w-[240px] mx-auto bg-gray-200 dark:bg-[#191919] rounded-3xl p-3 shadow-lg dark:shadow-[5px_5px_30px_rgb(4,4,4),-5px_-5px_30px_rgb(57,57,57)] transition-all duration-300"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-2">
          <img className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100 dark:ring-gray-800" src={seller.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${seller.name}`} alt={seller.name} />
        </div>
        <h2 className="text-md font-bold text-gray-800 dark:text-white">{seller.name}</h2>
        
        {/* Bio Section */}
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 h-8 overflow-hidden text-ellipsis line-clamp-2">
          {seller.bio}
        </p>

        <button 
            onClick={() => alert(t('social_commerce.userShops') + ' feature coming soon!')}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full text-sm hover:bg-indigo-700 transition-colors ripple"
        >
            <Icon name="storefront" className="w-4 h-4" />
            <span>{t('profile.visit_shop')}</span>
        </button>

        <div className="mt-3 w-full p-2 bg-gray-100 dark:bg-[#191919] rounded-full flex justify-around items-center shadow-inner dark:shadow-[3px_3px_15px_rgb(0,0,0),-3px_-3px_15px_rgb(58,58,58)]">
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"><Icon name="github" className="w-4 h-4" /></a>
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"><Icon name="instagram" className="w-4 h-4" /></a>
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Icon name="facebook" className="w-4 h-4" /></a>
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"><Icon name="twitter" className="w-4 h-4" /></a>
        </div>

      </div>
    </div>
  );
};

export default SellerInfoCard;