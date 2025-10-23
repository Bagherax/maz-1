import React from 'react';
import { SortOption } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useGeolocation } from '../../../../hooks/useGeolocation';

interface SortDropdownProps {
  selected: SortOption;
  onSelect: (option: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ selected, onSelect }) => {
  const { t } = useLocalization();
  const { location } = useGeolocation();

  const sortOptions: { value: SortOption; label: string; disabled?: boolean }[] = [
    { value: 'date-new-old', label: t('controls.sort.date-new-old') },
    { value: 'date-old-new', label: t('controls.sort.date-old-new') },
    { value: 'price-low-high', label: t('controls.sort.price-low-high') },
    { value: 'price-high-low', label: t('controls.sort.price-high-low') },
    { value: 'rating-high-low', label: t('controls.sort.rating-high-low') },
    { value: 'rating-low-high', label: t('controls.sort.rating-low-high') },
    { value: 'most-liked', label: t('controls.sort.most-liked') },
    { value: 'most-viewed', label: t('controls.sort.most-viewed') },
    { value: 'verified-first', label: t('controls.sort.verified-first') },
    { value: 'nearby-first', label: !location ? t('controls.sort.nearby-first-disabled') : t('controls.sort.nearby-first'), disabled: !location },
  ];

  return (
    <div>
      <select
        id="sort-by"
        value={selected}
        onChange={(e) => onSelect(e.target.value as SortOption)}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;