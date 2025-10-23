

import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Feature } from '../types';

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const { t } = useLocalization();
  const { id, icon, status } = feature;

  const title = t(`feature.${id}.title`);
  const description = t(`feature.${id}.description`);
  const statusText = t(`status.${status}`);

  const statusColor = status === 'complete' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out p-6 flex flex-col">
      <div className="flex items-start justify-between">
        <div className="flex-shrink-0">{icon}</div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full inline-flex items-center ${statusColor}`}>
          {status === 'complete' && (
            <svg className="animated-check-icon w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path className="check-path" pathLength="100" strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
          {statusText}
        </span>
      </div>
      <div className="mt-4 flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;