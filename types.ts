import { ReactNode, Dispatch, SetStateAction } from 'react';

export type Theme = 'light' | 'dark';
export type Language = string;
export type SupportedLanguage = Language;

export type DisplayMode = 'compact' | 'standard' | 'detailed' | 'list';

export type SortOption =
  | 'price-low-high'
  | 'price-high-low'
  | 'date-new-old'
  | 'date-old-new'
  | 'rating-high-low'
  | 'rating-low-high'
  | 'verified-first'
  | 'most-viewed'
  | 'most-liked'
  | 'nearby-first';


export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

export interface Feature {
  id: string;
  icon: ReactNode;
  status: 'complete' | 'in_progress';
}

// --- User & Auth System ---
export type LoginMethod = 'email' | 'phone' | 'google' | 'facebook' | 'twitter' | 'apple' | 'github';
export type AuthElement = 'rememberMe' | 'forgotPassword' | 'socialDivider' | 'termsCheckbox' | 'countrySelector';
export type AuthView = 'login' | 'register' | 'phone-verify' | 'oauth-redirect' | '2fa-verify' | 'forgot-password';

export interface CloudSyncConfig {
  isEnabled: boolean;
  provider: 'google-drive' | 'dropbox' | 'none';
  syncOnWifiOnly: boolean;
  mediaCompression: 'none' | 'medium' | 'high';
  lastSync?: string;
}

export interface UserTier {
  level: 'normal' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'su_diamond' | 'MAZ';
  benefits: {
    maxAds: number;
    imageSlots: number;
    videoUpload: boolean;
    featuredAds: number;
    adDuration: number;
    analytics: boolean;
    customThemes: boolean;
    prioritySupport: boolean;
    revenueShare: number;
  };
  requirements: {
    minTransactions: number;
    minRating: number;
    minActivity: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  timezone?: string;
  currency?: string;
  tier: UserTier['level'];
  createdAt: Date | string; // Allow string for mock data
  bio: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  joinDate?: string; // For mock data
  responseRate?: number; // For mock data
  cloudSync: CloudSyncConfig;
  // Admin fields
  isAdmin?: boolean;
  status: 'active' | 'banned';
  banReason?: string;
  ipAddress?: string;
  // Security fields
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string; // In a real app, this would be handled securely on the backend
  // Chat features
  blockedUsers?: string[];
  isOnline?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isAwaiting2FA: boolean;
  postLoginAction: View | null;
  login: (email: string, password: string) => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; bio?: string; avatar?: string }) => Promise<void>;
  logout: (reason?: string) => void;
  loading: boolean;
  error: string | null;
  loginWithProvider: (provider: LoginMethod) => Promise<void>;
  loginAsGuest: () => void;
  promptLoginIfGuest: (nextAction?: View) => boolean;
  clearPostLoginAction: () => void;
  loginWithPhone: (phone: string) => Promise<void>;
  updateCloudSyncConfig: (userId: string, config: Partial<CloudSyncConfig>) => Promise<void>;
  refreshCurrentUser: () => void;
  // Elegant prompt state and handlers
  isLoginPromptOpen: boolean;
  confirmLoginPrompt: () => void;
  cancelLoginPrompt: () => void;
  // Chat moderation
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  isUserBlocked: (userId: string) => boolean;
  updateUserAvatar: (userId: string, avatar: string) => Promise<void>;
}


// --- Dynamic Auth Configuration ---

export interface ColorPalette {
  primary: string;
  background: string;
  text: string;
  button: string;
  buttonText: string;
  border: string;
}

export interface LayoutConfig {
  position: 'center' | 'left' | 'right';
  gridCols: number;
}

export interface LanguageConfig {
  defaultLanguage: Language;
  enabledLanguages: Language[];
}

export interface AuthConfig {
  enabledMethods: LoginMethod[];
  visibleElements: AuthElement[];
  colorScheme: ColorPalette;
  layout: LayoutConfig;
  customCSS: string;
  languageSettings: LanguageConfig;
}

export interface AuthConfigContextType {
  authConfig: AuthConfig;
  setAuthConfig: Dispatch<SetStateAction<AuthConfig>>;
}

export type FormErrors = { [key: string]: string | null };


// --- Marketplace & Ad System ---

export interface Address {
  city: string;
  country: string;
  street?: string;
  state?: string;
  zipCode?: string;
  coordinates?: { lat: number; lng: number };
}

export type DeliveryOption = 'pickup' | 'home_delivery';

export interface Comment {
  id: string;
  author: User;
  text: string;
  images?: string[];
  rating?: number;
  likes: number;
  replies: Comment[];
  createdAt: Date;
  isEdited: boolean;
}

// Review can be a specific type of comment
export type Review = Comment;

export interface Report {
  id: string;
  reporter: User;
  reason: string;
  createdAt: Date;
}

export interface Bid {
  bidderId: string;
  amount: number;
  timestamp: string | Date;
}

export interface AuctionDetails {
  startTime: string | Date;
  endTime: string | Date;
  startingBid: number;
  currentBid: number;
  bids: Bid[];
  reservePrice?: number;
  buyNowPrice?: number;
  bidIncrement?: number;
  winnerId?: string;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  images: string[];
  videos?: string[];
  price: number;
  currency: string;
  category: string;
  condition: 'new' | 'used' | 'refurbished';
  seller: User;
  location: Address;
  specifications: {
    brand: string;
    model: string;
    size?: string;
    color?: string;
    material?: string;
    warranty: boolean;
  };
  stats: {
    views: number;
    likes: number;
    shares: number;
    createdAt: string;
    updatedAt: string;
  };
  delivery: {
    available: boolean;
    cost: number;
    time: string;
    type: 'pickup' | 'delivery' | 'both';
    instructions?: string;
  };
  availability: {
    quantity: number;
    inStock: boolean;
  };
  rating: number;
  reviews: Review[];
  comments: Comment[];
  reports: Report[];
  status: 'active' | 'sold' | 'expired' | 'banned' | 'sold_auction';
  bannedReason?: string;
  // Auction fields
  isAuction?: boolean;
  auctionDetails?: AuctionDetails;
}

export interface Filters {
    query: string;
    categories: string[];
    condition: 'all' | 'new' | 'used' | 'refurbished';
    priceRange: [number, number];
    sellerTiers: UserTier['level'][];
}

export interface Category {
  id: string;
  name: string;
  parentId?: string | null;
}

export interface ModerationItem {
  id: string; // Composite ID for the moderation item
  type: 'ad' | 'user' | 'comment';
  targetId: string; // ID of the ad, user, or comment
  reason: string;
  reportCount: number;
}

export interface AdminConfig {
  siteMaintenance: boolean;
  registrationOpen: boolean;
  commissionRates: Record<UserTier['level'], number>;
  contentModeration: 'auto' | 'manual' | 'hybrid';
  paymentMethods: string[];
}

export type View = 
  | { type: 'marketplace' } 
  | { type: 'create' } 
  | { type: 'profile'; id: string } 
  | { type: 'cloud-sync' } 
  | { type: 'language-settings' }
  | { type: 'chat'; conversationId?: string }
  // FIX: Add 'ad' view type to allow navigating to a specific ad detail view.
  | { type: 'ad'; id: string };

export interface AppContextType {
    view: View;
    setView: Dispatch<SetStateAction<View>>;
}

// FIX: Define MarketplaceState to be used by the context type.
export interface MarketplaceState {
  ads: Ad[];
  users: User[];
  categories: Category[];
  userTiers: UserTier[];
  reports: Report[];
  adminConfig: AdminConfig;
}

export interface MarketplaceContextType extends MarketplaceState {
  moderationQueue: ModerationItem[];
  getAdById: (id: string) => Ad | undefined;
  getAdsBySellerId: (sellerId: string) => Ad[];
  createAd: (adData: Omit<Ad, 'id' | 'seller' | 'rating' | 'reviews' | 'comments' | 'reports' | 'status' | 'bannedReason' | 'stats'>) => Promise<string>;
  updateAd: (adId: string, updatedData: Partial<Ad>) => void;
  addCategory: (category: Category) => void;
  removeCategory: (categoryId: string) => void;
  // Social Interactions
  toggleLike: (adId: string) => void;
  isLiked: (adId: string) => boolean;
  toggleFavorite: (adId: string) => void;
  isFavorite: (adId: string) => boolean;
  addComment: (adId: string, text: string) => void;
  addReview: (adId: string, rating: number, text: string) => void;
  addReplyToComment: (adId: string, parentCommentId: string, text: string) => void;
  shareAd: (adId: string) => void;
  // Auction
  placeBid: (adId: string, amount: number) => void;
  // Admin & User Management
  getUserById: (userId: string) => User | undefined;
  banUser: (userId: string, reason: string) => Promise<void>;
  unbanUser: (userId: string) => Promise<void>;
  updateUserTier: (userId: string, tier: UserTier['level']) => Promise<void>;
  removeAd: (adId: string, reason: string) => void;
  approveAd: (adId: string) => void;
  deleteComment: (adId: string, commentId: string) => void;
  updateUserTiers: (updatedTiers: UserTier[]) => void;
  updateAdminConfig: (newConfig: Partial<AdminConfig>) => void;
  refreshUsers: () => void;
}

// --- P2P Chat System ---
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type MessageType = 'text' | 'image' | 'file' | 'voice' | 'video_call';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string; // For text, this is the message. For media, this is a data URL.
  type: MessageType;
  timestamp: number;
  status: MessageStatus;
  metadata?: {
    fileName?: string;
    fileSize?: number; // in bytes
    duration?: number; // in seconds for audio/video
  };
  reactions?: { [emoji: string]: string[] }; // user IDs
}

export interface Conversation {
  id: string;
  participants: string[]; // Array of user IDs
  adId: string;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  type: 'private' | 'group';
  name?: string; // For group chats
}

export interface ChatContextType {
  conversations: Conversation[];
  getConversationById: (id: string) => Conversation | undefined;
  getConversationsForUser: (userId: string) => Conversation[];
  startOrGetConversation: (adId: string, recipientId: string) => string;
  createOrGetAuctionGroupChat: (adId: string, sellerId: string, adTitle: string) => string;
  sendMessage: (conversationId: string, content: string) => void;
  sendMediaMessage: (conversationId: string, file: File, type: 'image' | 'file' | 'voice', extraMetadata?: { duration?: number }) => Promise<void>;
  markAsRead: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  typingStatus: { [conversationId: string]: string | undefined }; // Stores name of typing user
  setTyping: (conversationId: string) => void;
  reactToMessage: (conversationId: string, messageId: string, emoji: string) => void;
}


// --- Google Translate Integration ---
export interface TranslationConfig {
  targetLanguage: Language;
  showOriginal: boolean;
}

export type TranslationCache = Record<string, Record<Language, string>>;

export interface TranslationContextType {
  config: TranslationConfig;
  setConfig: Dispatch<SetStateAction<TranslationConfig>>;
  translate: (text: string) => Promise<string>;
  isTranslating: (text: string) => boolean;
}

// --- Notification System ---
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType) => void;
  removeNotification: (id: number) => void;
}