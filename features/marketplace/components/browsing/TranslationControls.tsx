import React from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useLocalization } from '../../../../hooks/useLocalization';
import { LANGUAGES } from '../../../../data/languages';
import { SupportedLanguage } from '../../../../types';
import Dropdown from '../../../../components/Dropdown';

const TranslationControls: React.FC = () => {
  const { config, setConfig } = useTranslation();
  const { t } = useLocalization();

  const languageOptions = LANGUAGES.map(lang => ({
    value: lang.code,
    label: lang.nativeName,
  }));
  
  const selectedOption = languageOptions.find(opt => opt.value === config.targetLanguage) || languageOptions[0];

  const handleLanguageChange = (option: { value: string }) => {
    setConfig(prev => ({ ...prev, targetLanguage: option.value as SupportedLanguage }));
  };

  const handleShowOriginalToggle = () => {
    setConfig(prev => ({ ...prev, showOriginal: !prev.showOriginal }));
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg border dark:border-gray-600/50 flex flex-col sm:flex-row items-center gap-4">
      <div className="w-full sm:w-auto sm:flex-1">
         <Dropdown
            label={t('translation.select_language')}
            options={languageOptions}
            selected={selectedOption}
            onSelect={handleLanguageChange}
        />
      </div>
      <div className="flex items-center space-x-2 rtl:space-x-reverse pt-2 sm:pt-6">
        <label htmlFor="show-original" className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{t('translation.show_original')}</label>
        <button
          id="show-original"
          role="switch"
          aria-checked={config.showOriginal}
          onClick={handleShowOriginalToggle}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            config.showOriginal ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              config.showOriginal ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default TranslationControls;