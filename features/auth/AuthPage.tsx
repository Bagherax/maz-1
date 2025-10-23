import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import LoginForm from './components/LoginForm';
import RegistrationWizard from './components/registration/RegistrationWizard';
import { useLocalization } from '../../hooks/useLocalization';
import { useAuthConfig } from '../../hooks/useAuthConfig';
import { LoginMethod, AuthView } from '../../types';
import PhoneVerificationFlow from './components/PhoneVerificationFlow';
import OAuthHandler from './components/OAuthHandler';
import { useAuth } from '../../hooks/useAuth';
import TwoFactorAuthFlow from './components/TwoFactorAuthFlow';
import ForgotPasswordFlow from './components/ForgotPasswordFlow';


const authCardStyles = `
  .auth-container {
    max-width: 380px;
    width: 100%;
    background: rgba(248, 249, 253, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 40px;
    padding: 25px 35px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
    margin: 20px;
  }

  .dark .auth-container {
    background: rgba(30, 41, 59, 0.7); /* dark:bg-slate-800 with opacity */
  }

  .auth-heading {
    text-align: center;
    font-weight: 900;
    font-size: 30px;
    color: rgb(16, 137, 211);
  }

  .auth-form {
    margin-top: 20px;
  }

  .auth-form .input {
    width: 100%;
    background: white;
    border: none;
    padding: 15px 20px;
    border-radius: 20px;
    margin-top: 15px;
    box-shadow: #cff0ff 0px 10px 10px -5px;
    border-inline: 2px solid transparent;
  }
  
  .dark .auth-form .input {
     background: #334155; /* slate-700 */
     color: #e2e8f0; /* slate-200 */
     box-shadow: #0f172a 0px 10px 10px -5px;
  }


  .auth-form .input::-moz-placeholder {
    color: rgb(170, 170, 170);
  }

  .auth-form .input::placeholder {
    color: rgb(170, 170, 170);
  }

  .auth-form .input:focus {
    outline: none;
    border-inline: 2px solid #12B1D1;
  }

  .auth-form .forgot-password {
    display: block;
    margin-top: 10px;
    margin-left: 10px;
  }

  .auth-form .forgot-password a, .auth-form .forgot-password button {
    font-size: 11px;
    color: #0099ff;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
  }
   .auth-form .forgot-password button:hover {
    text-decoration: underline;
   }

  .auth-form .login-button {
    display: block;
    width: 100%;
    font-weight: bold;
    background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
    color: white;
    padding-block: 15px;
    margin: 20px auto;
    border-radius: 20px;
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
    border: none;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  .auth-form .login-button:hover {
    transform: scale(1.03);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
  }

  .auth-form .login-button:active {
    transform: scale(0.95);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
  }
  .auth-form .login-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .social-account-container {
    margin-top: 25px;
  }

  .social-account-container .title {
    display: block;
    text-align: center;
    font-size: 10px;
    color: rgb(170, 170, 170);
  }
  
  .dark .social-account-container .title {
    color: #94a3b8; /* slate-400 */
  }

  .social-account-container .social-accounts {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 5px;
  }

  .social-account-container .social-accounts .social-button {
    background: linear-gradient(45deg, rgb(0, 0, 0) 0%, rgb(112, 112, 112) 100%);
    border: 5px solid white;
    padding: 5px;
    border-radius: 50%;
    width: 40px;
    aspect-ratio: 1;
    display: grid;
    place-content: center;
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 12px 10px -8px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }
  
  .dark .social-account-container .social-accounts .social-button {
    border: 5px solid #1e293b; /* slate-800 */
  }

  .social-account-container .social-accounts .social-button .svg {
    fill: white;
    margin: auto;
    height: 1em;
  }

  .social-account-container .social-accounts .social-button:hover {
    transform: scale(1.2);
  }

  .social-account-container .social-accounts .social-button:active {
    transform: scale(0.9);
  }

  .agreement {
    display: block;
    text-align: center;
    margin-top: 15px;
  }

  .agreement a {
    text-decoration: none;
    color: #0099ff;
    font-size: 9px;
  }
`;

const AuthPage: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const [oauthProvider, setOauthProvider] = useState<LoginMethod | null>(null);
  const { authConfig } = useAuthConfig();
  const { isAwaiting2FA } = useAuth();

  const { customCSS } = authConfig;

  useEffect(() => {
    if (isAwaiting2FA) {
      setView('2fa-verify');
    }
  }, [isAwaiting2FA]);

  const handleSocialLogin = (provider: LoginMethod) => {
    if (provider === 'phone') {
      setView('phone-verify');
    } else {
      setOauthProvider(provider);
      setView('oauth-redirect');
    }
  };
  
  const handleBackToLogin = () => {
    window.location.reload(); 
  }

  const renderContent = () => {
    switch(view) {
      case 'login':
        return <LoginForm onSwitchView={setView} onSocialLogin={handleSocialLogin} />;
      case 'register':
        return <RegistrationWizard onSwitchView={setView} onSocialLogin={handleSocialLogin} />;
      case 'phone-verify':
        return <PhoneVerificationFlow onBack={() => setView('login')} />;
      case 'oauth-redirect':
        return oauthProvider ? <OAuthHandler provider={oauthProvider} onBack={() => setView('login')} /> : null;
      case '2fa-verify':
        return <TwoFactorAuthFlow onBack={handleBackToLogin} />;
      case 'forgot-password':
        return <ForgotPasswordFlow onBack={() => setView('login')} />;
      default:
        return <LoginForm onSwitchView={setView} onSocialLogin={handleSocialLogin} />;
    }
  }

  return (
    <>
      <style>{authCardStyles}</style>
      <style>{customCSS}</style>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md"
      >
        {/* The new registration form has its own background, so we don't use the container for it */}
        {view === 'register' ? (
          renderContent()
        ) : (
          <div className="auth-container">
              {renderContent()}
          </div>
        )}
      </div>
    </>
  );
};

export default AuthPage;