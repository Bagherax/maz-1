import React, { useState } from 'react';
import { Ad, Bid } from '../../../../types';
import Icon from '../../../../components/Icon';
import { useLocalization } from '../../../../hooks/useLocalization';
import CountdownTimer from './CountdownTimer';
import { useAuth } from '../../../../hooks/useAuth';
import { useMarketplace } from '../../../../context/MarketplaceContext';
import { useChat } from '../../../../hooks/useChat';
import { useView } from '../../../../App';

interface AuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad: Ad;
}

const BidHistoryItem: React.FC<{ bid: Bid }> = ({ bid }) => {
    const { getUserById } = useMarketplace();
    const { language } = useLocalization();
    const bidder = getUserById(bid.bidderId);

    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <img src={bidder?.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${bidder?.name}`} alt={bidder?.name} className="w-6 h-6 rounded-full"/>
                <span className="text-sm font-medium">{bidder?.name || 'Anonymous'}</span>
            </div>
            <div className="text-right">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{new Intl.NumberFormat(language, { style: 'currency', currency: 'USD' }).format(bid.amount)}</p>
                <p className="text-xs text-gray-500">{new Date(bid.timestamp).toLocaleString()}</p>
            </div>
        </div>
    )
}

const AuctionModal: React.FC<AuctionModalProps> = ({ isOpen, onClose, ad }) => {
  const { t, language } = useLocalization();
  const { placeBid, getUserById } = useMarketplace();
  const { user: currentUser, promptLoginIfGuest } = useAuth();
  const { createOrGetAuctionGroupChat } = useChat();
  const { setView } = useView();
  const [bidAmount, setBidAmount] = useState<string>('');
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const auctionDetails = ad.auctionDetails!;

  const handlePlaceBid = () => {
    if (promptLoginIfGuest({ type: 'ad', id: ad.id })) return;
    const amount = parseFloat(bidAmount);
    if (!isNaN(amount)) {
      placeBid(ad.id, amount);
      setBidAmount('');
    }
  };

  const handleJoinAuctionChat = () => {
    if (promptLoginIfGuest({ type: 'ad', id: ad.id })) return;

    const conversationId = createOrGetAuctionGroupChat(ad.id, ad.seller.id, ad.title);
    onClose();
    setView({ type: 'chat', conversationId });
  }

  const highestBidder = auctionDetails.bids.length > 0 ? getUserById(auctionDetails.bids[0].bidderId) : null;
  const isHighestBidder = highestBidder?.id === currentUser?.id;
  const reserveMet = auctionDetails.reservePrice ? auctionDetails.currentBid >= auctionDetails.reservePrice : true;
  const isAuctionActive = new Date(auctionDetails.endTime) > new Date();
  const winner = ad.auctionDetails?.winnerId ? getUserById(ad.auctionDetails.winnerId) : null;


  if (!isOpen) return null;

  const bidIncrement = auctionDetails.bidIncrement || 1;
  const suggestedBids = [
      auctionDetails.currentBid + bidIncrement,
      auctionDetails.currentBid + bidIncrement * 2,
      auctionDetails.currentBid + bidIncrement * 5
  ];

  let statusMessage = '';
  let statusColor = '';

  if (!isAuctionActive) {
      if (winner) {
          if(winner.id === currentUser?.id) {
              statusMessage = t('auction.status.ended_won');
              statusColor = 'text-green-500';
          } else {
              statusMessage = t('auction.status.ended_winner_is', { winner: winner.name });
              statusColor = 'text-gray-500';
          }
      } else {
          statusMessage = t('auction.status.ended_no_winner');
          statusColor = 'text-red-500';
      }
  } else if (highestBidder) {
      if (isHighestBidder) {
          statusMessage = t('auction.status.winning');
          statusColor = 'text-green-500';
      } else {
          statusMessage = t('auction.status.outbid');
          statusColor = 'text-orange-500';
      }
  }


  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
      <div
        className="max-w-lg w-full mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden animate-slide-down-fast flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 truncate pr-4">{ad.title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Icon name="close" className="w-6 h-6" /></button>
        </header>

        <main className="flex-grow overflow-y-auto p-6 space-y-6">
            <CountdownTimer endDate={auctionDetails.endTime} />

            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-sm text-gray-500">{t('auction.current_bid')}</p>
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{new Intl.NumberFormat(language, { style: 'currency', currency: ad.currency }).format(auctionDetails.currentBid)}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-500">{t('auction.highest_bidder')}</p>
                    <p className="text-lg font-semibold truncate">{highestBidder?.name || 'None'}</p>
                     {statusMessage && <p className={`text-xs font-bold ${statusColor}`}>{statusMessage}</p>}
                </div>
            </div>
            
            {isAuctionActive && (
                <div className="space-y-4">
                     <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder={t('auction.your_bid')}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-lg font-bold"
                        />
                        <button onClick={handlePlaceBid} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                            {t('auction.place_bid')}
                        </button>
                    </div>
                    <div className="flex justify-around gap-2">
                        {suggestedBids.map(bid => (
                             <button key={bid} onClick={() => placeBid(ad.id, bid)} className="flex-1 py-2 border dark:border-gray-600 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                {t('auction.suggested_bid', {amount: bid.toLocaleString()})}
                             </button>
                        ))}
                    </div>
                    {auctionDetails.buyNowPrice && (
                        <button onClick={() => placeBid(ad.id, auctionDetails.buyNowPrice!)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                            {t('auction.buy_now', { price: new Intl.NumberFormat(language, { style: 'currency', currency: ad.currency }).format(auctionDetails.buyNowPrice) })}
                        </button>
                    )}
                </div>
            )}
            
            <div className="text-center text-sm font-semibold">
                {reserveMet ? 
                    <span className="text-green-600">{t('auction.reserve_met')}</span> :
                    <span className="text-red-500">{t('auction.reserve_not_met')}</span>
                }
            </div>
             {isAuctionActive && (
                <div className="mt-4">
                    <button onClick={handleJoinAuctionChat} className="w-full py-2 border-2 border-indigo-500 text-indigo-500 font-bold rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors flex items-center justify-center gap-2">
                        <Icon name="chat-bubble-left-right" className="w-5 h-5" />
                        <span>{t('chat.join_auction_chat')}</span>
                    </button>
                </div>
            )}

            <div>
                <button onClick={() => setIsHistoryVisible(!isHistoryVisible)} className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 w-full justify-center">
                    <span>{t('auction.bid_history')} ({auctionDetails.bids.length})</span>
                    <Icon name="arrow-down-circle" className={`w-5 h-5 transition-transform ${isHistoryVisible ? 'rotate-180' : ''}`} />
                </button>
                {isHistoryVisible && (
                    <div className="mt-4 space-y-2 animate-fade-in-fast max-h-60 overflow-y-auto pr-2">
                        {auctionDetails.bids.length > 0 ? (
                            [...auctionDetails.bids].map(bid => <BidHistoryItem key={bid.timestamp.toString()} bid={bid} />)
                        ) : (
                            <p className="text-center text-gray-500">No bids yet.</p>
                        )}
                    </div>
                )}
            </div>
        </main>
      </div>
    </div>
  );
};

export default AuctionModal;