import React from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import Icon from '../../../../components/Icon';

const TrustActionButton: React.FC<{ icon: React.ComponentProps<typeof Icon>['name'], label: string }> = ({ icon, label }) => (
    <button 
        onClick={() => alert(`${label} feature coming soon!`)}
        className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
        <Icon name={icon} className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        <div>
            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{label}</p>
        </div>
    </button>
);

const TrustAndSafety: React.FC = () => {
    const { t } = useLocalization();
    
    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">{t('trust.title')}</h3>
            <div className="space-y-3">
                <TrustActionButton icon="shield-check" label={t('trust.identityVerification')} />
                <TrustActionButton icon="users" label={t('trust.communityWarranty')} />
                <TrustActionButton icon="gavel" label={t('trust.disputeArbitration')} />
                <TrustActionButton icon="shield-check" label={t('trust.purchaseInsurance')} />
            </div>
        </div>
    );
}

export default TrustAndSafety;
