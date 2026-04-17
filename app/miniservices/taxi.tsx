import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ArrowLeft, MapPin, Clock, Star, Shield, Phone, MessageCircle, Navigation2, Info } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import TaxiMap from '@/components/TaxiMap';
import { api } from '@/services/api';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const SIM_DRIVERS = [
  { id: 'driver-001', name: 'James Wilson', vehicle: 'Toyota Prius', plate: 'KDC 123X', rating: 4.8 },
  { id: 'driver-002', name: 'Sarah Miller', vehicle: 'Tesla Model 3', plate: 'KBB 456Y', rating: 4.9 },
  { id: 'driver-003', name: 'Mike Ross', vehicle: 'Honda Civic', plate: 'KAA 789Z', rating: 4.7 },
];

export default function TaxiScreen() {
  const [driverId, setDriverId] = useState<string | undefined>(undefined);
  const [isSimulating, setIsSimulating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'searching' | 'tracking'>('idle');
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';

  // Multi-Driver Simulation: Move all drivers randomly
  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      // Initialize drivers in DB
      SIM_DRIVERS.forEach(d => {
        api.createDriver(d.id, d.name).catch(() => {});
      });

      // Simulation base (Nairobi center)
      const baseLat = -1.286389;
      const baseLng = 36.817223;
      
      // Keep track of positions locally for smooth simulation
      const driverPositions = SIM_DRIVERS.map(() => ({
        lat: baseLat + (Math.random() - 0.5) * 0.01,
        lng: baseLng + (Math.random() - 0.5) * 0.01,
      }));

      interval = setInterval(() => {
        SIM_DRIVERS.forEach((d, i) => {
          driverPositions[i].lat += (Math.random() - 0.5) * 0.001;
          driverPositions[i].lng += (Math.random() - 0.5) * 0.001;
          api.updateLocation(d.id, driverPositions[i].lng, driverPositions[i].lat).catch(console.error);
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleRequestRide = () => {
    setStatus('searching');
    setIsSimulating(true);
    // Simulate finding a driver after 3 seconds
    setTimeout(() => {
      setDriverId(SIM_DRIVERS[0].id);
      setStatus('tracking');
    }, 3000);
  };

  const currentDriver = SIM_DRIVERS.find(d => d.id === driverId);

  return (
    <ThemedView style={styles.container}>
      {/* Map View - Full Screen Background */}
      <View style={styles.mapBackground}>
        <TaxiMap 
          driverId={driverId} 
          showNearby={status !== 'tracking'} 
        />
      </View>

      {/* Floating Header */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <View style={[styles.headerCenter, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
          <View style={styles.dot} />
          <ThemedText style={styles.headerText} numberOfLines={1}>
            {status === 'idle' ? "Where to?" : "Picking up at Home"}
          </ThemedText>
        </View>
        <TouchableOpacity 
          style={[styles.backButton, isSimulating && { backgroundColor: '#FFD700' }]}
          onPress={() => setIsSimulating(!isSimulating)}
        >
          <Navigation2 size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet UI */}
      <View style={[styles.bottomSheet, { backgroundColor: colorScheme === 'light' ? '#fff' : '#1a1a1a' }]}>
        <View style={styles.handle} />
        
        {status === 'idle' && (
          <View style={styles.idleContent}>
            <ThemedText type="subtitle" style={styles.sheetTitle}>Ready for a ride?</ThemedText>
            <ThemedText style={styles.sheetSubtitle}>Nearby drivers are ready to pick you up.</ThemedText>
            <TouchableOpacity 
              style={[styles.mainActionBtn, { backgroundColor: Colors[colorScheme].tint }]}
              onPress={handleRequestRide}
            >
              <ThemedText style={styles.mainActionBtnText}>Request eHub Go</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {status === 'searching' && (
          <View style={styles.searchingContent}>
            <View style={[styles.loadingSpinner, { borderTopColor: Colors[colorScheme].tint }]} />
            <ThemedText type="subtitle" style={styles.sheetTitle}>Finding nearest driver...</ThemedText>
            <ThemedText style={styles.sheetSubtitle}>Using PostGIS ST_Distance to match you.</ThemedText>
          </View>
        )}

        {status === 'tracking' && currentDriver && (
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
                <ThemedText style={styles.vehicleModel}>{currentDriver.vehicle}</ThemedText>
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

            <TouchableOpacity style={[styles.cancelBtn]} onPress={() => setStatus('idle')}>
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
  idleContent: { paddingVertical: 10 },
  searchingContent: { paddingVertical: 40, alignItems: 'center' },
  loadingSpinner: { width: 40, height: 40, borderRadius: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: 'transparent', marginBottom: 20 },
  sheetTitle: { fontSize: 20, marginBottom: 5 },
  sheetSubtitle: { fontSize: 14, opacity: 0.6, marginBottom: 25 },
  mainActionBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  mainActionBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  driverInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  driverProfile: { flexDirection: 'row', alignItems: 'center' },
  driverAvatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  driverDetails: { justifyContent: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { fontSize: 12, marginLeft: 4, opacity: 0.6 },
  vehicleInfo: { alignItems: 'flex-end' },
  vehiclePlate: { fontSize: 16, fontWeight: 'bold' },
  vehicleModel: { fontSize: 12, opacity: 0.6 },
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
});
