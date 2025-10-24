import React, { useState } from 'react';
import { Ad, User } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import Icon from '../../../../components/Icon';
import AdModerationPanel from '../../../admin/AdModerationPanel';
import AdActions from './AdActions';
import { useView } from '../../../../App';
import CommentSystem from '../social/CommentSystem';
import RatingReviewSystem from '../social/RatingReviewSystem';
import T from '../../../../components/T';
import SellerInfoCard from '../users/SellerInfoCard';
import { useMarketplace } from '../../../../context/MarketplaceContext';
import { useAuth } from '../../../../hooks/useAuth';
import { useChat } from '../../../../hooks/useChat';
import MazAssistant from '../assistant/MazAssistant';
import AuctionModal from '../auction/AuctionModal';
import TrustAndSafety from './TrustAndSafety';
import CloseButton from '../../../../components/CloseButton';

interface ExpandedAdViewProps {
  ad: Ad;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | number | React.ReactNode; }> = ({ label, value }) => (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="font-medium text-gray-500 dark:text-gray-400 flex-shrink-0">{label}</span>
        <span className="font-semibold text-right rtl:text-left text-gray-800 dark:text-gray-200 break-all">{value}</span>
    </div>
);

const ExpandedAdView: React.FC<ExpandedAdViewProps> = ({ ad, onClose }) => {
  const { user: currentUser, promptLoginIfGuest } = useAuth();
  const { getUserById } = useMarketplace();
  const { startOrGetConversation } = useChat();
  const { t, language } = useLocalization();
  const { setView } = useView();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);

  const seller = ad ? getUserById(ad.seller.id) : null;
  const winner = ad?.auctionDetails?.winnerId ? getUserById(ad.auctionDetails.winnerId) : null;
  const isBanned = ad?.status === 'banned';
  const isOwnAd = currentUser?.id === ad?.seller.id;

  if (!ad || !seller) return null;

  const handleStartChat = () => {
      if (promptLoginIfGuest({ type: 'marketplace' })) return;
      const conversationId = startOrGetConversation(ad.id, ad.seller.id);
      setView({ type: 'chat', conversationId });
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 relative">
         <CloseButton onClick={onClose} className="absolute top-4 right-4 z-10 text-[6px]" />
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                 {isBanned && (
                    <div className="bg-red-100 border-s-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">{t('moderation.banned_ad_banner')}</p>
                        {ad.bannedReason && <p>{ad.bannedReason}</p>}
                    </div>
                )}
                 {ad.status === 'sold_auction' && winner && (
                    <div className="bg-green-100 border-s-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">{t('auction.ended')}</p>
                        <p>{t('ad.sold_to', { winner: winner.name })}</p>
                    </div>
                )}
                 <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">{t('ad.description')}</h3>
                    <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all"><T>{ad.description}</T></div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">{t('ad.details')}</h3>
                    <div className="space-y-1 text-sm">
                        <DetailItem label={t('ad.category')} value={ad.category} />
                        <DetailItem label={t('ad.condition')} value={<span className="capitalize">{ad.condition}</span>} />
                        <DetailItem label={t('ad.details.brand')} value={ad.specifications.brand} />
                        <DetailItem label={t('ad.details.model')} value={ad.specifications.model} />
                        {ad.specifications.color && <DetailItem label={t('ad.details.color')} value={ad.specifications.color} />}
                        {ad.specifications.size && <DetailItem label={t('ad.details.size')} value={ad.specifications.size} />}
                    </div>
                </div>

                 <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">{t('ad.delivery_info')}</h3>
                    {ad.delivery && ad.delivery.available ? (
                        <div className="space-y-1 text-sm">
                            <DetailItem label={t('ad.delivery_type')} value={<span className="capitalize">{ad.delivery.type.replace('_', ' ')}</span>} />
                            {ad.delivery.cost > 0 && <DetailItem label={t('ad.delivery_cost')} value={new Intl.NumberFormat(language, { style: 'currency', currency: ad.currency }).format(ad.delivery.cost)} />}
                            {ad.delivery.time && <DetailItem label={t('ad.delivery_time')} value={ad.delivery.time} />}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">{t('delivery.no_delivery_available')}</p>
                    )}
                </div>

                {currentUser?.isAdmin && <AdModerationPanel ad={ad} />}
            </div>
            <div className="lg:col-span-1 space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    {ad.isAuction && ad.auctionDetails ? (
                         <div className="flex flex-col items-center gap-2">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">{t('auction.current_bid')}</p>
                                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{new Intl.NumberFormat(language, { style: 'currency', currency: ad.currency }).format(ad.auctionDetails.currentBid)}</p>
                            </div>
                            <button onClick={() => setIsAuctionModalOpen(true)} className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 ripple">
                                <Icon name="gavel" className="w-5 h-5" />
                                <span>{t('auction.title')}</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{new Intl.NumberFormat(language, { style: 'currency', currency: ad.currency }).format(ad.price)}</p>
                            {!isOwnAd && !isBanned && (
                                <button onClick={handleStartChat} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center gap-2 ripple">
                                    <Icon name="chat-bubble-left-right" className="w-5 h-5" />
                                    <span>Chat</span>
                                </button>
                            )}
                        </div>
                    )}
                     {!isBanned && <AdActions ad={ad} />}
                </div>

                 <div onClick={() => setView({ type: 'profile', id: seller.id })} className="cursor-pointer">
                    <SellerInfoCard seller={seller} />
                </div>
                <TrustAndSafety />
            </div>
         </div>
          {!isBanned && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 border-t dark:border-gray-700 pt-8">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg"><RatingReviewSystem ad={ad} /></div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg"><CommentSystem ad={ad} /></div>
            </div>
        )}

        <div className="absolute bottom-6 right-6 z-10">
            <button className="chatBtn" onClick={() => setIsAssistantOpen(true)}>
                <Icon name="chat-assistant" className="w-6 h-6 text-white" />
                <span className="tooltip">MAZ Assistant</span>
            </button>
        </div>
      </div>
       {isAssistantOpen && <MazAssistant ad={ad} onClose={() => setIsAssistantOpen(false)} />}
      {isAuctionModalOpen && ad.isAuction && (
        <AuctionModal isOpen={isAuctionModalOpen} onClose={() => setIsAuctionModalOpen(false)} ad={ad} />
      )}
    </>
  );
};

export default ExpandedAdView;