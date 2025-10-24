import React from 'react';
import { Ad, DisplayMode } from '../../../../types';
import AdCard from './AdCard';
import ListViewItem from '../browsing/ListViewItem';
import { useDisplayMode } from '../../../../hooks/useDisplayMode';
import ExpandedAdView from './ExpandedAdView';

interface AdGridProps {
  ads: Ad[];
  displayMode: DisplayMode;
  expandedAdId: string | null;
  // FIX: Corrected the type to match the dispatch function from useState.
  setExpandedAdId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AdGrid: React.FC<AdGridProps> = ({ ads, displayMode, expandedAdId, setExpandedAdId }) => {
  const { currentDisplayConfig } = useDisplayMode();

  const handleAdClick = (adId: string) => {
    setExpandedAdId(currentId => currentId === adId ? null : adId);
  }

  if (displayMode === 'list') {
    return (
      <div className="space-y-4">
        {ads.map(ad => (
            <React.Fragment key={ad.id}>
                <ListViewItem ad={ad} onExpandClick={() => handleAdClick(ad.id)} />
                 {expandedAdId === ad.id && (
                    <div className="animate-slide-down-fast">
                        <ExpandedAdView ad={ad} onClose={() => setExpandedAdId(null)} />
                    </div>
                )}
            </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${currentDisplayConfig.gridClass}`}>
      {ads.map(ad => (
        <React.Fragment key={ad.id}>
            <AdCard
              ad={ad}
              displayMode={displayMode}
              onExpandClick={() => handleAdClick(ad.id)}
              isExpanded={expandedAdId === ad.id}
            />
            {expandedAdId === ad.id && (
                <div className="col-span-full animate-slide-down-fast">
                    <ExpandedAdView ad={ad} onClose={() => setExpandedAdId(null)} />
                </div>
            )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default AdGrid;