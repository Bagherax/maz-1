import React, { createContext, ReactNode, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { MarketplaceContextType, Ad, User, Comment, Category, UserTier, Report, ModerationItem, Review, AdminConfig } from '../types';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import { usePersistentSet } from '../hooks/usePersistentSetState';
import { useLocalization } from '../hooks/useLocalization';
import LoadingSpinner from '../components/LoadingSpinner';

export const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

interface MarketplaceState {
  ads: Ad[];
  users: User[];
  categories: Category[];
  userTiers: UserTier[];
  adminConfig: AdminConfig;
  reports: Report[]; // Currently unused, but kept for future.
}

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user: currentUser, logout } = useAuth();
    const { t } = useLocalization();
    
    const [state, setState] = useState<MarketplaceState | null>(null);
    const [loading, setLoading] = useState(true);

    const [likedAds, setLikedAds] = usePersistentSet<string>('likedAds');
    const [favoritedAds, setFavoritedAds] = usePersistentSet<string>('favoritedAds');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                const [ads, users, categories, userTiers, adminConfig] = await Promise.all([
                    api.getAds(),
                    api.getUsers(),
                    api.getCategories(),
                    api.getUserTiers(),
                    api.getAdminConfig(),
                ]);
                setState({ ads, users, categories, userTiers, adminConfig, reports: [] });
            } catch (error) {
                console.error("Failed to load marketplace data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);
    
    const moderationQueue = useMemo((): ModerationItem[] => {
        if (!state) return [];
        return state.ads
            .filter(ad => ad.reports && ad.reports.length > 0 && ad.status === 'active')
            .map(ad => ({
                id: `mod-ad-${ad.id}`,
                type: 'ad',
                targetId: ad.id,
                reason: ad.reports.map(r => r.reason).join(', '),
                reportCount: ad.reports.length,
            }));
    }, [state]);

    const getAdById = useCallback((id: string) => state?.ads.find(ad => ad.id === id), [state]);
    const getAdsBySellerId = useCallback((sellerId: string) => state?.ads.filter(ad => ad.seller.id === sellerId) || [], [state]);
    const getUserById = useCallback((userId: string) => state?.users.find(u => u.id === userId), [state]);
    
    const addCategory = async (category: Category) => {
        if (state?.categories.some(c => c.id === category.id || c.name.toLowerCase() === category.name.toLowerCase())) {
             alert(t('controls.category_exists_alert'));
             return;
        }
        const newCategory = await api.addCategory(category);
        setState(prev => prev ? { ...prev, categories: [...prev.categories, newCategory] } : null);
    };
    
    const removeCategory = async (categoryId: string) => {
        await api.removeCategory(categoryId);
        setState(prev => prev ? { ...prev, categories: prev.categories.filter(c => c.id !== categoryId) } : null);
    };

    const createAd = async (adData: any): Promise<string> => {
        if (!currentUser) throw new Error("User not authenticated");
        const newAd = await api.createAd(adData, currentUser);
        setState(prev => prev ? { ...prev, ads: [newAd, ...prev.ads] } : null);
        return newAd.id;
    };

    const updateAd = async (adId: string, updatedData: Partial<Ad>) => {
        const updatedAd = await api.updateAd(adId, updatedData);
        setState(prev => prev ? {
            ...prev,
            ads: prev.ads.map(ad => ad.id === adId ? updatedAd : ad),
        } : null);
    };

    const toggleLike = async (adId: string) => {
        const isCurrentlyLiked = likedAds.has(adId);
        const updatedAd = await api.toggleLikeAd(adId, !isCurrentlyLiked);
        setState(prev => prev ? {
            ...prev,
            ads: prev.ads.map(ad => ad.id === adId ? updatedAd : ad),
        } : null);
        setLikedAds(prevLiked => {
            const newLikedSet = new Set(prevLiked);
            isCurrentlyLiked ? newLikedSet.delete(adId) : newLikedSet.add(adId);
            return newLikedSet;
        });
    };
    
    const isLiked = (adId: string) => likedAds.has(adId);
    const toggleFavorite = (adId: string) => { setFavoritedAds(prev => { const newSet = new Set(prev); newSet.has(adId) ? newSet.delete(adId) : newSet.add(adId); return newSet; }); };
    const isFavorite = (adId: string) => favoritedAds.has(adId);

    const addComment = async (adId: string, text: string) => {
        if (!currentUser) return;
        const updatedAd = await api.addComment(adId, text, currentUser);
        setState(prev => prev ? { ...prev, ads: prev.ads.map(ad => ad.id === adId ? updatedAd : ad) } : null);
    };
    
    const addReview = async (adId: string, rating: number, text: string) => {
        if (!currentUser) return;
        const { updatedAd, updatedSeller } = await api.addReview(adId, rating, text, currentUser);
        setState(prev => prev ? {
             ...prev,
             ads: prev.ads.map(ad => ad.id === adId ? updatedAd : ad),
             users: prev.users.map(u => u.id === updatedSeller.id ? updatedSeller : u),
        } : null);
    };

    const addReplyToComment = async (adId: string, parentCommentId: string, text: string) => {
        if (!currentUser) return;
        const updatedAd = await api.addReplyToComment(adId, parentCommentId, text, currentUser);
        setState(prev => prev ? { ...prev, ads: prev.ads.map(ad => ad.id === adId ? updatedAd : ad) } : null);
    };
    
    const shareAd = (adId: string) => { console.log(`Sharing ad ${adId}`) };
    
    const removeAd = async (adId: string, reason: string) => { 
        const updatedAd = await api.updateAd(adId, { status: 'banned', bannedReason: reason });
        setState(prev => prev ? { ...prev, ads: prev.ads.map(ad => ad.id === adId ? updatedAd : ad) } : null);
     };
    const approveAd = async (adId: string) => {
        const updatedAd = await api.updateAd(adId, { reports: [] });
        setState(prev => prev ? { ...prev, ads: prev.ads.map(ad => ad.id === adId ? updatedAd : ad) } : null);
    };
    const deleteComment = async (adId: string, commentId: string) => {
       const updatedAd = await api.deleteComment(adId, commentId);
       setState(prev => prev ? { ...prev, ads: prev.ads.map(ad => ad.id === adId ? updatedAd : ad) } : null);
    };
    const updateUserTiers = async (updatedTiers: UserTier[]) => { 
        await api.updateUserTiers(updatedTiers);
        setState(prev => prev ? { ...prev, userTiers: updatedTiers } : null);
     };
    const updateAdminConfig = async (newConfig: Partial<AdminConfig>) => { 
        const updatedConfig = await api.updateAdminConfig(newConfig);
        setState(prev => prev ? { ...prev, adminConfig: updatedConfig } : null);
     };

    const banUser = useCallback(async (userId: string, reason: string): Promise<void> => {
        await api.banUser(userId, reason);
        setState(prev => {
            if (!prev) return null;
            // FIX: Use 'as const' to prevent type widening from 'banned' to 'string'.
            const newUsers = prev.users.map(u => u.id === userId ? { ...u, status: 'banned' as const, banReason: reason } : u);
            return { ...prev, users: newUsers };
        });
        if (currentUser?.id === userId) {
            logout('auth.error_account_suspended');
        }
      }, [currentUser, logout]);
      
      const unbanUser = useCallback(async (userId: string): Promise<void> => {
        await api.unbanUser(userId);
        setState(prev => {
            if (!prev) return null;
            // FIX: Use 'as const' to prevent type widening from 'active' to 'string'.
            const newUsers = prev.users.map(u => u.id === userId ? { ...u, status: 'active' as const, banReason: '' } : u);
            return { ...prev, users: newUsers };
        });
      }, []);
    
      const updateUserTier = useCallback(async (userId: string, tier: UserTier['level']): Promise<void> => {
        await api.updateUser(userId, { tier });
        setState(prev => {
            if (!prev) return null;
            const newUsers = prev.users.map(u => u.id === userId ? { ...u, tier } : u);
            return { ...prev, users: newUsers };
        });
      }, []);
    
    if (loading || !state) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <LoadingSpinner />
            </div>
        );
    }
    
    // FIX: Add missing admin functions to the context value.
    const value: MarketplaceContextType = {
        ...state,
        loading,
        moderationQueue, getAdById, getAdsBySellerId, getUserById, createAd, updateAd, addCategory, removeCategory,
        toggleLike, isLiked, toggleFavorite, isFavorite, addComment, addReview,
        addReplyToComment, shareAd, removeAd, approveAd, deleteComment, updateUserTiers,
        updateAdminConfig,
        banUser, unbanUser, updateUserTier
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