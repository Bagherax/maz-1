import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface CloseButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick, className = '' }) => {
  const { t } = useLocalization();
  return (
    <button className={`close-button ${className}`} onClick={onClick} title={t('controls.close')} aria-label={t('controls.close')}>
      <span className="X"></span>
      <span className="Y"></span>
      <div className="close-text">{t('controls.close')}</div>
    </button>
  );
};

export default CloseButton;
