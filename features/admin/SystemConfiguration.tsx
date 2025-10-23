import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLocalization } from '../../hooks/useLocalization';
import { AdminConfig, UserTier } from '../../types';
import Icon from '../../components/Icon';

const ALL_PAYMENT_METHODS = ['credit_card', 'paypal', 'crypto', 'bank_transfer'];

const SystemConfiguration: React.FC = () => {
  const { adminConfig, userTiers, updateAdminConfig } = useMarketplace();
  const { t } = useLocalization();
  const [config, setConfig] = useState<AdminConfig>(adminConfig);

  useEffect(() => {
    setConfig(adminConfig);
  }, [adminConfig]);

  const handleToggleChange = (key: 'siteMaintenance' | 'registrationOpen', value: boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleCommissionChange = (level: UserTier['level'], value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      setConfig(prev => ({
        ...prev,
        commissionRates: { ...prev.commissionRates, [level]: numValue }
      }));
    }
  };

  const handleModerationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig(prev => ({ ...prev, contentModeration: e.target.value as AdminConfig['contentModeration'] }));
  };
  
  const handlePaymentMethodChange = (method: string) => {
      setConfig(prev => {
          const newMethods = prev.paymentMethods.includes(method)
            ? prev.paymentMethods.filter(m => m !== method)
            : [...prev.paymentMethods, method];
          return { ...prev, paymentMethods: newMethods };
      });
  };

  const handleSave = () => {
    updateAdminConfig(config);
    alert('System configuration saved!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{t('admin.system_config')}</h3>
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {/* Site Maintenance */}
            <div className="flex justify-between items-center">
                <label className="font-medium">{t('admin.config.site_maintenance')}</label>
                <button
                  role="switch"
                  aria-checked={config.siteMaintenance}
                  onClick={() => handleToggleChange('siteMaintenance', !config.siteMaintenance)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.siteMaintenance ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.siteMaintenance ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
            {/* Registration Open */}
            <div className="flex justify-between items-center">
                <label className="font-medium">{t('admin.config.registration_open')}</label>
                 <button
                  role="switch"
                  aria-checked={config.registrationOpen}
                  onClick={() => handleToggleChange('registrationOpen', !config.registrationOpen)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.registrationOpen ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.registrationOpen ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
            {/* Content Moderation */}
            <div className="flex justify-between items-center">
                <label htmlFor="moderation-select" className="font-medium">{t('admin.config.content_moderation')}</label>
                <select id="moderation-select" value={config.contentModeration} onChange={handleModerationChange} className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600">
                    <option value="auto">{t('admin.config.moderation.auto')}</option>
                    <option value="manual">{t('admin.config.moderation.manual')}</option>
                    <option value="hybrid">{t('admin.config.moderation.hybrid')}</option>
                </select>
            </div>
        </div>
      </div>
      
      {/* Commission Rates */}
      <div>
        <h4 className="text-lg font-semibold mb-2">{t('admin.config.commission_rates')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {userTiers.map(tier => (
                <div key={tier.level}>
                    <label className="text-sm capitalize">{tier.level.replace('_', ' ')}</label>
                    <input 
                        type="number"
                        value={config.commissionRates[tier.level] || 0}
                        onChange={(e) => handleCommissionChange(tier.level, e.target.value)}
                        className="w-full p-2 mt-1 rounded bg-white dark:bg-gray-800 border dark:border-gray-500 text-sm"
                    />
                </div>
            ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h4 className="text-lg font-semibold mb-2">{t('admin.config.payment_methods')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {ALL_PAYMENT_METHODS.map(method => (
                <label key={method} className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={config.paymentMethods.includes(method)}
                        onChange={() => handlePaymentMethodChange(method)}
                        className="rounded text-indigo-500"
                    />
                    <span>{t(`admin.config.payment.${method}`)}</span>
                </label>
            ))}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button onClick={handleSave} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-md hover:bg-indigo-700 ripple flex items-center gap-2">
          <Icon name="check-badge" className="w-5 h-5" />
          <span>{t('admin.save_changes')}</span>
        </button>
      </div>
    </div>
  );
};

export default SystemConfiguration;