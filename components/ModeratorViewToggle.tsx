import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMarketplaceUI } from '../context/MarketplaceUIContext';
import Icon from './Icon';

const ModeratorViewToggle: React.FC = () => {
    const { user } = useAuth();
    const { isModeratorView, toggleModeratorView } = useMarketplaceUI();

    if (!user?.isAdmin) {
        return null;
    }

    return (
        <button
            onClick={toggleModeratorView}
            title="Toggle Moderator View"
            className={`fixed top-5 right-5 z-50 p-3 rounded-full transition-all duration-300 shadow-lg group hover:scale-110
                ${isModeratorView ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200'}
            `}
        >
            <Icon name="moderator-view" className="w-6 h-6" />
        </button>
    );
};

export default ModeratorViewToggle;
