import React from 'react';
import { Ad, DisplayMode } from '../../../../types';
import AdCard from './AdCard';
import ListViewItem from '../browsing/ListViewItem';
import { useDisplayMode } from '../../../../hooks/useDisplayMode';

interface AdGridProps {
  ads: Ad[];
  displayMode: DisplayMode;
  onAdClick: (adId: string) => void;
}

const AdGrid: React.FC<AdGridProps> = ({ ads, displayMode, onAdClick }) => {
  const { currentDisplayConfig } = useDisplayMode();

  if (displayMode === 'list') {
    return (
      <div className="space-y-4">
        {ads.map(ad => (
          <ListViewItem key={ad.id} ad={ad} onExpandClick={() => onAdClick(ad.id)} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${currentDisplayConfig.gridClass}`}>
      {ads.map(ad => (
        <AdCard
          key={ad.id}
          ad={ad}
          displayMode={displayMode}
          onExpandClick={() => onAdClick(ad.id)}
        />
      ))}
    </div>
  );
};

export default AdGrid;
