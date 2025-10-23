import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Language } from '../types';
import { LANGUAGES } from '../data/languages';
import Dropdown from './Dropdown';
import Icon from './Icon';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLocalization();

  const languageOptions = LANGUAGES.map(lang => ({
    value: lang.code,
    label: lang.name,
  }));

  const selectedOption = languageOptions.find(opt => opt.value === language) || languageOptions[0];

  return (
    <div className="relative">
       <Dropdown
        options={languageOptions}
        selected={selectedOption}
        onSelect={(option) => setLanguage(option.value as Language)}
        trigger={
          <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none" aria-label={t('aria.toggle_language')}>
            <Icon name="globe" className="w-5 h-5" />
          </button>
        }
        menuClassName="right-0 w-48"
      />
    </div>
  );
};

export default LanguageSwitcher;