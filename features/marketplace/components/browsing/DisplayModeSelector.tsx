import React from 'react';
import { DisplayMode } from '../../../../types';
import Icon from '../../../../components/Icon';
import { useLocalization } from '../../../../hooks/useLocalization';

interface DisplayModeSelectorProps {
  selected: DisplayMode;
  onSelect: (mode: DisplayMode) => void;
}

const DisplayModeSelector: React.FC<DisplayModeSelectorProps> = ({ selected, onSelect }) => {
  const { t } = useLocalization();

  const modes: { name: DisplayMode; icon: React.ComponentProps<typeof Icon>['name'] }[] = [
    { name: 'compact', icon: 'view-grid-compact' },
    { name: 'standard', icon: 'view-grid' },
    { name: 'detailed', icon: 'view-grid-detailed' },
    { name: 'list', icon: 'queue-list' },
  ];

  return (
    <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
      {modes.map(mode => (
        <button
          key={mode.name}
          onClick={() => onSelect(mode.name)}
          aria-label={t(`controls.view.${mode.name}`)}
          aria-pressed={selected === mode.name}
          className={`p-2 rounded-md transition-colors duration-200 ripple ${
            selected === mode.name
              ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700/50'
          }`}
        >
          <Icon name={mode.icon} className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};

export default DisplayModeSelector;