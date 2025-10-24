import React, { useState, useEffect, useMemo } from 'react';
import { Ad, DisplayMode } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useMarketplace } from '../../../../context/MarketplaceContext';
import Icon from '../../../../components/Icon';
import { useAuth } from '../../../../hooks/useAuth';
import UserTierBadge from '../users/UserTierBadge';
import SeeMoreButton from '../../../../components/SeeMoreButton';
import { useView } from '../../../../App';
import AdQuickActions from './AdQuickActions';
import { useMarketplaceUI } from '../../../../context/MarketplaceUIContext';
import AdvancedMediaUploader, { MediaItem } from './AdvancedMediaUploader';


interface AdCardProps {
  ad: Ad;
  displayMode: DisplayMode;
  onExpandClick: () => void;
  isExpanded: boolean;
  isEditable?: boolean;
  isEditing?: boolean;
  onEditClick?: () => void;
  onCancel?: () => void;
  onSave?: (updatedData: { title: string; description: string; price: number; images: string[], videos: string[] }) => void;
}

const AdCard: React.FC<AdCardProps> = ({ 
    ad, 
    displayMode, 
    onExpandClick,
    isExpanded,
    isEditable = false,
    isEditing = false,
    onEditClick,
    onCancel,
    onSave
}) => {
  const { language, t } = useLocalization();
  const { toggleLike, isLiked, getUserById } = useMarketplace();
  const { promptLoginIfGuest } = useAuth();
  const { setView } = useView();
  const { isModeratorView } = useMarketplaceUI();

  const [editData, setEditData] = useState({
    title: ad.title,
    description: ad.description,
    price: ad.price,
    images: ad.images,
    videos: ad.videos || [],
  });

  useEffect(() => {
    if (!isEditing) {
        setEditData({
            title: ad.title,
            description: ad.description,
            price: ad.price,
            images: ad.images,
            videos: ad.videos || [],
        });
    }
  }, [isEditing, ad]);

  const seller = getUserById(ad.seller.id);

  // --- Smart Routing Simulation ---
  const isSellerOnline = React.useMemo(() => Math.random() > 0.3, [ad.id]);
  const mediaSource = (isSellerOnline || !seller?.cloudSync?.isEnabled || seller.cloudSync.provider === 'none') 
    ? 'P2P' 
    : seller.cloudSync.provider === 'google-drive' ? 'Cloud' : 'Cloud';

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (promptLoginIfGuest({ type: 'marketplace' })) return;
    toggleLike(ad.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick?.();
  };
  
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave?.(editData);
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCancel?.();
  }
  
  const isCompact = displayMode === 'compact';
  const isDetailed = displayMode === 'detailed';

  const imageSizeClass = isCompact ? 'h-32' : isDetailed ? 'h-64' : 'h-48';
  const paddingClass = isCompact ? 'p-2' : 'p-4';
  const cardMainClass = isEditing ? '' : 'cursor-pointer group';

  const inputClass = "w-full p-1 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-indigo-500 focus:outline-none";

  const hasReports = ad.reports && ad.reports.length > 0;
  const isBanned = ad.status === 'banned';
  const cardContainerClass = `
      bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl ${!isEditing ? 'hover:-translate-y-1' : ''} flex flex-col ${cardMainClass}
      ${isModeratorView && hasReports && !isBanned ? 'ring-4 ring-offset-2 ring-red-500 dark:ring-offset-gray-900' : ''}
      ${isModeratorView && isBanned ? 'ring-4 ring-offset-2 ring-yellow-500 dark:ring-offset-gray-900' : ''}
      ${isExpanded ? 'ring-2 ring-indigo-500 shadow-lg' : ''}
    `;
    
  const mediaItemsForUploader = useMemo(() => [
    ...editData.images.map(url => ({ type: 'image' as const, url })),
    ...editData.videos.map(url => ({ type: 'video' as const, url }))
  ], [editData.images, editData.videos]);

  const handleMediaItemsChangeForEdit = (newMediaItems: MediaItem[]) => {
      const images = newMediaItems.filter(item => item.type === 'image').map(item => item.url);
      const videos = newMediaItems.filter(item => item.type === 'video').map(item => item.url);
      setEditData(p => ({ ...p, images, videos }));
  };

  if (isEditing) {
      return (
        <div className={cardContainerClass}>
            <div className={`${paddingClass} flex-grow flex flex-col space-y-4`}>
                <input 
                    name="title"
                    value={editData.title}
                    onChange={(e) => setEditData(p => ({...p, title: e.target.value}))}
                    className={`${inputClass} font-semibold text-lg`}
                />
                <textarea 
                    name="description"
                    value={editData.description}
                    onChange={(e) => setEditData(p => ({...p, description: e.target.value}))}
                    className={`${inputClass} text-sm h-24`}
                />
                <div className="flex items-center gap-1">
                    <span className="text-indigo-500 dark:text-indigo-400 font-bold text-xl">{ad.currency}</span>
                    <input 
                        type="number"
                        name="price"
                        value={editData.price}
                        onChange={(e) => setEditData(p => ({...p, price: Number(e.target.value)}))}
                        className={`${inputClass} font-bold text-xl w-28`}
                    />
                </div>
                
                <AdvancedMediaUploader 
                    mediaItems={mediaItemsForUploader}
                    onMediaChange={handleMediaItemsChangeForEdit}
                    maxFiles={24}
                />

                <div className="flex justify-end items-center gap-2 mt-4">
                    <button onClick={handleCancel} title={t('general.cancel_edit')} className="p-2 border rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ripple">
                        <Icon name="close" className="w-5 h-5" />
                    </button>
                    <button onClick={handleSave} title={t('admin.save_changes')} className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 ripple">
                        <Icon name="check-badge" className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      )
  }

  return (
    <div 
      className={cardContainerClass}
      onClick={isEditing ? undefined : onExpandClick}
    >
      <div className="relative">
        <img src={ad.images[0]} alt={ad.title} className={`${imageSizeClass} w-full object-cover`} />
        
        {ad.isAuction ? (
             <div className="absolute top-2 left-2 rtl:left-auto rtl:right-2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
                <Icon name="gavel" className="w-3 h-3" />
                <span>{t('auction.title')}</span>
            </div>
        ) : (
            <div className="absolute top-2 left-2 rtl:left-auto rtl:right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center space-x-1 rtl:space-x-reverse">
                <Icon name={mediaSource === 'P2P' ? 'share-network' : 'cloud-arrow-up'} className="w-3 h-3" />
                <span>{mediaSource}</span>
            </div>
        )}
        
        {isModeratorView && hasReports && (
            <div className="absolute top-2 right-12 rtl:right-auto rtl:left-12 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg z-10">
                <Icon name="shield-exclamation" className="w-3 h-3" />
                <span>{ad.reports.length}</span>
            </div>
        )}

        {!isEditing && (
            <button 
            onClick={handleLike}
            aria-label={t('aria.like_ad')}
            className="absolute top-2 right-2 rtl:right-auto rtl:left-2 bg-white/70 dark:bg-gray-900/70 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
            <Icon name="heart" className={`w-5 h-5 transition-colors ${isLiked(ad.id) ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-300'}`} />
            </button>
        )}
        
        {isEditable && !isEditing && (
             <button 
                onClick={handleEditClick}
                aria-label={t('aria.edit_ad')}
                className="absolute top-12 right-2 rtl:right-auto rtl:left-2 bg-white/70 dark:bg-gray-900/70 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-20"
             >
                <Icon name="pencil" className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
        )}

        {!isEditing && <SeeMoreButton onClick={onExpandClick} />}

        {!isCompact && seller && (
            <div className="absolute bottom-2 left-2 rtl:left-auto rtl:right-2">
                <UserTierBadge tier={seller.tier} />
            </div>
        )}
      </div>
      <div className={`${paddingClass} flex-grow flex flex-col`}>
        {!isCompact && !isEditing && <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">{ad.category}</p>}
        
        <h3 className={`font-semibold truncate text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-1 ${isCompact ? 'text-sm' : 'text-lg'}`}>{ad.title}</h3>
        
        {!isCompact && (
            <div className="flex-grow mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                {ad.location.city}, {ad.location.country}
                </p>
                {isDetailed && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{ad.description}</p>
                )}
            </div>
        )}

        <div className={`flex justify-between items-center ${isCompact ? 'mt-1' : 'mt-4'}`}>
          {ad.isAuction && ad.auctionDetails ? (
                <div className={`font-bold ${isCompact ? 'text-base' : 'text-xl'}`}>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 block -mb-1">{t('auction.current_bid')}</span>
                    <span className="text-indigo-500 dark:text-indigo-400">
                        {new Intl.NumberFormat(language, { style: 'currency', currency: ad.currency, notation: 'compact' }).format(ad.auctionDetails.currentBid)}
                    </span>
                </div>
            ) : (
                <p className={`text-indigo-500 dark:text-indigo-400 font-bold ${isCompact ? 'text-base' : 'text-xl'}`}>
                    {new Intl.NumberFormat(language, { style: 'currency', currency: ad.currency, notation: isCompact ? 'compact' : 'standard' }).format(ad.price)}
                </p>
            )
          }
          {!isCompact && seller && !isEditing && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse hover:opacity-80" onClick={(e) => { e.stopPropagation(); setView({type: 'profile', id: seller.id })}}>
             <img className="h-8 w-8 rounded-full" src={seller.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${seller.name}`} alt={seller.name} />
             {!isDetailed && (
                <div className="text-right rtl:text-left min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{seller.name}</p>
                    <p className="text-xs text-gray-500 flex items-center justify-end rtl:justify-start">{seller.rating.toFixed(1)} <Icon name="heart" className="w-3 h-3 ms-0.5 fill-current text-amber-500" /></p>
                </div>
             )}
          </div>
          )}
        </div>
      </div>
      {!isEditing && <AdQuickActions ad={ad} />}
    </div>
  );
};

export default AdCard;