import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useLocalization } from '../../../hooks/useLocalization';
import Icon from '../../../components/Icon';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface TwoFactorAuthFlowProps {
  onBack: () => void;
}

const TwoFactorAuthFlow: React.FC<TwoFactorAuthFlowProps> = ({ onBack }) => {
  const [code, setCode] = useState('');
  const { verify2FA, loading, error: apiError } = useAuth();
  const { t } = useLocalization();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      try {
        await verify2FA(code);
      } catch (err) {
        console.error("2FA verification failed:", err);
      }
    }
  };

  return (
    <>
      <div className="auth-heading">{t('auth.2fa_title')}</div>
      <p className="text-center text-sm text-gray-600 mt-4">{t('auth.2fa_prompt')}</p>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          id="2fa-code"
          name="2fa-code"
          type="text"
          maxLength={6}
          autoComplete="one-time-code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="input text-center tracking-[0.5em]"
          placeholder="------"
        />
        {apiError && <p className="text-xs text-red-500 text-center mt-2">{t(apiError)}</p>}
        <button
          type="submit"
          className="login-button flex justify-center items-center"
          disabled={loading || code.length !== 6}
        >
          {loading ? <LoadingSpinner size="sm" /> : t('auth.verify')}
        </button>
      </form>
       <div className="text-center mt-4">
        <button
            onClick={onBack}
            className="text-sm font-medium text-gray-600 hover:underline flex items-center justify-center gap-1 mx-auto rtl:flex-row-reverse"
        >
            <Icon name="arrow-left" className="w-4 h-4" />
            <span>{t('auth.back_to_login')}</span>
        </button>
      </div>
    </>
  );
};

export default TwoFactorAuthFlow;