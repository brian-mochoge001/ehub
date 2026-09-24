import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import { LocationCoordinates } from './useLocation';

/**
 * H3 Cell representation
 */
export interface H3Cell {
  h3_cell: string;
  latitude: number;
  longitude: number;
}

/**
 * ETA calculation result
 */
export interface ETAResult {
  duration_seconds: number;
  duration_minutes: number;
  start_h3_cell: string;
  end_h3_cell: string;
}

/**
 * H3 distance result
 */
export interface H3DistanceResult {
  cell1: string;
  cell2: string;
  distance: number; // Grid cells distance
}

/**
 * useSpatial hook
 * 
 * Provides location-based spatial operations:
 * - Convert coordinates to H3 cells
 * - Calculate grid distance between cells
 * - Get ETA between locations
 * - Support multi-region geo-partitioning
 * 
 * H3 Resolution 9 characteristics:
 * - ~0.1 km² cell area
 * - ~180m edge length
 * - Perfect for delivery zone boundaries
 * 
 * Usage:
 * ```ts
 * const {
 *   convertToH3,
 *   calculateH3Distance,
 *   calculateETA,
 *   isCalculating,
 *   error
 * } = useSpatial();
 * 
 * // Get H3 cell from coordinates
 * const userCell = await convertToH3(-1.2345, 36.7890);
 * const shopCell = await convertToH3(-1.2341, 36.7892);
 * 
 * // Check if shop is within delivery range (10 cells ~ 1-2 km)
 * const distance = await calculateH3Distance(shopCell.h3_cell, userCell.h3_cell);
 * if (distance <= 10) {
 *   console.log('Shop can deliver to this location');
 * }
 * 
 * // Get ETA from shop to user
 * const eta = await calculateETA(shopLocation, userLocation);
 * console.log(`Estimated delivery: ${eta.duration_minutes} minutes`);
 * ```
 */
export function useSpatial() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Convert coordinates to H3 cell string
   */
  const convertToH3 = useCallback(
    async (latitude: number, longitude: number): Promise<H3Cell | null> => {
      setIsCalculating(true);
      setError(null);

      try {
        // Note: In production, call your spatial handler endpoint
        // For now, this is a placeholder. Implement via:
        // GET /spatial/convert-to-h3?latitude=-1.2345&longitude=36.7890
        
        const response = await apiClient.get<H3Cell>('/spatial/convert-to-h3', {
          params: {
            latitude,
            longitude,
          },
        });

        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to convert to H3';
        setError(message);
        return null;
      } finally {
        setIsCalculating(false);
      }
    },
    []
  );

  /**
   * Calculate grid distance between two H3 cells
   * Returns number of hexagonal steps between cells
   */
  const calculateH3Distance = useCallback(
    async (cell1: string, cell2: string): Promise<number | null> => {
      setIsCalculating(true);
      setError(null);

      try {
        const response = await apiClient.get<H3DistanceResult>('/spatial/h3-distance', {
          params: {
            cell1,
            cell2,
          },
        });

        return response.distance;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to calculate H3 distance';
        setError(message);
        return null;
      } finally {
        setIsCalculating(false);
      }
    },
    []
  );

  /**
   * Calculate ETA between two locations
   * Uses OSRM service for routing
   */
  const calculateETA = useCallback(
    async (startLoc: LocationCoordinates, endLoc: LocationCoordinates): Promise<ETAResult | null> => {
      setIsCalculating(true);
      setError(null);

      try {
        const response = await apiClient.post<ETAResult>('/spatial/calculate-eta', {
          start_latitude: startLoc.latitude,
          start_longitude: startLoc.longitude,
          end_latitude: endLoc.latitude,
          end_longitude: endLoc.longitude,
        });

        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to calculate ETA';
        setError(message);
        return null;
      } finally {
        setIsCalculating(false);
      }
    },
    []
  );

  /**
   * Get the center coordinates of an H3 cell
   */
  const getCellCenter = useCallback(
    async (h3Cell: string): Promise<LocationCoordinates | null> => {
      setIsCalculating(true);
      setError(null);

      try {
        const response = await apiClient.get<{ h3_cell: string; latitude: number; longitude: number }>(
          '/spatial/cell-center',
          {
            params: { cell: h3Cell },
          }
        );

        return {
          latitude: response.latitude,
          longitude: response.longitude,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to get cell center';
        setError(message);
        return null;
      } finally {
        setIsCalculating(false);
      }
    },
    []
  );

  /**
   * Complete location-based geofencing check:
   * 1. Convert both locations to H3
   * 2. Calculate distance
   * 3. Return if within range
   */
  const isWithinServiceArea = useCallback(
    async (
      sourceLoc: LocationCoordinates,
      targetLoc: LocationCoordinates,
      maxGridDistance: number = 10
    ): Promise<boolean> => {
      try {
        // Get H3 cells
        const sourceCell = await convertToH3(sourceLoc.latitude, sourceLoc.longitude);
        const targetCell = await convertToH3(targetLoc.latitude, targetLoc.longitude);

        if (!sourceCell || !targetCell) {
          return false;
        }

        // Calculate distance
        const distance = await calculateH3Distance(sourceCell.h3_cell, targetCell.h3_cell);

        if (distance === null) {
          return false;
        }

        return distance <= maxGridDistance;
      } catch (err) {
        console.error('isWithinServiceArea error:', err);
        return false;
      }
    },
    [convertToH3, calculateH3Distance]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    convertToH3,
    calculateH3Distance,
    calculateETA,
    getCellCenter,
    isWithinServiceArea,
    isCalculating,
    error,
    clearError,
  };
}
