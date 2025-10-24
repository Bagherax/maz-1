import React from 'react';
import { UserTier } from '../../../../types';

interface UserTierBadgeProps {
  tier: UserTier['level'];
}

const tierStyles: Record<UserTier['level'], string> = {
  normal: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  bronze: 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  silver: 'bg-gray-300 text-gray-800 dark:bg-gray-500 dark:text-gray-100',
  gold: 'bg-amber-300 text-amber-800 dark:bg-amber-700 dark:text-amber-100',
  platinum: 'bg-cyan-200 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100',
  diamond: 'bg-sky-200 text-sky-800 dark:bg-sky-800 dark:text-sky-100',
  su_diamond: 'bg-fuchsia-300 text-fuchsia-900 dark:bg-fuchsia-800 dark:text-fuchsia-100',
  MAZ: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold',
};

const UserTierBadge: React.FC<UserTierBadgeProps> = ({ tier }) => {
  const style = tierStyles[tier];

  if (tier === 'MAZ') {
    return (
      <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold rounded-full ${style}`}>
        MAZ
      </span>
    );
  }
  
  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${style}`}>
      {tier.replace('_', ' ')}
    </span>
  );
};

export default UserTierBadge;