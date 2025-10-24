import React, { useState } from 'react';
import Pagination from '../../components/Pagination';
import { useSorting } from '../../hooks/useSorting';
import AdGrid from './components/ads/AdGrid';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useMarketplaceUI } from '../../context/MarketplaceUIContext';
import { useView } from '../../App';

const ADS_PER_PAGE = 12;

const MarketplacePage: React.FC = () => {
    const { filteredAds, displayMode, sortBy } = useMarketplaceUI();
    const [currentPage, setCurrentPage] = useState(1);
    const { location: userLocation } = useGeolocation();
    // FIX: Use the global view context to determine if a specific ad should be expanded on load.
    const { view } = useView();
    const [expandedAdId, setExpandedAdId] = useState<string | null>(
      view.type === 'ad' ? view.id : null
    );
    
    const sortedAds = useSorting(filteredAds, sortBy, userLocation);

    const totalPages = Math.ceil(sortedAds.length / ADS_PER_PAGE);
    const paginatedAds = sortedAds.slice((currentPage - 1) * ADS_PER_PAGE, currentPage * ADS_PER_PAGE);

    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-8">
            <div className="mt-8 lg:mt-0">
                {paginatedAds.length > 0 ? (
                    <>
                        <AdGrid
                            ads={paginatedAds}
                            displayMode={displayMode}
                            expandedAdId={expandedAdId}
                            setExpandedAdId={setExpandedAdId}
                        />
                        <div className="mt-8">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No results found</h2>
                        <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketplacePage;