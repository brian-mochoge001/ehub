import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, MapPin, Star, Phone, MessageCircle, Navigation2, Search, X } from 'lucide-react-native';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import TaxiMap from '@/components/TaxiMap';
import { api } from '@/services/api';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import polyline from '@mapbox/polyline';

const MOCK_LOCATION_SUGGESTIONS = [
  { addressText: "Westlands, Nairobi, Kenya", latitude: -1.2988, longitude: 36.7786 },
  { addressText: "Nairobi CBD, Kenya", latitude: -1.2833, longitude: 36.8167 },
  { addressText: "Upper Hill, Nairobi, Kenya", latitude: -1.2996, longitude: 36.8091 },
  { addressText: "Karen, Nairobi, Kenya", latitude: -1.3175, longitude: 36.7032 },
];

export default function TaxiScreen() {
  const [driverId, setDriverId] = useState<string | undefined>(undefined);
  const [searchPhase, setSearchPhase] = useState<'vehicle_selection' | 'driver_searching' | 'tracking'>('vehicle_selection');
  const [selectedMode, setSelectedMode] = useState<'taxi' | 'motorbike'>('taxi');
  const [pickupLocation, setPickupLocation] = useState<{ latitude: number; longitude: number; addressText: string } | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<{ addressText: string; latitude: number; longitude: number } | null>(null);
  const [nearbyDrivers, setNearbyDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [destinationSearchInput, setDestinationSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
  const [encodedPolyline, setEncodedPolyline] = useState<string | undefined>(undefined);

  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;

  const normalizeNearbyDrivers = (drivers: any[]) => {
    return (drivers || [])
      .map((entry: any) => {
        const driver = entry?.driver ?? entry;
        if (!driver || !driver.id) return null;

        const latitude = Number(driver.latitude ?? driver.lat ?? driver.last_location?.latitude ?? driver.last_location?.lat);
        const longitude = Number(driver.longitude ?? driver.lng ?? driver.last_location?.longitude ?? driver.last_location?.lng);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

        return {
          ...driver,
          latitude,
          longitude,
          eta_minutes: entry?.eta_minutes ?? driver?.eta_minutes ?? null,
        };
      })
      .filter(Boolean);
  };

  const fetchNearby = useCallback(async (latitude: number, longitude: number) => {
    try {
        const drivers = await api.getNearbyDrivers(longitude, latitude, 5, 5000);
        setNearbyDrivers(normalizeNearbyDrivers(drivers));
    } catch (err) {
        console.error('Failed to fetch nearby drivers:', err);
        setNearbyDrivers([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Permission to access location was denied. Using default location.');
          const defaultLoc = { latitude: -1.286389, longitude: 36.817223, addressText: "Nairobi (Default)" };
          setPickupLocation(defaultLoc);
          fetchNearby(defaultLoc.latitude, defaultLoc.longitude);
          return;
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const currentLoc = { 
          latitude: location.coords.latitude, 
          longitude: location.coords.longitude, 
          addressText: "Your Current Location" 
        };
        setPickupLocation(currentLoc);
        fetchNearby(currentLoc.latitude, currentLoc.longitude);
      } catch (err) {
        console.error('Error getting location:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchNearby]);

  // Fetch preview route whenever destination changes
  useEffect(() => {
    if (!destinationLocation || !pickupLocation) {
      setEncodedPolyline(undefined);
      return;
    }

    const fetchPreviewRoute = async () => {
      try {
        const response = await api.getFoodDeliveryEstimate({
          latitude: destinationLocation.latitude,
          longitude: destinationLocation.longitude,
          radius: 5000
        });
        if (response.polyline) {
          setEncodedPolyline(response.polyline);
        }
      } catch (err) {
        console.error('Failed to fetch preview route:', err);
      }
    };

    fetchPreviewRoute();
  }, [destinationLocation, pickupLocation]);

  const handleSearchForDriver = async () => {
    if (!destinationLocation || !pickupLocation) return;
    if (nearbyDrivers.length === 0) {
      Alert.alert('No drivers available', 'There are no drivers online in your area right now.');
      return;
    }
    setSearchPhase('driver_searching');
    try {
        // Create trip request
        const response = await api.createTaxiTrip({
            pickup_lng: pickupLocation.longitude,
            pickup_lat: pickupLocation.latitude,
            dropoff_lng: destinationLocation.longitude,
            dropoff_lat: destinationLocation.latitude,
            amount: 500.00, // Placeholder
            vehicle_type: selectedMode,
        });
        
        if (response.polyline) {
          setEncodedPolyline(response.polyline);
        }

        // Polling logic would go here. For now, simulate assignment.
        setTimeout(() => {
          if (nearbyDrivers.length > 0) {
              setDriverId(nearbyDrivers[0].id);
              setSearchPhase('tracking');
          } else {
              Alert.alert('No drivers assigned');
              setSearchPhase('vehicle_selection');
          }
        }, 3000);
    } catch (err) {
        console.error(err);
        setSearchPhase('vehicle_selection');
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={activeColor} />
        <ThemedText style={{ marginTop: 10 }}>Getting your location...</ThemedText>
      </ThemedView>
    );
  }

  const currentDriver = nearbyDrivers.find(d => d.id === driverId);
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
            placeholder={destinationLocation ? destinationLocation.addressText : "Where to?"}
            value={destinationSearchInput}
            onChangeText={(text) => {
                setDestinationSearchInput(text);
                if (text.trim() !== '') {
                  setFilteredSuggestions(MOCK_LOCATION_SUGGESTIONS.filter(s => s.addressText.toLowerCase().includes(text.toLowerCase())));
                  setShowSuggestions(true);
                } else {
                  setShowSuggestions(false);
                }
              }}
          />
        </View>
        <TouchableOpacity style={styles.backButton} onPress={() => { setDestinationLocation(null); setDestinationSearchInput(''); }}>
           <X size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <View style={[styles.suggestionsContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
          {filteredSuggestions.map((suggestion, index) => (
            <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => { setDestinationLocation(suggestion); setDestinationSearchInput(suggestion.addressText); setShowSuggestions(false); }}>
              <ThemedText style={styles.suggestionText}>{suggestion.addressText}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={[styles.bottomSheet, { backgroundColor: colorScheme === 'light' ? '#fff' : '#1a1a1a' }]}>
        <View style={styles.handle} />
        <View style={styles.modeSwitchRow}>
          <TouchableOpacity
            style={[styles.modeSwitchButton, selectedMode === 'taxi' ? styles.modeSwitchButtonActive : null]}
            onPress={() => setSelectedMode('taxi')}
          >
            <ThemedText style={[styles.modeSwitchText, selectedMode === 'taxi' ? styles.modeSwitchTextActive : null]}>Taxi</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeSwitchButton, selectedMode === 'motorbike' ? styles.modeSwitchButtonActive : null]}
            onPress={() => setSelectedMode('motorbike')}
          >
            <ThemedText style={[styles.modeSwitchText, selectedMode === 'motorbike' ? styles.modeSwitchTextActive : null]}>Motorbike</ThemedText>
          </TouchableOpacity>
        </View>
        {searchPhase === 'vehicle_selection' && (
          <View>
            <ThemedText type="subtitle">Choose your ride</ThemedText>
            {!hasNearbyDrivers ? (
              <View style={styles.emptyStateCard}>
                <ThemedText style={{ fontWeight: '600' }}>No drivers available right now</ThemedText>
                <ThemedText style={styles.emptyStateSubtitle}>Try again in a few minutes or adjust your pickup area.</ThemedText>
              </View>
            ) : null}
            <TouchableOpacity 
                disabled={!destinationLocation || !hasNearbyDrivers}
                style={[styles.mainActionBtn, { backgroundColor: destinationLocation && hasNearbyDrivers ? activeColor : '#ccc', marginTop: 20 }]} 
                onPress={handleSearchForDriver}
            >
              <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Confirm Ride</ThemedText>
            </TouchableOpacity>
          </View>
        )}
        {searchPhase === 'driver_searching' && (
            <View style={{ alignItems: 'center', padding: 20 }}>
                <ActivityIndicator size="large" color={activeColor} />
                <ThemedText style={{ marginTop: 15 }}>Searching for nearby drivers...</ThemedText>
            </View>
        )}
        {searchPhase === 'tracking' && currentDriver && (
          <View style={{ gap: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
               <View>
                  <ThemedText type="defaultSemiBold">{currentDriver.name}</ThemedText>
                  <ThemedText style={{ opacity: 0.6 }}>{currentDriver.plate || 'No Plate'} • {currentDriver.vehicle_model || 'Standard'}</ThemedText>
               </View>
               <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]}><Phone size={20} color="#fff" /></TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setSearchPhase('vehicle_selection')}><ThemedText style={{ color: '#FF6347', textAlign: 'center' }}>Cancel Ride</ThemedText></TouchableOpacity>
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
  modeSwitchRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  modeSwitchButton: { flex: 1, paddingVertical: 12, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
  modeSwitchButtonActive: { backgroundColor: '#4CAF50' },
  modeSwitchText: { fontSize: 14, fontWeight: '600' },
  modeSwitchTextActive: { color: '#fff' },
  mainActionBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  actionBtn: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  emptyStateCard: { marginTop: 12, padding: 14, borderRadius: 12, backgroundColor: 'rgba(128,128,128,0.08)' },
  emptyStateSubtitle: { marginTop: 6, opacity: 0.65, fontSize: 12 },
});
