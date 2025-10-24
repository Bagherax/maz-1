import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useLocalization } from '../../../hooks/useLocalization';
import { CloudSyncConfig } from '../../../types';
import Icon from '../../../components/Icon';
import { useView } from '../../../App';
import LoadingSpinner from '../../../components/LoadingSpinner';

const CloudSyncSettings: React.FC = () => {
    const { user, updateCloudSyncConfig, refreshCurrentUser } = useAuth();
    const { t } = useLocalization();
    const { setView } = useView();
    
    // This component should only be rendered for an authenticated user.
    const [config, setConfig] = useState<CloudSyncConfig>(user!.cloudSync);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Ensure local state is updated if context changes (e.g., after a refresh)
        setConfig(user!.cloudSync);
    }, [user]);

    const handleConnect = (provider: 'google-drive' | 'dropbox') => {
        // In a real app, this would initiate an OAuth flow.
        console.log(`Simulating connection to ${provider}...`);
        setConfig(prev => ({ ...prev, provider, isEnabled: true }));
    };

    const handleDisconnect = () => {
        setConfig(prev => ({ ...prev, provider: 'none', isEnabled: false }));
    };
    
    const handleToggle = (key: 'isEnabled' | 'syncOnWifiOnly') => {
        setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCompressionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setConfig(prev => ({ ...prev, mediaCompression: e.target.value as CloudSyncConfig['mediaCompression'] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await updateCloudSyncConfig(user!.id, config);
        // We call refreshCurrentUser to ensure the user object in context is up-to-date.
        refreshCurrentUser();
        setIsSaving(false);
        alert(t('admin.save_success'));
    };
    
    const providerConnected = config.provider !== 'none';

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg relative">
                <button onClick={() => setView({ type: 'profile', id: user!.id })} title={t('aria.go_back')} className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full ripple">
                    <Icon name="arrow-left" className="w-5 h-5" />
                </button>
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">{t('profile.cloud_sync_title')}</h1>

                <div className="space-y-10">
                    {/* --- Connection Section --- */}
                    <div className="p-6 border rounded-lg dark:border-gray-700">
                        <h2 className="text-lg font-semibold mb-4">{t('cloud.connect_provider')}</h2>
                        {!providerConnected ? (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => handleConnect('google-drive')} className="flex-1 flex items-center justify-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ripple">
                                    <Icon name="google-drive" className="w-6 h-6" />
                                    <span>{t('cloud.provider.google-drive')}</span>
                                </button>
                                <button onClick={() => handleConnect('dropbox')} className="flex-1 flex items-center justify-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ripple">
                                    <Icon name="dropbox" className="w-6 h-6" />
                                    <span>{t('cloud.provider.dropbox')}</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/50 p-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Icon name={config.provider as any} className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                    <div>
                                        <p className="font-semibold">{t(`cloud.provider.${config.provider}`)}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('cloud.connected_as', { email: user!.email })}</p>
                                    </div>
                                </div>
                                <button onClick={handleDisconnect} className="text-sm font-medium text-red-600 hover:underline ripple rounded px-1">{t('cloud.disconnect')}</button>
                            </div>
                        )}
                    </div>

                    {/* --- Settings Section --- */}
                    <div className="p-6 border rounded-lg dark:border-gray-700">
                        <h2 className="text-lg font-semibold mb-4">{t('cloud.settings')}</h2>
                        <div className="space-y-4">
                            <ToggleSwitch label={t('cloud.enable_sync')} enabled={config.isEnabled} onToggle={() => handleToggle('isEnabled')} disabled={!providerConnected} />
                            <ToggleSwitch label={t('cloud.wifi_only')} enabled={config.syncOnWifiOnly} onToggle={() => handleToggle('syncOnWifiOnly')} disabled={!config.isEnabled} />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cloud.media_compression')}</label>
                                <select value={config.mediaCompression} onChange={handleCompressionChange} disabled={!config.isEnabled} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50">
                                    <option value="none">{t('cloud.compression.none')}</option>
                                    <option value="medium">{t('cloud.compression.medium')}</option>
                                    <option value="high">{t('cloud.compression.high')}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                     {/* --- Status Section --- */}
                    <div className="p-6 border rounded-lg dark:border-gray-700">
                        <h2 className="text-lg font-semibold mb-4">{t('cloud.sync_status')}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {config.lastSync ? t('cloud.last_sync', { time: new Date(config.lastSync).toLocaleString() }) : t('cloud.not_synced')}
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 ripple flex items-center justify-center gap-2 min-h-[40px]">
                            {isSaving ? <LoadingSpinner size="sm" /> : (
                                <>
                                    <Icon name="check-badge" className="w-5 h-5" />
                                    <span>{t('cloud.save_settings')}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ToggleSwitch: React.FC<{ label: string, enabled: boolean, onToggle: () => void, disabled?: boolean }> = ({ label, enabled, onToggle, disabled }) => (
    <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>{label}</span>
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={onToggle}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed ${
                enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
        >
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                }`}
            />
        </button>
    </div>
)


export default CloudSyncSettings;