import React, { useState, useEffect, ReactNode } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import Skeleton from './Skeleton';
import { useLocalization } from '../hooks/useLocalization';

interface TProps {
  children: ReactNode;
}

const T: React.FC<TProps> = ({ children }) => {
  const { translate, config, isTranslating } = useTranslation();
  const { t } = useLocalization();
  const originalText = typeof children === 'string' ? children : '';
  const [translatedText, setTranslatedText] = useState(originalText);

  useEffect(() => {
    let isMounted = true;
    
    // Always reset to original text when it changes before translating
    setTranslatedText(originalText);

    if (originalText && config.targetLanguage !== 'en') {
        translate(originalText).then(result => {
            if (isMounted) {
                setTranslatedText(result);
            }
        });
    }
    
    return () => { isMounted = false; };
  }, [originalText, config.targetLanguage, translate]);

  const isLoading = isTranslating(originalText);
  const hasBeenTranslated = translatedText !== originalText;

  if (isLoading) {
    // Render skeleton with an approximate width based on text length
    const approxWidth = Math.max(10, Math.min(100, originalText.length * 0.6));
    return <Skeleton className="w-full max-w-[--w]" style={{'--w': `${approxWidth}ch`} as React.CSSProperties} />;
  }
  
  if (config.showOriginal && hasBeenTranslated) {
    return (
      <span title={originalText}>
        {translatedText}
        <span className="block text-xs text-gray-400 dark:text-gray-500 opacity-80 mt-1">
          {t('translation.original_text', { text: originalText })}
        </span>
      </span>
    );
  }

  return <span title={hasBeenTranslated ? originalText : undefined}>{translatedText}</span>;
};

export default T;