import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput } from 'react-native';
import { ArrowLeft, MapPin, Clock, Star, Shield, Phone, MessageCircle, Navigation2, Info, Car, Motorcycle, Search, Truck, X } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import TaxiMap from '@/components/TaxiMap';
import { api } from '@/services/api';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const SIM_VEHICLE_TYPES = [
  { id: 'vtype-001', name: 'Standard', description: 'Affordable everyday rides', icon: 'Car', passenger_capacity: 4 },
  { id: 'vtype-002', name: 'Premium', description: 'Luxury cars for comfort', icon: 'Car', passenger_capacity: 4 },
  { id: 'vtype-003', name: 'XL', description: 'Minivans for larger groups', icon: 'Truck', passenger_capacity: 6 },
  { id: 'vtype-004', name: 'Motorcycle', description: 'Quick rides through traffic', icon: 'Motorcycle', passenger_capacity: 1 },
];

const SIM_DRIVERS = [
  { 
    id: 'driver-001', 
    name: 'James Wilson', 
    vehicle_make: 'Toyota', 
    vehicle_model: 'Prius', 
    vehicle_color: 'White',
    vehicle_condition: 'good',
    vehicle_type: 'Normal Car',
    passenger_capacity: 4,
    plate: 'KDC 123X', 
    rating: 4.8,
    status: 'online',
    last_location: { latitude: -1.286389 + (Math.random() - 0.5) * 0.01, longitude: 36.817223 + (Math.random() - 0.5) * 0.01 },
  },
  { 
    id: 'driver-002', 
    name: 'Sarah Miller', 
    vehicle_make: 'Tesla', 
    vehicle_model: 'Model 3', 
    vehicle_color: 'Black',
    vehicle_condition: 'new',
    vehicle_type: 'Electric Car',
    passenger_capacity: 4,
    plate: 'KBB 456Y', 
    rating: 4.9,
    status: 'online',
    last_location: { latitude: -1.286389 + (Math.random() - 0.5) * 0.01, longitude: 36.817223 + (Math.random() - 0.5) * 0.01 },
  },
  { 
    id: 'driver-003', 
    name: 'Mike Ross', 
    vehicle_make: 'Honda', 
    vehicle_model: 'Civic', 
    vehicle_color: 'Silver',
    vehicle_condition: 'fair',
    vehicle_type: 'Normal Car',
    passenger_capacity: 4,
    plate: 'KAA 789Z', 
    rating: 4.7,
    status: 'busy',
    last_location: { latitude: -1.286389 + (Math.random() - 0.5) * 0.01, longitude: 36.817223 + (Math.random() - 0.5) * 0.01 },
  },
];

const MOCK_LOCATION_SUGGESTIONS = [
  { addressText: "Westlands, Nairobi, Kenya", latitude: -1.2988, longitude: 36.7786 },
  { addressText: "Nairobi CBD, Kenya", latitude: -1.2833, longitude: 36.8167 },
  { addressText: "Upper Hill, Nairobi, Kenya", latitude: -1.2996, longitude: 36.8091 },
  { addressText: "Kilimani, Nairobi, Kenya", latitude: -1.2967, longitude: 36.7909 },
  { addressText: "Karen, Nairobi, Kenya", latitude: -1.3175, longitude: 36.7032 },
  { addressText: "Mombasa Road, Nairobi, Kenya", latitude: -1.3101, longitude: 36.8770 },
  { addressText: "Thika Road, Nairobi, Kenya", latitude: -1.2000, longitude: 36.9000 },
  { addressText: "Ngong Road, Nairobi, Kenya", latitude: -1.3000, longitude: 36.7500 },
  { addressText: "Ronald Ngala Street, Nairobi, Kenya", latitude: -1.2828, longitude: 36.8288 },
  { addressText: "Kenyatta Avenue, Nairobi, Kenya", latitude: -1.2858, longitude: 36.8192 },
  { addressText: "Tom Mboya Street, Nairobi, Kenya", latitude: -1.2809, longitude: 36.8272 },
];

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Car': return Car;
    case 'Truck': return Truck;
    case 'Motorcycle': return Motorcycle;
    default: return null;
  }
};

export default function TaxiScreen() {
  const [driverId, setDriverId] = useState<string | undefined>(undefined);
  const [searchPhase, setSearchPhase] = useState<'vehicle_selection' | 'driver_searching' | 'tracking'>('vehicle_selection');
  const [pickupLocation, setPickupLocation] = useState<{ latitude: number; longitude: number; addressText: string }>({
    latitude: -1.286389, // Mock current location
    longitude: 36.817223, // Mock current location
    addressText: "Your Current Location"
  });
  const [destinationLocation, setDestinationLocation] = useState<{ latitude: number; longitude: number; addressText: string } | null>(null);
  const [selectedVehicleTypeId, setSelectedVehicleTypeId] = useState<string | null>(null);
  const [destinationSearchInput, setDestinationSearchInput] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Array<{ addressText: string; latitude: number; longitude: number }>>([]);


  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';

  // Multi-Driver Simulation: Move all drivers randomly
  useEffect(() => {
    let interval: any;
    if (searchPhase === 'driver_searching' || searchPhase === 'tracking') {
      // Initialize drivers in DB (mock API call)
      SIM_DRIVERS.forEach(d => {
        api.createDriver(d.id, d.name).catch(() => {});
      });

      // Simulation base (Nairobi center)
      const baseLat = -1.286389;
      const baseLng = 36.817223;
      
      // Keep track of positions locally for smooth simulation
      const driverPositions = SIM_DRIVERS.map(d => ({
        id: d.id,
        lat: d.last_location.latitude,
        lng: d.last_location.longitude,
      }));

      interval = setInterval(() => {
        driverPositions.forEach((d, i) => {
          d.lat += (Math.random() - 0.5) * 0.001;
          d.lng += (Math.random() - 0.5) * 0.001;
          api.updateLocation(d.id, d.lng, d.lat).catch(console.error);
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [searchPhase]);

  const handleSearchForDriver = () => {
    if (!pickupLocation || !destinationLocation || !selectedVehicleTypeId) {
      alert('Please set your destination and select a vehicle type.');
      return;
    }
    setSearchPhase('driver_searching');
    // Simulate finding a driver after 3 seconds
    setTimeout(() => {
      // In a real app, this would involve filtering SIM_DRIVERS by vehicleType and availability
      const availableDrivers = SIM_DRIVERS.filter(d => 
        d.vehicle_type === SIM_VEHICLE_TYPES.find(vt => vt.id === selectedVehicleTypeId)?.name && d.status === 'online'
      );
      if (availableDrivers.length > 0) {
        setDriverId(availableDrivers[0].id);
        setSearchPhase('tracking');
      } else {
        // Handle no drivers found
        setSearchPhase('vehicle_selection'); // Return to vehicle selection if no driver found
        alert('No drivers found for your selected vehicle type. Please try again or choose another vehicle type.');
      }
    }, 3000);
  };

  const currentDriver = SIM_DRIVERS.find(d => d.id === driverId);

  return (
    <ThemedView style={styles.container}>
      {/* Map View - Full Screen Background */}
      <View style={styles.mapBackground}>
        <TaxiMap 
          driverId={driverId} 
          showNearby={searchPhase !== 'tracking'} 
          pickupLocation={pickupLocation}
          destinationLocation={destinationLocation}
        />
      </View>

      {/* Floating Header (Destination Search Bar) */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <View style={[styles.headerCenter, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
          <View style={styles.dot} />
          <TextInput
            style={[styles.destinationTextInput, { color: Colors[colorScheme].text }]}
            placeholder={destinationLocation ? destinationLocation.addressText : "Where to?"}
            placeholderTextColor="#888"
            value={destinationSearchInput}
            onChangeText={(text) => {
              setDestinationSearchInput(text);
              if (text.trim() !== '') {
                setFilteredSuggestions(
                  MOCK_LOCATION_SUGGESTIONS.filter(s =>
                    s.addressText.toLowerCase().includes(text.toLowerCase())
                  ).sort((a, b) => a.addressText.localeCompare(b.addressText))
                );
                setShowSuggestions(true);
              } else {
                setFilteredSuggestions([]);
                setShowSuggestions(false);
              }
            }}
            onFocus={() => {
              if (destinationSearchInput.trim() !== '') {
                setFilteredSuggestions(
                  MOCK_LOCATION_SUGGESTIONS.filter(s =>
                    s.addressText.toLowerCase().includes(destinationSearchInput.toLowerCase())
                  ).sort((a, b) => a.addressText.localeCompare(b.addressText))
                );
                setShowSuggestions(true);
              }
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          />
        </View>
        <TouchableOpacity 
          style={[styles.backButton, searchPhase === 'tracking' && { backgroundColor: Colors[colorScheme].tint }]}
          onPress={() => {
            if (searchPhase === 'tracking') {
              setSearchPhase('vehicle_selection');
              setDriverId(undefined);
              setDestinationLocation(null);
              setSelectedVehicleTypeId(null);
            } else if (destinationLocation) {
              setDestinationLocation(null);
              setDestinationSearchInput('');
            } else {
              // Maybe a refresh drivers button or something else later
            }
          }}
        >
          {searchPhase === 'tracking' ? <Navigation2 size={24} color="#fff" /> : (destinationLocation ? <X size={24} color={Colors[colorScheme].text} /> : <Search size={24} color={Colors[colorScheme].text} />)}
        </TouchableOpacity>
      </View>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <View style={[styles.suggestionsContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
          {filteredSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                setDestinationLocation(suggestion);
                setDestinationSearchInput(suggestion.addressText); // Set input text to full suggestion
                setShowSuggestions(false);
                setFilteredSuggestions([]);
              }}
            >
              <ThemedText style={styles.suggestionText}>{suggestion.addressText}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Bottom Sheet UI */}
      <View style={[styles.bottomSheet, { backgroundColor: colorScheme === 'light' ? '#fff' : '#1a1a1a' }]}>
        <View style={styles.handle} />
        

        {searchPhase === 'vehicle_selection' && (
          <View style={styles.vehicleSelectionContent}>
            <ThemedText type="subtitle" style={styles.sheetTitle}>Choose your ride</ThemedText>
            <ThemedText style={styles.sheetSubtitle}>Pickup at: {pickupLocation.addressText}</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vehicleTypeContainer}>
              {SIM_VEHICLE_TYPES.map(type => {
                const Icon = getIconComponent(type.icon);
                const isSelected = selectedVehicleTypeId === type.id;
                return (
                  <TouchableOpacity 
                    key={type.id} 
                    style={[
                      styles.vehicleTypeCard, 
                      { 
                        backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#2a2a2a',
                        borderColor: isSelected ? Colors[colorScheme].tint : 'transparent',
                        borderWidth: isSelected ? 2 : 0,
                      }
                    ]}
                    onPress={() => setSelectedVehicleTypeId(type.id)}
                  >
                    {Icon && <Icon size={30} color={isSelected ? Colors[colorScheme].tint : Colors[colorScheme].text} />}
                    <ThemedText style={styles.vehicleTypeName}>{type.name}</ThemedText>
                    <ThemedText style={styles.vehicleTypeCapacity}>{type.passenger_capacity} seats</ThemedText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            {(selectedVehicleTypeId && destinationLocation) ? (
              <TouchableOpacity 
                style={[styles.mainActionBtn, { backgroundColor: Colors[colorScheme].tint, marginTop: 20 }]}
                onPress={handleSearchForDriver}
              >
                <ThemedText style={styles.mainActionBtnText}>Confirm Ride</ThemedText>
              </TouchableOpacity>
            ) : (
              <ThemedText style={styles.selectionPrompt}>
                { !destinationLocation ? "Please select your destination." : "Please select a vehicle type." }
              </ThemedText>
            )}
          </View>
        )}

        {searchPhase === 'driver_searching' && (
          <View style={styles.searchingContent}>
            <View style={[styles.loadingSpinner, { borderTopColor: Colors[colorScheme].tint }]} />
            <ThemedText type="subtitle" style={styles.sheetTitle}>Finding nearest driver...</ThemedText>
            <ThemedText style={styles.sheetSubtitle}>Looking for a {SIM_VEHICLE_TYPES.find(vt => vt.id === selectedVehicleTypeId)?.name} driver near you.</ThemedText>
          </View>
        )}

        {searchPhase === 'tracking' && currentDriver && (
          <>
            <View style={styles.driverInfo}>
              <View style={styles.driverProfile}>
                <View style={[styles.driverAvatar, { backgroundColor: Colors[colorScheme].tint + '20' }]}>
                  <Navigation2 size={24} color={Colors[colorScheme].tint} />
                </View>
                <View style={styles.driverDetails}>
                  <ThemedText type="defaultSemiBold">{currentDriver.name}</ThemedText>
                  <View style={styles.ratingRow}>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                    <ThemedText style={styles.ratingText}>{currentDriver.rating} (1,200+ rides)</ThemedText>
                  </View>
                </View>
              </View>
              <View style={styles.vehicleInfo}>
                <ThemedText style={styles.vehiclePlate}>{currentDriver.plate}</ThemedText>
                <ThemedText style={styles.vehicleModel}>{currentDriver.vehicle_color} {currentDriver.vehicle_make} {currentDriver.vehicle_model}</ThemedText>
                <ThemedText style={styles.vehicleDetails}>{currentDriver.vehicle_type} • {currentDriver.passenger_capacity} seats</ThemedText>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.rideStatus}>
              <View style={styles.statusItem}>
                <Clock size={20} color={Colors[colorScheme].tint} />
                <View style={styles.statusTextContainer}>
                  <ThemedText style={styles.statusLabel}>Arrival in</ThemedText>
                  <ThemedText style={styles.statusValue}>4 mins</ThemedText>
                </View>
              </View>
              <View style={styles.statusItem}>
                <MapPin size={20} color="#FF6347" />
                <View style={styles.statusTextContainer}>
                  <ThemedText style={styles.statusLabel}>Distance</ThemedText>
                  <ThemedText style={styles.statusValue}>1.2 km</ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]}>
                <Phone size={20} color="#fff" />
                <ThemedText style={styles.actionBtnText}>Call</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors[colorScheme].tint }]}>
                <MessageCircle size={20} color="#fff" />
                <ThemedText style={styles.actionBtnText}>Chat</ThemedText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.safetyInfo}>
              <Shield size={16} color="#4CAF50" />
              <ThemedText style={styles.safetyText}>Safety features active for this ride</ThemedText>
              <Info size={14} color="#888" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cancelBtn]} onPress={() => setSearchPhase('vehicle_selection')}>
              <ThemedText style={styles.cancelText}>Cancel Ride</ThemedText>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  floatingHeader: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  backButton: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowOpacity: 0.2, shadowRadius: 5 },
  headerCenter: { flex: 1, marginHorizontal: 15, height: 45, borderRadius: 22.5, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, elevation: 5, shadowOpacity: 0.1, shadowRadius: 5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50', marginRight: 10 },
  headerText: { fontSize: 14, fontWeight: '500' },
  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, paddingBottom: 40, elevation: 20, shadowOpacity: 0.3, shadowRadius: 15 },
  handle: { width: 40, height: 4, backgroundColor: 'rgba(128,128,128,0.2)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  searchingContent: { paddingVertical: 40, alignItems: 'center' },
  loadingSpinner: { width: 40, height: 40, borderRadius: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: 'transparent', marginBottom: 20 },
  sheetTitle: { fontSize: 20, marginBottom: 5 },
  sheetSubtitle: { fontSize: 14, opacity: 0.6, marginBottom: 25 },
  mainActionBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  mainActionBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  searchAddressInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, marginTop: 15, borderWidth: 1 },
  searchInputText: { flex: 1, marginLeft: 10, fontSize: 16, opacity: 0.6 },
  vehicleSelectionContent: { paddingVertical: 10 },
  vehicleTypeContainer: { paddingVertical: 10 },
  vehicleTypeCard: {
    width: 120, // Adjust as needed
    height: 120, // Adjust as needed
    borderRadius: 15,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  vehicleTypeName: { fontSize: 14, fontWeight: 'bold', marginTop: 8 },
  vehicleTypeCapacity: { fontSize: 12, opacity: 0.6, marginTop: 4 },
  driverInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  driverProfile: { flexDirection: 'row', alignItems: 'center' },
  driverAvatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  driverDetails: { justifyContent: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { fontSize: 12, marginLeft: 4, opacity: 0.6 },
  vehicleInfo: { alignItems: 'flex-end' },
  vehiclePlate: { fontSize: 16, fontWeight: 'bold' },
  vehicleModel: { fontSize: 12, opacity: 0.6 },
  vehicleDetails: { fontSize: 12, opacity: 0.6, marginTop: 2 },
  divider: { height: 1, backgroundColor: 'rgba(128,128,128,0.1)', marginBottom: 20 },
  rideStatus: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statusItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statusTextContainer: { marginLeft: 12 },
  statusLabel: { fontSize: 12, opacity: 0.5 },
  statusValue: { fontSize: 16, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  actionBtn: { flex: 1, height: 50, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 5 },
  actionBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
  safetyInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, backgroundColor: 'rgba(76, 175, 80, 0.05)', marginBottom: 20 },
  safetyText: { fontSize: 12, color: '#4CAF50', marginHorizontal: 8 },
  cancelBtn: { alignItems: 'center', paddingVertical: 10 },
  cancelText: { color: '#FF6347', fontWeight: '600', fontSize: 14 },
  selectionPrompt: { textAlign: 'center', marginTop: 20, fontSize: 14, opacity: 0.7 },
  destinationTextInput: { flex: 1, fontSize: 14, fontWeight: '500' },
  suggestionsContainer: {
    position: 'absolute',
    top: 110, // Adjust to be below the floating header
    left: 20,
    right: 20,
    borderRadius: 10,
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    maxHeight: 200, // Limit height of dropdown
    zIndex: 100, // Ensure it's above other elements
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.1)',
  },
  suggestionText: {
    fontSize: 14,
  },
});