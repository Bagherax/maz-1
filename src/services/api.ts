/**
 * Mock API Service
 * This file simulates a backend API for the frontend application.
 * It uses localStorage as a persistent database for this simulation.
 * When a real backend is ready, this is the only file that needs to be changed.
 */
import { Ad, User, LoginMethod, Category, UserTier, AdminConfig, CloudSyncConfig, Comment, Review } from '../types';
import { MOCK_ADS, MOCK_SELLERS } from '../data/mockAds';

// --- CONSTANTS ---
const JWT_TOKEN_KEY = 'authToken';
const USERS_DB_KEY = 'mazdady_users_db';
const ADS_DB_KEY = 'mazdady_ads_db_v2';
const CATEGORIES_DB_KEY = 'mazdady_categories_db';
const TIERS_DB_KEY = 'mazdady_tiers_db';
const ADMIN_CONFIG_DB_KEY = 'mazdady_admin_config_db';

const NETWORK_DELAY = 500; // ms

// --- TYPES ---
type StoredUser = User & { password?: string };

// FIX: Define a default CloudSyncConfig to ensure type safety on user creation.
const defaultCloudSync: CloudSyncConfig = { 
    isEnabled: false, 
    provider: 'none', 
    syncOnWifiOnly: true, 
    mediaCompression: 'medium' 
};

// --- DATABASE SIMULATION ---

const db = {
  users: {
    get: (): StoredUser[] => JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]'),
    set: (data: StoredUser[]) => localStorage.setItem(USERS_DB_KEY, JSON.stringify(data)),
  },
  ads: {
    get: (): Ad[] => JSON.parse(localStorage.getItem(ADS_DB_KEY) || '[]'),
    set: (data: Ad[]) => localStorage.setItem(ADS_DB_KEY, JSON.stringify(data)),
  },
  categories: {
    get: (): Category[] => JSON.parse(localStorage.getItem(CATEGORIES_DB_KEY) || '[]'),
    set: (data: Category[]) => localStorage.setItem(CATEGORIES_DB_KEY, JSON.stringify(data)),
  },
  userTiers: {
    get: (): UserTier[] => JSON.parse(localStorage.getItem(TIERS_DB_KEY) || '[]'),
    set: (data: UserTier[]) => localStorage.setItem(TIERS_DB_KEY, JSON.stringify(data)),
  },
  adminConfig: {
    get: (): AdminConfig => JSON.parse(localStorage.getItem(ADMIN_CONFIG_DB_KEY) || '{}'),
    set: (data: AdminConfig) => localStorage.setItem(ADMIN_CONFIG_DB_KEY, JSON.stringify(data)),
  },
};

// --- INITIALIZATION ---
// One-time initialization of the mock database if it's empty
(() => {
    if (db.users.get().length === 0) {
        const adminCredential = 'AbedLatifMAZDADYBagherax@78885444450843';
        const demoAdmin: StoredUser = {
            id: '1', name: 'Admin', email: adminCredential, password: adminCredential,
            tier: 'MAZ', isAdmin: true, status: 'active',
            createdAt: new Date(), bio: "Marketplace administrator.", isVerified: true, rating: 5, reviewCount: 999,
            twoFactorEnabled: false, ipAddress: '127.0.0.1',
            cloudSync: defaultCloudSync
        };
        const initialUsers = MOCK_SELLERS.map(u => ({...u, password: 'password123'}));
        db.users.set([...initialUsers, demoAdmin]);
    }
    if (db.ads.get().length === 0) {
        db.ads.set(MOCK_ADS);
    }
    if (db.categories.get().length === 0) {
        db.categories.set([
            { id: 'electronics', name: 'Electronics' }, { id: 'fashion', name: 'Fashion' }, { id: 'home-garden', name: 'Home & Garden' },
            { id: 'vehicles', name: 'Vehicles' }, { id: 'real-estate', name: 'Real Estate' }, { id: 'services', name: 'Services' },
        ]);
    }
    if (db.userTiers.get().length === 0) {
        db.userTiers.set([
            { level: 'normal', benefits: { maxAds: 5, imageSlots: 3, videoUpload: false, featuredAds: 0, adDuration: 30, analytics: false, customThemes: false, prioritySupport: false, revenueShare: 0 }, requirements: { minTransactions: 0, minRating: 0, minActivity: 0 } },
            { level: 'bronze', benefits: { maxAds: 15, imageSlots: 5, videoUpload: false, featuredAds: 1, adDuration: 45, analytics: true, customThemes: false, prioritySupport: false, revenueShare: 0 }, requirements: { minTransactions: 10, minRating: 4.0, minActivity: 10 } },
            { level: 'silver', benefits: { maxAds: 30, imageSlots: 8, videoUpload: true, featuredAds: 3, adDuration: 60, analytics: true, customThemes: false, prioritySupport: false, revenueShare: 0 }, requirements: { minTransactions: 25, minRating: 4.2, minActivity: 25 } },
            { level: 'gold', benefits: { maxAds: 50, imageSlots: 12, videoUpload: true, featuredAds: 5, adDuration: 90, analytics: true, customThemes: true, prioritySupport: true, revenueShare: 0 }, requirements: { minTransactions: 50, minRating: 4.5, minActivity: 50 } },
            { level: 'platinum', benefits: { maxAds: 100, imageSlots: 15, videoUpload: true, featuredAds: 10, adDuration: 120, analytics: true, customThemes: true, prioritySupport: true, revenueShare: 2.5 }, requirements: { minTransactions: 100, minRating: 4.7, minActivity: 100 } },
            { level: 'diamond', benefits: { maxAds: 200, imageSlots: 20, videoUpload: true, featuredAds: 20, adDuration: 180, analytics: true, customThemes: true, prioritySupport: true, revenueShare: 5 }, requirements: { minTransactions: 250, minRating: 4.8, minActivity: 250 } },
            { level: 'su_diamond', benefits: { maxAds: 500, imageSlots: 25, videoUpload: true, featuredAds: 50, adDuration: 365, analytics: true, customThemes: true, prioritySupport: true, revenueShare: 10 }, requirements: { minTransactions: 500, minRating: 4.9, minActivity: 500 } },
            { level: 'MAZ', benefits: { maxAds: 9999, imageSlots: 50, videoUpload: true, featuredAds: 100, adDuration: 9999, analytics: true, customThemes: true, prioritySupport: true, revenueShare: 20 }, requirements: { minTransactions: 1000, minRating: 4.95, minActivity: 1000 } },
        ]);
    }
     if (Object.keys(db.adminConfig.get()).length === 0) {
        db.adminConfig.set({
            siteMaintenance: false, registrationOpen: true,
            commissionRates: { normal: 10, bronze: 9, silver: 8, gold: 7, platinum: 6, diamond: 5, su_diamond: 3, MAZ: 0 },
            contentModeration: 'hybrid', paymentMethods: ['credit_card', 'paypal'],
        });
    }
})();

// --- MOCK API FETCHER ---
const apiFetch = <T>(logic: () => T): Promise<T> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const result = logic();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }, NETWORK_DELAY);
    });
};


// --- AUTH HELPERS ---
const createToken = (user: User) => {
  const payload = { ...user, iat: Date.now(), exp: Date.now() + 3600000 };
  const token = btoa(JSON.stringify(payload));
  localStorage.setItem(JWT_TOKEN_KEY, token);
  return token;
};
const parseToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) return null;
    return payload as User;
  } catch { return null; }
};
export const isTokenValid = (token: string) => !!parseToken(token);
export const getToken = () => localStorage.getItem(JWT_TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(JWT_TOKEN_KEY);
const stripPassword = (user: StoredUser): User => {
    const { password, ...rest } = user;
    return rest;
};

// --- AUTH API ---
export const login = (email: string, password: string) => apiFetch(() => {
    const user = db.users.get().find(u => u.email === email && u.password === password);
    if (!user) throw new Error('auth.error_invalid_credentials');
    if (user.status === 'banned') throw new Error('auth.error_account_suspended');
    
    if (user.twoFactorEnabled) return { requires2FA: true };

    createToken(stripPassword(user));
    return { user: stripPassword(user), requires2FA: false };
});

export const verify2fa = (email: string, code: string) => apiFetch(() => {
    const user = db.users.get().find(u => u.email === email);
    if (!user || code !== user.twoFactorSecret) throw new Error('auth.error_invalid_code');
    
    createToken(stripPassword(user));
    return { user: stripPassword(user) };
});


export const register = (data: { name: string, email: string, password: string }) => apiFetch(() => {
    const users = db.users.get();
    if (users.some(u => u.email === data.email)) throw new Error('auth.error_user_exists');

    const newUser: StoredUser = {
        id: Date.now().toString(),
        ...data,
        tier: 'normal',
        createdAt: new Date(),
        bio: 'New member!',
        isVerified: false,
        rating: 0,
        reviewCount: 0,
        status: 'active',
        cloudSync: defaultCloudSync,
    };
    db.users.set([...users, newUser]);
    createToken(stripPassword(newUser));
    return { user: stripPassword(newUser) };
});

export const loginWithProvider = (provider: LoginMethod) => apiFetch(() => {
    const mockEmail = `${provider}@example.com`;
    let users = db.users.get();
    let user = users.find(u => u.email === mockEmail);
    if (!user) {
        // FIX: Added explicit type annotation `: StoredUser` to prevent widening of literal types (e.g., `tier`, `status`).
        const newUser: StoredUser = {
            id: `oauth-${Date.now()}`, name: `${provider} User`, email: mockEmail,
            tier: 'normal', createdAt: new Date(), bio: 'Joined via social!', isVerified: true,
            rating: 0, reviewCount: 0, status: 'active', password: 'mock_password',
            cloudSync: defaultCloudSync
        };
        user = newUser;
        db.users.set([...users, user]);
    }
    createToken(stripPassword(user));
    return { user: stripPassword(user) };
});

export const loginWithPhone = (phone: string) => apiFetch(() => {
    // FIX: Added explicit type annotation `: StoredUser` to prevent widening of literal types.
    const newUser: StoredUser = {
        id: `phone-${Date.now()}`, name: `User ${phone.slice(-4)}`, email: `${phone}@example.com`,
        tier: 'normal', createdAt: new Date(), bio: 'Joined with phone.', isVerified: true,
        rating: 0, reviewCount: 0, status: 'active', password: 'mock_password',
        cloudSync: defaultCloudSync
    };
    db.users.set([...db.users.get(), newUser]);
    createToken(stripPassword(newUser));
    return { user: stripPassword(newUser) };
});

export const logout = () => apiFetch(() => removeToken());

export const getMe = () => apiFetch(() => {
    const token = getToken();
    if (!token) throw new Error("No token");
    const userPayload = parseToken(token);
    if (!userPayload) throw new Error("Invalid token");
    const users = db.users.get();
    const currentUser = users.find(u => u.id === userPayload.id);
    if (!currentUser) throw new Error("User not found");
    return stripPassword(currentUser);
});


// --- USER API ---
export const getUsers = () => apiFetch(() => db.users.get().map(stripPassword));
export const getUserById = (userId: string) => db.users.get().map(stripPassword).find(u => u.id === userId);
// FIX: Correctly merge partial cloudSync config instead of overwriting the whole object. This resolves the error in AuthContext.
export const updateUser = (userId: string, data: Partial<User>) => apiFetch(() => {
    const users = db.users.get();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");
    
    const currentUser = users[userIndex];
    
    const updatedCloudSync = data.cloudSync 
      ? { ...currentUser.cloudSync, ...data.cloudSync } 
      : currentUser.cloudSync;
      
    users[userIndex] = { 
        ...currentUser, 
        ...data,
        cloudSync: updatedCloudSync
    };
    
    db.users.set(users);
    return stripPassword(users[userIndex]);
});
export const banUser = (userId: string, reason: string) => updateUser(userId, { status: 'banned', banReason: reason });
export const unbanUser = (userId: string) => updateUser(userId, { status: 'active', banReason: '' });

// --- ADS API ---
export const getAds = () => apiFetch(() => db.ads.get());
export const createAd = (adData: any, currentUser: User) => apiFetch(() => {
    const newAd: Ad = {
        id: `ad-${Date.now()}`, seller: currentUser, rating: 0, reviews: [], comments: [], reports: [],
        status: 'active', stats: { likes: 0, shares: 0, views: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ...adData,
    };
    const ads = db.ads.get();
    db.ads.set([newAd, ...ads]);
    return newAd;
});

export const updateAd = (adId: string, updatedData: Partial<Ad>) => apiFetch(() => {
    const ads = db.ads.get();
    const adIndex = ads.findIndex(ad => ad.id === adId);
    if (adIndex === -1) throw new Error("Ad not found");
    ads[adIndex] = { ...ads[adIndex], ...updatedData, stats: { ...ads[adIndex].stats, updatedAt: new Date().toISOString() } };
    db.ads.set(ads);
    return ads[adIndex];
});

export const toggleLikeAd = (adId: string, shouldLike: boolean) => apiFetch(() => {
    const ads = db.ads.get();
    const ad = ads.find(ad => ad.id === adId);
    if (!ad) throw new Error("Ad not found");
    ad.stats.likes += shouldLike ? 1 : -1;
    db.ads.set(ads);
    return ad;
});

export const addComment = (adId: string, text: string, currentUser: User) => apiFetch(() => {
    const ads = db.ads.get();
    const ad = ads.find(ad => ad.id === adId);
    if (!ad) throw new Error("Ad not found");
    const newComment: Comment = { id: `comment-${Date.now()}`, author: currentUser, text, likes: 0, replies: [], createdAt: new Date(), isEdited: false };
    ad.comments.unshift(newComment);
    db.ads.set(ads);
    return ad;
});

export const addReview = (adId: string, rating: number, text: string, currentUser: User) => apiFetch(() => {
    const ads = db.ads.get();
    const users = db.users.get();
    
    const ad = ads.find(ad => ad.id === adId);
    if (!ad) throw new Error("Ad not found");
    
    const newReview: Review = { id: `review-${Date.now()}`, author: currentUser, text, rating: rating / 2.0, likes: 0, replies: [], createdAt: new Date(), isEdited: false };
    ad.reviews.unshift(newReview);
    ad.rating = ad.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / ad.reviews.length;
    
    db.ads.set(ads);

    const seller = users.find(u => u.id === ad.seller.id);
    if (!seller) throw new Error("Seller not found");
    
    const allSellerAds = ads.filter(a => a.seller.id === seller.id);
    const allSellerReviews = allSellerAds.flatMap(a => a.reviews);
    seller.rating = allSellerReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / allSellerReviews.length;
    seller.reviewCount = allSellerReviews.length;
    
    db.users.set(users);

    return { updatedAd: ad, updatedSeller: stripPassword(seller) };
});

export const addReplyToComment = (adId: string, parentCommentId: string, text: string, currentUser: User) => apiFetch(() => {
    const ads = db.ads.get();
    const ad = ads.find(ad => ad.id === adId);
    if (!ad) throw new Error("Ad not found");

    const findAndAddReply = (comments: Comment[]): boolean => {
        for (let comment of comments) {
            if (comment.id === parentCommentId) {
                const newReply: Comment = { id: `reply-${Date.now()}`, author: currentUser, text, likes: 0, replies: [], createdAt: new Date(), isEdited: false };
                comment.replies.unshift(newReply);
                return true;
            }
            if (comment.replies && findAndAddReply(comment.replies)) {
                return true;
            }
        }
        return false;
    };

    findAndAddReply(ad.comments);
    db.ads.set(ads);
    return ad;
});

export const deleteComment = (adId: string, commentId: string) => apiFetch(() => {
    const ads = db.ads.get();
    const ad = ads.find(ad => ad.id === adId);
    if (!ad) throw new Error("Ad not found");
    
    const findAndRemove = (comments: Comment[]): Comment[] => {
      return comments.filter(c => c.id !== commentId).map(c => ({...c, replies: findAndRemove(c.replies)}))
    }
    ad.comments = findAndRemove(ad.comments);
    db.ads.set(ads);
    return ad;
});

// --- CONFIG API ---
export const getCategories = () => apiFetch(() => db.categories.get());
export const addCategory = (category: Category) => apiFetch(() => {
    const categories = db.categories.get();
    db.categories.set([...categories, category]);
    return category;
});
export const removeCategory = (categoryId: string) => apiFetch(() => {
    const categories = db.categories.get().filter(c => c.id !== categoryId);
    db.categories.set(categories);
    return { success: true };
});

export const getUserTiers = () => apiFetch(() => db.userTiers.get());
export const updateUserTiers = (tiers: UserTier[]) => apiFetch(() => {
    db.userTiers.set(tiers);
    return tiers;
});

export const getAdminConfig = () => apiFetch(() => db.adminConfig.get());
export const updateAdminConfig = (config: Partial<AdminConfig>) => apiFetch(() => {
    const newConfig = { ...db.adminConfig.get(), ...config };
    db.adminConfig.set(newConfig);
    return newConfig;
});