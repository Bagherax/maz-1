import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';

interface PasswordStrengthMeterProps {
  password?: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password = '' }) => {
  const { t } = useLocalization();
  
  const getStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;

    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    return score;
  };

  const score = getStrength(password);

  const getLabel = () => {
    switch (score) {
      case 0:
      case 1:
      case 2:
        return t('auth.password_strength.weak');
      case 3:
        return t('auth.password_strength.medium');
      case 4:
      case 5:
        return t('auth.password_strength.strong');
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (score) {
      case 0:
      case 1:
      case 2:
        return 'bg-red-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  const width = password.length > 0 ? `${(score / 5) * 100}%` : '0%';
  const label = password.length > 0 ? getLabel() : '';
  const color = getColor();

  return (
    <div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 my-1">
        <div className={`h-2 rounded-full transition-all duration-300 ${color}`} style={{ width }}></div>
      </div>
      <p className="text-xs text-right" style={{ color: 'var(--auth-color-text)' }}>{label}</p>
    </div>
  );
};

export default PasswordStrengthMeter;
