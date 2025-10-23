import React from 'react';
import { useView } from '../../App';
import { useLocalization } from '../../hooks/useLocalization';
import AdCreationWizard from './components/ads/AdCreationWizard';

const CreateAdPage: React.FC = () => {
    const { setView } = useView();
    const { t } = useLocalization();
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
             <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('ad.create.title')}</h1>
                <AdCreationWizard 
                    onAdCreated={(adId) => setView({ type: 'marketplace' })} 
                    onCancel={() => setView({ type: 'marketplace' })} 
                />
            </div>
        </div>
    );
};

export default CreateAdPage;