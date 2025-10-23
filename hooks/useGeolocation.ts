import { useState, useEffect } from 'react';

interface LocationState {
  lat: number;
  lng: number;
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
 * @returns A promise that resolves with the latitude and longitude.
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
    return { lat: data.latitude, lng: data.longitude };
};

/**
 * A robust geolocation hook that first tries for high-accuracy GPS/Wi-Fi location
 * and falls back to a lower-accuracy IP-based location if the first attempt fails.
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
            if (isMounted) {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLoading(false);
            }
            return; // Success, no need for fallback.
        } catch (browserError) {
            console.warn('High-accuracy geolocation failed, falling back to IP-based location.', browserError);
            
            // 2. Fallback to IP-based location.
            try {
                const ipLocation = await getIpLocation();
                 if (isMounted) {
                    setLocation(ipLocation);
                    setLoading(false);
                 }
            } catch (ipError) {
                console.error('IP-based geolocation also failed.', ipError);
                 if (isMounted) {
                    // Set the original, more informative browser error if available
                    setError(browserError instanceof Error ? browserError : (ipError as Error));
                    setLoading(false);
                 }
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
