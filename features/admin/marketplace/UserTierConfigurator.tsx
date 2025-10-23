import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../../context/MarketplaceContext';
import { UserTier } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import Icon from '../../../components/Icon';

const UserTierConfigurator: React.FC = () => {
    const { userTiers, updateUserTiers } = useMarketplace();
    const { t } = useLocalization();
    const [editableTiers, setEditableTiers] = useState<UserTier[]>([]);

    useEffect(() => {
        // Deep copy to prevent direct mutation of context state
        setEditableTiers(JSON.parse(JSON.stringify(userTiers)));
    }, [userTiers]);

    const handleBenefitChange = (level: string, key: keyof UserTier['benefits'], value: number | boolean) => {
        setEditableTiers(prev => prev.map(tier => 
            tier.level === level
            ? { ...tier, benefits: { ...tier.benefits, [key]: value } }
            : tier
        ));
    };
    
    const handleRequirementChange = (level: string, key: keyof UserTier['requirements'], value: string) => {
        const numValue = Number(value);
        setEditableTiers(prev => prev.map(tier =>
            tier.level === level
            ? { ...tier, requirements: { ...tier.requirements, [key]: isNaN(numValue) ? 0 : numValue } }
            : tier
        ));
    };

    const handleSave = () => {
        updateUserTiers(editableTiers);
        alert(t('admin.user_tiers_updated_success'));
    };

    const handleNumberInputChange = (level: string, key: keyof UserTier['benefits'], value: string) => {
        const numValue = parseInt(value, 10);
        handleBenefitChange(level, key, isNaN(numValue) ? 0 : numValue);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('admin.user_tiers_config')}</h3>
            {editableTiers.map(tier => (
                <div key={tier.level} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-600">
                    <h4 className="text-lg font-semibold capitalize mb-4 text-indigo-600 dark:text-indigo-400">{tier.level}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Benefits Column */}
                        <div className="space-y-4">
                            <h5 className="font-medium">{t('admin.tier_benefits')}</h5>
                             <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-600 dark:text-gray-300">{t('admin.max_ads')}</label>
                                <input 
                                    type="number" 
                                    value={tier.benefits.maxAds}
                                    onChange={(e) => handleNumberInputChange(tier.level, 'maxAds', e.target.value)}
                                    className="w-24 p-1 rounded bg-white dark:bg-gray-800 border dark:border-gray-500 text-sm"
                                />
                            </div>
                             <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-600 dark:text-gray-300">{t('admin.image_slots')}</label>
                                <input 
                                    type="number" 
                                    value={tier.benefits.imageSlots}
                                    onChange={(e) => handleNumberInputChange(tier.level, 'imageSlots', e.target.value)}
                                    className="w-24 p-1 rounded bg-white dark:bg-gray-800 border dark:border-gray-500 text-sm"
                                />
                            </div>
                        </div>
                        {/* Requirements Column */}
                         <div className="space-y-4">
                            <h5 className="font-medium">{t('admin.tier_requirements')}</h5>
                             <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-600 dark:text-gray-300">{t('admin.min_transactions')}</label>
                                <input 
                                    type="number" 
                                    value={tier.requirements.minTransactions}
                                    onChange={(e) => handleRequirementChange(tier.level, 'minTransactions', e.target.value)}
                                    className="w-24 p-1 rounded bg-white dark:bg-gray-800 border dark:border-gray-500 text-sm"
                                />
                            </div>
                             <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-600 dark:text-gray-300">{t('admin.min_rating')}</label>
                                <input 
                                    type="number" 
                                    step="0.1"
                                    value={tier.requirements.minRating}
                                    onChange={(e) => handleRequirementChange(tier.level, 'minRating', e.target.value)}
                                    className="w-24 p-1 rounded bg-white dark:bg-gray-800 border dark:border-gray-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
             <div className="pt-4 flex justify-end">
                <button
                    onClick={handleSave}
                    className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    <Icon name="check-badge" className="w-5 h-5" />
                    <span>{t('admin.save_changes')}</span>
                </button>
            </div>
        </div>
    );
};

export default UserTierConfigurator;