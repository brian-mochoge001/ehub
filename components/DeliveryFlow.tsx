import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { MapPin, AlertCircle, Check } from 'lucide-react-native';
import { useLocation, LocationCoordinates } from '../hooks/useLocation';
import { useDelivery } from '../hooks/useDelivery';
import { DeliveryEstimate } from '../services/ecommerceClient';

/**
 * DeliveryFlow Component
 * 
 * Manages the complete delivery checkout flow:
 * 1. Get user's location
 * 2. Validate delivery area (fail-fast)
 * 3. Calculate dynamic fee
 * 4. Display delivery info
 * 
 * Usage:
 * ```tsx
 * <DeliveryFlow
 *   shopLocation={{ latitude: -1.2341, longitude: 36.7892 }}
 *   onSuccess={(estimate) => {
 *     console.log('Delivery validated:', estimate);
 *     proceedToCheckout(estimate);
 *   }}
 *   onError={(error) => {
 *     Alert.alert('Delivery Error', error);
 *   }}
 * />
 * ```
 */

export interface DeliveryFlowProps {
  shopLocation: LocationCoordinates;
  maxDeliveryDistance?: number; // H3 grid cells
  onSuccess?: (estimate: DeliveryEstimate) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  showEstimate?: boolean; // Show fee before confirm
}

export function DeliveryFlow({
  shopLocation,
  maxDeliveryDistance = 10,
  onSuccess,
  onError,
  onCancel,
  showEstimate = true,
}: DeliveryFlowProps) {
  const { location: userLocation, loading: locationLoading, error: locationError } = useLocation();
  const {
    validateDeliveryArea,
    calculateDeliveryFee,
    isValidating,
    isCalculating,
    error: deliveryError,
  } = useDelivery();

  const [step, setStep] = useState<'location' | 'validating' | 'calculating' | 'result'>('location');
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryEstimate | null>(null);
  const [isOutOfArea, setIsOutOfArea] = useState(false);

  // Get user location on mount
  useEffect(() => {
    if (!userLocation && !locationLoading && !locationError) {
      // Location should be initialized by now
    }
  }, [userLocation, locationLoading, locationError]);

  const handleValidateDelivery = async () => {
    if (!userLocation) {
      onError?.('Could not get your location');
      return;
    }

    setStep('validating');

    // Step 1: Validate area (fail-fast)
    const validation = await validateDeliveryArea(shopLocation, userLocation, maxDeliveryDistance);

    if (!validation.valid) {
      setIsOutOfArea(true);
      setStep('result');
      onError?.(validation.message || 'Shop cannot deliver to your location');
      return;
    }

    // Step 2: Calculate fee
    setStep('calculating');
    const estimate = await calculateDeliveryFee(shopLocation, userLocation);

    if (!estimate) {
      setStep('result');
      onError?.(deliveryError || 'Failed to calculate delivery fee');
      return;
    }

    setDeliveryInfo(estimate);
    setStep('result');
  };

  const handleConfirm = () => {
    if (deliveryInfo) {
      onSuccess?.(deliveryInfo);
    }
  };

  const handleRetry = () => {
    setStep('location');
    setDeliveryInfo(null);
    setIsOutOfArea(false);
  };

  // Location loading state
  if (locationLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#673AB7" />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </View>
    );
  }

  // Location error state
  if (locationError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorCard}>
          <AlertCircle size={32} color="#FF5252" />
          <Text style={styles.errorTitle}>Location Error</Text>
          <Text style={styles.errorMessage}>{locationError}</Text>
          <TouchableOpacity style={styles.button} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Validating state
  if (step === 'validating' || step === 'calculating') {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#673AB7" />
          <Text style={styles.loadingText}>
            {step === 'validating' ? 'Checking delivery area...' : 'Calculating delivery fee...'}
          </Text>
        </View>
      </View>
    );
  }

  // Result state (after validation & calculation)
  if (step === 'result') {
    if (isOutOfArea) {
      return (
        <View style={styles.container}>
          <View style={styles.errorCard}>
            <AlertCircle size={32} color="#FF5252" />
            <Text style={styles.errorTitle}>Outside Delivery Area</Text>
            <Text style={styles.errorMessage}>
              The shop cannot deliver to your location. Please try another shop.
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleRetry}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onCancel}>
              <Text style={styles.buttonTextSecondary}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (!deliveryInfo) {
      return (
        <View style={styles.container}>
          <View style={styles.errorCard}>
            <AlertCircle size={32} color="#FF5252" />
            <Text style={styles.errorTitle}>Delivery Error</Text>
            <Text style={styles.errorMessage}>
              {deliveryError || 'An error occurred during delivery validation'}
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleRetry}>
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Success state - show delivery info
    return (
      <View style={styles.container}>
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <Check size={32} color="#4CAF50" />
          </View>
          <Text style={styles.successTitle}>Delivery Available!</Text>

          {showEstimate && (
            <>
              <View style={styles.estimateRow}>
                <Text style={styles.label}>Delivery Fee</Text>
                <Text style={styles.value}>KES {deliveryInfo.delivery_fee.toFixed(0)}</Text>
              </View>
              <View style={styles.estimateRow}>
                <Text style={styles.label}>Estimated Time</Text>
                <Text style={styles.value}>{deliveryInfo.estimated_minutes} minutes</Text>
              </View>
              <View style={styles.estimateRow}>
                <Text style={styles.label}>Distance</Text>
                <Text style={styles.value}>{deliveryInfo.distance_km.toFixed(1)} km</Text>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Confirm Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleRetry}>
            <Text style={styles.buttonTextSecondary}>Change Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Initial state - location found, ready to validate
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.locationInfo}>
          <MapPin size={24} color="#673AB7" />
          <View style={styles.locationText}>
            <Text style={styles.label}>Delivery to</Text>
            <Text style={styles.address}>{userLocation?.addressText || 'Your location'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.infoText}>
          We'll verify if delivery is available to your area and calculate the delivery fee.
        </Text>

        <TouchableOpacity 
          style={[styles.button, (isValidating || isCalculating) && styles.buttonDisabled]}
          onPress={handleValidateDelivery}
          disabled={isValidating || isCalculating}
        >
          {(isValidating || isCalculating) ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Check Delivery</Text>
          )}
        </TouchableOpacity>

        {onCancel && (
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onCancel}>
            <Text style={styles.buttonTextSecondary}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = {
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerContent: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 32,
  },
  locationInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  locationText: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#673AB7',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonTextSecondary: {
    color: '#673AB7',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  errorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center' as const,
    marginBottom: 20,
    lineHeight: 20,
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    alignSelf: 'center' as const,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#333',
    textAlign: 'center' as const,
    marginBottom: 20,
  },
  estimateRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  value: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#673AB7',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
};
