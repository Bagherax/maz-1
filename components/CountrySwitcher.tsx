import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import { COUNTRIES } from '../data/countries';
import { useLocalization } from '../hooks/useLocalization';

// Define the Option type locally to match Dropdown's expectation
interface Option {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

const COUNTRY_STORAGE_KEY = 'selectedCountry';

const CountrySwitcher: React.FC = () => {
    const { t } = useLocalization();
    const countryOptions: Option[] = COUNTRIES.map(country => ({
      value: country.code,
      label: country.name,
      icon: <span className="text-lg">{country.flag}</span>
    }));
  
    const [selectedCountry, setSelectedCountry] = useState<Option>(() => {
        const savedCountryCode = localStorage.getItem(COUNTRY_STORAGE_KEY);
        return countryOptions.find(opt => opt.value === savedCountryCode) || countryOptions[0];
    });

    useEffect(() => {
        localStorage.setItem(COUNTRY_STORAGE_KEY, selectedCountry.value);
    }, [selectedCountry]);
  
    return (
      <Dropdown
        label={t('auth.select_country')}
        options={countryOptions}
        selected={selectedCountry}
        onSelect={setSelectedCountry}
      />
    );
  };
  
  export default CountrySwitcher;