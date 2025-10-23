import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useLocalization } from '../../../hooks/useLocalization';
import Icon from '../../../components/Icon';

interface PhoneVerificationFlowProps {
  onBack: () => void;
}

const PhoneVerificationFlow: React.FC<PhoneVerificationFlowProps> = ({ onBack }) => {
  const [step, setStep] = useState<'enter-phone' | 'enter-code'>('enter-phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [mockCode, setMockCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { loginWithPhone, loading } = useAuth();
  const { t } = useLocalization();

  useEffect(() => {
    if (step === 'enter-code') {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setMockCode(code);
      console.log(`[DEMO] Verification code for ${phoneNumber}: ${code}`);
    }
  }, [step, phoneNumber]);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (phoneNumber.length > 8) { // Simple validation
      setStep('enter-code');
    } else {
      setError(t('auth.error_phone_invalid'));
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (verificationCode === mockCode) {
      await loginWithPhone(phoneNumber);
    } else {
      setError(t('auth.error_invalid_code'));
    }
  };

  return (
    <>
      <div className="auth-heading">{t('auth.phone_verification_title')}</div>
        {step === 'enter-phone' ? (
            <form onSubmit={handleSendCode} className="auth-form">
                <p className="text-center text-sm text-gray-600">{t('auth.enter_phone_prompt')}</p>
                 <input
                    id="phone-number"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input"
                    placeholder={t('auth.phone')}
                />
                {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? '...' : t('auth.send_code')}
                </button>
            </form>
        ) : (
            <form onSubmit={handleVerifyCode} className="auth-form">
                <p className="text-center text-sm text-gray-600">{t('auth.enter_code_prompt')}</p>
                <input
                    id="verification-code"
                    name="code"
                    type="text"
                    maxLength={6}
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="input text-center tracking-[0.5em]"
                    placeholder="------"
                />
                {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? '...' : t('auth.verify')}
                </button>
                <div className="text-center text-sm">
                    <button type="button" className="font-medium text-blue-500 hover:underline">
                        {t('auth.resend_code')}
                    </button>
                </div>
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

export default PhoneVerificationFlow;