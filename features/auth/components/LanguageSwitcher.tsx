import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { Language } from '../../../types';
import { LANGUAGES } from '../../../data/languages';
import Dropdown from '../../../components/Dropdown';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLocalization();

  const languageOptions = LANGUAGES.map(lang => ({
    value: lang.code,
    label: lang.nativeName,
  }));

  const selectedOption = languageOptions.find(opt => opt.value === language) || languageOptions[0];

  return (
    <div className="relative">
       <Dropdown
        label={t('auth.select_language')}
        options={languageOptions}
        selected={selectedOption}
        onSelect={(option) => setLanguage(option.value as Language)}
      />
    </div>
  );
};

export default LanguageSwitcher;
