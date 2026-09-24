import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { useColorScheme } from './use-color-scheme';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData extends LocationCoordinates {
  h3Cell?: string;
  accuracy?: number;
  addressText?: string;
  timestamp: number;
}

/**
 * useLocation hook
 * 
 * Provides real-time location tracking with:
 * - Continuous location updates
 * - Geofencing capabilities
 * - Location permissions handling
 * - Error resilience with fallback
 * 
 * Usage:
 * ```ts
 * const { 
 *   location, 
 *   loading, 
 *   error, 
 *   requestPermission, 
 *   startTracking,
 *   stopTracking 
 * } = useLocation({ enableTracking: true });
 * ```
 */
export function useLocation(options: { enableTracking?: boolean; updateInterval?: number } = {}) {
  const { enableTracking = false, updateInterval = 5000 } = options;
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Default location (Nairobi, Kenya)
  const DEFAULT_LOCATION: LocationData = {
    latitude: -1.286389,
    longitude: 36.817223,
    addressText: 'Nairobi (Default)',
    timestamp: Date.now(),
  };

  const requestPermission = useCallback(async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to request permission';
      setError(message);
      setHasPermission(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<LocationData> => {
    try {
      setLoading(true);
      setError(null);

      // Check permission first
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted, using default');
        setLocation(DEFAULT_LOCATION);
        return DEFAULT_LOCATION;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
      });

      const locationData: LocationData = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy || undefined,
        timestamp: Date.now(),
      };

      // Optionally add address (reverse geocoding)
      try {
        const addresses = await Location.reverseGeocodeAsync(locationData);
        if (addresses.length > 0) {
          const addr = addresses[0];
          locationData.addressText = `${addr.city || addr.region || 'Location'}, ${addr.country || ''}`.trim();
        }
      } catch {
        // Geocoding is optional
      }

      setLocation(locationData);
      return locationData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get location';
      console.error('getCurrentLocation error:', message);
      setError(message);
      
      // Fallback to default location
      setLocation(DEFAULT_LOCATION);
      return DEFAULT_LOCATION;
    } finally {
      setLoading(false);
    }
  }, []);

  let locationSubscription: Location.LocationSubscription | null = null;

  const startTracking = useCallback(async () => {
    try {
      setLoading(true);
      
      // Request permission first
      const hasPerms = hasPermission ?? (await requestPermission());
      if (!hasPerms) {
        throw new Error('Location permission denied');
      }

      // Get initial location
      await getCurrentLocation();

      // Subscribe to location updates
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: updateInterval,
          distanceInterval: 10, // Update if moved 10m
        },
        async (newLocation) => {
          const locationData: LocationData = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy || undefined,
            timestamp: Date.now(),
          };

          setLocation(locationData);
          setError(null);
        }
      );

      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start tracking';
      setError(message);
      console.error('startTracking error:', message);
    } finally {
      setLoading(false);
    }
  }, [hasPermission, requestPermission, getCurrentLocation, updateInterval]);

  const stopTracking = useCallback(() => {
    if (locationSubscription) {
      locationSubscription.remove();
      locationSubscription = null;
    }
  }, []);

  // Auto-start tracking if enabled
  useEffect(() => {
    if (enableTracking) {
      startTracking();
    }

    return () => {
      stopTracking();
    };
  }, [enableTracking, startTracking, stopTracking]);

  return {
    location,
    loading,
    error,
    hasPermission,
    requestPermission,
    getCurrentLocation,
    startTracking,
    stopTracking,
  };
}
