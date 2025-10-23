import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import UserTierConfigurator from './UserTierConfigurator';
import UserManagement from '../UserManagement';
import ContentModeration from '../ContentModeration';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'userTiers' | 'userManagement' | 'contentModeration';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState<AdminTab>('userTiers');

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch(activeTab) {
      case 'userTiers':
        return <UserTierConfigurator />;
      case 'userManagement':
        return <UserManagement />;
      case 'contentModeration':
        return <ContentModeration />;
      default:
        return null;
    }
  }

  const TabButton: React.FC<{tabName: AdminTab, label: string}> = ({ tabName, label}) => (
     <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === tabName ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent'}`}
      >
        {label}
      </button>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-2xl h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b dark:border-gray-700 shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('admin.dashboard_title')}</h2>
            <button onClick={onClose} aria-label={t('aria.close_admin_panel')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-2xl font-light">
              &times;
            </button>
          </div>
          <nav className="mt-4">
            <div className="flex border-b dark:border-gray-600">
               <TabButton tabName="userTiers" label={t('admin.user_tiers_config')} />
               <TabButton tabName="userManagement" label={t('admin.user_management')} />
               <TabButton tabName="contentModeration" label={t('admin.content_moderation')} />
            </div>
          </nav>
        </header>
        
        <main className="flex-grow p-6 overflow-y-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;