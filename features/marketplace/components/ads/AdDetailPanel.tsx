import React, { useState } from 'react';
import { Ad } from '../../../../types';
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

interface AdDetailPanelProps {
  ad?: Ad;
  isOpen: boolean;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | number | React.ReactNode; }> = ({ label, value }) => (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="font-medium text-gray-500 dark:text-gray-400 flex-shrink-0">{label}</span>
        <span className="font-semibold text-right rtl:text-left text-gray-800 dark:text-gray-200 break-all">{value}</span>
    </div>
);

const ImageGallery: React.FC<{ images: string[], adTitle: string }> = ({ images, adTitle }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { t } = useLocalization();

    const goToNext = () => setCurrentIndex(prev => (prev + 1) % images.length);
    const goToPrev = () => setCurrentIndex(prev => (prev - 1 + images.length) % images.length);

    if (!images || images.length === 0) {
        return <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">{t('ad.details.no_image')}</div>;
    }

    return (
        <div className="space-y-2">
            <div className="relative">
                <img src={images[currentIndex]} alt={`${adTitle} - image ${currentIndex + 1}`} className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md" />
                {images.length > 1 && (
                    <>
                        <button onClick={goToPrev} className="absolute top-1/2 left-2 rtl:left-auto rtl:right-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 focus:outline-none ripple">
                            <Icon name="arrow-left" className="w-5 h-5" />
                        </button>
                         <button onClick={goToNext} className="absolute top-1/2 right-2 rtl:right-auto rtl:left-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 focus:outline-none ripple">
                            <Icon name="arrow-right" className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-1">
                    {images.map((img, index) => (
                        <img 
                            key={index} 
                            src={img} 
                            alt={`thumbnail ${index + 1}`} 
                            onClick={() => setCurrentIndex(index)}
                            className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${currentIndex === index ? 'border-indigo-500' : 'border-transparent hover:border-gray-400'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


const AdDetailPanel: React.FC<AdDetailPanelProps> = ({ ad, isOpen, onClose }) => {
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

  const handleStartChat = () => {
      if (!ad) return;
      if (promptLoginIfGuest({ type: 'ad', id: ad.id })) return;

      const conversationId = startOrGetConversation(ad.id, ad.seller.id);
      onClose(); // Close the ad panel
      setView({ type: 'chat', conversationId }); // Navigate to the conversation
  }

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ad-detail-title"
        className={`
        fixed top-0 right-0 rtl:right-auto rtl:left-0 h-full w-full max-w-md sm:max-w-lg lg:w-1/3 xl:w-1/4
        transform transition-transform duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : 'rtl:-translate-x-0'}
        ${!isOpen ? 'translate-x-full rtl:-translate-x-full' : ''}
        bg-white dark:bg-gray-900 shadow-2xl z-50
        flex flex-col
      `}>
        {ad && seller && (
            <>
            <header className="p-4 flex items-center justify-between border-b dark:border-gray-700 shrink-0">
                 <h2 id="ad-detail-title" className="text-lg font-bold truncate pe-4"><T>{ad.title}</T></h2>
                <button onClick={onClose} aria-label={t('controls.close')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 z-10 ripple">
                    <Icon name="close" className="w-6 h-6" />
                </button>
            </header>
            
            <div className="flex-grow overflow-y-auto relative">
                <div className="p-4 sm:p-6 space-y-6">
                    {isBanned && (
                        <div className="bg-red-100 border-s-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
                        <p className="font-bold">{t('moderation.banned_ad_banner')}</p>
                        {ad.bannedReason && <p>{ad.bannedReason}</p>}
                        </div>
                    )}
                     {ad.status === 'sold_auction' && winner && (
                        <div className="bg-green-100 border-s-4 border-green-500 text-green-700 p-4 rounded-md mb-6" role="alert">
                            <p className="font-bold">{t('auction.ended')}</p>
                            <p>{t('ad.sold_to', { winner: winner.name })}</p>
                        </div>
                    )}
                    
                    <ImageGallery images={ad.images} adTitle={ad.title} />

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        {ad.isAuction && ad.auctionDetails ? (
                             <div className="flex flex-col items-center gap-2">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">{t('auction.current_bid')}</p>
                                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                        {new Intl.NumberFormat(language, { style: 'currency', currency: ad.currency }).format(ad.auctionDetails.currentBid)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsAuctionModalOpen(true)}
                                    className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 ripple"
                                >
                                    <Icon name="gavel" className="w-5 h-5" />
                                    <span>{t('auction.title')}</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                    {new Intl.NumberFormat(language, { style: 'currency', currency: ad.currency }).format(ad.price)}
                                </p>
                                {!isOwnAd && !isBanned && (
                                    <button
                                        onClick={handleStartChat}
                                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center gap-2 ripple"
                                    >
                                        <Icon name="chat-bubble-left-right" className="w-5 h-5" />
                                        <span>Chat</span>
                                    </button>
                                )}
                            </div>
                        )}
                        {!isBanned && <AdActions ad={ad} />}
                    </div>

                    <div onClick={() => { onClose(); setView({ type: 'profile', id: seller.id }); }} className="cursor-pointer">
                        <SellerInfoCard seller={seller} />
                    </div>

                    <TrustAndSafety />
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">{t('ad.description')}</h3>
                      <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all"><T>{ad.description}</T></div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
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

                    {currentUser?.isAdmin && <AdModerationPanel ad={ad} />}

                    {!isBanned && (
                        <>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"><RatingReviewSystem ad={ad} /></div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"><CommentSystem ad={ad} /></div>
                        </>
                    )}
                </div>
            </div>
             {/* MAZ Assistant Button */}
             <div className="absolute bottom-6 right-6 z-10">
                  <button className="chatBtn" onClick={() => setIsAssistantOpen(true)}>
                    <Icon name="chat-assistant" className="w-6 h-6 text-white" />
                    <span className="tooltip">MAZ Assistant</span>
                  </button>
              </div>
            </>
        )}
      </div>
      {isAssistantOpen && ad && <MazAssistant ad={ad} onClose={() => setIsAssistantOpen(false)} />}
      {isAuctionModalOpen && ad?.isAuction && (
        <AuctionModal isOpen={isAuctionModalOpen} onClose={() => setIsAuctionModalOpen(false)} ad={ad} />
      )}
    </>
  );
};

export default AdDetailPanel;