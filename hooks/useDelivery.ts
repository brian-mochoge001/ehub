import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import { LocationCoordinates } from './useLocation';

/**
 * DeliveryEstimate from backend
 * Includes fee, ETA, and distance information
 */
export interface DeliveryEstimate {
  delivery_fee: number;
  estimated_minutes: number;
  distance_km: number;
}

/**
 * Delivery area validation response
 */
export interface DeliveryAreaValidation {
  valid: boolean;
  shop_h3_cell?: string;
  user_h3_cell?: string;
  message?: string;
}

/**
 * useDelivery hook
 * 
 * Provides delivery service integration:
 * - Validate delivery area (fail-fast check)
 * - Calculate dynamic delivery fees
 * - Estimate delivery times
 * 
 * Usage:
 * ```ts
 * const {
 *   validateDeliveryArea,
 *   calculateDeliveryFee,
 *   isValidating,
 *   error
 * } = useDelivery();
 * 
 * const result = await validateDeliveryArea(shopLoc, userLoc);
 * if (!result.valid) {
 *   showError('Shop cannot deliver to your location');
 *   return;
 * }
 * 
 * const estimate = await calculateDeliveryFee(shopLoc, userLoc);
 * showDeliveryFee(estimate.delivery_fee, estimate.estimated_minutes);
 * ```
 */
export function useDelivery() {
  const [isValidating, setIsValidating] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Validate if a shop can deliver to user's location
   * Uses H3 grid distance for instant validation (fail-fast)
   */
  const validateDeliveryArea = useCallback(
    async (
      shopLocation: LocationCoordinates,
      userLocation: LocationCoordinates,
      maxDistance: number = 10 // H3 grid cells (default ~1-2 km)
    ): Promise<DeliveryAreaValidation> => {
      setIsValidating(true);
      setError(null);

      try {
        const response = await apiClient.post<DeliveryAreaValidation>(
          '/orders/validate-delivery',
          {
            shop_latitude: shopLocation.latitude,
            shop_longitude: shopLocation.longitude,
            user_latitude: userLocation.latitude,
            user_longitude: userLocation.longitude,
            max_distance: maxDistance,
          }
        );

        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to validate delivery area';
        setError(message);
        
        // Default to invalid if validation fails
        return {
          valid: false,
          message: message,
        };
      } finally {
        setIsValidating(false);
      }
    },
    []
  );

  /**
   * Calculate dynamic delivery fee based on actual distance
   * Uses Haversine distance + tiered pricing model
   */
  const calculateDeliveryFee = useCallback(
    async (
      shopLocation: LocationCoordinates,
      userLocation: LocationCoordinates
    ): Promise<DeliveryEstimate | null> => {
      setIsCalculating(true);
      setError(null);

      try {
        const response = await apiClient.post<DeliveryEstimate>(
          '/orders/calculate-fee',
          {
            shop_latitude: shopLocation.latitude,
            shop_longitude: shopLocation.longitude,
            user_latitude: userLocation.latitude,
            user_longitude: userLocation.longitude,
          }
        );

        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to calculate delivery fee';
        setError(message);
        return null;
      } finally {
        setIsCalculating(false);
      }
    },
    []
  );

  /**
   * Full delivery checkout flow:
   * 1. Validate area (fail-fast)
   * 2. Calculate fee (if valid)
   * 3. Return complete delivery info
   */
  const validateAndCalculate = useCallback(
    async (
      shopLocation: LocationCoordinates,
      userLocation: LocationCoordinates,
      maxDistance?: number
    ): Promise<{
      valid: boolean;
      estimate?: DeliveryEstimate;
      error?: string;
    }> => {
      // Step 1: Validate area
      const validation = await validateDeliveryArea(shopLocation, userLocation, maxDistance);

      if (!validation.valid) {
        return {
          valid: false,
          error: validation.message || 'Shop cannot deliver to this location',
        };
      }

      // Step 2: Calculate fee
      const estimate = await calculateDeliveryFee(shopLocation, userLocation);

      if (!estimate) {
        return {
          valid: false,
          error: error || 'Failed to calculate delivery fee',
        };
      }

      return {
        valid: true,
        estimate,
      };
    },
    [validateDeliveryArea, calculateDeliveryFee, error]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    validateDeliveryArea,
    calculateDeliveryFee,
    validateAndCalculate,
    isValidating,
    isCalculating,
    isLoading: isValidating || isCalculating,
    error,
    clearError,
  };
}
