import { useMemo } from 'react';
import { Ad, SortOption } from '../types';

/**
 * Calculates the Haversine distance between two points on the Earth.
 * @returns The distance in kilometers.
 */
const haversineDistance = (
  coords1: { lat: number; lng: number },
  coords2: { lat: number; lng: number }
): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};


export const useSorting = (ads: Ad[], sortBy: SortOption, userLocation: { lat: number, lng: number } | null): Ad[] => {
  return useMemo(() => {
    const sortedAds = [...ads];
    
    // If 'nearby-first' is selected but location is unavailable, fall back to sorting by newest.
    // The UI should ideally prevent this, but this makes the logic robust.
    const effectiveSortBy = (sortBy === 'nearby-first' && !userLocation)
      ? 'date-new-old'
      : sortBy;

    sortedAds.sort((a, b) => {
      switch (effectiveSortBy) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'date-new-old':
          return new Date(b.stats.createdAt).getTime() - new Date(a.stats.createdAt).getTime();
        case 'date-old-new':
            return new Date(a.stats.createdAt).getTime() - new Date(b.stats.createdAt).getTime();
        case 'rating-high-low':
             // Sort by rating, then by review count
            if (b.seller.rating !== a.seller.rating) {
                return b.seller.rating - a.seller.rating;
            }
            return b.seller.reviewCount - a.seller.reviewCount;
        case 'rating-low-high':
            if (a.seller.rating !== b.seller.rating) {
                return a.seller.rating - b.seller.rating;
            }
            return a.seller.reviewCount - b.seller.reviewCount;
        case 'most-liked':
          return b.stats.likes - a.stats.likes;
        case 'most-viewed':
            return b.stats.views - a.stats.views;
        case 'verified-first':
            if (a.seller.isVerified && !b.seller.isVerified) return -1;
            if (!a.seller.isVerified && b.seller.isVerified) return 1;
            // secondary sort by newest
            return new Date(b.stats.createdAt).getTime() - new Date(a.stats.createdAt).getTime();
        case 'nearby-first':
            // Due to effectiveSortBy, userLocation is guaranteed to be non-null here.
            const aHasCoords = a.location.coordinates;
            const bHasCoords = b.location.coordinates;

            if (aHasCoords && !bHasCoords) return -1; // Ads with location data come first.
            if (!aHasCoords && bHasCoords) return 1;
            if (!aHasCoords && !bHasCoords) return 0; // If neither has coords, keep relative order.
            
            const distA = haversineDistance(userLocation!, a.location.coordinates!);
            const distB = haversineDistance(userLocation!, b.location.coordinates!);
            return distA - distB;
        default:
          return 0;
      }
    });

    return sortedAds;
  }, [ads, sortBy, userLocation]);
};