import React from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import Icon from './Icon';
import LoadingSpinner from './LoadingSpinner';

const LocationDisplay: React.FC = () => {
    const { location, loading, error } = useGeolocation();

    const containerClasses = "flex items-center gap-1.5 py-1";

    if (loading) {
        return (
            <div className={containerClasses}>
                <LoadingSpinner size="sm" />
            </div>
        );
    }

    if (error || !location) {
        return (
            <div className={containerClasses} title={error?.message || 'Location not available'}>
                <Icon name="map-pin" className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-red-600 dark:text-red-400">Not Available</span>
            </div>
        );
    }

    const displayText = location.city && location.country 
        ? `${location.city}, ${location.country}`
        : 'Location detected';

    return (
        <div className={containerClasses}>
            <Icon name="map-pin" className="w-5 h-5 text-indigo-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{displayText}</span>
        </div>
    );
};

export default LocationDisplay;