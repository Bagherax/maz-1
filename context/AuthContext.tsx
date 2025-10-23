import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
// FIX: Added CloudSyncConfig to the import list to be used for default user creation.
import { AuthContextType, User, LoginMethod, UserTier, CloudSyncConfig, View } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const JWT_TOKEN_KEY = 'authToken';
const USERS_DB_KEY = 'mazdady_users_db'; // Mock user database
const LOGIN_ATTEMPTS_KEY = 'loginAttempts';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60000; // 60 seconds

// Internal types for storage
type StoredUser = User & { password?: string };
type LoginAttemptInfo = { attempts: number; lockoutUntil: number | null };

// --- JWT Simulation Helpers ---
const createMockToken = (user: User): string => {
  const payload = {
    ...user,
    iat: Date.now(),
    exp: Date.now() + 3600000, // Token expires in 1 hour
  };
  return btoa(JSON.stringify(payload));
};

const parseMockToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      console.warn("Auth token expired");
      return null; // Token expired
    }
    return payload as User;
  } catch (e) {
    console.error("Failed to parse auth token", e);
    return null;
  }
};

// --- Storage Helpers ---
const getUsersFromStorage = (): StoredUser[] => {
  const dbString = localStorage.getItem(USERS_DB_KEY);
  return dbString ? JSON.parse(dbString) : [];
};

const saveUsersToStorage = (users: StoredUser[]) => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

// --- Login Throttling Helpers ---
const getLoginAttempts = (email: string): LoginAttemptInfo => {
  const attemptsStr = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
  const allAttempts = attemptsStr ? JSON.parse(attemptsStr) : {};
  return allAttempts[email] || { attempts: 0, lockoutUntil: null };
};

const recordFailedLoginAttempt = (email: string) => {
  const attemptsStr = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
  const allAttempts = attemptsStr ? JSON.parse(attemptsStr) : {};
  const currentInfo = allAttempts[email] || { attempts: 0, lockoutUntil: null };
  
  currentInfo.attempts += 1;
  if (currentInfo.attempts >= MAX_LOGIN_ATTEMPTS) {
    currentInfo.lockoutUntil = Date.now() + LOCKOUT_DURATION;
  }
  
  allAttempts[email] = currentInfo;
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(allAttempts));
};

const clearLoginAttempts = (email: string) => {
    const attemptsStr = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
    if (!attemptsStr) return;
    const allAttempts = JSON.parse(attemptsStr);
    delete allAttempts[email];
    localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(allAttempts));
};

// --- Mock IP Generator ---
const generateMockIp = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

// FIX: Added a default cloud sync configuration for new users.
const defaultCloudSync: CloudSyncConfig = {
  isEnabled: false,
  provider: 'none',
  syncOnWifiOnly: true,
  mediaCompression: 'medium',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for 2FA flow
  const [isAwaiting2FA, setIsAwaiting2FA] = useState<boolean>(false);
  const [pending2FAUser, setPending2FAUser] = useState<StoredUser | null>(null);
  
  // State for post-login actions
  const [postLoginAction, setPostLoginAction] = useState<View | null>(null);

  // New state for the elegant login prompt
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [loginPromptAction, setLoginPromptAction] = useState<View | null>(null);


  // --- Session Management ---
  useEffect(() => {
    try {
      const token = localStorage.getItem(JWT_TOKEN_KEY);
      if (token) {
        const userFromToken = parseMockToken(token);
        if (userFromToken) {
          setUser(userFromToken);
          setIsGuest(false);
        } else {
          localStorage.removeItem(JWT_TOKEN_KEY);
        }
      }
    } catch (e) {
      console.error("Failed to initialize auth state", e);
      localStorage.removeItem(JWT_TOKEN_KEY);
    } finally {
      // Simulate a slightly longer load time to see the animation
      setTimeout(() => setLoading(false), 1500);
    }
    
    // Check for token expiration periodically
    const interval = setInterval(() => {
        const token = localStorage.getItem(JWT_TOKEN_KEY);
        if (token && !parseMockToken(token)) {
            logout('auth.error_session_expired');
        }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const finalizeLogin = (loggedInUser: StoredUser) => {
      const { password: _p, ...userData } = loggedInUser;
      const token = createMockToken(userData as User);
      localStorage.setItem(JWT_TOKEN_KEY, token);
      setUser(userData as User);
      setIsGuest(false);
      setIsAwaiting2FA(false);
      setPending2FAUser(null);
      clearLoginAttempts(loggedInUser.email);
  };

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Login Throttling Check
        const attemptInfo = getLoginAttempts(email);
        if (attemptInfo.lockoutUntil && attemptInfo.lockoutUntil > Date.now()) {
            setError('auth.error_account_locked');
            setLoading(false);
            reject(new Error('Account locked'));
            return;
        }

        let usersDb = getUsersFromStorage();
        if (usersDb.length === 0) {
             const adminCredential = 'AbedLatifMAZDADYBagherax@78885444450843';
             const demoAdmin: StoredUser = { 
                id: '1', 
                name: 'Admin', 
                email: adminCredential, 
                password: adminCredential, 
                tier: 'MAZ' as const, 
                isAdmin: true, 
                status: 'active' as const,
                createdAt: new Date(), 
                bio: "Marketplace administrator.", 
                isVerified: true, 
                rating: 5, 
                reviewCount: 999,
                twoFactorEnabled: false,
                ipAddress: '127.0.0.1',
                // FIX: Added missing cloudSync property to conform to the User type.
                cloudSync: defaultCloudSync,
             };
             usersDb.push(demoAdmin);
             saveUsersToStorage(usersDb);
        }

        const foundUser = usersDb.find(u => u.email === email && u.password === password);

        if (foundUser) {
          if (foundUser.status === 'banned') {
            setError('auth.error_account_suspended');
            setLoading(false);
            reject(new Error('Account suspended'));
            return;
          }
          
          if (foundUser.twoFactorEnabled) {
              setPending2FAUser(foundUser);
              setIsAwaiting2FA(true);
          } else {
              finalizeLogin(foundUser);
          }
          setLoading(false);
          resolve();

        } else {
          recordFailedLoginAttempt(email);
          setError('auth.error_invalid_credentials');
          setLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }, []);

  const verify2FA = useCallback(async (code: string): Promise<void> => {
      setLoading(true);
      setError(null);
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              if (pending2FAUser && code === pending2FAUser.twoFactorSecret) {
                  finalizeLogin(pending2FAUser);
                  setLoading(false);
                  resolve();
              } else {
                  setError('auth.error_invalid_code');
                  setLoading(false);
                  reject(new Error('Invalid 2FA code'));
              }
          }, 1000);
      });
  }, [pending2FAUser]);

  const register = useCallback(async (data: { name: string; email: string; password: string; bio?: string; avatar?: string }): Promise<void> => {
    setLoading(true);
    setError(null);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { name, email, password, bio, avatar } = data;
        if (!name || !email || !password) {
            setError('auth.error_generic');
            setLoading(false);
            reject(new Error('Registration failed: Missing fields'));
            return;
        }

        const usersDb = getUsersFromStorage();

        if (usersDb.some((u) => u.email === email)) {
            setError('auth.error_user_exists');
            setLoading(false);
            reject(new Error('User already exists'));
            return;
        }
        
        const newUser: StoredUser = { 
            id: Date.now().toString(), name, email, password, 
            tier: 'normal' as const,
            isAdmin: false, status: 'active' as const,
            createdAt: new Date(), 
            bio: bio || "New member of the MAZDADY community!",
            avatar: avatar || undefined,
            isVerified: false, 
            rating: 0, 
            reviewCount: 0,
            twoFactorEnabled: false,
            ipAddress: generateMockIp(),
            // FIX: Added missing cloudSync property to conform to the User type.
            cloudSync: defaultCloudSync,
        };
        usersDb.push(newUser);
        saveUsersToStorage(usersDb);

        finalizeLogin(newUser);
        setLoading(false);
        resolve();
      }, 1000);
    });
  }, []);
  
  const logout = useCallback((reason?: string) => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem(JWT_TOKEN_KEY);
    if (reason) {
        // Use a temporary storage item to show a message after reload
        sessionStorage.setItem('logoutReason', reason);
    }
  }, []);

  const loginAsGuest = useCallback(() => {
    const guestUser: User = {
        id: `guest-${Date.now()}`,
        name: 'Guest',
        email: '',
        tier: 'normal',
        createdAt: new Date(),
        bio: 'Browsing the marketplace as a guest.',
        isVerified: false,
        rating: 0,
        reviewCount: 0,
        status: 'active',
        cloudSync: defaultCloudSync,
    };
    setUser(guestUser);
    setIsGuest(true);
    if (loading) setLoading(false);
  }, [loading]);

  const promptLoginIfGuest = useCallback((nextAction?: View) => {
    if (isGuest) {
        setLoginPromptAction(nextAction || null);
        setIsLoginPromptOpen(true);
        return true;
    }
    return false;
  }, [isGuest]);

  const confirmLoginPrompt = useCallback(() => {
    setPostLoginAction(loginPromptAction);
    setIsLoginPromptOpen(false);
    setLoginPromptAction(null);
    logout();
  }, [loginPromptAction, logout]);

  const cancelLoginPrompt = useCallback(() => {
    setIsLoginPromptOpen(false);
    setLoginPromptAction(null);
  }, []);


  const clearPostLoginAction = useCallback(() => {
    setPostLoginAction(null);
  }, []);

  useEffect(() => {
    const reason = sessionStorage.getItem('logoutReason');
    if (reason) {
        setError(reason);
        sessionStorage.removeItem('logoutReason');
    }
  }, []);

  const loginWithProvider = useCallback(async (provider: LoginMethod): Promise<void> => {
    // This function can also be enhanced with 2FA checks if required
    // For now, it bypasses 2FA for simplicity
    setLoading(true);
    setError(null);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // ... (existing logic)
        const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
        const mockEmail = `${provider}@example.com`;
        let usersDb = getUsersFromStorage();
        let userToLogin = usersDb.find((u) => u.email === mockEmail);

        if (!userToLogin) {
            const newUser: StoredUser = {
                id: `oauth-${Date.now()}`,
                name: `${providerName} User`,
                email: mockEmail,
                avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${providerName}&backgroundColor=4f46e5&textColor=ffffff&fontSize=40`,
                password: `mock_social_password_${Date.now()}`,
                tier: 'normal' as const,
                isAdmin: false,
                status: 'active' as const,
                createdAt: new Date(), bio: "Joined via social media.", isVerified: true, rating: 0, reviewCount: 0,
                twoFactorEnabled: false,
                ipAddress: generateMockIp(),
                // FIX: Added missing cloudSync property to conform to the User type.
                cloudSync: defaultCloudSync,
            };
            usersDb.push(newUser);
            saveUsersToStorage(usersDb);
            userToLogin = newUser;
        }
        
        finalizeLogin(userToLogin);
        setLoading(false);
        resolve();
      }, 1500);
    });
  }, []);
  
  const refreshCurrentUser = useCallback(() => {
    if (user && !isGuest) {
      const usersDb = getUsersFromStorage();
      const updatedUser = usersDb.find(u => u.id === user.id);
      if (updatedUser) {
        finalizeLogin(updatedUser);
      }
    }
  }, [user, isGuest]);

  const loginWithPhone = useCallback(async (phone: string): Promise<void> => {
     // ... logic to create or find phone user
     // For simplicity, let's create a new one each time for this mock
     const newUser: StoredUser = {
        id: `phone-${Date.now()}`,
        name: `User ${phone.slice(-4)}`,
        email: `${phone}@example.com`,
        tier: 'normal',
        createdAt: new Date(), bio: "Joined with phone.", isVerified: true, rating: 0, reviewCount: 0,
        isAdmin: false, status: 'active', twoFactorEnabled: false,
        password: 'mock_phone_password',
        // FIX: Added missing cloudSync property to conform to the User type.
        cloudSync: defaultCloudSync,
    };
    finalizeLogin(newUser);
  }, []);

  const updateCloudSyncConfig = useCallback(async (userId: string, config: Partial<CloudSyncConfig>): Promise<void> => {
    if (isGuest) return;
    let usersDb = getUsersFromStorage();
    const userIndex = usersDb.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        usersDb[userIndex].cloudSync = {
            ...usersDb[userIndex].cloudSync,
            ...config,
            lastSync: new Date().toISOString()
        };
        saveUsersToStorage(usersDb);
        if(user?.id === userId) refreshCurrentUser();
    }
  }, [user, isGuest, refreshCurrentUser]);
  
  // FIX: Implement missing chat moderation functions
  const blockUser = useCallback(async (userIdToBlock: string): Promise<void> => {
    if (!user || isGuest) return;
    const usersDb = getUsersFromStorage();
    const userIndex = usersDb.findIndex(u => u.id === user.id);
    if (userIndex > -1) {
        const currentUser = usersDb[userIndex];
        const blocked = new Set(currentUser.blockedUsers || []);
        blocked.add(userIdToBlock);
        currentUser.blockedUsers = Array.from(blocked);
        saveUsersToStorage(usersDb);
        refreshCurrentUser();
    }
  }, [user, isGuest, refreshCurrentUser]);

  const unblockUser = useCallback(async (userIdToUnblock: string): Promise<void> => {
      if (!user || isGuest) return;
      const usersDb = getUsersFromStorage();
      const userIndex = usersDb.findIndex(u => u.id === user.id);
      if (userIndex > -1) {
          const currentUser = usersDb[userIndex];
          if (!currentUser.blockedUsers) return;
          currentUser.blockedUsers = currentUser.blockedUsers.filter(id => id !== userIdToUnblock);
          saveUsersToStorage(usersDb);
          refreshCurrentUser();
      }
  }, [user, isGuest, refreshCurrentUser]);

  const isUserBlocked = useCallback((userId: string): boolean => {
      return !!user?.blockedUsers?.includes(userId);
  }, [user]);

  const updateUserAvatar = useCallback(async (userId: string, avatar: string): Promise<void> => {
    if (isGuest) return;
    let usersDb = getUsersFromStorage();
    const userIndex = usersDb.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        usersDb[userIndex].avatar = avatar;
        saveUsersToStorage(usersDb);
        if(user?.id === userId) refreshCurrentUser();
    } else {
        throw new Error("User not found to update avatar");
    }
  }, [user, isGuest, refreshCurrentUser]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isGuest,
    isAwaiting2FA,
    postLoginAction,
    login,
    verify2FA,
    register,
    logout,
    loading,
    error,
    loginAsGuest,
    promptLoginIfGuest,
    clearPostLoginAction,
    loginWithProvider,
    loginWithPhone,
    updateCloudSyncConfig,
    refreshCurrentUser,
    isLoginPromptOpen,
    confirmLoginPrompt,
    cancelLoginPrompt,
    blockUser,
    unblockUser,
    isUserBlocked,
    updateUserAvatar,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <LoadingSpinner />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};