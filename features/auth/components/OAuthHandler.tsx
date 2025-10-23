import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useLocalization } from '../../../hooks/useLocalization';
import { LoginMethod } from '../../../types';
import Icon from '../../../components/Icon';

interface OAuthHandlerProps {
  provider: LoginMethod;
  onBack: () => void;
}

const OAuthHandler: React.FC<OAuthHandlerProps> = ({ provider, onBack }) => {
  const { loginWithProvider } = useAuth();
  const { t } = useLocalization();
  const [error, setError] = useState<string | null>(null);

  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

  const handleLogin = useCallback(async () => {
    setError(null);
    try {
      await loginWithProvider(provider);
      // On success, AuthContext will change state and App.tsx will render AppContent
    } catch (e) {
      setError(t('auth.error_oauth_failed', { provider: providerName }));
    }
  }, [provider, loginWithProvider, t, providerName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleLogin();
    }, 1500);

    return () => clearTimeout(timer);
  }, [handleLogin]);

  if (error) {
    return (
      <div className="mt-8 text-center space-y-6">
        <p className="text-lg font-medium text-red-500">{error}</p>
        <div className="flex space-x-4 rtl:space-x-reverse justify-center">
          <button
            onClick={handleLogin}
            className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
                backgroundColor: 'var(--auth-color-button)',
                color: 'var(--auth-color-button-text)',
                borderColor: 'var(--auth-color-button)',
            }}
          >
            {t('auth.try_again')}
          </button>
          <button
            onClick={onBack}
            className="group relative flex justify-center py-2 px-4 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
                backgroundColor: 'transparent',
                color: 'var(--auth-color-text)',
                borderColor: 'var(--auth-color-border)',
            }}
          >
            {t('auth.back_to_login')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 text-center space-y-4">
        <span style={{ color: 'var(--auth-color-primary)'}}>
            <Icon name={provider as any} className="w-16 h-16 mx-auto animate-pulse" />
        </span>
        <p className="text-lg font-medium">
            {t('auth.connecting_to', { provider: providerName })}
        </p>
        <p className="text-sm" style={{ color: 'var(--auth-color-text)' }}>
            {t('auth.oauth_redirect_message', { provider: providerName })}
        </p>
    </div>
  );
};

export default OAuthHandler;