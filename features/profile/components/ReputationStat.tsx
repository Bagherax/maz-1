import React from 'react';

interface ReputationStatProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

const ReputationStat: React.FC<ReputationStatProps> = ({ value, label, icon }) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
        {icon}
        {value}
      </span>
    </div>
  );
};

export default ReputationStat;