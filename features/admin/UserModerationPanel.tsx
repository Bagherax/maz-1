import React, { useState } from 'react';
import { User, UserTier } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';
import Icon from '../../components/Icon';
import { useMarketplace } from '../../context/MarketplaceContext';

interface UserModerationPanelProps {
  userToModerate: User;
  onUpdate: () => void;
}

const UserModerationPanel: React.FC<UserModerationPanelProps> = ({ userToModerate, onUpdate }) => {
  const [banReason, setBanReason] = useState('');
  const [selectedTier, setSelectedTier] = useState<UserTier['level']>(userToModerate.tier);
  // User management functions are now correctly sourced from useMarketplace.
  const { banUser, updateUserTier } = useMarketplace();
  const { t } = useLocalization();

  const handleBanUser = async () => {
    if (window.confirm(t('moderation.ban_user_confirm', { name: userToModerate.name }))) {
      await banUser(userToModerate.id, banReason || t('moderation.no_reason_provided'));
      setBanReason('');
      onUpdate();
    }
  };
  
  const handleTierChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newTier = e.target.value as UserTier['level'];
      setSelectedTier(newTier);
      await updateUserTier(userToModerate.id, newTier);
      onUpdate();
  }

  const tierLevels: UserTier['level'][] = ['normal', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'su_diamond', 'MAZ'];

  return (
    <div className="border-2 border-red-500 rounded-lg p-4 my-6 bg-red-50 dark:bg-gray-800">
      <h3 className="text-lg font-bold text-red-700 dark:text-red-400 flex items-center">
        <Icon name="shield-exclamation" className="w-6 h-6 me-2" />
        {t('moderation.user_panel_title')}
      </h3>
      <div className="mt-4 space-y-4">
        {userToModerate.status !== 'banned' && (
            <div>
                <h4 className="font-semibold mb-2">{t('moderation.ban_user')}</h4>
                <textarea
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder={t('moderation.reason_placeholder')}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-red-500 focus:border-red-500"
                />
                <button
                    onClick={handleBanUser}
                    className="w-full mt-2 bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                    {t('moderation.ban_user')}
                </button>
            </div>
        )}
         <div>
            <label htmlFor="tier-select" className="font-semibold mb-2 block">{t('moderation.change_tier')}</label>
            <select 
                id="tier-select"
                value={selectedTier}
                onChange={handleTierChange}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
            >
                {tierLevels.map(tier => (
                    <option key={tier} value={tier} className="capitalize">{tier}</option>
                ))}
            </select>
         </div>
      </div>
    </div>
  );
};

export default UserModerationPanel;