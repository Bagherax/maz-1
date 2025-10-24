import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import UserTierConfigurator from './marketplace/UserTierConfigurator';
import UserManagement from './UserManagement';
import AdManagement from './ContentModeration';
import ModerationQueue from './ModerationQueue';
import ActivityLog from './ActivityLog';
import SystemConfiguration from './SystemConfiguration';
import AnalyticsDashboard from './AnalyticsDashboard';
import Icon from '../../components/Icon';
import CloseButton from '../../components/CloseButton';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthAdminPanel: () => void;
}

type AdminTab = 'analytics' | 'moderationQueue' | 'activityLog' | 'userManagement' | 'adManagement' | 'userTiers' | 'systemConfig';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, onOpenAuthAdminPanel }) => {
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch(activeTab) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'moderationQueue':
        return <ModerationQueue />;
      case 'activityLog':
        return <ActivityLog />;
      case 'userManagement':
        return <UserManagement />;
      case 'adManagement':
        return <AdManagement />;
      case 'userTiers':
        return <UserTierConfigurator />;
      case 'systemConfig':
        return <SystemConfiguration />;
      default:
        return null;
    }
  }

  const TabButton: React.FC<{tabName: AdminTab, label: string}> = ({ tabName, label}) => (
     <button
        onClick={() => setActiveTab(tabName)}
        className={`px-3 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap ripple ${activeTab === tabName ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent'}`}
      >
        {label}
      </button>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-4xl h-full bg-white dark:bg-gray-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b dark:border-gray-700 shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('admin.dashboard_title')}</h2>
            <div className="flex items-center space-x-2">
              <button onClick={onOpenAuthAdminPanel} aria-label={t('aria.open_admin_panel')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 ripple">
                  <Icon name="cog" className="w-6 h-6" />
              </button>
              <CloseButton onClick={onClose} className="text-[6px]" />
            </div>
          </div>
          <nav className="mt-4 -mb-px">
            <div className="flex border-b dark:border-gray-600 overflow-x-auto">
               <TabButton tabName="analytics" label={t('admin.analytics')} />
               <TabButton tabName="moderationQueue" label={t('admin.moderation_queue')} />
               <TabButton tabName="activityLog" label={t('admin.activity_log')} />
               <TabButton tabName="userManagement" label={t('admin.user_management')} />
               <TabButton tabName="adManagement" label={t('admin.ad_management')} />
               <TabButton tabName="userTiers" label={t('admin.user_tiers_config')} />
               <TabButton tabName="systemConfig" label={t('admin.system_config')} />
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