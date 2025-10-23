import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import Icon from '../../../components/Icon';

interface ForgotPasswordFlowProps {
  onBack: () => void;
}

const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLocalization();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Password reset requested for: ${email}`);
    setSubmitted(true);
  };

  return (
    <>
      <div className="auth-heading">{t('auth.forgot_password_title')}</div>

      {submitted ? (
        <div className="text-center my-6">
          <p className="text-gray-600">{t('auth.reset_link_sent')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
            <p className="text-center text-sm text-gray-600">
                {t('auth.forgot_password_prompt')}
            </p>
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
            <button className="login-button" type="submit">
                {t('auth.send_reset_link')}
            </button>
        </form>
      )}

      <div className="text-center mt-4">
        <button onClick={onBack} className="text-sm font-medium text-gray-600 hover:underline flex items-center justify-center gap-1 mx-auto rtl:flex-row-reverse">
            <Icon name="arrow-left" className="w-4 h-4" />
            <span>{t('auth.back_to_login')}</span>
        </button>
      </div>
    </>
  );
};

export default ForgotPasswordFlow;