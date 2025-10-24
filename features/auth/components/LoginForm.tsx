import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useLocalization } from '../../../hooks/useLocalization';
import SocialLogins from './SocialLogins';
import { LoginMethod, AuthView } from '../../../types';
import { useAuthConfig } from '../../../hooks/useAuthConfig';
import Icon from '../../../components/Icon';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface LoginFormProps {
  onSocialLogin: (provider: LoginMethod) => void;
  onSwitchView: (view: AuthView) => void;
}

const REMEMBER_ME_KEY = 'rememberedEmail';

const LoginForm: React.FC<LoginFormProps> = ({ onSocialLogin, onSwitchView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, loading, error: apiError } = useAuth();
  const { t } = useLocalization();
  const { authConfig } = useAuthConfig();
  const { visibleElements } = authConfig;

  useEffect(() => {
    const rememberedEmail = localStorage.getItem(REMEMBER_ME_KEY);
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, email);
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <>
      <div className="auth-heading">{t('auth.login_title')}</div>
      <form onSubmit={handleSubmit} className="auth-form">
        <input 
          required 
          className="input" 
          type="email" 
          name="email" 
          id="email" 
          placeholder={t('auth.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          required 
          className="input" 
          type="password" 
          name="password" 
          id="password" 
          placeholder={t('auth.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <div className="flex items-center justify-between text-xs px-2">
            {visibleElements.includes('rememberMe') && (
                <label htmlFor="remember-me" className="flex items-center cursor-pointer text-gray-700">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-3 w-3 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                    />
                    <span className="ml-2">{t('auth.remember_me')}</span>
                </label>
            )}

            {visibleElements.includes('forgotPassword') && (
                 <button 
                    type="button" 
                    onClick={() => onSwitchView('forgot-password')} 
                    className="font-medium text-blue-500 hover:underline bg-transparent border-none cursor-pointer"
                >
                    {t('auth.forgot_password')}
                </button>
            )}
        </div>
        
        {apiError && <p className="text-xs text-red-500 text-center mt-2">{t(apiError)}</p>}

        <button
          className="login-button ripple flex justify-center items-center" 
          type="submit"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="sm" /> : t('auth.login_button')}
        </button>
      </form>

      <SocialLogins onSocialLogin={onSocialLogin} />
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          {t('auth.go_to_register')}{' '}
          <button onClick={() => onSwitchView('register')} className="font-medium text-blue-500 hover:underline">
            {t('auth.go_to_register_link')}
          </button>
        </p>
      </div>
      <span className="agreement"><a href="#">{t('auth.learn_agreement')}</a></span>
    </>
  );
};

export default LoginForm;
