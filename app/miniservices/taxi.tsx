import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { ArrowLeft, X } from 'lucide-react-native';
import { ThemedText } from '@packages/components/themed-text';
import { ThemedView } from '@packages/components/themed-view';
import TaxiMap from '@packages/components/TaxiMap';
import { useService } from '@packages/hooks/useService';
import { useRouter } from 'expo-router';
import { Colors } from '@packages/constants/theme';
import { useColorScheme } from '@packages/hooks/use-color-scheme';
import { useLocation } from '@packages/hooks/useLocation';
import { useSpatial } from '@packages/hooks/useSpatial';
import { api } from '@packages/services/api';

const FALLBACK_LOCATIONS = [
  { addressText: 'Nairobi CBD', latitude: -1.286389, longitude: 36.817223 },
  { addressText: 'Westlands', latitude: -1.2634, longitude: 36.8025 },
  { addressText: 'Kilimani', latitude: -1.2908, longitude: 36.7825 },
  { addressText: 'Karen', latitude: -1.3341, longitude: 36.7058 },
  { addressText: 'Juja', latitude: -1.1824, longitude: 37.0148 },
];

export default function TaxiScreen() {
  const { data: driversData } = useService<any[] | null>('taxi', {
    staleTime: 5000,
  });
  const { location: userLocation, getCurrentLocation, loading: locationLoading, error: locationError } = useLocation({
    enableTracking: true,
    updateInterval: 5000,
  });
  const { calculateETA, isWithinServiceArea } = useSpatial();

  const [nearbyDrivers, setNearbyDrivers] = useState<any[]>([]);
  const [driverId, setDriverId] = useState<string | undefined>(undefined);
  const [searchPhase, setSearchPhase] = useState<'vehicle_selection' | 'driver_searching' | 'tracking'>('vehicle_selection');
  const [selectedMode, setSelectedMode] = useState<'taxi' | 'motorbike'>('taxi');
  const [pickupLocation, setPickupLocation] = useState<{ latitude: number; longitude: number; addressText: string } | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<{ addressText: string; latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [destinationSearchInput, setDestinationSearchInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [encodedPolyline, setEncodedPolyline] = useState<string | undefined>(undefined);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;
  const router = useRouter();

  const normalizeNearbyDrivers = useCallback((drivers: any[]) => {
    return (drivers || [])
      .map((entry: any) => {
        const driver = entry?.driver ?? entry;
        if (!driver || !driver.id) return null;
        const latitude = Number(driver.latitude ?? driver.lat ?? driver.last_location?.latitude ?? driver.last_location?.lat);
        const longitude = Number(driver.longitude ?? driver.lng ?? driver.last_location?.longitude ?? driver.last_location?.lng);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
        return { ...driver, latitude, longitude, eta_minutes: entry?.eta_minutes ?? driver?.eta_minutes ?? null };
      })
      .filter(Boolean);
  }, []);

  useEffect(() => {
    setNearbyDrivers(normalizeNearbyDrivers(driversData ?? []));
  }, [driversData, normalizeNearbyDrivers]);

  const fetchNearby = useCallback(async (latitude: number, longitude: number) => {
    try {
      const drivers = await api.getNearbyDrivers(longitude, latitude, 5, 5000);
      setNearbyDrivers(normalizeNearbyDrivers(drivers));
    } catch (err) {
      console.error('Failed to fetch nearby drivers:', err);
      setNearbyDrivers([]);
    }
  }, [normalizeNearbyDrivers]);

  useEffect(() => {
    const initializeTaxi = async () => {
      try {
        setLoading(true);

        let nextPickup = {
          latitude: -1.286389,
          longitude: 36.817223,
          addressText: 'Nairobi (Default)',
        };

        if (userLocation) {
          nextPickup = {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            addressText: userLocation.addressText || 'Current location',
          };
        } else {
          const pos = await getCurrentLocation();
          nextPickup = {
            latitude: pos.latitude,
            longitude: pos.longitude,
            addressText: pos.addressText || 'Current location',
          };
        }

        setPickupLocation(nextPickup);
        await fetchNearby(nextPickup.latitude, nextPickup.longitude);
      } catch (err) {
        console.error('Error getting location:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!locationLoading || userLocation) {
      initializeTaxi();
    }
  }, [userLocation, getCurrentLocation, fetchNearby, locationLoading]);

  const fetchSuggestions = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setFilteredSuggestions([]);
      return;
    }

    const normalized = query.toLowerCase();
    const filtered = FALLBACK_LOCATIONS.filter((location) =>
      location.addressText.toLowerCase().includes(normalized)
    );

    setFilteredSuggestions(filtered.length > 0 ? filtered : FALLBACK_LOCATIONS.slice(0, 3));
  };

  const handleSearchForDriver = async () => {
    if (!destinationLocation || !pickupLocation) return;
    if (nearbyDrivers.length === 0) {
      Alert.alert('No drivers available', 'There are no drivers online in your area right now.');
      return;
    }

    setSearchPhase('driver_searching');

    try {
      const eta = await calculateETA(pickupLocation, destinationLocation);
      if (eta) {
        setEtaMinutes(Math.max(1, Math.ceil(eta.duration_minutes)));
      }

      const response = await api.createTaxiTrip({
        pickup_lng: pickupLocation.longitude,
        pickup_lat: pickupLocation.latitude,
        dropoff_lng: destinationLocation.longitude,
        dropoff_lat: destinationLocation.latitude,
        amount: 500.0,
        vehicle_type: selectedMode,
      });

      if (response?.polyline) {
        setEncodedPolyline(response.polyline);
      }

      const bestDriver = nearbyDrivers[0];
      const inArea = await isWithinServiceArea(
        { latitude: pickupLocation.latitude, longitude: pickupLocation.longitude },
        { latitude: bestDriver.latitude, longitude: bestDriver.longitude },
        10
      );

      setTimeout(() => {
        if (bestDriver && inArea) {
          setDriverId(bestDriver.id);
          setSearchPhase('tracking');
        } else {
          Alert.alert('No matching driver', 'There is no nearby driver in your service area right now.');
          setSearchPhase('vehicle_selection');
        }
      }, 2000);
    } catch (err) {
      console.error(err);
      setSearchPhase('vehicle_selection');
    }
  };

  if (loading || locationLoading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={activeColor} />
      </ThemedView>
    );
  }

  if (locationError) {
    console.warn(locationError);
  }

  const currentDriver = nearbyDrivers.find((d) => d.id === driverId);
  const hasNearbyDrivers = nearbyDrivers.length > 0;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.mapBackground}>
        {pickupLocation && (
          <TaxiMap
            driverId={driverId}
            showNearby={searchPhase !== 'tracking'}
            userLocation={pickupLocation}
            driverMode={selectedMode}
            encodedPolyline={encodedPolyline}
          />
        )}
      </View>

      <View style={styles.floatingHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <View style={[styles.headerCenter, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
          <View style={styles.dot} />
          <TextInput
            style={[styles.destinationTextInput, { color: Colors[colorScheme].text }]}
            placeholder={destinationLocation ? destinationLocation.addressText : 'Where to?'}
            value={destinationSearchInput}
            onChangeText={(text) => {
              setDestinationSearchInput(text);
              fetchSuggestions(text);
              setShowSuggestions(text.trim() !== '');
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setDestinationLocation(null);
            setDestinationSearchInput('');
            setShowSuggestions(false);
          }}
        >
          <X size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <View style={[styles.suggestionsContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
          {filteredSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={`${suggestion.addressText}-${index}`}
              style={styles.suggestionItem}
              onPress={() => {
                setDestinationLocation(suggestion);
                setDestinationSearchInput(suggestion.addressText);
                setShowSuggestions(false);
              }}
            >
              <ThemedText style={styles.suggestionText}>{suggestion.addressText}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={[styles.bottomSheet, { backgroundColor: colorScheme === 'light' ? '#fff' : '#1a1a1a' }]}>
        <View style={styles.handle} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modeSwitchRow}>
          {(['taxi', 'motorbike'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[styles.modeSwitchButton, selectedMode === mode ? styles.modeSwitchButtonActive : null]}
              onPress={() => setSelectedMode(mode)}
            >
              <ThemedText style={[styles.modeSwitchText, selectedMode === mode ? styles.modeSwitchTextActive : null]}>
                {mode.replace('-', ' ')}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {searchPhase === 'vehicle_selection' && (
          <View>
            <ThemedText type="subtitle">Choose your ride</ThemedText>
            {etaMinutes && (
              <ThemedText style={styles.etaText}>Estimated trip time: {etaMinutes} min</ThemedText>
            )}
            <TouchableOpacity
              disabled={!destinationLocation || !hasNearbyDrivers}
              style={[styles.mainActionBtn, { backgroundColor: destinationLocation && hasNearbyDrivers ? activeColor : '#ccc', marginTop: 20 }]}
              onPress={handleSearchForDriver}
            >
              <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Confirm Ride</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {searchPhase === 'tracking' && currentDriver && (
          <View>
            <ThemedText type="subtitle">Driver on the way</ThemedText>
            <ThemedText style={styles.driverMeta}>Driver: {currentDriver.name || 'Assigned driver'}</ThemedText>
            <ThemedText style={styles.driverMeta}>ETA: {currentDriver.eta_minutes ?? etaMinutes ?? 5} min</ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  floatingHeader: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  backButton: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  headerCenter: { flex: 1, marginHorizontal: 15, height: 45, borderRadius: 22.5, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, elevation: 5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50', marginRight: 10 },
  destinationTextInput: { flex: 1, fontSize: 14, fontWeight: '500' },
  suggestionsContainer: { position: 'absolute', top: 110, left: 20, right: 20, borderRadius: 15, padding: 10, elevation: 5, zIndex: 100 },
  suggestionItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.1)' },
  suggestionText: { fontSize: 14 },
  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, paddingBottom: 40, elevation: 20 },
  handle: { width: 40, height: 4, backgroundColor: 'rgba(128,128,128,0.2)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modeSwitchRow: { flexDirection: 'row', marginBottom: 15 },
  modeSwitchButton: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 15, marginRight: 10, backgroundColor: '#f0f0f0' },
  modeSwitchButtonActive: { backgroundColor: '#4CAF50' },
  modeSwitchText: { fontSize: 14, fontWeight: '600' },
  modeSwitchTextActive: { color: '#fff' },
  etaText: { marginTop: 8, fontSize: 12, color: '#666' },
  driverMeta: { marginTop: 8, color: '#666', fontSize: 13 },
  mainActionBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
});
