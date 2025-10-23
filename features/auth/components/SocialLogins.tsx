import React from 'react';
import { useAuthConfig } from '../../../hooks/useAuthConfig';
import { useLocalization } from '../../../hooks/useLocalization';
import Icon from '../../../components/Icon';
import { LoginMethod } from '../../../types';

interface SocialLoginsProps {
  onSocialLogin: (provider: LoginMethod) => void;
}

const SocialLogins: React.FC<SocialLoginsProps> = ({ onSocialLogin }) => {
  const { authConfig } = useAuthConfig();
  const { t } = useLocalization();
  const { enabledMethods } = authConfig;

  // These are the methods that are typically represented by social icon buttons
  const socialMethods: LoginMethod[] = ['google', 'apple', 'twitter', 'facebook', 'github', 'phone'];
  const availableMethods = socialMethods.filter(method => enabledMethods.includes(method));

  if (availableMethods.length === 0) return null;

  return (
    <div className="social-account-container">
      <span className="title">{t('auth.social_login_divider')}</span>
      <div className="social-accounts">
        {availableMethods.map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => onSocialLogin(method)}
            className={`social-button ${method} ripple`}
            aria-label={t(`auth.method.${method}`)}
          >
            <Icon name={method as any} className="svg" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialLogins;