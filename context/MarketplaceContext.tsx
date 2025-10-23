import React, { createContext, ReactNode, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { MarketplaceContextType, Ad, User, Comment, MarketplaceState, Category, UserTier, Report, ModerationItem, Review, AdminConfig, Bid } from '../types';
import { useAuth } from '../hooks/useAuth';
import { MOCK_ADS, MOCK_SELLERS } from '../data/mockAds';
import { useLocalStorage } from '../hooks/usePersistentState';
import { usePersistentSet } from '../hooks/usePersistentSetState';
import { useLocalization } from '../hooks/useLocalization';
import { useNotification } from '../hooks/useNotification';

export const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

// --- MOCK DATA GENERATION ---

// TODO: Move storage helpers to a shared utils file to avoid duplication with AuthContext
const USERS_DB_KEY = 'mazdady_users_db';
type StoredUser = User & { password?: string };
const getUsersFromStorage = (): StoredUser[] => {
  const dbString = localStorage.getItem(USERS_DB_KEY);
  return dbString ? JSON.parse(dbString) : [];
};
const saveUsersToStorage = (users: StoredUser[]) => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

const USER_TIERS: UserTier[] = [
    { level: 'normal', benefits: { maxAds: 5, imageSlots: 3, videoUpload: false, featuredAds: 0, adDuration: 30, analytics: false, customThemes: false, prioritySupport: false, revenueShare: 0 }, requirements: { minTransactions: 0, minRating: 0, minActivity: 0 } },
    { level: 'bronze', benefits: { maxAds: 15, imageSlots: 5, videoUpload: false, featuredAds: 1, adDuration: 45, analytics: true, customThemes: false, prioritySupport: false, revenueShare: 0 }, requirements: { minTransactions: 10, minRating: 4.0, minActivity: 10 } },
    { level: 'silver', benefits: { maxAds: 30, imageSlots: 8, videoUpload: true, featuredAds: 3, adDuration: 60, analytics: true, customThemes: false, prioritySupport: false, revenueShare: 0 }, requirements: { minTransactions: 25, minRating: 4.2, minActivity: 25 } },
    { level: 'gold', benefits: { maxAds: 50, imageSlots: 12, videoUpload: true, featuredAds: 5, adDuration: 90, analytics: true, customThemes: true, prioritySupport: true, revenueShare: 0 }, requirements: { minTransactions: 50, minRating: 4.5, minActivity: 50 } },
    { level: 'platinum', benefits: { maxAds: 100, imageSlots: 15, videoUpload: true, featuredAds: 10, adDuration: 120, analytics: true, customThemes: true, prioritySupport: true, revenueShare: 2.5 }, requirements: { minTransactions: 100, minRating: 4.7, minActivity: 100 } },
    { level: 'diamond', benefits: { maxAds: 200, imageSlots: 20, videoUpload: true, featuredAds: 20, adDuration: 180, analytics: true, customThemes: true, prioritySupport: true, revenueShare: 5 }, requirements: { minTransactions: 250, minRating: 4.8, minActivity: 250 } },
    { level: 'su_diamond', benefits: { maxAds: 500, imageSlots: 25, videoUpload: true, featuredAds: 50, adDuration: 365, analytics: true, customThemes: true, prioritySupport: true, revenueShare: 10 }, requirements: { minTransactions: 500, minRating: 4.9, minActivity: 500 } },
    { level: 'MAZ', benefits: { maxAds: 9999, imageSlots: 50, videoUpload: true, featuredAds: 100, adDuration: 9999, analytics: true, customThemes: true, prioritySupport: true, revenueShare: 20 }, requirements: { minTransactions: 1000, minRating: 4.95, minActivity: 1000 } },
];

const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  siteMaintenance: false,
  registrationOpen: true,
  commissionRates: {
    normal: 10, bronze: 9, silver: 8, gold: 7, platinum: 6, diamond: 5, su_diamond: 3, MAZ: 0,
  },
  contentModeration: 'hybrid',
  paymentMethods: ['credit_card', 'paypal'],
};

const CATEGORIES: Category[] = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'home-garden', name: 'Home & Garden' },
    { id: 'vehicles', name: 'Vehicles' },
    { id: 'real-estate', name: 'Real Estate' },
    { id: 'services', name: 'Services' },
];

const generateMockState = (): Omit<MarketplaceState, 'adminConfig'> => {
    const users = MOCK_SELLERS as User[];
    const ads = MOCK_ADS as Ad[];
    return {
        ads,
        users,
        categories: CATEGORIES,
        userTiers: USER_TIERS,
        reports: [], // Reports are attached to ads for now
    };
};

const updateUserTierIfNeeded = (user: User, tiers: UserTier[]): User => {
    const currentTierIndex = tiers.findIndex(t => t.level === user.tier);
    if (currentTierIndex === -1) return user;

    const currentTier = tiers[currentTierIndex];
    // For now, progression is based only on rating as per the user request context.
    // In a real app, you would also check user.transactions, user.activity, etc.
    const userStats = { rating: user.rating }; 

    // Check for promotion
    const nextTier = tiers[currentTierIndex + 1];
    if (nextTier && userStats.rating >= nextTier.requirements.minRating) {
        console.log(`User ${user.name} promoted to ${nextTier.level} for reaching rating ${userStats.rating.toFixed(2)}`);
        return { ...user, tier: nextTier.level };
    }

    // Check for demotion (don't demote from the lowest tier)
    if (currentTierIndex > 0) {
        if (userStats.rating < currentTier.requirements.minRating) {
             // Find the correct tier to demote to by going downwards
            for (let i = currentTierIndex - 1; i >= 0; i--) {
                if (userStats.rating >= tiers[i].requirements.minRating) {
                    console.log(`User ${user.name} demoted to ${tiers[i].level} for rating dropping to ${userStats.rating.toFixed(2)}`);
                    return { ...user, tier: tiers[i].level };
                }
            }
            // If they don't meet any requirements, demote to the lowest tier
            console.log(`User ${user.name} demoted to ${tiers[0].level} for rating dropping to ${userStats.rating.toFixed(2)}`);
            return { ...user, tier: tiers[0].level };
        }
    }

    return user; // No change
}


export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user: currentUser, logout } = useAuth();
    const { t } = useLocalization();
    const { addNotification } = useNotification();
    
    const [state, setAndPersistState] = useState<Omit<MarketplaceState, 'adminConfig'>>(
        generateMockState
    );
    
    const [adminConfig, setAdminConfig] = useLocalStorage<AdminConfig>('adminConfig', DEFAULT_ADMIN_CONFIG);
    const [likedAds, setLikedAds] = usePersistentSet<string>('likedAds');
    const [favoritedAds, setFavoritedAds] = usePersistentSet<string>('favoritedAds');
    
    const refreshUsers = useCallback(() => {
        const usersDb = getUsersFromStorage();
        // We need to remove passwords before setting state
        const sanitizedUsers = usersDb.map(({ password, ...rest }) => rest as User);
        setAndPersistState(prevState => ({...prevState, users: sanitizedUsers}));
    }, [setAndPersistState]);

    useEffect(() => {
        refreshUsers();
    }, [refreshUsers]);

    const moderationQueue = useMemo((): ModerationItem[] => {
        return state.ads
            .filter(ad => ad.reports && ad.reports.length > 0 && ad.status === 'active')
            .map(ad => ({
                id: `mod-ad-${ad.id}`,
                type: 'ad',
                targetId: ad.id,
                reason: ad.reports.map(r => r.reason).join(', '),
                reportCount: ad.reports.length,
            }));
    }, [state.ads]);

    const getAdById = useCallback((id: string) => state.ads.find(ad => ad.id === id), [state.ads]);
    const getAdsBySellerId = useCallback((sellerId: string) => state.ads.filter(ad => ad.seller.id === sellerId), [state.ads]);
    
    const addCategory = (category: Category) => {
        setAndPersistState(prevState => {
            if (prevState.categories.some(c => c.id === category.id || c.name.toLowerCase() === category.name.toLowerCase())) {
                alert(t('controls.category_exists_alert'));
                return prevState;
            }
            return {
                ...prevState,
                categories: [...prevState.categories, category]
            };
        });
    };
    
    const removeCategory = (categoryId: string) => {
        setAndPersistState(prevState => ({
            ...prevState,
            categories: prevState.categories.filter(c => c.id !== categoryId)
        }));
    };

    const createAd = async (adData: any): Promise<string> => {
        if (!currentUser) throw new Error("User not authenticated");
        
        const newAd: Ad = {
            id: `ad-${Date.now()}`, 
            seller: currentUser, 
            rating: 0, 
            reviews: [], 
            comments: [], 
            reports: [], 
            status: 'active',
            stats: { likes: 0, shares: 0, views: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            ...adData,
            specifications: adData.specifications || {}, delivery: adData.delivery || {},
            availability: adData.availability || { quantity: adData.quantity || 1, inStock: true },
        };
        setAndPersistState(prevState => ({ ...prevState, ads: [newAd, ...prevState.ads] }));
        return newAd.id;
    };

    const updateAd = (adId: string, updatedData: Partial<Ad>) => {
        setAndPersistState(prevState => ({
            ...prevState,
            ads: prevState.ads.map(ad => 
                ad.id === adId 
                ? { ...ad, ...updatedData, stats: { ...ad.stats, updatedAt: new Date().toISOString() } } 
                : ad
            ),
        }));
    };

    const toggleLike = (adId: string) => {
        const isCurrentlyLiked = likedAds.has(adId);
        setAndPersistState(prevState => ({
            ...prevState,
            ads: prevState.ads.map(ad => {
                if (ad.id === adId) {
                    const newLikes = isCurrentlyLiked ? ad.stats.likes - 1 : ad.stats.likes + 1;
                    return { ...ad, stats: { ...ad.stats, likes: newLikes } };
                }
                return ad;
            }),
        }));
        setLikedAds(prevLiked => {
            const newLikedSet = new Set(prevLiked);
            isCurrentlyLiked ? newLikedSet.delete(adId) : newLikedSet.add(adId);
            return newLikedSet;
        });
    };
    
    const isLiked = (adId: string) => likedAds.has(adId);
    const toggleFavorite = (adId: string) => { setFavoritedAds(prev => { const newSet = new Set(prev); newSet.has(adId) ? newSet.delete(adId) : newSet.add(adId); return newSet; }); };
    const isFavorite = (adId: string) => favoritedAds.has(adId);

    const addComment = (adId: string, text: string) => {
        if (!currentUser) return;
        const newComment: Comment = { id: `comment-${Date.now()}`, author: currentUser, text, likes: 0, replies: [], createdAt: new Date(), isEdited: false };
        setAndPersistState(prevState => ({ ...prevState, ads: prevState.ads.map(ad => ad.id === adId ? { ...ad, comments: [newComment, ...ad.comments] } : ad) }));
    };
    
    const addReview = (adId: string, rating: number, text: string) => {
        if (!currentUser) return;
        const normalizedRating = rating / 2.0;
        const newReview: Review = { id: `review-${Date.now()}`, author: currentUser, text, rating: normalizedRating, likes: 0, replies: [], createdAt: new Date(), isEdited: false };
        
        setAndPersistState(prevState => {
            let sellerIdToUpdate: string | null = null;
    
            const updatedAds = prevState.ads.map(ad => {
                if (ad.id === adId) {
                    sellerIdToUpdate = ad.seller.id;
                    const updatedReviews = [newReview, ...ad.reviews];
                    const newTotalRating = updatedReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
                    const newAverageRating = updatedReviews.length > 0 ? newTotalRating / updatedReviews.length : 0;
                    return { ...ad, reviews: updatedReviews, rating: newAverageRating };
                }
                return ad;
            });
    
            if (!sellerIdToUpdate) {
                return { ...prevState, ads: updatedAds };
            }
    
            const allSellerAds = updatedAds.filter(ad => ad.seller.id === sellerIdToUpdate);
            const allSellerReviews = allSellerAds.flatMap(ad => ad.reviews);
            const totalRatingSum = allSellerReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
            const newSellerRating = allSellerReviews.length > 0 ? totalRatingSum / allSellerReviews.length : 0;
    
            const updatedUsers = prevState.users.map(user => {
                if (user.id === sellerIdToUpdate) {
                    const userWithNewRating = {
                        ...user,
                        rating: newSellerRating,
                        reviewCount: allSellerReviews.length,
                    };
                    return updateUserTierIfNeeded(userWithNewRating, prevState.userTiers);
                }
                return user;
            });
            
            return {
                ...prevState,
                ads: updatedAds,
                users: updatedUsers,
            };
        });
    };

    const addReplyToComment = (adId: string, parentCommentId: string, text: string) => {
        if (!currentUser) return;
        const newReply: Comment = { id: `reply-${Date.now()}`, author: currentUser, text, likes: 0, replies: [], createdAt: new Date(), isEdited: false };
        const findAndAddReply = (comments: Comment[]): Comment[] => comments.map(c => c.id === parentCommentId ? { ...c, replies: [newReply, ...c.replies] } : { ...c, replies: findAndAddReply(c.replies) });
        setAndPersistState(prevState => ({ ...prevState, ads: prevState.ads.map(ad => ad.id === adId ? { ...ad, comments: findAndAddReply(ad.comments) } : ad) }));
    };
    
    const shareAd = (adId: string) => { /* ... existing implementation ... */ };
    
    const placeBid = useCallback((adId: string, amount: number) => {
        if (!currentUser) return;
    
        setAndPersistState(prevState => {
            const adIndex = prevState.ads.findIndex(a => a.id === adId);
            if (adIndex === -1) return prevState;
    
            const ad = prevState.ads[adIndex];
            if (!ad.isAuction || !ad.auctionDetails) return prevState;
            
            const bidIncrement = ad.auctionDetails.bidIncrement || 1;
            const minBid = ad.auctionDetails.currentBid + bidIncrement;

            if (amount < minBid) {
                addNotification(t('auction.bid_increment_too_low', { increment: bidIncrement }), 'error');
                return prevState;
            }
    
            const newBid: Bid = {
                bidderId: currentUser!.id,
                amount,
                timestamp: new Date().toISOString(),
            };
    
            const previousHighestBidderId = ad.auctionDetails.bids[0]?.bidderId;
    
            const updatedAd = {
                ...ad,
                auctionDetails: {
                    ...ad.auctionDetails,
                    currentBid: amount,
                    bids: [newBid, ...ad.auctionDetails.bids],
                },
            };
    
            const updatedAds = [...prevState.ads];
            updatedAds[adIndex] = updatedAd;

            // --- Real-time Simulation & Notifications ---
            const isCurrentUserBidding = currentUser!.id === newBid.bidderId;
            if (isCurrentUserBidding) {
                 // Outbid notification for previous bidder
                if (previousHighestBidderId && previousHighestBidderId !== currentUser!.id) {
                    // In a real app, you'd send a push notification to this user.
                    // For this demo, if they are the current user (somehow), we can show a toast.
                    console.log(`[Simulated Notification] User ${previousHighestBidderId} has been outbid.`);
                }
                
                // Simulate a counter-bid after a delay
                const counterBidDelay = Math.random() * 10000 + 5000; // 5-15 seconds
                setTimeout(() => {
                    const mockBidders = MOCK_SELLERS.filter(s => s.id !== currentUser!.id);
                    const randomBidder = mockBidders[Math.floor(Math.random() * mockBidders.length)];
                    const counterBidAmount = amount + (ad.auctionDetails?.bidIncrement || 1) * (Math.floor(Math.random() * 3) + 1);

                    const counterBid: Bid = {
                        bidderId: randomBidder.id,
                        amount: counterBidAmount,
                        timestamp: new Date().toISOString()
                    };

                    setAndPersistState(current => {
                        const adToUpdate = current.ads.find(a => a.id === adId);
                        if(adToUpdate && new Date(adToUpdate.auctionDetails!.endTime) > new Date()) {
                            adToUpdate.auctionDetails!.currentBid = counterBidAmount;
                            adToUpdate.auctionDetails!.bids.unshift(counterBid);
                            addNotification(t('auction.outbid'), 'warning');
                            return { ...current, ads: current.ads.map(a => a.id === adId ? adToUpdate : a) };
                        }
                        return current;
                    });

                }, counterBidDelay);
            }
    
            return { ...prevState, ads: updatedAds };
        });
    }, [currentUser, setAndPersistState, addNotification, t]);

    const getUserById = useCallback((userId: string) => state.users.find(u => u.id === userId), [state.users]);

    // --- Winner Determination Logic ---
    useEffect(() => {
        const interval = setInterval(() => {
            setAndPersistState(prevState => {
                const now = new Date();
                let hasChanges = false;
                const updatedAds = prevState.ads.map(ad => {
                    if (ad.isAuction && ad.auctionDetails && ad.status === 'active' && new Date(ad.auctionDetails.endTime) <= now) {
                        hasChanges = true;
                        const finalBids = ad.auctionDetails.bids;
                        const winnerBid = finalBids[0];
                        const reserveMet = ad.auctionDetails.reservePrice ? ad.auctionDetails.currentBid >= ad.auctionDetails.reservePrice : true;

                        if (winnerBid && reserveMet) {
                            // We have a winner
                            const winner = getUserById(winnerBid.bidderId);
                            if (winner) {
                                if (winner.id === currentUser?.id) {
                                    addNotification(t('auction.winner_notification_body', { title: ad.title }), 'success');
                                }
                                // FIX: Use 'as const' to ensure TypeScript infers the literal type, not 'string'
                                return { ...ad, status: 'sold_auction' as const, auctionDetails: { ...ad.auctionDetails, winnerId: winner.id } };
                            }
                        }
                         // No winner (no bids or reserve not met)
                        if (currentUser && finalBids.some(b => b.bidderId === currentUser.id)) {
                             addNotification(t('auction.loser_notification_body', { title: ad.title }), 'info');
                        }
                        // FIX: Use 'as const' to ensure TypeScript infers the literal type, not 'string'
                        return { ...ad, status: 'expired' as const };
                    }
                    return ad;
                });

                if (hasChanges) {
                    return { ...prevState, ads: updatedAds };
                }
                return prevState;
            });
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [setAndPersistState, addNotification, t, currentUser, getUserById]);


    const removeAd = (adId: string, reason: string) => { setAndPersistState(prevState => ({ ...prevState, ads: prevState.ads.map(ad => ad.id === adId ? { ...ad, status: 'banned', bannedReason: reason } : ad) })); };
    const approveAd = (adId: string) => { setAndPersistState(prevState => ({ ...prevState, ads: prevState.ads.map(ad => ad.id === adId ? { ...ad, reports: [] } : ad) })); };
    const deleteComment = (adId: string, commentId: string) => {
       const findAndRemove = (comments: Comment[]): Comment[] => comments.filter(c => c.id !== commentId).map(c => ({...c, replies: findAndRemove(c.replies)}));
       setAndPersistState(prevState => ({ ...prevState, ads: prevState.ads.map(ad => ad.id === adId ? { ...ad, comments: findAndRemove(ad.comments) } : ad) }));
    };
    const updateUserTiers = (updatedTiers: UserTier[]) => { setAndPersistState(prevState => ({ ...prevState, userTiers: updatedTiers })); };
    const updateAdminConfig = (newConfig: Partial<AdminConfig>) => { setAdminConfig(prev => ({ ...prev, ...newConfig })); };

    const banUser = useCallback(async (userId: string, reason: string): Promise<void> => {
        let usersDb = getUsersFromStorage();
        const userIndex = usersDb.findIndex(u => u.id === userId);
        if (userIndex > -1) {
            usersDb[userIndex].status = 'banned';
            usersDb[userIndex].banReason = reason;
            saveUsersToStorage(usersDb);
            refreshUsers();
            if (currentUser?.id === userId) {
                logout('auth.error_account_suspended');
            }
        }
    }, [currentUser, logout, refreshUsers]);
    
    const unbanUser = useCallback(async (userId: string): Promise<void> => {
        let usersDb = getUsersFromStorage();
        const userIndex = usersDb.findIndex(u => u.id === userId);
        if (userIndex > -1 && usersDb[userIndex].status === 'banned') {
            usersDb[userIndex].status = 'active';
            delete usersDb[userIndex].banReason;
            saveUsersToStorage(usersDb);
            refreshUsers();
        }
    }, [refreshUsers]);

    const updateUserTier = useCallback(async (userId: string, tier: UserTier['level']): Promise<void> => {
        let usersDb = getUsersFromStorage();
        const userIndex = usersDb.findIndex(u => u.id === userId);
        if (userIndex > -1) {
            usersDb[userIndex].tier = tier;
            saveUsersToStorage(usersDb);
            refreshUsers();
        }
    }, [refreshUsers]);
    
    const value: MarketplaceContextType = {
        ...state, adminConfig, moderationQueue, getAdById, getAdsBySellerId, createAd, updateAd, addCategory, removeCategory,
        toggleLike, isLiked, toggleFavorite, isFavorite, addComment, addReview,
        addReplyToComment, shareAd, placeBid, removeAd, approveAd, deleteComment, updateUserTiers,
        updateAdminConfig,
        refreshUsers,
        getUserById,
        banUser,
        unbanUser,
        updateUserTier,
    };
    
    return (
        <MarketplaceContext.Provider value={value}>
            {children}
        </MarketplaceContext.Provider>
    );
};

export const useMarketplace = (): MarketplaceContextType => {
    const context = useContext(MarketplaceContext);
    if (!context) {
        throw new Error('useMarketplace must be used within a MarketplaceProvider');
    }
    return context;
};
