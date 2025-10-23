import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LocalizationProvider } from './context/LocalizationContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import AuthPage from './features/auth/AuthPage';
import { AuthConfigProvider } from './context/AuthConfigContext';
import { AppContextType, View } from './types';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { useLocalization } from './hooks/useLocalization';
import { TranslationProvider } from './context/TranslationContext';
import ErrorBoundary from './components/ErrorBoundary';
import { MarketplaceUIProvider } from './context/MarketplaceUIContext';
import { useMarketplace } from './context/MarketplaceContext';
import { ChatProvider } from './context/ChatContext';

// Import new components
import MarketplacePage from './features/marketplace/MarketplacePage';
import ProfilePage from './features/profile/ProfilePage';
import CreateAdPage from './features/marketplace/CreateAdPage';
import SearchBar from './features/marketplace/components/browsing/SearchBar';
import CloudSyncSettings from './features/profile/components/CloudSyncSettings';
import LanguageSettings from './features/profile/components/LanguageSettings';
import AdDetailPanel from './features/marketplace/components/ads/AdDetailPanel';
import LoginPrompt from './components/LoginPrompt';
import AdminDashboard from './features/admin/AdminDashboard';
import ChatPage from './features/chat/ChatPage';
import { NotificationProvider } from './context/NotificationContext';
import NotificationManager from './components/NotificationManager';
import AdminPanel from './features/auth/components/AdminPanel';


export const AppContext = createContext<AppContextType | undefined>(undefined);
export const useView = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useView must be used in AppContext");
    return context;
};

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isGuest, postLoginAction, clearPostLoginAction } = useAuth();
  const [view, setView] = useState<View>({ type: 'marketplace' });
  const { getAdById } = useMarketplace();
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAuthAdminPanelOpen, setIsAuthAdminPanelOpen] = useState(false);

  useEffect(() => {
    // After a successful login, check if there was a pending action
    if (isAuthenticated && !isGuest && postLoginAction) {
        setView(postLoginAction);
        clearPostLoginAction();
    }
  }, [isAuthenticated, isGuest, postLoginAction, setView, clearPostLoginAction]);

  const selectedAd = view.type === 'ad' ? getAdById(view.id) : undefined;

  const renderMainView = () => {
    switch (view.type) {
      case 'create':
        return <CreateAdPage />;
      case 'profile':
        return <ProfilePage userId={view.id || user!.id} />;
      case 'cloud-sync':
        return <CloudSyncSettings />;
      case 'language-settings':
        return <LanguageSettings />;
      case 'chat':
        return <ChatPage conversationId={view.type === 'chat' ? view.conversationId : undefined} />;
      case 'marketplace':
      case 'ad': // MarketplacePage is always visible now, panel slides over
      default:
        return <MarketplacePage />;
    }
  };
  
  return (
    <AppContext.Provider value={{ view, setView }}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <SearchBar 
          onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        />
        <main className="pt-20 pb-4 transition-all duration-500" style={{ filter: selectedAd ? 'blur(4px)' : 'none' }}>
          <ErrorBoundary>
            {renderMainView()}
          </ErrorBoundary>
        </main>
        <AdDetailPanel ad={selectedAd} isOpen={!!selectedAd} onClose={() => setView({ type: 'marketplace' })} />
        <AdminDashboard 
          isOpen={isAdminDashboardOpen} 
          onClose={() => setIsAdminDashboardOpen(false)}
          onOpenAuthAdminPanel={() => setIsAuthAdminPanelOpen(true)}
        />
        <AdminPanel isOpen={isAuthAdminPanelOpen} onClose={() => setIsAuthAdminPanelOpen(false)} />
      </div>
    </AppContext.Provider>
  );
};

const AppInitializer: React.FC = () => {
    const { isAuthenticated, isLoginPromptOpen } = useAuth();
    return (
        <MarketplaceProvider>
          <ChatProvider>
            <TranslationProvider>
              <MarketplaceUIProvider>
                <AppContent />
                {isLoginPromptOpen && <LoginPrompt />}
                {!isAuthenticated && <AuthPage />}
              </MarketplaceUIProvider>
            </TranslationProvider>
          </ChatProvider>
        </MarketplaceProvider>
    );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LocalizationProvider>
        <NotificationProvider>
            <AuthProvider>
            <AuthConfigProvider>
                <AppInitializer />
            </AuthConfigProvider>
            </AuthProvider>
            <NotificationManager />
        </NotificationProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;