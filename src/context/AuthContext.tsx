import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthContextType, User, LoginMethod, View, CloudSyncConfig } from '../types';
import * as api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAwaiting2FA, setIsAwaiting2FA] = useState<boolean>(false);
  const [pending2FAEmail, setPending2FAEmail] = useState<string | null>(null);
  
  const [postLoginAction, setPostLoginAction] = useState<View | null>(null);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [loginPromptAction, setLoginPromptAction] = useState<View | null>(null);


  const finalizeLogin = useCallback((loggedInUser: User) => {
      setUser(loggedInUser);
      setIsGuest(false);
      setIsAwaiting2FA(false);
      setPending2FAEmail(null);
  }, []);

  // --- Session Management ---
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const token = api.getToken();
        if (token) {
          const userFromToken = await api.getMe();
          if (userFromToken) {
            finalizeLogin(userFromToken);
          } else {
            // Token is invalid or expired
            api.removeToken();
          }
        }
      } catch (e) {
        console.error("Failed to initialize auth state", e);
        api.removeToken();
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };
    
    initializeSession();
    
    // Check for token expiration periodically
    const interval = setInterval(async () => {
      const token = api.getToken();
      if (token && !api.isTokenValid(token)) {
          logout('auth.error_session_expired');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [finalizeLogin]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.login(email, password);
      if (response.requires2FA) {
        setPending2FAEmail(email);
        setIsAwaiting2FA(true);
      } else {
        finalizeLogin(response.user!);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [finalizeLogin]);

  const verify2FA = useCallback(async (code: string): Promise<void> => {
      setLoading(true);
      setError(null);
      if (!pending2FAEmail) {
          setError('auth.error_generic');
          setLoading(false);
          return;
      }
      try {
        const { user } = await api.verify2fa(pending2FAEmail, code);
        finalizeLogin(user);
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
  }, [pending2FAEmail, finalizeLogin]);

  const register = useCallback(async (data: { name: string; email: string; password: string; bio?: string; avatar?: string }): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
        const { user } = await api.register(data);
        finalizeLogin(user);
    } catch(err: any) {
        setError(err.message);
        throw err;
    } finally {
        setLoading(false);
    }
  }, [finalizeLogin]);
  
  const logout = useCallback((reason?: string) => {
    api.logout();
    setUser(null);
    setIsGuest(false);
    if (reason) {
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
        cloudSync: { isEnabled: false, provider: 'none', syncOnWifiOnly: true, mediaCompression: 'medium' },
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
    setLoading(true);
    setError(null);
    try {
        const { user } = await api.loginWithProvider(provider);
        finalizeLogin(user);
    } catch (err: any) {
        setError(err.message);
        throw err;
    } finally {
        setLoading(false);
    }
  }, [finalizeLogin]);
  
  const refreshCurrentUser = useCallback(async () => {
    if (user && !isGuest) {
      try {
        const updatedUser = await api.getMe();
        if (updatedUser) {
            finalizeLogin(updatedUser);
        }
      } catch (error) {
          console.error("Failed to refresh user", error);
          logout('auth.error_session_expired');
      }
    }
  }, [user, isGuest, finalizeLogin, logout]);

  const loginWithPhone = useCallback(async (phone: string): Promise<void> => {
      try {
         const { user } = await api.loginWithPhone(phone);
         finalizeLogin(user);
      } catch(err: any) {
          setError(err.message);
          throw err;
      }
  }, [finalizeLogin]);

  const updateCloudSyncConfig = useCallback(async (userId: string, config: Partial<CloudSyncConfig>): Promise<void> => {
    if (isGuest || !user) return;
    // FIX: The API expects a full CloudSyncConfig object when updating the `cloudSync` field.
    // Merge the partial config with the existing config before sending.
    const updatedConfig = { ...user.cloudSync, ...config };
    await api.updateUser(userId, { cloudSync: updatedConfig });
    if(user?.id === userId) refreshCurrentUser();
  }, [user, isGuest, refreshCurrentUser]);

  const value = {
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
    cancelLoginPrompt
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