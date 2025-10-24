import { useState, useEffect } from 'react';

interface LocationState {
  lat: number;
  lng: number;
  city?: string;
  country?: string;
}

interface GeolocationHookResult {
  location: LocationState | null;
  loading: boolean;
  error: GeolocationPositionError | Error | null;
}

/**
 * Gets location from the browser's Geolocation API, wrapped in a Promise for async/await.
 * @param options - Geolocation API options.
 * @returns A promise that resolves with the GeolocationPosition.
 */
const getBrowserLocation = (options: PositionOptions): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject(new Error('Geolocation is not supported by your browser.'));
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
};

/**
 * Gets an approximate location based on the user's IP address.
 * @returns A promise that resolves with the latitude, longitude, city, and country.
 */
const getIpLocation = async (): Promise<LocationState> => {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
        throw new Error('IP-based location fetch failed.');
    }
    const data = await response.json();
    if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
        throw new Error('Invalid location data from IP API.');
    }
    return { lat: data.latitude, lng: data.longitude, city: data.city, country: data.country_name };
};

/**
 * A robust geolocation hook that first tries for high-accuracy GPS/Wi-Fi location
 * and falls back to a lower-accuracy IP-based location if the first attempt fails.
 * It also performs reverse geocoding for browser-based locations.
 */
export const useGeolocation = (): GeolocationHookResult => {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<GeolocationPositionError | Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEnhancedLocation = async () => {
        // 1. Try high-accuracy browser geolocation first.
        try {
            const position = await getBrowserLocation({
                enableHighAccuracy: true,
                timeout: 10000, // 10-second timeout
                maximumAge: 600000 // Cache for 10 minutes
            });

            if (!isMounted) return;

            const { latitude, longitude } = position.coords;
            
            // 2. Reverse geocode the coordinates using Nominatim
            try {
                const reverseGeoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`;
                const response = await fetch(reverseGeoUrl);
                const data = await response.json();

                if (isMounted) {
                    const city = data.address.city || data.address.town || data.address.village;
                    const country = data.address.country;
                    setLocation({ lat: latitude, lng: longitude, city, country });
                }
            } catch (reverseGeocodeError) {
                console.warn('Reverse geocoding failed, using coordinates only.', reverseGeocodeError);
                if (isMounted) {
                     setLocation({ lat: latitude, lng: longitude });
                }
            }

            if (isMounted) setLoading(false);
            return; // Success, no need for fallback.

        } catch (browserError) {
            console.warn('High-accuracy geolocation failed, falling back to IP-based location.', browserError);
            
            // 3. Fallback to IP-based location.
            try {
                const ipLocation = await getIpLocation();
                 if (isMounted) {
                    setLocation(ipLocation);
                 }
            } catch (ipError) {
                console.error('IP-based geolocation also failed.', ipError);
                 if (isMounted) {
                    // Set the original, more informative browser error if available
                    setError(browserError instanceof Error ? browserError : (ipError as Error));
                 }
            } finally {
                if(isMounted) setLoading(false);
            }
        }
    };

    fetchEnhancedLocation();

    return () => {
      isMounted = false; // Cleanup to prevent state updates on unmounted component
    };
  }, []);

  return { location, loading, error };
};
