import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { useLocalization } from '../../../../hooks/useLocalization';
import { AuthView } from '../../../../types';
import PasswordStrengthMeter from '../PasswordStrengthMeter';
import LoadingSpinner from '../../../../components/LoadingSpinner';

interface RegistrationWizardProps {
  onSwitchView: (view: AuthView) => void;
  onSocialLogin: (provider: any) => void; // Keep for potential future use
}

const RegistrationWizard: React.FC<RegistrationWizardProps> = ({ onSwitchView }) => {
  const { register, loading, error: apiError } = useAuth();
  const { t } = useLocalization();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t('auth.error_password_mismatch'));
      return;
    }

    try {
      await register({
        name: `${firstName} ${lastName}`,
        email,
        password,
      });
      // On success, AuthContext handles the redirect
    } catch (err) {
      // The error from useAuth hook (apiError) will be displayed
    }
  };

  return (
    <>
      <style>{`
        .custom-reg-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 350px;
          padding: 20px;
          border-radius: 20px;
          position: relative;
          background-color: #1a1a1a;
          color: #fff;
          border: 1px solid #333;
        }

        .custom-reg-form .title {
          font-size: 28px;
          font-weight: 600;
          letter-spacing: -1px;
          position: relative;
          display: flex;
          align-items: center;
          padding-inline-start: 30px;
          color: #00bfff;
        }

        .custom-reg-form .title::before {
          width: 18px;
          height: 18px;
        }

        .custom-reg-form .title::after {
          width: 18px;
          height: 18px;
          animation: pulse 1s linear infinite;
        }

        .custom-reg-form .title::before,
        .custom-reg-form .title::after {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          border-radius: 50%;
          inset-inline-start: 0px;
          background-color: #00bfff;
        }

        .custom-reg-form .message, 
        .custom-reg-form .signin {
          font-size: 14.5px;
          color: rgba(255, 255, 255, 0.7);
        }

        .custom-reg-form .signin {
          text-align: center;
        }

        .custom-reg-form .signin a {
          color: #00bfff;
          cursor: pointer;
        }
        .custom-reg-form .signin a:hover {
          text-decoration: underline;
        }

        .custom-reg-form .flex {
          display: flex;
          width: 100%;
          gap: 6px;
        }

        .custom-reg-form label {
          position: relative;
        }

        .custom-reg-form label .input {
          background-color: #333;
          color: #fff;
          width: 100%;
          padding: 20px 05px 05px 10px;
          outline: 0;
          border: 1px solid rgba(105, 105, 105, 0.397);
          border-radius: 10px;
        }

        .custom-reg-form label .input + span {
          color: rgba(255, 255, 255, 0.5);
          position: absolute;
          inset-inline-start: 10px;
          top: 0px;
          font-size: 0.9em;
          cursor: text;
          transition: 0.3s ease;
        }

        .custom-reg-form label .input:placeholder-shown + span {
          top: 12.5px;
          font-size: 0.9em;
        }

        .custom-reg-form label .input:focus + span,
        .custom-reg-form label .input:valid + span {
          color: #00bfff;
          top: 0px;
          font-size: 0.7em;
          font-weight: 600;
        }

        .custom-reg-form .input {
          font-size: medium;
        }

        .custom-reg-form .submit {
          border: none;
          outline: none;
          padding: 10px;
          border-radius: 10px;
          color: #fff;
          font-size: 16px;
          transform: .3s ease;
          background-color: #00bfff;
          cursor: pointer;
        }

        .custom-reg-form .submit:hover {
          background-color: #00bfff96;
        }
         .custom-reg-form .submit:disabled {
          background-color: #00bfff50;
          cursor: not-allowed;
         }

        @keyframes pulse {
          from {
            transform: scale(0.9);
            opacity: 1;
          }

          to {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
      <form className="custom-reg-form" onSubmit={handleSubmit}>
        <p className="title">{t('auth.registration.title')}</p>
        <p className="message">{t('auth.registration.message')}</p>
        <div className="flex">
          <label>
            <input 
              className="input" 
              type="text" 
              placeholder="" 
              required 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <span>{t('auth.registration.firstname')}</span>
          </label>
          <label>
            <input 
              className="input" 
              type="text" 
              placeholder="" 
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <span>{t('auth.registration.lastname')}</span>
          </label>
        </div>
        <label>
          <input 
            className="input" 
            type="email" 
            placeholder="" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>{t('auth.email')}</span>
        </label>
        <label>
          <input 
            className="input" 
            type="password" 
            placeholder="" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>{t('auth.password')}</span>
        </label>
        
        <PasswordStrengthMeter password={password} />

        <label>
          <input 
            className="input" 
            type="password" 
            placeholder="" 
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span>{t('auth.confirm_password')}</span>
        </label>

        {(error || apiError) && <p className="text-xs text-red-500 text-center mt-2">{error || t(apiError!)}</p>}

        <button className="submit ripple flex justify-center items-center" type="submit" disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : t('auth.registration.submit')}
        </button>
        <p className="signin">
          {t('auth.go_to_login')}{' '}
          <a onClick={() => onSwitchView('login')}>{t('auth.go_to_login_link')}</a>
        </p>
      </form>
    </>
  );
};

export default RegistrationWizard;