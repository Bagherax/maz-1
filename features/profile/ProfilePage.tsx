import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocalization } from '../../hooks/useLocalization';
import { useMarketplace } from '../../context/MarketplaceContext';
import Icon from '../../components/Icon';
import ReputationStat from './components/ReputationStat';
import UserModerationPanel from '../admin/UserModerationPanel';
import UserTierBadge from '../marketplace/components/users/UserTierBadge';
import AdCard from '../marketplace/components/ads/AdCard';
import { useView } from '../../App';
import AvatarUpdateModal from './components/AvatarUpdateModal';

interface ProfilePageProps {
  userId: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
  const { user: currentUser } = useAuth();
  const { getAdsBySellerId, updateAd, getUserById } = useMarketplace();
  const { t, language } = useLocalization();
  const { setView } = useView();

  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const viewedUser = getUserById(userId);
  const ads = getAdsBySellerId(userId);

  if (!viewedUser) {
    return <div className="text-center p-8">{t('profile.user_not_found')}</div>;
  }

  const isBanned = viewedUser.status === 'banned';
  const isOwnProfile = currentUser?.id === viewedUser.id;

  const handleModerationUpdate = () => {
    // State updates are now handled automatically by the context after an action.
    // This function can be used for any additional UI logic if needed.
    console.log("Moderation action performed. UI reflects new state from context.");
  };

  const handleSaveAd = (adId: string, updatedData: { title: string; description: string; price: number }) => {
    updateAd(adId, updatedData);
    setEditingAdId(null);
  };

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-800">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          {/* Avatar */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <div className="relative group">
              <img
                className="h-32 w-32 rounded-full ring-4 ring-white dark:ring-gray-900 object-cover"
                src={viewedUser.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${viewedUser.name}`}
                alt={viewedUser.name}
              />
              {isOwnProfile && (
                  <button 
                      onClick={() => setIsAvatarModalOpen(true)}
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      aria-label="Change profile picture"
                  >
                      <Icon name="pencil" className="w-8 h-8 text-white" />
                  </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center space-x-2 rtl:space-x-reverse break-all">
              <span>{viewedUser.name}</span>
              {viewedUser.isVerified && <span title={t('profile.verified')}><Icon name="check-badge" className="w-7 h-7 text-blue-500" /></span>}
            </h1>
            <div className="mt-2">
              <UserTierBadge tier={viewedUser.tier} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {t('profile.member_since')} {new Date(viewedUser.createdAt).toLocaleDateString(language, { year: 'numeric', month: 'long' })}
            </p>
          </div>
          
          {isBanned && (
              <div className="bg-red-100 border-s-4 border-red-500 text-red-700 p-4 rounded-md my-6 max-w-2xl mx-auto" role="alert">
                  <p className="font-bold">{t('moderation.banned_user_banner')}</p>
                  {viewedUser.banReason && <p>{viewedUser.banReason}</p>}
              </div>
          )}

          {currentUser?.isAdmin && currentUser.id !== viewedUser.id && (
              <UserModerationPanel userToModerate={viewedUser} onUpdate={handleModerationUpdate} />
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Bio & Info */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">{t('profile.bio')}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm break-all">{viewedUser.bio}</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">{t('profile.reputation')}</h3>
                <div className="space-y-3">
                  <ReputationStat 
                      value={viewedUser.rating.toFixed(1)} 
                      label={t('profile.overall_rating')} 
                      icon={<Icon name="heart" className="w-4 h-4 inline-block text-amber-500 fill-current" />}
                  />
                  <ReputationStat value={viewedUser.reviewCount.toString()} label={t('profile.reviews')} />
                  <ReputationStat value={ads.length.toString()} label={t('profile.active_ads')} />
                </div>
              </div>
              {isOwnProfile && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Icon name="cog" className="w-6 h-6" />
                    <span>{t('profile.settings')}</span>
                  </h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setView({ type: 'cloud-sync'})}
                      className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                    >
                      <Icon name="cloud-arrow-up" className="w-5 h-5" />
                      <span>{t('profile.cloud_sync_title')}</span>
                    </button>
                    <button 
                      onClick={() => setView({ type: 'language-settings' })}
                      className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors"
                    >
                      <Icon name="globe-alt" className="w-5 h-5" />
                      <span>{t('profile.language_region')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: User's Ads */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">{t('profile.my_ads')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ads.length > 0 ? ads.map(ad => (
                  <AdCard 
                      key={ad.id} 
                      ad={ad} 
                      displayMode="standard" 
                      onExpandClick={() => setView({ type: 'ad', id: ad.id })}
                      isEditable={isOwnProfile}
                      isEditing={editingAdId === ad.id}
                      onEditClick={() => setEditingAdId(ad.id)}
                      onCancel={() => setEditingAdId(null)}
                      onSave={(updatedData) => handleSaveAd(ad.id, updatedData)}
                  />
                )) : (
                  <p className="text-gray-500 col-span-2">{t('profile.no_active_ads')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOwnProfile && (
        <AvatarUpdateModal 
            isOpen={isAvatarModalOpen}
            onClose={() => setIsAvatarModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProfilePage;