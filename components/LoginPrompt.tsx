import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Icon from './Icon';
import { useLocalization } from '../hooks/useLocalization';

const LoginPrompt: React.FC = () => {
  const { confirmLoginPrompt, cancelLoginPrompt } = useAuth();
  const { t } = useLocalization();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in-fast">
      <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl w-full max-w-sm p-8 text-center animate-scale-up overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-200 dark:bg-indigo-900/40 rounded-full opacity-50"></div>
        <div className="absolute -bottom-24 -left-20 w-56 h-56 bg-purple-200 dark:bg-purple-900/30 rounded-full opacity-40"></div>
        
        <div className="relative z-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
            <Icon name="rocket-launch" className="h-10 w-10 text-indigo-600 dark:text-indigo-400 animate-bounce-sm" />
          </div>
          <h3 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">
            {t('prompt.join_community.title')}
          </h3>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            {t('prompt.join_community.message')}
          </p>
          
          <ul className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left rtl:text-right">
            <li className="flex items-center gap-2">
                <Icon name="check-badge" className="w-5 h-5 text-green-500" />
                <span>{t('prompt.join_community.benefit1')}</span>
            </li>
            <li className="flex items-center gap-2">
                <Icon name="check-badge" className="w-5 h-5 text-green-500" />
                <span>{t('prompt.join_community.benefit2')}</span>
            </li>
            <li className="flex items-center gap-2">
                <Icon name="check-badge" className="w-5 h-5 text-green-500" />
                <span>{t('prompt.join_community.benefit3')}</span>
            </li>
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={confirmLoginPrompt}
              type="button"
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 transition-transform hover:scale-105"
            >
              {t('prompt.join_community.confirm')}
            </button>
            <button
              onClick={cancelLoginPrompt}
              type="button"
              className="w-full rounded-lg bg-transparent px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              {t('prompt.join_community.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;