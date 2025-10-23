import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useView } from '../../../App';
import { useLocalization } from '../../../hooks/useLocalization';
import { LANGUAGES } from '../../../data/languages';
import { Language } from '../../../types';
import Icon from '../../../components/Icon';
import CountrySwitcher from '../../../components/CountrySwitcher';

const LanguageSettings: React.FC = () => {
    const { user } = useAuth();
    const { setView } = useView();
    const { language, setLanguage, t } = useLocalization();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLanguages = useMemo(() => {
        if (!searchTerm) {
            return LANGUAGES;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return LANGUAGES.filter(lang =>
            lang.name.toLowerCase().includes(lowercasedFilter) ||
            lang.nativeName.toLowerCase().includes(lowercasedFilter)
        );
    }, [searchTerm]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg relative">
                <button 
                    onClick={() => setView({ type: 'profile', id: user!.id })} 
                    title={t('aria.go_back')} 
                    className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full ripple"
                >
                    <Icon name="arrow-left" className="w-5 h-5" />
                </button>
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                    {t('profile.language_region')}
                </h1>

                <div className="space-y-10">
                    {/* Language Section */}
                    <div className="p-6 border rounded-lg dark:border-gray-700">
                        <h2 className="text-lg font-semibold mb-4">{t('auth.select_language')}</h2>
                        
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder={t('language_settings.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon name="magnifying-glass" className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {filteredLanguages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.code as Language)}
                                    className={`w-full flex items-center p-3 rounded-lg text-left rtl:text-right transition-colors ${language === lang.code ? 'bg-indigo-50 dark:bg-indigo-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                                >
                                    <span className="text-2xl me-4">{lang.flag}</span>
                                    <span className="flex-1 font-medium text-gray-800 dark:text-gray-200">{lang.nativeName}</span>
                                    {language === lang.code && (
                                        <Icon name="check-badge" className="w-6 h-6 text-indigo-600" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Region Section */}
                    <div className="p-6 border rounded-lg dark:border-gray-700">
                        <CountrySwitcher />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LanguageSettings;