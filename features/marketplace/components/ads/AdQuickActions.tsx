import React from 'react';
import Icon from '../../../../components/Icon';
import { useTheme } from '../../../../hooks/useTheme';
import { useView } from '../../../../App';
import { Ad } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';

interface AdQuickActionsProps {
  ad: Ad;
}

const QuickActionButton: React.FC<{ icon: React.ComponentProps<typeof Icon>['name'], label: string, onClick: (e: React.MouseEvent) => void }> = ({ icon, label, onClick }) => {
    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(e);
    }
    return (
        <button onClick={stopPropagation} title={label} className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs">
            <Icon name={icon} className="w-4 h-4" />
            <span className="font-semibold">{label}</span>
        </button>
    );
};


const AdQuickActions: React.FC<AdQuickActionsProps> = ({ ad }) => {
  const { toggleTheme } = useTheme();
  const { setView } = useView();
  const { t } = useLocalization();

  const handleBoost = () => alert('Paid Boost feature coming soon!');
  const handleSocial = () => alert('Social Media Boost feature coming soon!');
  const handleCreateSimilar = () => setView({ type: 'create' });

  return (
    <div className="flex justify-around items-center p-1 border-t border-gray-100 dark:border-gray-700/50">
      <QuickActionButton icon="rocket-launch" label={t('ad_quick_actions.boost')} onClick={handleBoost} />
      <QuickActionButton icon="share" label={t('ad_quick_actions.social')} onClick={handleSocial} />
      <QuickActionButton icon="moon" label={t('ad_quick_actions.theme')} onClick={() => toggleTheme()} />
      <QuickActionButton icon="plus" label={t('ad_quick_actions.similar')} onClick={handleCreateSimilar} />
    </div>
  );
};
export default AdQuickActions;